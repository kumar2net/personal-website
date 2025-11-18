Generated fresh from commit ad211ad40c64fcfce235e55a4390dc5225a3144c on 2025-11-12T06:45:09+05:30; sources: code/config only.

## Prerequisites
- Node.js 20+ (backend declares `>=18`, Vite dev server benefits from 20).
- npm 11.6.2 (locked via `package-lock.json`).
- Optional: Python 3.11 for the experimental GNN backend (`backend/gnn_server.py`).
- Access to a Google Cloud project with GA4 BigQuery export (and Vertex AI if you want live topic suggestions). Semantic search now runs entirely on Gemini + a JSON index: keep `GEMINI_API_KEY` around for local indexing, but production queries must use OAuth tokens via `GCP_SERVICE_ACCOUNT_JSON` (or the new `_BASE64` helper).
- API keys: Gemini (`GEMINI_API_KEY`), OpenAI (`OPENAI_API_KEY`), X bearer token. TL;DR reuses the OpenAI key for summary generation.

## Directory Ownership
| Path | Responsibility |
| --- | --- |
| `apps/personal-website` | Primary Vite SPA + scripts. |
| `packages/ui-theme` | Shared MUI theme package. |
| `apps/personal-website/api` | Serverless handlers (convert, semantic search, feeds). |
| `backend` | Express analytics/topic recommender + GA4/Vertex services. |

## Environment Variables
Populate `.env` at repo root (copy from `.env.example`) and `backend/.env` (from `backend/.env.example`).

| Var | Location | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | root | Required for semantic search indexing (`scripts/build-semantic-index.mjs`). Runtime now prefers OAuth tokens, so use this only as a local fallback.
| `OPENAI_API_KEY`, `OPENAI_MODEL` | root | Needed for `/api/tldr` (OpenAI summaries). Set `TLDR_DEV_FAKE=1` if no key is available.
| `GCP_PROJECT_ID`, `GCP_LOCATION` | root + backend | Required for Vertex AI + BigQuery clients.
| `GCP_SERVICE_ACCOUNT_JSON` | root | Inline JSON used by semantic search/Vertex clients; production deployments must set this (or `GCP_SERVICE_ACCOUNT_JSON_BASE64`/`GOOGLE_APPLICATION_CREDENTIALS`) because Google rejects API-key-only requests.
| `GCP_SERVICE_ACCOUNT_JSON_BASE64` | root | Base64 encoded variant for hosts that cannot store multiline secrets; decoded automatically by the Gemini helper.
| `VITE_NEWS_API_KEY`, `VITE_CLIMATIQ_API_KEY` | root | Used by climate/news widgets. Provide dummy strings for local dev if hitting external APIs is optional.
| `VITE_FEATURE_UNREAD` | root | Feature flag toggling unread badge logic.
| `X_BEARER_TOKEN` | root | Enables `/api/x-latest` for Elsewhere page.
| `TLDR_PROVIDER`, `TLDR_DEV_FAKE`, `TLDR_DEV_FALLBACK_ON_ERROR`, `TLDR_OPENAI_MODEL`, `TLDR_MAX_INPUT_CHARS` | root | Tune the `/api/tldr` provider (OpenAI vs heuristic) plus dev fallbacks.
| `VITE_TLDR_ENDPOINT`, `VITE_TLDR_NETLIFY_PORT` | root | Optional client override/port when pointing TL;DR requests at a custom endpoint.
| `GOOGLE_APPLICATION_CREDENTIALS` | backend | Path to service-account JSON for backend BigQuery scripts.
| `GA4_DATASET`, `GA4_TABLE` | backend | Defaults to `analytics_XXXX.events_*`; override per project.
| `RECOMMENDER_MODEL`, `RECOMMENDER_SYSTEM_INSTRUCTION`, `CACHE_TTL_SECONDS`, `RECOMMENDER_DEV_MODE` | backend | Tune Vertex AI prompt + caching.

## Install
```sh
# from repo root
npm install
# install backend deps separately
npm install --prefix backend
```
The UI theme package is part of the workspace, so no extra steps are required.

## Common Commands
| Goal | Command |
| --- | --- |
| Start main SPA | `npm run dev` (Turbo filters to `apps/personal-website`; Vite serves on `http://localhost:5173`). |
| Start SPA directly | `npm run dev --prefix apps/personal-website`. |
| Start backend API | `npm run dev --prefix backend` (Express on `http://localhost:3001`). |
| Build site | `npm run build` (runs `turbo run build`). |
| Lint workspace | `npm run lint` (Turbo fan-out). |
| Frontend quality gate | `npm run quality:check --prefix apps/personal-website` (Biome + unit/e2e scripts). |
| Run sitemap tests | `npm run test:sitemap --prefix apps/personal-website`. |
| Generate semantic index | `npm run semantic:index --prefix apps/personal-website`.

`semantic:index` rebuilds `apps/personal-website/src/data/semantic-index.json` using the Gemini API so the semantic store ships with the freshest blog copy before local testing or Vercel builds.

## Dev Server Matrix
| Service | Command | Port | Notes |
| --- | --- | --- | --- |
| Vite SPA | `npm run dev` | 5173 | Strict port; proxies `/api/convert` and `/api/semantic-search` into the real handlers (semantic search works in dev).
| Express analytics | `npm run dev --prefix backend` | 3001 | Required for Topic Suggestions page.
| TL;DR API | (bundled with Vite) | 5173 proxy | `/api/tldr` runs via Vite's local middleware; Netlify dev is no longer required for summaries.
| Legacy Netlify functions | `netlify dev` (optional) | 8889 | Only spin up if you still hit `/.netlify/functions/*` during migration.
| GNN recommender | `python backend/gnn_server.py` | 8000 | Optional; Graph widgets fall back to static hints without it.

## Startup Checklist
1. Copy env samples and fill required secrets.
2. `npm install` (root) and `npm install --prefix backend`.
3. Start backend (`npm run dev --prefix backend`) so GA4 endpoints respond.
4. In a new terminal run `npm run dev` to boot Vite + local API middleware.
5. Optional: run the Python GNN server or legacy Netlify dev if you need to exercise those surfaces.

## Smoke Tests
1. **Backend health**
   ```sh
   curl http://localhost:3001/api/health | jq
   ```
   Expect `status: healthy` plus GA4 metadata.
2. **Topic suggestions**
   ```sh
   curl "http://localhost:3001/api/recommendations/topics?days=7&limit=3&language=en"
   ```
   Should return `data.topics`; when GA4 data is absent you will see an empty list.
3. **Semantic search**
   ```sh
   curl -X POST http://localhost:5173/api/semantic-search \
     -H 'Content-Type: application/json' \
     -d '{"q":"india usa trade gap","topK":3}'
   ```
   With `GEMINI_API_KEY` set (and `npm run semantic:index` having produced `src/data/semantic-index.json`) you get scored semantic hits sourced from the local index; without the key the handler returns `500`.
4. **Frontend route smoke**
   - Open `http://localhost:5173`.
   - Navigate to `/blog`, `/topics`, `/reco`.
   - Ensure the console is free of uncaught errors and network panel shows 2xx for local API calls.
5. **X feed (requires `X_BEARER_TOKEN`)**
   ```sh
   curl "http://localhost:5173/api/x-latest?username=kumar2net" | jq '.items | length'
   ```
   Expect a 200 with a non-empty `items` array when the bearer token is valid, or a JSON payload containing a `warning` string if all mirrors are down (the SPA surfaces the same warning).

## Troubleshooting
- **Port conflicts**: Vite uses `strictPort`; if 5173 is taken you must free it or override `server.port` in `vite.config.js`.
- **Semantic search 404/500**: run `npm run dev` (Turbo) so both `/api/convert` and `/api/semantic-search` are proxied, set `GEMINI_API_KEY`, and re-run `npm run semantic:index --prefix apps/personal-website` so `src/data/semantic-index.json` exists. If production logs show `API keys are not supported`, add `GCP_SERVICE_ACCOUNT_JSON` (or `_BASE64`) so the handler can mint OAuth tokens.
- **GA4/Vertex auth errors**: confirm service-account JSON is valid and `GA4_DATASET` matches `analytics_<property>` naming.
- **Graph recommender unavailable**: Graph components silently hide themselves until `GNN_API_BASE_URL` responds with `{ initialized: true }`. Run the Python server or change `import.meta.env.VITE_GNN_API_BASE_URL` to a reachable endpoint.
- **Webhook integration UI**: `src/services/webhookService.js` intentionally keeps `webhookUrl=null`, so registration UI only acts as a stub. Enable once backend endpoints exist.
- **TL;DR endpoint errors**: ensure `/api/tldr` is reachable (Vite should proxy it locally). Set `TLDR_DEV_FAKE=1` to stub responses or `VITE_TLDR_ENDPOINT` to point at a custom endpoint if you still rely on Netlify functions.
