# Personal Website Monorepo

Vite + React 19 + MUI 7 monorepo (Turborepo workspaces). Primary app lives in `apps/personal-website`; shared theme in `packages/ui-theme`.

## Quick start
- Install: `npm install`
- Dev (Vite): `npm run dev` (runs `turbo dev --filter=personal-website`)
- Build app only: `npm run --workspace apps/personal-website build`
- Preview: `npm run --workspace apps/personal-website preview`

## Audio TTS (OpenAI)
- Backend: `apps/personal-website/api/blog-tts.js` uses OpenAI Audio Speech and now forces a progressive MP3 response for all languages (no MediaSource). It prefers `.env` over `.env.local` and trims API keys to avoid auth errors. Audio responses are cached.
- Frontend: `BlogAudioPlayer` always fetches via a blob and renders a progress bar while TTS is generating. Playback starts after the user clicks; no background prefetching or MSE streaming paths remain.
- Env required: `OPENAI_API_KEY` in the repo root `.env` (used directly server-side; no client exposure).
- Model selection: set `BLOG_TTS_MODELS` (comma-separated, ordered) to pin the newest TTS model, e.g. `BLOG_TTS_MODELS=<new-tts-model>,gpt-4o-mini-tts`; or set `BLOG_TTS_MODEL` for a single preferred model. Optional `BLOG_TTS_FALLBACK_MODELS` prepends additional fallbacks without overriding defaults.
- API compliance: `client.audio.speech.create({ model, voice, input, response_format })` (no deprecated Configuration wrapper). Translation for Hindi/Tamil uses chat completions (`gpt-4o-mini` by default).
- Latency tuning: Requests clamp to `BLOG_TTS_MAX_CHARS` (default `25000`) and chunk for TTS as needed; streaming env vars are ignored by the player now.
- Local (Vercel): run `vercel dev` so `/api/blog-tts` is on port `3000` (or set `VITE_VERCEL_DEV_PORT`). Vite dev stays on 5173. You can override the endpoint with `VITE_BLOG_TTS_ENDPOINT` if needed.
- Voices: Hindi/Tamil default to supported OpenAI voices (`alloy` unless overridden); unsupported voices are coerced to a valid option to avoid 400s.

## Translations (Hindi/Tamil via OpenAI)
- Backend: `apps/personal-website/api/translate.js` (also exported at root `api/translate.js`).
- Frontend: `TranslateBlock` inside `BlogPostLayout` adds Hindi/Tamil toggle per post; only one translation shown at a time with preserved paragraph breaks.
- Env: `OPENAI_API_KEY` (reused from TTS). Optional `TRANSLATE_OPENAI_MODEL`, `TRANSLATE_MAX_INPUT_CHARS`.
- Local dev: use `vercel dev` (port 3000 by default). If running Vite separately on 5173, the widget auto-calls `http://localhost:${VITE_VERCEL_DEV_PORT||3000}`. You can override with `VITE_API_BASE_URL`.

## Notes
- Sitemaps: `npm run sitemap` (root) or `npm run --workspace apps/personal-website sitemap:submit`.
- Theming: import from `@kumar2net/ui-theme` (named exports only).
- Keep 2-space indentation and functional React components.
