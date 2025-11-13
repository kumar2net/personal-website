import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function jsonResponse(res, statusCode, body, extraHeaders = {}) {
  res.status(statusCode).setHeader("Content-Type", "application/json");
  Object.entries(extraHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.send(JSON.stringify(body));
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_DIM = 768;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_CANDIDATES = [
  path.resolve(process.cwd(), "src/data/semantic-index.json"),
  path.resolve(process.cwd(), "apps/personal-website/src/data/semantic-index.json"),
  path.resolve(__dirname, "../src/data/semantic-index.json"),
];

let cachedIndex = null;

function toFiniteVector(values, expectedLength = EMBEDDING_DIM) {
  if (!Array.isArray(values)) {
    throw new Error("Embedding vector missing");
  }
  if (values.length !== expectedLength) {
    throw new Error(
      `Embedding dimension mismatch: got ${values.length}, expected ${expectedLength}`,
    );
  }
  return values.map((value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  });
}

function computeNorm(vector) {
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

function loadIndex() {
  if (cachedIndex) {
    return cachedIndex;
  }
  for (const candidate of INDEX_CANDIDATES) {
    if (!fs.existsSync(candidate)) {
      continue;
    }
    const raw = fs.readFileSync(candidate, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.items)) {
      throw new Error(`Malformed semantic index at ${candidate}`);
    }
    const embeddingDim = Number(parsed.embeddingDim) || EMBEDDING_DIM;
    const docs = parsed.items.map((item) => {
      const vector = toFiniteVector(item.vector, embeddingDim);
      const norm =
        typeof item.norm === "number" && Number.isFinite(item.norm)
          ? item.norm
          : computeNorm(vector);
      return {
        id: item.id,
        title: item.title,
        url: item.url,
        excerpt: item.excerpt,
        vector,
        norm,
      };
    });
    cachedIndex = {
      docs,
      embeddingDim,
      provider: parsed.provider || "semantic-index",
    };
    return cachedIndex;
  }
  throw new Error(
    "semantic-index.json not found. Run `npm run semantic:index` before querying.",
  );
}

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    sum += a[i] * b[i];
  }
  return sum;
}

async function searchEmbeddings(vector, topK) {
  const index = loadIndex();
  const query = toFiniteVector(vector, index.embeddingDim);
  const queryNorm = computeNorm(query);
  if (queryNorm === 0) {
    return [];
  }

  const scored = index.docs.map((doc) => {
    const dot = dotProduct(query, doc.vector);
    const denom = doc.norm * queryNorm;
    const score = denom === 0 ? 0 : dot / denom;
    return {
      id: doc.id,
      title: doc.title,
      url: doc.url,
      excerpt: doc.excerpt,
      score: Number.isFinite(score) ? score : 0,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

async function embedQuery(text) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
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
  if (!Array.isArray(values)) {
    throw new Error("Invalid embedding response");
  }
  if (values.length !== EMBEDDING_DIM) {
    throw new Error(
      `Embedding dimension mismatch: got ${values.length}, expected ${EMBEDDING_DIM}`,
    );
  }
  return values;
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
    const embedding = await embedQuery(q);
    const results = await searchEmbeddings(embedding, topK);
    jsonResponse(res, 200, {
      results,
      tookMs: Date.now() - started,
      provider: "semantic-index",
    });
  } catch (err) {
    jsonResponse(res, 500, {
      error: "Search failed",
      details: err?.message || String(err),
    });
  }
}
