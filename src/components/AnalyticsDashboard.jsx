import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GeolocationChart from './GeolocationChart';
import DeviceTechnologyChart from './DeviceTechnologyChart';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if analytics is enabled for current environment
  // In Vite, we need to use import.meta.env instead of process.env
  const isAnalyticsEnabled = import.meta.env.MODE === 'development' || import.meta.env.MODE === 'production';
  const API_BASE = import.meta.env.MODE === 'development' 
    ? 'http://localhost:3001/api' 
    : 'https://siteanalyticsak.netlify.app/api';
    
  console.log('Analytics Dashboard: Environment:', import.meta.env.MODE);
  console.log('Analytics Dashboard: isAnalyticsEnabled:', isAnalyticsEnabled);
  console.log('Analytics Dashboard: API_BASE:', API_BASE);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Always try to fetch analytics data
      if (!isAnalyticsEnabled || !API_BASE) {
        setLoading(false);
        setError('Analytics configuration not available');
        return;
      }

      try {
        setLoading(true);
        console.log('Analytics Dashboard: Fetching data from:', API_BASE);
        
        // Fetch real-time metrics
        console.log('Analytics Dashboard: Fetching real-time metrics...');
        const realtimeResponse = await fetch(`${API_BASE}/analytics/metrics/realtime`, {
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin
          }
        });
        console.log('Analytics Dashboard: Real-time response status:', realtimeResponse.status);
        const realtimeData = await realtimeResponse.json();
        console.log('Analytics Dashboard: Real-time data:', realtimeData);
        
        // Fetch daily metrics for the last 7 days
        console.log('Analytics Dashboard: Fetching daily metrics...');
        const dailyResponse = await fetch(`${API_BASE}/analytics/metrics/daily?days=7`, {
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin
          }
        });
        console.log('Analytics Dashboard: Daily response status:', dailyResponse.status);
        const dailyData = await dailyResponse.json();
        console.log('Analytics Dashboard: Daily data:', dailyData);
        
        // Fetch top pages
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        
        console.log('Analytics Dashboard: Fetching top pages...');
        const topPagesResponse = await fetch(
          `${API_BASE}/analytics/pages/top?limit=5&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Origin': window.location.origin
            }
          }
        );
        console.log('Analytics Dashboard: Top pages response status:', topPagesResponse.status);
        const topPagesData = await topPagesResponse.json();
        console.log('Analytics Dashboard: Top pages data:', topPagesData);

        console.log('Analytics Dashboard: Setting analytics data...');
        setAnalytics({
          realtime: realtimeData.data.metrics,
          daily: dailyData.data.metrics,
          topPages: topPagesData.data.pages
        });
        console.log('Analytics Dashboard: Analytics data set successfully');
      } catch (err) {
        console.error('Analytics Dashboard: Error fetching data:', err);
        setError('Failed to load analytics data');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAnalyticsEnabled, API_BASE]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Sample data for demonstration when backend is not available
    const sampleAnalytics = {
      realtime: {
        active_visitors: 12,
        page_views_24h: 156,
        avg_time_on_page: 245
      },
      daily: [
        { date: '2024-01-15', unique_visitors: 45 },
        { date: '2024-01-16', unique_visitors: 52 },
        { date: '2024-01-17', unique_visitors: 38 },
        { date: '2024-01-18', unique_visitors: 67 },
        { date: '2024-01-19', unique_visitors: 41 },
        { date: '2024-01-20', unique_visitors: 58 },
        { date: '2024-01-21', unique_visitors: 73 }
      ],
      topPages: [
        { page_url: '/', unique_visitors: 89 },
        { page_url: '/blog', unique_visitors: 67 },
        { page_url: '/about', unique_visitors: 34 },
        { page_url: '/projects', unique_visitors: 28 },
        { page_url: '/contact', unique_visitors: 15 }
      ]
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {import.meta.env.MODE === 'development' ? 'Analytics Backend Not Available' : 'Analytics Temporarily Unavailable'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Showing sample data. {import.meta.env.MODE === 'development' ? 
                  'To see real analytics, start the analytics backend server:' : 
                  'The analytics backend is temporarily unavailable.'}</p>
                {import.meta.env.MODE === 'development' && (
                  <code className="block mt-2 p-2 bg-yellow-100 rounded text-xs">
                    cd /Users/kumar/siteanalytics/backend && npm run dev
                  </code>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Analytics (Demo Mode)</h2>
        
        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-600">Active Visitors</div>
            <div className="text-2xl font-bold text-blue-900">
              {sampleAnalytics.realtime.active_visitors}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm font-medium text-green-600">24h Page Views</div>
            <div className="text-2xl font-bold text-green-900">
              {sampleAnalytics.realtime.page_views_24h}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-600">Avg Time on Page</div>
            <div className="text-2xl font-bold text-purple-900">
              {Math.floor(sampleAnalytics.realtime.avg_time_on_page / 60)}m {sampleAnalytics.realtime.avg_time_on_page % 60}s
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages (Last 7 Days)</h3>
          <div className="space-y-3">
            {sampleAnalytics.topPages.map((page, index) => (
              <div key={page.page_url} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                  <span className="text-sm font-medium text-gray-900">{page.page_url}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {page.unique_visitors} visitors
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Metrics Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Visitors (Last 7 Days)</h3>
          <div className="space-y-2">
            {sampleAnalytics.daily.slice(0, 7).reverse().map((day, index) => (
              <div key={day.date} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(100, (day.unique_visitors / Math.max(...sampleAnalytics.daily.map(d => d.unique_visitors))) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-gray-900 text-right">
                  {day.unique_visitors}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!analytics) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Analytics</h2>
      
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-600">Active Visitors</div>
          <div className="text-2xl font-bold text-blue-900">
            {parseInt(analytics.realtime.active_visitors)}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm font-medium text-green-600">24h Page Views</div>
          <div className="text-2xl font-bold text-green-900">
            {parseInt(analytics.realtime.page_views_24h)}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm font-medium text-purple-600">Avg Time (24h)</div>
          <div className="text-2xl font-bold text-purple-900">
            {Math.round(parseFloat(analytics.realtime.avg_time_on_page_24h))}s
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages (Last 7 Days)</h3>
        <div className="space-y-3">
          {analytics.topPages.map((page, index) => (
            <div key={page.page_url} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                <span className="text-sm font-medium text-gray-900">{page.page_url}</span>
              </div>
              <div className="text-sm text-gray-600">
                {parseInt(page.unique_visitors)} visitors
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Metrics Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Visitors (Last 7 Days)</h3>
        <div className="space-y-2">
          {analytics.daily.slice(0, 7).reverse().map((day, index) => (
            <div key={day.date} className="flex items-center">
              <div className="w-20 text-sm text-gray-600">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ 
                    width: `${Math.min(100, (day.unique_visitors / Math.max(...analytics.daily.map(d => d.unique_visitors))) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="w-12 text-sm text-gray-900 text-right">
                {day.unique_visitors}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visitors by Geolocation */}
      <div className="mb-8">
        <GeolocationChart days={30} />
      </div>

      {/* Device Type & Technology */}
      <div className="mb-8">
        <DeviceTechnologyChart days={30} />
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard; 