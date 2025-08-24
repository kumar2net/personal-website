#!/usr/bin/env node

import readline from 'readline';
import fetch from 'node-fetch';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CLIENT_ID = '123358';
const CLIENT_SECRET = 'plvGijZrEy4aJufDwINk4saoeApzmvzRWmonQ9tykXeQecDSSbG7BqlxVP87zAqm';
const REDIRECT_URI = 'https://kumarsite.netlify.app/';

console.log('WordPress.com API Token Generator');
console.log('=================================');
console.log('');

console.log('Step 1: Authorize the application');
console.log('Visit this URL in your browser:');
console.log('');
console.log(`https://public-api.wordpress.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=global`);
console.log('');

console.log('Step 2: After authorization, you will be redirected to a URL like:');
console.log('https://kumarsite.netlify.app/?code=AUTHORIZATION_CODE');
console.log('');

console.log('Step 3: Copy the authorization code from the URL and paste it below.');
console.log('');

rl.question('Enter the authorization code: ', async (authCode) => {
  try {
    console.log('\nExchanging authorization code for access token...');
    
    const tokenResponse = await fetch('https://public-api.wordpress.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: REDIRECT_URI
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      console.error('❌ Error getting token:', tokenData);
      rl.close();
      return;
    }

    console.log('\n✅ Success! Your access token:');
    console.log('='.repeat(50));
    console.log(tokenData.access_token);
    console.log('='.repeat(50));
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Set this as your environment variable:');
    console.log(`   export WORDPRESS_API_TOKEN="${tokenData.access_token}"`);
    console.log('');
    console.log('2. Test the cross-posting:');
    console.log('   npm run crosspost:test');
    console.log('');
    console.log('3. For GitHub Actions, add this as a repository secret:');
    console.log('   WORDPRESS_API_TOKEN = ' + tokenData.access_token);
    console.log('');
    console.log('4. For Netlify, add this as an environment variable:');
    console.log('   WORDPRESS_API_TOKEN = ' + tokenData.access_token);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
});

