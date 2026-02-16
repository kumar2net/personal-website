import crypto from "crypto";
import { PassThrough, Readable, Transform } from "stream";
import OpenAI from "openai";
import { recordTokenUsage } from "../../../scripts/token-usage.mjs";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";

const ENV_SNAPSHOT = {};
const envCandidates = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), ".env"),
];
for (const candidate of envCandidates) {
  if (fs.existsSync(candidate)) {
    try {
      const parsed = dotenv.parse(fs.readFileSync(candidate));
      Object.assign(ENV_SNAPSHOT, parsed);
    } catch {
      // ignore env parse errors; fall back to process.env
    }
  }
}

function parseCsvEnv(value) {
  if (!value || typeof value !== "string") {
    return [];
  }
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

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
    voice: process.env.BLOG_TTS_HI_VOICE || "alloy",
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

const EXPLICIT_TTS_MODELS = parseCsvEnv(process.env.BLOG_TTS_MODELS);
const CONFIGURED_FALLBACK_TTS_MODELS = parseCsvEnv(
  process.env.BLOG_TTS_FALLBACK_MODELS,
);
const FALLBACK_TTS_MODELS = [
  // Prefer fastest-start models first
  ...CONFIGURED_FALLBACK_TTS_MODELS,
  "gpt-4o-mini-tts-2025-12-15",
  "gpt-4o-tts",
  "gpt-4o-mini-tts",
  "tts-1",
  "tts-1-hd",
];
const ALLOWED_VOICES = new Set([
  "nova",
  "shimmer",
  "echo",
  "onyx",
  "fable",
  "alloy",
  "ash",
  "sage",
  "coral",
  "ballad",
  "verse",
  "marin",
  "cedar",
]);

const TTS_MODEL_CANDIDATES = EXPLICIT_TTS_MODELS.length
  ? Array.from(new Set(EXPLICIT_TTS_MODELS))
  : Array.from(
      new Set(
        [
          process.env.BLOG_TTS_MODEL || "gpt-4o-mini-tts",
          process.env.OPENAI_GPT_TTS_MODEL,
          process.env.OPENAI_TTS_MODEL,
          ...FALLBACK_TTS_MODELS,
        ].filter(Boolean),
      ),
    );

const DEFAULT_AUDIO_FORMAT = "mp3";
const AUDIO_MIME_MAP = {
  opus: "audio/ogg; codecs=opus",
  mp3: "audio/mpeg",
  aac: "audio/aac",
  flac: "audio/flac",
  wav: "audio/wav",
  pcm: "audio/pcm",
};

const MAX_INPUT_CHARS = Number(process.env.BLOG_TTS_MAX_CHARS || 25000);
// Keep TTS requests below the OpenAI per-request `input` limit and reduce
// end-to-end latency by avoiding too many small sequential calls.
const DEFAULT_MAX_CHUNK_CHARS = Number(
  process.env.BLOG_TTS_MAX_CHUNK_CHARS || 3600,
);
// Keep the first chunk smaller so playback can start quickly.
const DEFAULT_FIRST_CHUNK_CHARS = Number(
  process.env.BLOG_TTS_FIRST_CHUNK_CHARS || 600,
);
const STREAMING_MAX_CHUNK_CHARS = Number(
  process.env.BLOG_TTS_STREAMING_MAX_CHUNK_CHARS || 1200,
);
const STREAMING_FIRST_CHUNK_CHARS = Number(
  process.env.BLOG_TTS_STREAMING_FIRST_CHUNK_CHARS || 400,
);
const CACHE_TTL_MS = Number(process.env.BLOG_TTS_CACHE_TTL_MS || 30 * 60 * 1000);
const CACHE_LIMIT = Number(process.env.BLOG_TTS_CACHE_LIMIT || 24);
const USE_STREAMING =
  process.env.BLOG_TTS_STREAMING === "false" ? false : true;

let cachedClient;
const translationCache = new Map();
const audioCache = new Map();

function resolveApiKey() {
  const raw =
    ENV_SNAPSHOT.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.VITE_OPENAI_API_KEY ||
    "";
  if (!raw) return "";
  return String(raw).trim().split(/\s+/)[0] || "";
}

function createHash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function getCacheEntry(cache, key) {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCacheEntry(cache, key, value) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  if (cache.size > CACHE_LIMIT) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

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

function chunkTextForTts(
  text,
  {
    maxChunkChars = DEFAULT_MAX_CHUNK_CHARS,
    firstChunkChars = DEFAULT_FIRST_CHUNK_CHARS,
  } = {},
) {
  const maxChars = Math.max(400, Math.round(maxChunkChars));
  // Use a smaller first chunk to ensure playback starts quickly.
  const firstChunkMaxChars = Math.max(
    200,
    Math.min(maxChars, Math.round(firstChunkChars)),
  );

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    const currentLimit = chunks.length === 0 ? firstChunkMaxChars : maxChars;

    if ((current + " " + sentence).trim().length <= currentLimit) {
      current = current ? `${current} ${sentence}` : sentence;
      continue;
    }

    if (current) {
      chunks.push(current);
      current = sentence;
    } else {
      // If the single sentence itself is longer than the limit
      let remaining = sentence;
      // For the first chunk, we strictly enforce the smaller limit
      // For subsequent chunks, we use the normal limit
      let limit = chunks.length === 0 ? firstChunkMaxChars : maxChars;

      while (remaining.length > limit) {
        chunks.push(remaining.slice(0, limit));
        remaining = remaining.slice(limit);
        // After the first slice is pushed, the next slice is effectively a new chunk
        // so it can use the full maxChars limit.
        limit = maxChars;
      }
      current = remaining;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length ? chunks : [text];
}

function synchsafeToInt(bytes) {
  if (!bytes || bytes.length < 4) return 0;
  return (
    ((bytes[0] & 0x7f) << 21) |
    ((bytes[1] & 0x7f) << 14) |
    ((bytes[2] & 0x7f) << 7) |
    (bytes[3] & 0x7f)
  );
}

function stripMp3Id3Header(buffer) {
  if (!buffer || buffer.length < 10) return buffer;
  if (buffer.slice(0, 3).toString("ascii") !== "ID3") {
    return buffer;
  }
  const size = synchsafeToInt(buffer.slice(6, 10));
  const total = Math.min(buffer.length, 10 + size);
  return buffer.slice(total);
}

function createMp3HeaderStripper() {
  let headerChecked = false;
  let pending = Buffer.alloc(0);
  let skipBytes = 0;

  return new Transform({
    transform(chunk, _enc, cb) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk || []);
      if (headerChecked) {
        this.push(buf);
        cb();
        return;
      }

      pending = Buffer.concat([pending, buf]);
      if (pending.length < 10) {
        cb();
        return;
      }

      if (pending.slice(0, 3).toString("ascii") === "ID3") {
        skipBytes = 10 + synchsafeToInt(pending.slice(6, 10));
      } else {
        skipBytes = 0;
      }
      headerChecked = true;

      if (pending.length > skipBytes) {
        this.push(pending.slice(skipBytes));
      }
      pending = Buffer.alloc(0);
      cb();
    },
    flush(cb) {
      if (!headerChecked && pending.length) {
        this.push(pending);
      }
      cb();
    },
  });
}

function resolveFormat(requestedFormat) {
  const format = (requestedFormat || DEFAULT_AUDIO_FORMAT).toLowerCase();
  if (format === "opus") return { format: "opus", mime: AUDIO_MIME_MAP.opus };
  if (format === "aac") return { format: "aac", mime: AUDIO_MIME_MAP.aac };
  if (format === "flac") return { format: "flac", mime: AUDIO_MIME_MAP.flac };
  if (format === "wav") return { format: "wav", mime: AUDIO_MIME_MAP.wav };
  if (format === "pcm") return { format: "pcm", mime: AUDIO_MIME_MAP.pcm };
  return { format: "mp3", mime: AUDIO_MIME_MAP.mp3 };
}

function resolveVoice(requestedVoice) {
  if (requestedVoice && ALLOWED_VOICES.has(requestedVoice)) {
    return requestedVoice;
  }
  const envVoice = (requestedVoice || "").trim().toLowerCase();
  if (envVoice && ALLOWED_VOICES.has(envVoice)) {
    return envVoice;
  }
  // Default to alloy when an unsupported voice is provided
  return "alloy";
}

function normalizeTokens(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function normalizeUsage(rawUsage = {}) {
  const inputTokens = normalizeTokens(
    rawUsage.input_tokens ?? rawUsage.prompt_tokens ?? 0,
  );
  const outputTokens = normalizeTokens(
    rawUsage.output_tokens ??
      rawUsage.completion_tokens ??
      rawUsage.audio_tokens ??
      0,
  );
  const totalTokens = normalizeTokens(
    rawUsage.total_tokens ??
      rawUsage.totalTokens ??
      (inputTokens + outputTokens),
  );
  return { inputTokens, outputTokens, totalTokens };
}

function recordOpenAIUsage(route, model, requestId, rawUsage) {
  const { inputTokens, outputTokens, totalTokens } = normalizeUsage(rawUsage);
  if (!inputTokens && !outputTokens && !totalTokens) {
    return;
  }
  recordTokenUsage({
    provider: "openai",
    route,
    model,
    request_id: requestId,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: totalTokens,
  });
}

function getOpenAIClient() {
  if (cachedClient) {
    return cachedClient;
  }
  const apiKey = resolveApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  cachedClient = new OpenAI({ apiKey });
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

  recordOpenAIUsage(
    "blog-tts-translation",
    completion?.model || DEFAULT_TRANSLATION_MODEL,
    completion?.id,
    completion?.usage || {},
  );
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

async function synthesizeSpeech(
  client,
  {
    voice,
    text,
    format = DEFAULT_AUDIO_FORMAT,
    instructions,
    signal,
  },
) {
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
        response_format: format,
        ...(instructions ? { instructions } : {}),
        signal,
      });
      recordOpenAIUsage(
        "blog-tts-audio",
        speech?.model || model,
        speech?.id,
        speech?.usage || {},
      );
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

async function synthesizeSpeechBuffered(
  client,
  {
    voice,
    text,
    format = DEFAULT_AUDIO_FORMAT,
    maxChunkChars = DEFAULT_MAX_CHUNK_CHARS,
    firstChunkChars = DEFAULT_FIRST_CHUNK_CHARS,
    instructions,
    signal,
  },
) {
  const chunks = chunkTextForTts(text, {
    maxChunkChars,
    firstChunkChars,
  });

  if (chunks.length <= 1) {
    return synthesizeSpeech(client, {
      voice,
      text,
      format,
      signal,
    });
  }

  const buffers = [];
  let selectedModel = null;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const { buffer, model } = await synthesizeSpeech(client, {
      voice,
      text: chunk,
      format,
      instructions,
      signal,
    });
    if (!selectedModel && model) {
      selectedModel = model;
    }
    const nextBuffer =
      format === "mp3" && i > 0 ? stripMp3Id3Header(buffer) : buffer;
    buffers.push(nextBuffer || Buffer.alloc(0));
  }

  return { buffer: Buffer.concat(buffers), model: selectedModel };
}

async function synthesizeSpeechStreamingSingle(
  client,
  {
    voice,
    text,
    format = DEFAULT_AUDIO_FORMAT,
    instructions,
    signal,
  },
) {
  if (!USE_STREAMING) {
    return null;
  }

  const attempts = [];
  for (const model of TTS_MODEL_CANDIDATES) {
    try {
      const response = await client.audio.speech.create({
        model,
        voice,
        input: text,
        response_format: format,
        ...(instructions ? { instructions } : {}),
        signal,
      });
      recordOpenAIUsage(
        "blog-tts-audio",
        response?.model || model,
        response?.id,
        response?.usage || {},
      );

      if (!response?.body) {
        throw new Error("Audio response does not expose a body stream");
      }

      let nodeStream;
      try {
        nodeStream = Readable.fromWeb(response.body);
      } catch (streamError) {
        const err = new Error("Audio response does not expose a stream");
        err.cause = streamError;
        throw err;
      }

      const passThrough = new PassThrough();
      const chunks = [];

      const bufferPromise = new Promise((resolve, reject) => {
        passThrough.on("finish", () => resolve(Buffer.concat(chunks)));
        passThrough.on("error", reject);
      });

      (async () => {
        try {
          for await (const chunk of nodeStream) {
            const bufferChunk =
              chunk instanceof Uint8Array
                ? Buffer.from(chunk)
                : Buffer.from(chunk || []);
            chunks.push(bufferChunk);
            passThrough.write(bufferChunk);
          }
          passThrough.end();
        } catch (error) {
          passThrough.destroy(error);
        }
      })();

      return { stream: passThrough, bufferPromise, model };
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

async function synthesizeSpeechStreaming(
  client,
  {
    voice,
    text,
    format = DEFAULT_AUDIO_FORMAT,
    maxChunkChars = DEFAULT_MAX_CHUNK_CHARS,
    firstChunkChars = DEFAULT_FIRST_CHUNK_CHARS,
    instructions,
    signal,
  },
) {
  const chunks = chunkTextForTts(text, {
    maxChunkChars,
    firstChunkChars,
  });

  if (chunks.length <= 1) {
    return synthesizeSpeechStreamingSingle(client, {
      voice,
      text,
      format,
      signal,
    });
  }

  const passThrough = new PassThrough();
  const bufferPromises = [];
  let selectedModel = null;

  const bufferPromise = new Promise((resolve, reject) => {
    passThrough.on("finish", async () => {
      try {
        const buffers = await Promise.all(bufferPromises);
        resolve(Buffer.concat(buffers));
      } catch (err) {
        reject(err);
      }
    });
    passThrough.on("error", reject);
  });

  (async () => {
    try {
      let nextChunkPromise = null;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        let streamed;

      if (nextChunkPromise) {
        streamed = await nextChunkPromise;
        nextChunkPromise = null;
      } else {
        streamed = await synthesizeSpeechStreamingSingle(client, {
          voice,
          text: chunk,
          format,
          instructions,
          signal,
        });
      }

        if (!streamed) {
          throw new Error("Streaming not available");
        }
        if (!selectedModel && streamed.model) {
          selectedModel = streamed.model;
        }

        // Prefetch the next chunk while streaming the current one
        if (i + 1 < chunks.length) {
          nextChunkPromise = synthesizeSpeechStreamingSingle(client, {
            voice,
            text: chunks[i + 1],
            format,
            instructions,
            signal,
          });
        }

        bufferPromises.push(
          streamed.bufferPromise.then((buf) => {
            const safeBuffer = buf || Buffer.alloc(0);
            if (format === "mp3" && i > 0) {
              return stripMp3Id3Header(safeBuffer);
            }
            return safeBuffer;
          }),
        );

        const sourceStream =
          format === "mp3" && i > 0
            ? streamed.stream.pipe(createMp3HeaderStripper())
            : streamed.stream;
        await new Promise((resolve, reject) => {
          sourceStream.on("data", (data) => passThrough.write(data));
          sourceStream.on("end", resolve);
          sourceStream.on("error", reject);
        });
      }
      passThrough.end();
    } catch (err) {
      passThrough.destroy(err);
    }
  })();

  return { stream: passThrough, bufferPromise, model: selectedModel };
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

  if (!resolveApiKey()) {
    return res.status(503).json({
      error:
        "Text-to-speech is disabled. Set OPENAI_API_KEY (and optionally BLOG_TTS_MODELS or BLOG_TTS_MODEL) to enable audio generation.",
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
  const { format: initialFormat, mime: initialMime } = resolveFormat(
    payload?.response_format || payload?.format,
  );
  let responseFormat = initialFormat;
  let responseMime = initialMime;
  const instructionsRaw =
    typeof payload?.instructions === "string" ? payload.instructions.trim() : "";
  const instructions = instructionsRaw ? instructionsRaw.slice(0, 400) : "";

  const languageConfigBase = LANGUAGE_CONFIG[languageCode];
  const languageConfig = languageConfigBase
    ? {
        ...languageConfigBase,
        voice: resolveVoice(languageConfigBase.voice),
      }
    : null;
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
  const textHash = createHash(limitedText);

  try {
    const abortController = new AbortController();
    req.on("aborted", () => abortController.abort());
    const client = getOpenAIClient();

    if (languageConfig.requiresTranslation) {
      const translationCacheKey = `${languageCode}:${textHash}`;
      const cachedTranslation = getCacheEntry(translationCache, translationCacheKey);
      if (cachedTranslation) {
        contentForSpeech = cachedTranslation.text;
        translationFailed = cachedTranslation.translationFailed;
        translationUsed = !translationFailed;
      } else {
        try {
          contentForSpeech = await translateText(client, limitedText, languageConfig);
          translationUsed = true;
          setCacheEntry(translationCache, translationCacheKey, {
            text: contentForSpeech,
            translationFailed: false,
          });
        } catch (translationError) {
          translationFailed = true;
          console.warn("[blog-tts] Translation failed, falling back to original text:", translationError?.message || translationError);
          contentForSpeech = limitedText;
          setCacheEntry(translationCache, translationCacheKey, {
            text: contentForSpeech,
            translationFailed: true,
          });
        }
      }
    }

    const previewConfig = USE_STREAMING
      ? {
          maxChunkChars: STREAMING_MAX_CHUNK_CHARS,
          firstChunkChars: STREAMING_FIRST_CHUNK_CHARS,
        }
      : {
          maxChunkChars: DEFAULT_MAX_CHUNK_CHARS,
          firstChunkChars: DEFAULT_FIRST_CHUNK_CHARS,
        };
    const chunkPreview = chunkTextForTts(contentForSpeech, previewConfig);
    if (chunkPreview.length > 1 && responseFormat === "opus") {
      responseFormat = "mp3";
      responseMime = AUDIO_MIME_MAP.mp3;
    }

    const speechHash = createHash(
      `${languageCode}:${languageConfig.voice}:${slug}:${responseFormat}:${instructions}:${contentForSpeech}`,
    );
    const cachedAudio = getCacheEntry(audioCache, speechHash);

    if (cachedAudio) {
      res.setHeader("X-Blogtts-Cache", "hit");
      res.setHeader("Content-Type", `${cachedAudio.mime}`);
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
      res.setHeader("Content-Length", cachedAudio.buffer.length);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("X-Blogtts-Language", languageCode);
      res.setHeader("X-Blogtts-Slug", slug);
      res.setHeader("X-Blogtts-Translated", cachedAudio.translationUsed ? "1" : "0");
      res.setHeader("X-Blogtts-Translation-Failed", cachedAudio.translationFailed ? "1" : "0");
      res.setHeader("X-Blogtts-Truncated", cachedAudio.truncated ? "1" : "0");
      if (cachedAudio.model) {
        res.setHeader("X-Blogtts-Model", cachedAudio.model);
      }
      return res.status(200).send(cachedAudio.buffer);
    }

    let streamed = null;
    if (USE_STREAMING) {
      try {
        streamed = await synthesizeSpeechStreaming(client, {
          voice: languageConfig.voice,
          text: contentForSpeech,
          format: responseFormat,
          firstChunkChars: STREAMING_FIRST_CHUNK_CHARS,
          maxChunkChars: STREAMING_MAX_CHUNK_CHARS,
          instructions,
          signal: abortController.signal,
        });
      } catch (streamError) {
        if (!isRecoverableTtsError(streamError)) {
          throw streamError;
        }
        console.warn(
          "[blog-tts] Streaming attempt failed, falling back to buffered synthesis:",
          streamError?.message || streamError,
        );
        streamed = null;
      }
    }

    if (streamed) {
      res.setHeader("X-Blogtts-Cache", "miss");
      res.setHeader("Content-Type", `${responseMime}`);
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
      res.setHeader("X-Blogtts-Language", languageCode);
      res.setHeader("X-Blogtts-Slug", slug);
      res.setHeader("X-Blogtts-Translated", translationUsed ? "1" : "0");
      res.setHeader("X-Blogtts-Translation-Failed", translationFailed ? "1" : "0");
      res.setHeader("X-Blogtts-Truncated", truncated ? "1" : "0");
      if (streamed.model) {
        res.setHeader("X-Blogtts-Model", streamed.model);
      }
      res.setHeader("Accept-Ranges", "bytes");

      streamed.stream.on("error", (streamErr) => {
        console.error("[blog-tts] Stream to client failed:", streamErr);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to stream audio" });
        } else {
          res.destroy(streamErr);
        }
      });

      streamed.stream.pipe(res);

      streamed.bufferPromise
        .then((buffer) => {
          setCacheEntry(audioCache, speechHash, {
            buffer,
            model: streamed.model,
            translationFailed,
            translationUsed,
            truncated,
            format: responseFormat,
            mime: responseMime,
          });
        })
        .catch((cacheError) => {
          console.warn(
            "[blog-tts] Failed to cache streamed audio:",
            cacheError?.message || cacheError,
          );
        });
      return;
    }

    const { buffer, model: resolvedModel } = await synthesizeSpeechBuffered(client, {
      voice: languageConfig.voice,
      text: contentForSpeech,
      format: responseFormat,
      maxChunkChars: DEFAULT_MAX_CHUNK_CHARS,
      firstChunkChars: DEFAULT_FIRST_CHUNK_CHARS,
      instructions,
      signal: abortController.signal,
    });
    const responsePayload = {
      buffer,
      model: resolvedModel,
      translationFailed,
      translationUsed,
      truncated,
      format: responseFormat,
      mime: responseMime,
    };
    setCacheEntry(audioCache, speechHash, responsePayload);
    res.setHeader("X-Blogtts-Cache", "miss");
    res.setHeader("Content-Type", `${responseMime}`);
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Accept-Ranges", "bytes");
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
