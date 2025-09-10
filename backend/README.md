# Analytics Backend + GA4 Topic Recommender

Adds a GA4-driven blog topic recommendation system using BigQuery and Vertex AI.

## Features

- ✅ Real-time visitor tracking
- ✅ Page view analytics
- ✅ Time on page metrics
- ✅ Top performing pages
- ✅ Daily visitor trends
- ✅ Session tracking
- ✅ CORS enabled for your domain
- ✅ Security headers with Helmet

## Quick Deploy Options

### Option 1: Deploy to Railway (Recommended)

1. **Sign up at [railway.app](https://railway.app)**
2. **Create new project**
3. **Connect your GitHub repository**
4. **Select the `backend` folder**
5. **Deploy automatically**

Railway will:
- Detect it's a Node.js app
- Install dependencies automatically
- Deploy to a live URL
- Provide environment variables

### Option 2: Deploy to Render

1. **Sign up at [render.com](https://render.com)**
2. **Create new Web Service**
3. **Connect your GitHub repository**
4. **Set build command:** `npm install`
5. **Set start command:** `npm start`
6. **Deploy**

## Local Development

```bash
cd backend
npm install
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/analytics/track` - Track page view
- `GET /api/analytics/metrics/realtime` - Real-time metrics
- `GET /api/analytics/metrics/daily` - Daily metrics
- `GET /api/analytics/pages/top` - Top pages
- `POST /api/analytics/reset` - Reset data

### GA4 Topic Recommendations

- `GET /api/recommendations/topics`
  - Query params: 
    - `days` (default 14)
    - `limit` (default 10, max 25)
    - `language` (default `en`)
    - `no_cache=true` to bypass server cache
    - Optional BigQuery overrides: `projectId`, `dataset` (or GA4 numeric property ID), `table` (e.g. `events_20250908` or `events*`), `location` (e.g. `US`)
  - Data scope & normalization:
    - Host filtering: excludes localhost/dev by default. Set `GA4_ALLOWED_HOST_REGEX` to explicitly allow production hosts (example below).
    - Aggregation by path: views are grouped by normalized `page_path` (scheme/host/query stripped) to consolidate counts across hosts and query strings.
  - Fallbacks:
    - If wildcard returns no signals, tries yesterday’s `events_YYYYMMDD`
    - If still empty, discovers latest daily `events_YYYYMMDD`
    - If the model yields no JSON, synthesizes topics from top pages/search terms
  - Response:

```
{
  "success": true,
  "data": {
    "topics": [
      {"title": "...", "rationale": "...", "keywords": ["..."]}
    ],
    "inputs": {"days": 14, "limit": 10, "language": "en"}
  }
}
```

### Environment variables

Copy `.env.example` to `.env` and set:

```
GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/service-account.json
GCP_PROJECT_ID=your-project
GCP_LOCATION=us-central1
GA4_DATASET=analytics_XXXXXXXX
GA4_TABLE=events_*
BIGQUERY_LOCATION=US
RECOMMENDER_MODEL=gemini-2.5-flash-lite
RECOMMENDER_SYSTEM_INSTRUCTION=You are a blog topic recommender.
CACHE_TTL_SECONDS=3600
GOOGLE_CLOUD_QUOTA_PROJECT=your-project
RECOMMENDER_DEV_MODE=false
# Optional: restrict to production hosts (example includes Netlify previews)
GA4_ALLOWED_HOST_REGEX=^https?://([a-z0-9-]+--)?kumarsite\.netlify\.app(/|$)
```

## After Deployment (If Using Your Own Backend)

1. **Get your backend URL** (e.g., `https://your-app.railway.app`)
2. **Update your frontend configuration:**

```javascript
// In src/config/analytics.js
production: {
  apiUrl: 'https://your-app.railway.app/api',
  debug: false,
  autoTrack: true,
  enabled: true,
  generateIds: true
}
```

3. Production options:
   - Backend: point your frontend to `https://your-backend/api/recommendations/topics`
   - Netlify-only: use built-in function at `/api/recommendations/topics` (set env: `GCP_PROJECT_ID`, `GA4_DATASET`, `GA4_TABLE`, `BIGQUERY_LOCATION`, and either `GOOGLE_SERVICE_ACCOUNT_JSON` or Netlify GCP addon)

### Debugging GA4 Signals

- Netlify function: `GET /api/debug/top-signals?days=21`
  - Returns `counts` by `event_name` and top `pages` after filters/normalization.
  - Common errors:
    - Missing/insufficient service account: ensure `GCP_SERVICE_ACCOUNT_JSON` (or `GOOGLE_SERVICE_ACCOUNT_JSON`) is set with roles `roles/bigquery.dataViewer` and `roles/bigquery.jobUser`.
    - Host filter too strict: adjust `GA4_ALLOWED_HOST_REGEX`.

4. Client-side custom tracker has been removed from the live site.

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### Project defaults (from your GA4 link)

Use these values in your `.env` (create `backend/.env` if missing):

```
GCP_PROJECT_ID=my-project-74001686249
GCP_LOCATION=us-central1

# GA4 → BigQuery (US)
# GA4 property ID: 12010944378 (stream: kumarsite)
# GA4-managed dataset GA writes to:
GA4_DATASET=analytics_12010944378

# Read both daily and intraday tables
GA4_TABLE=events*
BIGQUERY_LOCATION=US

# Vertex AI model confirmed for this project/region
RECOMMENDER_MODEL=gemini-2.5-flash-lite

# Cache TTL for API responses (seconds)
CACHE_TTL_SECONDS=3600
```

Notes:
- Always start the backend from the `backend/` directory:
  - `cd backend && PORT=3001 node server.js`
- GA4 tables may take 15–60 minutes to appear after linking. Check for intraday tables:
  - `bq --location=US ls analytics_12010944378 | grep '^\s*events_intraday_' || true`
- The backend is configured to read both daily and intraday via `events*` and will work with either `analytics_12010944378` or numeric `12010944378` for `GA4_DATASET`.

## Security

- CORS configured for your domain
- Helmet.js for security headers
- Input validation
- Rate limiting (can be added)

## Data Storage

Currently uses in-memory storage. For production, consider:
- PostgreSQL (Railway/Render add-ons)
- MongoDB Atlas
- Supabase
- PlanetScale 
Last updated: 2025-08-11
