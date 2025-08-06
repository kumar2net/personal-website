// Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Development environment
  development: {
    apiUrl: 'http://localhost:3001/api',
    debug: true,
    autoTrack: true,
    enabled: true,
    generateIds: true
  },
  
  // Production environment
  production: {
    apiUrl: null, // Netlify Functions not working - need alternative backend
    debug: false,
    autoTrack: false, // Disable auto-tracking until backend is available
    enabled: false, // Disable analytics until backend is available
    generateIds: true
  }
};

// Get current environment
const isDevelopment = import.meta.env.MODE === 'development';
const currentConfig = ANALYTICS_CONFIG[isDevelopment ? 'development' : 'production'];

// Helper functions for generating IDs
export const generateVisitorId = () => {
  let visitorId = localStorage.getItem('analytics_visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('analytics_visitor_id', visitorId);
  }
  return visitorId;
};

export const generateSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  const lastActivity = sessionStorage.getItem('analytics_last_activity');
  const now = Date.now();
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes

  // Create new session if none exists or session expired
  if (!sessionId || !lastActivity || (now - parseInt(lastActivity)) > sessionTimeout) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }

  sessionStorage.setItem('analytics_last_activity', now.toString());
  return sessionId;
};

export default currentConfig; 