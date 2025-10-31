import { GoogleAuth } from "google-auth-library";

function jsonResponse(res, statusCode, body, extraHeaders = {}) {
  res.status(statusCode).setHeader("Content-Type", "application/json");
  Object.entries(extraHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.send(JSON.stringify(body));
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_LOCATION = process.env.GCP_LOCATION || "us-central1";
const VERTEX_INDEX_ENDPOINT_ID = process.env.VERTEX_INDEX_ENDPOINT_ID;
const VERTEX_EMBED_DIM = Number(process.env.VERTEX_EMBED_DIM || "768");
const GCP_SERVICE_ACCOUNT_JSON = process.env.GCP_SERVICE_ACCOUNT_JSON;

async function embedQuery(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: { parts: [{ text }] } }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini embed error: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values)) throw new Error("Invalid embedding response");
  if (values.length !== VERTEX_EMBED_DIM) {
    throw new Error(
      `Embedding dimension mismatch: got ${values.length}, expected ${VERTEX_EMBED_DIM}`,
    );
  }
  return values;
}

async function loadMapping() {
  try {
    const mapping = await import("../src/data/semantic-mapping.json", {
      with: { type: "json" },
    });
    if (!Array.isArray(mapping.default)) return [];
    return mapping.default;
  } catch {
    return [];
  }
}

async function loadEmbeddings() {
  try {
    const embeddings = await import("../src/data/semantic-embeddings.json", {
      with: { type: "json" },
    });
    if (!Array.isArray(embeddings.default)) return [];
    return embeddings.default;
  } catch {
    return [];
  }
}

function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    const va = a[i] || 0;
    const vb = b[i] || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function lexicalResults(mapping, q, topK) {
  const queryTokens = tokenize(q);
  if (queryTokens.length === 0) {
    return mapping.slice(0, topK).map((meta) => ({
      id: meta.id,
      title: meta.title,
      url: meta.url,
      excerpt: meta.excerpt,
      score: 0,
    }));
  }

  const scored = mapping.map((meta) => {
    const combined = `${meta.title || ""} ${meta.excerpt || ""}`;
    const docTokens = tokenize(combined);
    const docSet = new Set(docTokens);
    const score = queryTokens.reduce(
      (acc, token) =>
        acc +
        (docSet.has(token) ||
        (meta.title || "").toLowerCase().includes(token) ||
        (meta.excerpt || "").toLowerCase().includes(token)
          ? 1
          : 0),
      0,
    );
    return {
      id: meta.id,
      title: meta.title,
      url: meta.url,
      excerpt: meta.excerpt,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.slice(0, topK);
}

function mergeWithLexical(primary, lexical, topK) {
  const seen = new Set();
  const merged = [];

  primary.forEach((item) => {
    if (item && item.id && !seen.has(item.id) && merged.length < topK) {
      merged.push(item);
      seen.add(item.id);
    }
  });

  for (const item of lexical) {
    if (merged.length >= topK) break;
    if (item && item.id && !seen.has(item.id)) {
      merged.push(item);
      seen.add(item.id);
    }
  }

  return merged;
}

export default async function handler(req, res) {
  const started = Date.now();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    jsonResponse(res, 405, { error: "Method Not Allowed" });
    return;
  }

  let payload = req.body;
  if (!payload || typeof payload !== "object") {
    try {
      payload = JSON.parse(req.body || "{}");
    } catch {
      jsonResponse(res, 400, { error: "Invalid JSON body" });
      return;
    }
  }

  const q = (payload?.q || "").toString().trim();
  const topK = Math.max(1, Math.min(10, Number(payload?.topK || 5)));
  if (!q) {
    jsonResponse(res, 400, { error: "q is required" });
    return;
  }

  try {
    const mapping = await loadMapping();
    const byId = new Map(mapping.map((m) => [m.id, m]));

    let queryEmbedding = null;
    let hadSemantic = false;

    if (GEMINI_API_KEY) {
      try {
        queryEmbedding = await embedQuery(q);
        hadSemantic = true;
      } catch (err) {
        console.log(
          "Gemini embedding failed, falling back to lexical:",
          err.message,
        );
      }
    }

    if (
      hadSemantic &&
      GCP_PROJECT_ID &&
      GCP_SERVICE_ACCOUNT_JSON &&
      VERTEX_INDEX_ENDPOINT_ID
    ) {
      try {
        const credentials = JSON.parse(GCP_SERVICE_ACCOUNT_JSON);
        const auth = new GoogleAuth({
          credentials,
          scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });
        const accessToken = await auth.getAccessToken();
        const endpointUrl = `https://${GCP_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}/indexEndpoints/${VERTEX_INDEX_ENDPOINT_ID}:findNeighbors`;
        const restBody = {
          deployedIndexId: process.env.VERTEX_DEPLOYED_INDEX_ID || undefined,
          queries: [
            {
              datapoint: { featureVector: queryEmbedding },
              neighborCount: topK,
            },
          ],
        };
        const resp = await fetch(endpointUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(restBody),
        });
        if (resp.ok) {
          const response = await resp.json();
          const neighbors = response?.nearestNeighbors?.[0]?.neighbors || [];
          const results = neighbors.map((n) => {
            const id = n?.datapoint?.datapointId;
            const score = n?.distance || 0;
            const meta = byId.get(id) || {
              id,
              title: id,
              url: `/blog/${id}`,
              excerpt: "",
            };
            return {
              id,
              title: meta.title,
              url: meta.url,
              excerpt: meta.excerpt,
              score,
            };
          });
          const lexical = lexicalResults(mapping, q, topK);
          const merged = mergeWithLexical(results, lexical, topK);
          const provider =
            merged.length > results.length ? "vertex+lexical" : "vertex";
          jsonResponse(res, 200, {
            results: merged,
            tookMs: Date.now() - started,
            provider,
          });
          return;
        }
      } catch (err) {
        console.log(
          "Vertex AI failed, falling back to local search:",
          err.message,
        );
      }
    }

    if (hadSemantic) {
      const embeddings = await loadEmbeddings();
      if (embeddings.length > 0) {
        const scored = embeddings.map((e) => ({
          id: e.id,
          score: cosineSimilarity(queryEmbedding, e.vector),
        }));
        scored.sort((a, b) => b.score - a.score);
        const top = scored.slice(0, topK);
        const results = top.map(({ id, score }) => {
          const meta = byId.get(id) || {
            id,
            title: id,
            url: `/blog/${id}`,
            excerpt: "",
          };
          return {
            id,
            title: meta.title,
            url: meta.url,
            excerpt: meta.excerpt,
            score,
          };
        });
        const lexical = lexicalResults(mapping, q, topK);
        const merged = mergeWithLexical(results, lexical, topK);
        const provider =
          merged.length > results.length ? "local+lexical" : "local";
        jsonResponse(res, 200, {
          results: merged,
          tookMs: Date.now() - started,
          provider,
        });
        return;
      }
    }

    const lexical = lexicalResults(mapping, q, topK);
    jsonResponse(res, 200, {
      results: lexical,
      tookMs: Date.now() - started,
      provider: hadSemantic ? "lexical-fallback" : "lexical",
    });
  } catch (err) {
    jsonResponse(res, 500, { error: "Search failed", details: String(err) });
  }
}
