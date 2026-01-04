schema_version: 1
knowledge_sources:
  - name: context7-latest
    type: http-json
    url: https://docs.context7.dev/latest/index.json
    follow_redirects: true
    refresh: always
    fetch:
      timeout_seconds: 20
      retries: 2
      backoff_seconds: 2
      headers:
        accept: application/json
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
  - Uses OpenAI Audio Speech; streams `audio/ogg` (opus) via `/api/blog-tts`. Caches full buffers after streaming.
  - Frontend (`BlogAudioPlayer`) streams with MediaSource when supported; falls back to blob otherwise.
  - Required env: `OPENAI_API_KEY`.
  - Local (Vercel): run `vercel dev` (serverless on port 3000 by default; override with `VITE_VERCEL_DEV_PORT`). Vite dev on 5173.
  - Optional override endpoint: set `VITE_BLOG_TTS_ENDPOINT` if you want to hit a different API host.

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
