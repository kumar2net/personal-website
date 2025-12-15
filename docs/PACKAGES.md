Generated fresh from commit ad211ad40c64fcfce235e55a4390dc5225a3144c on 2025-11-12T06:45:46+05:30; sources: code/config only.

## Workspace Summary
| Package | Path | Purpose |
| --- | --- | --- |
| `personal-website` | `apps/personal-website` | React 19 + Vite SPA with blog, recommendations, semantic search, and automation tooling.
| `@kumar2net/ui-theme` | `packages/ui-theme` | Shared MUI 7 theme + ThemeProvider exports.
| (extra) `api` | `apps/personal-website/api/*` | Serverless handlers consumed by Vite + Vercel.
| (extra) `backend` | `backend/` | Express analytics + GA4/Vertex topic recommender.

## Root / Turborepo
- Entrypoints: `package.json` scripts `dev`, `build`, `lint`, `test` -> `turbo` orchestrator referencing `turbo.json` tasks (`build`, `dev`, `lint`, `test`).
- Key dev dependencies: `turbo@^2.6.0`.
- Use `npm run <task>` at root to fan out to workspaces respecting dependency DAG captured in `docs/_facts/turbo-graph.dot`.

## `apps/personal-website`
- Entrypoints:
  - `src/main.jsx`: bootstraps React root with global vendor error recovery and renders Vercel Speed Insights telemetry alongside `<App />`.
  - `src/App.jsx`: router, layout, nav, and lazy route definitions.
  - `src/index.css` + `tailwind.config.js`: styling baseline (Tailwind + custom classes).
- `vite.config.js`: attaches `withLocalApi` plugin for `/api/convert` and `/api/semantic-search`, loads env files, and sets aliases.
- Public surface:
  - `src/pages/*` exports dozens of route components (`About`, `Blog`, `TopicSuggestions`, `Recommendations`, etc.).
  - `src/components/*` exports re-usable widgets (SEO, ErrorBoundary, GraphVisualization, SemanticSearch, TldrSummary, PDF extractor, world clock, etc.).
  - `src/services/*.js` provide data loaders (book covers, OpenLibrary wrappers, webhook stub).
- `src/data` stores blog metadata, GA4 snapshots, comments, and the JSON semantic index (`semantic-index.json`).
- Scripts (npm): `dev`, `build`, `lint`, `preview`, plus >30 task-specific commands (`semantic:index`, `ga:*`, `test:*`, `biome:*`, `cleanup:*`, `convert:*`). `semantic:index` calls `scripts/build-semantic-index.mjs` to rebuild `src/data/semantic-index.json`. All scripts run node-based utilities inside `scripts/`.
- Notable dev utilities under `scripts/` include `generate-sitemap.mjs`, `ga4-topic-suggestions.mjs`, `test-viewport-mobile.mjs`, `fetch-comments-build.mjs`, and `test-chrome-devtools.mjs` for headless probes.

## `packages/@kumar2net/ui-theme`
- Files: `theme.ts`, `ThemeProvider.tsx`, `index.ts`.
- Exports: `getTheme`, Material 3 `colorTokens`, `ThemeProvider`, `ThemeProviderProps` (no default exports).
- Implementation: builds both light/dark schemes from `colorTokens` via `@mui/material/styles/extendTheme` and uses `CssVarsProvider` (`modeStorageKey = "k2n-color-scheme"`) so apps can switch `light`/`dark`/`system` without rebuilding the theme.
- Consumed in `apps/personal-website/src/main.jsx` and available to other packages via workspace resolution.

## `apps/personal-website/api` (serverless)
| Function | File | Notes |
| --- | --- | --- |
| Unit converter | `apps/personal-website/api/convert.js` | GET self-docs, POST conversions, includes manual streaming body parser.
| Semantic search | `apps/personal-website/api/semantic-search.js` | Loads `src/data/semantic-index.json`, embeds queries via Gemini, computes cosine similarity in Node.js, and returns `{ id, title, url, excerpt, score }` plus latency metadata.
| WordPress feed proxy | `apps/personal-website/api/wp-feed.js` | Fetches RSS, defends against HTML responses, strips markup with `fast-xml-parser`.
| X latest posts | `apps/personal-website/api/x-latest.js` | Prefers the X v2 API via `X_BEARER_TOKEN`, then rotates through configurable Nitter mirrors before returning a warning payload so clients degrade gracefully.


## `backend`
- Entrypoints:
  - `server.js`: Express + Helmet + CORS, analytics memory store, `/api/analytics/*`, `/api/recommendations/topics` (TopicSuggestions page), `/api/health`.
  - `services/bigqueryService.js`: GA4 SQL queries, dataset discovery helpers, host filtering.
  - `services/recommendationService.js`: orchestrates GA4 data fetch + Vertex AI completions with NodeCache + dev mock mode.
  - `services/vertexService.js`: wraps Vertex AI `generateContent` requests.
  - Python scripts (`gnn_server.py`, `graph_recommender.py`) for Neural Graph experiments plus shell scripts (`scripts/gcp_setup.sh`, `scripts/gcp_smoke.sh`).
- npm scripts: `start`, `dev` (nodemon), `gcp:setup`, `gcp:smoke`.
- Tests: `test_gnn.py`, `test_recommender_output.py`, `test_simple_output.py` ensure Python stack sanity.

## Cross-cutting Scripts & Assets
- `apps/personal-website/scripts/start-dev-clean.sh`: resets caches before `npm run dev`.
- `scripts/test-chrome-devtools.mjs`: headless DevTools probe used later in the CDP workflow.
- Data generation utilities produce Markdown/JSX under `src/pages/books/*` and `src/pages/blog/*`.

Use these sections as the canonical reference for package entrypoints, public APIs, and dev scripts—the old docs have been archived under `docs/_archive/*`.
