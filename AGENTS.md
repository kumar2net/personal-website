schema_version: 1
knowledge_sources:
  - name: context7-latest
    type: http-text
    url: https://context7.com/api/v2/context?libraryId=/upstash/context7&query=overview%20authentication%20api%20keys%20mcp%20search
    follow_redirects: true
    refresh: always
    fetch:
      timeout_seconds: 20
      retries: 2
      backoff_seconds: 2
      headers:
        accept: text/plain, application/json
    cache:
      strategy: etag
      revalidate: true
      ttl_seconds: 0
      store_dir: .codex/cache/context7-latest
      etag_file: .codex/cache/context7-latest/etag
      snapshot_file: .codex/cache/context7-latest/index.json
      on_change:
        emit_patch: true
        patch_format: unified
        output: stdout
runs:
  default:
    context:
      sources:
        - context7-latest
      require:
        - context7-latest
      prefer:
        - context7-latest
guardrails:
  prefer_sources:
    - context7-latest
  disallow_sources:
    - context7-legacy
    - context7-cached
  fallback_policy:
    allow_cached_if_offline: true
    allow_legacy: false
ci:
  schedule: nightly
  refresh_on_run: true
repository_guidelines: |
  # Repository Guidelines

  ## Project Structure & Modules
  - Monorepo managed by npm workspaces and Turborepo. Apps live in `apps/`, shared packages in `packages/`.
  - Primary app: `apps/personal-website` (Vite + React 18 + MUI v7). Theme package: `packages/ui-theme` (exports `getTheme`, `ThemeProvider`, `colorTokens`; no default exports).
  - Assets: Tailwind output and global styles in `apps/personal-website/src/output.css`; scripts in `apps/personal-website/scripts/`.

  ## Build, Test, and Development
  - Install: `npm install`.
  - Dev (app only): `npm run dev` (runs `turbo dev --filter=personal-website`; uses Vite dev server).
  - Build all: `npm run build` (turborepo), or app-only `npm run --workspace apps/personal-website build`.
  - Preview: `npm run --workspace apps/personal-website preview`.
  - Lint/tests (if added): `npm run lint`, `npm run test` (delegated through turbo).
  - Sitemaps: `npm run sitemap` (root) or `npm run --workspace apps/personal-website sitemap:submit`.

  ## Audio & TTS (OpenAI)
  - Uses OpenAI Audio Speech via `/api/blog-tts`; defaults to the official `/v1/audio/speech` models (`gpt-4o-mini-tts`, `tts-1`, `tts-1-hd`), supports `stream_format: "audio"|"sse"`, and caches binary audio responses after synthesis.
  - Frontend (`BlogAudioPlayer`) streams with MediaSource when supported, falls back to blob otherwise, and exposes voice selection.
  - Required env: `OPENAI_API_KEY`.
  - Local (Vercel): run `vercel dev` (serverless on port 3000 by default; override with `VITE_VERCEL_DEV_PORT`). Vite dev on 5173.
  - Optional override endpoint: set `VITE_BLOG_TTS_ENDPOINT` if you want to hit a different API host.
  - Recency gate: If the OpenAI docs show updated audio/TTS examples, models, or deprecations after 2025-12-15, output (i) a one-paragraph diff summary, (ii) before->after code (Node & Python), (iii) a migration checklist (voice/model params, endpoints, feature flags). If last-updated dates cannot be verified from official docs, fail closed and ask for confirmation.

  ## Coding Style & Naming
  - Languages: TypeScript/JavaScript with ES modules; React function components.
  - Formatting: match existing 2-space indentation; avoid default exports in `packages/ui-theme`; prefer named exports elsewhere.
  - Theming: use `getTheme(mode)` and `<ThemeProvider>` from `@kumar2net/ui-theme`; do not reintroduce nested `CssVarsProvider`s.
  - Components: keep props typed (TS) and use descriptive names (`DarkModeWrapper`, `ColorModeProvider`).

  ## Testing Guidelines
  - No formal test suite is present; add tests colocated under `__tests__` or `*.test.(ts|tsx|js)` when modifying complex logic.
  - Prefer lightweight component tests (React Testing Library) and utility unit tests; keep fixtures small and deterministic.

  ## Commit & Pull Request Guidelines
  - Commits: concise, imperative summaries (e.g., “Fix MUI dark mode theme integration”). Keep scope focused; avoid bundling unrelated docs or backup files.
  - PRs: describe intent, highlight app/package touched, list manual verification steps (dev server, build). Include screenshots/gifs for UI changes and note any new scripts or env needs.

  ## Security & Configuration Tips
  - Env: `.env` values are used by Vite; never commit secrets. For local preview, copy `.env.example` if present or define required Vite `VITE_*` vars manually.
  - Packages: `@kumar2net/ui-theme` is a workspace package; ensure workspace install to avoid registry 404s.***

  ## Context7 Snapshot
  <!--CTX7:BEGIN-->
  Last updated: 2026-03-21T01:29:42.327Z
  
  ### GET /api/v2/context - Query Documentation
  
  Source: https://github.com/upstash/context7/blob/master/docs/howto/api-keys.mdx
  
  Query Context7's documentation services using an API key for authentication. This endpoint retrieves context information from a specified library based on your search query.
  
  ```APIDOC
  ## GET /api/v2/context
  
  ### Description
  Query Context7's documentation services to retrieve context information from a specified library based on a search query.
  
  ### Method
  GET
  
  ### Endpoint
  `https://context7.com/api/v2/context`
  
  ### Parameters
  #### Query Parameters
  - **libraryId** (string) - Required - The library identifier in format `/owner/repository` (e.g., `/vercel/next.js`)
  - **query** (string) - Required - The search query to find relevant documentation
  
  ### Authentication
  - **Authorization** (string) - Required - Bearer token format: `Bearer YOUR_API_KEY`
  - API key format: `ctx7sk-**********************`
  
  ### Request Example
  ```bash
  curl "https://context7.com/api/v2/context?libraryId=/vercel/next.js&query=routing" \
    -H "Authorization: Bearer ctx7sk-YOUR_API_KEY_HERE"
  ```
  
  ### Response
  #### Success Response (200)
  - **data** (object) - Context information matching the query
  - **libraryId** (string) - The queried library identifier
  - **query** (string) - The search query used
  
  #### Error Response (401)
  - **error** (string) - "Unauthorized" - Invalid or missing API key
  
  #### Error Response (404)
  - **error** (string) - "Library not found" - Invalid libraryId
  
  ### Security Notes
  - API keys are shown only once during creation
  - Store API keys securely in environment variables
  - Revoked keys will immediately fail all requests
  - Use descriptive key names to track usage across applications
  ```
  
  --------------------------------
  
  ### Authentication Options for Setup
  
  Source: https://github.com/upstash/context7/blob/master/skills/context7-cli/references/setup.md
  
  Authenticate using an existing API key or trigger an OAuth flow. Note that --oauth is exclusive to MCP mode where the IDE handles the flow.
  
  ```bash
  ctx7 setup --api-key YOUR_KEY  # Use an existing API key (both MCP and CLI + Skills mode)
  ctx7 setup --oauth             # OAuth endpoint — MCP mode only (IDE handles the auth flow)
  ```
  
  --------------------------------
  
  ### Configure API Key for Context7 MCP to Prevent Rate Limiting (HTTP Transport)
  
  Source: https://github.com/upstash/context7/blob/master/docs/resources/troubleshooting.mdx
  
  This configuration shows how to add your API key to the Context7 MCP client when using HTTP transport to prevent rate limiting. The API key is included in the `CONTEXT7_API_KEY` header.
  
  ```json
  {
    "mcpServers": {
      "context7": {
        "url": "https://mcp.context7.com/mcp",
        "headers": {
          "CONTEXT7_API_KEY": "YOUR_API_KEY"
        }
      }
    }
  }
  ```
  
  --------------------------------
  
  ### Configure API Key for Context7 MCP to Prevent Authentication Errors (HTTP Headers)
  
  Source: https://github.com/upstash/context7/blob/master/docs/resources/troubleshooting.mdx
  
  This snippet illustrates the correct format for including the `CONTEXT7_API_KEY` in HTTP headers to resolve `401 Unauthorized` errors. Ensure your API key is valid and correctly formatted.
  
  ```json
  {
    "headers": {
      "CONTEXT7_API_KEY": "YOUR_API_KEY"
    }
  }
  ```
  
  --------------------------------
  
  ### Run Context7 MCP Server with HTTP Transport and Authentication
  
  Source: https://context7.com/upstash/context7/llms.txt
  
  These commands demonstrate how to start the Context7 Multi-Client Protocol (MCP) server, specifying HTTP as the transport for remote connections and setting the listening port. It also shows how to authenticate the server using an environment variable for the API key.
  
  ```bash
  npx @upstash/context7-mcp --transport http --port 3000
  
  export CONTEXT7_API_KEY=ctx7sk-your-key
  npx @upstash/context7-mcp
  ```
  <!--CTX7:END-->



