Generated fresh from commit ad211ad40c64fcfce235e55a4390dc5225a3144c on 2025-11-12T06:44:36+05:30; sources: code/config only.

## Monorepo Topology
- npm 11.x workspaces orchestrated via Turborepo (`package.json`, `turbo.json`).
- Workspaces: `apps/personal-website` (primary SPA), `apps/news` (secondary Vite shell), `packages/ui-theme` (MUI design system). The `/backend` Express app and `/api` serverless handlers share the repo but are not Turborepo workspaces.
- Global tooling lives under `apps/personal-website/scripts` (GA4 ingestion, semantic indexing, PDF converters, DevTools probes) and `backend/scripts` (GCP setup smoke tests).

## Frontend: `apps/personal-website`
### Composition & Bootstrapping
- `src/main.jsx` mounts React 18 with `CssVarsProvider` from `@kumar2net/ui-theme`, injects global error/retry logic for vendor bundles, and registers listeners for DOM and promise errors before rendering `<App />`.
- Vite config (`apps/personal-website/vite.config.js`) adds a custom middleware that proxies `/api/convert` and `/api/semantic-search` requests to the real serverless handlers (loading `.env` from the repo root) so dev builds keep the same conversion + semantic-search code paths used in production.

### Routing & Layout
- `src/App.jsx` wraps all pages in `ErrorBoundary`, `SEO`, `ScrollToTop`, and `WorldClock`, and wires `react-router-dom` routes for landing, About, Blog, Projects, Recommendations, Books, Trends, utilities, etc. Most pages are lazy-loaded via `React.lazy` + `<Suspense>` to trim the initial bundle.
- Navigation uses a framer-motion powered header with mobile drawers. Analytics hooks inside `App` fire GA4 `gtag` events on each route change (`useGaPageViews`).

### Data-powered Components
- **Semantic Search**: `src/components/SemanticSearch.jsx` POSTs to `import.meta.env.VITE_SEMANTIC_SEARCH_ENDPOINT` (defaults to `/api/semantic-search`), which generates query embeddings via Gemini and ranks documents from the JSON semantic index, returning scores + latency metadata.
- **Topic Suggestions**: `src/pages/TopicSuggestions.jsx` builds URLs to the Express backend (`http://localhost:3001` when Vite runs on port 5173) to hit `/api/recommendations/topics`, exposing cache-bypass toggles for GA4-driven recommendations.
- **Graph Recommendations**: `src/components/GraphRecommendations.jsx` and `src/components/GraphVisualization.jsx` read `GNN_API_BASE_URL` (`src/utils/gnnApi.js`), fetch graph stats/recommendations, and track user actions via `useInteractionTracking` which POSTs anonymized events to the GNN backend.
- **Generations 2.0**: `src/pages/generations/*` renders journaling tools (Hero explainer, prompt input, reflection gallery, PublishChronicle button). Client helpers in `src/lib/generationsClient.ts` call `VITE_GENERATIONS_API_URL` endpoints with retries/backoff.
- **TL;DR summaries**: `src/hooks/useTldrSummary.js` hashes article text, caches summaries in `localStorage`, and calls `/.netlify/functions/tldr` (or `http://localhost:8889` when running Vite) using keys from `.env.example` (`TLDR_*`).
- **Elsewhere feed**: `src/pages/Elsewhere.jsx` fetches `/api/wp-feed` for WordPress posts and `/api/x-latest` for social updates, decoding HTML safely in-browser.
- **Book utilities**: `src/services/bookCoverService.js` chains Google Books, OpenLibrary, and ISBN lookups with cached fallbacks for offline-friendly covers.

### Local Content & Scripts
- Static blog metadata, the semantic index (`src/data/semantic-index.json`), GA4 seed data, and comments live under `src/data/`; helper utilities (`src/utils/*`) normalize dates, map recommendations, and call GNN APIs.
- Scripts under `apps/personal-website/scripts` generate sitemaps, convert docs to Markdown/JSX, collect GA4 insights, fetch Netlify comments, rebuild the Gemini semantic index (`index-duckdb.mjs`), and run custom tests (`test-viewport`, `test-sitemap`, `test-ga4-connection`).

## Shared Design System: `packages/ui-theme`
- `packages/ui-theme/theme.ts` exports color tokens and an MUI 7 theme with dual color schemes, typography presets, and component defaults tailored for pill buttons and CSS variables.
- `ThemeProvider.tsx` wraps children in `CssVarsProvider` with persistent `k2n-color-scheme` storage, supplying `CssBaseline` so each React tree can opt into dark/light/system modes.

## Serverless Functions: `/api`
- `convert.js`: Request-aware unit converter with wide linear and temperature coverage plus CORS headers; consumed locally via the Vite middleware.
- `wp-feed.js` and `x-latest.js`: Fetch + sanitize external feeds (WordPress RSS via `fast-xml-parser`, X API via bearer token), returning JSON with coarse caching.
- `semantic-search.js`: Loads `src/data/semantic-index.json`, embeds queries via Gemini (`GEMINI_API_KEY`), computes cosine similarity in pure Node.js, and returns the highest-scoring posts plus timing metadata.
- `generations/*.ts`: Entry handlers accept journaling prompts, merge weekly reflections via OpenAI (or fallback text) while persisting output in-memory and, if configured, `@vercel/kv`. `merge.ts` also computes approximate OpenAI costs and exposes fallback reasoning when API keys are absent.
- `semantic-search`, `convert`, `wp-feed`, and `x-latest` export standard Node handlers so they can run under Vercel/Netlify or the local dev server.

## Analytics Backend: `/backend`
- `server.js` spins up Express on `process.env.PORT || 3001`, adds Helmet/CORS, stores page-view metrics in memory, and exposes `/api/analytics/*` plus `/api/recommendations/topics`. Topic endpoints call `services/recommendationService.js`, which orchestrates `BigQuery` queries (`services/bigqueryService.js`) and Vertex AI completions (`services/vertexService.js`).
- `recommendationService` uses NodeCache keyed by GA4 parameters, synthesizes topics when GA4 data is missing, and supports `RECOMMENDER_DEV_MODE` for offline mocks.
- Python utilities (`gnn_server.py`, `graph_recommender.py`, `gnn_mvp.sh`) back the experimental Neural Graph recommender consumed by the frontend.

## Data Flow & Observability
- Client event tracking relies on GA4 via `gtag` plus optional webhook forwarding (`src/services/webhookService.js`). Webhook registration UI exists but is gated until endpoints are implemented, keeping external calls disabled by default.
- Express backend caches analytics responses using NodeCache; semantic search reads vectors from the JSON index (so only Gemini query embeddings are computed at runtime); TL;DR data is cached in `localStorage` keyed by SHA-256 of article text; chronicled reflections persist in memory and Vercel KV when configured.
- Error resiliency: `src/main.jsx` retries mounting up to three times before showing an inline recovery card, and `ErrorBoundary` provides a reload UI with dev-only stack traces.

## Build & Deploy
- Turborepo tasks: `build` runs Vite builds for apps (personal-website depends on `@kumar2net/ui-theme`); `dev` marks watch tasks as persistent. `turbo run build --graph` shows `personal-website` depends on `ui-theme` while `news` is isolated (see `docs/_facts/turbo-graph.dot`).
- Vercel SPA rewrite (`vercel.json`) routes all paths to `index.html`. Backend can deploy independently (Node/Express) or behind Netlify/Vercel serverless proxies.

## Dependency Diagram
```mermaid
graph LR
  subgraph Frontend
    App[App.jsx Router]
    SemanticSearch[SemanticSearch.jsx]
    TopicSuggestions[TopicSuggestions.jsx]
    GraphRecs[GraphRecommendations.jsx]
    GenerationsUI[Generations components]
    TLDR[useTldrSummary hook]
  end
  subgraph Serverless
    ConvertAPI[/api/convert.js/]
    SemanticAPI[/api/semantic-search.js/]
    WPFeed[/api/wp-feed.js/]
    XFeed[/api/x-latest.js/]
    GenerationsAPI[/api/generations/*/]
  end
  subgraph Backend
    ExpressTopics[backend/server.js]
    BigQuerySvc[services/bigqueryService.js]
    VertexSvc[services/vertexService.js]
    GNN[gnn_server.py]
  end
  subgraph Data
    SemanticIndexJSON[src/data/semantic-index.json]
    SemanticMapping[src/data/semantic-mapping.json]
    GA4[BigQuery GA4 tables]
    KV[@vercel/kv]
  end

  App --> SemanticSearch
  App --> TopicSuggestions
  App --> GraphRecs
  App --> GenerationsUI
  App --> TLDR
  SemanticSearch --> SemanticAPI
  SemanticAPI --> SemanticIndexJSON
  SemanticAPI -->|optional| Gemini[(Gemini Embed API)]
  TopicSuggestions --> ExpressTopics
  ExpressTopics --> BigQuerySvc --> GA4
  ExpressTopics --> VertexSvc
  GraphRecs --> GNN
  GenerationsUI --> GenerationsAPI
  GenerationsAPI --> KV
  GenerationsAPI --> OpenAI[(OpenAI GPT-4o mini)]
  TLDR --> NetlifyFunc[/.netlify/functions/tldr]
  App --> ConvertAPI
  App --> WPFeed
  App --> XFeed
```
