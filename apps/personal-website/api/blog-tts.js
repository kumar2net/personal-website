import OpenAI from "openai";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const LANGUAGE_CONFIG = {
  en: {
    label: "English",
    voice: process.env.BLOG_TTS_EN_VOICE || "alloy",
    requiresTranslation: false,
  },
  hi: {
    label: "Hindi",
    voice: process.env.BLOG_TTS_HI_VOICE || "verse",
    requiresTranslation: true,
  },
  ta: {
    label: "Tamil",
    voice: process.env.BLOG_TTS_TA_VOICE || "alloy",
    requiresTranslation: true,
  },
};

const DEFAULT_TRANSLATION_MODEL =
  process.env.BLOG_TTS_TRANSLATION_MODEL ||
  "gpt-4o-mini";

const TTS_MODEL_CANDIDATES = Array.from(
  new Set(
    [
      process.env.BLOG_TTS_MODEL,
      process.env.OPENAI_TTS_MODEL,
      process.env.OPENAI_GPT_TTS_MODEL,
      "gpt-4o-audio-preview",
      "gpt-4o-mini-tts",
      "tts-1",
      "tts-1-hd",
    ].filter(Boolean),
  ),
);

const MAX_INPUT_CHARS = Number(process.env.BLOG_TTS_MAX_CHARS || 8000);

let cachedClient;

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
    if (!req.body.trim()) {
      return {};
    }
    return JSON.parse(req.body);
  }

  const rawBody = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", (err) => reject(err));
  });

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}

function normalizeText(raw) {
  if (!raw || typeof raw !== "string") {
    return "";
  }
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function clampText(text) {
  if (!text) {
    return { text: "", truncated: false };
  }
  if (text.length <= MAX_INPUT_CHARS) {
    return { text, truncated: false };
  }
  return { text: text.slice(0, MAX_INPUT_CHARS), truncated: true };
}

function getOpenAIClient() {
  if (cachedClient) {
    return cachedClient;
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  cachedClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return cachedClient;
}

async function translateText(client, text, { label }) {
  const completion = await client.chat.completions.create({
    model: DEFAULT_TRANSLATION_MODEL,
    temperature: 0.2,
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content: `Translate the provided blog post text into natural ${label}. Keep names and numbers intact. Return only the translated prose with paragraph breaks.`,
      },
      { role: "user", content: text },
    ],
  });

  const translated = completion.choices?.[0]?.message?.content?.trim();
  if (!translated) {
    throw new Error(`Translation to ${label} returned empty result`);
  }
  return translated;
}

function isRecoverableTtsError(error) {
  const status = error?.status || error?.response?.status;
  const code =
    error?.code ||
    error?.error?.code ||
    error?.response?.data?.error?.code;
  return status === 403 || status === 404 || code === "model_not_found";
}

async function synthesizeSpeech(client, { voice, text }) {
  if (!TTS_MODEL_CANDIDATES.length) {
    const err = new Error("No TTS models configured");
    err.status = 503;
    throw err;
  }

  const attempts = [];
  for (const model of TTS_MODEL_CANDIDATES) {
    try {
      const speech = await client.audio.speech.create({
        model,
        voice,
        input: text,
        format: "mp3",
      });
      const buffer = Buffer.from(await speech.arrayBuffer());
      return { buffer, model };
    } catch (error) {
      const recoverable = isRecoverableTtsError(error);
      const reason =
        error?.error?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        String(error);
      attempts.push({ model, reason, recoverable });
      if (!recoverable) {
        throw error;
      }
    }
  }

  const detail = attempts
    .map((attempt) => `${attempt.model}: ${attempt.reason}`)
    .join(" | ");
  const fallbackError = new Error(
    `No permitted OpenAI TTS models responded successfully. Attempts: ${detail}`,
  );
  fallbackError.status = 503;
  throw fallbackError;
}

export const runtime = "nodejs";

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Send POST with JSON { text, slug, language }.",
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error:
        "Text-to-speech is disabled. Set OPENAI_API_KEY (and optionally BLOG_TTS_MODEL) to enable audio generation.",
    });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    console.error("[blog-tts] Failed to parse JSON payload", error);
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  const rawText =
    typeof payload?.text === "string" ? payload.text : payload?.content;
  const languageCode =
    typeof payload?.language === "string" ? payload.language.trim().toLowerCase() : "en";
  const slug =
    typeof payload?.slug === "string" && payload.slug.trim()
      ? payload.slug.trim()
      : "blog-post";

  const languageConfig = LANGUAGE_CONFIG[languageCode];
  if (!languageConfig) {
    return res.status(400).json({
      error: `Unsupported language "${languageCode}".`,
      supported: Object.keys(LANGUAGE_CONFIG),
    });
  }

  const normalizedText = normalizeText(rawText);
  if (!normalizedText) {
    return res.status(400).json({ error: "Request text is empty." });
  }

  const { text: limitedText, truncated } = clampText(normalizedText);

  let contentForSpeech = limitedText;
  let translationUsed = false;
  let translationFailed = false;

  try {
    const client = getOpenAIClient();

    if (languageConfig.requiresTranslation) {
      try {
        contentForSpeech = await translateText(client, limitedText, languageConfig);
        translationUsed = true;
      } catch (translationError) {
        translationFailed = true;
        console.warn("[blog-tts] Translation failed, falling back to original text:", translationError?.message || translationError);
        contentForSpeech = limitedText;
      }
    }

    const { buffer, model: resolvedModel } = await synthesizeSpeech(client, {
      voice: languageConfig.voice,
      text: contentForSpeech,
    });
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("X-Blogtts-Language", languageCode);
    res.setHeader("X-Blogtts-Slug", slug);
    res.setHeader("X-Blogtts-Translated", translationUsed ? "1" : "0");
    res.setHeader("X-Blogtts-Translation-Failed", translationFailed ? "1" : "0");
    res.setHeader("X-Blogtts-Truncated", truncated ? "1" : "0");
    if (resolvedModel) {
      res.setHeader("X-Blogtts-Model", resolvedModel);
    }
    return res.status(200).send(buffer);
  } catch (error) {
    console.error("[blog-tts] Handler failed:", error);
    const status = error?.status || error?.response?.status || 500;
    const details =
      error?.details ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message ||
      String(error);
    return res.status(status).json({
      error: "Failed to generate audio",
      details,
    });
  }
}
