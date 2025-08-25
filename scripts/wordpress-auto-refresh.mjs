#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressAutoRefresh {
  constructor() {
    this.tokenFile = path.join(__dirname, '../data/wordpress-token.json');
    this.clientId = '123358';
    this.redirectUri = 'https://kumarsite.netlify.app/';
    this.apiBase = 'https://public-api.wordpress.com/rest/v1.1';
  }

  async loadToken() {
    try {
      const data = await fs.readFile(this.tokenFile, 'utf-8');
      const tokenData = JSON.parse(data);
      
      // Check if token is expired (tokens expire in 30 days)
      const tokenAge = Date.now() - tokenData.createdAt;
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      
      if (tokenAge > thirtyDays) {
        console.log('⚠️  Token is expired or will expire soon. Need to refresh.');
        return null;
      }
      
      return tokenData.access_token;
    } catch (error) {
      console.log('❌ No token file found or invalid token.');
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

  async refreshToken(refreshToken) {
    try {
      const response = await fetch('https://public-api.wordpress.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
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

  async getValidToken() {
    // First try to load existing token
    let token = await this.loadToken();
    
    if (token) {
      // Test the token
      const isValid = await this.testToken(token);
      if (isValid) {
        console.log('✅ Using existing valid token');
        return token;
      }
    }

    // Try to refresh token if we have a refresh token
    try {
      const data = await fs.readFile(this.tokenFile, 'utf-8');
      const tokenData = JSON.parse(data);
      
      if (tokenData.refresh_token) {
        console.log('🔄 Attempting to refresh token...');
        token = await this.refreshToken(tokenData.refresh_token);
        if (token) {
          return token;
        }
      }
    } catch (error) {
      console.log('No refresh token available');
    }

    // If all else fails, need manual authorization
    console.log('❌ No valid token available. Manual authorization required.');
    console.log('Run: npm run wordpress:token');
    return null;
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

  async setupAutoRefresh() {
    console.log('🔄 Setting up automatic token refresh...');
    
    const token = await this.getValidToken();
    if (token) {
      // Set environment variable for current session
      process.env.WORDPRESS_API_TOKEN = token;
      console.log('✅ Token set in environment');
      return token;
    }
    
    return null;
  }
}

// CLI usage
const autoRefresh = new WordPressAutoRefresh();

if (process.argv[2] === '--setup') {
  autoRefresh.setupAutoRefresh();
} else if (process.argv[2] === '--test') {
  autoRefresh.getValidToken().then(token => {
    if (token) {
      console.log('✅ Token is valid');
    } else {
      console.log('❌ Token is invalid or expired');
    }
  });
} else {
  console.log('WordPress Auto-Refresh Tool');
  console.log('==========================');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/wordpress-auto-refresh.mjs --setup    # Setup auto-refresh');
  console.log('  node scripts/wordpress-auto-refresh.mjs --test     # Test current token');
  console.log('');
  console.log('This tool automatically refreshes WordPress API tokens');
  console.log('when they expire, providing a permanent solution for');
  console.log('cross-publishing blog posts.');
}

export default WordPressAutoRefresh;
