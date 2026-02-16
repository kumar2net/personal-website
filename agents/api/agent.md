# Agent: api
- Owner: @you
- Purpose: Handle lightweight backend endpoints for AGI, semantic search, TTS, translation, and engagement.
- Model: Node.js API handlers
- Max tokens: n/a
- Inputs: JSON request bodies, query params, environment configuration.
- Outputs: API JSON responses and side-effect writes through Vercel Blob where applicable.
- Guardrails: `withIdempotentExecution` for side-effectful routes and retry-safe handlers.
- Cost notes: OpenAI calls are metered and logged in `reports/token-usage.json`.
- Test command: `node scripts/idempotency-guard.mjs`
