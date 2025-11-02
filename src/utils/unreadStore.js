import { normalizePostId } from "./postUtils";

const STORAGE_KEY = "user_read_posts_v1";
const FEATURE_KEY = "feature_unread_v1"; // 'on' | 'off' per-browser
const LOCAL_EVENT = "unread_store_changed";

function getNowIso() {
  try {
    return new Date().toISOString();
  } catch {
    return null;
  }
}

export function isLocalOn() {
  if (typeof window === "undefined") return true; // default on in SSR-less env
  const v = window.localStorage.getItem(FEATURE_KEY);
  return v ? v === "on" : true;
}

export function setLocalOn(on) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FEATURE_KEY, on ? "on" : "off");
}

export function isEnvOn() {
  try {
    const v = import.meta?.env?.VITE_FEATURE_UNREAD;
    // default to 'on' if not set
    return (v ?? "on") === "on";
  } catch {
    return true;
  }
}

export function isFeatureEnabled() {
  return isEnvOn() && isLocalOn();
}

export function enableFeature() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FEATURE_KEY, "on");
}

export function disableFeature() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FEATURE_KEY, "off");
}

export function getReadMap() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveReadMap(map, detail = { reason: "save" }) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } finally {
    try {
      window.dispatchEvent(new CustomEvent(LOCAL_EVENT, { detail }));
    } catch {}
  }
}

export function normalizeSlug(slug) {
  const n = normalizePostId(slug);
  return n || slug;
}

export function markRead(slug, { source = "auto" } = {}) {
  if (!slug) return;
  const id = normalizeSlug(slug);
  const map = getReadMap();
  if (!map[id]) {
    map[id] = { readAt: getNowIso(), source };
    saveReadMap(map, { reason: "markRead", slug: id });
  }
}

export function markAllRead(slugs = [], { source = "manual" } = {}) {
  if (!Array.isArray(slugs) || slugs.length === 0) return;
  const map = getReadMap();
  const now = getNowIso();
  slugs.forEach((s) => {
    const id = normalizeSlug(s);
    if (!map[id]) {
      map[id] = { readAt: now, source };
    }
  });
  saveReadMap(map, { reason: "markAllRead", count: slugs.length });
}

export function getUnread(knownSlugs = []) {
  const map = getReadMap();
  const set = new Set(knownSlugs.map(normalizeSlug));
  return Array.from(set).filter((id) => !map[id]);
}

export function isUnread(slug) {
  const id = normalizeSlug(slug);
  const map = getReadMap();
  return !map[id];
}

export function pruneUnknown(knownSlugs = []) {
  const set = new Set(knownSlugs.map(normalizeSlug));
  const map = getReadMap();
  let changed = false;
  for (const key of Object.keys(map)) {
    if (!set.has(key)) {
      delete map[key];
      changed = true;
    }
  }
  if (changed) saveReadMap(map, { reason: "pruneUnknown" });
}

export function subscribe(listener) {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener();
  const localHandler = () => listener();
  window.addEventListener("storage", handler);
  window.addEventListener(LOCAL_EVENT, localHandler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(LOCAL_EVENT, localHandler);
  };
}
