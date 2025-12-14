import OpenAI from "openai";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_INPUT_CHARS = Number(process.env.TRANSLATE_MAX_INPUT_CHARS || 9000);
const DEFAULT_MODEL =
  process.env.TRANSLATE_OPENAI_MODEL ||
  process.env.OPENAI_MODEL ||
  "gpt-4o-mini";

const LANGUAGES = {
  hi: { label: "Hindi" },
  ta: { label: "Tamil" },
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

  if (!rawBody) return {};
  return JSON.parse(rawBody);
}

function clampContent(content) {
  if (!content || typeof content !== "string") return "";
  return content.replace(/\s+/g, " ").trim().slice(0, MAX_INPUT_CHARS);
}

export const runtime = "nodejs";

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST with JSON { text, slug, target }.",
    });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    console.error("Failed to parse translate request body", error);
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  const { text, slug, target } = payload || {};
  const language = LANGUAGES[target];

  if (!language) {
    return res.status(400).json({
      error: "Unsupported language. Use one of: hi, ta.",
    });
  }

  const cleaned = clampContent(text);
  if (!cleaned) {
    return res.status(400).json({ error: "Text is empty." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "Translation unavailable: missing OPENAI_API_KEY.",
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You translate blog posts with clean paragraph breaks. Preserve names, tags, and numbers. Do not add headings or commentary.",
        },
        {
          role: "user",
          content: [
            `Slug: ${slug || "unknown"}`,
            `Target language: ${language.label}`,
            "Translate the text below. Keep paragraph spacing similar; avoid bullet markers unless present.",
            `Text: """${cleaned}"""`,
          ].join("\n\n"),
        },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const translated = completion.choices?.[0]?.message?.content?.trim();
    if (!translated) {
      throw new Error("OpenAI returned an empty translation");
    }

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Translate-Model", completion.model || DEFAULT_MODEL);
    return res.status(200).json({
      translated,
      model: completion.model || DEFAULT_MODEL,
      fallback: false,
    });
  } catch (error) {
    console.error("Translation failed", error);
    return res.status(500).json({
      error: "Translation failed",
      detail: error?.message || "Unknown error",
    });
  }
}
