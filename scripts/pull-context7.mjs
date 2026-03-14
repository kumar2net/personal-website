#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const args = parseArgs(process.argv.slice(2));
const cwd = process.cwd();
const agentsPath = path.resolve(args.agents || "AGENTS.md");

await loadEnvFile(path.resolve(cwd, ".env.local"));
await loadEnvFile(path.resolve(cwd, ".env"));

const initialAgents = await loadAgentsFile(agentsPath);
const config = parseAgentsConfig(initialAgents);

const snapshotUrl = resolveSnapshotUrl({
  snapshotUrl: process.env.CONTEXT7_SNAPSHOT_URL || "",
  mcpUrl: process.env.CONTEXT7_URL || "",
  configUrl: config.url || ""
});
const mcpUrl = process.env.CONTEXT7_URL || "";
const apiKey = process.env.CONTEXT7_API_KEY || "";
const contextPath = process.env.CONTEXT7_CONTEXT_PATH || "context";
const cachePath = config.snapshotFile ? path.resolve(cwd, config.snapshotFile) : "";
const etagPath = config.etagFile ? path.resolve(cwd, config.etagFile) : "";

let contextText = "";
let sourceLabel = "";

if (snapshotUrl) {
  try {
    const fetched = await fetchContext({
      baseUrl: snapshotUrl,
      apiKey,
      contextPath,
      cachePath,
      etagPath
    });
    contextText = fetched.contextText;
    sourceLabel = fetched.sourceLabel;
  } catch (error) {
    console.warn(`Context7 fetch failed: ${formatError(error)}`);
  }
}

if (!contextText.trim() && cachePath && existsSync(cachePath)) {
  const cachedText = await readFile(cachePath, "utf8");
  contextText = normalizeContextFromText(cachedText);
  sourceLabel = "cache";
}

if (!contextText.trim()) {
  contextText = buildFallbackContext({
    snapshotUrl,
    mcpUrl,
    cachePath,
    agentsPath,
    hasApiKey: Boolean(apiKey)
  });
  sourceLabel = "config fallback";
}

const updatedAt = new Date().toISOString();
const updatedAgents = injectContext(initialAgents, contextText, updatedAt);

await writeFile(agentsPath, updatedAgents, "utf8");
console.log(
  `Context7 injected into ${path.relative(cwd, agentsPath)} (source: ${sourceLabel}).`
);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
    if (arg.startsWith("--agents=")) {
      parsed.agents = arg.slice("--agents=".length);
      continue;
    }
    if (arg === "--agents") {
      parsed.agents = rawArgs[i + 1];
      i += 1;
    }
  }
  return parsed;
}

async function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const raw = await readFile(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, value] = match;
    if (process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = stripEnvQuotes(value);
  }
}

function stripEnvQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseAgentsConfig(agentsContent) {
  const knowledgeSourcesMatch = agentsContent.match(
    /(^|\n)knowledge_sources:\n([\s\S]*?)(?:\n(?:runs|guardrails|ci|repository_guidelines):)/m
  );
  const knowledgeSourcesBlock = knowledgeSourcesMatch ? knowledgeSourcesMatch[2] : "";

  const preferredSourceMatch = knowledgeSourcesBlock.match(
    /-\s*name:\s*context7-latest[\s\S]*?\n\s*url:\s*([^\n]+)/m
  );
  const anySourceMatch = knowledgeSourcesBlock.match(/\n\s*url:\s*([^\n]+)/m);
  const snapshotFileMatch = agentsContent.match(/^\s*snapshot_file:\s*([^\n]+)/m);
  const etagFileMatch = agentsContent.match(/^\s*etag_file:\s*([^\n]+)/m);

  return {
    url: cleanYamlScalar(
      preferredSourceMatch?.[1] || anySourceMatch?.[1] || ""
    ),
    snapshotFile: cleanYamlScalar(snapshotFileMatch?.[1] || ""),
    etagFile: cleanYamlScalar(etagFileMatch?.[1] || "")
  };
}

function cleanYamlScalar(value) {
  return value.trim().replace(/^['"]|['"]$/g, "");
}

function resolveSnapshotUrl({ snapshotUrl, mcpUrl, configUrl }) {
  if (snapshotUrl) {
    return snapshotUrl;
  }

  if (configUrl) {
    return configUrl;
  }

  if (mcpUrl && !isMcpEndpoint(mcpUrl)) {
    return mcpUrl;
  }

  return "";
}

function isMcpEndpoint(url) {
  try {
    const parsed = new URL(url);
    return /\/mcp(\/|$)/.test(parsed.pathname);
  } catch {
    return /\/mcp(\/|$)/.test(url);
  }
}

function buildContextUrl(base, contextPathValue) {
  const trimmedBase = base.replace(/\/$/, "");
  if (trimmedBase.endsWith(".json")) {
    return trimmedBase;
  }
  if (trimmedBase.endsWith("/context")) {
    return trimmedBase;
  }
  const cleanPath = contextPathValue.replace(/^\//, "");
  return `${trimmedBase}/${cleanPath}`;
}

async function fetchContext({ baseUrl, apiKey, contextPath, cachePath, etagPath }) {
  const contextUrl = buildContextUrl(baseUrl, contextPath);
  const headers = {
    Accept: "application/json, text/plain, text/markdown"
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  if (etagPath && existsSync(etagPath)) {
    const etag = (await readFile(etagPath, "utf8")).trim();
    if (etag) {
      headers["If-None-Match"] = etag;
    }
  }

  const response = await fetch(contextUrl, {
    method: "GET",
    headers
  });

  if (response.status === 304 && cachePath && existsSync(cachePath)) {
    const cachedText = await readFile(cachePath, "utf8");
    return {
      contextText: normalizeContextFromText(cachedText),
      sourceLabel: "cache (etag)"
    };
  }

  if (!response.ok) {
    const body = await safeText(response);
    throw new Error(`HTTP ${response.status}${body ? `: ${body}` : ""}`);
  }

  const rawText = await response.text();
  const contextText = normalizeContextFromText(rawText);
  if (!contextText.trim()) {
    throw new Error("response was empty");
  }

  await writeCacheFiles({
    cachePath,
    etagPath,
    rawText,
    etag: response.headers.get("etag") || ""
  });

  return {
    contextText,
    sourceLabel: apiKey ? "remote" : "remote (public)"
  };
}

async function writeCacheFiles({ cachePath, etagPath, rawText, etag }) {
  if (cachePath) {
    await mkdir(path.dirname(cachePath), { recursive: true });
    await writeFile(cachePath, rawText, "utf8");
  }

  if (etagPath && etag) {
    await mkdir(path.dirname(etagPath), { recursive: true });
    await writeFile(etagPath, etag, "utf8");
  }
}

async function safeText(response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function normalizeContextFromText(rawText) {
  const text = rawText.replace(/\r\n/g, "\n").trim();
  if (!text) {
    return "";
  }

  try {
    const payload = JSON.parse(text);
    return summarizePayload(payload);
  } catch {
    return text;
  }
}

function summarizePayload(payload) {
  const direct = pickContext(payload);
  if (direct) {
    return direct.replace(/\r\n/g, "\n").trim();
  }

  if (Array.isArray(payload)) {
    return summarizeArray(payload);
  }

  if (!payload || typeof payload !== "object") {
    return String(payload ?? "").trim();
  }

  const lines = [];
  const keys = Object.keys(payload);
  lines.push("Context7 JSON snapshot");
  lines.push("");
  lines.push(`Top-level keys: ${keys.join(", ") || "(none)"}`);

  for (const key of keys.slice(0, 12)) {
    const value = payload[key];
    lines.push(...summarizeEntry(key, value));
  }

  if (keys.length > 12) {
    lines.push(`- ... ${keys.length - 12} more top-level key(s) omitted`);
  }

  return lines.join("\n").trim();
}

function pickContext(payload) {
  if (typeof payload === "string") {
    return payload;
  }
  if (!payload || typeof payload !== "object") {
    return "";
  }
  if (typeof payload.context === "string") {
    return payload.context;
  }
  if (typeof payload.content === "string") {
    return payload.content;
  }
  if (typeof payload.markdown === "string") {
    return payload.markdown;
  }
  if (typeof payload.text === "string") {
    return payload.text;
  }
  if (payload.data) {
    return pickContext(payload.data);
  }
  if (payload.result) {
    return pickContext(payload.result);
  }
  return "";
}

function summarizeArray(items) {
  const lines = [`Context7 JSON array snapshot (${items.length} item(s))`, ""];
  for (const [index, item] of items.slice(0, 10).entries()) {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const label = item.title || item.name || item.slug || item.id || `item ${index + 1}`;
      lines.push(`- ${label}`);
      for (const [key, value] of Object.entries(item).slice(0, 6)) {
        if (["title", "name", "slug", "id"].includes(key)) {
          continue;
        }
        lines.push(`  ${key}: ${summarizeScalar(value)}`);
      }
    } else {
      lines.push(`- ${summarizeScalar(item)}`);
    }
  }

  if (items.length > 10) {
    lines.push(`- ... ${items.length - 10} more item(s) omitted`);
  }

  return lines.join("\n").trim();
}

function summarizeEntry(key, value) {
  if (Array.isArray(value)) {
    const lines = [`- ${key}: array(${value.length})`];
    for (const item of value.slice(0, 5)) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const label = item.title || item.name || item.slug || item.id || "item";
        lines.push(`  - ${label}`);
      } else {
        lines.push(`  - ${summarizeScalar(item)}`);
      }
    }
    if (value.length > 5) {
      lines.push(`  - ... ${value.length - 5} more omitted`);
    }
    return lines;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value).slice(0, 6);
    return [
      `- ${key}: object`,
      ...entries.map(([childKey, childValue]) => `  ${childKey}: ${summarizeScalar(childValue)}`)
    ];
  }

  return [`- ${key}: ${summarizeScalar(value)}`];
}

function summarizeScalar(value) {
  if (Array.isArray(value)) {
    return `[${value.slice(0, 3).map((item) => summarizeScalar(item)).join(", ")}${
      value.length > 3 ? ", ..." : ""
    }]`;
  }

  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    return `{${keys.slice(0, 4).join(", ")}${keys.length > 4 ? ", ..." : ""}}`;
  }

  const stringValue = String(value ?? "");
  return stringValue.length > 160 ? `${stringValue.slice(0, 157)}...` : stringValue;
}

function buildFallbackContext({ snapshotUrl, mcpUrl, cachePath, agentsPath, hasApiKey }) {
  const relativeAgentsPath = path.relative(process.cwd(), agentsPath);
  const relativeCachePath = cachePath ? path.relative(process.cwd(), cachePath) : "(not configured)";

  return [
    "Context7 snapshot fallback",
    "",
    "Remote Context7 content was not available during this run, so this section was generated from repository configuration instead of aborting the task.",
    "",
    `- AGENTS file: ${relativeAgentsPath}`,
    `- Configured snapshot URL: ${snapshotUrl || "(not configured)"}`,
    `- MCP URL: ${mcpUrl || "(not configured)"}`,
    `- Cache snapshot: ${relativeCachePath}`,
    `- API key present: ${hasApiKey ? "yes" : "no"}`,
    "",
    "Behavior:",
    "- The script now loads `.env.local` and `.env` automatically.",
    "- `CONTEXT7_URL` is treated as the MCP endpoint, not the snapshot feed.",
    "- `CONTEXT7_SNAPSHOT_URL` can override the snapshot feed when needed.",
    "- If no snapshot override is set, the script falls back to the `context7-latest` URL declared in `AGENTS.md`.",
    "- If remote fetch fails, it uses the cached snapshot when available.",
    "- If neither remote content nor cache is available, it injects this fallback note and exits successfully."
  ].join("\n");
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

async function loadAgentsFile(filePath) {
  if (existsSync(filePath)) {
    return readFile(filePath, "utf8");
  }

  return [
    "# Agents",
    "",
    "## Context7 Snapshot",
    "<!--CTX7:BEGIN-->",
    "<!--CTX7:END-->",
    ""
  ].join("\n");
}

function injectContext(agentsContent, context, updatedAtValue) {
  const beginMarker = "<!--CTX7:BEGIN-->";
  const endMarker = "<!--CTX7:END-->";

  let content = agentsContent;
  if (!content.includes(beginMarker) || !content.includes(endMarker)) {
    content = `${content.trimEnd()}\n\n${beginMarker}\n${endMarker}\n`;
  }

  const indentMatch = content.match(
    new RegExp(`(^[\\t ]*)${escapeRegex(beginMarker)}`, "m")
  );
  const indent = indentMatch ? indentMatch[1] : "";

  const block = [
    `${indent}${beginMarker}`,
    `${indent}Last updated: ${updatedAtValue}`,
    `${indent}`,
    ...context.split("\n").map((line) => `${indent}${line}`),
    `${indent}${endMarker}`
  ].join("\n");

  const regex = new RegExp(
    `(^[\\t ]*)${escapeRegex(beginMarker)}[\\s\\S]*?^[\\t ]*${escapeRegex(endMarker)}`,
    "m"
  );
  return `${content.replace(regex, block)}\n`;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
