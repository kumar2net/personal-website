export interface PageVisit {
  id: number;
  page_url: string;
  visitor_id: string;
  session_id: string;
  timestamp: string;
  time_on_page: number;
  referrer: string;
  user_agent: string;
}

export interface DailyMetrics {
  id: number;
  date: string;
  page_visits: number;
  page_views: number;
  avg_time_on_page: number;
  bounce_rate: number;
  unique_visitors: number;
}

export interface Prediction {
  date: string;
  predicted_value: number;
  confidence_interval: number;
  model_version: string;
}

export interface HealthStatus {
  status: string;
  service: string;
  model_loaded?: boolean;
}

export interface AnalyticsData {
  realtime: {
    current_visitors: number;
    today_visits: number;
    today_views: number;
  };
  daily_metrics: DailyMetrics[];
  top_pages: Array<{
    page_url: string;
    visits: number;
    views: number;
  }>;
  predictions: Prediction[];
} 