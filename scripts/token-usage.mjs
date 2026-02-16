#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const DEFAULT_REPORT_PATH = path.resolve(process.cwd(), "reports", "token-usage.json");

function resolveReportPath() {
  return path.resolve(process.cwd(), process.env.TOKEN_USAGE_REPORT_PATH || DEFAULT_REPORT_PATH);
}

function makeBaseline() {
  return {
    generatedAt: new Date().toISOString(),
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalTokens: 0,
    entries: [],
  };
}

function sanitizeNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return 0;
  }
  return Math.round(num);
}

function loadReport(filePath) {
  try {
    const existing = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(existing);
    const safeEntries = Array.isArray(parsed?.entries) ? parsed.entries : [];
    return {
      ...makeBaseline(),
      ...parsed,
      entries: safeEntries,
      totalInputTokens: sanitizeNumber(parsed?.totalInputTokens),
      totalOutputTokens: sanitizeNumber(parsed?.totalOutputTokens),
      totalTokens: sanitizeNumber(parsed?.totalTokens),
    };
  } catch {
    return makeBaseline();
  }
}

function normalizeEntry(input = {}) {
  const model = typeof input.model === "string" && input.model.trim()
    ? input.model.trim()
    : "unknown";
  const inputTokens = sanitizeNumber(input.input_tokens);
  const outputTokens = sanitizeNumber(input.output_tokens);
  const totalTokens = sanitizeNumber(
    sanitizeNumber(input.total_tokens) || inputTokens + outputTokens,
  );

  if (totalTokens === 0) {
    return null;
  }

  return {
    provider: input.provider || "openai",
    route: input.route || "api",
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: totalTokens,
    request_id: input.request_id || null,
    meta: {
      timestamp: new Date().toISOString(),
      ...input.meta,
    },
  };
}

export function recordTokenUsage(input = {}) {
  const pathToUse = resolveReportPath();
  try {
    const report = loadReport(pathToUse);
    const normalized = normalizeEntry(input);
    if (!normalized) {
      return;
    }

    const existingDir = path.dirname(pathToUse);
    fs.mkdirSync(existingDir, { recursive: true });

    report.generatedAt = new Date().toISOString();
    report.entries.push(normalized);
    report.totalInputTokens += normalized.input_tokens;
    report.totalOutputTokens += normalized.output_tokens;
    report.totalTokens += normalized.total_tokens;
    report.totalInputTokens = Math.max(report.totalInputTokens, 0);
    report.totalOutputTokens = Math.max(report.totalOutputTokens, 0);
    report.totalTokens = Math.max(report.totalTokens, 0);

    fs.writeFileSync(pathToUse, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  } catch {
    // Best-effort telemetry. Never block request flow.
  }
}
