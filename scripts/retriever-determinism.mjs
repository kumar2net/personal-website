#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const INDEX_PATH = path.resolve(
  process.cwd(),
  process.env.RETRIEVER_INDEX_PATH || "apps/personal-website/src/data/semantic-index.json",
);
const SEED = Number(process.env.RETRIEVER_SEED || "42");
const TOP_K = Number(process.env.RETRIEVER_TOP_K || "5");

function mulberry32(seed) {
  let value = seed >>> 0;
  return function random() {
    value |= 0;
    value = value + 0x6d2b79f5 | 0;
    let t = Math.imul(value ^ value >>> 15, value | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeQueryVector(length) {
  const random = mulberry32(Number.isFinite(SEED) ? SEED : 42);
  const vector = new Array(length).fill(0).map(() => random() * 2 - 1);
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / norm);
}

function computeScores(indexItems, vector) {
  return indexItems.map((item) => {
    const itemVector = Array.isArray(item.vector) ? item.vector : [];
    const length = Math.min(itemVector.length, vector.length);
    let score = 0;
    for (let i = 0; i < length; i += 1) {
      const value = Number(itemVector[i]);
      const weight = Number(vector[i]);
      if (Number.isFinite(value) && Number.isFinite(weight)) {
        score += value * weight;
      }
    }
    return { id: item.id, score };
  });
}

function rankedIds(indexItems, vector, topK) {
  const scored = computeScores(indexItems, vector);
  scored.sort((a, b) => {
    if (b.score === a.score) {
      return String(a.id).localeCompare(String(b.id));
    }
    return b.score - a.score;
  });
  return scored.slice(0, Math.max(1, topK)).map((entry) => entry.id);
}

function readIndex() {
  const raw = fs.readFileSync(INDEX_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed?.items) ? parsed.items : [];
  return items.filter((item) => item && typeof item.id === "string" && item.vector);
}

function main() {
  let items;
  try {
    items = readIndex();
  } catch (error) {
    console.error(`[retriever-determinism] failed to read index: ${error.message}`);
    process.exit(1);
  }

  if (!items.length) {
    console.error("[retriever-determinism] no indexed documents found");
    process.exit(1);
  }

  const dims = Number(items[0]?.vector?.length || 0);
  if (!Number.isFinite(dims) || dims <= 0) {
    console.error("[retriever-determinism] invalid embedding dimension");
    process.exit(1);
  }

  const query = makeQueryVector(dims);
  const first = rankedIds(items, query, TOP_K);
  const second = rankedIds(items, query, TOP_K);

  const match = JSON.stringify(first) === JSON.stringify(second);
  if (!match) {
    console.error("[retriever-determinism] retrieval output is not deterministic");
    process.exit(1);
  }

  const unique = new Set(first);
  if (unique.size !== first.length) {
    console.error("[retriever-determinism] duplicate IDs in ranked response");
    process.exit(1);
  }

  console.log(`[retriever-determinism] deterministic output confirmed (${first.length} ids)`);
}

main();
