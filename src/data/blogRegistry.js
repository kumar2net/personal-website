import { getBlogSeo } from "../data/blogIndex";

// Simple in-memory cache to avoid recomputing
let cached;

// Turn a slug into a reasonably human title if SEO entry is missing
function prettifySlug(slug) {
  return (slug || "").replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Extract slug from an import.meta.glob path
function pathToSlug(path) {
  // Examples: /src/pages/blog/my-post.jsx, /src/pages/blog/some-post.md
  const match = path.match(/\/src\/pages\/blog\/([^\/]+)\.(jsx|md)$/);
  return match ? match[1] : null;
}

export function getAllSlugs() {
  // Keep MD files as raw to avoid build-time transform issues
  const jsxModules = import.meta.glob("/src/pages/blog/*.jsx");
  const mdModules = import.meta.glob("/src/pages/blog/*.md", { query: "?raw", import: "default" });
  return [
    ...Object.keys(jsxModules),
    ...Object.keys(mdModules),
  ]
    .map(pathToSlug)
    .filter(Boolean);
}

export function getAllPosts() {
  if (cached) return cached;
  const slugs = getAllSlugs();
  const posts = slugs.map((slug) => {
    const seo = getBlogSeo(slug) || {};
    return {
      slug,
      title: seo.title || prettifySlug(slug),
      datePublished: seo.datePublished || null,
    };
  });
  cached = posts;
  return posts;
}
