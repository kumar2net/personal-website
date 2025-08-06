// Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Development environment
  development: {
    apiUrl: 'http://localhost:3001/api',
    debug: true,
    autoTrack: true,
    enabled: true
  },
  
  // Production environment
  production: {
    apiUrl: 'https://siteanalyticsak.netlify.app/api', // Production analytics backend
    debug: false,
    autoTrack: true,
    enabled: true
  }
};

// Get current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const currentConfig = ANALYTICS_CONFIG[isDevelopment ? 'development' : 'production'];

export default currentConfig; 