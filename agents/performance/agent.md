# Agent: performance
- Owner: @you
- Purpose: Measure agent determinism and p95 latency for repo-local automation gates.
- Model: Node.js smoke harness
- Max tokens: n/a
- Inputs: npm scripts, optional `--repeat` count, optional `--command` overrides.
- Outputs: JSON-line samples with `cache_hit`, `latency_ms`, success state, and p50/p95 summary.
- Guardrails: Default commands run existing deterministic checks only; no network or deployment side effects.
- Cost notes: No direct API token spend unless a custom command invokes a metered service.
- Test command: `npm run agent:smoke`
