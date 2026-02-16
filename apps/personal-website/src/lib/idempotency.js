import crypto from "node:crypto";

const executedOperations = new Map();
const DEFAULT_TTL_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 2000;

function normalizeKey(key) {
  return `${String(key || "default")}`.trim();
}

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function readHeader(headers, name) {
  if (!headers) {
    return "";
  }

  const direct =
    headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()];
  if (typeof direct === "string" && direct.trim()) {
    return direct;
  }
  if (Array.isArray(direct) && direct[0]) {
    return `${direct[0]}`;
  }

  const lowered = String(name).toLowerCase();
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (String(headerName).toLowerCase() === lowered) {
      if (typeof headerValue === "string" && headerValue.trim()) {
        return headerValue;
      }
      if (Array.isArray(headerValue) && headerValue[0]) {
        return `${headerValue[0]}`;
      }
    }
  }

  return "";
}

function stablePayload(input) {
  if (typeof input === "string") {
    return input;
  }
  try {
    return JSON.stringify(input);
  } catch {
    return String(input || "");
  }
}

function gc() {
  const now = Date.now();
  for (const [key, value] of executedOperations) {
    if (value.expiresAt <= now) {
      executedOperations.delete(key);
    }
  }

  if (executedOperations.size <= MAX_ENTRIES) {
    return;
  }

  const keys = [...executedOperations.entries()]
    .sort((a, b) => a[1].createdAt - b[1].createdAt)
    .map(([key]) => key);
  for (const key of keys.slice(0, executedOperations.size - MAX_ENTRIES)) {
    executedOperations.delete(key);
  }
}

export function resolveIdempotencyKey(req, fallbackPayload) {
  const headers = req?.headers;
  const raw =
    readHeader(headers, "idempotency-key") ||
    readHeader(headers, "x-idempotency-key");

  if (typeof raw === "string" && raw.trim()) {
    return normalizeKey(raw);
  }
  return normalizeKey(hash(stablePayload(fallbackPayload)));
}

export async function withIdempotentExecution({
  key,
  ttlMs = DEFAULT_TTL_MS,
  fn,
}) {
  gc();
  const normalized = normalizeKey(key);
  const now = Date.now();
  const ttl = Number.isFinite(Number(ttlMs)) ? Number(ttlMs) : DEFAULT_TTL_MS;

  const existing = executedOperations.get(normalized);
  if (existing) {
    if (existing.promise) {
      return existing.promise;
    }
    if (existing.expiresAt > now) {
      return existing.value;
    }
    executedOperations.delete(normalized);
  }

  const promise = (async () => fn())();
  executedOperations.set(normalized, {
    promise,
    expiresAt: now + ttl,
    createdAt: now,
  });

  try {
    const value = await promise;
    const doneAt = Date.now();
    executedOperations.set(normalized, {
      value,
      expiresAt: doneAt + ttl,
      createdAt: now,
    });
    return value;
  } catch (error) {
    executedOperations.delete(normalized);
    throw error;
  }
}
