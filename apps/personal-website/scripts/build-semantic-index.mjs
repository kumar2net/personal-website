#!/usr/bin/env node

/**
 * Index all blog posts into a local semantic vector store.
 * Usage: npm run semantic:index
 */

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { embedTextWithGemini } from "../lib/gemini.js";

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

const hasGeminiCredentials =
  Boolean(process.env.GCP_SERVICE_ACCOUNT_JSON) ||
  Boolean(process.env.GEMINI_API_KEY);
if (!hasGeminiCredentials) {
  console.error(
    "Gemini credentials are required (set GCP_SERVICE_ACCOUNT_JSON or GEMINI_API_KEY)",
  );
  process.exit(1);
}

const BLOG_DIR = path.resolve(process.cwd(), "src/pages/blog");
const INDEX_PATH = path.resolve(process.cwd(), "src/data/semantic-index.json");
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

function toFiniteVector(values) {
  if (!Array.isArray(values)) {
    throw new Error("Expected embedding array");
  }
  if (values.length !== EMBEDDING_DIM) {
    throw new Error(
      `Expected embedding vector of length ${EMBEDDING_DIM}, got ${values.length}`,
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

async function main() {
  console.log("[semantic-store] indexing blog posts");
  await fs.promises.mkdir(path.dirname(INDEX_PATH), { recursive: true });

  const files = await readBlogFiles();
  if (files.length === 0) {
    console.log("[semantic-store] no blog posts found");
    return;
  }

  const posts = [];
  for (const file of files) {
    try {
      const post = await readPost(file);
      posts.push(post);
    } catch (err) {
      console.warn(`[semantic-store] failed to parse ${file}: ${err.message}`);
    }
  }

  try {
    const items = [];
    let processed = 0;
    for (const post of posts) {
      if (!post.text) {
        console.warn(`[semantic-store] skipping empty post ${post.id}`);
        continue;
      }
      const vector = toFiniteVector(
        await embedTextWithGemini(post.text, {
          model: "text-embedding-004",
        }),
      );
      items.push({
        id: post.id,
        title: post.title,
        url: post.url,
        excerpt: post.excerpt,
        vector,
      });
      processed += 1;
      console.log(
        `[semantic-store] indexed ${post.id} (${processed}/${posts.length})`,
      );
    }
    const payload = {
      provider: "gemini-text-embedding-004",
      embeddingDim: EMBEDDING_DIM,
      generatedAt: new Date().toISOString(),
      items: items.map((item) => ({
        ...item,
        norm: computeNorm(item.vector),
      })),
    };
    await fs.promises.writeFile(
      INDEX_PATH,
      JSON.stringify(payload, null, 2),
      "utf8",
    );
    console.log(
      `[semantic-store] wrote index with ${items.length} posts to ${INDEX_PATH}`,
    );
  } catch (err) {
    console.error("[semantic-store] indexing failed:", err);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("[semantic-store] unhandled error:", err);
  process.exit(1);
});
