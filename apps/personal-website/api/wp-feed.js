import { XMLParser } from "fast-xml-parser";

const FEED_URL = "https://kumar2net.wordpress.com/feed/";
const COMMON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(FEED_URL, {
      headers: { "User-Agent": "wp-feed-function" },
      signal: controller.signal,
    });

    if (!response.ok) {
      res.setHeader("content-type", "application/json");
      res.setHeader("cache-control", "no-cache");
      Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
        res.setHeader(key, value),
      );
      return res.status(response.status).json({
        error: "Failed to fetch feed",
        status: response.status,
        posts: [],
      });
    }

    const xml = await response.text();

    if (xml.trim().startsWith("<!DOCTYPE") || xml.trim().startsWith("<html")) {
      console.error(
        "Received HTML instead of XML feed:",
        xml.substring(0, 200),
      );
      res.setHeader("content-type", "application/json");
      res.setHeader("cache-control", "no-cache");
      Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
        res.setHeader(key, value),
      );
      return res.status(200).json({
        title: "WordPress Feed",
        link: "https://kumar2net.wordpress.com/",
        description: "WordPress blog feed",
        lastBuildDate: new Date().toISOString(),
        posts: [],
        error: "Feed temporarily unavailable",
      });
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });
    const data = parser.parse(xml);
    const channel =
      (data && data.rss && data.rss.channel) ? data.rss.channel : {};
    const items = Array.isArray(channel.item)
      ? channel.item
      : channel.item
        ? [channel.item]
        : [];

    const posts = items.map((item) => ({
      title: item.title || "Untitled",
      link: item.link || "#",
      pubDate: item.pubDate || new Date().toISOString(),
      guid:
        typeof item.guid === "object"
          ? item.guid["#text"] || item.guid
          : item.guid || "",
      categories: (Array.isArray(item.category)
        ? item.category
        : item.category
          ? [item.category]
          : []
      ).filter(Boolean),
      excerpt: item["content:encoded"]
        ? String(item["content:encoded"]).replace(/<[^>]*>/g, "").slice(0, 240)
        : item.description || "",
    }));

    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "public, max-age=900");
    Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    return res.status(200).json({
      title: channel.title || "WordPress Feed",
      link: channel.link || "https://kumar2net.wordpress.com/",
      description: channel.description || "WordPress blog feed",
      lastBuildDate: channel.lastBuildDate || new Date().toISOString(),
      posts,
    });
  } catch (err) {
    console.error("wp-feed error:", err);
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "no-cache");
    Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    return res.status(200).json({
      error: "Feed temporarily unavailable",
      details: String((err && err.message) || err),
      posts: [],
    });
  } finally {
    clearTimeout(timeout);
  }
}
