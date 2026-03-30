# Personal Website App

Primary site app for `kumar2net.com`.

## Stack
- Vite 7
- React 19
- MUI 7 via `@kumar2net/ui-theme`
- Serverless-compatible handlers under `api/`

## Commands
- `npm run --workspace apps/personal-website dev`
- `npm run --workspace apps/personal-website build`
- `npm run --workspace apps/personal-website preview`
- `npm run --workspace apps/personal-website blog:validate`
- `npm run --workspace apps/personal-website semantic:index`
- `npm run --workspace apps/personal-website shorts:metrics`

## Local Workflow
- Run `npm run dev` from the repo root for the normal Vite loop.
- Run `vercel dev` when you need local parity for `/api/blog-tts`, `/api/translate`, and other serverless routes.
- Keep `OPENAI_API_KEY` available for AI-backed routes and content indexing that depends on OpenAI.
- Private client-side gates can be configured through `.env`, including `VITE_UTILITIES_USERNAME` / `VITE_UTILITIES_PASSWORD` and `VITE_NARUVI_USERNAME` / `VITE_NARUVI_PASSWORD`.

## Source Map
- `src/`: app UI, routes, content, and shared client utilities
- `api/`: TTS, translation, and related serverless handlers
- `scripts/`: validation, indexing, sitemap, QA, and content tooling
- `reports/`: generated quality and performance reports

## Docs
- API contract: [`api/BLOG_TTS_CONTRACT.md`](/Users/kumara/personal-website/apps/personal-website/api/BLOG_TTS_CONTRACT.md)
- Repo-level context: [`README.md`](/Users/kumara/personal-website/README.md), [`AGENTS.md`](/Users/kumara/personal-website/AGENTS.md), [`PROJECT.md`](/Users/kumara/personal-website/PROJECT.md)
