import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';

interface DeviceTechnologyChartProps {
  days?: number;
  refreshInterval?: number;
}

interface DeviceData {
  device_type: string;
  visitors: number;
  percentage: number;
}

interface BrowserData {
  browser: string;
  visitors: number;
  percentage: number;
}

interface OSData {
  os: string;
  visitors: number;
  percentage: number;
}

const DeviceTechnologyChart: React.FC<DeviceTechnologyChartProps> = ({ 
  days = 30, 
  refreshInterval = 300000 // 5 minutes
}) => {
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [browserData, setBrowserData] = useState<BrowserData[]>([]);
  const [osData, setOsData] = useState<OSData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'devices' | 'browsers' | 'os'>('devices');

  const fetchData = async () => {
    try {
      setError(null);
      const [devices, browsers, os] = await Promise.all([
        analyticsApi.getDeviceTypeBreakdown(days),
        analyticsApi.getBrowserBreakdown(days),
        analyticsApi.getOSBreakdown(days),
      ]);
      setDeviceData(devices);
      setBrowserData(browsers);
      setOsData(os);
    } catch (err) {
      setError('Failed to fetch device and technology data');
      console.error('Error fetching device data:', err);
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
          <p>Loading device and technology data...</p>
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

  const getCurrentData = (): Array<{ visitors: number; percentage: number }> => {
    switch (activeTab) {
      case 'devices':
        return deviceData;
      case 'browsers':
        return browserData;
      case 'os':
        return osData;
      default:
        return deviceData;
    }
  };

  const getColumnHeader = () => {
    switch (activeTab) {
      case 'devices':
        return 'Device Type';
      case 'browsers':
        return 'Browser';
      case 'os':
        return 'Operating System';
      default:
        return 'Category';
    }
  };

  const currentData = getCurrentData();
  const totalVisitors = currentData.reduce((sum, item) => sum + item.visitors, 0);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="text-lg font-semibold text-gray-900">Device Type & Technology</h3>
        <div className="chart-stats">
          <span className="stat-item">
            <span className="stat-label">Total Visitors:</span>
            <span className="stat-value">{totalVisitors}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Categories:</span>
            <span className="stat-value">{currentData.length}</span>
          </span>
        </div>
      </div>

      <div className="chart-tabs mb-6">
        <button
          className={`tab-button ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          <span className="mr-2">📱</span>
          Devices
        </button>
        <button
          className={`tab-button ${activeTab === 'browsers' ? 'active' : ''}`}
          onClick={() => setActiveTab('browsers')}
        >
          <span className="mr-2">🌐</span>
          Browsers
        </button>
        <button
          className={`tab-button ${activeTab === 'os' ? 'active' : ''}`}
          onClick={() => setActiveTab('os')}
        >
          <span className="mr-2">💻</span>
          Operating Systems
        </button>
      </div>

      {currentData.length > 0 ? (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {currentData.slice(0, 3).map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-blue-600">
                      {activeTab === 'devices' ? (item as DeviceData).device_type :
                       activeTab === 'browsers' ? (item as BrowserData).browser :
                       (item as OSData).os}
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {item.visitors}
                    </div>
                    <div className="text-xs text-blue-700">
                      {item.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                  <div className="text-3xl opacity-20">
                    {activeTab === 'devices' ? '📱' : activeTab === 'browsers' ? '🌐' : '💻'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700">
                Detailed {getColumnHeader()} Breakdown
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {getColumnHeader()}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distribution
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {activeTab === 'devices' ? (item as DeviceData).device_type.charAt(0).toUpperCase() :
                               activeTab === 'browsers' ? (item as BrowserData).browser.charAt(0).toUpperCase() :
                               (item as OSData).os.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {activeTab === 'devices' ? (item as DeviceData).device_type :
                               activeTab === 'browsers' ? (item as BrowserData).browser :
                               (item as OSData).os}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{item.visitors}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.percentage.toFixed(1)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-12 text-right">
                            {item.percentage.toFixed(0)}%
                          </span>
                        </div>
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
          <div className="text-4xl mb-4 opacity-20">
            {activeTab === 'devices' ? '📱' : activeTab === 'browsers' ? '🌐' : '💻'}
          </div>
          <p className="text-gray-500 text-lg">No {activeTab} data available yet</p>
          <p className="text-gray-400 text-sm mt-2">Data will appear as visitors use your website</p>
        </div>
      )}
    </div>
  );
};

export default DeviceTechnologyChart; 