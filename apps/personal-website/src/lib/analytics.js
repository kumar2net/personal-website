import { getBlogPostSeo } from "../data/blogSeoIndex";

const DEFAULT_SITE_URL = "https://kumar2net.com";
const DEFAULT_AUTHOR =
  (import.meta.env.VITE_CONTENT_AUTHOR || "Kumar").trim() || "Kumar";
const PLAUSIBLE_DOMAIN = (import.meta.env.VITE_PLAUSIBLE_DOMAIN || "").trim();
const PLAUSIBLE_SCRIPT_SRC =
  (import.meta.env.VITE_PLAUSIBLE_SCRIPT_SRC ||
    "https://plausible.io/js/script.js").trim();
const PLAUSIBLE_API_HOST = (import.meta.env.VITE_PLAUSIBLE_API_HOST || "").trim();
const REVENUE_ENDPOINT =
  (import.meta.env.VITE_ANALYTICS_REVENUE_ENDPOINT ||
    "/api/analytics-revenue").trim();
const ENABLE_ON_LOCALHOST =
  String(import.meta.env.VITE_ANALYTICS_LOCALHOST || "false")
    .trim()
    .toLowerCase() === "true";
const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(
  /\/+$/,
  "",
);
const VISITOR_STORAGE_KEY = "analytics_visitor_id_v1";
const SESSION_STORAGE_KEY = "analytics_session_id_v1";
const SESSION_LAST_SEEN_KEY = "analytics_session_last_seen_v1";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const DEDUPE_WINDOW_MS = 1200;
const MAX_PROP_LENGTH = 240;

let plausibleReadyPromise;

function inBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBooleanString(value) {
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return "";
}

function clampString(value, maxLength = MAX_PROP_LENGTH) {
  return trimString(value).slice(0, maxLength);
}

function cleanProps(input = {}) {
  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) => {
      if (value === undefined || value === null) {
        return [];
      }

      if (typeof value === "number") {
        if (!Number.isFinite(value)) {
          return [];
        }
        return [[key, Number(value.toFixed(2))]];
      }

      if (typeof value === "boolean") {
        return [[key, normalizeBooleanString(value)]];
      }

      const normalized = clampString(value);
      return normalized ? [[key, normalized]] : [];
    }),
  );
}

function normalizePath(pathname = "/") {
  const trimmed = trimString(pathname);
  if (!trimmed) {
    return "/";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function parsePathname(pathname = "/") {
  return normalizePath(pathname).split("?")[0];
}

function currentPath() {
  if (!inBrowser()) {
    return "/";
  }
  return `${window.location.pathname}${window.location.search}`;
}

function currentUrl() {
  if (!inBrowser()) {
    return SITE_URL;
  }
  return window.location.href;
}

function resolveAbsoluteUrl(value = "") {
  if (!trimString(value)) {
    return currentUrl();
  }

  try {
    if (inBrowser()) {
      return new URL(value, window.location.origin).toString();
    }
    return new URL(value, SITE_URL).toString();
  } catch {
    return value;
  }
}

function searchParams(searchString = "") {
  if (searchString) {
    return new URLSearchParams(searchString);
  }
  if (!inBrowser()) {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

function currentVariantId(searchString = "") {
  const params = searchParams(searchString);
  return clampString(
    params.get("variant_id") ||
      params.get("variant") ||
      params.get("ab_variant") ||
      params.get("experiment") ||
      "",
    120,
  );
}

function referrerSource() {
  if (!inBrowser()) {
    return "";
  }

  const referrer = trimString(document.referrer);
  if (!referrer) {
    return "";
  }

  try {
    const parsed = new URL(referrer);
    if (parsed.origin === window.location.origin) {
      return "";
    }
    return clampString(parsed.hostname.replace(/^www\./, ""), 120);
  } catch {
    return "";
  }
}

function attributionProps(searchString = "") {
  const params = searchParams(searchString);
  const utmSource = clampString(
    params.get("utm_source") || params.get("source") || "",
    120,
  );
  const utmCampaign = clampString(params.get("utm_campaign") || "", 120);
  const utmMedium = clampString(params.get("utm_medium") || "", 120);

  return cleanProps({
    traffic_source: utmSource || referrerSource() || "direct",
    utm_campaign: utmCampaign || undefined,
    utm_medium: utmMedium || undefined,
  });
}

export function getPageContext(pathname = inBrowser() ? window.location.pathname : "/") {
  const normalized = parsePathname(pathname);
  const blogMatch = normalized.match(/^\/blog\/([^/]+)$/);

  if (blogMatch) {
    const slug = decodeURIComponent(blogMatch[1]);
    const seo = getBlogPostSeo(slug) || {};
    return cleanProps({
      content_id: slug,
      content_type: "post",
      author: DEFAULT_AUTHOR,
      channel: "blog",
      publish_date: seo.datePublished || undefined,
    });
  }

  if (normalized === "/blog") {
    return cleanProps({
      content_type: "index",
      channel: "blog",
    });
  }

  if (normalized === "/") {
    return cleanProps({
      content_type: "page",
      channel: "home",
    });
  }

  const firstSegment = normalized.split("/").filter(Boolean)[0] || "home";
  return cleanProps({
    content_type: "page",
    channel: firstSegment,
  });
}

export function getBlogContentProps(slug, post = getBlogPostSeo(slug) || {}) {
  return cleanProps({
    content_id: slug,
    content_type: "post",
    author: DEFAULT_AUTHOR,
    channel: "blog",
    publish_date: post?.datePublished || undefined,
  });
}

function buildBaseEventProps(overrides = {}, pathname) {
  return cleanProps({
    ...getPageContext(pathname || (inBrowser() ? window.location.pathname : "/")),
    ...attributionProps(),
    variant_id: currentVariantId() || undefined,
    ...overrides,
  });
}

function hasTrackingOptOut() {
  if (!inBrowser()) {
    return false;
  }

  const doNotTrack =
    window.doNotTrack ||
    navigator.doNotTrack ||
    navigator.msDoNotTrack ||
    "";

  return (
    String(doNotTrack).toLowerCase() === "1" ||
    String(doNotTrack).toLowerCase() === "yes" ||
    navigator.globalPrivacyControl === true
  );
}

function canTrackLocally() {
  if (!inBrowser()) {
    return false;
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return ENABLE_ON_LOCALHOST;
  }

  return true;
}

export function isAnalyticsEnabled() {
  return Boolean(
    inBrowser() &&
      PLAUSIBLE_DOMAIN &&
      PLAUSIBLE_SCRIPT_SRC &&
      canTrackLocally() &&
      !hasTrackingOptOut(),
  );
}

function resolvePlausibleEndpoint() {
  if (!PLAUSIBLE_API_HOST) {
    return undefined;
  }

  const normalized = PLAUSIBLE_API_HOST.replace(/\/+$/, "");
  return normalized.endsWith("/api/event")
    ? normalized
    : `${normalized}/api/event`;
}

function ensurePlausibleStub() {
  if (!inBrowser()) {
    return;
  }

  if (typeof window.plausible === "function" && !Array.isArray(window.plausible.q)) {
    return;
  }

  const queue =
    typeof window.plausible === "function" && Array.isArray(window.plausible.q)
      ? window.plausible.q
      : [];

  const plausible = function plausible() {
    plausible.q.push(arguments);
  };

  plausible.q = queue;
  window.plausible = plausible;
}

function initPlausibleRuntime() {
  if (!inBrowser() || window.__plausibleInitialized) {
    return;
  }

  if (typeof window.plausible?.init === "function") {
    const endpoint = resolvePlausibleEndpoint();

    window.plausible.init({
      autoCapturePageviews: false,
      captureOnLocalhost: ENABLE_ON_LOCALHOST,
      fileDownloads: true,
      formSubmissions: true,
      outboundLinks: true,
      logging: !import.meta.env.PROD,
      customProperties(eventName) {
        if (eventName !== "pageview") {
          return {};
        }

        return cleanProps({
          ...getPageContext(),
          variant_id: currentVariantId() || undefined,
        });
      },
      ...(endpoint ? { endpoint } : {}),
    });
  }

  window.__plausibleInitialized = true;
}

export function ensureAnalyticsReady() {
  if (!isAnalyticsEnabled()) {
    return Promise.resolve(false);
  }

  if (window.__plausibleReady && typeof window.plausible === "function") {
    initPlausibleRuntime();
    return Promise.resolve(true);
  }

  if (plausibleReadyPromise) {
    return plausibleReadyPromise;
  }

  plausibleReadyPromise = new Promise((resolve) => {
    ensurePlausibleStub();

    const finish = () => {
      initPlausibleRuntime();
      window.__plausibleReady = typeof window.plausible === "function";
      resolve(window.__plausibleReady);
    };

    if (typeof window.plausible?.init === "function") {
      finish();
      return;
    }

    const existingScript = document.querySelector(
      'script[data-analytics-runtime="plausible"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", finish, { once: true });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = PLAUSIBLE_SCRIPT_SRC;
    script.dataset.analyticsRuntime = "plausible";
    script.dataset.domain = PLAUSIBLE_DOMAIN;
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.appendChild(script);
  });

  return plausibleReadyPromise;
}

function dedupeStore() {
  if (!inBrowser()) {
    return null;
  }

  if (!(window.__analyticsDedupeStore instanceof Map)) {
    window.__analyticsDedupeStore = new Map();
  }

  return window.__analyticsDedupeStore;
}

function shouldSkipEvent(key) {
  const store = dedupeStore();
  if (!store) {
    return false;
  }

  const now = Date.now();
  const lastSentAt = store.get(key);
  store.set(key, now);

  return Number.isFinite(lastSentAt) && now - lastSentAt < DEDUPE_WINDOW_MS;
}

async function dispatchPlausibleEvent(name, options = {}) {
  const ready = await ensureAnalyticsReady();
  if (!ready || typeof window.plausible !== "function") {
    return false;
  }

  window.plausible(name, options);
  return true;
}

export async function trackPageView({ url } = {}) {
  const pageUrl = resolveAbsoluteUrl(url || currentPath());
  if (shouldSkipEvent(`pageview:${pageUrl}`)) {
    return false;
  }

  return dispatchPlausibleEvent("pageview", { url: pageUrl });
}

export async function trackEvent(name, options = {}) {
  if (!trimString(name)) {
    return false;
  }

  return dispatchPlausibleEvent(name, options);
}

export async function trackContentView(overrides = {}) {
  const props = buildBaseEventProps(overrides);
  const dedupeKey = `content_view:${props.content_id || currentPath()}`;

  if (shouldSkipEvent(dedupeKey)) {
    return false;
  }

  return dispatchPlausibleEvent("content_view", {
    props,
    interactive: false,
  });
}

export async function trackContentEngagement(overrides = {}) {
  const props = buildBaseEventProps(overrides);

  return dispatchPlausibleEvent("content_engagement", {
    props,
    interactive: false,
  });
}

export async function trackCtaClick(overrides = {}) {
  const props = buildBaseEventProps(overrides);

  return dispatchPlausibleEvent("cta_click", { props });
}

export async function trackNewsletterSubscribe(overrides = {}) {
  const props = buildBaseEventProps(overrides);

  return dispatchPlausibleEvent("newsletter_subscribe", { props });
}

export async function trackTrialStart(overrides = {}) {
  const props = buildBaseEventProps(overrides);

  return dispatchPlausibleEvent("trial_start", { props });
}

function normalizeMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return null;
  }
  return Number(amount.toFixed(2));
}

function normalizeCurrency(value) {
  const currency = clampString(value || "USD", 12).toUpperCase();
  return currency || "USD";
}

function safeStorage(storageName) {
  if (!inBrowser()) {
    return null;
  }

  try {
    return window[storageName];
  } catch {
    return null;
  }
}

function safeGet(storage, key) {
  if (!storage) {
    return "";
  }

  try {
    return storage.getItem(key) || "";
  } catch {
    return "";
  }
}

function safeSet(storage, key, value) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage failures in privacy mode.
  }
}

function createOpaqueId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function visitorId() {
  const storage = safeStorage("localStorage");
  const existing = safeGet(storage, VISITOR_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const created = createOpaqueId("visitor");
  safeSet(storage, VISITOR_STORAGE_KEY, created);
  return created;
}

function sessionId() {
  const storage = safeStorage("sessionStorage") || safeStorage("localStorage");
  const now = Date.now();
  const lastSeenAt = Number(safeGet(storage, SESSION_LAST_SEEN_KEY) || "0");
  let current = safeGet(storage, SESSION_STORAGE_KEY);

  if (!current || !lastSeenAt || now - lastSeenAt > SESSION_TIMEOUT_MS) {
    current = createOpaqueId("session");
  }

  safeSet(storage, SESSION_STORAGE_KEY, current);
  safeSet(storage, SESSION_LAST_SEEN_KEY, String(now));

  return current;
}

async function mirrorRevenueEvent(body) {
  if (!inBrowser() || !REVENUE_ENDPOINT) {
    return false;
  }

  try {
    const response = await fetch(REVENUE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      keepalive: true,
    });

    return response.ok;
  } catch (error) {
    if (!import.meta.env.PROD) {
      console.warn("[analytics] Revenue mirror failed", error);
    }
    return false;
  }
}

function buildRevenueProps(amount, overrides = {}) {
  return buildBaseEventProps({
    value_usd: amount ?? undefined,
    ...overrides,
  });
}

async function trackRevenueEvent(name, options = {}) {
  const amount = normalizeMoney(options.valueUsd);
  const currency = normalizeCurrency(options.currency);
  const eventId = clampString(options.eventId, 160) || createOpaqueId(name);
  const props = buildRevenueProps(amount, {
    ...options.props,
    transaction_id:
      clampString(options.transactionId, 160) ||
      clampString(options.transaction_id, 160) ||
      undefined,
  });

  await dispatchPlausibleEvent(name, {
    props,
    ...(amount === null
      ? {}
      : {
          revenue: {
            amount,
            currency,
          },
        }),
  });

  if (amount !== null) {
    void mirrorRevenueEvent({
      event_name: name,
      event_id: eventId,
      client_id: visitorId(),
      session_id: sessionId(),
      value_usd: amount,
      currency,
      page_location: currentUrl(),
      page_path: currentPath(),
      referrer: inBrowser() ? trimString(document.referrer) : "",
      transaction_id:
        clampString(options.transactionId, 160) ||
        clampString(options.transaction_id, 160) ||
        undefined,
      properties: props,
    });
  }

  return eventId;
}

export function trackPurchase(options = {}) {
  return trackRevenueEvent("purchase", options);
}

export function trackAffiliatePayout(options = {}) {
  return trackRevenueEvent("affiliate_payout", options);
}
