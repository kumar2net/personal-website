#!/usr/bin/env node

/**
 * Index all blog posts into a local DuckDB vector store.
 * Usage: npm run semantic:index
 */

import fs from "node:fs";
import path from "node:path";
import duckdb from "duckdb";
import dotenv from "dotenv";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(process.cwd(), "../../.env"),
];
for (const candidate of envCandidates) {
  try {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate, override: false });
    }
  } catch {
    // ignore
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is required to build embeddings");
  process.exit(1);
}

const BLOG_DIR = path.resolve(process.cwd(), "src/pages/blog");
const DB_PATH = path.resolve(process.cwd(), "src/data/semantic.duckdb");
const MAX_TEXT_CHARS = 16000;
const MAX_EXCERPT_CHARS = 240;
const EMBEDDING_DIM = 768;

async function readBlogFiles() {
  const entries = await fs.promises.readdir(BLOG_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".jsx"))
    .map((entry) => path.join(BLOG_DIR, entry.name));
}

function slugFromFilename(filePath) {
  const base = path.basename(filePath);
  return base.replace(path.extname(base), "");
}

function toTitleFromSlug(slug) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function stripJsxToText(source) {
  let text = source;
  text = text.replace(/\/\*[\s\S]*?\*\//g, " "); // block comments
  text = text.replace(/\/\/[^\n]*/g, " "); // line comments
  text = text.replace(/^\s*import\s.+$/gm, " "); // import lines
  text = text.replace(/^\s*export\s.+$/gm, " "); // export lines
  text = text.replace(/<[^>]*>/g, " "); // jsx tags
  text = text.replace(/\{[^{}]*\}/g, " "); // simple brace expressions
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

async function readPost(filePath) {
  const raw = await fs.promises.readFile(filePath, "utf8");
  const slug = slugFromFilename(filePath);
  const title = toTitleFromSlug(slug);
  const url = `/blog/${slug}`;
  const text = stripJsxToText(raw).slice(0, MAX_TEXT_CHARS);
  const excerpt = text.slice(0, MAX_EXCERPT_CHARS);
  return { id: slug, title, url, text, excerpt };
}

async function embedText(text) {
  const body = {
    content: {
      parts: [{ text }],
    },
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini embed error: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values)) {
    throw new Error("Gemini response missing embedding values");
  }
  if (values.length !== EMBEDDING_DIM) {
    throw new Error(
      `Unexpected embedding dimension ${values.length}, expected ${EMBEDDING_DIM}`,
    );
  }
  return values.map((v) => Number(v) || 0);
}

function promisifyRun(conn, sql, params = []) {
  return new Promise((resolve, reject) => {
    conn.run(sql, ...params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function ensureDatabase(conn) {
  const ddl = `
    CREATE TABLE IF NOT EXISTS embeddings (
      id TEXT PRIMARY KEY,
      title TEXT,
      url TEXT,
      excerpt TEXT,
      vector FLOAT[${EMBEDDING_DIM}]
    );
  `;
  await promisifyRun(conn, ddl);
}

function toVectorLiteral(vector) {
  if (!Array.isArray(vector) || vector.length !== EMBEDDING_DIM) {
    throw new Error(`Expected embedding vector of length ${EMBEDDING_DIM}`);
  }
  const sanitized = vector.map((value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  });
  return `LIST_VALUE(${sanitized.join(",")})::FLOAT[]`;
}

async function main() {
  console.log("[duckdb] indexing blog posts");
  await fs.promises.mkdir(path.dirname(DB_PATH), { recursive: true });

  const files = await readBlogFiles();
  if (files.length === 0) {
    console.log("[duckdb] no blog posts found");
    return;
  }

  const posts = [];
  for (const file of files) {
    try {
      const post = await readPost(file);
      posts.push(post);
    } catch (err) {
      console.warn(`[duckdb] failed to parse ${file}: ${err.message}`);
    }
  }

  const db = new duckdb.Database(DB_PATH);
  const conn = db.connect();

  try {
    await ensureDatabase(conn);

    let processed = 0;
    for (const post of posts) {
      if (!post.text) {
        console.warn(`[duckdb] skipping empty post ${post.id}`);
        continue;
      }
      const vector = await embedText(post.text);
      const vectorLiteral = toVectorLiteral(vector);
      await promisifyRun(
        conn,
        `
          INSERT OR REPLACE INTO embeddings (id, title, url, excerpt, vector)
          VALUES (?, ?, ?, ?, ${vectorLiteral})
        `,
        [
          post.id,
          post.title,
          post.url,
          post.excerpt,
        ],
      );
      processed += 1;
      console.log(`[duckdb] indexed ${post.id} (${processed}/${posts.length})`);
    }
    console.log(`[duckdb] completed indexing ${processed} posts`);
  } catch (err) {
    console.error("[duckdb] indexing failed:", err);
    process.exitCode = 1;
  } finally {
    conn.close();
    db.close?.();
  }
}

main().catch((err) => {
  console.error("[duckdb] unhandled error:", err);
  process.exit(1);
});
