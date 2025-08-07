import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AggregateStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [lastUpdated, setLastUpdated] = useState(null);

  const isDevelopment = import.meta.env.MODE === 'development';
  const API_BASE = isDevelopment 
    ? 'http://localhost:3001/api' 
    : 'https://kumarsite.netlify.app/.netlify/functions/analytics';

  const fetchAggregateStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const days = parseInt(timeRange);

      // Use the new efficient aggregate endpoint
      const response = await fetch(`${API_BASE}/analytics/aggregate?days=${days}&limit=10`, {
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch aggregate data: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to load aggregate statistics');
      }

      setStats(data.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching aggregate stats:', err);
      setError(`Failed to load aggregate statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAggregateStats();
  }, [timeRange]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getGrowthColor = (rate) => {
    const numRate = parseFloat(rate);
    if (numRate > 0) return 'text-green-600';
    if (numRate < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (rate) => {
    const numRate = parseFloat(rate);
    if (numRate > 0) return '↗';
    if (numRate < 0) return '↘';
    return '→';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Aggregate Stats</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No aggregate statistics available</p>
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aggregate Analytics</h2>
          <p className="text-sm text-gray-600">
            Historical trends and performance insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={fetchAggregateStats}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="mb-4 text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-600">Total Visitors</div>
              <div className="text-2xl font-bold text-blue-900">
                {formatNumber(stats.summary.totalVisitors)}
              </div>
            </div>
            <div className="text-blue-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-blue-700">
            Avg: {stats.summary.avgVisitorsPerDay}/day
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-600">Total Page Views</div>
              <div className="text-2xl font-bold text-green-900">
                {formatNumber(stats.summary.totalPageViews)}
              </div>
            </div>
            <div className="text-green-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-green-700">
            Avg: {stats.summary.avgPageViewsPerDay}/day
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-600">Growth Rate</div>
              <div className={`text-2xl font-bold ${getGrowthColor(stats.summary.growthRate)}`}>
                {getGrowthIcon(stats.summary.growthRate)} {stats.summary.growthRate}%
              </div>
            </div>
            <div className="text-purple-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-purple-700">
            vs previous period
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-orange-600">Peak Day</div>
              <div className="text-2xl font-bold text-orange-900">
                {stats.summary.peakDay.unique_visitors || 0}
              </div>
            </div>
            <div className="text-orange-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-orange-700">
            {stats.summary.peakDay.date ? new Date(stats.summary.peakDay.date).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Table</h3>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Unique Visitors</td>
                <td className="px-4 py-3 text-sm text-gray-900">{stats.summary.totalVisitors}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Unique Device Types</td>
                <td className="px-4 py-3 text-sm text-gray-900">{stats.summary.uniqueDeviceTypes ?? '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Unique Locations</td>
                <td className="px-4 py-3 text-sm text-gray-900">{stats.summary.uniqueLocations ?? '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Unique Browsers</td>
                <td className="px-4 py-3 text-sm text-gray-900">{stats.summary.uniqueBrowsers ?? '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Unique Operating Systems</td>
                <td className="px-4 py-3 text-sm text-gray-900">{stats.summary.uniqueOperatingSystems ?? '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Unique Pages</td>
                <td className="px-4 py-3 text-sm text-gray-900">{stats.summary.uniquePages ?? '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Holistic View (single consolidated table with drilldown details inline) */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Holistic View</h3>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breakdown (Top Items with counts)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {/* Device Types */}
              <tr>
                <td className="px-4 py-3 text-gray-700">Device Types</td>
                <td className="px-4 py-3 font-medium text-gray-900">{stats.summary.uniqueDeviceTypes ?? '-'}</td>
                <td className="px-4 py-3 text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {stats.devices.slice(0, 10).map((d) => (
                      <span key={d.device_type} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <span>{d.device_type}</span>
                        <span className="text-xs text-blue-600">{d.unique_visitors}</span>
                      </span>
                    ))}
                    {stats.devices.length > 10 && (
                      <span className="text-xs text-gray-500">(+{stats.devices.length - 10} more)</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Locations */}
              <tr>
                <td className="px-4 py-3 text-gray-700">Locations</td>
                <td className="px-4 py-3 font-medium text-gray-900">{stats.summary.uniqueLocations ?? '-'}</td>
                <td className="px-4 py-3 text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {stats.geolocation.slice(0, 10).map((loc, idx) => (
                      <span key={`${loc.country}-${loc.region}-${loc.city}-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span>{`${loc.city}, ${loc.country}`}</span>
                        <span className="text-xs text-emerald-600">{loc.unique_visitors}</span>
                      </span>
                    ))}
                    {stats.geolocation.length > 10 && (
                      <span className="text-xs text-gray-500">(showing top 10)</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Browsers */}
              <tr>
                <td className="px-4 py-3 text-gray-700">Browsers</td>
                <td className="px-4 py-3 font-medium text-gray-900">{stats.summary.uniqueBrowsers ?? '-'}</td>
                <td className="px-4 py-3 text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {stats.browsers.slice(0, 10).map((b) => (
                      <span key={b.browser} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <span>{b.browser}</span>
                        <span className="text-xs text-green-600">{b.unique_visitors}</span>
                      </span>
                    ))}
                    {stats.browsers.length > 10 && (
                      <span className="text-xs text-gray-500">(+{stats.browsers.length - 10} more)</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Operating Systems */}
              <tr>
                <td className="px-4 py-3 text-gray-700">Operating Systems</td>
                <td className="px-4 py-3 font-medium text-gray-900">{stats.summary.uniqueOperatingSystems ?? '-'}</td>
                <td className="px-4 py-3 text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {stats.operatingSystems.slice(0, 10).map((os) => (
                      <span key={os.operating_system} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        <span>{os.operating_system}</span>
                        <span className="text-xs text-purple-600">{os.unique_visitors}</span>
                      </span>
                    ))}
                    {stats.operatingSystems.length > 10 && (
                      <span className="text-xs text-gray-500">(+{stats.operatingSystems.length - 10} more)</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Pages */}
              <tr>
                <td className="px-4 py-3 text-gray-700">Pages</td>
                <td className="px-4 py-3 font-medium text-gray-900">{stats.summary.uniquePages ?? (stats.topPages?.length ?? '-')}</td>
                <td className="px-4 py-3 text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {stats.topPages.slice(0, 10).map((p, idx) => (
                      <span key={`${p.page_url}-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 max-w-full">
                        <span className="truncate max-w-[180px]" title={p.page_url}>{p.page_url.split('/').pop() || p.page_url}</span>
                        <span className="text-xs text-orange-600">{p.unique_visitors}</span>
                      </span>
                    ))}
                    {stats.topPages.length > 10 && (
                      <span className="text-xs text-gray-500">(showing top 10)</span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Visitor Trend</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {stats.daily.slice(-10).map((day, index) => {
              const maxVisitors = Math.max(...stats.daily.map(d => d.unique_visitors || 0));
              const percentage = maxVisitors > 0 ? ((day.unique_visitors || 0) / maxVisitors) * 100 : 0;
              
              return (
                <div key={day.date} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mx-4">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-sm text-gray-900 text-right">
                    {day.unique_visitors || 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
        <div className="space-y-2">
          {stats.topPages.slice(0, 5).map((page, index) => (
            <div key={page.page_url} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {page.page_url.split('/').pop() || page.page_url}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {page.unique_visitors} visitors
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Devices */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
          <div className="space-y-2">
            {stats.devices.slice(0, 5).map((device) => (
              <div key={device.device_type} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{device.device_type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browsers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
          <div className="space-y-2">
            {stats.browsers.slice(0, 5).map((browser) => (
              <div key={browser.browser} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{browser.browser}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${browser.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{browser.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Systems */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Systems</h3>
          <div className="space-y-2">
            {stats.operatingSystems.slice(0, 5).map((os) => (
              <div key={os.operating_system} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{os.operating_system}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${os.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{os.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Locations */}
      {stats.geolocation.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Visitor Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.geolocation.slice(0, 6).map((location, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {location.city}, {location.country}
                    </div>
                    <div className="text-xs text-gray-600">
                      {location.region}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700">
                    {location.unique_visitors}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AggregateStats;
