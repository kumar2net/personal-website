import axios from 'axios';
import { DailyMetrics, Prediction, HealthStatus, AnalyticsData } from '../types/analytics';

const BACKEND_API_URL = 'http://localhost:3001/api';
const ML_API_URL = 'http://localhost:5001';

const backendApi = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000,
});

const mlApi = axios.create({
  baseURL: ML_API_URL,
  timeout: 10000,
});

export const analyticsApi = {
  // Health checks
  getBackendHealth: async (): Promise<HealthStatus> => {
    const response = await backendApi.get('/health');
    return response.data;
  },

  getMLHealth: async (): Promise<HealthStatus> => {
    const response = await mlApi.get('/health');
    return response.data;
  },

  // Analytics data
  getDailyMetrics: async (days: number = 30): Promise<DailyMetrics[]> => {
    const response = await backendApi.get(`/analytics/metrics/daily?days=${days}`);
    return response.data.data.metrics;
  },

  getTopPages: async (limit: number = 10): Promise<Array<{ page_url: string; visits: number; views: number }>> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const response = await backendApi.get(`/analytics/pages/top?limit=${limit}&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
    return response.data.data.pages.map((page: { page_url: string; unique_visitors: string; page_views: string }) => ({
      page_url: page.page_url,
      visits: parseInt(page.unique_visitors),
      views: parseInt(page.page_views)
    }));
  },

  getRealtimeMetrics: async (): Promise<{ current_visitors: number; today_visits: number; today_views: number }> => {
    const response = await backendApi.get('/analytics/metrics/realtime');
    const metrics = response.data.data.metrics;
    return {
      current_visitors: parseInt(metrics.active_visitors),
      today_visits: parseInt(metrics.page_views_24h),
      today_views: parseInt(metrics.page_views_24h)
    };
  },

  // Geolocation analytics
  getVisitorsByGeolocation: async (days: number = 30): Promise<Array<{ country: string; region: string; city: string; visitors: number }>> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const response = await backendApi.get(`/analytics/geolocation?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}&limit=20`);
    return response.data.data.geolocation.map((item: any) => ({
      country: item.country || 'Unknown',
      region: item.region || 'Unknown',
      city: item.city || 'Unknown',
      visitors: parseInt(item.unique_visitors) || 0
    }));
  },

  // Device analytics
  getVisitorsByDevice: async (days: number = 30): Promise<Array<{ device_type: string; browser: string; os: string; visitors: number }>> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const response = await backendApi.get(`/analytics/devices?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}&limit=20`);
    return response.data.data.devices.map((item: any) => ({
      device_type: item.device_type || 'Unknown',
      browser: item.browser || 'Unknown',
      os: item.operating_system || 'Unknown',
      visitors: parseInt(item.visitors)
    }));
  },

  getDeviceTypeBreakdown: async (days: number = 30): Promise<Array<{ device_type: string; visitors: number; percentage: number }>> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const response = await backendApi.get(`/analytics/devices/breakdown?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
    return response.data.data.device_types.map((item: any) => ({
      device_type: item.device_type || 'Unknown',
      visitors: parseInt(item.unique_visitors) || 0,
      percentage: parseFloat(item.percentage) || 0
    }));
  },

  getBrowserBreakdown: async (days: number = 30): Promise<Array<{ browser: string; visitors: number; percentage: number }>> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const response = await backendApi.get(`/analytics/browsers/breakdown?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
    return response.data.data.browsers.map((item: any) => ({
      browser: item.browser || 'Unknown',
      visitors: parseInt(item.unique_visitors) || 0,
      percentage: parseFloat(item.percentage) || 0
    }));
  },

  getOSBreakdown: async (days: number = 30): Promise<Array<{ os: string; visitors: number; percentage: number }>> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const response = await backendApi.get(`/analytics/os/breakdown?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
    return response.data.data.operating_systems.map((item: any) => ({
      os: item.operating_system || 'Unknown',
      visitors: parseInt(item.unique_visitors) || 0,
      percentage: parseFloat(item.percentage) || 0
    }));
  },

  // Predictions
  getPredictions: async (days: number = 7): Promise<Prediction[]> => {
    const response = await mlApi.get(`/predict/page-visits?days=${days}`);
    return response.data;
  },

  // Combined data for dashboard
  getDashboardData: async (): Promise<AnalyticsData> => {
    const [dailyMetrics, topPages, realtimeMetrics, predictions] = await Promise.all([
      analyticsApi.getDailyMetrics(30),
      analyticsApi.getTopPages(10),
      analyticsApi.getRealtimeMetrics(),
      analyticsApi.getPredictions(7),
    ]);

    return {
      realtime: realtimeMetrics,
      daily_metrics: dailyMetrics,
      top_pages: topPages,
      predictions,
    };
  },
}; 