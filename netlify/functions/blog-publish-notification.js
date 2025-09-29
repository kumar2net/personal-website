/**
 * Blog Publish Notification Handler
 * Handles notifications when new blog posts are published
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
    console.log('Blog publish notification received:', payload);

    // Check if this was a blog post update
    const blogPostAdded = payload.commits?.some(commit => 
      commit.modified?.some(file => file.includes('src/pages/blog/')) ||
      commit.added?.some(file => file.includes('src/pages/blog/'))
    );

    if (blogPostAdded) {
      // Extract blog post information from commits
      const newBlogPosts = [];
      
      payload.commits.forEach(commit => {
        const blogFiles = [
          ...(commit.modified || []),
          ...(commit.added || [])
        ].filter(file => file.includes('src/pages/blog/') && file.endsWith('.jsx'));

        blogFiles.forEach(file => {
          const postSlug = file.split('/').pop().replace('.jsx', '');
          newBlogPosts.push({
            slug: postSlug,
            title: postSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            url: `/blog/${postSlug}`
          });
        });
      });

      // Send push notification for each new blog post
      for (const post of newBlogPosts) {
        const notificationPayload = {
          title: 'New Blog Post Published!',
          body: `Check out "${post.title}" - fresh insights and updates`,
          url: post.url,
          icon: '/icons/blog-notification.png',
          tag: `blog-post-${post.slug}`,
          data: {
            postSlug: post.slug,
            postTitle: post.title,
            postUrl: post.url
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
          console.error('Failed to send push notification for blog post:', response.statusText);
        } else {
          console.log('Push notification sent for new blog post:', post.slug);
        }
      }

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          message: 'Blog post notifications sent',
          posts: newBlogPosts
        })
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        message: 'No blog posts detected in this deployment'
      })
    };

  } catch (error) {
    console.error('Error processing blog publish notification:', error);
    
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
