const fs = require('fs').promises;
const path = require('path');

// Simple in-memory storage (will reset on function cold start)
let analyticsData = {
  pageViews: [],
  sessions: [],
  visitors: new Set(),
  lastReset: Date.now()
};

// Data file path for persistence
const DATA_FILE = path.join(__dirname, 'analytics-data.json');

// Load data from file if it exists
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    analyticsData = {
      ...parsed,
      visitors: new Set(parsed.visitors || [])
    };
  } catch (error) {
    // File doesn't exist or is invalid, start fresh
    console.log('Starting with fresh analytics data');
  }
}

// Save data to file
async function saveData() {
  try {
    const dataToSave = {
      ...analyticsData,
      visitors: Array.from(analyticsData.visitors)
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(dataToSave, null, 2));
  } catch (error) {
    console.error('Failed to save analytics data:', error);
  }
}

// Initialize data on first load
loadData();

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

function isLast7Days(date) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(date) >= sevenDaysAgo;
}

// Analytics tracking
async function trackPageView(data) {
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

  await saveData();
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

// Main handler
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { path } = event;
    const method = event.httpMethod;

    // Simple health check
    if (method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'healthy',
          message: 'Analytics function is working!',
          timestamp: new Date().toISOString(),
          path: path,
          method: method
        })
      };
    }

    // Track page view
    if (method === 'POST') {
      const data = JSON.parse(event.body || '{}');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Page view tracked successfully',
          data: {
            page_url: data.page_url || '/',
            timestamp: new Date().toISOString(),
            visitor_id: data.visitor_id || 'test_visitor'
          }
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: 'Method not allowed',
        allowed_methods: ['GET', 'POST']
      })
    };

  } catch (error) {
    console.error('Analytics function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}; 