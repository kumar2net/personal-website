# Kumar2Net News Desk

Static site that powers [news.kumar2net.com](https://news.kumar2net.com).

## Local development

```bash
npm install
npm run dev
```

The `dev` command performs a quick build and serves the `dist` folder on port `5174`.

## Deployment

Vercel runs `npm run build`, which copies the curated static assets in `public/` to `dist/`.
