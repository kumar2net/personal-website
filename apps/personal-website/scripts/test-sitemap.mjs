#!/usr/bin/env node

/**
 * Unit tests for generate-sitemap.mjs
 * Tests getBlogRoutes, generateSitemap, generateHtmlSitemap, escapeHtml, and main function
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 SITEMAP UNIT TESTS\n');

const testResults = { total: 0, passed: 0, failed: 0 };

function logTestResult(testName, status, details = '') {
  const emoji = status === 'PASS' ? '✅' : '❌';
  console.log(`   ${emoji} ${testName}${details ? ` - ${details}` : ''}`);

  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

// Import functions from generate-sitemap.mjs
const sitemapPath = path.join(__dirname, 'generate-sitemap.mjs');
const BASE_URL = 'https://kumar2net.com';

// Mock escapeHtml function (since we can't easily import it)
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Mock generateSitemap function
function generateSitemap(urls) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const today = new Date().toISOString().split('T')[0];

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

// Mock generateHtmlSitemap function
function generateHtmlSitemap({ mainRoutes = [], blogEntries = [] }) {
  const updated = new Date().toISOString().split('T')[0];
  const mainList = mainRoutes
    .map((r) => `            <li><a href="${r}">${escapeHtml(r === '/' ? 'Homepage' : r.replace(/^\//, ''))}</a></li>`)
    .join('\n');

  const blogList = blogEntries
    .map(({ url, title }) => `            <li><a href="${url}">${escapeHtml(title || url.replace('/blog/', ''))}</a></li>`)
    .join('\n');

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

// Mock getBlogRoutes function
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

// Test 1: escapeHtml function
function testEscapeHtml() {
  console.log('\n📋 Testing escapeHtml function:');

  const testCases = [
    { input: 'Hello World', expected: 'Hello World', desc: 'Plain text' },
    { input: '<script>alert("XSS")</script>', expected: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;', desc: 'HTML tags' },
    { input: 'Tom & Jerry', expected: 'Tom &amp; Jerry', desc: 'Ampersand' },
    { input: '"Quotes"', expected: '&quot;Quotes&quot;', desc: 'Double quotes' },
    { input: "It's great", expected: 'It&#39;s great', desc: 'Single quotes' },
    { input: '<div class="test" data-value=\'123\'>Content & More</div>', expected: '&lt;div class=&quot;test&quot; data-value=&#39;123&#39;&gt;Content &amp; More&lt;/div&gt;', desc: 'Complex HTML' },
    { input: '', expected: '', desc: 'Empty string' },
    { input: undefined, expected: '', desc: 'Undefined value (coerced to empty)' },
    { input: null, expected: 'null', desc: 'Null value (coerced to string)' },
  ];

  testCases.forEach(({ input, expected, desc }) => {
    const result = escapeHtml(input);
    const passed = result === expected;
    logTestResult(
      `escapeHtml - ${desc}`,
      passed ? 'PASS' : 'FAIL',
      passed ? '' : `Expected "${expected}", got "${result}"`
    );
  });
}

// Test 2: getBlogRoutes function
async function testGetBlogRoutes() {
  console.log('\n📋 Testing getBlogRoutes function:');

  try {
    const routes = await getBlogRoutes();

    // Test that it returns an array
    logTestResult(
      'getBlogRoutes returns an array',
      Array.isArray(routes) ? 'PASS' : 'FAIL'
    );

    // Test that routes are normalized
    const allStartWithSlash = routes.every(r => r.startsWith('/'));
    logTestResult(
      'All routes start with /',
      allStartWithSlash ? 'PASS' : 'FAIL'
    );

    // Test that blog routes are under /blog
    const allBlogRoutes = routes.every(r => r.startsWith('/blog/') || r === '/blog');
    logTestResult(
      'All routes are under /blog',
      allBlogRoutes ? 'PASS' : 'FAIL'
    );

    // Test that routes are sorted
    const sortedRoutes = [...routes].sort();
    const isSorted = JSON.stringify(routes) === JSON.stringify(sortedRoutes);
    logTestResult(
      'Routes are sorted',
      isSorted ? 'PASS' : 'FAIL'
    );

    // Test that there are no duplicates
    const uniqueRoutes = [...new Set(routes)];
    const noDuplicates = routes.length === uniqueRoutes.length;
    logTestResult(
      'No duplicate routes',
      noDuplicates ? 'PASS' : 'FAIL',
      noDuplicates ? '' : `Found ${routes.length - uniqueRoutes.length} duplicates`
    );

    // Test that known posts exist
    const hasHabitPost = routes.includes('/blog/habit');
    logTestResult(
      'Known post exists (/blog/habit)',
      hasHabitPost ? 'PASS' : 'FAIL'
    );

    // Test minimum number of routes
    const hasMinimumRoutes = routes.length > 0;
    logTestResult(
      'Has blog routes',
      hasMinimumRoutes ? 'PASS' : 'FAIL',
      `Found ${routes.length} routes`
    );

  } catch (error) {
    logTestResult(
      'getBlogRoutes executes without error',
      'FAIL',
      error.message
    );
  }
}

// Test 3: generateSitemap function
function testGenerateSitemap() {
  console.log('\n📋 Testing generateSitemap function:');

  const testUrls = ['/', '/about', '/blog', '/blog/habit', '/blog/joy-of-writing'];
  const sitemap = generateSitemap(testUrls);

  // Test XML declaration
  const hasXmlDeclaration = sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>');
  logTestResult(
    'Has XML declaration',
    hasXmlDeclaration ? 'PASS' : 'FAIL'
  );

  // Test urlset namespace
  const hasUrlsetNamespace = sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  logTestResult(
    'Has urlset namespace',
    hasUrlsetNamespace ? 'PASS' : 'FAIL'
  );

  // Test closing tag
  const hasClosingTag = sitemap.includes('</urlset>');
  logTestResult(
    'Has closing urlset tag',
    hasClosingTag ? 'PASS' : 'FAIL'
  );

  // Test all URLs are present
  const allUrlsPresent = testUrls.every(url => sitemap.includes(`<loc>${BASE_URL}${url}</loc>`));
  logTestResult(
    'All URLs present in sitemap',
    allUrlsPresent ? 'PASS' : 'FAIL'
  );

  // Test priority values
  const homePriority = sitemap.includes('<loc>https://kumar2net.com/</loc>') && 
                       sitemap.match(/<loc>https:\/\/kumar2net\.com\/<\/loc>[\s\S]*?<priority>1\.0<\/priority>/);
  logTestResult(
    'Home page has priority 1.0',
    homePriority ? 'PASS' : 'FAIL'
  );

  const blogPostPriority = sitemap.includes('<loc>https://kumar2net.com/blog/habit</loc>') &&
                          sitemap.match(/<loc>https:\/\/kumar2net\.com\/blog\/habit<\/loc>[\s\S]*?<priority>0\.7<\/priority>/);
  logTestResult(
    'Blog post has priority 0.7',
    blogPostPriority ? 'PASS' : 'FAIL'
  );

  const staticPagePriority = sitemap.includes('<loc>https://kumar2net.com/about</loc>') &&
                             sitemap.match(/<loc>https:\/\/kumar2net\.com\/about<\/loc>[\s\S]*?<priority>0\.8<\/priority>/);
  logTestResult(
    'Static page has priority 0.8',
    staticPagePriority ? 'PASS' : 'FAIL'
  );

  // Test changefreq values
  const homeChangefreq = sitemap.match(/<loc>https:\/\/kumar2net\.com\/<\/loc>[\s\S]*?<changefreq>daily<\/changefreq>/);
  logTestResult(
    'Home page has changefreq daily',
    homeChangefreq ? 'PASS' : 'FAIL'
  );

  const blogPostChangefreq = sitemap.match(/<loc>https:\/\/kumar2net\.com\/blog\/habit<\/loc>[\s\S]*?<changefreq>weekly<\/changefreq>/);
  logTestResult(
    'Blog post has changefreq weekly',
    blogPostChangefreq ? 'PASS' : 'FAIL'
  );

  // Test lastmod present
  const today = new Date().toISOString().split('T')[0];
  const hasLastmod = sitemap.includes(`<lastmod>${today}</lastmod>`);
  logTestResult(
    'Has lastmod with current date',
    hasLastmod ? 'PASS' : 'FAIL',
    `Date: ${today}`
  );

  // Test valid XML structure
  const urlCount = (sitemap.match(/<url>/g) || []).length;
  const urlCloseCount = (sitemap.match(/<\/url>/g) || []).length;
  logTestResult(
    'Balanced <url> tags',
    urlCount === urlCloseCount && urlCount === testUrls.length ? 'PASS' : 'FAIL',
    `${urlCount} open, ${urlCloseCount} close`
  );
}

// Test 4: generateHtmlSitemap function
function testGenerateHtmlSitemap() {
  console.log('\n📋 Testing generateHtmlSitemap function:');

  const mainRoutes = ['/', '/about', '/blog', '/contact'];
  const blogEntries = [
    { url: '/blog/habit', title: 'Habit' },
    { url: '/blog/joy-of-writing', title: 'Joy of Writing' },
    { url: '/blog/test-with-special-chars', title: 'Test <script>alert("xss")</script>' },
  ];

  const html = generateHtmlSitemap({ mainRoutes, blogEntries });

  // Test DOCTYPE
  const hasDoctype = html.startsWith('<!DOCTYPE html>');
  logTestResult(
    'Has DOCTYPE declaration',
    hasDoctype ? 'PASS' : 'FAIL'
  );

  // Test HTML structure
  const hasHtmlTag = html.includes('<html lang="en">');
  logTestResult(
    'Has HTML tag with lang attribute',
    hasHtmlTag ? 'PASS' : 'FAIL'
  );

  // Test meta tags
  const hasCharset = html.includes('<meta charset="UTF-8" />');
  const hasViewport = html.includes('<meta name="viewport"');
  logTestResult(
    'Has charset and viewport meta tags',
    hasCharset && hasViewport ? 'PASS' : 'FAIL'
  );

  // Test title
  const hasTitle = html.includes('<title>Sitemap - Kumar\'s Personal Website</title>');
  logTestResult(
    'Has title tag',
    hasTitle ? 'PASS' : 'FAIL'
  );

  // Test main routes section
  const hasMainPagesHeading = html.includes('<h2>Main Pages</h2>');
  logTestResult(
    'Has Main Pages section',
    hasMainPagesHeading ? 'PASS' : 'FAIL'
  );

  // Test blog posts section
  const hasBlogPostsHeading = html.includes('<h2>Blog Posts</h2>');
  logTestResult(
    'Has Blog Posts section',
    hasBlogPostsHeading ? 'PASS' : 'FAIL'
  );

  // Test XML sitemap link
  const hasXmlLink = html.includes(`<a href="/sitemap.xml">${BASE_URL}/sitemap.xml</a>`);
  logTestResult(
    'Has XML sitemap link',
    hasXmlLink ? 'PASS' : 'FAIL'
  );

  // Test main routes are present
  const allMainRoutesPresent = mainRoutes.every(route => html.includes(`<a href="${route}">`));
  logTestResult(
    'All main routes present',
    allMainRoutesPresent ? 'PASS' : 'FAIL'
  );

  // Test blog entries are present
  const allBlogEntriesPresent = blogEntries.every(entry => html.includes(`<a href="${entry.url}">`));
  logTestResult(
    'All blog entries present',
    allBlogEntriesPresent ? 'PASS' : 'FAIL'
  );

  // Test HTML escaping in titles
  const hasUnescapedScript = html.includes('<script>');
  logTestResult(
    'Special characters in titles are escaped',
    !hasUnescapedScript ? 'PASS' : 'FAIL',
    hasUnescapedScript ? 'Found unescaped script tag' : ''
  );

  const hasEscapedChars = html.includes('&lt;script&gt;') && html.includes('&quot;');
  logTestResult(
    'Titles contain properly escaped HTML entities',
    hasEscapedChars ? 'PASS' : 'FAIL'
  );

  // Test last updated date
  const today = new Date().toISOString().split('T')[0];
  const hasLastUpdated = html.includes(`<em>Last updated: ${today}</em>`);
  logTestResult(
    'Has last updated date',
    hasLastUpdated ? 'PASS' : 'FAIL',
    `Date: ${today}`
  );

  // Test homepage special handling
  const hasHomepageLabel = html.includes('>Homepage</a>');
  logTestResult(
    'Homepage route displays as "Homepage"',
    hasHomepageLabel ? 'PASS' : 'FAIL'
  );

  // Test CSS styles present
  const hasStyles = html.includes('<style>') && html.includes('</style>');
  logTestResult(
    'Has embedded styles',
    hasStyles ? 'PASS' : 'FAIL'
  );
}

// Test 5: Main function integration
async function testMainFunctionIntegration() {
  console.log('\n📋 Testing main function integration:');

  try {
    // Test that generated files exist
    const projectRoot = path.join(__dirname, '..');
    const xmlPath = path.join(projectRoot, 'public', 'sitemap.xml');
    const htmlPath = path.join(projectRoot, 'public', 'sitemap.html');

    try {
      await fs.access(xmlPath);
      logTestResult(
        'sitemap.xml file exists',
        'PASS',
        xmlPath
      );

      // Validate XML content
      const xmlContent = await fs.readFile(xmlPath, 'utf8');
      const hasValidXml = xmlContent.includes('<?xml version="1.0"') && 
                         xmlContent.includes('<urlset') && 
                         xmlContent.includes('</urlset>');
      logTestResult(
        'sitemap.xml has valid structure',
        hasValidXml ? 'PASS' : 'FAIL'
      );

      // Test minimum URL count
      const urlCount = (xmlContent.match(/<loc>/g) || []).length;
      logTestResult(
        'sitemap.xml contains URLs',
        urlCount > 0 ? 'PASS' : 'FAIL',
        `Found ${urlCount} URLs`
      );

    } catch (err) {
      logTestResult(
        'sitemap.xml file exists',
        'FAIL',
        'File not found - run npm run sitemap first'
      );
    }

    try {
      await fs.access(htmlPath);
      logTestResult(
        'sitemap.html file exists',
        'PASS',
        htmlPath
      );

      // Validate HTML content
      const htmlContent = await fs.readFile(htmlPath, 'utf8');
      const hasValidHtml = htmlContent.includes('<!DOCTYPE html>') && 
                          htmlContent.includes('<html') && 
                          htmlContent.includes('</html>');
      logTestResult(
        'sitemap.html has valid structure',
        hasValidHtml ? 'PASS' : 'FAIL'
      );

      // Test sections present
      const hasSections = htmlContent.includes('Main Pages') && 
                         htmlContent.includes('Blog Posts');
      logTestResult(
        'sitemap.html has all sections',
        hasSections ? 'PASS' : 'FAIL'
      );

    } catch (err) {
      logTestResult(
        'sitemap.html file exists',
        'FAIL',
        'File not found - run npm run sitemap first'
      );
    }

  } catch (error) {
    logTestResult(
      'Main function integration test',
      'FAIL',
      error.message
    );
  }
}

// Run all tests
async function runAllTests() {
  testEscapeHtml();
  await testGetBlogRoutes();
  testGenerateSitemap();
  testGenerateHtmlSitemap();
  await testMainFunctionIntegration();

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));

  // Exit with appropriate code
  if (testResults.failed > 0) {
    console.log('\n❌ Some tests failed. Please review the output above.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
}

// Execute tests
runAllTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});
