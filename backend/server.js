const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { getRecommendedTopics } = require('./services/recommendationService');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 3001;
const apiCache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL_SECONDS || '3600') });

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['https://kumarsite.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// In-memory storage (in production, use a database)
let analyticsData = {
  pageViews: [],
  sessions: [],
  visitors: new Set(),
  lastReset: Date.now()
};

// Helper functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function isToday(date) {
  return getDateKey(date) === getDateKey();
}

// Analytics tracking
function trackPageView(data) {
  const pageView = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    page_url: data.page_url || '/',
    referrer: data.referrer || '',
    user_agent: data.user_agent || '',
    visitor_id: data.visitor_id || generateId(),
    session_id: data.session_id || generateId(),
    time_on_page: data.time_on_page || 0,
    screen_width: data.screen_width || 0,
    screen_height: data.screen_height || 0,
    language: data.language || 'en',
    country: data.country || 'unknown'
  };

  analyticsData.pageViews.push(pageView);
  analyticsData.visitors.add(pageView.visitor_id);

  // Keep only last 1000 page views to prevent memory issues
  if (analyticsData.pageViews.length > 1000) {
    analyticsData.pageViews = analyticsData.pageViews.slice(-1000);
  }

  return pageView;
}

// Get real-time metrics
function getRealtimeMetrics() {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  const recentViews = analyticsData.pageViews.filter(view => 
    new Date(view.timestamp) > fiveMinutesAgo
  );

  const activeVisitors = new Set(recentViews.map(view => view.visitor_id)).size;
  
  const todayViews = analyticsData.pageViews.filter(view => 
    isToday(view.timestamp)
  );

  const avgTimeOnPage = todayViews.length > 0 
    ? todayViews.reduce((sum, view) => sum + (view.time_on_page || 0), 0) / todayViews.length
    : 0;

  return {
    active_visitors: activeVisitors,
    page_views_24h: todayViews.length,
    avg_time_on_page_24h: avgTimeOnPage,
    total_visitors: analyticsData.visitors.size
  };
}

// Get daily metrics
function getDailyMetrics(days = 7) {
  const metrics = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = getDateKey(date);

    const dayViews = analyticsData.pageViews.filter(view => 
      getDateKey(view.timestamp) === dateKey
    );

    const uniqueVisitors = new Set(dayViews.map(view => view.visitor_id)).size;

    metrics.unshift({
      date: dateKey,
      page_views: dayViews.length,
      unique_visitors: uniqueVisitors,
      avg_time_on_page: dayViews.length > 0 
        ? dayViews.reduce((sum, view) => sum + (view.time_on_page || 0), 0) / dayViews.length
        : 0
    });
  }

  return metrics;
}

// Get top pages
function getTopPages(limit = 5, startDate = null, endDate = null) {
  let filteredViews = analyticsData.pageViews;

  if (startDate && endDate) {
    filteredViews = analyticsData.pageViews.filter(view => {
      const viewDate = new Date(view.timestamp);
      return viewDate >= new Date(startDate) && viewDate <= new Date(endDate);
    });
  }

  const pageStats = {};
  
  filteredViews.forEach(view => {
    if (!pageStats[view.page_url]) {
      pageStats[view.page_url] = {
        page_url: view.page_url,
        page_views: 0,
        unique_visitors: new Set()
      };
    }
    pageStats[view.page_url].page_views++;
    pageStats[view.page_url].unique_visitors.add(view.visitor_id);
  });

  return Object.values(pageStats)
    .map(page => ({
      ...page,
      unique_visitors: page.unique_visitors.size
    }))
    .sort((a, b) => b.unique_visitors - a.unique_visitors)
    .slice(0, limit);
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    data_points: analyticsData.pageViews.length,
    unique_visitors: analyticsData.visitors.size,
    backend: 'Express.js',
    gcp: {
      project: process.env.GCP_PROJECT_ID || null,
      location: process.env.GCP_LOCATION || 'us-central1'
    }
  });
});

app.post('/api/analytics/track', (req, res) => {
  try {
    const pageView = trackPageView(req.body);
    res.json({
      success: true,
      data: pageView
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/analytics/metrics/realtime', (req, res) => {
  try {
    const metrics = getRealtimeMetrics();
    res.json({
      success: true,
      data: {
        metrics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/analytics/metrics/daily', (req, res) => {
  try {
    const { days = 7 } = req.query;
    const metrics = getDailyMetrics(parseInt(days));
    res.json({
      success: true,
      data: {
        metrics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/analytics/pages/top', (req, res) => {
  try {
    const { limit = 5, start_date, end_date } = req.query;
    const pages = getTopPages(parseInt(limit), start_date, end_date);
    res.json({
      success: true,
      data: {
        pages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/analytics/reset', (req, res) => {
  try {
    analyticsData = {
      pageViews: [],
      sessions: [],
      visitors: new Set(),
      lastReset: Date.now()
    };
    res.json({
      success: true,
      message: 'Analytics data reset'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// New: Topic recommendations endpoint
app.get('/api/recommendations/topics', async (req, res) => {
  try {
    const days = parseInt(req.query.days || '14');
    const limit = Math.min(parseInt(req.query.limit || '10'), 25);
    const language = (req.query.language || 'en').toString();
    const cacheKey = `api:topics:${days}:${limit}:${language}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }
    const data = await getRecommendedTopics({ days, limit, language });
    apiCache.set(cacheKey, data);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Analytics backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 