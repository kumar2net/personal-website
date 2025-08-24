import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base URL for your website
const BASE_URL = 'https://kumarsite.netlify.app'

// Static routes from your App.jsx
const STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/trends',
  '/learning',
  '/music',
  '/contact',
  '/learning/shortcuts',
  '/learning/vocab-additions'
]

// Blog routes from your App.jsx
const BLOG_ROUTES = [
  '/blog/spine-implant-dashboard',
  '/blog/building-mcp-server-with-cursor',
  '/blog/drug-suggestion-app',
  '/blog/portfolio-website',
  '/blog/my-experience-with-windsurf',
  '/blog/experience-using-api-in-ai-code-editor',
  '/blog/acronym-soup',
  '/blog/andrej-karpathy-yc-ai-startup-school',
  '/blog/my-fascination-with-shortcuts',
  '/blog/compelling-india-story',
  '/blog/microsoft-mai-dx-india',
  '/blog/acronym-soup-revisited-2025',
  '/blog/price-parity',
  '/blog/started-to-kindle-again',
  '/blog/autophagy',
  '/blog/feynman-technique',
  '/blog/applying-robinson-method',
  '/blog/memory-evolution',
  '/blog/nepal-annapurna-circuit',
  '/blog/my-random-thoughts-this-week',
  '/blog/nammu-soil-analysis-research',
  '/blog/india-usa-trade-gap-2025',
  '/blog/top-9-famous-rules',
  '/blog/the-great-pivot',
  '/blog/long-weekend-musings-2025',
  '/blog/faq-budding-dentist',
  '/blog/devastated-by-young-girls-demise'
]

// Get current date in ISO format
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0]
}

// Generate XML sitemap
const generateSitemap = (urls) => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const urlsetClose = '</urlset>'
  
  const urlEntries = urls.map(url => {
    const lastmod = getCurrentDate()
    const priority = url === '/' ? '1.0' : '0.8'
    const changefreq = url === '/' ? 'daily' : 'weekly'
    
    return `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('\n')
  
  return `${xmlHeader}
${urlsetOpen}
${urlEntries}
${urlsetClose}`
}

// Main function
const main = async () => {
  try {
    // Combine all routes
    const allRoutes = [...STATIC_ROUTES, ...BLOG_ROUTES]
    
    // Generate sitemap XML
    const sitemapXml = generateSitemap(allRoutes)
    
    // Write to public directory
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
    await fs.writeFile(outputPath, sitemapXml, 'utf8')
    
    console.log('✅ Sitemap generated successfully!')
    console.log(`📁 Location: ${outputPath}`)
    console.log(`🔗 Sitemap URL: ${BASE_URL}/sitemap.xml`)
    console.log(`📊 Total URLs: ${allRoutes.length}`)
    
    // Display the sitemap URL for easy copying
    console.log('\n📋 Copy this URL for Google Search Console:')
    console.log(`${BASE_URL}/sitemap.xml`)
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

// Run the script
main()
