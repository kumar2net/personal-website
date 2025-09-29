/**
 * Disqus Webhook Handler
 * Handles webhook notifications from Disqus for new comments
 */

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
    const payload = JSON.parse(event.body);
    console.log('Disqus webhook received:', payload);

    // Handle different Disqus webhook types
    if (payload.type === 'comment.created') {
      const comment = payload.data;
      
      // Send push notification for new comment
      const notificationPayload = {
        title: 'New Comment on Blog Post',
        body: `${comment.author.name} commented: "${comment.message.substring(0, 100)}${comment.message.length > 100 ? '...' : ''}"`,
        url: `/blog/${comment.thread.identifier}`,
        icon: '/icons/comment-notification.png',
        tag: `comment-${comment.id}`,
        data: {
          commentId: comment.id,
          postSlug: comment.thread.identifier,
          author: comment.author.name,
          commentText: comment.message
        }
      };

      // Send push notification
      const response = await fetch(`${event.headers.host}/.netlify/functions/send-push-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPayload)
      });

      if (!response.ok) {
        console.error('Failed to send push notification for comment:', response.statusText);
      } else {
        console.log('Push notification sent for new comment:', comment.id);
      }

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          message: 'Comment notification processed',
          commentId: comment.id
        })
      };
    }

    if (payload.type === 'comment.approved') {
      console.log('Comment approved:', payload.data.id);
      // Could send notification to comment author here
    }

    if (payload.type === 'comment.deleted') {
      console.log('Comment deleted:', payload.data.id);
      // Could send notification to comment author here
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        message: 'Webhook processed',
        type: payload.type
      })
    };

  } catch (error) {
    console.error('Error processing Disqus webhook:', error);
    
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
