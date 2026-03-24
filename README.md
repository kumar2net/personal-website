# Personal Website Monorepo

Monorepo for `kumar2net.com`. The main app lives in `apps/personal-website`; shared design tokens and providers live in `packages/ui-theme`.

## Stack
- npm workspaces + Turborepo
- Vite 7 + React 19
- MUI 7 with a shared theme package
- Serverless-compatible API handlers for TTS, translation, semantic search, and related utilities

## Core Commands
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run --workspace apps/personal-website preview`
- `npm run --workspace apps/personal-website blog:validate`
- `npm run pulse:check`
- `npm run agent:lint`

## Repo Map
- `apps/personal-website`: primary site, API handlers, and app scripts
- `apps/shorts-optimizer`: CLI for Shorts diagnosis and rewrite planning
- `packages/ui-theme`: shared MUI theme and provider
- `docs/`: architecture, runbooks, contracts, and repo facts
- `skills/`: reusable writing and short-form prompt rules

## AI Features
- [`/api/blog-tts`](/Users/kumara/personal-website/apps/personal-website/api/BLOG_TTS_CONTRACT.md) handles speech synthesis, translation-aware fallbacks, and streaming responses.
- `/api/translate` handles Hindi and Tamil translation for long-form content.
- Keep low-level API details in the contract doc and in code, not duplicated here.

## Notes
- Use `vercel dev` when you need local serverless parity for `/api/*`.
- Treat vendor model names, pricing, and quotas as volatile. Verify them before hardcoding them in docs, prompts, or cost estimates.
