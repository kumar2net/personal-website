import OpenAI from "openai";
import { recordTokenUsage } from "../../../scripts/token-usage.mjs";
import { ananyasLocalGuide } from "../src/data/ananyasLocalGuide.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_MODEL =
  process.env.LOCAL_GUIDE_OPENAI_MODEL ||
  process.env.OPENAI_MODEL ||
  "gpt-4.1-mini";
const MAX_QUESTION_CHARS = Number(
  process.env.LOCAL_GUIDE_MAX_QUESTION_CHARS || 480,
);
const SITE_URL = (process.env.VITE_SITE_URL || "https://www.kumar2net.com")
  .trim()
  .replace(/\/+$/, "");
const GUIDE_URL = `${SITE_URL}/local/ananyas-nearby`;

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "around",
  "at",
  "best",
  "can",
  "do",
  "for",
  "from",
  "get",
  "help",
  "i",
  "in",
  "is",
  "me",
  "my",
  "near",
  "need",
  "of",
  "on",
  "or",
  "please",
  "should",
  "the",
  "to",
  "we",
  "what",
  "where",
  "which",
  "with",
]);

const CATEGORY_HINTS = {
  fruits: ["fruit", "fruits", "vegetable", "vegetables", "produce"],
  flowers: ["flower", "flowers", "garland", "garlands", "bouquet", "pooja"],
  medicines: [
    "medicine",
    "medicines",
    "medical",
    "medicals",
    "pharmacy",
    "tablet",
    "tablets",
    "prescription",
  ],
  groceries: [
    "grocery",
    "groceries",
    "milk",
    "curd",
    "paneer",
    "bread",
    "dairy",
    "store",
    "supermarket",
    "staples",
  ],
  services: [
    "taxi",
    "cab",
    "driver",
    "repair",
    "plumber",
    "plumbing",
    "electrical",
    "electrician",
    "hospital",
    "diagnostic",
    "diagnostics",
    "physio",
    "physiotherapy",
    "appliance",
  ],
};

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    if (Buffer.isBuffer(req.body)) {
      const text = req.body.toString("utf8").trim();
      return text ? JSON.parse(text) : {};
    }
    if (req.body instanceof Uint8Array) {
      const text = Buffer.from(req.body).toString("utf8").trim();
      return text ? JSON.parse(text) : {};
    }
    return req.body;
  }

  if (typeof req.body === "string") {
    return req.body.trim() ? JSON.parse(req.body) : {};
  }

  const rawBody = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

  return rawBody ? JSON.parse(rawBody) : {};
}

function normalizeQuestion(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, MAX_QUESTION_CHARS);
}

function getVerificationLabel(item) {
  if (item.verificationMethod === "official-site") return "Official site";
  if (item.verificationMethod === "shortlist-only") return "Shortlist only";
  return "Directory only";
}

function flattenGuide(guide) {
  const listings = guide.categories.flatMap((category) =>
    category.items.map((item) => ({
      type: "listing",
      name: item.name,
      categoryId: category.id,
      categoryTitle: category.title,
      area: item.area,
      address: item.address,
      hours: item.hours || "Check timings directly",
      note: item.note || "",
      sourceLabel: item.sourceLabel || "",
      sourceUrl: item.sourceUrl || "",
      mapUrl: item.mapUrl || "",
      verifiedAt: item.verifiedAt || "",
      staleAfterDays: Number(item.staleAfterDays) || 30,
      verificationLabel: getVerificationLabel(item),
      searchText: [
        item.name,
        category.title,
        category.id,
        item.area,
        item.address,
        item.note,
        item.sourceLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    })),
  );

  const watchlist = guide.nextUsefulAdditions.map((item) => ({
    type: "watchlist",
    name: item.title,
    categoryId: "watchlist",
    categoryTitle: "Next useful additions",
    area: "Needs field verification",
    address: "",
    hours: "Check directly",
    note: item.description || "",
    sourceLabel: item.sourceLabel || "",
    sourceUrl: item.shortlistUrl || "",
    mapUrl: "",
    verifiedAt: item.verifiedAt || "",
    staleAfterDays: Number(item.staleAfterDays) || 30,
    verificationLabel: getVerificationLabel(item),
    shortlistLabel: item.shortlistLabel || "",
    examples: Array.isArray(item.examples) ? item.examples : [],
    searchText: [
      item.title,
      item.description,
      item.shortlistLabel,
      item.examples?.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  }));

  return [...listings, ...watchlist];
}

const GUIDE_ENTRIES = flattenGuide(ananyasLocalGuide);
const GUIDE_ENTRY_BY_NAME = new Map(
  GUIDE_ENTRIES.map((entry) => [entry.name.toLowerCase(), entry]),
);

function buildGuideContext(guide, entries) {
  const lines = [
    `Guide title: ${guide.title}`,
    `Community: ${guide.communityName}`,
    `Address: ${guide.communityAddress}`,
    `Compiled on: ${guide.compiledOn}`,
    "Notes:",
    ...guide.notes.map((note) => `- ${note}`),
    "",
    "Listings:",
  ];

  entries
    .filter((entry) => entry.type === "listing")
    .forEach((entry) => {
      lines.push(
        [
          `- Name: ${entry.name}`,
          `Category: ${entry.categoryTitle}`,
          `Area: ${entry.area}`,
          `Address: ${entry.address}`,
          `Hours: ${entry.hours}`,
          `Note: ${entry.note}`,
          `Verification: ${entry.verificationLabel}`,
          `VerifiedAt: ${entry.verifiedAt || "Unknown"}`,
          `SourceLabel: ${entry.sourceLabel}`,
          `SourceUrl: ${entry.sourceUrl}`,
          `MapUrl: ${entry.mapUrl}`,
        ].join(" | "),
      );
    });

  lines.push("", "Watchlist additions:");

  entries
    .filter((entry) => entry.type === "watchlist")
    .forEach((entry) => {
      lines.push(
        [
          `- Name: ${entry.name}`,
          `Category: ${entry.categoryTitle}`,
          `Description: ${entry.note}`,
          `ShortlistLabel: ${entry.shortlistLabel || ""}`,
          `Examples: ${entry.examples.join(" ; ")}`,
          `Verification: ${entry.verificationLabel}`,
          `SourceLabel: ${entry.sourceLabel}`,
          `SourceUrl: ${entry.sourceUrl}`,
        ].join(" | "),
      );
    });

  return lines.join("\n");
}

const GUIDE_CONTEXT = buildGuideContext(ananyasLocalGuide, GUIDE_ENTRIES);

function normalizeTokens(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function recordOpenAIUsage(response) {
  const usage = response?.usage || {};
  const inputTokens = normalizeTokens(
    usage.input_tokens ?? usage.prompt_tokens ?? 0,
  );
  const outputTokens = normalizeTokens(
    usage.output_tokens ?? usage.completion_tokens ?? 0,
  );
  const totalTokens = normalizeTokens(
    usage.total_tokens ?? inputTokens + outputTokens,
  );

  if (!inputTokens && !outputTokens && !totalTokens) {
    return;
  }

  recordTokenUsage({
    provider: "openai",
    route: "local-guide-query",
    model: response?.model || DEFAULT_MODEL,
    request_id: response?.id,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: totalTokens,
  });
}

function parseResponseJSON(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    try {
      return JSON.parse(response.output_text);
    } catch {
      // Fall through to chunked parsing.
    }
  }

  const chunks = response?.output || [];
  for (const chunk of chunks) {
    const content = Array.isArray(chunk?.content) ? chunk.content : [];
    for (const part of content) {
      if (part?.type === "output_text" && typeof part.text === "string") {
        try {
          return JSON.parse(part.text);
        } catch {
          continue;
        }
      }
    }
  }

  return null;
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length > 2)
    .filter((token) => !STOP_WORDS.has(token));
}

function matchesCategoryHint(entry, tokens) {
  const hints = CATEGORY_HINTS[entry.categoryId] || [];
  return hints.some((hint) => tokens.includes(hint));
}

function scoreEntry(entry, tokens, questionLower) {
  let score = 0;
  const haystack = entry.searchText;
  const lowerName = entry.name.toLowerCase();

  if (questionLower.includes(lowerName)) {
    score += 8;
  }

  if (matchesCategoryHint(entry, tokens)) {
    score += 3;
  }

  tokens.forEach((token) => {
    if (haystack.includes(token)) {
      score += 1;
    }
  });

  if (entry.type === "listing") {
    score += 1;
  }

  if (entry.type === "watchlist") {
    score -= 0.5;
  }

  return score;
}

function joinNames(entries) {
  if (!entries.length) return "";
  if (entries.length === 1) return entries[0].name;
  if (entries.length === 2) return `${entries[0].name} and ${entries[1].name}`;
  return `${entries
    .slice(0, -1)
    .map((entry) => entry.name)
    .join(", ")}, and ${entries.at(-1)?.name}`;
}

function dedupeNames(names = []) {
  return Array.from(
    new Set(
      names
        .map((name) => String(name || "").trim())
        .filter(Boolean),
    ),
  );
}

function toSuggestedListings(names = []) {
  return dedupeNames(names)
    .map((name) => GUIDE_ENTRY_BY_NAME.get(name.toLowerCase()))
    .filter(Boolean)
    .slice(0, 4)
    .map((entry) => ({
      name: entry.name,
      categoryTitle: entry.categoryTitle,
      area: entry.area,
      note: entry.note,
      hours: entry.hours,
      sourceLabel: entry.sourceLabel,
      sourceUrl: entry.sourceUrl,
      mapUrl: entry.mapUrl,
      verificationLabel: entry.verificationLabel,
      type: entry.type,
    }));
}

function buildShareText(question, answer) {
  return [
    "Ananyas nearby guide",
    `Q: ${question}`,
    `A: ${String(answer || "").replace(/\s+/g, " ").trim()}`,
    GUIDE_URL,
  ].join("\n");
}

function buildHeuristicResult(question) {
  const questionLower = question.toLowerCase();
  const tokens = tokenize(question);
  const ranked = GUIDE_ENTRIES.map((entry) => ({
    ...entry,
    score: scoreEntry(entry, tokens, questionLower),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    const answer =
      "I could not find a direct match in this guide. Try asking about medicines, milk, groceries, flowers, taxis, repairs, diagnostics, or tiffin backup. This page only covers the listed nearby options and watchlist additions around Ananyas Phase 7.";
    return {
      answer,
      confidence: "not_in_guide",
      suggestedListings: [],
      shareText: buildShareText(question, answer),
      model: "heuristic",
      provider: "heuristic",
      fallback: true,
    };
  }

  const topListings = ranked.filter((entry) => entry.type === "listing").slice(0, 3);
  const topEntries = (topListings.length ? topListings : ranked.slice(0, 3)).slice(0, 3);
  const summaryPrefix =
    topEntries[0]?.type === "watchlist"
      ? "The guide does not show a fully verified direct listing, but the closest watchlist leads are"
      : "The strongest matches in this guide are";
  const answer = `${summaryPrefix} ${joinNames(topEntries)}. ${topEntries
    .map((entry) => `${entry.name} is in ${entry.area}`)
    .join("; ")}. Recheck live timing and availability before depending on any listing.`;

  return {
    answer,
    confidence: topEntries[0]?.type === "watchlist" ? "partial" : "grounded",
    suggestedListings: toSuggestedListings(topEntries.map((entry) => entry.name)),
    shareText: buildShareText(question, answer),
    model: "heuristic",
    provider: "heuristic",
    fallback: true,
  };
}

async function askOpenAI(question) {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const client = new OpenAI({ apiKey });
  const schema = {
    name: "local_guide_answer",
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["answer", "confidence", "suggestedListingNames"],
      properties: {
        answer: {
          type: "string",
          description:
            "Short answer grounded only in the guide data. Keep it practical and concise.",
        },
        confidence: {
          type: "string",
          enum: ["grounded", "partial", "not_in_guide"],
        },
        suggestedListingNames: {
          type: "array",
          maxItems: 4,
          items: {
            type: "string",
          },
        },
      },
    },
  };

  const instructions = [
    "You answer questions about a local listings page for Ananyas Nana Nani Homes Phase 7 in Coimbatore.",
    "Use only the guide data provided. Do not invent phone numbers, timings, prices, distances, or delivery guarantees.",
    "Prefer exact listing names from the guide.",
    "If the guide only has shortlist/watchlist leads, say that clearly instead of pretending they are fully verified listings.",
    "If the answer is not in the guide, say so briefly and suggest the kinds of things the user can ask from this page.",
    "Keep the answer under 110 words and suitable for both on-page text and voice playback.",
    "When helpful, remind the user to recheck live timing or availability before depending on a listing.",
  ].join(" ");

  const response = await client.responses.create({
    model: DEFAULT_MODEL,
    max_output_tokens: 500,
    text: {
      format: {
        type: "json_schema",
        name: schema.name,
        schema: schema.schema,
      },
    },
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: instructions }],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Question: ${question}\n\nGuide data:\n${GUIDE_CONTEXT}`,
          },
        ],
      },
    ],
  });

  recordOpenAIUsage(response);

  const parsed = parseResponseJSON(response);
  if (!parsed || typeof parsed.answer !== "string") {
    throw new Error("OpenAI did not return a valid guide answer");
  }

  const answer = parsed.answer.replace(/\s+/g, " ").trim();
  const confidence = ["grounded", "partial", "not_in_guide"].includes(
    parsed.confidence,
  )
    ? parsed.confidence
    : "partial";
  const suggestedListings = toSuggestedListings(parsed.suggestedListingNames || []);

  return {
    answer,
    confidence,
    suggestedListings,
    shareText: buildShareText(question, answer),
    model: response?.model || DEFAULT_MODEL,
    provider: "openai",
    fallback: false,
  };
}

export const runtime = "nodejs";

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST with JSON { question }.",
    });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    console.error("[local-guide-query] Failed to parse JSON body", error);
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  const question = normalizeQuestion(payload?.question);
  if (question.length < 3) {
    return res.status(400).json({
      error: "Ask a fuller question so the guide assistant has enough context.",
    });
  }

  try {
    const result = await askOpenAI(question);
    return res.status(200).json(result);
  } catch (error) {
    console.error("[local-guide-query] OpenAI lookup failed, falling back", error);
    const fallback = buildHeuristicResult(question);
    return res.status(200).json(fallback);
  }
}
