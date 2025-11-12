Generated fresh from commit ad211ad40c64fcfce235e55a4390dc5225a3144c on 2025-11-12T06:40:38+05:30; sources: code/config only.

## Overview
- Monorepo managed by npm workspaces + Turborepo (`turbo.json`).
- Primary app: `apps/personal-website` (Vite + React 18, Tailwind, MUI Theme package).
- Secondary app: `apps/news` (skeleton Vite app reserved for news microsite).
- Shared UI package: `packages/ui-theme` (MUI color-system + provider exports).
- API edge/serverless functions live under `/api` for conversions, feeds, semantic search, and AI “generations”.
- Analytics + recommender backend lives under `/backend` (Express server, GA4 BigQuery queries, Vertex AI orchestration plus Python prototypes).

## Top-level tree (selected)
```
api/                     # Vercel/Netlify friendly serverless handlers (convert, semantic-search, wp feed, generations)
apps/
  personal-website/      # Vite React app, scripts/, public/, src/components|pages|data|services
  news/                  # Placeholder Vite app with dev/build stubs
backend/                 # Express analytics API + GA4/Vertex services, Python GNN experiments
packages/
  ui-theme/              # Shared MUI theme + ThemeProvider wrapper
node_modules/            # Root deps for Turbo orchestrator
package.json             # npm workspaces, turbo scripts
package-lock.json        # npm lock (11.x)
turbo.json               # Turborepo task graph definitions
vercel.json              # SPA rewrite (fallback to index.html)
.env.example             # Frontend + functions env sample
backend/.env.example     # Backend env sample
```
(Heavy directories such as `**/node_modules`, `apps/personal-website/dist`, and cached `.turbo` outputs omitted.)

## Workspaces (`npx turbo ls`)
| Package | Path | Type |
| --- | --- | --- |
| `personal-website` | `apps/personal-website` | React + Vite SPA |
| `news` | `apps/news` | Placeholder Vite app |
| `@kumar2net/ui-theme` | `packages/ui-theme` | Shared design system |

## Root npm scripts
| Script | Command | Purpose |
| --- | --- | --- |
| `npm run dev` | `turbo dev --filter=personal-website` | Start primary SPA via Turbo (pipes through package script).
| `npm run build` | `turbo run build` | Build all workspaces respecting dependency graph.
| `npm run lint` | `turbo run lint` | Run lint tasks per workspace.
| `npm run test` | `turbo run test` | Aggregate tests.

## App-specific scripts (highlights)
### `apps/personal-website`
- `dev`: `NODE_OPTIONS=... vite --host 127.0.0.1` (strict port 5173, attaches local convert + semantic-search API middleware).
- `dev:clean`: shell wrapper to reset caches before Vite.
- `build`: `vite build` (outputs to `dist/`).
- `test:*`: numerous Node scripts under `scripts/` (unit, e2e, sitemap, viewport, etc.).
- `ga:*`, `semantic:index`, `sitemap`, `fetch:comments`, `biome:*`, `cleanup:*`: automation for GA4/semantic data, formatting, cleanups.

### `apps/news`
- `dev`: `vite --host 127.0.0.1 --port 5174 --open`.
- Build/lint/test currently stubs logging placeholders.

### `backend`
- `dev`: `nodemon server.js` on port `process.env.PORT || 3001`.
- `gcp:setup` / `gcp:smoke`: shell scripts wiring GA4 BigQuery + service accounts.

## Env sample files
| File | Key variables |
| --- | --- |
| `.env.example` | `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GCP_PROJECT_ID`, `GCP_SERVICE_ACCOUNT_JSON` blob, `VITE_*` client flags (news API, feature toggles), `VITE_CLIMATIQ_API_KEY`, `VITE_FEATURE_UNREAD`, etc.
| `backend/.env.example` | `GOOGLE_APPLICATION_CREDENTIALS`, `GCP_PROJECT_ID`, `GA4_DATASET`, `GA4_TABLE`, `RECOMMENDER_MODEL`, `RECOMMENDER_SYSTEM_INSTRUCTION`, `CACHE_TTL_SECONDS`.

## Ports + endpoints (by config)
- `apps/personal-website`: Vite dev server on `localhost:5173` (strict) with local `/api/convert` + `/api/semantic-search` shims via the Vite middleware hitting the actual serverless handlers.
- `apps/news`: Vite dev server on `localhost:5174`.
- `backend/server.js`: Express API default `3001`, exposes `/api/health`, `/api/analytics/*`, `/api/recommendations/topics`.
- Netlify Functions fallback for TL;DR summary uses port `8889` when Vite host detected.
- GNN sandbox endpoints derived from `VITE_GNN_API_BASE_URL` (default `http://localhost:8000` in dev) for recommender graph + interaction tracking.
- Semantic search falls back to `/api/semantic-search` or custom `VITE_SEMANTIC_SEARCH_ENDPOINT`.

## Supporting scripts & assets
- `api/` functions integrate with Gemini embeddings, WordPress feed, X feed, conversions, and “generations” journaling endpoints persisted via `@vercel/kv` and OpenAI merge fallback.
- `apps/personal-website/scripts/` holds tooling for GA4 ingestion, comments fetch, PDF/doc converters (mammoth, pdfjs), viewport smoke tests, sitemap generator, DevTools probes, and the Gemini semantic indexer.
- `backend/` also contains Python experiments (`gnn_server.py`, `graph_recommender.py`, `analytics_integration.py`) plus shell scripts to bootstrap GCP resources.
