#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressPolling {
  constructor() {
    this.siteId = 'kumar2net.wordpress.com';
    this.apiBase = 'https://public-api.wordpress.com/rest/v1.1';
    this.tokenFile = path.join(__dirname, '../data/wordpress-token.json');
    this.processedFile = path.join(
      __dirname,
      '../data/wordpress-processed.json'
    );
    this.pollingInterval = 5 * 60 * 1000; // 5 minutes
  }

  async getValidToken() {
    try {
      const tokenData = JSON.parse(await fs.readFile(this.tokenFile, 'utf8'));

      // Check if token is still valid
      const response = await fetch(`${this.apiBase}/me`, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (response.ok) {
        return tokenData.access_token;
      }

      // Token expired, refresh it
      console.log('🔄 Token expired, refreshing...');
      const refreshResponse = await fetch(
        'https://public-api.wordpress.com/oauth2/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: '123358',
            client_secret:
              'plvGijZrEy4aJufDwINk4saoeApzmvzRWmonQ9tykXeQecDSSbG7BqlxVP87zAqm',
            grant_type: 'refresh_token',
            refresh_token: tokenData.refresh_token,
          }),
        }
      );

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

  async getProcessedPosts() {
    try {
      const data = await fs.readFile(this.processedFile, 'utf8');
      return JSON.parse(data);
    } catch (_error) {
      return [];
    }
  }

  async markAsProcessed(postId) {
    try {
      const processed = await this.getProcessedPosts();
      processed.push({
        id: postId,
        processed_at: new Date().toISOString(),
      });
      await fs.writeFile(
        this.processedFile,
        JSON.stringify(processed, null, 2)
      );
    } catch (error) {
      console.error('Error marking post as processed:', error);
    }
  }

  async checkForNewPosts() {
    const token = await this.getValidToken();
    if (!token) {
      console.log('❌ No valid token available');
      return;
    }

    try {
      console.log('🔍 Checking for new WordPress posts...');

      const response = await fetch(
        `${this.apiBase}/sites/${this.siteId}/posts?number=10&status=publish`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const posts = await response.json();
      const processed = await this.getProcessedPosts();
      const processedIds = processed.map((p) => p.id);

      let newPostsFound = false;
      for (const post of posts.posts) {
        if (!processedIds.includes(post.ID)) {
          console.log(`📝 Processing new post: ${post.title}`);
          await this.processPost(post);
          await this.markAsProcessed(post.ID);
          newPostsFound = true;
        }
      }

      if (!newPostsFound) {
        console.log('✅ No new posts found');
      }
    } catch (error) {
      console.error('❌ Error checking for new posts:', error);
    }
  }

  async processPost(post) {
    try {
      // Convert WordPress post to JSX directly
      const jsxContent = await this.convertToJSX(post);

      // Generate filename
      const filename = this.generateFilename(post.title, post.date);
      const filePath = path.join(__dirname, '../src/pages/blog', filename);

      // Write JSX file
      await fs.writeFile(filePath, jsxContent, 'utf8');
      console.log(`✅ Created JSX file: ${filename}`);

      // Commit to GitHub (if configured)
      if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
        await this.commitToGitHub(filename, jsxContent, post.title);
      }
    } catch (error) {
      console.error('❌ Error processing post:', error);
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
    const tags = [...(post.categories || []), ...(post.tags || [])];
    const tagElements = tags
      .map(
        (tag) =>
          `<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">${tag}</span>`
      )
      .join('');

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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  async commitToGitHub(filename, content, title) {
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
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
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
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Add WordPress cross-post: ${title}`,
            content: Buffer.from(content).toString('base64'),
            sha: sha,
          }),
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

  async startPolling() {
    console.log('🚀 Starting WordPress polling...');
    console.log(`📡 Polling every ${this.pollingInterval / 1000 / 60} minutes`);
    console.log(`🌐 WordPress site: ${this.siteId}`);
    console.log(`📁 Output directory: src/pages/blog/`);
    console.log('');

    // Initial check
    await this.checkForNewPosts();

    // Set up interval
    setInterval(async () => {
      await this.checkForNewPosts();
    }, this.pollingInterval);
  }

  async runOnce() {
    console.log('🔍 Running one-time check for new WordPress posts...');
    await this.checkForNewPosts();
    console.log('✅ Check complete');
  }
}

// Main execution
const poller = new WordPressPolling();

const command = process.argv[2];
if (command === '--once') {
  poller.runOnce().then(() => process.exit(0));
} else {
  poller.startPolling();
}
