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
        <h3>Visitors by Geolocation</h3>
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
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Region</th>
              <th>Country</th>
              <th>Visitors</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.city}</td>
                <td>{item.region}</td>
                <td>{item.country}</td>
                <td>{item.visitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeolocationChart; 