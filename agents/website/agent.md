# Agent: website
- Owner: @you
- Purpose: Ship and serve the Vite/React site and API handlers in `apps/personal-website`.
- Model: React/Vite runtime (no LLM runtime)
- Max tokens: n/a
- Inputs: UI interactions, API requests, content updates under `apps/personal-website`.
- Outputs: Rendered pages, API JSON responses, generated sitemap/index artifacts.
- Guardrails: CI checks for determinism, idempotency markers, and token budgets before merge.
- Cost notes: No direct API token spend.
- Test command: `npm run --workspace apps/personal-website build`
