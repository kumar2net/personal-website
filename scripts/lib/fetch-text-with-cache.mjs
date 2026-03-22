import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DEFAULT_RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

export function parseRetryAfterMillis(value, nowMs = Date.now()) {
  if (value == null || value === "") {
    return null;
  }

  const asSeconds = Number(value);
  if (Number.isFinite(asSeconds) && asSeconds >= 0) {
    return Math.max(0, Math.round(asSeconds * 1000));
  }

  const asDate = Date.parse(String(value));
  if (Number.isFinite(asDate)) {
    return Math.max(0, asDate - nowMs);
  }

  return null;
}

export function computeRetryDelayMs({
  attempt,
  baseDelayMs = 500,
  maxDelayMs = 60_000,
  jitter = "full",
  random = Math.random,
  retryAfterMs = null,
}) {
  if (Number.isFinite(retryAfterMs) && retryAfterMs >= 0) {
    return Math.min(maxDelayMs, retryAfterMs);
  }

  const safeAttempt = Math.max(1, Math.trunc(attempt) || 1);
  const safeBaseDelay = Math.max(1, Math.trunc(baseDelayMs) || 500);
  const cappedDelay = Math.min(
    Math.max(safeBaseDelay, Math.trunc(maxDelayMs) || safeBaseDelay),
    safeBaseDelay * 2 ** (safeAttempt - 1),
  );

  if (jitter !== "full") {
    return cappedDelay;
  }

  const sample = random();
  const safeRandom = Number.isFinite(sample) ? sample : Math.random();
  return Math.round(cappedDelay * Math.min(1, Math.max(0, safeRandom)));
}

function createHeaders(headers = {}) {
  if (headers instanceof Headers) {
    return new Headers(headers);
  }
  return new Headers(Object.entries(headers));
}

function summarizeBody(body) {
  const normalized = String(body || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }
  return normalized.length > 240 ? `${normalized.slice(0, 237)}...` : normalized;
}

function isRetryableNetworkError(error) {
  if (!error) {
    return false;
  }

  if (error.name === "AbortError") {
    return true;
  }

  const message = String(error.message || "").toLowerCase();
  if (message.includes("fetch failed") || message.includes("network")) {
    return true;
  }

  const causeCode = String(error.cause?.code || "").toUpperCase();
  return ["ECONNRESET", "ECONNREFUSED", "EHOSTUNREACH", "ETIMEDOUT"].includes(
    causeCode,
  );
}

function isRetryableError(error, retryableStatuses) {
  if (!error) {
    return false;
  }

  if (error.retryable === true) {
    return true;
  }

  if (isRetryableNetworkError(error)) {
    return true;
  }

  return retryableStatuses.has(Number(error.status));
}

async function sleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function ensureParentDir(filePath) {
  if (!filePath) {
    return;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function readTextIfExists(filePath) {
  if (!filePath || !existsSync(filePath)) {
    return null;
  }
  return readFile(filePath, "utf8");
}

async function writeCacheFiles({ cachePath, etagPath, text, etag }) {
  if (cachePath) {
    await ensureParentDir(cachePath);
    await writeFile(cachePath, text, "utf8");
  }

  if (!etagPath) {
    return;
  }

  if (etag) {
    await ensureParentDir(etagPath);
    await writeFile(etagPath, etag, "utf8");
    return;
  }

  if (existsSync(etagPath)) {
    await rm(etagPath, { force: true });
  }
}

export async function fetchTextWithCache({
  url,
  method = "GET",
  headers = {},
  timeoutMs = 15_000,
  maxRetries = 2,
  baseDelayMs = 500,
  maxDelayMs = 60_000,
  jitter = "full",
  useRetryAfter = true,
  retryableStatuses = DEFAULT_RETRYABLE_STATUSES,
  cachePath = "",
  etagPath = "",
  readCacheOnError = false,
  fetchImpl = fetch,
  sleepImpl = sleep,
  random = Math.random,
  now = Date.now,
}) {
  const retryStatuses =
    retryableStatuses instanceof Set
      ? retryableStatuses
      : new Set(retryableStatuses || DEFAULT_RETRYABLE_STATUSES);
  const totalRetries = Math.max(0, Math.trunc(maxRetries) || 0);
  let lastError = null;

  for (let attemptIndex = 0; attemptIndex <= totalRetries; attemptIndex += 1) {
    const requestHeaders = createHeaders(headers);
    if (!requestHeaders.has("If-None-Match") && etagPath) {
      const cachedEtag = await readTextIfExists(etagPath);
      if (cachedEtag?.trim()) {
        requestHeaders.set("If-None-Match", cachedEtag.trim());
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(url, {
        method,
        headers: requestHeaders,
        redirect: "follow",
        signal: controller.signal,
      });

      if (response.status === 304) {
        const cachedText = await readTextIfExists(cachePath);
        if (cachedText != null) {
          return {
            text: cachedText,
            headers: response.headers,
            status: 304,
            cacheState: "cache-etag",
            attemptCount: attemptIndex + 1,
            error: null,
          };
        }

        if (etagPath && existsSync(etagPath)) {
          await rm(etagPath, { force: true });
        }

        const error = new Error("HTTP 304 without a cached response body");
        error.status = 304;
        error.retryable = true;
        throw error;
      }

      const text = await response.text();
      if (!response.ok) {
        const error = new Error(
          `HTTP ${response.status}${text ? `: ${summarizeBody(text)}` : ""}`,
        );
        error.status = response.status;
        error.body = text;
        error.retryAfterMs = parseRetryAfterMillis(
          response.headers.get("retry-after"),
          now(),
        );
        error.retryable = retryStatuses.has(response.status);
        throw error;
      }

      await writeCacheFiles({
        cachePath,
        etagPath,
        text,
        etag: response.headers.get("etag") || "",
      });

      return {
        text,
        headers: response.headers,
        status: response.status,
        cacheState: "network",
        attemptCount: attemptIndex + 1,
        error: null,
      };
    } catch (error) {
      lastError = error;
      const shouldRetry =
        attemptIndex < totalRetries && isRetryableError(error, retryStatuses);

      if (shouldRetry) {
        const retryAfterMs =
          useRetryAfter && Number.isFinite(error.retryAfterMs)
            ? error.retryAfterMs
            : useRetryAfter
              ? parseRetryAfterMillis(
                  error.retryAfter ?? error.headers?.get?.("retry-after"),
                  now(),
                )
              : null;
        const delayMs = computeRetryDelayMs({
          attempt: attemptIndex + 1,
          baseDelayMs,
          maxDelayMs,
          jitter,
          random,
          retryAfterMs,
        });
        await sleepImpl(delayMs);
        continue;
      }

      if (readCacheOnError) {
        const cachedText = await readTextIfExists(cachePath);
        if (cachedText != null) {
          return {
            text: cachedText,
            headers: new Headers(),
            status: Number(error?.status) || 0,
            cacheState: "cache-fallback",
            attemptCount: attemptIndex + 1,
            error,
          };
        }
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error(`Unable to fetch ${url}`);
}
