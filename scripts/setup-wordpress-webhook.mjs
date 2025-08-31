#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressWebhookSetup {
  constructor() {
    this.tokenFile = path.join(__dirname, '../data/wordpress-token.json');
    this.clientId = '123358';
    this.clientSecret =
      'plvGijZrEy4aJufDwINk4saoeApzmvzRWmonQ9tykXeQecDSSbG7BqlxVP87zAqm';
    this.redirectUri = 'https://kumarsite.netlify.app/';
    this.apiBase = 'https://public-api.wordpress.com/rest/v1.1';
    this.siteId = 'kumar2net.wordpress.com';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
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
            client_id: this.clientId,
            client_secret: this.clientSecret,
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

  async setupWebhook() {
    console.log('🔗 WordPress to Netlify Webhook Setup');
    console.log('====================================');
    console.log('');
    console.log('This will set up a webhook that automatically publishes');
    console.log('WordPress posts to your Netlify site.');
    console.log('');
    console.log('Prerequisites:');
    console.log('1. WordPress.com site: kumar2net.wordpress.com');
    console.log('2. Netlify site: kumarsite.netlify.app');
    console.log('3. Netlify function: wordpress-webhook-receiver');
    console.log('');

    const proceed = await this.question('Proceed with webhook setup? (y/N): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      await this.close();
      return;
    }

    // Get valid token
    const token = await this.getValidToken();
    if (!token) {
      console.log(
        '❌ No valid token available. Please run the permanent setup first:'
      );
      console.log('   npm run wordpress:permanent-setup');
      await this.close();
      return;
    }

    console.log('✅ Using valid token');

    // Set up webhook
    await this.createWebhook(token);

    await this.close();
  }

  async createWebhook(token) {
    try {
      console.log('');
      console.log('📡 Creating WordPress webhook...');

      const webhookUrl =
        'https://kumarsite.netlify.app/.netlify/functions/wordpress-webhook-receiver';

      // Note: WordPress.com doesn't have a direct webhook API, so we'll use a different approach
      // We'll set up a polling mechanism or use WordPress.com's REST API hooks

      console.log(
        "ℹ️  WordPress.com doesn't provide direct webhook creation via API."
      );
      console.log("   We'll use an alternative approach:");
      console.log('');
      console.log('Option 1: Manual Webhook Setup (Recommended)');
      console.log('===========================================');
      console.log('1. Go to your WordPress.com dashboard');
      console.log('2. Navigate to Settings > Webhooks (if available)');
      console.log('3. Add webhook with these settings:');
      console.log(`   - URL: ${webhookUrl}`);
      console.log('   - Events: post.published, post.updated');
      console.log('   - Method: POST');
      console.log('   - Content-Type: application/json');
      console.log('');

      console.log('Option 2: Automated Polling (Alternative)');
      console.log('=========================================');
      console.log('We can create a script that polls for new posts and');
      console.log('automatically converts them to JSX files.');
      console.log('');

      const option = await this.question('Choose option (1/2): ');

      if (option === '2') {
        await this.setupPolling(token);
      } else {
        console.log('');
        console.log('📋 Manual Setup Instructions:');
        console.log('============================');
        console.log('');
        console.log('1. WordPress.com Webhook Setup:');
        console.log(`   - Webhook URL: ${webhookUrl}`);
        console.log('   - Events: post.published, post.updated');
        console.log('   - Method: POST');
        console.log('   - Content-Type: application/json');
        console.log('');
        console.log('2. Test the webhook:');
        console.log('   - Create a test post on WordPress.com');
        console.log('   - Check Netlify function logs');
        console.log('   - Verify JSX file creation');
        console.log('');
        console.log('3. Environment Variables (for GitHub integration):');
        console.log('   - GITHUB_TOKEN: Your GitHub personal access token');
        console.log(
          '   - GITHUB_REPO: Your repository (format: username/repository)'
        );
        console.log('');
        console.log('✅ Webhook setup instructions provided!');
      }
    } catch (error) {
      console.error('❌ Webhook setup failed:', error);
    }
  }

  async setupPolling(_token) {
    console.log('');
    console.log('🔄 Setting up automated polling...');

    // Create polling script
    const pollingScript = `#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressPolling {
  constructor() {
    this.siteId = 'kumar2net.wordpress.com';
    this.apiBase = 'https://public-api.wordpress.com/rest/v1.1';
    this.tokenFile = path.join(__dirname, '../data/wordpress-token.json');
    this.processedFile = path.join(__dirname, '../data/wordpress-processed.json');
    this.pollingInterval = 5 * 60 * 1000; // 5 minutes
  }

  async getValidToken() {
    try {
      const tokenData = JSON.parse(await fs.readFile(this.tokenFile, 'utf8'));
      return tokenData.access_token;
    } catch (error) {
      console.error('❌ No token available');
      return null;
    }
  }

  async getProcessedPosts() {
    try {
      const data = await fs.readFile(this.processedFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async markAsProcessed(postId) {
    try {
      const processed = await this.getProcessedPosts();
      processed.push({
        id: postId,
        processed_at: new Date().toISOString()
      });
      await fs.writeFile(this.processedFile, JSON.stringify(processed, null, 2));
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
      
      const response = await fetch(\`\${this.apiBase}/sites/\${this.siteId}/posts?number=10&status=publish\`, {
        headers: {
          'Authorization': \`Bearer \${token}\`
        }
      });

      if (!response.ok) {
        throw new Error(\`API error: \${response.status}\`);
      }

      const posts = await response.json();
      const processed = await this.getProcessedPosts();
      const processedIds = processed.map(p => p.id);

      for (const post of posts.posts) {
        if (!processedIds.includes(post.ID)) {
          console.log(\`📝 Processing new post: \${post.title}\`);
          await this.processPost(post);
          await this.markAsProcessed(post.ID);
        }
      }

    } catch (error) {
      console.error('❌ Error checking for new posts:', error);
    }
  }

  async processPost(post) {
    try {
      // Call the webhook receiver function
      const webhookUrl = 'https://kumarsite.netlify.app/.netlify/functions/wordpress-webhook-receiver';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          post: post,
          site: { ID: this.siteId }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(\`✅ Successfully processed: \${post.title}\`);
        console.log(\`   File: \${result.filename}\`);
      } else {
        console.error(\`❌ Failed to process: \${post.title}\`);
      }

    } catch (error) {
      console.error('❌ Error processing post:', error);
    }
  }

  async startPolling() {
    console.log('🚀 Starting WordPress polling...');
    console.log(\`📡 Polling every \${this.pollingInterval / 1000 / 60} minutes\`);
    
    // Initial check
    await this.checkForNewPosts();
    
    // Set up interval
    setInterval(async () => {
      await this.checkForNewPosts();
    }, this.pollingInterval);
  }
}

// Start polling if run directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const poller = new WordPressPolling();
  poller.startPolling();
}

export default WordPressPolling;
`;

    const pollingPath = path.join(__dirname, 'wordpress-polling.mjs');
    await fs.writeFile(pollingPath, pollingScript);

    console.log('✅ Created polling script: scripts/wordpress-polling.mjs');
    console.log('');
    console.log('📋 To use the polling system:');
    console.log('1. Run: node scripts/wordpress-polling.mjs');
    console.log('2. The script will check for new posts every 5 minutes');
    console.log('3. New posts will be automatically converted to JSX');
    console.log('');
    console.log('💡 You can also add this to your package.json scripts:');
    console.log('   "wordpress:poll": "node scripts/wordpress-polling.mjs"');
    console.log('');
    console.log('✅ Polling setup complete!');
  }

  async testWebhook() {
    console.log('🧪 Testing webhook...');

    const webhookUrl =
      'https://kumarsite.netlify.app/.netlify/functions/wordpress-webhook-receiver';

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: {
            title: 'Test Post',
            content: '<p>This is a test post from WordPress.</p>',
            excerpt: 'Test excerpt',
            date: new Date().toISOString(),
            modified: new Date().toISOString(),
            slug: 'test-post',
            status: 'publish',
            categories: ['Test'],
            tags: ['test'],
            URL: 'https://kumar2net.wordpress.com/test-post',
          },
          site: { ID: this.siteId },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Webhook test successful!');
        console.log('Result:', result);
      } else {
        console.log('❌ Webhook test failed:', result);
      }
    } catch (error) {
      console.error('❌ Webhook test error:', error);
    }
  }
}

// Main execution
const setup = new WordPressWebhookSetup();

const command = process.argv[2];
if (command === '--test') {
  setup.testWebhook().then(() => setup.close());
} else {
  setup.setupWebhook();
}
