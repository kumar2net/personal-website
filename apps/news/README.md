# News Desk workspace

The `apps/news` workspace stores a static feed (`content/feed.json`) and a tiny build script that produces an HTML snapshot in
`dist/`. The personal site imports the same dataset for the `/news` route so every deployment ships a consistent deep link at
`https://kumar2net.com/news` without relying on the deprecated sub-domain.

Run `npm run build` from this workspace to regenerate `dist/index.html` and `dist/feed.json` or to refresh the dataset during
local development.
