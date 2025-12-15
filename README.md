# Personal Website Monorepo

Vite + React 19 + MUI 7 monorepo (Turborepo workspaces). Primary app lives in `apps/personal-website`; shared theme in `packages/ui-theme`.

## Quick start
- Install: `npm install`
- Dev (Vite): `npm run dev` (runs `turbo dev --filter=personal-website`)
- Build app only: `npm run --workspace apps/personal-website build`
- Preview: `npm run --workspace apps/personal-website preview`

## Audio TTS (OpenAI, streaming)
- Backend: `apps/personal-website/api/blog-tts.js` streams OpenAI Audio Speech (opus via MSE, mp3 progressive fallback). Caches the full buffer after streaming.
- Frontend: `BlogAudioPlayer` streams via MediaSource when supported; falls back to progressive audio if not. Prefetches English on view and sends a shortened excerpt for faster starts.
- Env required: `OPENAI_API_KEY`.
- Local (Vercel): run `vercel dev` so `/api/blog-tts` is on port `3000` (or set `VITE_VERCEL_DEV_PORT`). Vite dev stays on 5173.
- Optional override: set `VITE_BLOG_TTS_ENDPOINT` to a full URL (e.g., prod) if no local functions are running.
- Voices: Hindi/Tamil now default to supported OpenAI voices (e.g., `alloy`); unsupported voices are coerced to a valid option to avoid 400s.

## Translations (Hindi/Tamil via OpenAI)
- Backend: `apps/personal-website/api/translate.js` (also exported at root `api/translate.js`).
- Frontend: `TranslateBlock` inside `BlogPostLayout` adds Hindi/Tamil toggle per post; only one translation shown at a time with preserved paragraph breaks.
- Env: `OPENAI_API_KEY` (reused from TTS). Optional `TRANSLATE_OPENAI_MODEL`, `TRANSLATE_MAX_INPUT_CHARS`.
- Local dev: use `vercel dev` (port 3000 by default). If running Vite separately on 5173, the widget auto-calls `http://localhost:${VITE_VERCEL_DEV_PORT||3000}`. You can override with `VITE_API_BASE_URL`.

## Notes
- Sitemaps: `npm run sitemap` (root) or `npm run --workspace apps/personal-website sitemap:submit`.
- Theming: import from `@kumar2net/ui-theme` (named exports only).
- Keep 2-space indentation and functional React components.
