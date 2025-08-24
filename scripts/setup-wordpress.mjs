#!/usr/bin/env node

import readline from 'readline';
import { execSync } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('WordPress Auto-Publishing Setup');
console.log('==============================');
console.log('');

console.log('This script will help you set up WordPress auto-publishing.');
console.log('');

// Check if token is already set
const currentToken = process.env.WORDPRESS_API_TOKEN;
if (currentToken) {
  console.log('✅ WORDPRESS_API_TOKEN is already set');
  console.log('Token preview:', currentToken.substring(0, 10) + '...');
  console.log('');
} else {
  console.log('❌ WORDPRESS_API_TOKEN is not set');
  console.log('');
}

console.log('Options:');
console.log('1. Set/Update API Token');
console.log('2. Test content extraction (no token needed)');
console.log('3. Test WordPress posting (requires token)');
console.log('4. Run full setup');
console.log('');

rl.question('Choose an option (1-4): ', async (choice) => {
  switch (choice) {
    case '1':
      await setToken();
      break;
    case '2':
      await testExtraction();
      break;
    case '3':
      await testPosting();
      break;
    case '4':
      await fullSetup();
      break;
    default:
      console.log('Invalid choice. Please run the script again.');
  }
  rl.close();
});

async function setToken() {
  console.log('\n🔑 Setting up WordPress API Token');
  console.log('==================================');
  console.log('');
  
  console.log('If you don\'t have a token yet, run:');
  console.log('npm run wordpress:token');
  console.log('');
  
  rl.question('Enter your WordPress API token: ', (token) => {
    if (!token.trim()) {
      console.log('❌ Token cannot be empty');
      return;
    }
    
    console.log('\n✅ Token received!');
    console.log('Token preview:', token.substring(0, 10) + '...');
    console.log('');
    
    console.log('🔧 To use this token:');
    console.log('');
    console.log('1. For this session:');
    console.log(`   export WORDPRESS_API_TOKEN="${token}"`);
    console.log('');
    console.log('2. For permanent use, add to your shell profile (~/.zshrc or ~/.bashrc):');
    console.log(`   export WORDPRESS_API_TOKEN="${token}"`);
    console.log('');
    console.log('3. For GitHub Actions, add as repository secret:');
    console.log('   WORDPRESS_API_TOKEN = ' + token);
    console.log('');
    console.log('4. For Netlify, add as environment variable:');
    console.log('   WORDPRESS_API_TOKEN = ' + token);
    console.log('');
    
    console.log('Would you like to test the token now? (y/n): ');
    rl.question('', (answer) => {
      if (answer.toLowerCase() === 'y') {
        process.env.WORDPRESS_API_TOKEN = token;
        testPosting();
      }
    });
  });
}

async function testExtraction() {
  console.log('\n📝 Testing content extraction...');
  console.log('This will show what content would be posted to WordPress');
  console.log('');
  
  try {
    execSync('npm run crosspost:extract', { stdio: 'inherit' });
  } catch (error) {
    console.log('❌ Error testing extraction');
  }
}

async function testPosting() {
  console.log('\n🚀 Testing WordPress posting...');
  console.log('This will attempt to post a blog to WordPress.com');
  console.log('');
  
  if (!process.env.WORDPRESS_API_TOKEN) {
    console.log('❌ WORDPRESS_API_TOKEN is not set');
    console.log('Please set it first or choose option 1');
    return;
  }
  
  try {
    execSync('npm run crosspost:test', { stdio: 'inherit' });
  } catch (error) {
    console.log('❌ Error testing posting');
  }
}

async function fullSetup() {
  console.log('\n🔄 Running full setup...');
  console.log('');
  
  // Step 1: Get token if not set
  if (!process.env.WORDPRESS_API_TOKEN) {
    console.log('Step 1: Getting API token...');
    await setToken();
    return; // The setToken function will handle the rest
  }
  
  // Step 2: Test extraction
  console.log('Step 2: Testing content extraction...');
  await testExtraction();
  
  // Step 3: Test posting
  console.log('\nStep 3: Testing WordPress posting...');
  await testPosting();
  
  console.log('\n✅ Setup complete!');
  console.log('');
  console.log('🎉 Your WordPress auto-publishing is now configured!');
  console.log('');
  console.log('Next time you push a blog post to GitHub, it will automatically');
  console.log('be published to your WordPress.com site.');
}

