# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project summary
- React + Vite SPA with lazy-routed pages, Tailwind CSS, and SEO via react-helmet-async
- Serverless endpoints provided via platform-specific folders (Netlify Functions under netlify/functions; alternative simple endpoints under api/). Optional Python/Node services live in backend/ for GA4/BigQuery/Vertex AI pipelines.

Essential commands
- Install: npm install
- Dev server (opens browser): npm run dev
  - E2E tests expect http://localhost:5173 to be running
- Build (outputs to dist/): npm run build
- Preview a production build: npm run preview
- Lint (ESLint 9): npm run lint
- Biome (static analysis/format):
  - Check: npm run biome:check
  - Fix (write): npm run biome:fix

Tests and quality gates
- Unit (static/unit checks via Node script): npm run test:unit
- End-to-end (HTTP and source checks; requires dev or preview server): npm run test:e2e
- Run everything: npm run test:all
- Pre-deploy gate (unit + e2e + build): npm run test:pre-deploy
- Additional: viewport/mobile checks: npm run test:viewport
- One test only: run the specific Node script directly, e.g. node scripts/test-unit.mjs
  - Note: these are bespoke Node scripts, not a conventional Jest/Vitest suite; there is no pattern filter for subsets inside a script.

Platform and deployment
- Netlify: repository is set up for Netlify deploys (see README and docs/DEPLOYMENT_STATUS.md)
  - Build command: npm run build; Publish directory: dist/
  - Functions (Node ESM) live under netlify/functions and are invoked at /.netlify/functions/<name>
- Vercel: vercel.json rewrites all routes to index.html and includes a host redirect to non-www; simple API endpoints exist under api/
- Docker/Cloud Build: Dockerfile and cloudbuild.yaml are included for alternative pipelines

Environment
- Copy .env.example to .env for local development when using analytics/AI features
- Example flags:
  - `user_last_catchup_v1` localStorage entry powers the header catch-up pill; reset it manually in localStorage during QA
  - Google/Vertex AI and GA4/BigQuery credentials are required for recommender/semantic features

Architecture overview (big picture)
- Entry and error hardening: src/main.jsx sets up BrowserRouter and react-helmet-async, with robust vendor-bundle error detection and fallback rendering
- Routing and composition: src/App.jsx declares all routes; only the About page is eagerly loaded, the rest are lazy() split for performance
  - Dynamic routes: /blog/:slug resolves via pages/blog/PostDynamic
- Other notable pages: Utilities (/utilities)
- SEO: components/SEO wraps react-helmet-async; routes set per-page title/description/canonical/type
- Analytics: simple gtag page view and navigation event tracking on route changes
- Content data: src/data/blogIndex.js exposes getBlogSeo(slug) and post metadata consumed by Blog/Post pages
- Styling/perf: Tailwind utilities, responsive classes throughout; Vite handles bundling to dist/ with code-splitting
- Serverless:
  - api/: lightweight endpoints such as semantic-search.js, wp-feed.js, x-latest.js
  - netlify/functions/: platform functions for recommendations, semantic search, tech trends, forms/debug, proxying, notifications
- Optional backend: backend/ contains Python + Node scripts/services for GA4→BigQuery pipelines and Vertex AI/graph recommender experiments (requires Google Cloud env)

Testing expectations (so agents don’t fight the suite)
- E2E scripts check HTTP 200s for key routes, navigation text, accessibility markers (ARIA/semantic tags), image alt coverage in blog pages, and bundle size (< ~3 MB across dist/assets/*.js)
- Unit script asserts presence of core files/config (e.g., vite/tailwind/eslint) and key UI behaviors. If netlify.toml is absent locally, some checks may SKIP/FAIL.

Notable docs to consult
- README.md: live site, stack summary, local dev, and the catch-up posts overview (see Deployment Notes too)
- docs/ARCHITECTURE_AND_TECH_STACK.md: system architecture, function inventory, and data flows
- docs/DEPLOYMENT_STATUS.md: pre-deploy checklist and manual deploy commands

Handy scripts (selected)
- Sitemap generation: npm run sitemap
- Semantic indexing helpers: npm run semantic:index
- Build with external comments prefetch: npm run build:with-comments

Conventions for agents
- Prefer adding new pages/components under src/pages and src/components, and wire routes in src/App.jsx
- When adding posts, register metadata in src/data/blogIndex.js to keep SEO utilities working
- Keep e2e/unit expectations in sync when modifying navigation, accessibility semantics, or build output size
