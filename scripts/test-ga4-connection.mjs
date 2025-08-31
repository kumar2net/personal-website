#!/usr/bin/env node

/**
 * Test GA4 Connection
 *
 * Simple script to test the GA4 Data API connection and debug issues.
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import {
  GA4_CONFIG,
  getPropertyPath,
  getServiceAccountCredentials,
  printConfig,
  validateConfig,
} from './ga4-config.mjs';

async function testGA4Connection() {
  try {
    console.log('🔐 Testing GA4 Data API connection...');

    // Validate configuration
    validateConfig();
    printConfig();

    // Get service account credentials
    const credentials = getServiceAccountCredentials();

    console.log('✅ Credentials parsed successfully');
    console.log('📧 Service account email:', credentials.client_email);
    console.log('🏗️  Project ID:', credentials.project_id);

    // Initialize the Analytics Data client with credentials
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: credentials,
      projectId: credentials.project_id,
    });

    console.log('✅ Analytics client initialized');

    // Test with a simple request
    console.log('🔍 Testing property access...');
    console.log('📊 Property ID:', GA4_CONFIG.property.id);
    console.log('🔗 Property path:', getPropertyPath());

    const testResponse = await analyticsDataClient.runReport({
      property: getPropertyPath(),
      dateRanges: [GA4_CONFIG.dateRanges.last7Days],
      metrics: [
        {
          name: 'totalUsers',
        },
      ],
    });

    console.log('✅ Success! GA4 Data API is working');
    console.log(
      '📈 Total users (last 7 days):',
      testResponse[0].rows?.[0]?.metricValues?.[0]?.value || 'No data'
    );
  } catch (error) {
    console.error('❌ Error testing GA4 connection:', error.message);

    if (error.message.includes('PERMISSION_DENIED')) {
      console.log(
        '\n🔧 Solution: Grant your service account access to GA4 property'
      );
      console.log('1. Go to Google Analytics');
      console.log('2. Admin → Property → Property access management');
      console.log(
        '3. Add: kumarsemantic@my-project-74001686249.iam.gserviceaccount.com'
      );
      console.log('4. Grant Viewer permissions');
    } else if (error.message.includes('INVALID_ARGUMENT')) {
      console.log('\n🔧 Solution: Check property ID format or API enablement');
      console.log('1. Verify property ID is correct');
      console.log('2. Ensure Google Analytics Data API is enabled');
    } else if (error.message.includes('NOT_FOUND')) {
      console.log('\n🔧 Solution: Property not found');
      console.log('1. Check if property ID is correct');
      console.log('2. Ensure property exists and is accessible');
    }
  }
}

// Run the test
testGA4Connection();
