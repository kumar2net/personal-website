#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressCrossPoster {
  constructor() {
    this.siteId = 'kumar2net.wordpress.com';
    this.apiToken = process.env.WORDPRESS_API_TOKEN;
    this.apiBase = 'https://public-api.wordpress.com/rest/v1.1';
    this.postedLogFile = path.join(__dirname, '../data/wordpress-posted.json');
    this.tokenFile = path.join(__dirname, '../data/wordpress-token.json');
  }

  async getValidToken() {
    // First try environment variable
    if (this.apiToken) {
      const isValid = await this.testToken(this.apiToken);
      if (isValid) {
        return this.apiToken;
      }
    }

    // Try to load from token file
    try {
      const data = await fs.readFile(this.tokenFile, 'utf-8');
      const tokenData = JSON.parse(data);
      
      // Check if token is expired (tokens expire in 30 days)
      const tokenAge = Date.now() - tokenData.createdAt;
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      
      if (tokenAge < thirtyDays && tokenData.access_token) {
        const isValid = await this.testToken(tokenData.access_token);
        if (isValid) {
          return tokenData.access_token;
        }
      }

      // Try to refresh token if we have a refresh token
      if (tokenData.refresh_token) {
        console.log('🔄 Attempting to refresh token...');
        const newToken = await this.refreshToken(tokenData.refresh_token);
        if (newToken) {
          return newToken;
        }
      }
    } catch (error) {
      console.log('No token file found or invalid token');
    }

    console.log('❌ No valid token available. Please run: npm run wordpress:token');
    return null;
  }

  async refreshToken(refreshToken) {
    try {
      const response = await fetch('https://public-api.wordpress.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: '123358',
          client_secret: 'plvGijZrEy4aJufDwINk4saoeApzmvzRWmonQ9tykXeQecDSSbG7BqlxVP87zAqm',
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const tokenData = await response.json();
      await this.saveToken(tokenData);
      console.log('✅ Token refreshed successfully!');
      return tokenData.access_token;
    } catch (error) {
      console.error('❌ Failed to refresh token:', error.message);
      return null;
    }
  }

  async saveToken(tokenData) {
    await fs.mkdir(path.dirname(this.tokenFile), { recursive: true });
    const dataToSave = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      createdAt: Date.now(),
      expires_in: tokenData.expires_in || 2592000 // 30 days in seconds
    };
    await fs.writeFile(this.tokenFile, JSON.stringify(dataToSave, null, 2));
  }

  async testToken(token) {
    try {
      const response = await fetch(`${this.apiBase}/sites/kumar2net.wordpress.com/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async loadPostedLog() {
    try {
      const data = await fs.readFile(this.postedLogFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return { posts: [] };
    }
  }

  async savePostedLog(log) {
    await fs.mkdir(path.dirname(this.postedLogFile), { recursive: true });
    await fs.writeFile(this.postedLogFile, JSON.stringify(log, null, 2));
  }

  async isAlreadyPosted(filePath) {
    const log = await this.loadPostedLog();
    return log.posts.some(post => post.filePath === filePath);
  }

  async markAsPosted(filePath, postId, postUrl) {
    const log = await this.loadPostedLog();
    log.posts.push({
      filePath,
      postId,
      postUrl,
      postedAt: new Date().toISOString()
    });
    await this.savePostedLog(log);
  }

  async extractBlogContent(jsxFilePath) {
    try {
      const content = await fs.readFile(jsxFilePath, 'utf-8');
      
      // Extract title
      const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
      if (!titleMatch) {
        throw new Error('Could not extract title from JSX file');
      }
      const title = titleMatch[1].replace(/📄\s*/, '').trim();

      // Extract date
      const dateMatch = content.match(/Date:\s*([^<]+)/);
      const date = dateMatch ? new Date(dateMatch[1].trim()) : new Date();

      // Extract tags/badges
      const badgeMatches = content.match(/className="[^"]*bg-[^"]*[^"]*">([^<]+)<\/span>/g);
      const tags = badgeMatches ? badgeMatches.map(tag => tag.match(/>([^<]+)</)[1]) : [];

      // Extract main content - try multiple patterns
      let contentMatch = content.match(/<div[^>]*prose[^>]*>([\s\S]*?)<\/div>/);
      
      if (!contentMatch) {
        // Try to find content in the main component div
        contentMatch = content.match(/<div[^>]*max-w-[^>]*>([\s\S]*?)<\/div>/);
      }
      
      if (!contentMatch) {
        // Try to find content after the h1 tag
        const h1Match = content.match(/<h1[^>]*>.*?<\/h1>/);
        if (h1Match) {
          const afterH1 = content.substring(content.indexOf(h1Match[0]) + h1Match[0].length);
          contentMatch = [null, afterH1];
        }
      }
      
      if (!contentMatch) {
        throw new Error('Could not extract content from JSX file');
      }

      // Convert JSX to HTML
      const htmlContent = this.convertJSXToHTML(contentMatch[1]);
      
      return {
        title,
        content: htmlContent,
        date,
        tags,
        status: 'publish'
      };
    } catch (error) {
      console.error('Error extracting content:', error);
      throw error;
    }
  }

  convertJSXToHTML(jsxContent) {
    let html = jsxContent
      // Convert JSX attributes
      .replace(/className=/g, 'class=')
      .replace(/<svg[^>]*>.*?<\/svg>/gs, '') // Remove SVG icons
      .replace(/<button[^>]*>.*?<\/button>/gs, '') // Remove buttons
      .replace(/<div[^>]*ref=[^>]*>/g, '<div>') // Remove ref attributes
      .replace(/<motion\.div[^>]*>/g, '<div>') // Convert motion.div to div
      .replace(/<\/motion\.div>/g, '</div>')
      // Handle images - convert to WordPress.com URLs
      .replace(/<img[^>]*src="\/media\/([^"]*)"[^>]*>/g, '<img src="https://kumar2net.files.wordpress.com/$1" alt="$1" />')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();

    return html;
  }

  async postToWordPress(postData) {
    const url = `${this.apiBase}/sites/${this.siteId}/posts/new`;
    
    const payload = {
      title: postData.title,
      content: postData.content,
      status: postData.status,
      tags: postData.tags.join(','),
      date: postData.date.toISOString()
    };

    try {
      // Get a valid token
      const token = await this.getValidToken();
      if (!token) {
        throw new Error('No valid WordPress API token available');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Successfully posted: ${postData.title}`);
      console.log(`🌐 Post URL: ${result.URL}`);
      return result;
    } catch (error) {
      console.error('❌ Error posting to WordPress:', error);
      throw error;
    }
  }

  async crossPostBlog(jsxFilePath) {
    try {
      console.log(`📝 Processing: ${jsxFilePath}`);
      
      // Check if already posted
      if (await this.isAlreadyPosted(jsxFilePath)) {
        console.log(`⏭️  Already posted: ${jsxFilePath}`);
        return null;
      }
      
      // Extract content from JSX file
      const postData = await this.extractBlogContent(jsxFilePath);
      
      // Post to WordPress
      const result = await this.postToWordPress(postData);
      
      // Mark as posted
      await this.markAsPosted(jsxFilePath, result.ID, result.URL);
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to cross-post ${jsxFilePath}:`, error);
      throw error;
    }
  }

  async crossPostAllBlogs() {
    const blogDir = path.join(__dirname, '../src/pages/blog');
    
    try {
      const files = await fs.readdir(blogDir);
      const jsxFiles = files.filter(file => 
        file.endsWith('.jsx') && 
        file !== 'PostDynamic.jsx' &&
        !file.startsWith('.')
      );
      
      console.log(`📚 Found ${jsxFiles.length} blog posts to process`);
      
      let postedCount = 0;
      let skippedCount = 0;
      
      for (const file of jsxFiles) {
        const filePath = path.join(blogDir, file);
        
        if (await this.isAlreadyPosted(filePath)) {
          console.log(`⏭️  Skipping (already posted): ${file}`);
          skippedCount++;
          continue;
        }
        
        try {
          await this.crossPostBlog(filePath);
          postedCount++;
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
          console.error(`❌ Failed to post ${file}:`, error.message);
        }
      }
      
      console.log(`\n📊 Summary:`);
      console.log(`✅ Posted: ${postedCount} posts`);
      console.log(`⏭️  Skipped: ${skippedCount} posts (already posted)`);
      console.log(`📝 Total processed: ${jsxFiles.length} posts`);
      
    } catch (error) {
      console.error('❌ Error in batch cross-posting:', error);
    }
  }

  async crossPostLatest() {
    const blogDir = path.join(__dirname, '../src/pages/blog');
    
    try {
      const files = await fs.readdir(blogDir);
      const jsxFiles = files.filter(file => 
        file.endsWith('.jsx') && 
        file !== 'PostDynamic.jsx' &&
        !file.startsWith('.')
      );
      
      if (jsxFiles.length === 0) {
        console.log('❌ No blog posts found');
        return;
      }
      
      // Get the most recent file
      const latestFile = jsxFiles.sort().pop();
      const filePath = path.join(blogDir, latestFile);
      
      console.log(`📝 Processing latest blog post: ${latestFile}`);
      await this.crossPostBlog(filePath);
      
    } catch (error) {
      console.error('❌ Error processing latest blog:', error);
    }
  }
}

// CLI usage
const crossPoster = new WordPressCrossPoster();

if (process.argv[2] === '--all') {
  crossPoster.crossPostAllBlogs();
} else if (process.argv[2] === '--latest') {
  crossPoster.crossPostLatest();
} else if (process.argv[2]) {
  crossPoster.crossPostBlog(process.argv[2]);
} else {
  console.log('WordPress Cross-Posting Tool');
  console.log('============================');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/wordpress-crosspost.mjs --all                    # Cross-post all blogs');
  console.log('  node scripts/wordpress-crosspost.mjs --latest                 # Cross-post latest blog');
  console.log('  node scripts/wordpress-crosspost.mjs path/to/blog.jsx        # Cross-post specific blog');
  console.log('');
  console.log('Environment Variables:');
  console.log('  WORDPRESS_API_TOKEN - Your WordPress.com API token');
  console.log('');
  console.log('Setup:');
  console.log('  1. Get API token from: https://developer.wordpress.com/apps/');
  console.log('  2. Set environment variable: export WORDPRESS_API_TOKEN="your_token"');
  console.log('  3. Run: npm run crosspost:all');
}
