# PROJECT.md - personal-website monorepo

## 0) Mission
Build a personal platform, not a static portfolio:
- practical writing on AI, networks, and real systems
- interactive tools and explainers
- reliable publishing with low-friction iteration

## 1) Repo reality
- Monorepo: npm workspaces + Turborepo.
- Main app: `apps/personal-website` (Vite + React + MUI).
- Shared theme: `packages/ui-theme`.
- API routes and scripts are part of daily workflow, not side artifacts.

## 2) Runbook
- Install: `npm install`
- Dev: `npm run dev`
- Build all: `npm run build`
- Build app only: workspace command for `apps/personal-website`
- Preview app: workspace preview command
- Use `vercel dev` when validating local serverless behavior.

## 3) Non-negotiables
- No hand-wavy technical claims.
- Verify current facts and include dates for time-sensitive info.
- Keep UI fast, accessible, and maintainable.
- Respect existing theming architecture and package boundaries.
- Prefer simple data flow over clever indirection.

## 4) Priority stack
### Now
- Keep blog and metadata pipelines stable.
- Keep AI audio and translation paths robust with explicit fallbacks.
- Improve context docs so agents execute predictably.

### Next
- Add interactive network and systems explainers.
- Improve repeatable workflow from notes to published post.

### Later
- Personalized discovery for returning readers.
- Broader local-language support with measurable quality checks.

## 5) Instruction precedence
1. Explicit user request in-session.
2. `AGENTS.md` repository rules.
3. This file (`PROJECT.md`) for operational context.
4. `user.md` for working style.
5. `SOUL.md` for stable tone and principles.
