Generated fresh from commit ad211ad40c64fcfce235e55a4390dc5225a3144c on 2025-11-12T06:46:22+05:30; sources: code/config only.

## Current run status
- Archived prior `/docs` tree to `docs/_archive/20251112T010531Z` per Fresh-Docs mandate.
- Regenerated evidence pack: `docs/_facts/repo_manifest.md`, `docs/_facts/turbo-graph.dot`, `docs/_facts/index.jsonl`, `docs/_logs/turbo-build-dryrun.log`.
- Authored fresh authoritative docs (`ARCHITECTURE.md`, `RUNBOOK-dev.md`, `PACKAGES.md`, `DECISIONS.md`).
- Installed npm deps for the workspace and backend (`docs/_logs/npm-install.log`, `docs/_logs/backend-npm-install.log`), then fixed the lone lint warning in `src/components/SemanticSearch.jsx` and re-ran `npm run lint`.
- Ran `npm run test` plus `npm run test:unit --prefix apps/personal-website`; see `docs/_logs/turbo-test.log` and `docs/_logs/personal-website-test-unit.log`.
- Started Vite on `http://127.0.0.1:5173` (`docs/_logs/dev-server.log`) and created `scripts/devtools_probe.mjs` to automate CDP checks.
- DevTools probe log (`docs/_logs/devtools-probe-1762910425595.json`) shows a clean home render: status 200, no console errors, no >=400 network calls.

## Follow-ups / open items
1. Start `backend/server.js` whenever Topic Suggestions or analytics dashboards need live GA4/Vertex data; it was not required for the home smoke test.
2. Wire a real webhook endpoint before enabling `src/components/WebhookIntegration.jsx` in navigation; the service currently short-circuits.
3. Keep the new `scripts/devtools_probe.mjs` in CI to guard against future regressions (pass `--url` to whatever port you deploy).
