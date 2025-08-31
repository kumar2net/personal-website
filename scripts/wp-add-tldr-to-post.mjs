#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import fetch from 'node-fetch';

const SITE_ID = 'kumar2net.wordpress.com';
const API_BASE = 'https://public-api.wordpress.com/rest/v1.1';
const TOKEN_FILE = path.join(process.cwd(), 'data/wordpress-token.json');

function generateTldrLocallyFromHtml(html) {
  if (!html || typeof html !== 'string') {
    return null;
  }
  const text = html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) {
    return null;
  }
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 40 && s.length <= 220);
  if (sentences.length === 0) {
    return null;
  }
  const keywords = [
    'recommend',
    'suggest',
    'key',
    'important',
    'use',
    'need',
    'next',
    'insight',
    'summary',
    'learned',
    'plan',
    'solution',
  ];
  const scored = sentences.map((s, i) => ({
    s,
    score:
      keywords.reduce((a, k) => a + (s.toLowerCase().includes(k) ? 1 : 0), 0) +
      (i < 5 ? 0.5 : 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  const top = Array.from(new Set(scored.map((o) => o.s))).slice(0, 5);
  const bullets = top.map((line) => `<li>${line}</li>`).join('');
  return bullets ? `<h2>TL;DR</h2><ul>${bullets}</ul>` : null;
}

async function getPostById(token, postId) {
  const url = `${API_BASE}/sites/${SITE_ID}/posts/${postId}`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    throw new Error(`Fetch failed: ${resp.status}`);
  }
  return resp.json();
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
    const t = await resp.text();
    throw new Error(`Update failed: ${resp.status} ${t}`);
  }
  return resp.json();
}

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
  if (process.env.WORDPRESS_API_TOKEN) {
    const t = process.env.WORDPRESS_API_TOKEN;
    if (await isTokenValid(t)) {
      return t;
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

async function main() {
  const token = await getToken();
  const postId = process.argv[2];
  if (!postId) {
    throw new Error('Usage: node scripts/wp-add-tldr-to-post.mjs <POST_ID>');
  }

  const post = await getPostById(token, postId);
  const current = post?.content || '';
  if (/<h2>TL;DR<\/h2>/.test(current)) {
    console.log('TL;DR already present, skipping.');
    return;
  }
  const tldr = generateTldrLocallyFromHtml(current);
  if (!tldr) {
    console.log('No TL;DR generated.');
    return;
  }
  const updated = `${tldr}${current}`;
  const result = await updatePostContent(token, postId, updated);
  console.log('✅ Updated post with TL;DR:', {
    id: result.ID,
    url: result.URL,
  });
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
