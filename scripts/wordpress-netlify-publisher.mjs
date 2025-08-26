#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressNetlifyPublisher {
  constructor() {
    this.siteId = 'kumar2net.wordpress.com';
    this.apiBase = 'https://public-api.wordpress.com/rest/v1.1';
    this.tokenFile = path.join(__dirname, '../data/wordpress-token.json');
    this.publishedFile = path.join(__dirname, '../data/wordpress-netlify-published.json');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async close() {
    this.rl.close();
  }

  async getValidToken() {
    try {
      const tokenData = JSON.parse(await fs.readFile(this.tokenFile, 'utf8'));
      
      // Check if token is still valid
      const response = await fetch(`${this.apiBase}/me`, {
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
        await this.saveToken(newTokenData);
        return newTokenData.access_token;
      }

      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('❌ Token error:', error.message);
      return null;
    }
  }

  async saveToken(tokenData) {
    await fs.writeFile(this.tokenFile, JSON.stringify(tokenData, null, 2));
  }

  async getPublishedPosts() {
    try {
      const data = await fs.readFile(this.publishedFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async markAsPublished(postId, postData) {
    try {
      const published = await this.getPublishedPosts();
      published.push({
        id: postId,
        title: postData.title,
        url: postData.URL,
        published_at: new Date().toISOString(),
        netlify_url: `https://kumarsite.netlify.app/blog/${this.generateSlug(postData.title, postData.date)}`
      });
      await fs.writeFile(this.publishedFile, JSON.stringify(published, null, 2));
    } catch (error) {
      console.error('Error marking post as published:', error);
    }
  }

  async listWordPressPosts() {
    const token = await this.getValidToken();
    if (!token) {
      console.log('❌ No valid token available');
      return [];
    }

    try {
      console.log('📋 Fetching WordPress posts...');
      
      const response = await fetch(`${this.apiBase}/sites/${this.siteId}/posts?number=20&status=publish`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const posts = await response.json();
      return posts.posts;
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      return [];
    }
  }

  async publishToNetlify(postId) {
    const token = await this.getValidToken();
    if (!token) {
      console.log('❌ No valid token available');
      return false;
    }

    try {
      // Get specific post
      const response = await fetch(`${this.apiBase}/sites/${this.siteId}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const post = await response.json();
      
      // Convert to JSX and publish
      const jsxContent = await this.convertToJSX(post);
      const filename = this.generateFilename(post.title, post.date);
      const filePath = path.join(__dirname, '../src/pages/blog', filename);
      
      // Write JSX file
      await fs.writeFile(filePath, jsxContent, 'utf8');
      console.log(`✅ Created JSX file: ${filename}`);

      // Commit to GitHub (if configured)
      if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
        await this.commitToGitHub(filename, jsxContent, post.title);
      }

      // Mark as published
      await this.markAsPublished(postId, post);

      return true;
    } catch (error) {
      console.error('❌ Error publishing to Netlify:', error);
      return false;
    }
  }

  async convertToJSX(post) {
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
    const categories = Array.isArray(post.categories) ? post.categories : [];
    const tags = Array.isArray(post.tags) ? post.tags : [];
    const allTags = [...categories, ...tags];
    const tagElements = allTags.map(tag => 
      `<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">${tag}</span>`
    ).join('');

    // Generate JSX content
    const jsxContent = `import React from 'react';
import { Link } from 'react-router-dom';

const ${this.generateComponentName(post.title)} = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">${post.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">Date: ${this.formatDate(post.date)}</span>
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

export default ${this.generateComponentName(post.title)};
`;

    return jsxContent;
  }

  generateComponentName(title) {
    return title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
      .replace(/\s+/g, '');
  }

  generateFilename(title, date) {
    const dateObj = new Date(date);
    const dateStr = dateObj.toISOString().split('T')[0];
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    return `${dateStr}-${slug}.jsx`;
  }

  generateSlug(title, date) {
    const dateObj = new Date(date);
    const dateStr = dateObj.toISOString().split('T')[0];
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    return `${dateStr}-${slug}`;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async commitToGitHub(filename, content, title) {
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

  async interactivePublisher() {
    console.log('🚀 WordPress to Netlify Publisher');
    console.log('=================================');
    console.log('');

    const posts = await this.listWordPressPosts();
    const published = await this.getPublishedPosts();
    const publishedIds = published.map(p => p.id);

    if (posts.length === 0) {
      console.log('❌ No posts found');
      await this.close();
      return;
    }

    console.log('📋 Available WordPress Posts:');
    console.log('');

    posts.forEach((post, index) => {
      const isPublished = publishedIds.includes(post.ID);
      const status = isPublished ? '✅ Published' : '⏳ Not Published';
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Date: ${this.formatDate(post.date)}`);
      console.log(`   Status: ${status}`);
      if (isPublished) {
        const publishedPost = published.find(p => p.id === post.ID);
        console.log(`   Netlify URL: ${publishedPost.netlify_url}`);
      }
      console.log('');
    });

    const choice = await this.question('Enter post number to publish to Netlify (or "q" to quit): ');
    
    if (choice.toLowerCase() === 'q') {
      console.log('👋 Goodbye!');
      await this.close();
      return;
    }

    const postIndex = parseInt(choice) - 1;
    if (postIndex < 0 || postIndex >= posts.length) {
      console.log('❌ Invalid selection');
      await this.close();
      return;
    }

    const selectedPost = posts[postIndex];
    
    if (publishedIds.includes(selectedPost.ID)) {
      console.log('⚠️  This post is already published to Netlify');
      const republish = await this.question('Republish? (y/N): ');
      if (republish.toLowerCase() !== 'y') {
        await this.close();
        return;
      }
    }

    console.log(`📝 Publishing "${selectedPost.title}" to Netlify...`);
    
    const success = await this.publishToNetlify(selectedPost.ID);
    
    if (success) {
      console.log('✅ Successfully published to Netlify!');
      console.log(`🌐 Netlify URL: https://kumarsite.netlify.app/blog/${this.generateSlug(selectedPost.title, selectedPost.date)}`);
    } else {
      console.log('❌ Failed to publish to Netlify');
    }

    await this.close();
  }

  async publishSpecificPost(postId) {
    console.log(`📝 Publishing post ${postId} to Netlify...`);
    
    const success = await this.publishToNetlify(postId);
    
    if (success) {
      console.log('✅ Successfully published to Netlify!');
    } else {
      console.log('❌ Failed to publish to Netlify');
    }
  }

  async showPublishedPosts() {
    const published = await this.getPublishedPosts();
    
    if (published.length === 0) {
      console.log('📋 No posts published to Netlify yet');
      return;
    }

    console.log('📋 Posts Published to Netlify:');
    console.log('');
    
    published.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Published: ${new Date(post.published_at).toLocaleDateString()}`);
      console.log(`   Netlify URL: ${post.netlify_url}`);
      console.log(`   WordPress URL: ${post.url}`);
      console.log('');
    });
  }
}

// Main execution
const publisher = new WordPressNetlifyPublisher();

const command = process.argv[2];
const postId = process.argv[3];

if (command === '--publish' && postId) {
  publisher.publishSpecificPost(postId).then(() => process.exit(0));
} else if (command === '--list') {
  publisher.showPublishedPosts().then(() => process.exit(0));
} else {
  publisher.interactivePublisher();
}
