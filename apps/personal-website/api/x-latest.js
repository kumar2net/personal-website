import { XMLParser } from "fast-xml-parser";

const BASE = "https://api.x.com/2";
const COMMON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const DEFAULT_NITTER_SOURCES = [
  "https://nitter.net",
  "https://nitter.privacydev.net",
  "https://nitter.poast.org",
  "https://nitter.fdn.fr",
  "https://nitter.catsarch.com",
];

const NITTER_SOURCES =
  (process.env.NITTER_SOURCES &&
    process.env.NITTER_SOURCES.split(",")
      .map((value) => value.trim())
      .filter(Boolean)) ||
  DEFAULT_NITTER_SOURCES;

async function xFetch(path, token) {
  const response = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "personal-website-x-latest",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const error = new Error(`X API error ${response.status}`);
    error.status = response.status;
    error.details = text;
    throw error;
  }

  return response.json();
}

async function fetchNitter(username) {
  const errors = [];

  for (const base of NITTER_SOURCES) {
    const rssUrl = `${base.replace(/\/+$/, "")}/${encodeURIComponent(username)}/rss`;
    try {
      const response = await fetch(rssUrl, {
        headers: { "User-Agent": "personal-website-x-latest" },
      });

      if (!response.ok) {
        throw new Error(`Nitter RSS error ${response.status}`);
      }

      const xml = await response.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });
      const parsed = parser.parse(xml);
      const channel = parsed?.rss?.channel || {};
      const items = Array.isArray(channel.item)
        ? channel.item
        : channel.item
          ? [channel.item]
          : [];

      const normalized = items.slice(0, 5).map((item, index) => ({
        id: item?.guid || item?.link || `${username}-${index}`,
        text: (item?.description || item?.title || "")
          .replace(/<[^>]*>/g, "")
          .trim(),
        created_at:
          item?.pubDate || channel.lastBuildDate || new Date().toISOString(),
        url: item?.link || `https://x.com/${username}`,
      }));

      if (!normalized.length) {
        throw new Error("No RSS items returned");
      }

      return {
        items: normalized,
        source: base,
      };
    } catch (error) {
      errors.push(`${rssUrl}: ${error.message}`);
    }
  }

  const err = new Error("All Nitter sources failed");
  err.details = errors.join("; ");
  throw err;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    return res.status(200).end();
  }

  const username = (req.query && req.query.username) || "kumar2net";

  try {
    const token = process.env.X_BEARER_TOKEN;

    let items = [];

    if (token) {
      const userResp = await xFetch(
        `/users/by/username/${encodeURIComponent(username)}?user.fields=profile_image_url`,
        token,
      );
      const userId = userResp?.data?.id;
      if (!userId) {
        throw new Error("User not found");
      }

      const tweetsResp = await xFetch(
        `/users/${userId}/tweets?max_results=5&tweet.fields=created_at`,
        token,
      );
      const tweets = tweetsResp?.data || [];

      items = tweets.map((tweet) => ({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        url: `https://twitter.com/${username}/status/${tweet.id}`,
      }));
    } else {
      const fallback = await fetchNitter(username);
      items = fallback.items;
      res.setHeader("x-nitter-source", fallback.source);
    }

    Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "public, max-age=300");
    return res.status(200).json({ username, items });
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    if (process.env.X_BEARER_TOKEN) {
      try {
        const fallbackResult = await fetchNitter(username);
        Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
          res.setHeader(key, value),
        );
        res.setHeader("content-type", "application/json");
        res.setHeader("cache-control", "public, max-age=300");
        res.setHeader("x-nitter-source", fallbackResult.source);
        return res.status(200).json({
          username,
          items: fallbackResult.items,
          warning: `Primary X API failed (${status}); served fallback RSS.`,
        });
      } catch (fallbackErr) {
        Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
          res.setHeader(key, value),
        );
        res.setHeader("content-type", "application/json");
        return res.status(status).json({
          error: "Failed to fetch X posts",
          details: `${String(
            (err && err.details) || (err && err.message) || err,
          )}; fallback also failed: ${String(fallbackErr?.message || fallbackErr)}`,
        });
      }
    } else {
      try {
        const fallbackResult = await fetchNitter(username);
        Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
          res.setHeader(key, value),
        );
        res.setHeader("content-type", "application/json");
        res.setHeader("cache-control", "public, max-age=300");
        res.setHeader("x-nitter-source", fallbackResult.source);
        return res.status(200).json({
          username,
          items: fallbackResult.items,
          warning: `Served RSS after primary fetch failed (${String(
            (err && err.details) || err?.message || err,
          )}).`,
        });
      } catch (fallbackErr) {
        Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
          res.setHeader(key, value),
        );
        res.setHeader("content-type", "application/json");
        return res.status(200).json({
          username,
          items: [],
          warning:
            "Unable to fetch X posts right now. View updates directly on https://x.com/kumar2net.",
          details: `Failed to fetch X posts (${String(
            (err && err.details) || (err && err.message) || err,
          )}; fallback also failed: ${String(
            (fallbackErr && fallbackErr.details) ||
              fallbackErr?.message ||
              fallbackErr,
          )})`,
        });
      }
    }
  }
}
