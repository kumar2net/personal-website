import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import test from "node:test";

import {
  computeRetryDelayMs,
  fetchTextWithCache,
} from "../lib/fetch-text-with-cache.mjs";

function createResponse({ status = 200, body = "", headers = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    async text() {
      return body;
    },
  };
}

test("uses If-None-Match and serves cached text on 304", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "fetch-cache-test-"));
  const cachePath = path.join(tempDir, "body.txt");
  const etagPath = path.join(tempDir, "etag.txt");
  await writeFile(cachePath, "cached body", "utf8");
  await writeFile(etagPath, "\"etag-1\"", "utf8");

  let seenIfNoneMatch = "";
  const result = await fetchTextWithCache({
    url: "https://example.test/context",
    cachePath,
    etagPath,
    maxRetries: 0,
    fetchImpl: async (_url, init) => {
      seenIfNoneMatch = init.headers.get("If-None-Match");
      return createResponse({ status: 304 });
    },
  });

  assert.equal(seenIfNoneMatch, "\"etag-1\"");
  assert.equal(result.text, "cached body");
  assert.equal(result.cacheState, "cache-etag");
});

test("retries retryable responses and honors Retry-After before succeeding", async () => {
  const sleepCalls = [];
  const responses = [
    createResponse({
      status: 429,
      body: "rate limited",
      headers: { "Retry-After": "2" },
    }),
    createResponse({
      status: 200,
      body: "fresh body",
      headers: { ETag: "\"etag-2\"" },
    }),
  ];

  const tempDir = await mkdtemp(path.join(os.tmpdir(), "fetch-cache-test-"));
  const cachePath = path.join(tempDir, "body.txt");
  const etagPath = path.join(tempDir, "etag.txt");
  const result = await fetchTextWithCache({
    url: "https://example.test/retry",
    cachePath,
    etagPath,
    maxRetries: 1,
    sleepImpl: async (delayMs) => {
      sleepCalls.push(delayMs);
    },
    fetchImpl: async () => responses.shift(),
  });

  assert.deepEqual(sleepCalls, [2000]);
  assert.equal(result.text, "fresh body");
  assert.equal(result.cacheState, "network");
  assert.equal(await readFile(cachePath, "utf8"), "fresh body");
});

test("falls back to cached text after exhausting retryable failures", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "fetch-cache-test-"));
  const cachePath = path.join(tempDir, "body.txt");
  await writeFile(cachePath, "stale cached body", "utf8");

  const result = await fetchTextWithCache({
    url: "https://example.test/offline",
    cachePath,
    maxRetries: 1,
    baseDelayMs: 500,
    random: () => 0.5,
    sleepImpl: async () => {},
    readCacheOnError: true,
    fetchImpl: async () => {
      throw new Error("fetch failed");
    },
  });

  assert.equal(result.text, "stale cached body");
  assert.equal(result.cacheState, "cache-fallback");
  assert.match(result.error.message, /fetch failed/i);
});

test("computes full-jitter backoff from the exponential cap", () => {
  const delayMs = computeRetryDelayMs({
    attempt: 2,
    baseDelayMs: 500,
    maxDelayMs: 60_000,
    random: () => 0.5,
  });

  assert.equal(delayMs, 500);
});
