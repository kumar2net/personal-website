import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://kumar2net.com";
const XML_STYLESHEET_PATH = "/sitemap.xsl";

// Keep this list aligned with `scripts/generate-sitemap.mjs`.
const STATIC_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/projects/ai-recommender-code",
  "/blog",
  "/learning",
  "/learning/shortcuts",
  "/music",
  "/album",
  "/elsewhere",
  "/books",
  "/books/applying-cornell-method",
  "/books/the-brain-story-content",
  "/books/atheism",
  "/books/how-to-stop-caring",
  "/books/the-last-drop-of-water",
  "/utilities",
  "/naruvi",
  "/contact",
];

const getCurrentDate = () => new Date().toISOString().split("T")[0];

async function getBlogRoutes() {
  try {
    const projectRoot = path.join(__dirname, "..");
    const blogIndexPath = path.join(projectRoot, "src", "data", "blogIndex.js");
    const { blogIndex } = await import(pathToFileURL(blogIndexPath).href);
    const slugs = Object.keys(blogIndex || {});

    const routes = slugs.map((slug) => {
      const normalized = slug.startsWith("/") ? slug.slice(1) : slug;
      if (normalized.startsWith("blog/")) return `/${normalized}`;
      return `/blog/${normalized}`;
    });

    return Array.from(new Set(routes)).sort();
  } catch (err) {
    console.warn(
      "[sitemap] Could not import blogIndex.js; returning static routes only.",
      err?.message || err,
    );
    return [];
  }
}

function generateSitemap(urls) {
  const xmlHeader =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<?xml-stylesheet type="text/xsl" href="${XML_STYLESHEET_PATH}"?>`;
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = "</urlset>";

  const today = getCurrentDate();

  const urlEntries = urls
    .map((url) => {
      const isHome = url === "/";
      const isBlogPost = url.startsWith("/blog/") && url !== "/blog";
      const priority = isHome ? "1.0" : isBlogPost ? "0.7" : "0.8";
      const changefreq = isHome ? "daily" : isBlogPost ? "weekly" : "weekly";

      return `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;
}

export default async function handler(req, res) {
  try {
    const blogRoutes = await getBlogRoutes();
    const allRoutes = Array.from(new Set([...STATIC_ROUTES, ...blogRoutes]));
    const xml = generateSitemap(allRoutes);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    // CDN-friendly caching; sitemap updates naturally with deployments,
    // and can be refreshed via scheduled submission.
    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    );
    return res.status(200).send(xml);
  } catch (error) {
    console.error("[sitemap] Handler failed:", error);
    return res.status(500).json({
      error: "Failed to generate sitemap",
      details: error?.message || String(error),
    });
  }
}

