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
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0];
}

function isToday(date) {
  const dateObj = new Date(date);
  return getDateKey(dateObj) === getDateKey();
}

function isLast7Days(date) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(date) >= sevenDaysAgo;
}

// Helper functions for parsing user agents
function getDeviceType(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') {
    return 'Unknown';
  }
  
  const ua = userAgent.toLowerCase();
  
  // Check for mobile devices
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || 
      ua.includes('blackberry') || ua.includes('windows phone')) {
    return 'Mobile';
  }
  
  // Check for tablets
  if (ua.includes('tablet') || ua.includes('ipad') || ua.includes('kindle')) {
    return 'Tablet';
  }
  
  // Check for desktop/laptop
  if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux') || 
      ua.includes('x11') || ua.includes('unix')) {
    return 'Desktop';
  }
  
  // Check for bots and API clients
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider') ||
      ua.includes('curl') || ua.includes('wget') || ua.includes('python') ||
      ua.includes('node') || ua.includes('axios')) {
    return 'Bot/API';
  }
  
  return 'Unknown';
}

function getBrowser(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') {
    return 'Unknown';
  }
  
  const ua = userAgent.toLowerCase();
  
  // Check for common browsers with more specific patterns
  if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('edg')) return 'Safari';
  if (ua.includes('edg')) return 'Edge';
  if (ua.includes('opera') || ua.includes('opr/')) return 'Opera';
  if (ua.includes('ie') || ua.includes('trident')) return 'Internet Explorer';
  if (ua.includes('brave')) return 'Brave';
  if (ua.includes('vivaldi')) return 'Vivaldi';
  if (ua.includes('ucbrowser')) return 'UC Browser';
  if (ua.includes('samsungbrowser')) return 'Samsung Browser';
  if (ua.includes('miuibrowser')) return 'MIUI Browser';
  if (ua.includes('maxthon')) return 'Maxthon';
  if (ua.includes('yandex')) return 'Yandex Browser';
  if (ua.includes('duckduckgo')) return 'DuckDuckGo Browser';
  if (ua.includes('chromium')) return 'Chromium';
  
  // Check for mobile browsers
  if (ua.includes('mobile safari')) return 'Mobile Safari';
  if (ua.includes('android browser')) return 'Android Browser';
  if (ua.includes('miuibrowser')) return 'MIUI Browser';
  if (ua.includes('samsungbrowser')) return 'Samsung Browser';
  
  // Check for bot/crawler patterns
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider') || 
      ua.includes('scraper') || ua.includes('headless') || ua.includes('puppeteer') ||
      ua.includes('selenium') || ua.includes('phantomjs') || ua.includes('playwright')) {
    return 'Bot/Crawler';
  }
  
  // Check for API clients and tools
  if (ua.includes('curl') || ua.includes('wget') || ua.includes('python') ||
      ua.includes('node') || ua.includes('axios') || ua.includes('fetch')) {
    return 'API Client';
  }
  
  // Check for empty or very short user agents
  if (ua.length < 10) {
    return 'Unknown (Short UA)';
  }
  
  // Log unknown user agents for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Unknown User Agent:', userAgent);
  }
  
  return 'Unknown';
}

function getOS(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') {
    return 'Unknown';
  }
  
  const ua = userAgent.toLowerCase();
  
  // Check for Windows variants
  if (ua.includes('windows nt 10')) return 'Windows 10/11';
  if (ua.includes('windows nt 6.3')) return 'Windows 8.1';
  if (ua.includes('windows nt 6.2')) return 'Windows 8';
  if (ua.includes('windows nt 6.1')) return 'Windows 7';
  if (ua.includes('windows nt 6.0')) return 'Windows Vista';
  if (ua.includes('windows nt 5')) return 'Windows XP';
  if (ua.includes('windows')) return 'Windows';
  
  // Check for macOS variants
  if (ua.includes('mac os x 14')) return 'macOS Sonoma';
  if (ua.includes('mac os x 13')) return 'macOS Ventura';
  if (ua.includes('mac os x 12')) return 'macOS Monterey';
  if (ua.includes('mac os x 11')) return 'macOS Big Sur';
  if (ua.includes('mac os x 10.15')) return 'macOS Catalina';
  if (ua.includes('mac os x 10.14')) return 'macOS Mojave';
  if (ua.includes('mac os x')) return 'macOS';
  if (ua.includes('macintosh')) return 'macOS';
  
  // Check for Linux variants
  if (ua.includes('ubuntu')) return 'Ubuntu';
  if (ua.includes('debian')) return 'Debian';
  if (ua.includes('fedora')) return 'Fedora';
  if (ua.includes('centos')) return 'CentOS';
  if (ua.includes('redhat')) return 'Red Hat';
  if (ua.includes('linux')) return 'Linux';
  
  // Check for mobile OS
  if (ua.includes('android')) return 'Android';
  if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
  if (ua.includes('blackberry')) return 'BlackBerry OS';
  if (ua.includes('windows phone')) return 'Windows Phone';
  
  // Check for other systems
  if (ua.includes('freebsd')) return 'FreeBSD';
  if (ua.includes('openbsd')) return 'OpenBSD';
  if (ua.includes('netbsd')) return 'NetBSD';
  if (ua.includes('unix')) return 'Unix';
  
  return 'Unknown';
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    


    // Health check
    if (path.endsWith('/health') || path.endsWith('/api/health')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          data_points: analyticsData.pageViews.length,
          unique_visitors: analyticsData.visitors.size
        })
      };
    }

    // Track page view
    if (path.endsWith('/analytics/track') && method === 'POST') {
      const data = JSON.parse(event.body || '{}');
      const pageView = await trackPageView(data);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: pageView
        })
      };
    }

    // Get real-time metrics
    if (path.endsWith('/analytics/metrics/realtime') && method === 'GET') {
      const metrics = getRealtimeMetrics();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            metrics
          }
        })
      };
    }

    // Get daily metrics
    if (path.endsWith('/analytics/metrics/daily') && method === 'GET') {
      const { days = 7 } = event.queryStringParameters || {};
      const metrics = getDailyMetrics(parseInt(days));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            metrics
          }
        })
      };
    }

    // Get top pages
    if (path.endsWith('/analytics/pages/top') && method === 'GET') {
      const { limit = 5, start_date, end_date } = event.queryStringParameters || {};
      const pages = getTopPages(parseInt(limit), start_date, end_date);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            pages
          }
        })
      };
    }

    // Reset data (for testing)
    if (path.endsWith('/analytics/reset') && method === 'POST') {
      analyticsData = {
        pageViews: [],
        sessions: [],
        visitors: new Set(),
        lastReset: Date.now()
      };
      await saveData();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Analytics data reset'
        })
      };
    }

    // Get geolocation data
    if (path.endsWith('/analytics/geolocation') && method === 'GET') {
      const { start_date, end_date, limit = 20 } = event.queryStringParameters || {};
      
      // Extract geolocation data from page views
      const geolocationStats = {};
      
      analyticsData.pageViews.forEach(view => {
        const country = view.country || 'Unknown';
        const region = 'Unknown'; // We don't store region in our data
        const city = 'Unknown'; // We don't store city in our data
        
        const key = `${country}-${region}-${city}`;
        if (!geolocationStats[key]) {
          geolocationStats[key] = {
            country,
            region,
            city,
            unique_visitors: new Set()
          };
        }
        geolocationStats[key].unique_visitors.add(view.visitor_id);
      });

      const geolocationData = Object.values(geolocationStats)
        .map(item => ({
          ...item,
          unique_visitors: item.unique_visitors.size
        }))
        .sort((a, b) => b.unique_visitors - a.unique_visitors)
        .slice(0, parseInt(limit));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            geolocation: geolocationData
          }
        })
      };
    }

    // Get device data
    if (path.endsWith('/analytics/devices') && method === 'GET') {
      const { start_date, end_date, limit = 20 } = event.queryStringParameters || {};
      
      // Extract device data from page views
      const deviceStats = {};
      
      analyticsData.pageViews.forEach(view => {
        const userAgent = view.user_agent || '';
        const deviceType = getDeviceType(userAgent);
        const browser = getBrowser(userAgent);
        const os = getOS(userAgent);
        
        const key = `${deviceType}-${browser}-${os}`;
        if (!deviceStats[key]) {
          deviceStats[key] = {
            device_type: deviceType,
            browser,
            operating_system: os,
            visitors: new Set()
          };
        }
        deviceStats[key].visitors.add(view.visitor_id);
      });

      const deviceData = Object.values(deviceStats)
        .map(item => ({
          ...item,
          visitors: item.visitors.size
        }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, parseInt(limit));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            devices: deviceData
          }
        })
      };
    }

    // Get device type breakdown
    if (path.endsWith('/analytics/devices/breakdown') && method === 'GET') {
      const deviceTypeStats = {};
      let totalVisitors = 0;
      
      analyticsData.pageViews.forEach(view => {
        const userAgent = view.user_agent || '';
        const deviceType = getDeviceType(userAgent);
        
        if (!deviceTypeStats[deviceType]) {
          deviceTypeStats[deviceType] = new Set();
        }
        deviceTypeStats[deviceType].add(view.visitor_id);
        totalVisitors++;
      });

      const deviceTypeData = Object.entries(deviceTypeStats)
        .map(([device_type, visitors]) => ({
          device_type,
          unique_visitors: visitors.size,
          percentage: totalVisitors > 0 ? ((visitors.size / totalVisitors) * 100).toFixed(2) : 0
        }))
        .sort((a, b) => b.unique_visitors - a.unique_visitors);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            device_types: deviceTypeData
          }
        })
      };
    }

    // Get browser breakdown
    if (path.endsWith('/analytics/browsers/breakdown') && method === 'GET') {
      const browserStats = {};
      let totalVisitors = 0;
      
      analyticsData.pageViews.forEach(view => {
        const userAgent = view.user_agent || '';
        const browser = getBrowser(userAgent);
        
        if (!browserStats[browser]) {
          browserStats[browser] = new Set();
        }
        browserStats[browser].add(view.visitor_id);
        totalVisitors++;
      });

      const browserData = Object.entries(browserStats)
        .map(([browser, visitors]) => ({
          browser,
          unique_visitors: visitors.size,
          percentage: totalVisitors > 0 ? ((visitors.size / totalVisitors) * 100).toFixed(2) : 0
        }))
        .sort((a, b) => b.unique_visitors - a.unique_visitors);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            browsers: browserData
          }
        })
      };
    }

    // Get OS breakdown
    if (path.endsWith('/analytics/os/breakdown') && method === 'GET') {
      const osStats = {};
      let totalVisitors = 0;
      
      analyticsData.pageViews.forEach(view => {
        const userAgent = view.user_agent || '';
        const os = getOS(userAgent);
        
        if (!osStats[os]) {
          osStats[os] = new Set();
        }
        osStats[os].add(view.visitor_id);
        totalVisitors++;
      });

      const osData = Object.entries(osStats)
        .map(([operating_system, visitors]) => ({
          operating_system,
          unique_visitors: visitors.size,
          percentage: totalVisitors > 0 ? ((visitors.size / totalVisitors) * 100).toFixed(2) : 0
        }))
        .sort((a, b) => b.unique_visitors - a.unique_visitors);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            operating_systems: osData
          }
        })
      };
    }

    // Track page view
    if ((path === '/api/analytics/track' || path.endsWith('/api/analytics/track')) && method === 'POST') {
      const data = JSON.parse(event.body || '{}');
      const pageView = await trackPageView(data);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: pageView
        })
      };
    }

    // Get real-time metrics
    if ((path === '/api/analytics/metrics/realtime' || path.endsWith('/api/analytics/metrics/realtime')) && method === 'GET') {
      const metrics = getRealtimeMetrics();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            metrics
          }
        })
      };
    }

    // Get daily metrics
    if ((path === '/api/analytics/metrics/daily' || path.endsWith('/api/analytics/metrics/daily')) && method === 'GET') {
      const { days = 7 } = event.queryStringParameters || {};
      const metrics = getDailyMetrics(parseInt(days));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            metrics
          }
        })
      };
    }

    // Get top pages
    if ((path === '/api/analytics/pages/top' || path.endsWith('/api/analytics/pages/top')) && method === 'GET') {
      const { limit = 5, start_date, end_date } = event.queryStringParameters || {};
      const pages = getTopPages(parseInt(limit), start_date, end_date);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            pages
          }
        })
      };
    }

    // Reset data (for testing)
    if ((path === '/api/analytics/reset' || path.endsWith('/api/analytics/reset')) && method === 'POST') {
      analyticsData = {
        pageViews: [],
        sessions: [],
        visitors: new Set(),
        lastReset: Date.now()
      };
      await saveData();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Analytics data reset'
        })
      };
    }

    // Not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: 'Endpoint not found',
        available_endpoints: [
          'GET /api/health',
          'POST /api/analytics/track',
          'GET /api/analytics/metrics/realtime',
          'GET /api/analytics/metrics/daily',
          'GET /api/analytics/pages/top',
          'POST /api/analytics/reset'
        ]
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