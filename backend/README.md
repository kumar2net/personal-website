# (Archived) Analytics Backend

This backend was used for a custom analytics system and is now archived. The live site uses Google Analytics 4 (GA4).

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
