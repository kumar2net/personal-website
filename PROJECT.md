# PROJECT.md

## Mission
Build `kumar2net.com` as a practical publishing and product lab: clear writing, useful tools, explainers, and AI-assisted workflows that stay usable after the demo.

## Repo Reality
- Monorepo: npm workspaces + Turborepo.
- Main app: `apps/personal-website` using Vite 7, React 19, and MUI 7.
- Shared theme: `packages/ui-theme`.
- Operational scripts, serverless handlers, and content pipelines are part of the product surface, not side projects.

## Current Priorities
- Keep publishing stable: blog metadata, sitemap, semantic index, TTS, and translation.
- Keep docs compact, accurate, and tied to code instead of folklore.
- Improve interactive explainers and short-form tooling without increasing maintenance drag.

## Working Rules
- Verify time-sensitive vendor facts before writing them down.
- Prefer one canonical doc over multiple partial copies.
- Rewrite or delete stale guidance instead of appending another layer.
- Keep changes reversible and easy for the next engineer to understand.

## Instruction Precedence
1. User request in-session.
2. `AGENTS.md`.
3. `PROJECT.md`.
4. `user.md`.
5. `SOUL.md`.
