import crypto from "node:crypto";
import OpenAI from "openai";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const KEYWORDS = [
  "learn",
  "build",
  "launch",
  "plan",
  "impact",
  "insight",
  "next",
  "future",
  "recommend",
  "shipping",
  "problem",
  "solution",
];

const MAX_INPUT_CHARS = Number(process.env.TLDR_MAX_INPUT_CHARS || 6000);
const DEFAULT_MODEL = process.env.TLDR_OPENAI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
const providerPreference = (process.env.TLDR_PROVIDER || "auto").toLowerCase();
const mustFake = process.env.TLDR_DEV_FAKE === "1" || providerPreference === "fake";
const forceLocal = providerPreference === "local";
const fallbackOnError = process.env.TLDR_DEV_FALLBACK_ON_ERROR !== "0";
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);

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

  if (!rawBody) return {};
  return JSON.parse(rawBody);
}

function hashInput(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function clampContent(content) {
  if (!content || typeof content !== "string") return "";
  return content.replace(/\s+/g, " ").trim().slice(0, MAX_INPUT_CHARS);
}

function rankSentences(text) {
  if (!text) return [];
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((sentence) => sentence.length >= 30);

  return sentences
    .map((sentence, index) => {
      const lower = sentence.toLowerCase();
      const keywordScore = KEYWORDS.reduce(
        (score, keyword) => score + (lower.includes(keyword) ? 1 : 0),
        0,
      );
      const positionBoost = Math.max(0, 2 - index * 0.15);
      return { sentence, score: keywordScore + positionBoost };
    })
    .sort((a, b) => b.score - a.score);
}

function buildHeuristicSummary(text, slug) {
  const ranked = rankSentences(text);
  const picked = [];

  for (const candidate of ranked) {
    if (picked.length >= 3) break;
    if (!picked.includes(candidate.sentence)) {
      picked.push(candidate.sentence);
    }
  }

  const combined = picked.join(" ").trim();
  if (combined) {
    return combined.length > 420 ? `${combined.slice(0, 417)}…` : combined;
  }

  const fallback = text?.slice(0, 240)?.trim();
  if (fallback) return fallback;
  return `Quick note: ${slug || "this post"} was shared without enough context to summarize.`;
}

function buildFakeSummary(slug) {
  const topic = slug || "this post";
  return `Preview unavailable in dev mode. Imagine two crisp sentences highlighting why ${topic} matters and what to explore next.`;
}

async function generateWithOpenAI(content, slug) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const excerpt = clampContent(content);
  const userPrompt = [
    `Slug: ${slug}`,
    "Task: Summarize the blog post content below into two punchy sentences (max 400 characters total).",
    "Avoid headings, emojis, or bullet markers. Sound like an editor recapping the key insights and next actions.",
    `Content: """${excerpt}"""`,
  ].join("\n\n");

  const completion = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You craft concise TL;DR summaries for a personal website. Aim for two clear sentences that cover insight + action.",
      },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 220,
  });

  const summary = completion.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    throw new Error("OpenAI returned an empty summary");
  }

  return {
    summary,
    model: completion.model || DEFAULT_MODEL,
    fallback: false,
  };
}

async function buildSummary(content, slug) {
  if (mustFake) {
    return { summary: buildFakeSummary(slug), model: "dev-fake", fallback: true };
  }

  const cleaned = clampContent(content);
  if (!cleaned) {
    throw new Error("Content is empty");
  }

  if (!forceLocal && hasOpenAIKey) {
    try {
      return await generateWithOpenAI(cleaned, slug);
    } catch (error) {
      console.error("OpenAI TLDR generation failed", error);
      if (!fallbackOnError) {
        throw error;
      }
    }
  }

  return {
    summary: buildHeuristicSummary(cleaned, slug),
    model: hasOpenAIKey && !forceLocal ? `${DEFAULT_MODEL}-fallback` : "heuristic",
    fallback: true,
  };
}

export const runtime = "nodejs";

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST with JSON { content, slug }." });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    console.error("Failed to parse TLDR request body", error);
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  const slug = typeof payload?.slug === "string" && payload.slug.trim() ? payload.slug.trim() : "post";
  const content = typeof payload?.content === "string" ? payload.content : "";

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Request must include non-empty content string" });
  }

  if (content.length > MAX_INPUT_CHARS * 4) {
    return res.status(413).json({
      error: `Content too large. Limit to ~${MAX_INPUT_CHARS} characters (current: ${content.length}).`,
    });
  }

  const normalized = clampContent(content);
  const inputHash = hashInput(normalized);

  try {
    const { summary, model, fallback } = await buildSummary(normalized, slug);

    return res.status(200).json({
      summary,
      model,
      fallback,
      inputHash,
      created: Math.floor(Date.now() / 1000),
    });
  } catch (error) {
    console.error("TLDR handler failed", error);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
}
