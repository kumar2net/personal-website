import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';

interface GeolocationChartProps {
  days?: number;
  refreshInterval?: number;
}

interface GeolocationData {
  country: string;
  region: string;
  city: string;
  visitors: number;
}

const GeolocationChart: React.FC<GeolocationChartProps> = ({ 
  days = 30, 
  refreshInterval = 300000 // 5 minutes
}) => {
  const [data, setData] = useState<GeolocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const geolocationData = await analyticsApi.getVisitorsByGeolocation(days);
      setData(geolocationData);
    } catch (err) {
      setError('Failed to fetch geolocation data');
      console.error('Error fetching geolocation data:', err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [days, refreshInterval]);

  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading geolocation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-error">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="text-lg font-semibold text-gray-900">Visitors by Geolocation</h3>
        <div className="chart-stats">
          <span className="stat-item">
            <span className="stat-label">Total Locations:</span>
            <span className="stat-value">{data.length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Total Visitors:</span>
            <span className="stat-value">{totalVisitors}</span>
          </span>
        </div>
      </div>
      
      {data.length > 0 ? (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {data.slice(0, 3).map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-600">
                      {item.city !== 'Unknown' ? item.city : item.country}
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {item.visitors}
                    </div>
                    <div className="text-xs text-green-700">
                      {item.country}, {item.region}
                    </div>
                  </div>
                  <div className="text-3xl opacity-20">🌍</div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700">
                Detailed Geolocation Breakdown
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitors
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                              {item.city !== 'Unknown' ? item.city.charAt(0).toUpperCase() : '🌍'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.city !== 'Unknown' ? item.city : 'Unknown Location'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.visitors}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 opacity-20">🌍</div>
          <p className="text-gray-500 text-lg">No geolocation data available yet</p>
          <p className="text-gray-400 text-sm mt-2">Location data will appear as visitors access your website</p>
        </div>
      )}
    </div>
  );
};

export default GeolocationChart; 