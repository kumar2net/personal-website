#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_ID = 'kumar2net.wordpress.com';
const API_BASE = 'https://public-api.wordpress.com/rest/v1.1';
const TOKEN_FILE = path.join(__dirname, '../data/wordpress-token.json');
const PHRASE =
  'This cross-post includes a TL;DR and source link to avoid duplicate-content SEO issues.';

async function readTokenFromFile() {
  try {
    const raw = await fs.readFile(TOKEN_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return data?.access_token || null;
  } catch {
    return null;
  }
}

async function isTokenValid(token) {
  try {
    const resp = await fetch(`${API_BASE}/sites/${SITE_ID}/posts?number=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.ok;
  } catch {
    return false;
  }
}

async function getToken() {
  // Prefer env token, else fall back to token file
  if (process.env.WORDPRESS_API_TOKEN) {
    const envTok = process.env.WORDPRESS_API_TOKEN;
    if (await isTokenValid(envTok)) {
      return envTok;
    }
  }
  const fileTok = await readTokenFromFile();
  if (fileTok && (await isTokenValid(fileTok))) {
    return fileTok;
  }
  throw new Error(
    'No valid WordPress API token found. Set WORDPRESS_API_TOKEN or ensure data/wordpress-token.json exists.'
  );
}

async function fetchAllPosts(token) {
  const results = [];
  const _pageHandle = null;
  const pageSize = 100;

  // WordPress.com v1.1 supports offset-based pagination
  let offset = 0;
  while (true) {
    const url = `${API_BASE}/sites/${SITE_ID}/posts?number=${pageSize}&offset=${offset}`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) {
      throw new Error(`Failed to fetch posts: ${resp.status}`);
    }
    const data = await resp.json();
    const posts = data?.posts || [];
    results.push(...posts);
    if (posts.length < pageSize) {
      break;
    }
    offset += posts.length;
  }
  return results;
}

function cleanAttribution(html) {
  if (!html || typeof html !== 'string') {
    return html;
  }
  if (!html.includes(PHRASE)) {
    return null; // no change
  }
  // Remove the phrase only, keep the rest (e.g., Originally published link)
  let updated = html.replace(PHRASE, '').replace(/\s+\.<\/em>/g, '</em>');
  // Normalize extra spaces
  updated = updated.replace(/\s{2,}/g, ' ').replace(/\s+([.,;:])/g, '$1');
  return updated;
}

async function updatePostContent(token, postId, content) {
  const url = `${API_BASE}/sites/${SITE_ID}/posts/${postId}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Update failed for post ${postId}: ${resp.status} ${text}`);
  }
}

async function main() {
  console.log('🔎 Cleaning existing WordPress posts attribution...');
  const token = await getToken();
  const posts = await fetchAllPosts(token);
  let scanned = 0,
    changed = 0,
    errors = 0;
  for (const p of posts) {
    scanned++;
    const current = p?.content || '';
    const cleaned = cleanAttribution(current);
    if (cleaned === null) {
      continue; // no match
    }
    try {
      await updatePostContent(token, p.ID, cleaned);
      changed++;
      console.log(`✅ Updated post #${p.ID}: ${p?.title || ''}`);
    } catch (e) {
      errors++;
      console.error(`❌ Error updating post #${p.ID}:`, e.message);
    }
  }
  console.log(
    `\n📊 Done. Scanned: ${scanned}, Updated: ${changed}, Errors: ${errors}`
  );
}

main().catch((e) => {
  console.error('❌ Cleanup script error:', e.message);
  process.exit(1);
});
