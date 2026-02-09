import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for your website
const BASE_URL = 'https://kumar2net.com';
const XML_STYLESHEET_PATH = '/sitemap.xsl';

// Curated static routes from App.jsx (non-parameterized, crawlable)
const STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/projects/ai-recommender-code',
  '/blog',
  '/learning',
  '/learning/shortcuts',
  '/music',
  '/album',
  '/elsewhere',
  '/books',
  '/books/applying-cornell-method',
  '/books/the-brain-story-content',
  '/books/atheism',
  '/books/how-to-stop-caring',
  '/books/the-last-drop-of-water',
  '/utilities',
  '/science',
  '/science/patellar-instability',
  '/science/brain-vs-ai',
  '/science/paper-sizes',
  '/science/protein-folding',
  '/science/back-pain',
  '/naruvi',
  '/contact',
  // '/news' is an external redirect; omit from sitemap to avoid soft-404 noise
];

// Get current date in ISO format
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Build blog routes dynamically from src/data/blogIndex.js
async function getBlogRoutes() {
  try {
    const projectRoot = path.join(__dirname, '..');
    const blogIndexPath = path.join(projectRoot, 'src', 'data', 'blogIndex.js');
    const { blogIndex } = await import(pathToFileURL(blogIndexPath).href);

    const slugs = Object.keys(blogIndex || {});

    // Normalize into absolute paths under /blog
    const routes = slugs.map((slug) => {
      const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
      if (normalized.startsWith('blog/')) return `/${normalized}`; // already prefixed
      return `/blog/${normalized}`;
    });

    // Also include legacy/manual posts if any are missing
    const unique = new Set(routes);
    return Array.from(unique).sort();
  } catch (err) {
    console.warn('Warning: could not import blogIndex.js; falling back to empty blog list.', err?.message || err);
    return [];
  }
}

// Generate XML sitemap
function generateSitemap(urls) {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${XML_STYLESHEET_PATH}"?>`;
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const today = getCurrentDate();

  const urlEntries = urls
    .map((url) => {
      const isHome = url === '/';
      const isBlogPost = url.startsWith('/blog/') && url !== '/blog';
      const priority = isHome ? '1.0' : isBlogPost ? '0.7' : '0.8';
      const changefreq = isHome ? 'daily' : isBlogPost ? 'weekly' : 'weekly';

      return `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urlEntries}\n${urlsetClose}`;
}

async function getBlogIndex() {
  try {
    const projectRoot = path.join(__dirname, '..');
    const blogIndexPath = path.join(projectRoot, 'src', 'data', 'blogIndex.js');
    const mod = await import(pathToFileURL(blogIndexPath).href);
    return mod.blogIndex || {};
  } catch (e) {
    return {};
  }
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateHtmlSitemap({ mainRoutes = [], blogEntries = [] }) {
  const updated = getCurrentDate();
  const mainList = mainRoutes
    .map((r) => `            <li><a href="${r}">${escapeHtml(r === '/' ? 'Homepage' : r.replace(/^\//, ''))}</a></li>`) .join('\n');

  const blogList = blogEntries
    .map(({ url, title }) => `            <li><a href="${url}">${escapeHtml(title || url.replace('/blog/', ''))}</a></li>`) .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sitemap - Kumar's Personal Website</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .sitemap-section { margin: 20px 0; }
    .sitemap-section h2 { color: #666; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    .sitemap-section ul { list-style: none; padding: 0; }
    .sitemap-section li { margin: 10px 0; }
    .sitemap-section a { color: #0066cc; text-decoration: none; }
    .sitemap-section a:hover { text-decoration: underline; }
    .xml-link { background: #f5f5f5; padding: 10px; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>Sitemap - Kumar's Personal Website</h1>

  <div class="xml-link">
    <strong>XML Sitemap:</strong> <a href="/sitemap.xml">${BASE_URL}/sitemap.xml</a>
  </div>

  <div class="sitemap-section">
    <h2>Main Pages</h2>
    <ul>
${mainList}
    </ul>
  </div>

  <div class="sitemap-section">
    <h2>Blog Posts</h2>
    <ul>
${blogList}
    </ul>
  </div>

  <p><em>Last updated: ${updated}</em></p>
</body>
</html>`;
}

// Main function
const main = async () => {
  try {
    const blogRoutes = await getBlogRoutes();

    // Combine and de-duplicate
    const allRoutes = Array.from(new Set([...STATIC_ROUTES, ...blogRoutes]));

    // Generate sitemap XML
    const sitemapXml = generateSitemap(allRoutes);

    // Write XML to public directory
    const xmlOutputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    await fs.writeFile(xmlOutputPath, sitemapXml, 'utf8');

    // Build HTML sitemap
    const blogIndex = await getBlogIndex();
    const blogEntries = Object.entries(blogIndex)
      .map(([slug, meta]) => {
        const normalized = slug.startsWith('/') ? slug.slice(1) : slug;
        const url = normalized.startsWith('blog/') ? `/${normalized}` : `/blog/${normalized}`;
        return { url, title: meta?.title };
      })
      .sort((a, b) => a.url.localeCompare(b.url));

    const mainRoutes = [
      '/', '/about', '/projects', '/blog', '/learning', '/science', '/music', '/album', '/books', '/contact', '/elsewhere'
    ];

    const sitemapHtml = generateHtmlSitemap({ mainRoutes, blogEntries });
    const htmlOutputPath = path.join(__dirname, '..', 'public', 'sitemap.html');
    await fs.writeFile(htmlOutputPath, sitemapHtml, 'utf8');

    console.log('✅ Sitemaps generated successfully!');
    console.log(`📁 XML: ${xmlOutputPath}`);
    console.log(`📁 HTML: ${htmlOutputPath}`);
    console.log(`🔗 ${BASE_URL}/sitemap.xml`);
    console.log(`📊 Total URLs (XML): ${allRoutes.length}`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
};

// Run the script
main();
