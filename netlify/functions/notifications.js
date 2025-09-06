/**
 * Netlify Webhook Notifications Handler
 * Handles POST requests from Netlify's webhook system for deployment notifications
 */

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Parse the webhook payload
    const payload = JSON.parse(event.body);
    
    // Log the notification (you can customize this)
    console.log('Netlify Webhook Notification:', {
      timestamp: new Date().toISOString(),
      type: payload.type || 'unknown',
      site_id: payload.site_id,
      deploy_id: payload.deploy_id,
      state: payload.state,
      url: payload.url,
      error_message: payload.error_message
    });

    // Handle different notification types
    switch (payload.type) {
      case 'deploy_created':
        console.log('Deploy created:', payload.deploy_id);
        break;
      case 'deploy_building':
        console.log('Deploy building:', payload.deploy_id);
        break;
      case 'deploy_succeeded':
        console.log('Deploy succeeded:', payload.deploy_id);
        // You could trigger additional actions here
        break;
      case 'deploy_failed':
        console.log('Deploy failed:', payload.deploy_id, payload.error_message);
        // You could send alerts or notifications here
        break;
      default:
        console.log('Unknown notification type:', payload.type);
    }

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Notification received',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error processing webhook notification:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
