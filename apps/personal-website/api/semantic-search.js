import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  embedTextWithOpenAI,
  getOpenAIEmbeddingModelList,
  getConfiguredEmbeddingDimension,
} from "../lib/openai-embeddings.js";

function jsonResponse(res, statusCode, body, extraHeaders = {}) {
  res.status(statusCode).setHeader("Content-Type", "application/json");
  Object.entries(extraHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.send(JSON.stringify(body));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMBEDDING_MODEL_LIST = getOpenAIEmbeddingModelList();
const EMBEDDING_DIM_FALLBACK = getConfiguredEmbeddingDimension(1536);
const BLOG_FILE_CANDIDATES = [
  path.resolve(process.cwd(), "src/pages/blog"),
  path.resolve(process.cwd(), "apps/personal-website/src/pages/blog"),
  path.resolve(__dirname, "../src/pages/blog"),
];
const FALLBACK_EXCERPT_CHARS = 420;
const FALLBACK_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "what",
  "when",
  "where",
  "with",
  "who",
  "why",
  "would",
  "you",
  "your",
  "about",
  "did",
  "didn't",
  "kumar",
  "say",
  "he",
  "she",
  "they",
]);
const INDEX_CANDIDATES = [
  path.resolve(process.cwd(), "src/data/semantic-index.json"),
  path.resolve(process.cwd(), "apps/personal-website/src/data/semantic-index.json"),
  path.resolve(__dirname, "../src/data/semantic-index.json"),
];

let cachedIndex = null;
let cachedFallbackCorpus = null;

function isBlogDirectory(candidate) {
  try {
    return fs.statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

function stripJsxToText(source) {
  let text = source;
  text = text.replace(/\/\*[\s\S]*?\*\//g, " ");
  text = text.replace(/\/\/[^\n]*/g, " ");
  text = text.replace(/^\s*import\s.+$/gm, " ");
  text = text.replace(/^\s*export\s.+$/gm, " ");
  text = text.replace(/<[^>]*>/g, " ");
  text = text.replace(/\{[^{}]*\}/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function stripMarkdownToText(source) {
  let text = source;
  text = text.replace(/^\s*#+\s*/gm, " ");
  text = text.replace(/`{1,3}[\s\S]*?`{1,3}/g, " ");
  text = text.replace(/\[[^\]]+\]\([^)]*\)/g, " ");
  text = text.replace(/!\[[^\]]+\]\([^)]*\)/g, " ");
  text = text.replace(/[*_~>#]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function toTitleFromSlug(slug) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function extractTitleFromFile(content, slug) {
  const match = content.match(/title:\s*["'`]?([^"'`]+)["'`]/i);
  if (match?.[1]) {
    return match[1].trim();
  }
  return toTitleFromSlug(slug);
}

async function loadFallbackCorpus() {
  if (cachedFallbackCorpus) {
    return cachedFallbackCorpus;
  }

  for (const candidate of BLOG_FILE_CANDIDATES) {
    if (!isBlogDirectory(candidate)) {
      continue;
    }
    const entries = await fs.promises.readdir(candidate, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => name.endsWith(".jsx") || name.endsWith(".md"));

    const corpus = [];
    for (const fileName of files) {
      const filePath = path.join(candidate, fileName);
      const slug = path.basename(fileName, path.extname(fileName));
      const raw = await fs.promises.readFile(filePath, "utf8");
      const text =
        fileName.endsWith(".md") ? stripMarkdownToText(raw) : stripJsxToText(raw);
      const normalizedText = text.toLowerCase();
      if (!normalizedText) {
        continue;
      }
      corpus.push({
        id: slug,
        title: extractTitleFromFile(raw, slug),
        url: `/blog/${slug}`,
        excerpt: normalizedText.slice(0, FALLBACK_EXCERPT_CHARS),
        fullText: normalizedText,
      });
    }

    cachedFallbackCorpus = corpus;
    return corpus;
  }

  throw new Error("No blog files found for lexical fallback.");
}

function tokenizeForFallback(text) {
  if (typeof text !== "string") return [];

  const seen = new Set();
  const tokens = [];

  for (const token of text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3)
    .filter(Boolean)) {
    if (FALLBACK_STOP_WORDS.has(token) || seen.has(token)) {
      continue;
    }
    seen.add(token);
    tokens.push(token);
  }

  return tokens;
}

function escapeRegexTerm(term) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function searchByTextFallback(query, topK) {
  const docs = await loadFallbackCorpus();
  const terms = tokenizeForFallback(query);
  if (!terms.length) return [];
  const uniqueTerms = [...new Set(terms)];
  const normalizedQuery = query.toLowerCase();
  const termBoundaryRegex = (term) =>
    new RegExp(`\\b${escapeRegexTerm(term)}\\b`, "g");

  const scored = docs.map((doc) => {
    const haystack = `${doc.title} ${doc.url} ${doc.fullText}`.toLowerCase();
    let score = 0;

    if (haystack.includes(normalizedQuery)) {
      score += 2;
    }

    for (const term of uniqueTerms) {
      if (haystack.includes(term)) {
        const matches = haystack.match(termBoundaryRegex(term));
        score += matches ? Math.min(2.8, matches.length * 1.1) : 0.45;
      }
    }

    const bonus = doc.title && terms.some((term) => doc.title.toLowerCase().includes(term))
      ? 0.9
      : 0;
    return {
      id: doc.id,
      title: doc.title,
      url: doc.url,
      excerpt: doc.excerpt,
      score: score + bonus,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((item) => item.score > 0).slice(0, topK);
}

function clampTopK(value, fallback = 5) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(1, Math.min(12, parsed));
}

function toFiniteVector(values, expectedLength = EMBEDDING_DIM_FALLBACK) {
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
    const embeddingDim = Number(parsed.embeddingDim) || EMBEDDING_DIM_FALLBACK;
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

function parseQueryPayload(url) {
  if (typeof url !== "string") {
    return {};
  }

  try {
    const parsed = new URL(url, "http://localhost");
    return {
      q: parsed.searchParams.get("q") || "",
      topK: parsed.searchParams.get("topK") || "",
    };
  } catch {
    return {};
  }
}

function resolvePayload(req) {
  const method = (req.method || "").toUpperCase();

  if (method === "GET") {
    return parseQueryPayload(req.url);
  }

  let payload = req.body;
  if (payload && typeof payload === "object") {
    return payload;
  }

  if (typeof payload === "string") {
    if (!payload.trim()) {
      return {};
    }
    return JSON.parse(payload);
  }

  return parseQueryPayload(req.url);
}

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    sum += a[i] * b[i];
  }
  return sum;
}

async function searchEmbeddings(vector, topK, indexOverride) {
  const index = indexOverride || loadIndex();
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

async function embedQuery(text, targetDimension) {
  let lastError = null;
  for (const model of EMBEDDING_MODEL_LIST) {
    try {
      const values = await embedTextWithOpenAI(text, {
        model,
        dimensions: targetDimension,
      });
      return values;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No valid embedding model available");
}

export async function searchBlogByQuery(query, options = {}) {
  const topK = clampTopK(options.topK, 5);
  const normalized = typeof query === "string" ? query.trim() : "";
  if (!normalized) {
    return [];
  }

  const semanticIndex = (() => {
    try {
      return loadIndex();
    } catch {
      return null;
    }
  })();

  try {
    const embedding = await embedQuery(
      normalized,
      semanticIndex?.embeddingDim || EMBEDDING_DIM_FALLBACK,
    );
    const semanticResults = await searchEmbeddings(
      embedding,
      topK,
      semanticIndex,
    );
    if (semanticResults.length) {
      return semanticResults;
    }
  } catch (err) {
    console.error("Semantic embedding search failed, using lexical fallback", err);
  }

  return await searchByTextFallback(normalized, topK);
 
}

export default async function handler(req, res) {
  const started = Date.now();
  const method = (req.method || "").toUpperCase();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (method !== "POST" && method !== "GET") {
    jsonResponse(res, 405, { error: "Method Not Allowed" });
    return;
  }

  let payload;
  try {
    payload = resolvePayload(req);
  } catch (error) {
    jsonResponse(res, 400, {
      error: "Invalid JSON body",
      detail: error?.message || String(error),
    });
    return;
  }

  const q = (payload?.q || "").toString().trim();
  const topK = clampTopK(payload?.topK, 5);
  if (!q) {
    jsonResponse(res, 400, {
      error: "q is required",
      methodHint: method === "GET"
        ? "Pass q and optional topK as query params (e.g., /api/semantic-search?q=india&topK=5)."
        : "Include q in POST JSON body.",
    });
    return;
  }

  try {
    const results = await searchBlogByQuery(q, { topK });
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
