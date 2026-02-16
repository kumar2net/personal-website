import { put } from "@vercel/blob";
import { resolveIdempotencyKey, withIdempotentExecution } from "../src/lib/idempotency.js";

const DEFAULT_BLOB_BASE =
  "https://jf0xcffb3qoqwhu6.public.blob.vercel-storage.com";
const REACTIONS = ["❤️", "😂", "🤔", "👍", "😮", "🙏"];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const BLOB_PUBLIC_BASE =
  process.env.BLOB_PUBLIC_BASE ||
  process.env.VITE_BLOB_PUBLIC_BASE ||
  DEFAULT_BLOB_BASE;

const normalizePath = (value = "") => value.replace(/^\/+/, "");

const encodePath = (value = "") =>
  value
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const sanitizeSlug = (value) => {
  const base = typeof value === "string" && value.trim() ? value.trim() : "global";
  if (base.includes("..")) {
    throw new Error("Invalid slug");
  }
  return base;
};

const getRequestIdentity = (req = {}) => {
  const headers = req.headers || {};
  const forwardedFor =
    typeof headers["x-forwarded-for"] === "string"
      ? headers["x-forwarded-for"].split(",")[0].trim()
      : "";
  const userAgent =
    typeof headers["user-agent"] === "string" ? headers["user-agent"] : "";
  const remoteAddress = req?.socket?.remoteAddress || "";

  const source = [forwardedFor, remoteAddress, userAgent]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean)
    .join("|");

  return source || "unknown-client";
};

const buildIdempotencyPayload = ({
  type,
  slug,
  emoji,
  entry,
  requestIdentity,
}) => {
  const safeEntry = {
    answer: typeof entry?.answer === "string" ? entry.answer.trim() : "",
    anonymousID: entry?.anonymousID ? `${entry.anonymousID}` : "",
  };
  return JSON.stringify({
    type,
    slug,
    emoji,
    requestIdentity,
    answer: safeEntry.answer,
    anonymousID: safeEntry.anonymousID,
  });
};

const applyCors = (res) => {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
};

const readJsonBody = async (req) => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }

  const raw = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

  if (!raw) return {};
  return JSON.parse(raw);
};

const fetchBlobJSON = async (path) => {
  try {
    const encoded = encodePath(normalizePath(path));
    const response = await fetch(`${BLOB_PUBLIC_BASE}/${encoded}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
};

const persistBlobJSON = async (path, data) => {
  await put(normalizePath(path), JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
};

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Use POST with JSON body." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { type, slug, emoji, entry } = body || {};

  let normalizedSlug;
  try {
    normalizedSlug = sanitizeSlug(slug);
  } catch {
    return res.status(400).json({ error: "Invalid slug" });
  }

  if (type === "reaction") {
    if (!REACTIONS.includes(emoji)) {
      return res.status(400).json({ error: "Unsupported reaction" });
    }
    try {
      const result = await withIdempotentExecution({
        key: resolveIdempotencyKey(
          req,
          buildIdempotencyPayload({
            type,
            slug: normalizedSlug,
            emoji,
            requestIdentity: getRequestIdentity(req),
          }),
        ),
        fn: async () => {
          const path = `engagement/${normalizedSlug}/reactions.json`;
          const existing = (await fetchBlobJSON(path)) || {};
          const counts = { ...(existing.counts || {}) };
          counts[emoji] = (counts[emoji] || 0) + 1;
          const payload = {
            counts,
            updatedAt: new Date().toISOString(),
          };

          await persistBlobJSON(path, payload);
          return payload;
        },
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("[engagement] Failed to persist reaction", error);
      return res.status(500).json({ error: "Failed to store reaction. Try again." });
    }
  }

  if (type === "prompt") {
    if (!entry || typeof entry.answer !== "string" || !entry.answer.trim()) {
      return res.status(400).json({ error: "Answer is required" });
    }

    const words = entry.answer.trim().split(/\s+/).filter(Boolean);
    if (words.length < 5 || words.length > 12) {
      return res.status(400).json({ error: "Please keep replies to ~5-10 words" });
    }

    try {
      const result = await withIdempotentExecution({
        key: resolveIdempotencyKey(
          req,
          buildIdempotencyPayload({
            type,
            slug: normalizedSlug,
            entry,
            requestIdentity: getRequestIdentity(req),
          }),
        ),
        fn: async () => {
          const path = `engagement/${normalizedSlug}/prompts.json`;
          const current = (await fetchBlobJSON(path)) || {};
          const safeEntry = {
            anonymousID: entry.anonymousID || `anon-${Date.now()}`,
            timestamp: entry.timestamp || new Date().toISOString(),
            answer: entry.answer.trim().slice(0, 320),
          };
          const nextEntries = [
            safeEntry,
            ...(Array.isArray(current.entries) ? current.entries : []),
          ].slice(0, 30);
          const payload = {
            entries: nextEntries,
            updatedAt: new Date().toISOString(),
          };

          await persistBlobJSON(path, payload);
          return payload;
        },
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("[engagement] Failed to persist prompt reply", error);
      return res.status(500).json({ error: "Failed to store prompt reply. Try again." });
    }
  }

  return res.status(400).json({ error: "Unsupported engagement payload" });
}
