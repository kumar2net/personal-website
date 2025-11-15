import { put } from "@vercel/blob";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const normalizePath = (value) => value.replace(/^\/+/, "");

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    if (!req.body.trim()) return {};
    return JSON.parse(req.body);
  }

  const raw = await new Promise((resolve, reject) => {
    let payload = "";
    req.on("data", (chunk) => {
      payload += chunk;
    });
    req.on("end", () => resolve(payload));
    req.on("error", reject);
  });

  if (!raw) return {};
  return JSON.parse(raw);
}

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

  const { path, data } = body || {};

  if (typeof path !== "string" || !path.trim()) {
    return res.status(400).json({ error: "Path is required" });
  }

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Data must be an array" });
  }

  const normalizedPath = normalizePath(path);
  if (normalizedPath.includes("..")) {
    return res.status(400).json({ error: "Invalid path" });
  }

  try {
    await put(normalizedPath, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return res.status(200).json({ ok: true, path: normalizedPath });
  } catch (error) {
    console.error("[reflections] Failed to save blob:", error);
    const message =
      error?.message || "Unexpected error saving reflections payload";
    return res.status(500).json({ error: message });
  }
}
