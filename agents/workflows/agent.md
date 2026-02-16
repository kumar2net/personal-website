# Agent: workflows
- Owner: @you
- Purpose: Enforce repository operational safety with CI gates and automation checks.
- Model: CI/GitHub Actions workflows
- Max tokens: n/a
- Inputs: New PR content, API scripts, semantic index updates, token usage artifacts.
- Outputs: Blocked/green CI checks and workflow artifacts.
- Guardrails: Deterministic retrieval checks, token budgets, canary guard, agent docs lint.
- Cost notes: No direct cost except CI runtime minutes.
- Test command: `npm run idempotency:check`
