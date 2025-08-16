#!/usr/bin/env node

// Indexing script: generate embeddings for blog posts and upsert into Vertex AI Vector Search
// Usage: npm run semantic:index

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v1 as aiplatform } from '@google-cloud/aiplatform';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Env ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_LOCATION = process.env.GCP_LOCATION || 'us-central1';
const VERTEX_INDEX_ID = process.env.VERTEX_INDEX_ID;
const VERTEX_EMBED_DIM = Number(process.env.VERTEX_EMBED_DIM || '768');
const SEMANTIC_SKIP_VERTEX = process.env.SEMANTIC_SKIP_VERTEX === '1';
const GCP_SERVICE_ACCOUNT_JSON = process.env.GCP_SERVICE_ACCOUNT_JSON;

if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
// Only require GCP config if not skipping Vertex AI
if (!SEMANTIC_SKIP_VERTEX) {
  if (!GCP_PROJECT_ID) throw new Error('Missing GCP_PROJECT_ID');
  if (!VERTEX_INDEX_ID) throw new Error('Missing VERTEX_INDEX_ID');
  if (!GCP_SERVICE_ACCOUNT_JSON) throw new Error('Missing GCP_SERVICE_ACCOUNT_JSON');
}

// --- Config ---
const BLOG_DIR = path.resolve(process.cwd(), 'src/pages/blog');
const MAPPING_FILE = path.resolve(process.cwd(), 'src/data/semantic-mapping.json');
const EMBEDDINGS_FILE = path.resolve(process.cwd(), 'src/data/semantic-embeddings.json');
const MAX_TEXT_CHARS = 16000; // defensive cap per item

// --- Helpers ---
function toTitleFromSlug(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function stripJsxToText(source) {
  let text = source;
  // drop import/export lines
  text = text.replace(/^\s*import\s+[^;]+;\s*$/gm, '');
  text = text.replace(/^\s*export\s+(default\s+)?[^;]+;?\s*$/gm, '');
  // remove jsx tags
  text = text.replace(/<[^>]*>/g, ' ');
  // remove curly expressions
  text = text.replace(/\{[^{}]*\}/g, ' ');
  // collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

async function readAllBlogFiles() {
  const entries = await fs.promises.readdir(BLOG_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && (e.name.endsWith('.jsx') || e.name.endsWith('.md')))
    .map((e) => path.join(BLOG_DIR, e.name));
  return files;
}

async function readPost(filePath) {
  const raw = await fs.promises.readFile(filePath, 'utf8');
  const base = path.basename(filePath);
  const ext = path.extname(base);
  const slug = base.replace(ext, '');
  const title = toTitleFromSlug(slug);
  const url = `/blog/${slug}`;
  let text;
  if (ext === '.md') {
    // strip simple markdown artifacts
    text = raw
      .replace(/`{3}[\s\S]*?`{3}/g, ' ') // code blocks
      .replace(/`[^`]*`/g, ' ') // inline code
      .replace(/#+\s*/g, '') // headings markers
      .replace(/\*\*|__/g, '') // bold markers
      .replace(/\*|_/g, '') // italic markers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // links
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    text = stripJsxToText(raw);
  }
  const excerpt = text.slice(0, 240);
  const limited = text.slice(0, MAX_TEXT_CHARS);
  return { id: slug, title, url, text: limited, excerpt };
}

async function embedTextGemini(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
  const body = {
    content: {
      parts: [{ text }],
    },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini embed error: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values)) throw new Error('Invalid embedding response');
  if (values.length !== VERTEX_EMBED_DIM) {
    throw new Error(`Embedding dimension mismatch: got ${values.length}, expected ${VERTEX_EMBED_DIM}`);
  }
  return values;
}

async function upsertDatapoints(datapoints) {
  const credentials = JSON.parse(GCP_SERVICE_ACCOUNT_JSON);
  const clientOptions = {
    projectId: GCP_PROJECT_ID,
    apiEndpoint: `${GCP_LOCATION}-aiplatform.googleapis.com`,
  };
  if (credentials) clientOptions.credentials = credentials;
  const indexServiceClient = new aiplatform.IndexServiceClient(clientOptions);
  const indexName = `projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}/indexes/${VERTEX_INDEX_ID}`;
  const request = { index: indexName, datapoints };
  const [operation] = await indexServiceClient.upsertDatapoints(request);
  const [result] = await operation.promise();
  return result;
}

async function main() {
  console.log('[semantic-index] Starting');
  const files = await readAllBlogFiles();
  console.log(`[semantic-index] Found ${files.length} files`);
  const posts = [];
  for (const fp of files) {
    try {
      const p = await readPost(fp);
      posts.push(p);
    } catch (e) {
      console.warn(`[semantic-index] Skipping ${fp}: ${e.message}`);
    }
  }
  console.log(`[semantic-index] Collected ${posts.length} posts`);

  const mapping = [];
  const datapoints = [];
  let processed = 0;

  for (const post of posts) {
    const embedding = await embedTextGemini(post.text);
    processed += 1;
    console.log(`[semantic-index] Embedded ${post.id} (${processed}/${posts.length})`);
    datapoints.push({
      datapointId: post.id,
      featureVector: embedding,
    });
    mapping.push({ id: post.id, title: post.title, url: post.url, excerpt: post.excerpt });
  }

  if (SEMANTIC_SKIP_VERTEX || !VERTEX_INDEX_ID) {
    console.log('[semantic-index] Skipping Vertex upsert (SEMANTIC_SKIP_VERTEX=1 or missing VERTEX_INDEX_ID)');
  } else {
    console.log('[semantic-index] Upserting datapoints into Vertex AI...');
    await upsertDatapoints(datapoints);
    console.log('[semantic-index] Upsert completed');
  }

  // Write mapping file
  await fs.promises.mkdir(path.dirname(MAPPING_FILE), { recursive: true });
  await fs.promises.writeFile(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  console.log(`[semantic-index] Wrote mapping file at ${MAPPING_FILE}`);

  // Write embeddings file for local fallback search
  const embeddings = datapoints.map((d) => ({ id: d.datapointId, vector: d.featureVector }));
  await fs.promises.writeFile(EMBEDDINGS_FILE, JSON.stringify(embeddings));
  console.log(`[semantic-index] Wrote embeddings file at ${EMBEDDINGS_FILE}`);

  console.log('[semantic-index] Done');
}

main().catch((err) => {
  console.error('[semantic-index] ERROR', err);
  process.exit(1);
});


