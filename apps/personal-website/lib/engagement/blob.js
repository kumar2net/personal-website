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

const LOCAL_LISTING_REPORT_PREFIX = "listing-reports:";
const LOCAL_LISTING_REVIEW_PREFIX = "listing-report-reviews:";

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

export const getListingReportId = (entry = {}) => {
  const anonymousID =
    typeof entry?.anonymousID === "string" && entry.anonymousID.trim()
      ? entry.anonymousID.trim()
      : "anon";
  const timestamp =
    typeof entry?.timestamp === "string" && entry.timestamp.trim()
      ? entry.timestamp.trim()
      : "unknown-time";
  const listingId =
    typeof entry?.listingId === "string" && entry.listingId.trim()
      ? entry.listingId.trim()
      : "unknown-listing";
  return `${listingId}::${timestamp}::${anonymousID}`;
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

export const getListingReports = async (slug) => {
  const remote = await fetchJSON(`engagement/${safeSlug(slug)}/listing-reports.json`);
  return Array.isArray(remote?.entries) ? remote.entries : [];
};

export const getLocalListingReports = (slug) => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(
      `${LOCAL_LISTING_REPORT_PREFIX}${safeSlug(slug)}`,
    );
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed?.entries) ? parsed.entries : [];
  } catch {
    return [];
  }
};

export const getListingReportReviews = async (slug) => {
  const remote = await fetchJSON(
    `engagement/${safeSlug(slug)}/listing-report-reviews.json`,
  );
  return Array.isArray(remote?.entries) ? remote.entries : [];
};

export const getLocalListingReportReviews = (slug) => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(
      `${LOCAL_LISTING_REVIEW_PREFIX}${safeSlug(slug)}`,
    );
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed?.entries) ? parsed.entries : [];
  } catch {
    return [];
  }
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

export const saveListingReport = async (
  slug,
  {
    listingId,
    listingName,
    categoryId,
    reportType,
    message = "",
  } = {},
) => {
  if (!listingId || !reportType) {
    throw new Error("Listing report is missing required fields");
  }

  const normalizedMessage = typeof message === "string" ? message.trim() : "";

  if (reportType === "update" && normalizedMessage.length < 5) {
    throw new Error("Please add a short note describing the update");
  }

  const entry = {
    anonymousID: generateAnonymousId(),
    timestamp: new Date().toISOString(),
    listingId: `${listingId}`.trim(),
    listingName: typeof listingName === "string" ? listingName.trim() : "",
    categoryId: typeof categoryId === "string" ? categoryId.trim() : "",
    reportType,
    message: normalizedMessage,
  };

  try {
    return await postEngagement({
      type: "listing_report",
      slug: safeSlug(slug),
      entry,
    });
  } catch (error) {
    if (typeof window === "undefined" || !window.localStorage) {
      throw error;
    }

    try {
      const storageKey = `${LOCAL_LISTING_REPORT_PREFIX}${safeSlug(slug)}`;
      const existingRaw = window.localStorage.getItem(storageKey);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const nextEntries = [
        entry,
        ...(Array.isArray(existing?.entries) ? existing.entries : []),
      ].slice(0, 200);
      const payload = {
        entries: nextEntries,
        updatedAt: new Date().toISOString(),
        localFallback: true,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
      return payload;
    } catch {
      throw error;
    }
  }
};

export const saveListingReportReview = async (
  slug,
  {
    reportId,
    status,
    note = "",
  } = {},
) => {
  if (!reportId || !status) {
    throw new Error("Listing review is missing required fields");
  }

  const entry = {
    anonymousID: generateAnonymousId(),
    timestamp: new Date().toISOString(),
    reportId: `${reportId}`.trim(),
    status: `${status}`.trim(),
    note: typeof note === "string" ? note.trim() : "",
  };

  try {
    return await postEngagement({
      type: "listing_report_review",
      slug: safeSlug(slug),
      entry,
    });
  } catch (error) {
    if (typeof window === "undefined" || !window.localStorage) {
      throw error;
    }

    try {
      const storageKey = `${LOCAL_LISTING_REVIEW_PREFIX}${safeSlug(slug)}`;
      const existingRaw = window.localStorage.getItem(storageKey);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const nextEntries = [
        entry,
        ...(Array.isArray(existing?.entries) ? existing.entries : []),
      ].slice(0, 200);
      const payload = {
        entries: nextEntries,
        updatedAt: new Date().toISOString(),
        localFallback: true,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
      return payload;
    } catch {
      throw error;
    }
  }
};
