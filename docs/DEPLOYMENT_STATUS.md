# Deployment Status & Runbook

Last updated: **October 29, 2025**

## Environment Snapshot

| Item | Details |
|------|---------|
| **Production URL** | https://kumar2net.com |
| **Status** | ✅ Online – new content waiting to be deployed |
| **Branch** | `master` (auto-deploys via Netlify) |
| **Latest change** | Added “Digital Swadeshi Age” blog post and refreshed documentation |

The repo currently contains unpublished content changes. After completing the checks below, run a production deploy to publish them.

## Pre-Deploy Checklist

### Automated

```bash
npm run lint
npm run biome:check
npm run test:all
npm run build
```

- Confirm `dist/` builds without warnings.
- Spot-check bundle size in the Vite output (record in changelog if there is a notable delta).

### Manual

- [ ] Visit the local site via `npm run dev` and confirm:
  - `/blog/digital-swadeshi-age` loads, images render, and tables respond on mobile.
  - `/blog` index lists the new post at the top with the encoded media hero.
  - Navigation, Projects, and Utilities dashboards load with no console errors.
- [ ] Run Lighthouse (desktop + mobile) against the local production build (`npm run build && npm run preview`) and capture scores.
- [ ] Verify Netlify status badge on `/status` still reports green.
- [ ] Check browser console (Chrome + mobile simulator) for warnings/errors.
- [ ] If backend services are required for recommendations, ensure credentials and endpoints are still valid.

## Deployment

Netlify automatically builds on pushes to `master`. For a manual release:

```bash
npm run build
netlify deploy --prod --dir=dist
```

Keep the deploy log URL in case rollbacks are required.

### Rollback

Use Netlify’s UI to promote a previous deploy, or redeploy a known-good build:

```bash
# Reuse a previous dist/ snapshot if you have it locally
netlify deploy --prod --dir=dist --message "Rollback to <commit>"
```

## Post-Deploy Verification

- Visit key routes (`/`, `/blog`, new post, `/projects`, `/utilities`, `/status`).
- Confirm Netlify Functions respond (e.g., `/api/tech-trends`, `/api/semantic-search` via browser or curl).
- Monitor Netlify deploy logs for runtime warnings.
- If GA4/BigQuery pipelines are enabled, check that events resume within the expected latency window.

## Monitoring & Alerts

- **Netlify dashboard** – build success, bandwidth, and function usage.
- **Google Analytics 4** – traffic sanity check after each release.
- **Console audits** – continue to test with Chrome DevTools to catch bundle regressions.
- Optional: run `reports/` Lighthouse scripts if you maintain historical metrics.

## Recent Release Notes

- **Oct 29, 2025** – Digital Swadeshi Age post, blog index refresh, documentation overhaul.
- **Sep–Oct 2025** – Tech trends dashboard uplift, AI recommender refinements, Projects page SVG updates.

These entries are mirrored in `docs/CHANGELOG.md`.

