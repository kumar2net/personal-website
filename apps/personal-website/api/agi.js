import crypto from "node:crypto";
import OpenAI from "openai";
import { searchBlogByQuery } from "./semantic-search.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function parseIntEnv(name, fallback) {
  const raw = process.env[name];
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseFloatEnv(name, fallback, min = -1, max = 1) {
  const raw = process.env[name];
  if (typeof raw !== "string") return fallback;
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return fallback;
  return parsed;
}

function parseBooleanEnv(name, fallback) {
  const raw = process.env[name];
  if (typeof raw !== "string") return fallback;
  const normalized = raw.trim().toLowerCase();
  if (["1", "true", "yes", "on", "enabled"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "disabled"].includes(normalized)) return false;
  return fallback;
}

function parseCsvList(name, fallback = []) {
  const raw = process.env[name];
  if (typeof raw !== "string") return [...fallback];
  const parsed = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (!parsed.length) return [...fallback];
  return [...new Set(parsed)];
}

const MAX_INPUT_CHARS = parseIntEnv("AGI_MAX_INPUT_CHARS", 2400);
const MAX_ACTIONS = parseIntEnv("AGI_MAX_ACTIONS", 3);
const ENABLE_BLOG_CONTEXT = parseBooleanEnv("AGI_ENABLE_BLOG_CONTEXT", true);
const ENABLE_WEB_CONTEXT = parseBooleanEnv("AGI_ENABLE_WEB_CONTEXT", true);
const BLOG_CONTEXT_TOP_K = parseIntEnv("AGI_BLOG_CONTEXT_TOP_K", 4);
const BLOG_CONTEXT_MIN_SCORE = parseFloatEnv(
  "AGI_BLOG_CONTEXT_MIN_SCORE",
  0.18,
  -1,
  1,
);
const WEB_CONTEXT_TOP_K = parseIntEnv("AGI_WEB_CONTEXT_TOP_K", 3);
const BLOG_CONTEXT_TRIGGER_TERMS = parseCsvList("AGI_BLOG_CONTEXT_TRIGGER_TERMS", []);
const WEB_SEARCH_ENDPOINT = (process.env.AGI_WEB_SEARCH_ENDPOINT || "duckduckgo")
  .trim()
  .toLowerCase();
const WEB_SEARCH_TIMEOUT_MS = parseIntEnv("AGI_WEB_SEARCH_TIMEOUT_MS", 4500);

function parseModelList(value) {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
}

const RAW_CANDIDATE_MODELS = [
  ...parseModelList(process.env.AGI_OPENAI_MODELS),
  process.env.AGI_OPENAI_MODEL,
  process.env.OPENAI_CHAT_MODEL,
  process.env.OPENAI_MODEL || "gpt-5.2",
  "gpt-5.2",
  "gpt-4.1-mini",
  "gpt-4o-mini",
  "gpt-4o",
];

const MODE_OPTIONS = {
  quick: {
    label: "Quick",
    maxOutputTokens: 180,
    temperature: 0.25,
    instruction:
      "Give a short, practical answer plus 2 concrete next actions. Keep tone energetic and direct.",
  },
  practical: {
    label: "Practical",
    maxOutputTokens: 260,
    temperature: 0.3,
    instruction:
      "Give a practical recommendation with assumptions, risks, and 2-3 execution actions.",
  },
  deep: {
    label: "Deep",
    maxOutputTokens: 420,
    temperature: 0.3,
    instruction:
      "Give a deeper view with trade-offs, one concrete roadmap, and up to 3 actions.",
  },
};

const DEFAULT_MODEL = RAW_CANDIDATE_MODELS[0] || "gpt-5.2";

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

function normalizeMode(value) {
  if (typeof value !== "string") return "quick";
  const normalized = value.toLowerCase().trim();
  return MODE_OPTIONS[normalized] ? normalized : "quick";
}

function shouldUseBlogContext(prompt) {
  if (!ENABLE_BLOG_CONTEXT) {
    return false;
  }

  if (!Array.isArray(BLOG_CONTEXT_TRIGGER_TERMS) || !BLOG_CONTEXT_TRIGGER_TERMS.length) {
    return true;
  }

  const lower = prompt.toLowerCase();
  return BLOG_CONTEXT_TRIGGER_TERMS.some((term) => lower.includes(term));
}

function buildContextBlock(results = []) {
  if (!Array.isArray(results) || !results.length) {
    return {
      used: false,
      block: "",
      sources: [],
    };
  }

  const normalizedResults = results
    .map((result) => ({
      id: result.id || "",
      title: result.title || "Unknown",
      url: result.url || "",
      score: Number.isFinite(result.score) ? result.score : null,
      excerpt: result.excerpt || "",
      source: result.source || "blog",
    }))
    .filter((result) => result.excerpt);

  if (!normalizedResults.length) {
    return {
      used: false,
      block: "",
      sources: [],
    };
  }

  const bySource = normalizedResults.reduce((acc, item) => {
    const label = item.source === "web" ? "web search" : "Kumar posts";
    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(item);
    return acc;
  }, {});

  const blockLines = [];
  Object.entries(bySource).forEach(([label, items]) => {
    blockLines.push(`Context source: ${label}.`);
    items.forEach((item, index) =>
      blockLines.push(
        `${index + 1}. ${item.title} (${item.url}): ${item.excerpt}`,
      ),
    );
    blockLines.push("");
  });

  blockLines.push(
    "If no relevant context is present, answer from general reasoning and call it out.",
  );

  const block = blockLines.join("\n");

  return {
    used: true,
    block,
    sources: normalizedResults,
  };
}

async function fetchBlogContext(prompt) {
  if (!shouldUseBlogContext(prompt)) {
    return [];
  }

  try {
    const searchResults = await searchBlogByQuery(prompt, { topK: BLOG_CONTEXT_TOP_K });
    const safeResults = Array.isArray(searchResults) ? searchResults : [];
    const qualified = safeResults.filter(
      (result) =>
        typeof result === "object" &&
        Number.isFinite(result.score) &&
        result.score >= BLOG_CONTEXT_MIN_SCORE,
    );

    if (qualified.length > 0) {
      return qualified;
    }

    return [];
  } catch (error) {
    console.error("AGI blog context lookup failed", error);
    return [];
  }
}

function decodeHtmlEntities(value) {
  if (typeof value !== "string") return "";

  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_match, code) => {
      const charCode = Number.parseInt(code, 10);
      return Number.isFinite(charCode) ? String.fromCharCode(charCode) : "";
    });
}

function stripHtmlTags(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function stripMarkdown(value) {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\*\*|__/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[(?:[^\]]+)\]\[[^\]]*\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanWebSnippet(value) {
  return stripMarkdown(stripHtmlTags(decodeHtmlEntities(value || "")))
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);
}

function normalizeDuckDuckGoUrl(href) {
  if (typeof href !== "string") return "";

  if (href.startsWith("//duckduckgo.com/l/")) {
    try {
      const resolved = new URL(`https:${href}`);
      const target = resolved.searchParams.get("uddg");
      if (target) {
        return decodeURIComponent(target);
      }
    } catch {
      return "";
    }
  }

  if (href.startsWith("//")) {
    return `https:${href}`;
  }

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  return "";
}

async function fetchDuckDuckGoLiteContext(prompt) {
  const query = prompt.trim();
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, Math.max(2500, WEB_SEARCH_TIMEOUT_MS));

  try {
    const searchUrl = `https://r.jina.ai/http://duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/plain",
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      return [];
    }

    const raw = await response.text();
    const markerRegex =
      /^\s*\d+\.\[(.*?)\]\((https?:\/\/duckduckgo\.com\/l\/\?uddg=[^)]+)\)\s*\n([\s\S]*?)(?=\n\s*\d+\.|$)/gm;
    const results = [];
    let match;

    while ((match = markerRegex.exec(raw)) !== null) {
      if (results.length >= WEB_CONTEXT_TOP_K) {
        break;
      }

      const rawUrl = normalizeDuckDuckGoUrl(match[2]);
      if (!rawUrl) {
        continue;
      }

      const rawTitle = decodeHtmlEntities(match[1] || "").trim();
      if (!rawTitle) {
        continue;
      }

      const snippetLines = (match[3] || "")
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const rawExcerpt = snippetLines[0] || "";
      const excerpt = cleanWebSnippet(rawExcerpt);
      if (!excerpt) {
        continue;
      }

      results.push({
        id: `web-${results.length + 1}`,
        title: rawTitle,
        url: rawUrl,
        score: 1,
        excerpt,
        source: "web",
      });
    }

    return results;
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchDuckDuckGoHtmlContext(prompt) {
  const query = prompt.trim();
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, Math.max(2500, WEB_SEARCH_TIMEOUT_MS));

  try {
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html",
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const resultRegex =
      /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
    const results = [];
    let match;

    while ((match = resultRegex.exec(html)) !== null) {
      if (results.length >= WEB_CONTEXT_TOP_K) {
        break;
      }

      const rawUrl = normalizeDuckDuckGoUrl(match[1]);
      if (!rawUrl) {
        continue;
      }

      const rawTitle = decodeHtmlEntities(stripHtmlTags(match[2])).trim();
      const rawExcerpt = cleanWebSnippet(match[3] || "");
      if (!rawTitle || !rawExcerpt) {
        continue;
      }

      results.push({
        id: `web-${results.length + 1}`,
        title: rawTitle,
        url: rawUrl,
        score: 1,
        excerpt: rawExcerpt,
        source: "web",
      });
    }

    return results;
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWebContext(prompt) {
  if (!ENABLE_WEB_CONTEXT) {
    return [];
  }

  if (typeof prompt !== "string" || !prompt.trim()) {
    return [];
  }

  if (WEB_SEARCH_ENDPOINT === "duckduckgo-lite") {
    return fetchDuckDuckGoLiteContext(prompt);
  }

  if (WEB_SEARCH_ENDPOINT === "duckduckgo-html") {
    return fetchDuckDuckGoHtmlContext(prompt);
  }

  const liteContext = await fetchDuckDuckGoLiteContext(prompt);
  if (liteContext.length > 0) {
    return liteContext;
  }

  return fetchDuckDuckGoHtmlContext(prompt);
}

async function collectContext(prompt) {
  const shouldSearchBlog = shouldUseBlogContext(prompt);
  const attempted = shouldSearchBlog || ENABLE_WEB_CONTEXT;
  const blogContext = shouldSearchBlog ? await fetchBlogContext(prompt) : [];
  const hasBlogContext = Array.isArray(blogContext) && blogContext.length > 0;
  const webContext = !hasBlogContext ? await fetchWebContext(prompt) : [];

  return {
    attempted,
    results: [...(blogContext || []), ...(webContext || [])],
  };
}

function limitActions(actions = []) {
  if (!Array.isArray(actions)) return [];
  return actions
    .map((action) => (typeof action === "string" ? action.trim() : ""))
    .filter(Boolean)
    .filter((action) => action.length <= 220)
    .slice(0, MAX_ACTIONS);
}

function clampPrompt(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_INPUT_CHARS);
}

function hashInput(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
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

  if (!rawBody) return {};
  return JSON.parse(rawBody);
}

function uniqueModels() {
  const normalized = RAW_CANDIDATE_MODELS
    .filter(Boolean)
    .map((model) => String(model).trim())
    .filter(Boolean);

  const defaults = ["gpt-4.1-mini", "gpt-4o-mini", "gpt-4o"];
  const list = [...normalized, ...defaults];

  const deduped = [];
  for (const model of list) {
    if (!deduped.includes(model)) {
      deduped.push(model);
    }
  }

  return deduped;
}

function buildSystemPrompt(mode) {
  const config = MODE_OPTIONS[mode];
  return [
    "You are a concise AGI-style assistant for a public personal website.",
    "Audience: Gen Z and Millennials who want fast, practical action, not theory.",
    "Keep language crisp, inclusive, and ready to execute.",
    `Mode: ${config.label}. ${config.instruction}`,
    "Return strict JSON only in this exact shape:",
    '{"answer":"...", "nextActions":["...","..."], "caveat":"..."}',
    "No markdown fences. Keep nextActions short and concrete.",
  ].join(" ");
}

function buildUserPrompt(prompt, maxActions, contextBlock = "") {
  const contextPart = contextBlock ? `\n${contextBlock}\n` : "";
  return [
    `User request: ${prompt}`,
    contextPart,
    `Please return 1 JSON field named answer,`,
    `${maxActions} or fewer short items in nextActions,`,
    "and an optional caveat if there are risks or trade-offs.",
    "Do not add any surrounding text outside JSON.",
  ].join(" ");
}

function extractTextFromResponsesData(data) {
  if (!data) return "";

  if (typeof data.output_text === "string") {
    return data.output_text.trim();
  }

  const messages = Array.isArray(data.output)
    ? data.output
    : [];

  const textParts = [];

  for (const item of messages) {
    if (!item || typeof item !== "object") continue;
    if (item.type === "message" && Array.isArray(item.content)) {
      for (const chunk of item.content) {
        if (!chunk || typeof chunk !== "object") continue;
        if (typeof chunk.text === "string") {
          textParts.push(chunk.text);
        }
      }
    }
  }

  return textParts.join(" ").trim();
}

function extractTextFromChatData(data) {
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content.trim();
  }
  return "";
}

function extractJsonObject(rawText) {
  if (typeof rawText !== "string") return null;

  const fencedMatch = rawText.match(/```json\s*([\s\S]*?)```/i);
  const candidate = (fencedMatch ? fencedMatch[1] : rawText).trim();

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    const parsed = JSON.parse(candidate.slice(start, end + 1));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function parseResponseText(rawText, mode) {
  const parsed = extractJsonObject(rawText) || {};

  const answerSource =
    typeof parsed.answer === "string" && parsed.answer.trim()
      ? parsed.answer.trim()
      : "";

  const caveatSource =
    typeof parsed.caveat === "string" ? parsed.caveat.trim() : "";

  const nextActions = limitActions(parsed.nextActions);

  const fallbackFromText = rawText
    ? rawText
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

  return {
    answer:
      answerSource ||
      fallbackFromText.slice(0, MODE_OPTIONS[mode].maxOutputTokens),
    caveat: caveatSource,
    nextActions,
    contextUsed: false,
    contextSources: [],
  };
}

function buildErrorPayload(message, detail, status = 500) {
  return {
    error: message,
    detail,
    status,
  };
}

async function callResponsesAPI(client, payload, mode, model) {
  const { maxOutputTokens, temperature } = MODE_OPTIONS[mode];
  const config = {
    model,
    input: [
      {
        role: "system",
        content: buildSystemPrompt(mode),
      },
      {
        role: "user",
        content: payload,
      },
    ],
    max_output_tokens: maxOutputTokens,
    temperature,
  };

  const response = await client.responses.create(config);
  const outputText = extractTextFromResponsesData(response);

  if (!outputText) {
    throw new Error("Responses API returned no output text");
  }

  return {
    provider: "responses",
    model: response?.model || model,
    text: outputText,
  };
}

async function callChatFallback(client, payload, mode, model) {
  const { maxOutputTokens, temperature } = MODE_OPTIONS[mode];

  const systemPrompt = buildSystemPrompt(mode);

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: payload,
      },
    ],
    temperature,
    max_tokens: Math.min(700, maxOutputTokens + 80),
    response_format: {
      type: "json_object",
    },
  });

  const text = extractTextFromChatData(completion);
  if (!text) {
    throw new Error("Chat fallback returned no output");
  }

  return {
    provider: "chat",
    model: completion?.model || model,
    text,
  };
}

async function runInference(prompt, mode) {
  const { attempted: contextAttempted, results: contextResults } = await collectContext(
    prompt,
  );
  const { used, block, sources } = buildContextBlock(contextResults);
  const request = buildUserPrompt(prompt, MAX_ACTIONS, used ? block : "");
  const parsedContext = {
    contextAttempted,
    contextUsed: used,
    contextSources: used ? sources : [],
  };
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const apiKeys = process.env.OPENAI_API_KEY;
  const client = new OpenAI({ apiKey: apiKeys });

  let lastError = null;

  for (const model of uniqueModels()) {
    try {
      try {
        const responsesResponse = await callResponsesAPI(
          client,
          request,
          mode,
          model,
        );
        return {
          provider: responsesResponse.provider,
          model: responsesResponse.model,
          parsed: {
            ...parseResponseText(responsesResponse.text, mode),
            ...parsedContext,
          },
          modelTried: model,
        };
      } catch (responsesError) {
        lastError = responsesError;
        const chatResponse = await callChatFallback(
          client,
          request,
          mode,
          model,
        );
        return {
          provider: chatResponse.provider,
          model: chatResponse.model,
          parsed: {
            ...parseResponseText(chatResponse.text, mode),
            ...parsedContext,
          },
          modelTried: model,
        };
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (!lastError) {
    lastError = new Error("No model available");
  }

  throw lastError;
}

function resolveModeMeta(mode) {
  return {
    mode,
    modeLabel: MODE_OPTIONS[mode].label,
    maxOutputTokens: MODE_OPTIONS[mode].maxOutputTokens,
  };
}

export const runtime = "nodejs";

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST with JSON { prompt, mode }." });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    console.error("Failed to parse AGI request body", error);
    return res
      .status(400)
      .json(buildErrorPayload("Invalid JSON payload", error?.message || ""));
  }

  const requestedMode = normalizeMode(payload?.mode);
  const rawPrompt = typeof payload?.prompt === "string" ? payload.prompt : "";
  const normalizedPrompt = clampPrompt(rawPrompt);

  if (!rawPrompt.trim()) {
    return res
      .status(400)
      .json(buildErrorPayload("Missing or empty prompt", "Provide non-empty prompt."));
  }

  if (rawPrompt.replace(/\s+/g, " ").trim().length > MAX_INPUT_CHARS) {
    return res.status(413).json(
      buildErrorPayload(
        "Prompt too long.",
        `Limit ${MAX_INPUT_CHARS} characters. Current: ${rawPrompt.length}.`,
      ),
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json(
      buildErrorPayload(
        "AGI assistant unavailable",
        "Set OPENAI_API_KEY on the server.",
      ),
    );
  }

  try {
    const result = await runInference(normalizedPrompt, requestedMode);
    const response = {
      answer: result.parsed.answer,
      nextActions: result.parsed.nextActions,
      caveat: result.parsed.caveat,
      contextAttempted: Boolean(result.parsed.contextAttempted),
      contextUsed: Boolean(result.parsed.contextUsed),
      contextSources: Array.isArray(result.parsed.contextSources)
        ? result.parsed.contextSources
            .filter((source) => source && typeof source === "object")
              .map((source) => ({
                id: source.id || "",
                title: source.title || "Unknown",
                source: source.source || "",
                url: source.url || "",
                score:
                  typeof source.score === "number" && Number.isFinite(source.score)
                    ? source.score
                    : null,
            }))
            .filter((source) => source.title || source.url)
        : [],
      mode: requestedMode,
      model: result.model || DEFAULT_MODEL,
      provider: result.provider,
      modelTried: result.modelTried || DEFAULT_MODEL,
      inputHash: hashInput(normalizedPrompt),
      created: Math.floor(Date.now() / 1000),
      meta: resolveModeMeta(requestedMode),
    };

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(response);
  } catch (error) {
    console.error("AGI handler failed", error);
    return res.status(500).json(
      buildErrorPayload(
        "Failed to generate response",
        error?.message || "Unknown error",
      ),
    );
  }
}
