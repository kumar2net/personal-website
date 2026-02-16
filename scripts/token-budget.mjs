#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const DEFAULT_REPORT_PATH = path.resolve(process.cwd(), "reports", "token-usage.json");
const REPORT_PATH = path.resolve(
  process.cwd(),
  process.env.TOKEN_USAGE_REPORT_PATH || DEFAULT_REPORT_PATH,
);

const BUDGET_TOKENS = Number(process.env.TOKEN_BUDGET_TOKENS || "0");
const BUDGET_USD = Number(process.env.TOKEN_BUDGET_USD || "0");
const PRICE_HINT_JSON = process.env.TOKEN_PRICE_HINT_JSON;

const DEFAULT_PRICE_PER_1M = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4.1-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-5.2": { input: 2.5, output: 10 },
  "gpt-4o-audio-preview": { input: 0, output: 0 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
  "text-embedding-3-large": { input: 0.13, output: 0 },
  "text-embedding-ada-002": { input: 0.10, output: 0 },
  "gpt-4o-mini-tts": { input: 0, output: 1.5 },
  "gpt-4o-mini-tts-2025-12-15": { input: 0, output: 1.5 },
  "gpt-4o-tts": { input: 0, output: 2.5 },
  "tts-1": { input: 0, output: 15 },
  "tts-1-hd": { input: 0, output: 30 },
};

function loadPriceHints() {
  if (!PRICE_HINT_JSON) {
    return {};
  }
  try {
    const parsed = JSON.parse(PRICE_HINT_JSON);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeModel(rawModel = "") {
  return String(rawModel || "unknown").trim().toLowerCase();
}

function normalizeEntry(entry) {
  const model = normalizeModel(entry?.model);
  const inputTokens = Number(entry?.input_tokens) || 0;
  const outputTokens = Number(entry?.output_tokens) || 0;
  const totalTokens = Number(entry?.total_tokens) || inputTokens + outputTokens;
  return {
    ...entry,
    model,
    inputTokens,
    outputTokens,
    totalTokens,
  };
}

function estimateCost(entry, priceTable) {
  const modelPrice = priceTable[entry.model] || priceTable[normalizeModel(entry.model).replace("-2025-12-15", "")];
  if (!modelPrice || (!modelPrice.input && !modelPrice.output)) {
    return null;
  }
  const inputCost = (Number(entry.inputTokens) || 0) * (Number(modelPrice.input) || 0) / 1_000_000;
  const outputCost =
    (Number(entry.outputTokens) || 0) * (Number(modelPrice.output) || 0) / 1_000_000;
  return Number((inputCost + outputCost).toFixed(6));
}

function readReport() {
  const raw = fs.readFileSync(REPORT_PATH, "utf8");
  return JSON.parse(raw);
}

function main() {
  let report = { entries: [] };
  try {
    report = readReport();
  } catch {
    console.log(`No token report found at ${REPORT_PATH}; nothing to enforce.`);
    return;
  }

  const entries = Array.isArray(report.entries) ? report.entries : [];
  const priceTable = {
    ...DEFAULT_PRICE_PER_1M,
    ...loadPriceHints(),
  };

  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalTokens = 0;
  let totalUsd = 0;
  let costSampleCount = 0;

  for (const raw of entries) {
    const entry = normalizeEntry(raw);
    totalInputTokens += entry.inputTokens;
    totalOutputTokens += entry.outputTokens;
    totalTokens += entry.totalTokens;
    const cost = estimateCost(entry, priceTable);
    if (typeof cost === "number") {
      totalUsd += cost;
      costSampleCount += 1;
    }
  }

  console.log(`[token-budget] entries: ${entries.length}`);
  console.log(
    `[token-budget] tokens: in=${totalInputTokens} out=${totalOutputTokens} total=${totalTokens}`,
  );
  if (costSampleCount) {
    console.log(`[token-budget] estimated cost: $${totalUsd.toFixed(4)} (from ${costSampleCount} entries)`);
  }

  if (Number.isFinite(BUDGET_TOKENS) && BUDGET_TOKENS > 0 && totalTokens > BUDGET_TOKENS) {
    console.error(
      `[token-budget] Token budget exceeded: ${totalTokens} > ${BUDGET_TOKENS}`,
    );
    process.exit(1);
  }

  if (Number.isFinite(BUDGET_USD) && BUDGET_USD > 0 && Number.isFinite(totalUsd) && totalUsd > BUDGET_USD) {
    console.error(
      `[token-budget] Cost budget exceeded: $${totalUsd.toFixed(4)} > $${BUDGET_USD.toFixed(2)}`,
    );
    process.exit(1);
  }

  if (!Number.isFinite(BUDGET_TOKENS) && !Number.isFinite(BUDGET_USD)) {
    console.log("[token-budget] No budgets configured. Skipping hard enforcement.");
  }
}

main();
