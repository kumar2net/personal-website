#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressPermanentSetup {
  constructor() {
    this.tokenFile = path.join(__dirname, '../data/wordpress-token.json');
    this.clientId = '123358';
    this.clientSecret = 'plvGijZrEy4aJufDwINk4saoeApzmvzRWmonQ9tykXeQecDSSbG7BqlxVP87zAqm';
    this.redirectUri = 'https://kumarsite.netlify.app/';
    this.apiBase = 'https://public-api.wordpress.com/rest/v1.1';
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

  async generateInitialToken() {
    console.log('🔐 WordPress Permanent Token Setup');
    console.log('==================================');
    console.log('');
    console.log('This will create a permanent solution for WordPress cross-publishing.');
    console.log('You only need to do this ONCE, and the system will automatically');
    console.log('refresh tokens when they expire.');
    console.log('');
    
    const proceed = await this.question('Proceed with setup? (y/N): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      await this.close();
      return;
    }

    console.log('');
    console.log('Step 1: Authorize the application');
    console.log('Visit this URL in your browser:');
    console.log('');
    console.log(`https://public-api.wordpress.com/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=code&scope=global`);
    console.log('');
    console.log('Step 2: After authorization, you will be redirected to a URL like:');
    console.log('https://kumarsite.netlify.app/?code=AUTHORIZATION_CODE');
    console.log('');
    console.log('Step 3: Copy the authorization code from the URL and paste it below.');
    console.log('');

    const authCode = await this.question('Enter the authorization code: ');
    
    if (!authCode) {
      console.log('❌ No authorization code provided.');
      await this.close();
      return;
    }

    try {
      console.log('🔄 Exchanging authorization code for tokens...');
      
      // Clean the authorization code (remove &state part if present)
      const cleanAuthCode = authCode.split('&')[0];
      
      const response = await fetch('https://public-api.wordpress.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code: cleanAuthCode,
          redirect_uri: this.redirectUri
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
      }

      const tokenData = await response.json();
      
      // Save the token with refresh token
      await this.saveToken(tokenData);
      
      console.log('✅ Initial token generated successfully!');
      console.log('🔄 The system will now automatically refresh this token when needed.');
      console.log('');
      console.log('Next steps:');
      console.log('1. The token is saved locally and will be used automatically');
      console.log('2. When the token expires (30 days), it will be refreshed automatically');
      console.log('3. You can test the setup with: npm run wordpress:test-token');
      console.log('4. Cross-publish your latest blog with: npm run crosspost:latest');
      
    } catch (error) {
      console.error('❌ Failed to generate token:', error.message);
    }

    await this.close();
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
    console.log('💾 Token saved to:', this.tokenFile);
  }

  async testSetup() {
    console.log('🧪 Testing WordPress Setup');
    console.log('==========================');
    
    try {
      const data = await fs.readFile(this.tokenFile, 'utf-8');
      const tokenData = JSON.parse(data);
      
      console.log('✅ Token file found');
      console.log(`📅 Token created: ${new Date(tokenData.createdAt).toLocaleDateString()}`);
      
      // Test the token
      const response = await fetch(`${this.apiBase}/sites/kumar2net.wordpress.com/posts`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Token is valid and working!');
        console.log('🚀 Ready for cross-publishing blog posts.');
      } else {
        console.log('⚠️  Token may be expired, but refresh should work automatically.');
      }
      
    } catch (error) {
      console.log('❌ No token file found or setup incomplete.');
      console.log('Run: npm run wordpress:permanent-setup');
    }
  }

  async showStatus() {
    console.log('📊 WordPress Setup Status');
    console.log('========================');
    
    try {
      const data = await fs.readFile(this.tokenFile, 'utf-8');
      const tokenData = JSON.parse(data);
      
      const tokenAge = Date.now() - tokenData.createdAt;
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const daysRemaining = Math.max(0, Math.floor((thirtyDays - tokenAge) / (24 * 60 * 60 * 1000)));
      
      console.log('✅ Token file exists');
      console.log(`📅 Created: ${new Date(tokenData.createdAt).toLocaleDateString()}`);
      console.log(`⏰ Days remaining: ${daysRemaining}`);
      console.log(`🔄 Refresh token: ${tokenData.refresh_token ? 'Available' : 'Not available'}`);
      
      if (daysRemaining < 7) {
        console.log('⚠️  Token will expire soon. Refresh will happen automatically.');
      } else {
        console.log('✅ Token is fresh and ready to use.');
      }
      
    } catch (error) {
      console.log('❌ No token file found');
      console.log('Run: npm run wordpress:permanent-setup');
    }
  }
}

// CLI usage
const setup = new WordPressPermanentSetup();

if (process.argv[2] === '--setup') {
  setup.generateInitialToken();
} else if (process.argv[2] === '--test') {
  setup.testSetup().then(() => setup.close());
} else if (process.argv[2] === '--status') {
  setup.showStatus().then(() => setup.close());
} else {
  console.log('WordPress Permanent Setup Tool');
  console.log('==============================');
  console.log('');
  console.log('This tool provides a PERMANENT solution for WordPress cross-publishing.');
  console.log('Once set up, you never need to manually generate tokens again!');
  console.log('');
  console.log('Usage:');
  console.log('  npm run wordpress:permanent-setup    # Initial setup (ONE TIME ONLY)');
  console.log('  npm run wordpress:test-setup         # Test the setup');
  console.log('  npm run wordpress:status             # Check token status');
  console.log('');
  console.log('Benefits:');
  console.log('✅ No more manual token generation');
  console.log('✅ Automatic token refresh when expired');
  console.log('✅ Works with GitHub Actions and Netlify');
  console.log('✅ Permanent solution for cross-publishing');
  console.log('');
  console.log('After setup, use:');
  console.log('  npm run crosspost:latest             # Publish latest blog');
  console.log('  npm run crosspost:all                # Publish all blogs');
  console.log('');
  setup.close();
}

export default WordPressPermanentSetup;
