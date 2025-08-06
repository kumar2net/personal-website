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
        <h3>Device Type & Technology</h3>
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

      <div className="chart-tabs">
        <button
          className={`tab-button ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          📱 Devices
        </button>
        <button
          className={`tab-button ${activeTab === 'browsers' ? 'active' : ''}`}
          onClick={() => setActiveTab('browsers')}
        >
          🌐 Browsers
        </button>
        <button
          className={`tab-button ${activeTab === 'os' ? 'active' : ''}`}
          onClick={() => setActiveTab('os')}
        >
          💻 OS
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{getColumnHeader()}</th>
              <th>Visitors</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index}>
                <td>
                  {activeTab === 'devices' ? (item as DeviceData).device_type :
                   activeTab === 'browsers' ? (item as BrowserData).browser :
                   (item as OSData).os}
                </td>
                <td>{item.visitors}</td>
                <td>{item.percentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceTechnologyChart; 