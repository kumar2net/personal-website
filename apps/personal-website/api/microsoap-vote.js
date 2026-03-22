import path from "node:path";
import fs from "node:fs/promises";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

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

  const rawBody = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}

export const runtime = "nodejs";

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST with JSON { episodeId, choiceId }.",
    });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    console.error("[microsoap-vote] Failed to parse body", error);
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  const episodeId = String(payload?.episodeId || "").trim();
  const choiceId = String(payload?.choiceId || "").trim().toUpperCase();
  const seriesTitle = String(payload?.seriesTitle || "").trim();

  if (!episodeId) {
    return res.status(400).json({ error: "episodeId is required" });
  }

  if (!["A", "B"].includes(choiceId)) {
    return res.status(400).json({ error: "choiceId must be A or B" });
  }

  const logDir = String(process.env.MICROSOAP_VOTE_LOG_DIR || "").trim();
  let stored = false;

  if (logDir) {
    try {
      const resolvedDir = path.resolve(logDir);
      const filePath = path.join(resolvedDir, `${episodeId}.ndjson`);
      const record = {
        acceptedAt: new Date().toISOString(),
        episodeId,
        choiceId,
        seriesTitle: seriesTitle || null,
      };
      await fs.mkdir(resolvedDir, { recursive: true });
      await fs.appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");
      stored = true;
    } catch (error) {
      console.error("[microsoap-vote] Failed to write vote log", error);
    }
  }

  return res.status(202).json({
    ok: true,
    episodeId,
    choiceId,
    persistence: stored ? "file-log" : "stateless-demo",
  });
}
