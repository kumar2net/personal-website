import { blogIndex } from "../data/blogIndex";
import { unsplashHeroPool } from "./unsplashHeroPool";

const jsxModules = import.meta.glob("/src/pages/blog/*.jsx");
const GENERIC_LISTING_IMAGE = "/media/blogwordcloud.png";

const thematicHeroRules = [
  {
    matches: ["cortisol", "ashwagandha", "health", "ayurveda", "wellness"],
    image:
      "https://images.unsplash.com/photo-1569936906148-06de87cb0681?auto=format&fit=crop&w=1600&q=80",
  },
  {
    matches: ["africa", "african", "colonialism", "development", "kenya", "nairobi"],
    image:
      "https://images.unsplash.com/photo-1693902997450-7e912c0d3554?auto=format&fit=crop&w=1600&q=80",
  },
  {
    matches: ["election", "assembly", "government", "governance", "politics", "state"],
    image:
      "https://images.unsplash.com/photo-1760872645513-63b6846ce3c9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    matches: ["democracy", "civic", "turnout", "apathy", "voter"],
    image:
      "https://images.unsplash.com/photo-1761001315762-847bcee74967?auto=format&fit=crop&w=1600&q=80",
  },
  {
    matches: ["music", "bhajan", "tamil", "tinglish", "culture"],
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    matches: ["writing", "learning", "clarity", "language", "slang", "education"],
    image:
      "https://images.unsplash.com/photo-1759752393718-7b57f6da3caa?auto=format&fit=crop&w=1600&q=80",
  },
  {
    matches: ["market", "finance", "stock", "economy", "investment"],
    image:
      "https://images.unsplash.com/photo-1742076553114-cfd4f27de46f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    matches: [
      "ai",
      "artificial intelligence",
      "technology",
      "data center",
      "server",
      "upi",
      "aadhaar",
      "automation",
      "it services",
      "enterprise software",
    ],
    image:
      "https://images.unsplash.com/photo-1762163516269-3c143e04175c?auto=format&fit=crop&w=1600&q=80",
  },
];

let cachedRegistry = null;

function pathToSlug(filePath) {
  const match = filePath.match(/\/src\/pages\/blog\/([^/]+)\.jsx$/);
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

function isGenericListingImage(image) {
  return !image || image === GENERIC_LISTING_IMAGE;
}

function pickRotatingHeroImage(index) {
  if (!Array.isArray(unsplashHeroPool) || unsplashHeroPool.length === 0) {
    return "";
  }
  return unsplashHeroPool[index % unsplashHeroPool.length];
}

function pickThematicHeroImage(post) {
  const haystack = [
    post?.slug,
    post?.title,
    ...(Array.isArray(post?.tags) ? post.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const match = thematicHeroRules.find((rule) =>
    rule.matches.some((needle) => haystack.includes(needle))
  );

  return match?.image || "";
}

function pickHeroImage(post, index) {
  if (!post) {
    return pickRotatingHeroImage(index);
  }

  if (!isGenericListingImage(post.image)) {
    return post.image;
  }

  return (
    pickThematicHeroImage(post) ||
    pickRotatingHeroImage(index) ||
    post.image ||
    GENERIC_LISTING_IMAGE
  );
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
      hasMd: false,
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
    image: post.image || GENERIC_LISTING_IMAGE,
    heroImage: pickHeroImage(post, index),
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
