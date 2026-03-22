#!/usr/bin/env node
import crypto from "node:crypto";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import { fetchTextWithCache } from "./lib/fetch-text-with-cache.mjs";

const args = parseArgs(process.argv.slice(2));
const cwd = process.cwd();
const now = new Date().toISOString();
const statePath = path.resolve(cwd, args.state || "docs/_facts/pulse-state.json");
const reportPath = path.resolve(cwd, args.report || "docs/_facts/pulse-report.md");
const staleDays = toPositiveNumber(process.env.PULSE_CONTEXT7_STALE_DAYS, 14);
const timeoutMs = toPositiveNumber(process.env.PULSE_SOURCE_TIMEOUT_MS, 15000);
const pulseFetchRetries = toNonNegativeInteger(process.env.PULSE_FETCH_RETRIES, 2);
const pulseFetchBaseDelayMs = toPositiveNumber(
  process.env.PULSE_FETCH_BASE_DELAY_MS,
  500,
);
const pulseFetchMaxDelayMs = toPositiveNumber(
  process.env.PULSE_FETCH_MAX_DELAY_MS,
  10_000,
);
const pulseCacheDir = path.resolve(cwd, ".codex/cache/repo-pulse");
const writeState = args.writeState;
const strict = args.strict;

const previousState = await readJsonIfExists(statePath);
const currentState = await collectState({ now, timeoutMs, staleDays });
const diff = compareStates(previousState, currentState);
const summary = formatConsoleSummary(currentState, diff, {
  initialized: !previousState,
  statePath,
  reportPath,
});

console.log(summary);
await writeGithubOutputs({
  materialChanges: diff.materialChanges.length,
  warningCount: currentState.sources.filter((source) => source.status === "warning").length,
  initialized: !previousState,
  statePath,
  reportPath,
});

if (writeState && (!previousState || diff.materialChanges.length > 0)) {
  const stateWithDiff = {
    ...currentState,
    lastMaterialChangeAt:
      diff.materialChanges.length > 0
        ? now
        : previousState?.lastMaterialChangeAt || null,
    materialChanges: diff.materialChanges,
  };
  const report = formatReport(stateWithDiff, diff, { initialized: !previousState });
  await mkdir(path.dirname(statePath), { recursive: true });
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(statePath, `${JSON.stringify(stateWithDiff, null, 2)}\n`, "utf8");
  await writeFile(reportPath, report, "utf8");
  console.log(
    `[repo-pulse] Wrote ${path.relative(cwd, statePath)} and ${path.relative(cwd, reportPath)}.`,
  );
}

if (strict && diff.materialChanges.length > 0) {
  process.exitCode = 2;
}

async function collectState({ now: checkedAt, timeoutMs: requestTimeoutMs, staleDays: maxSnapshotAgeDays }) {
  const [openAiRss, openAiModels, mdnWebGpu, context7Freshness] = await Promise.all([
    collectOpenAiAudioRss({ timeoutMs: requestTimeoutMs }),
    collectOpenAiTtsModels({ timeoutMs: requestTimeoutMs }),
    collectMdnWebGpu({ timeoutMs: requestTimeoutMs }),
    collectContext7Freshness({ timeoutMs: requestTimeoutMs, staleDays: maxSnapshotAgeDays }),
  ]);

  return {
    schemaVersion: 1,
    checkedAt,
    sources: [openAiRss, openAiModels, mdnWebGpu, context7Freshness],
  };
}

async function collectOpenAiAudioRss({ timeoutMs: requestTimeoutMs }) {
  const url = "https://developers.openai.com/rss.xml";
  try {
    const result = await fetchText(url, {
      cacheId: "openai-audio-rss",
      timeoutMs: requestTimeoutMs,
    });
    const { text, headers } = result;
    const items = parseRssItems(text);
    const relevantItems = items.filter((item) =>
      /\b(audio|speech|tts|voice|transcrib)\b/i.test(
        [item.title, item.link, item.description].filter(Boolean).join(" "),
      ),
    );
    const latest = relevantItems[0] || null;
    const warnings = [
      ...getCacheWarnings(result, "OpenAI developers RSS"),
      ...(latest
        ? []
        : ["OpenAI developers RSS did not return an audio-related entry."]),
    ];

    return {
      id: "openai-audio-rss",
      label: "OpenAI audio RSS",
      category: "openai",
      url,
      status: warnings.length ? "warning" : "ok",
      summary: latest
        ? `${latest.title} (${formatDate(latest.pubDate)})`
        : "No audio-related entries found in the official OpenAI developers RSS feed.",
      materialKey: latest ? latest.guid || latest.link || latest.title : "missing",
      warnings,
      meta: {
        lastModified: headers.get("last-modified") || null,
        latest,
        matchingItems: relevantItems.slice(0, 5),
      },
    };
  } catch (error) {
    return buildWarningSource({
      id: "openai-audio-rss",
      label: "OpenAI audio RSS",
      category: "openai",
      url,
      summary: "Unable to fetch the official OpenAI developers RSS feed.",
      warning: formatError(error),
      materialKey: "fetch-warning",
    });
  }
}

async function collectOpenAiTtsModels({ timeoutMs: requestTimeoutMs }) {
  const models = ["gpt-4o-mini-tts", "tts-1", "tts-1-hd"];
  const pages = await Promise.all(
    models.map(async (modelId) => {
      const url = `https://developers.openai.com/api/docs/models/${modelId}`;
      try {
        const result = await fetchText(url, {
          cacheId: `openai-tts-model-${modelId}`,
          timeoutMs: requestTimeoutMs,
        });
        const { text, headers } = result;
        const title = matchTagContent(text, "title");
        const canonical = matchCanonical(text);
        const snapshots = uniqueMatches(
          text,
          new RegExp(`${escapeRegex(modelId)}-\\d{4}-\\d{2}-\\d{2}`, "g"),
        );
        return {
          modelId,
          url,
          title,
          canonical,
          lastModified: headers.get("last-modified") || null,
          hasSpeechEndpoint: /v1\/audio\/speech/i.test(text),
          snapshots,
          available: true,
          warning: getCacheWarnings(result, `${modelId} docs page`)[0] || null,
        };
      } catch (error) {
        return {
          modelId,
          url,
          available: false,
          error: formatError(error),
          snapshots: [],
        };
      }
    }),
  );

  const latestSnapshot =
    pages.find((page) => page.modelId === "gpt-4o-mini-tts")?.snapshots?.slice(-1)[0] || null;
  const materialPayload = pages.map((page) => ({
    modelId: page.modelId,
    available: page.available,
    title: page.title || null,
    canonical: page.canonical || null,
    hasSpeechEndpoint: Boolean(page.hasSpeechEndpoint),
    snapshots: page.snapshots,
  }));
  const warnings = pages
    .flatMap((page) => {
      const pageWarnings = [];
      if (!page.available) {
        pageWarnings.push(`${page.modelId}: ${page.error}`);
      }
      if (page.warning) {
        pageWarnings.push(`${page.modelId}: ${page.warning}`);
      }
      return pageWarnings;
    });

  return {
    id: "openai-tts-model-pages",
    label: "OpenAI TTS model pages",
    category: "openai",
    url: "https://developers.openai.com/api/docs/models/gpt-4o-mini-tts",
    status: warnings.length ? "warning" : "ok",
    summary: latestSnapshot
      ? `Latest pinned gpt-4o-mini-tts snapshot: ${latestSnapshot}`
      : "Checked OpenAI TTS model pages for snapshot and endpoint changes.",
    materialKey: hashJson(materialPayload),
    warnings,
    meta: {
      latestSnapshot,
      pages,
    },
  };
}

async function collectMdnWebGpu({ timeoutMs: requestTimeoutMs }) {
  const url = "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API";
  try {
    const result = await fetchText(url, {
      cacheId: "mdn-webgpu",
      timeoutMs: requestTimeoutMs,
    });
    const { text, headers } = result;
    const title = matchTagContent(text, "title");
    const canonical = matchCanonical(text);
    const availability = matchPlainSentence(
      text,
      /<span[^>]*>\s*(Limited availability|Widely available|Newly available)\s*<\/span>/i,
    );
    const baselineDetail = matchPlainSentence(
      text,
      /<p>(This feature is .*?Baseline.*?)<\/p>/i,
    );
    const secureContext = matchPlainSentence(
      text,
      /<div class="notecard secure"><p><strong>Secure context:<\/strong>(.*?)<\/p>/i,
    );
    const description = matchMetaDescription(text);
    const materialPayload = {
      title,
      canonical,
      availability,
      baselineDetail,
      secureContext,
      description,
    };

    return {
      id: "mdn-webgpu",
      label: "MDN WebGPU API",
      category: "webgpu",
      url,
      status: getCacheWarnings(result, "MDN WebGPU reference page").length
        ? "warning"
        : "ok",
      summary: [availability, baselineDetail].filter(Boolean).join(" | ") || "Checked MDN WebGPU guidance.",
      materialKey: hashJson(materialPayload),
      warnings: getCacheWarnings(result, "MDN WebGPU reference page"),
      meta: {
        title,
        canonical,
        lastModified: headers.get("last-modified") || null,
        availability,
        baselineDetail,
        secureContext,
        description,
      },
    };
  } catch (error) {
    return buildWarningSource({
      id: "mdn-webgpu",
      label: "MDN WebGPU API",
      category: "webgpu",
      url,
      summary: "Unable to fetch the MDN WebGPU reference page.",
      warning: formatError(error),
      materialKey: "fetch-warning",
    });
  }
}

async function collectContext7Freshness({ timeoutMs: requestTimeoutMs, staleDays: maxSnapshotAgeDays }) {
  const agentsPath = path.resolve(cwd, "AGENTS.md");
  const content = existsSync(agentsPath) ? await readFile(agentsPath, "utf8") : "";
  const configuredUrl =
    content.match(/^\s*url:\s*(https?:\/\/[^\s]+)\s*$/m)?.[1] || null;
  const lastUpdatedText =
    content.match(/Last updated:\s*([0-9T:+.-]+Z?)/)?.[1] || null;
  const lastUpdated = lastUpdatedText ? new Date(lastUpdatedText) : null;
  const ageDays =
    lastUpdated && Number.isFinite(lastUpdated.getTime())
      ? Number(((Date.now() - lastUpdated.getTime()) / 86400000).toFixed(1))
      : null;
  const warnings = [];
  let remoteReachable = null;

  if (configuredUrl) {
    try {
      const result = await fetchText(configuredUrl, {
        cacheId: "context7-freshness",
        timeoutMs: requestTimeoutMs,
        accept: "application/json,text/plain,*/*",
      });
      remoteReachable = result.cacheState !== "cache-fallback";
      warnings.push(
        ...getCacheWarnings(result, "Context7 snapshot feed"),
      );
    } catch (error) {
      remoteReachable = false;
      warnings.push(`Remote snapshot unavailable: ${formatError(error)}`);
    }
  } else {
    warnings.push("No Context7 URL found in AGENTS.md.");
  }

  if (ageDays == null) {
    warnings.push("No Context7 snapshot timestamp found in AGENTS.md.");
  } else if (ageDays > maxSnapshotAgeDays) {
    warnings.push(
      `Context7 snapshot age ${ageDays}d exceeds ${maxSnapshotAgeDays}d threshold.`,
    );
  }

  return {
    id: "context7-freshness",
    label: "Context7 freshness",
    category: "docs",
    url: configuredUrl,
    status: warnings.length ? "warning" : "ok",
    summary:
      ageDays == null
        ? "Context7 snapshot timestamp missing."
        : `Context7 snapshot age: ${ageDays}d${remoteReachable === false ? " (remote unavailable)" : ""}`,
    materialKey: hashJson({
      configuredUrl,
      isStale: ageDays != null ? ageDays > maxSnapshotAgeDays : true,
    }),
    warnings,
    meta: {
      configuredUrl,
      lastUpdated: lastUpdatedText,
      ageDays,
      remoteReachable,
      staleDays: maxSnapshotAgeDays,
    },
  };
}

function compareStates(previousState, currentState) {
  if (!previousState) {
    return { materialChanges: [] };
  }

  const previousById = new Map(
    (previousState.sources || []).map((source) => [source.id, source]),
  );
  const materialChanges = [];

  for (const source of currentState.sources) {
    const previous = previousById.get(source.id);
    if (!previous) {
      materialChanges.push({
        id: source.id,
        label: source.label,
        reason: "New pulse source added.",
        previousSummary: null,
        currentSummary: source.summary,
      });
      continue;
    }

    if (previous.materialKey !== source.materialKey) {
      materialChanges.push({
        id: source.id,
        label: source.label,
        reason: `${source.label} changed materially.`,
        previousSummary: previous.summary || null,
        currentSummary: source.summary || null,
      });
    }
  }

  return { materialChanges };
}

function formatConsoleSummary(state, diff, { initialized, statePath: resolvedStatePath, reportPath: resolvedReportPath }) {
  const lines = [];
  if (initialized) {
    lines.push("[repo-pulse] No existing baseline found.");
  }
  lines.push(
    `[repo-pulse] ${diff.materialChanges.length > 0 ? `${diff.materialChanges.length} material change(s)` : "No material changes"} across ${state.sources.length} sources.`,
  );
  for (const source of state.sources) {
    lines.push(`- ${source.label}: ${source.status} | ${source.summary}`);
    for (const warning of source.warnings || []) {
      lines.push(`  warning: ${warning}`);
    }
  }
  if (writeState) {
    lines.push(
      `[repo-pulse] ${initialized || diff.materialChanges.length > 0 ? "Will write" : "No write needed for"} ${path.relative(cwd, resolvedStatePath)} and ${path.relative(cwd, resolvedReportPath)}.`,
    );
  }
  return lines.join("\n");
}

function formatReport(state, diff, { initialized }) {
  const lines = [
    "# Repo Pulse",
    "",
    `Checked: ${state.checkedAt}`,
    `Material changes: ${diff.materialChanges.length}`,
    initialized ? "Baseline: initialized on this run" : `Last material change: ${state.lastMaterialChangeAt || "none"}`,
    "",
  ];

  if (diff.materialChanges.length > 0) {
    lines.push("## Material changes", "");
    for (const change of diff.materialChanges) {
      lines.push(`- ${change.label}: ${change.reason}`);
      if (change.previousSummary) {
        lines.push(`  Before: ${change.previousSummary}`);
      }
      if (change.currentSummary) {
        lines.push(`  After: ${change.currentSummary}`);
      }
    }
    lines.push("");
  }

  lines.push("## Source status", "");
  for (const source of state.sources) {
    lines.push(`### ${source.label}`);
    lines.push(`- Status: ${source.status}`);
    if (source.url) {
      lines.push(`- URL: ${source.url}`);
    }
    lines.push(`- Summary: ${source.summary}`);
    for (const warning of source.warnings || []) {
      lines.push(`- Warning: ${warning}`);
    }
    if (source.meta?.lastModified) {
      lines.push(`- Last modified: ${source.meta.lastModified}`);
    }
    if (source.id === "openai-audio-rss" && source.meta?.latest) {
      lines.push(`- Latest matching item: ${source.meta.latest.title}`);
    }
    if (source.id === "openai-tts-model-pages" && source.meta?.latestSnapshot) {
      lines.push(`- Latest snapshot: ${source.meta.latestSnapshot}`);
    }
    if (source.id === "context7-freshness" && source.meta?.lastUpdated) {
      lines.push(`- Snapshot timestamp: ${source.meta.lastUpdated}`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

async function fetchText(
  url,
  {
    cacheId,
    timeoutMs: requestTimeoutMs,
    accept = "text/html,application/xml,application/json;q=0.9,*/*;q=0.8",
  },
) {
  const safeCacheId = String(cacheId || "source")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "source";

  return fetchTextWithCache({
    url,
    timeoutMs: requestTimeoutMs,
    maxRetries: pulseFetchRetries,
    baseDelayMs: pulseFetchBaseDelayMs,
    maxDelayMs: pulseFetchMaxDelayMs,
    useRetryAfter: true,
    readCacheOnError: true,
    cachePath: path.join(pulseCacheDir, `${safeCacheId}.body`),
    etagPath: path.join(pulseCacheDir, `${safeCacheId}.etag`),
    headers: {
      Accept: accept,
      "User-Agent": "personal-website-repo-pulse/1.0",
    },
  });
}

function getCacheWarnings(result, label) {
  if (!result || result.cacheState !== "cache-fallback" || !result.error) {
    return [];
  }
  return [`${label} served the last cached response after retries failed: ${formatError(result.error)}`];
}

function parseRssItems(xml) {
  return [...xml.matchAll(/<item>(.*?)<\/item>/gms)].map((match) => {
    const block = match[1];
    return {
      title: decodeXml(matchXmlTag(block, "title")),
      link: decodeXml(matchXmlTag(block, "link")),
      guid: decodeXml(matchXmlTag(block, "guid")),
      description: decodeXml(matchXmlTag(block, "description")),
      pubDate: decodeXml(matchXmlTag(block, "pubDate")),
    };
  });
}

function matchXmlTag(block, tag) {
  return block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "";
}

function matchTagContent(html, tag) {
  return decodeHtml(html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "");
}

function matchCanonical(html) {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] || null;
}

function matchMetaDescription(html) {
  return decodeHtml(
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1] || "",
  );
}

function matchPlainSentence(html, regex) {
  const value = html.match(regex)?.[1] || "";
  return collapseWhitespace(decodeHtml(stripTags(value)));
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function collapseWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function uniqueMatches(value, regex) {
  return Array.from(new Set(value.match(regex) || [])).sort();
}

function hashJson(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function buildWarningSource({ id, label, category, url, summary, warning, materialKey }) {
  return {
    id,
    label,
    category,
    url,
    status: "warning",
    summary,
    materialKey,
    warnings: [warning],
    meta: {},
  };
}

function decodeXml(value) {
  return decodeHtml(value);
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'");
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatError(error) {
  return collapseWhitespace(error?.message || String(error));
}

function formatDate(value) {
  if (!value) {
    return "unknown date";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(0, 10);
}

async function readJsonIfExists(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }
  return JSON.parse(await readFile(filePath, "utf8"));
}

function toPositiveNumber(rawValue, fallback) {
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toNonNegativeInteger(rawValue, fallback) {
  const parsed = Number(rawValue);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

async function writeGithubOutputs(values) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) {
    return;
  }
  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`);
  await appendFile(githubOutput, `${lines.join("\n")}\n`, "utf8");
}

function parseArgs(rawArgs) {
  const parsed = {
    writeState: false,
    strict: false,
  };

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === "--write-state") {
      parsed.writeState = true;
      continue;
    }
    if (arg === "--strict") {
      parsed.strict = true;
      continue;
    }
    if (arg.startsWith("--state=")) {
      parsed.state = arg.slice("--state=".length);
      continue;
    }
    if (arg === "--state" && rawArgs[index + 1]) {
      parsed.state = rawArgs[index + 1];
      index += 1;
      continue;
    }
    if (arg.startsWith("--report=")) {
      parsed.report = arg.slice("--report=".length);
      continue;
    }
    if (arg === "--report" && rawArgs[index + 1]) {
      parsed.report = rawArgs[index + 1];
      index += 1;
    }
  }

  return parsed;
}
