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

  ## Repo Reality
  - Monorepo: npm workspaces + Turborepo.
  - Primary app: `apps/personal-website` using Vite 7, React 19, and MUI 7.
  - Shared theme package: `packages/ui-theme` with named exports only.
  - Short-form tooling and reusable prompts live under `apps/shorts-optimizer` and `skills/`.

  ## Core Commands
  - Install: `npm install`
  - Dev: `npm run dev`
  - Build all: `npm run build`
  - Build app only: `npm run --workspace apps/personal-website build`
  - Preview app: `npm run --workspace apps/personal-website preview`
  - Validate agent docs: `npm run agent:lint`
  - Check repo pulse: `npm run pulse:check`

  ## Engineering Rules
  - Verify package versions, scripts, and routes from code before updating docs.
  - Keep docs compact. Replace stale prose instead of layering new prose on top.
  - Prefer canonical contracts and runbooks over repeated vendor-detail dumps.
  - Keep 2-space indentation, functional React components, and named exports in `packages/ui-theme`.
  - Do not reintroduce nested `CssVarsProvider`s; use `ThemeProvider` and `getTheme` from `@kumar2net/ui-theme`.

  ## AI Routes
  - `/api/blog-tts` and `/api/translate` are the main OpenAI-backed endpoints in daily use.
  - `OPENAI_API_KEY` is required for server-side AI features.
  - Treat model aliases, pricing, quotas, and vendor-specific edge cases as volatile. Keep durable details in code and in [`apps/personal-website/api/BLOG_TTS_CONTRACT.md`](/Users/kumara/personal-website/apps/personal-website/api/BLOG_TTS_CONTRACT.md), then verify current vendor docs before making external claims.

  ## Hygiene
  - Do not commit secrets.
  - Avoid generated noise unless it is an intentional artifact or report.
  - Remove stale docs or point to the canonical source; do not leave contradictory guidance behind.

  ## Context7 Snapshot
  <!--CTX7:BEGIN-->
  Last updated: 2026-04-14T01:37:37.859Z
  
  Context7 compact snapshot
  
  - GET /api/v2/context - Query Documentation: Query Context7's documentation services using an API key for authentication. This endpoint retrieves context information from a specified library based on your search query.
  - GET /api/v2/context: curl "https://context7.com/api/v2/context?libraryId=/vercel/next.js&query=routing" \
  - Authenticate Context7 API Request with Bearer Token: Example curl command demonstrating how to authenticate requests to Context7's API using a Bearer token in the Authorization header. The API key should be included in the format 'Bearer YOUR_API_KEY' and requests inclu...
  - Configure API Key for Context7 MCP to Prevent Authentication Errors (HTTP Headers): This snippet illustrates the correct format for including the `CONTEXT7_API_KEY` in HTTP headers to resolve `401 Unauthorized` errors. Ensure your API key is valid and correctly formatted.
  - Configure API Key for Context7 MCP to Prevent Rate Limiting (HTTP Transport): This configuration shows how to add your API key to the Context7 MCP client when using HTTP transport to prevent rate limiting. The API key is included in the `CONTEXT7_API_KEY` header.
  - Refresh with `node scripts/pull-context7.mjs` before relying on vendor-specific details.
  <!--CTX7:END-->


