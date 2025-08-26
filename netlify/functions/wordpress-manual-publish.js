import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const { postId, action } = JSON.parse(event.body);
    
    if (!postId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'postId is required' })
      };
    }

    console.log(`📝 Processing manual publish request for post ID: ${postId}`);

    // Get WordPress post
    const post = await getWordPressPost(postId);
    if (!post) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'WordPress post not found' })
      };
    }

    // Convert to JSX and publish
    const jsxContent = await convertToJSX(post);
    const filename = generateFilename(post.title, post.date);
    const filePath = path.join(__dirname, '../../src/pages/blog', filename);
    
    // Write JSX file
    await fs.writeFile(filePath, jsxContent, 'utf8');
    console.log(`✅ Created JSX file: ${filename}`);

    // Commit to GitHub (if configured)
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      await commitToGitHub(filename, jsxContent, post.title);
    }

    // Mark as published
    await markAsPublished(postId, post);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'WordPress post successfully published to Netlify',
        filename,
        title: post.title,
        wordpress_url: post.URL,
        netlify_url: `https://kumarsite.netlify.app/blog/${generateSlug(post.title, post.date)}`
      })
    };

  } catch (error) {
    console.error('Manual publish error:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to publish WordPress post to Netlify',
        details: error.message
      })
    };
  }
}

async function getWordPressPost(postId) {
  const token = await getValidToken();
  if (!token) {
    throw new Error('No valid WordPress token available');
  }

  const response = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/kumar2net.wordpress.com/posts/${postId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }

  return await response.json();
}

async function getValidToken() {
  try {
    const tokenFile = path.join(__dirname, '../../data/wordpress-token.json');
    const tokenData = JSON.parse(await fs.readFile(tokenFile, 'utf8'));
    
    // Check if token is still valid
    const response = await fetch('https://public-api.wordpress.com/rest/v1.1/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    if (response.ok) {
      return tokenData.access_token;
    }

    // Token expired, refresh it
    console.log('🔄 Token expired, refreshing...');
    const refreshResponse = await fetch('https://public-api.wordpress.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '123358',
        client_secret: 'plvGijZrEy4aJufDwINk4saoeApzmvzRWmonQ9tykXeQecDSSbG7BqlxVP87zAqm',
        grant_type: 'refresh_token',
        refresh_token: tokenData.refresh_token
      })
    });

    if (refreshResponse.ok) {
      const newTokenData = await refreshResponse.json();
      await fs.writeFile(tokenFile, JSON.stringify(newTokenData, null, 2));
      return newTokenData.access_token;
    }

    throw new Error('Failed to refresh token');
  } catch (error) {
    console.error('Token error:', error.message);
    return null;
  }
}

async function convertToJSX(post) {
  // Convert WordPress HTML to JSX-compatible content
  let content = post.content;
  
  // Convert WordPress image URLs to relative paths
  content = content.replace(
    /https:\/\/kumar2net\.files\.wordpress\.com\//g,
    '/media/'
  );
  
  // Convert WordPress embeds to standard HTML
  content = content.replace(
    /\[embed\](.*?)\[\/embed\]/g,
    '<iframe src="$1" width="100%" height="400" frameborder="0"></iframe>'
  );
  
  // Convert WordPress shortcodes
  content = content.replace(/\[.*?\]/g, '');
  
  // Extract tags from WordPress categories and tags
  const tags = [...(post.categories || []), ...(post.tags || [])];
  const tagElements = tags.map(tag => 
    `<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">${tag}</span>`
  ).join('');

  // Generate JSX content
  const jsxContent = `import React from 'react';
import { Link } from 'react-router-dom';

const ${generateComponentName(post.title)} = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">${post.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">Date: ${formatDate(post.date)}</span>
          ${post.author ? `<span className="mr-4">By: ${post.author.display_name || post.author.name}</span>` : ''}
        </div>
        ${tagElements ? `<div className="mb-6">${tagElements}</div>` : ''}
        ${post.excerpt ? `<div className="text-lg text-gray-700 mb-6 italic">${post.excerpt}</div>` : ''}
      </div>
      
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: \`${content}\` }} />
      
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
          <div className="text-sm text-gray-500">
            Originally published on <a href="${post.URL}" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">WordPress</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${generateComponentName(post.title)};
`;

  return jsxContent;
}

function generateComponentName(title) {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/\s+/g, '');
}

function generateFilename(title, date) {
  const dateObj = new Date(date);
  const dateStr = dateObj.toISOString().split('T')[0];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  return `${dateStr}-${slug}.jsx`;
}

function generateSlug(title, date) {
  const dateObj = new Date(date);
  const dateStr = dateObj.toISOString().split('T')[0];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  return `${dateStr}-${slug}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function markAsPublished(postId, postData) {
  try {
    const publishedFile = path.join(__dirname, '../../data/wordpress-netlify-published.json');
    let published = [];
    
    try {
      const data = await fs.readFile(publishedFile, 'utf8');
      published = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
    }

    // Check if already published
    const existingIndex = published.findIndex(p => p.id === postId);
    if (existingIndex >= 0) {
      // Update existing entry
      published[existingIndex] = {
        id: postId,
        title: postData.title,
        url: postData.URL,
        published_at: new Date().toISOString(),
        netlify_url: `https://kumarsite.netlify.app/blog/${generateSlug(postData.title, postData.date)}`
      };
    } else {
      // Add new entry
      published.push({
        id: postId,
        title: postData.title,
        url: postData.URL,
        published_at: new Date().toISOString(),
        netlify_url: `https://kumarsite.netlify.app/blog/${generateSlug(postData.title, postData.date)}`
      });
    }

    await fs.writeFile(publishedFile, JSON.stringify(published, null, 2));
  } catch (error) {
    console.error('Error marking post as published:', error);
  }
}

async function commitToGitHub(filename, content, title) {
  try {
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    
    if (!repo || !token) {
      console.log('⚠️  GitHub credentials not configured, skipping commit');
      return;
    }

    // Get current file content (if exists)
    const getResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/src/pages/blog/${filename}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    let sha = null;
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // Create or update file
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/src/pages/blog/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add WordPress cross-post: ${title}`,
          content: Buffer.from(content).toString('base64'),
          sha: sha
        })
      }
    );

    if (response.ok) {
      console.log(`✅ Successfully committed to GitHub: ${filename}`);
    } else {
      const error = await response.text();
      console.error(`❌ GitHub commit failed: ${error}`);
    }

  } catch (error) {
    console.error('GitHub commit error:', error);
  }
}
