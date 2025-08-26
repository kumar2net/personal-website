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
    const { post, post_meta, site } = JSON.parse(event.body);
    
    console.log(`📝 Processing WordPress post: ${post.title}`);
    
    // Extract post data
    const postData = {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      date: post.date,
      modified: post.modified,
      slug: post.slug,
      status: post.status,
      categories: post.categories || [],
      tags: post.tags || [],
      featured_image: post.featured_image,
      author: post.author,
      url: post.URL
    };

    // Only process published posts
    if (postData.status !== 'publish') {
      console.log(`⏭️  Skipping non-published post: ${postData.title}`);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          success: true, 
          message: 'Post not published, skipping',
          status: postData.status 
        })
      };
    }

    // Convert WordPress content to JSX
    const jsxContent = await convertToJSX(postData);
    
    // Generate filename
    const filename = generateFilename(postData.title, postData.date);
    const filePath = path.join(__dirname, '../../src/pages/blog', filename);
    
    // Write JSX file
    await fs.writeFile(filePath, jsxContent, 'utf8');
    console.log(`✅ Created JSX file: ${filename}`);

    // Commit to GitHub (if configured)
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      await commitToGitHub(filename, jsxContent, postData.title);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'WordPress post successfully converted to JSX',
        filename,
        title: postData.title,
        url: postData.url
      })
    };

  } catch (error) {
    console.error('WordPress webhook error:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to process WordPress webhook',
        details: error.message
      })
    };
  }
}

async function convertToJSX(postData) {
  // Convert WordPress HTML to JSX-compatible content
  let content = postData.content;
  
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
  const tags = [...(postData.categories || []), ...(postData.tags || [])];
  const tagElements = tags.map(tag => 
    `<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">${tag}</span>`
  ).join('');

  // Generate JSX content
  const jsxContent = `import React from 'react';
import { Link } from 'react-router-dom';

const ${generateComponentName(postData.title)} = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">${postData.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">Date: ${formatDate(postData.date)}</span>
          ${postData.author ? `<span className="mr-4">By: ${postData.author.display_name || postData.author.name}</span>` : ''}
        </div>
        ${tagElements ? `<div className="mb-6">${tagElements}</div>` : ''}
        ${postData.excerpt ? `<div className="text-lg text-gray-700 mb-6 italic">${postData.excerpt}</div>` : ''}
      </div>
      
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: \`${content}\` }} />
      
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
          <div className="text-sm text-gray-500">
            Originally published on <a href="${postData.url}" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">WordPress</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${generateComponentName(postData.title)};
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function commitToGitHub(filename, content, title) {
  try {
    const repo = process.env.GITHUB_REPO; // format: "username/repository"
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
