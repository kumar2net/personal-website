import OpenAI from "openai";

let cachedClient = null;

function parseModelList(value, fallback = []) {
  if (typeof value !== "string" || !value.trim()) {
    return [...fallback];
  }
  const parsed = value
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  if (!parsed.length) {
    return [...fallback];
  }
  return [...new Set(parsed)];
}

function parseDimension(value, fallback) {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
    return fallback;
  }
  return parsed;
}

function getClient() {
  if (!cachedClient) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not configured. Set OPENAI_API_KEY for semantic embeddings.",
      );
    }
    cachedClient = new OpenAI({ apiKey });
  }
  return cachedClient;
}

function coerceEmbedding(values) {
  if (!Array.isArray(values)) {
    throw new Error("Embedding response missing values");
  }
  return values.map((value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  });
}

function looksLikeDimensionsError(error) {
  const message = [
    error?.message,
    error?.error?.message,
    error?.response?.data?.error?.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return (
    message.includes("dimensions") ||
    message.includes("dimension") ||
    message.includes("unsupported embedding model")
  );
}

async function createEmbedding(options) {
  return getClient().embeddings.create(options);
}

export function getOpenAIEmbeddingModelList(
  value = process.env.OPENAI_EMBED_MODELS,
  fallback = [
    process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small",
    "text-embedding-3-small",
    "text-embedding-3-large",
    "text-embedding-ada-002",
  ],
) {
  return parseModelList(value, fallback);
}

export function getConfiguredEmbeddingDimension(fallback = 1536) {
  return parseDimension(process.env.OPENAI_EMBED_DIMENSIONS, fallback);
}

export async function embedTextWithOpenAI(
  text,
  { model, dimensions } = {},
) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required to generate embeddings");
  }
  const requestedModel =
    typeof model === "string" && model.trim()
      ? model.trim()
      : process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
  const requestedDimensions = dimensions;
  const normalizedDimensions =
    typeof requestedDimensions === "number" && Number.isFinite(requestedDimensions)
      ? Math.trunc(requestedDimensions)
      : parseDimension(process.env.OPENAI_EMBED_DIMENSIONS, null);

  const request = {
    model: requestedModel,
    input: text,
    ...(normalizedDimensions ? { dimensions: normalizedDimensions } : {}),
  };

  try {
    const response = await createEmbedding(request);
    return coerceEmbedding(response?.data?.[0]?.embedding);
  } catch (error) {
    if (!normalizedDimensions || !looksLikeDimensionsError(error)) {
      throw error;
    }
  }

  const fallbackResponse = await createEmbedding({
    model: requestedModel,
    input: text,
  });
  return coerceEmbedding(fallbackResponse?.data?.[0]?.embedding);
}
