/**
 * Google Analytics 4 Configuration
 *
 * Centralized configuration file containing all GA4 project details,
 * property IDs, service account information, and API settings.
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Google Analytics 4 Configuration Object
 */
export const GA4_CONFIG = {
  // GA4 Property Details
  property: {
    id: '500563672',
    name: 'Personal Website Analytics',
    url: 'https://analytics.google.com/analytics/web/#/p500563672/reports/intelligenthome',
  },

  // Google Cloud Project Details
  project: {
    id: 'my-project-74001686249',
    name: 'Personal Website Project',
  },

  // Service Account Details
  serviceAccount: {
    email: 'kumarsemantic@my-project-74001686249.iam.gserviceaccount.com',
    projectId: 'my-project-74001686249',
    // Credentials loaded from environment variable
    credentials: process.env.GCP_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON)
      : null,
  },

  // API Configuration
  api: {
    version: 'v1',
    name: 'Google Analytics Data API',
    baseUrl: 'https://analyticsdata.googleapis.com/',
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  },

  // Default Date Ranges
  dateRanges: {
    last7Days: {
      startDate: '7daysAgo',
      endDate: 'today',
    },
    last30Days: {
      startDate: '30daysAgo',
      endDate: 'today',
    },
    last90Days: {
      startDate: '90daysAgo',
      endDate: 'today',
    },
  },

  // Common Metrics
  metrics: {
    basic: [
      { name: 'totalUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
    engagement: [
      { name: 'engagementRate' },
      { name: 'eventCount' },
      { name: 'conversions' },
    ],
    demographics: [
      { name: 'userAgeBracket' },
      { name: 'userGender' },
      { name: 'deviceCategory' },
    ],
  },

  // Common Dimensions
  dimensions: {
    page: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    traffic: [
      { name: 'sessionDefaultChannelGroup' },
      { name: 'sessionSource' },
      { name: 'sessionMedium' },
    ],
    user: [
      { name: 'userAgeBracket' },
      { name: 'userGender' },
      { name: 'deviceCategory' },
    ],
    time: [{ name: 'date' }, { name: 'dateHour' }, { name: 'dayOfWeek' }],
  },

  // Output Configuration
  output: {
    directory: './docs',
    files: {
      minimal: 'ga4-minimal-data.json',
      minimalTopics: 'ga4-minimal-topics.md',
      topics: 'ga-blog-topic-suggestions.md',
    },
  },
};

/**
 * Get GA4 property path for API calls
 */
export function getPropertyPath() {
  return `properties/${GA4_CONFIG.property.id}`;
}

/**
 * Get service account credentials
 */
export function getServiceAccountCredentials() {
  if (!GA4_CONFIG.serviceAccount.credentials) {
    throw new Error(
      'GCP_SERVICE_ACCOUNT_JSON environment variable not found or invalid'
    );
  }
  return GA4_CONFIG.serviceAccount.credentials;
}

/**
 * Validate configuration
 */
export function validateConfig() {
  const errors = [];

  if (!GA4_CONFIG.property.id) {
    errors.push('GA4 Property ID is missing');
  }

  if (!GA4_CONFIG.serviceAccount.credentials) {
    errors.push('Service account credentials not found in environment');
  }

  if (!GA4_CONFIG.serviceAccount.email) {
    errors.push('Service account email is missing');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }

  return true;
}

/**
 * Get configuration summary
 */
export function getConfigSummary() {
  return {
    propertyId: GA4_CONFIG.property.id,
    propertyUrl: GA4_CONFIG.property.url,
    projectId: GA4_CONFIG.project.id,
    serviceAccountEmail: GA4_CONFIG.serviceAccount.email,
    apiVersion: GA4_CONFIG.api.version,
    hasCredentials: !!GA4_CONFIG.serviceAccount.credentials,
  };
}

/**
 * Print configuration details (for debugging)
 */
export function printConfig() {
  console.log('🔧 GA4 Configuration:');
  console.log(`📊 Property ID: ${GA4_CONFIG.property.id}`);
  console.log(`🌐 Property URL: ${GA4_CONFIG.property.url}`);
  console.log(`🏗️  Project ID: ${GA4_CONFIG.project.id}`);
  console.log(`📧 Service Account: ${GA4_CONFIG.serviceAccount.email}`);
  console.log(
    `🔑 Credentials Loaded: ${GA4_CONFIG.serviceAccount.credentials ? '✅' : '❌'}`
  );
  console.log(`📡 API Version: ${GA4_CONFIG.api.version}`);
}

// Export individual config sections for convenience
export const {
  property,
  project,
  serviceAccount,
  api,
  dateRanges,
  metrics,
  dimensions,
  output,
} = GA4_CONFIG;

export default GA4_CONFIG;
