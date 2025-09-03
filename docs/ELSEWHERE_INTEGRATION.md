# Elsewhere Integration (WordPress + X)

This document explains how the Elsewhere page integrates external profiles:
- WordPress.com blog posts (via RSS)
- X (Twitter) profile link (embed removed to avoid 429 rate limits)

## URLs
- Elsewhere page: `/elsewhere`
- WordPress feed function: `/.netlify/functions/wp-feed`
- X latest (optional API fallback): `/.netlify/functions/x-latest?username=<handle>`

## WordPress Integration
- Serverless function: `netlify/functions/wp-feed.js`
- Uses fast-xml-parser to fetch and normalize `https://kumar2net.wordpress.com/feed/`
- Decodes entities on the client for clean titles/excerpts

### Local test
```bash
curl -s http://localhost:8888/.netlify/functions/wp-feed | jq '.posts[0]'
```

## X (Twitter) Integration
- We show a prominent "Follow on X" link on `/elsewhere` for reliability
- X embed (widgets.js) can trigger 429 rate limits; we removed the panel to keep console clean
- Optional API fallback is available for links-only previews:
  - Function: `netlify/functions/x-latest.js` (X API v2)
  - Requires env var `X_BEARER_TOKEN` in Netlify

### Netlify env
Set in Site settings → Environment variables:
```
X_BEARER_TOKEN=YOUR_BEARER_TOKEN
```

### Local test
```bash
curl -s "http://localhost:8888/.netlify/functions/x-latest?username=kumar2net" | jq .
```

## SEO
- Elsewhere uses the shared `SEO` component for titles/description/canonical
- `SEO` injects Person JSON-LD with `sameAs` links to WordPress and X

## Notes
- If X embed is re-enabled in the future, prefer click-to-load and visibility-based rendering to minimize 429s
- Keep the WordPress link and X link visible at the top for discoverability
