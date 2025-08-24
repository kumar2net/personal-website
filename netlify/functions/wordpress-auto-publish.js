import fetch from 'node-fetch';

export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { blogPath, title, content, tags, date } = JSON.parse(event.body);
    
    const siteId = 'kumar2net.wordpress.com';
    const apiToken = process.env.WORDPRESS_API_TOKEN;
    const apiBase = 'https://public-api.wordpress.com/rest/v1.1';
    
    if (!apiToken) {
      throw new Error('WordPress API token not configured');
    }
    
    const url = `${apiBase}/sites/${siteId}/posts/new`;
    
    const payload = {
      title,
      content,
      status: 'publish',
      tags: tags ? tags.join(',') : '',
      date: date || new Date().toISOString()
    };

    console.log(`Publishing to WordPress: ${title}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        postId: result.ID,
        postUrl: result.URL,
        message: 'Successfully published to WordPress.com'
      })
    };
  } catch (error) {
    console.error('WordPress auto-publish error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to publish to WordPress',
        details: error.message
      })
    };
  }
}


