import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const contentDir = path.join(rootDir, 'content')
const distDir = path.join(rootDir, 'dist')

const feedPath = path.join(contentDir, 'feed.json')
const rawFeed = await readFile(feedPath, 'utf-8')
const feed = JSON.parse(rawFeed)

await mkdir(distDir, { recursive: true })

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const formatDate = (iso) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const sectionsMarkup = (feed.sections ?? [])
  .map((section) => {
    const cards = (section.items ?? [])
      .map((item) => `
        <article class="news-card">
          <header>
            <span class="source">${escapeHtml(item.source)}</span>
            ${item.tag ? `<span class="tag">${escapeHtml(item.tag)}</span>` : ''}
          </header>
          <h3>${escapeHtml(item.title)}</h3>
          ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ''}
          <footer>
            <span>${formatDate(item.publishedAt)}</span>
            <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open ↗</a>
          </footer>
        </article>
      `)
      .join('\n')

    return `
      <section>
        <div class="section-heading">
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.summary ?? '')}</p>
        </div>
        <div class="card-grid">
          ${cards}
        </div>
      </section>
    `
  })
  .join('\n')

const watchlistMarkup = (feed.watchlist ?? [])
  .map(
    (item) => `
      <div class="watch-item ${item.direction === 'down' ? 'down' : 'up'}">
        <p class="label">${escapeHtml(item.label)}</p>
        <p class="value">${escapeHtml(item.value)}</p>
        <p class="change">${escapeHtml(item.change)}</p>
      </div>
    `,
  )
  .join('\n')

const quickLinksMarkup = (feed.quickLinks ?? [])
  .map(
    (link) => `
      <a class="quick-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
        <span class="category">${escapeHtml(link.category)}</span>
        <span class="title">${escapeHtml(link.title)}</span>
        <span class="summary">${escapeHtml(link.summary ?? '')}</span>
      </a>
    `,
  )
  .join('\n')

const audioMarkup = (feed.audioBriefings ?? [])
  .map(
    (audio) => `
      <a class="audio-card" href="${escapeHtml(audio.url)}" target="_blank" rel="noopener noreferrer">
        <div>
          <p class="source">${escapeHtml(audio.source)}</p>
          <p class="title">${escapeHtml(audio.title)}</p>
          <p class="duration">${escapeHtml(audio.duration ?? '')}</p>
        </div>
        <span class="icon">↗</span>
      </a>
    `,
  )
  .join('\n')

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kumar News Desk</title>
    <meta name="description" content="Curated market, policy, and climate resources from apps/news." />
    <style>
      :root {
        color-scheme: light;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f7f8fb;
        color: #1f2937;
      }
      body {
        margin: 0;
        padding: 2rem 1rem 4rem;
        display: flex;
        justify-content: center;
      }
      main {
        width: min(960px, 100%);
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }
      header.hero {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        border: 1px solid #fcd34d;
        border-radius: 24px;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(251, 191, 36, 0.25);
      }
      header.hero h1 {
        margin: 0;
        font-size: clamp(1.75rem, 4vw, 2.5rem);
      }
      header.hero p {
        margin: 1rem 0 0;
        color: #92400e;
        max-width: 60ch;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.9rem;
        color: #4b5563;
      }
      .section-heading {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .section-heading h2 {
        margin: 0;
        font-size: 1.4rem;
      }
      .card-grid {
        display: grid;
        gap: 1.25rem;
      }
      @media (min-width: 768px) {
        .card-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      .news-card {
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 1.5rem;
        background: #fff;
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-height: 220px;
      }
      .news-card header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        color: #0369a1;
        font-size: 0.9rem;
      }
      .news-card .tag {
        background: #e0f2fe;
        color: #0369a1;
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .news-card h3 {
        margin: 0;
        font-size: 1.1rem;
      }
      .news-card p {
        margin: 0;
        color: #475569;
      }
      .news-card footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        font-size: 0.85rem;
        color: #6b7280;
      }
      .news-card footer a {
        color: #0369a1;
        font-weight: 600;
        text-decoration: none;
      }
      .watch-grid {
        display: grid;
        gap: 1rem;
      }
      @media (min-width: 640px) {
        .watch-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (min-width: 1024px) {
        .watch-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }
      .watch-item {
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 1.25rem;
        background: #fff;
      }
      .watch-item.up .change {
        color: #047857;
      }
      .watch-item.down .change {
        color: #dc2626;
      }
      .quick-links, .audio-grid {
        display: grid;
        gap: 1rem;
      }
      @media (min-width: 768px) {
        .quick-links, .audio-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      .quick-link {
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        padding: 1.5rem;
        background: #fff;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .quick-link .category {
        font-weight: 600;
        color: #0369a1;
        font-size: 0.85rem;
      }
      .quick-link .title {
        font-weight: 600;
        font-size: 1.05rem;
      }
      .quick-link .summary {
        color: #4b5563;
        font-size: 0.9rem;
      }
      .audio-card {
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        padding: 1.5rem;
        background: #f8fafc;
        text-decoration: none;
        color: inherit;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .audio-card .source {
        font-size: 0.85rem;
        color: #475569;
      }
      .audio-card .title {
        font-weight: 600;
        font-size: 1.05rem;
      }
      footer.page-footer {
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        padding: 1.5rem;
        background: #f8fafc;
        font-size: 0.9rem;
        color: #475569;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      footer.page-footer a {
        color: #0369a1;
        font-weight: 600;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main>
      <header class="hero">
        <h1>Kumar's News Desk</h1>
        <p>A curated dashboard for markets, policy, technology, and climate coverage maintained inside the monorepo under apps/news.</p>
        <div class="meta">
          <span><strong>Updated:</strong> ${formatDate(feed.updatedAt)}</span>
          <span><strong>Source:</strong> apps/news/content/feed.json</span>
        </div>
      </header>
      ${feed.headline ? `
        <section>
          <div class="section-heading">
            <h2>${escapeHtml(feed.headline.tag ?? 'Spotlight')}</h2>
            <p>${escapeHtml(feed.headline.summary ?? '')}</p>
          </div>
          <div class="card-grid">
            <article class="news-card">
              <header>
                <span class="source">${escapeHtml(feed.headline.source ?? '')}</span>
              </header>
              <h3>${escapeHtml(feed.headline.title ?? '')}</h3>
              <p>${escapeHtml(feed.headline.summary ?? '')}</p>
              <footer>
                <span>${formatDate(feed.headline.publishedAt)}</span>
                <a href="${escapeHtml(feed.headline.url ?? '')}" target="_blank" rel="noopener noreferrer">Read spotlight ↗</a>
              </footer>
            </article>
          </div>
        </section>
      ` : ''}
      ${sectionsMarkup}
      ${feed.watchlist?.length ? `
        <section>
          <div class="section-heading">
            <h2>Market Watchlist</h2>
            <p>Snapshot curated from NSE, MCX, and FX dashboards.</p>
          </div>
          <div class="watch-grid">
            ${watchlistMarkup}
          </div>
        </section>
      ` : ''}
      ${feed.quickLinks?.length ? `
        <section>
          <div class="section-heading">
            <h2>Quick Links</h2>
            <p>Useful resources to keep handy while scanning the tape.</p>
          </div>
          <div class="quick-links">
            ${quickLinksMarkup}
          </div>
        </section>
      ` : ''}
      ${feed.audioBriefings?.length ? `
        <section>
          <div class="section-heading">
            <h2>Listen while you read</h2>
          </div>
          <div class="audio-grid">
            ${audioMarkup}
          </div>
        </section>
      ` : ''}
      <footer class="page-footer">
        <p>Built with static data maintained in <code>apps/news</code>. When the personal site deploys, this feed ships alongside it.</p>
        <a href="${escapeHtml(feed.fallback?.url ?? 'https://impnews.netlify.app/')}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(feed.fallback?.label ?? 'Open the IMP News microsite')} ↗
        </a>
      </footer>
    </main>
  </body>
</html>
`

await writeFile(path.join(distDir, 'index.html'), html, 'utf8')
await writeFile(path.join(distDir, 'feed.json'), JSON.stringify(feed, null, 2), 'utf8')

console.log(`News desk copied → ${distDir}`)
