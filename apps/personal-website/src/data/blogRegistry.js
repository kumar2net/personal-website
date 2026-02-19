import { blogIndex } from "../data/blogIndex";
import { unsplashHeroPool } from "./unsplashHeroPool";

const jsxModules = import.meta.glob("/src/pages/blog/*.jsx");
const mdModules = import.meta.glob("/src/pages/blog/*.md", {
  query: "?raw",
  import: "default",
});

let cachedRegistry = null;

function pathToSlug(filePath) {
  const match = filePath.match(/\/src\/pages\/blog\/([^/]+)\.(jsx|md)$/);
  return match ? match[1] : null;
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

function formatDisplayDate(isoDate) {
  if (!isoDate || !isIsoDate(isoDate)) return "";
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function toTimestamp(isoDate) {
  if (!isoDate || !isIsoDate(isoDate)) return 0;
  const ts = Date.parse(`${isoDate}T00:00:00Z`);
  return Number.isFinite(ts) ? ts : 0;
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
  return value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim());
}

function dedupeStrings(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function inferDateFromSlug(slug) {
  const match = (slug || "").match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : "";
}

function pickHeroImage(index) {
  if (!Array.isArray(unsplashHeroPool) || unsplashHeroPool.length === 0) {
    return "";
  }
  return unsplashHeroPool[index % unsplashHeroPool.length];
}

function normalizeMetadata(raw) {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  return {
    title: pickString(raw.title),
    description: pickString(raw.description),
    excerpt: pickString(raw.excerpt),
    image: pickString(raw.image),
    readingTime: pickString(raw.readingTime),
    tags: toStringArray(raw.tags),
    datePublished: normalizeIsoDate(raw.datePublished),
    dateModified: normalizeIsoDate(raw.dateModified),
  };
}

function buildRegistry() {
  if (cachedRegistry) {
    return cachedRegistry;
  }

  const sourcesBySlug = new Map();

  Object.keys(jsxModules).forEach((modulePath) => {
    const slug = pathToSlug(modulePath);
    if (!slug) return;
    sourcesBySlug.set(slug, {
      slug,
      hasJsx: true,
      hasMd: false,
    });
  });

  Object.keys(mdModules).forEach((modulePath) => {
    const slug = pathToSlug(modulePath);
    if (!slug) return;

    if (sourcesBySlug.has(slug)) {
      sourcesBySlug.get(slug).hasMd = true;
      return;
    }

    sourcesBySlug.set(slug, {
      slug,
      hasJsx: false,
      hasMd: true,
    });
  });

  const posts = Array.from(sourcesBySlug.values()).map((entry) => {
    const legacyMetadata = normalizeMetadata(blogIndex?.[entry.slug]);
    const mergedTags = dedupeStrings([...(legacyMetadata.tags ?? [])]);

    const inferredDate = inferDateFromSlug(entry.slug);
    const datePublished = pickString(
      inferredDate,
      legacyMetadata.datePublished,
    );
    const dateModified = pickString(
      legacyMetadata.dateModified,
      datePublished,
    );

    const title = pickString(
      legacyMetadata.title,
      prettifySlug(stripDatePrefix(entry.slug)),
    );
    const description = pickString(
      legacyMetadata.description,
      legacyMetadata.excerpt,
    );
    const excerpt = pickString(
      legacyMetadata.description,
      legacyMetadata.excerpt,
    );

    return {
      slug: entry.slug,
      title,
      description,
      excerpt: excerpt || description,
      tags: mergedTags,
      image: pickString(legacyMetadata.image),
      readingTime: pickString(legacyMetadata.readingTime),
      datePublished,
      dateModified,
      date: formatDisplayDate(datePublished),
      lastModified: formatDisplayDate(dateModified),
      link: `/blog/${entry.slug}`,
      hasJsx: entry.hasJsx,
      hasMd: entry.hasMd,
    };
  });

  posts.sort((a, b) => {
    const dateA = toTimestamp(pickString(a.datePublished, a.dateModified));
    const dateB = toTimestamp(pickString(b.datePublished, b.dateModified));
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    return a.slug.localeCompare(b.slug);
  });

  const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
  cachedRegistry = {
    posts,
    postsBySlug,
    slugs: posts.map((post) => post.slug),
  };

  return cachedRegistry;
}

export function getAllBlogSlugs() {
  return [...buildRegistry().slugs];
}

export function getAllBlogPosts() {
  return buildRegistry().posts.map((post, index) => ({
    title: post.title,
    date: post.date,
    lastModified: post.lastModified || post.date,
    excerpt: post.excerpt || post.description,
    tags: post.tags,
    image: post.image || "/media/blogwordcloud.png",
    heroImage: pickHeroImage(index),
    link: post.link,
    slug: post.slug,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    readingTime: post.readingTime,
  }));
}

export function getBlogPostSeo(slug) {
  const post = buildRegistry().postsBySlug.get(slug);
  if (!post) {
    return undefined;
  }
  return {
    title: post.title,
    description: post.description || post.excerpt,
    image: post.image,
    tags: post.tags,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    readingTime: post.readingTime,
  };
}

// Backward-compatible exports
export function getAllSlugs() {
  return getAllBlogSlugs();
}

export function getAllPosts() {
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    datePublished: post.datePublished || null,
  }));
}
