import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import duckdb from "duckdb";

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
const DB_CANDIDATES = [
  path.resolve(process.cwd(), "src/data/semantic.duckdb"),
  path.resolve(process.cwd(), "apps/personal-website/src/data/semantic.duckdb"),
  path.resolve(__dirname, "../src/data/semantic.duckdb"),
  path.resolve(
    __dirname,
    "../apps/personal-website/src/data/semantic.duckdb",
  ),
];

let cachedDbPath = null;
let cachedDb = null;

function resolveDbPath() {
  if (cachedDbPath && fs.existsSync(cachedDbPath)) {
    return cachedDbPath;
  }
  for (const candidate of DB_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      cachedDbPath = candidate;
      return cachedDbPath;
    }
  }
  throw new Error(
    "semantic.duckdb not found. Run `npm run semantic:index` before querying.",
  );
}

function getConnection() {
  if (!cachedDb) {
    const dbPath = resolveDbPath();
    cachedDb = new duckdb.Database(dbPath, duckdb.OPEN_READONLY);
  }
  return cachedDb.connect();
}

function allAsync(conn, sql) {
  return new Promise((resolve, reject) => {
    conn.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function vectorLiteral(values) {
  if (!Array.isArray(values)) {
    throw new Error("Embedding vector missing");
  }
  if (values.length !== EMBEDDING_DIM) {
    throw new Error(
      `Embedding dimension mismatch: got ${values.length}, expected ${EMBEDDING_DIM}`,
    );
  }
  const sanitized = values.map((value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  });
  return `LIST_VALUE(${sanitized.join(",")})::FLOAT[]`;
}

function buildSimilaritySql(vector, topK) {
  const literal = vectorLiteral(vector);
  return `
    WITH query_vec AS (
      SELECT ${literal}::FLOAT[] AS vector
    ),
    query_expanded AS (
      SELECT idx, value
      FROM query_vec,
      UNNEST(vector) WITH ORDINALITY AS q(value, idx)
    ),
    doc_expanded AS (
      SELECT
        e.id,
        e.title,
        e.url,
        e.excerpt,
        idx,
        value
      FROM embeddings e,
      UNNEST(e.vector::FLOAT[]) WITH ORDINALITY AS ev(value, idx)
    ),
    doc_norms AS (
      SELECT
        id,
        title,
        url,
        excerpt,
        sqrt(SUM(value * value)) AS doc_norm
      FROM doc_expanded
      GROUP BY id, title, url, excerpt
    ),
    dot_products AS (
      SELECT
        d.id,
        SUM(d.value * q.value) AS dot
      FROM doc_expanded d
      JOIN query_expanded q ON q.idx = d.idx
      GROUP BY d.id
    ),
    query_norm AS (
      SELECT
        sqrt(SUM(value * value)) AS norm
      FROM query_expanded
    )
    SELECT
      n.id,
      n.title,
      n.url,
      n.excerpt,
      CASE
        WHEN n.doc_norm = 0 OR query_norm.norm = 0 OR dot_products.dot IS NULL THEN 0
        ELSE dot_products.dot / (n.doc_norm * query_norm.norm)
      END AS score
    FROM doc_norms n
    LEFT JOIN dot_products ON n.id = dot_products.id
    CROSS JOIN query_norm
    ORDER BY score DESC
    LIMIT ${topK};
  `;
}

async function searchEmbeddings(vector, topK) {
  const conn = getConnection();
  try {
    const sql = buildSimilaritySql(vector, topK);
    const rows = await allAsync(conn, sql);
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      excerpt: row.excerpt,
      score: Number(row.score) || 0,
    }));
  } finally {
    conn.close();
  }
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
      provider: "duckdb",
    });
  } catch (err) {
    jsonResponse(res, 500, {
      error: "Search failed",
      details: err?.message || String(err),
    });
  }
}
