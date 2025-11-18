const DEFAULT_BLOB_BASE =
  "https://jf0xcffb3qoqwhu6.public.blob.vercel-storage.com";

const getImportEnv = (key) => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key];
  }
  return undefined;
};

const BLOB_PUBLIC_BASE =
  getImportEnv("VITE_BLOB_PUBLIC_BASE") || DEFAULT_BLOB_BASE;
const SAVE_ENDPOINT =
  getImportEnv("VITE_BLOB_ENGAGEMENT_ENDPOINT") || "/api/engagement";

const encodePath = (path) =>
  path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const safeSlug = (slug) => {
  if (typeof slug !== "string") return "global";
  const trimmed = slug.trim();
  return trimmed ? trimmed : "global";
};

const fetchJSON = async (path) => {
  try {
    const response = await fetch(`${BLOB_PUBLIC_BASE}/${encodePath(path)}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn(`[engagement] Failed to fetch ${path}:`, error);
    }
    return null;
  }
};

const postEngagement = async (payload) => {
  const response = await fetch(SAVE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Engagement request failed";
    try {
      const cloned = response.clone();
      const body = await cloned.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      try {
        const text = await response.text();
        if (text) {
          message = text;
        }
      } catch {
        // ignore
      }
    }
    throw new Error(message);
  }

  return response.json();
};

export const getReactions = async (slug) => {
  const data = await fetchJSON(`engagement/${safeSlug(slug)}/reactions.json`);
  return data?.counts ? data : { counts: data || {} };
};

export const saveReaction = async (slug, emoji) => {
  if (!emoji) {
    throw new Error("Emoji is required");
  }
  const result = await postEngagement({
    type: "reaction",
    slug: safeSlug(slug),
    emoji,
  });
  return result;
};

export const getPrompts = async (slug) => {
  const data = await fetchJSON(`engagement/${safeSlug(slug)}/prompts.json`);
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.entries)) {
    return data.entries;
  }
  return [];
};

const generateAnonymousId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `anon-${Math.random().toString(36).slice(2, 10)}`;
};

export const savePrompt = async (slug, answer) => {
  const trimmed = answer?.trim();
  if (!trimmed) {
    throw new Error("Answer cannot be empty");
  }
  const entry = {
    anonymousID: generateAnonymousId(),
    timestamp: new Date().toISOString(),
    answer: trimmed,
  };

  const payload = await postEngagement({
    type: "prompt",
    slug: safeSlug(slug),
    entry,
  });
  return payload;
};
