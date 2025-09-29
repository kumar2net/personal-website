/**
 * Send Push Notification
 * Sends push notifications to all subscribed users
 * Note: This is a simplified version for development. 
 * For production, you'll need to implement proper web-push functionality.
 */

import { getStore } from '@netlify/blobs';

export const handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { title, body, url, icon, tag, data } = JSON.parse(event.body);
    
    // Validate required fields
    if (!title || !body) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Title and body are required' })
      };
    }

    // Get all subscriptions from Netlify Blobs
    const store = getStore('push-subscriptions');
    const subscriptions = await store.list();
    
    if (subscriptions.length === 0) {
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          sent: 0,
          message: 'No subscriptions found'
        })
      };
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: tag || `notification-${Date.now()}`,
      data: {
        dateOfArrival: Date.now(),
        url: url || '/',
        ...data
      },
      actions: [
        {
          action: 'explore',
          title: 'View',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/xmark.png'
        }
      ],
      requireInteraction: true,
      vibrate: [100, 50, 100]
    });

    // Send notifications to all subscriptions
    // Note: This is a simplified version for development
    // In production, you would use web-push to actually send notifications
    const pushPromises = subscriptions.map(async (sub) => {
      try {
        const subscriptionData = await store.get(sub.key);
        const parsedData = JSON.parse(subscriptionData);
        
        if (!parsedData.subscription) {
          console.warn('Invalid subscription data for:', sub.key);
          return { success: false, error: 'Invalid subscription data' };
        }

        // For development, just log the notification
        console.log('Would send push notification to:', sub.key, {
          title,
          body,
          url,
          icon
        });
        
        // In production, you would use:
        // await webpush.sendNotification(parsedData.subscription, payload);
        
        return { success: true, subscriptionId: sub.key };
        
      } catch (error) {
        console.error('Failed to process subscription:', sub.key, error);
        
        return { 
          success: false, 
          error: error.message,
          subscriptionId: sub.key
        };
      }
    });

    // Wait for all notifications to be sent
    const results = await Promise.allSettled(pushPromises);
    
    // Count successful and failed sends
    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;
    
    const failed = results.filter(result => 
      result.status === 'rejected' || 
      (result.status === 'fulfilled' && !result.value.success)
    ).length;

    console.log(`Push notification results: ${successful} successful, ${failed} failed`);

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        sent: successful,
        failed,
        total: subscriptions.length,
        message: `Notifications sent: ${successful} successful, ${failed} failed`
      })
    };

  } catch (error) {
    console.error('Error in send-push-notification function:', error);
    
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
