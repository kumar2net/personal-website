# Personal Website Monorepo

Vite + React 19 + MUI 7 monorepo (Turborepo workspaces). Primary app lives in `apps/personal-website`; shared theme in `packages/ui-theme`.

## Quick start
- Install: `npm install`
- Dev (Vite): `npm run dev` (runs `turbo dev --filter=personal-website`)
- Build app only: `npm run --workspace apps/personal-website build`
- Preview: `npm run --workspace apps/personal-website preview`

## Audio TTS (OpenAI)
- Backend: `apps/personal-website/api/blog-tts.js` wraps OpenAI `/v1/audio/speech` with current official model defaults (`gpt-4o-mini-tts`, `tts-1`, `tts-1-hd`), optional caller-provided `model`/`voice`, `audio|sse` stream formats, and long-form chunking that stays below the per-request speech input limit. Binary audio responses are cached.
- Frontend: `BlogAudioPlayer` progressively streams with `MediaSource` when the browser supports the returned MIME type, falls back to blob playback otherwise, and now lets readers choose a voice before generating audio.
- Env required: `OPENAI_API_KEY` in the repo root `.env` (used directly server-side; no client exposure).
- Model selection: set `BLOG_TTS_MODELS` (comma-separated, ordered) or `BLOG_TTS_MODEL` to override the default model order. Optional `BLOG_TTS_FALLBACK_MODELS` prepends additional fallbacks. If you want a pinned snapshot, set it explicitly through one of those env vars.
- API compliance: the server uses `client.audio.speech.create(body, { signal })`, only sends `instructions` to models that support them, and rejects unsupported combinations such as `tts-1` plus `stream_format: "sse"`. Translation for Hindi/Tamil uses chat completions (`gpt-4o-mini` by default).
- Latency tuning: requests clamp total text to `BLOG_TTS_MAX_CHARS` (default `25000`), each speech request chunk stays under the OpenAI Speech API input limit, and the web player retries with `mp3` when a long-form non-`mp3` audio request would require unsafe binary concatenation.
- Local (Vercel): run `vercel dev` so `/api/blog-tts` is on port `3000` (or set `VITE_VERCEL_DEV_PORT`). Vite dev stays on 5173. You can override the endpoint with `VITE_BLOG_TTS_ENDPOINT` if needed.
- Voices: English/Hindi/Tamil each have a server default voice, overrideable via env or request `voice`. The site player exposes the supported OpenAI voice list directly.

## Repo Pulse
- Run `npm run pulse:check` to compare the current external baseline against `docs/_facts/pulse-state.json`.
- Add `-- --write-state` after reviewing a real change to refresh both `docs/_facts/pulse-state.json` and `docs/_facts/pulse-report.md`.
- The check is intentionally narrow: OpenAI audio/TTS docs signals, MDN WebGPU availability guidance, and Context7 freshness from `AGENTS.md`.

## Translations (Hindi/Tamil via OpenAI)
- Backend: `apps/personal-website/api/translate.js` (also exported at root `api/translate.js`).
- Frontend: `TranslateBlock` inside `BlogPostLayout` adds Hindi/Tamil toggle per post; only one translation shown at a time with preserved paragraph breaks.
- Env: `OPENAI_API_KEY` (reused from TTS). Optional `TRANSLATE_OPENAI_MODEL`, `TRANSLATE_MAX_INPUT_CHARS`.
- Local dev: use `vercel dev` (port 3000 by default). If running Vite separately on 5173, the widget auto-calls `http://localhost:${VITE_VERCEL_DEV_PORT||3000}`. You can override with `VITE_API_BASE_URL`.

## Notes
- Shorts starter pack:
  - Create a new short from the canonical 9:16 pack with `npm run shorts:scaffold -- --slug ai-on-upi --title "AI on UPI"`.
  - Validate the generated manifest with `npm run shorts:validate -- --manifest content/shorts/ai-on-upi/manifest.json`.
  - Build a locale-specific render plan with `npm run shorts:plan -- --manifest content/shorts/ai-on-upi/manifest.json --cut shorts-9.16-en --lang en`.
  - Export subtitles with `npm run shorts:subs -- --manifest content/shorts/ai-on-upi/manifest.json --lang ta`.
- Sitemaps: `npm run sitemap` (root) or `npm run --workspace apps/personal-website sitemap:submit`.
- Theming: import from `@kumar2net/ui-theme` (named exports only).
- Keep 2-space indentation and functional React components.
