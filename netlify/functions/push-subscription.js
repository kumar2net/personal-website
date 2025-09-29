/**
 * Push Subscription Management
 * Handles storing and retrieving push notification subscriptions
 */

import { getStore } from '@netlify/blobs';

export const handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const store = getStore('push-subscriptions');

    if (event.httpMethod === 'POST') {
      // Store new subscription
      const { subscription, userAgent, timestamp } = JSON.parse(event.body);
      
      if (!subscription || !subscription.endpoint) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid subscription data' })
        };
      }

      // Create unique subscription ID
      const subscriptionId = `push-sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store subscription with metadata
      const subscriptionData = {
        id: subscriptionId,
        subscription,
        userAgent: userAgent || event.headers['user-agent'],
        timestamp: timestamp || new Date().toISOString(),
        ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
        siteId: context.site.id
      };

      await store.set(subscriptionId, JSON.stringify(subscriptionData));

      console.log('Push subscription stored:', subscriptionId);

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          subscriptionId,
          message: 'Subscription stored successfully'
        })
      };
    }

    if (event.httpMethod === 'DELETE') {
      // Remove subscription
      const { subscription } = JSON.parse(event.body);
      
      if (!subscription || !subscription.endpoint) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid subscription data' })
        };
      }

      // Find and delete subscription by endpoint
      const subscriptions = await store.list();
      let deleted = false;

      for (const sub of subscriptions) {
        try {
          const subData = await store.get(sub.key);
          const parsedData = JSON.parse(subData);
          
          if (parsedData.subscription && 
              parsedData.subscription.endpoint === subscription.endpoint) {
            await store.delete(sub.key);
            deleted = true;
            console.log('Push subscription deleted:', sub.key);
            break;
          }
        } catch (error) {
          console.error('Error processing subscription:', sub.key, error);
        }
      }

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          deleted,
          message: deleted ? 'Subscription removed successfully' : 'Subscription not found'
        })
      };
    }

    if (event.httpMethod === 'GET') {
      // Get all subscriptions (for admin/stats)
      const subscriptions = await store.list();
      const subscriptionList = [];

      for (const sub of subscriptions) {
        try {
          const subData = await store.get(sub.key);
          const parsedData = JSON.parse(subData);
          
          // Remove sensitive data for response
          subscriptionList.push({
            id: parsedData.id,
            timestamp: parsedData.timestamp,
            userAgent: parsedData.userAgent,
            endpoint: parsedData.subscription?.endpoint?.substring(0, 50) + '...'
          });
        } catch (error) {
          console.error('Error processing subscription:', sub.key, error);
        }
      }

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          subscriptions: subscriptionList,
          count: subscriptionList.length
        })
      };
    }

    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Error in push-subscription function:', error);
    
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
