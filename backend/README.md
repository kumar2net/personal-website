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
  - Query params: `days` (default 14), `limit` (default 10, max 25), `language` (default `en`)
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
RECOMMENDER_MODEL=gemini-1.5-pro
RECOMMENDER_SYSTEM_INSTRUCTION=You are a blog topic recommender.
CACHE_TTL_SECONDS=3600
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

3. Note: Production site now uses GA4. This backend is optional for experiments.

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
