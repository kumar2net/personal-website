import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GeolocationChart from './GeolocationChart';
import DeviceTechnologyChart from './DeviceTechnologyChart';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Check if analytics is enabled for current environment
  const isDevelopment = import.meta.env.MODE === 'development';
  const API_BASE = isDevelopment 
    ? 'http://localhost:3001/api' 
    : null; // No production backend available yet
    
  console.log('Analytics Dashboard: Environment:', import.meta.env.MODE);
  console.log('Analytics Dashboard: isDevelopment:', isDevelopment);
  console.log('Analytics Dashboard: API_BASE:', API_BASE);

  const fetchAnalytics = async () => {
    if (!isDevelopment) {
      setLoading(false);
      setError('Analytics Backend Not Available in Production');
      return;
    }

    if (!API_BASE) {
      setLoading(false);
      setError('Analytics configuration not available');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear any previous errors
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
      
      if (!realtimeResponse.ok) {
        throw new Error(`Real-time metrics failed: ${realtimeResponse.status}`);
      }
      
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
      
      if (!dailyResponse.ok) {
        throw new Error(`Daily metrics failed: ${dailyResponse.status}`);
      }
      
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
      
      if (!topPagesResponse.ok) {
        throw new Error(`Top pages failed: ${topPagesResponse.status}`);
      }
      
      const topPagesData = await topPagesResponse.json();
      console.log('Analytics Dashboard: Top pages data:', topPagesData);

      console.log('Analytics Dashboard: Setting analytics data...');
      setAnalytics({
        realtime: realtimeData.data.metrics,
        daily: dailyData.data.metrics || [],
        topPages: topPagesData.data.pages || []
      });
      setLastUpdated(new Date());
      console.log('Analytics Dashboard: Analytics data set successfully');
    } catch (err) {
      console.error('Analytics Dashboard: Error fetching data:', err);
      setError(`Failed to load analytics data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalyticsData = () => {
    if (!analytics) return;
    
    const exportData = {
      exportDate: new Date().toISOString(),
      period: 'Last 7 Days',
      analytics: {
        realtime: analytics.realtime,
        daily: analytics.daily,
        topPages: analytics.topPages
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [isDevelopment, API_BASE]);

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
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Analytics Backend Not Available
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                {import.meta.env.MODE === 'development' ? (
                  <div className="mt-2">
                    <p>To see real analytics, start the analytics backend server:</p>
                    <code className="block mt-1 p-2 bg-red-100 rounded text-xs">
                      cd /Users/kumar/siteanalytics/backend && npm run dev
                    </code>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p>Production analytics backend is not yet configured. To enable analytics in production:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Deploy the analytics backend to a production server</li>
                      <li>Update the production API URL in <code className="bg-red-100 px-1 rounded">src/config/analytics.js</code></li>
                      <li>Enable analytics tracking in production configuration</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Analytics</h2>
      
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportAnalyticsData}
            disabled={!analytics}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Export Data
          </button>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
      
      {/* Success indicator */}
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Analytics System Status
            </h3>
            <div className="mt-1 text-sm text-green-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <span className="font-medium">Backend:</span> 
                  <span className="ml-1 text-green-600">✅ Connected</span>
                </div>
                <div>
                  <span className="font-medium">Database:</span> 
                  <span className="ml-1 text-green-600">✅ Active</span>
                </div>
                <div>
                  <span className="font-medium">Tracking:</span> 
                  <span className="ml-1 text-green-600">✅ Live</span>
                </div>
              </div>
              <p className="mt-2">Showing real-time analytics data from your website visitors.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug info */}
      {import.meta.env.MODE === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>Realtime: {JSON.stringify(analytics.realtime)}</p>
          <p>Daily count: {analytics.daily?.length || 0}</p>
          <p>Top pages count: {analytics.topPages?.length || 0}</p>
          <div className="mt-2">
            <p><strong>Configuration:</strong></p>
            <p>API Base: {API_BASE}</p>
            <p>Environment: {import.meta.env.MODE}</p>
            <p>Analytics Enabled: {isDevelopment ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
      
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

      {/* Summary Insights */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-600">Most Popular Page</div>
            <div className="text-lg font-bold text-blue-900">
              {analytics.topPages && analytics.topPages.length > 0 
                ? analytics.topPages[0].page_url.split('/').pop() || analytics.topPages[0].page_url
                : 'N/A'}
            </div>
            <div className="text-xs text-blue-700">
              {analytics.topPages && analytics.topPages.length > 0 
                ? `${parseInt(analytics.topPages[0].unique_visitors)} visitors`
                : ''}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm font-medium text-green-600">Total Pages Tracked</div>
            <div className="text-lg font-bold text-green-900">
              {analytics.topPages ? analytics.topPages.length : 0}
            </div>
            <div className="text-xs text-green-700">Unique pages visited</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-600">Data Period</div>
            <div className="text-lg font-bold text-purple-900">Last 7 Days</div>
            <div className="text-xs text-purple-700">Analytics timeframe</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-sm font-medium text-orange-600">Data Freshness</div>
            <div className="text-lg font-bold text-orange-900">
              {lastUpdated ? 'Live' : 'N/A'}
            </div>
            <div className="text-xs text-orange-700">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages (Last 7 Days)</h3>
        {analytics.topPages && analytics.topPages.length > 0 ? (
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
        ) : (
          <p className="text-gray-500">No page data available yet</p>
        )}
      </div>

      {/* Daily Metrics Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Visitors (Last 7 Days)</h3>
        {analytics.daily && analytics.daily.length > 0 ? (
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
        ) : (
          <p className="text-gray-500">No daily data available yet</p>
        )}
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