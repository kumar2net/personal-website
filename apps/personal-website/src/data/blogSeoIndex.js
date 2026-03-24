import { blogIndex } from "./blogIndex";

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeIsoDate(value) {
  if (!value) return "";
  if (isIsoDate(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function inferDateFromSlug(slug) {
  const match = (slug || "").match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : "";
}

function stripDatePrefix(slug) {
  const match = (slug || "").match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  return match ? match[1] : slug;
}

function prettifySlug(slug) {
  return (slug || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function pickString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim());
}

export function getBlogPostSeo(slug) {
  if (!slug) {
    return undefined;
  }

  const metadata = blogIndex?.[slug] || {};
  const datePublished = pickString(
    normalizeIsoDate(metadata.datePublished),
    inferDateFromSlug(slug),
  );
  const dateModified = pickString(
    normalizeIsoDate(metadata.dateModified),
    datePublished,
  );

  return {
    title: pickString(metadata.title, prettifySlug(stripDatePrefix(slug))),
    description: pickString(metadata.description, metadata.excerpt),
    image: pickString(metadata.image),
    tags: toStringArray(metadata.tags),
    datePublished,
    dateModified,
    readingTime: pickString(metadata.readingTime),
  };
}
