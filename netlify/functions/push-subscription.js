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
    // Check if Netlify Blobs is available
    if (!getStore) {
      console.error('Netlify Blobs not available');
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Storage service not available',
          message: 'Push notification storage is temporarily unavailable'
        })
      };
    }

    // Configure store with proper parameters for development
    let store;
    try {
      if (context.site?.id) {
        // Production environment
        store = getStore('push-subscriptions');
      } else {
        // Development environment - use local storage fallback
        console.warn('Development environment detected, using local storage fallback');
        store = null;
      }
    } catch (storeError) {
      console.error('Failed to initialize store:', storeError);
      store = null;
    }

    if (event.httpMethod === 'POST') {
      // Parse request body
      let requestData;
      try {
        requestData = JSON.parse(event.body);
      } catch (parseError) {
        console.error('Failed to parse request body:', parseError);
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            error: 'Invalid JSON in request body',
            message: 'The request data is not valid JSON'
          })
        };
      }

      const { subscription, userAgent, timestamp } = requestData;
      
      if (!subscription || !subscription.endpoint) {
        console.error('Invalid subscription data:', { subscription: !!subscription, endpoint: subscription?.endpoint });
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            error: 'Invalid subscription data',
            message: 'Subscription data is missing or invalid'
          })
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
        siteId: context.site?.id || 'unknown'
      };

      if (store) {
        try {
          await store.set(subscriptionId, JSON.stringify(subscriptionData));
          console.log('Push subscription stored successfully:', subscriptionId);
        } catch (storeError) {
          console.error('Failed to store subscription:', storeError);
          return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              error: 'Failed to store subscription',
              message: 'Unable to save subscription to storage'
            })
          };
        }
      } else {
        // Development environment - just log the subscription
        console.log('Development mode - subscription would be stored:', subscriptionId);
        console.log('Subscription data:', JSON.stringify(subscriptionData, null, 2));
      }

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

      if (store) {
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
      } else {
        // Development environment
        console.log('Development mode - subscription would be deleted:', subscription.endpoint);
        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: true, 
            deleted: true,
            message: 'Subscription removed successfully (development mode)'
          })
        };
      }
    }

    if (event.httpMethod === 'GET') {
      // Get all subscriptions (for admin/stats)
      if (store) {
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
      } else {
        // Development environment
        console.log('Development mode - no subscriptions to list');
        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: true, 
            subscriptions: [],
            count: 0,
            message: 'Development mode - no persistent storage'
          })
        };
      }
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
