import { useCallback, useEffect, useMemo, useState } from "react";
import { blogIndex } from "../data/blogIndex";
import blogPosts from "../data/blogPostsData";

const STORAGE_KEY = "user_last_catchup_v1";

function safeParseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function trimSlashes(value) {
  if (typeof value !== "string") return "";
  return value.replace(/^\/+|\/+$/g, "");
}

function normalizeSlugToken(value) {
  const trimmed = trimSlashes(value);
  if (!trimmed) return "";
  return trimmed.toLowerCase();
}

function createSlugTokens(value) {
  const normalized = normalizeSlugToken(value);
  if (!normalized) return [];
  const tokens = new Set([normalized]);
  if (normalized.startsWith("blog/")) {
    tokens.add(normalized.slice(5));
  } else {
    tokens.add(`blog/${normalized}`);
  }
  return Array.from(tokens).filter(Boolean);
}

function toBlogHref(value) {
  const trimmed = trimSlashes(value);
  if (!trimmed) return "/blog";
  if (trimmed.startsWith("blog/")) {
    return `/${trimmed}`;
  }
  return `/blog/${trimmed}`;
}

function inferDateFromSlug(value) {
  const normalized = normalizeSlugToken(value);
  if (!normalized) return null;
  const match = normalized.match(/^(\d{4})[-_](\d{2})[-_](\d{2})/);
  if (!match) return null;
  const iso = `${match[1]}-${match[2]}-${match[3]}`;
  return safeParseDate(iso);
}

function canonicalSlugKey(value) {
  const normalized = normalizeSlugToken(value);
  if (!normalized) return "";
  return normalized.startsWith("blog/") ? normalized.slice(5) : normalized;
}

function extractSlugFromLink(link) {
  if (typeof link !== "string") return "";
  const withoutHost = link.replace(/^https?:\/\/[^/]+/i, "");
  const trimmed = trimSlashes(withoutHost);
  if (!trimmed) return "";
  return trimmed.startsWith("blog/") ? trimmed.slice(5) : trimmed;
}

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function preferLatest(current, next) {
  if (!isValidDate(next)) return current;
  if (!isValidDate(current)) return next;
  return next > current ? next : current;
}

function pickSortDate(...candidates) {
  return candidates.filter(isValidDate).sort((a, b) => b - a)[0] || null;
}

function mergeSlugTokens(...groups) {
  return Array.from(new Set(groups.flat().filter(Boolean)));
}

function createIndexCandidate(slug, entry = {}) {
  const canonicalSlug = canonicalSlugKey(slug);
  if (!canonicalSlug) return null;
  const fallbackDate = inferDateFromSlug(canonicalSlug);
  const published = safeParseDate(entry.datePublished) || fallbackDate;
  const modified =
    safeParseDate(entry.dateModified) || safeParseDate(entry.datePublished) || fallbackDate;
  const sortDate = pickSortDate(modified, published, fallbackDate) || new Date(0);
  return {
    slug,
    canonicalSlug,
    title: entry.title || canonicalSlug,
    href: toBlogHref(slug),
    datePublished: published,
    dateModified: modified,
    sortDate,
    slugTokens: createSlugTokens(slug),
  };
}

function createBlogCandidate(post) {
  if (!post) return null;
  const slug = extractSlugFromLink(post.link);
  const canonicalSlug = canonicalSlugKey(slug);
  if (!canonicalSlug) return null;
  const fallbackDate = inferDateFromSlug(canonicalSlug);
  const published = safeParseDate(post.date) || fallbackDate;
  const modified = safeParseDate(post.lastModified) || published || fallbackDate;
  const href = typeof post.link === "string" && post.link.trim()
    ? post.link
    : toBlogHref(slug);
  const sortDate = pickSortDate(modified, published, fallbackDate) || new Date(0);
  return {
    slug,
    canonicalSlug,
    title: post.title || canonicalSlug,
    href,
    datePublished: published,
    dateModified: modified,
    sortDate,
    slugTokens: createSlugTokens(slug),
  };
}

function collectAllPosts() {
  const postsBySlug = new Map();

  const addCandidate = (candidate) => {
    if (!candidate) return;
    const key = candidate.canonicalSlug;
    if (!key) return;
    const existing = postsBySlug.get(key);
    if (!existing) {
      postsBySlug.set(key, candidate);
      return;
    }

    const title = existing.title || candidate.title;
    const href = existing.href || candidate.href;
    const datePublished = preferLatest(existing.datePublished, candidate.datePublished);
    const dateModified = preferLatest(existing.dateModified, candidate.dateModified);
    const sortDate = pickSortDate(existing.sortDate, candidate.sortDate, dateModified, datePublished) || new Date(0);
    const slugTokens = mergeSlugTokens(existing.slugTokens, candidate.slugTokens);

    postsBySlug.set(key, {
      ...existing,
      ...candidate,
      slug: existing.slug || candidate.slug,
      title,
      href,
      datePublished,
      dateModified,
      sortDate,
      slugTokens,
    });
  };

  Object.entries(blogIndex).forEach(([slug, entry]) => addCandidate(createIndexCandidate(slug, entry)));
  blogPosts.forEach((post) => addCandidate(createBlogCandidate(post)));

  return Array.from(postsBySlug.values())
    .filter((post) => isValidDate(post.sortDate))
    .sort((a, b) => b.sortDate - a.sortDate);
}

function loadStoredTimestamp() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = safeParseDate(raw);
    return parsed ? parsed.toISOString() : null;
  } catch (error) {
    console.warn("Failed to read catch-up timestamp", error);
    return null;
  }
}

function saveStoredTimestamp(isoString) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, isoString);
  } catch (error) {
    console.error("Failed to persist catch-up timestamp", error);
  }
}

export default function useCatchUpPosts() {
  const [lastCatchUpAt, setLastCatchUpAt] = useState(() => loadStoredTimestamp());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event) => {
      if (event.storageArea !== window.localStorage) return;
      if (event.key === STORAGE_KEY) {
        setLastCatchUpAt((current) => {
          const next = loadStoredTimestamp();
          if (current === next) return current;
          return next;
        });
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const posts = useMemo(() => collectAllPosts(), []);

  const lastCatchUpDate = useMemo(() => safeParseDate(lastCatchUpAt), [lastCatchUpAt]);

  const newPosts = useMemo(() => {
    if (!posts.length) return [];
    if (!lastCatchUpDate) {
      return posts;
    }
    return posts.filter((post) => post.sortDate && post.sortDate > lastCatchUpDate);
  }, [posts, lastCatchUpDate]);

  const newCount = newPosts.length;

  const markCaughtUp = useCallback(() => {
    const candidate = newPosts[0]?.sortDate;
    const iso =
      candidate instanceof Date && !Number.isNaN(candidate.getTime())
        ? candidate.toISOString()
        : new Date().toISOString();
    setLastCatchUpAt(iso);
    saveStoredTimestamp(iso);
  }, [newPosts]);

  const markPostSeen = useCallback(
    (slug) => {
      const normalized = normalizeSlugToken(slug);
      const post = posts.find((item) => item.slugTokens.includes(normalized));
      if (!post) {
        const nowIso = new Date().toISOString();
        setLastCatchUpAt(nowIso);
        saveStoredTimestamp(nowIso);
        return;
      }
      const postDate = post.sortDate;
      if (!(postDate instanceof Date) || Number.isNaN(postDate.getTime())) {
        const nowIso = new Date().toISOString();
        setLastCatchUpAt(nowIso);
        saveStoredTimestamp(nowIso);
        return;
      }
      const current = lastCatchUpDate;
      if (current && postDate <= current) {
        return;
      }
      const nextIso = postDate.toISOString();
      setLastCatchUpAt(nextIso);
      saveStoredTimestamp(nextIso);
    },
    [posts, lastCatchUpDate],
  );

  return {
    lastCatchUpAt,
    lastCatchUpDate,
    newPosts,
    newCount,
    markCaughtUp,
    markPostSeen,
  };
}
