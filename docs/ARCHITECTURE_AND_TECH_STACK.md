# Architecture & Tech Stack

Last updated: **October 29, 2025**

This document describes how the personal website is assembled across the React frontend, Netlify serverless layer, and the optional analytics/recommendation services that live in the `backend/` directory.

## System Overview

```
React SPA (Vite build)
        │
        ├─ Netlify Functions (Node ESM)
        │        ├─ Content utilities (semantic search, sitemap, TLDR)
        │        ├─ AI signals (topic recommendations, tech trends)
        │        └─ CMS tooling (WordPress ingest, notifications)
        │
        └─ Optional Python services (BigQuery + Vertex AI)
                 └─ GA4 analytics enrichment & recommender scripts
```

### High-level characteristics

- **SPA delivery** – React Router drives the navigation with route-level code splitting (lazy imports in `src/App.jsx`).
- **Static + dynamic content** – Blog posts, books, and dossier pages live as JSX/MDX-like files under `src/pages/**`; dynamic data comes from Netlify Functions or backend scripts.
- **Serverless helpers** – Netlify Functions provide data APIs without maintaining a long-lived server.
- **Optional AI backend** – Python services handle GA4 → BigQuery ingestion and Vertex AI powered recommendations when the stack is run in “full” mode.

## Frontend Composition

| Area | Notes |
|------|-------|
| Framework | React 18 (function components + hooks) |
| Build tool | Vite 5 with manual chunking set up in `vite.config.js` |
| Styling | Tailwind CSS + bespoke class utilities |
| Animations | Framer Motion (`motion.div`, page transitions, content highlights) |
| Routing | React Router 6 with `lazy()` imports for non-critical routes |
| Data helpers | `react-markdown`, `gray-matter`, custom utilities under `src/utils/` |
| SEO | `SEO` component (React Helmet Async) sets per-route meta, OG, and canonical tags |

### Content organization

```
src/
├── components/        shared UI blocks (WorldClock, BlogSentimentSummary, etc.)
├── pages/             route components (Blog, Projects, Books, dashboards)
│   └── blog/          individual long-form articles (JSX with prose + assets)
├── data/              structured data + indexes
├── services/          client utilities (analytics, API wrappers)
└── utils/             content/date helpers and generic functions
```

The new **Digital Swadeshi Age** article (`src/pages/blog/2025-10-29-digital-swadeshi-age.jsx`) demonstrates the current pattern: motion wrappers, badge chips, tables, and locally hosted media referenced from `/public/media`.

## Netlify Functions Layer

- Location: `netlify/functions/*.js` (ES module syntax)
- Typical shape:

  - `api-recommendations-topics.js` – Serves GA4/BigQuery driven topic suggestions.
  - `semantic-search.js` – Exposes similarity lookups across the blog corpus.
  - `tech-trends.js` – Aggregates HN/GitHub/Reddit trend signals for the Trends dashboard.
  - `image-proxy.js` – Proxy helper for remote assets that need caching/headers.
  - `wordpress-auto-publish.js`, `wp-feed.js` – Bridge WordPress content into the SPA.
  - Debug/test utilities (`debug-*.js`, `tldr.js`, `notifications.js`) support maintenance and tooling.

Functions are invoked via Netlify’s `/.netlify/functions/*` endpoints and are consumed directly inside React pages or scripts.

## Optional Python / Node Services (`backend/`)

The `backend/` directory houses analytics and ML helpers that are not required for local development but power richer deployments:

- BigQuery + GA4 ingestion
- Topic clustering and recommender pipelines
- Vertex AI (Gemini) orchestrations
- Support scripts for content indexing and semantic enrichment

These services expect Google Cloud credentials and are usually started independently from the React SPA.

## Data Flows

### Content pipeline

```
Markdown / JSX sources → build-time parsing (gray-matter, custom helpers)
                       → blog index utilities
                       → rendered by React pages with SEO metadata
```

### Recommendation pipeline

```
GA4 events → BigQuery (optional) → ML scripts (backend/) → cached outputs
         → surfaced via Netlify Function (api-recommendations-topics)
         → consumed by pages such as /projects and Blog summaries
```

### In-app utilities

- **Semantic search**: client issues requests to `/semantic-search`; function computes embedding similarity using cached vectors.
- **Tech trends dashboard**: `/tech-trends` function fetches external APIs and returns normalized trend objects.
- **Status / forms**: helper functions (`list-forms`, `test-forms`) provide Netlify form diagnostics.

## Tooling & Quality Gates

- **Linting**: ESLint 9 configuration lives in `eslint.config.js` with browser globals and React hooks rules.
- **Formatting**: Biome (`npm run biome:check`) ensures consistent formatting and catches common issues.
- **Testing scripts**: `npm run test:unit`, `npm run test:e2e`, and `npm run test:all` execute Node-based harnesses under `scripts/`.
- **Automation**: `codemon` tasks (analyze/clean) assist with maintenance sweeps.

## Deployment Footprint

- Hosted on **Netlify** – push to `master` triggers the production build.
- Build command: `npm run build`
- Output: `dist/`
- Caching and rewrites are controlled via `public/_headers` and Netlify configuration files.

Consult `docs/DEPLOYMENT_STATUS.md` for the latest release checklist, metrics to monitor, and troubleshooting steps.

