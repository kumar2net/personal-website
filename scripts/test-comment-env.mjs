#!/usr/bin/env node

/**
 * Test Comment System Environment Variables
 * 
 * This script tests the comment system environment variables
 * and verifies the Netlify API connection.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || 'kumarsite';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

console.log('🧪 Testing Comment System Environment Variables\n');

// Test 1: Check required variables
console.log('📋 Environment Variables Check:');
console.log(`   NETLIFY_ACCESS_TOKEN: ${NETLIFY_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
console.log(`   NETLIFY_SITE_ID: ${NETLIFY_SITE_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`   ALLOWED_ORIGINS: ${ALLOWED_ORIGINS ? '✅ Set' : '⚠️  Optional'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '⚠️  Not set'}\n`);

if (!NETLIFY_ACCESS_TOKEN) {
  console.error('❌ NETLIFY_ACCESS_TOKEN is required!');
  console.log('   Please add it to your Netlify site environment variables.');
  process.exit(1);
}

// Test 2: Test Netlify API connection
console.log('🔗 Testing Netlify API Connection:');
try {
  const response = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
    headers: {
      'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const siteData = await response.json();
    console.log(`   ✅ Connection successful!`);
    console.log(`   Site Name: ${siteData.name}`);
    console.log(`   Site URL: ${siteData.url}`);
    console.log(`   Site ID: ${siteData.id}`);
  } else {
    console.log(`   ❌ API Error: ${response.status} ${response.statusText}`);
  }
} catch (error) {
  console.log(`   ❌ Connection failed: ${error.message}`);
}

// Test 3: Test forms access
console.log('\n📝 Testing Forms Access:');
try {
  const response = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms`, {
    headers: {
      'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const forms = await response.json();
    console.log(`   ✅ Forms access successful!`);
    console.log(`   Total forms: ${forms.length}`);
    
    const blogCommentsForm = forms.find(form => form.name === 'blog-comments');
    if (blogCommentsForm) {
      console.log(`   ✅ blog-comments form found (ID: ${blogCommentsForm.id})`);
    } else {
      console.log(`   ⚠️  blog-comments form not found`);
      console.log(`   Available forms: ${forms.map(f => f.name).join(', ')}`);
    }
  } else {
    console.log(`   ❌ Forms API Error: ${response.status} ${response.statusText}`);
  }
} catch (error) {
  console.log(`   ❌ Forms access failed: ${error.message}`);
}

// Test 4: Test comment function endpoint
console.log('\n💬 Testing Comment Function:');
try {
  const response = await fetch('https://kumarsite.netlify.app/.netlify/functions/get-comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      postSlug: 'common-sense-rare-commodity',
      formName: 'blog-comments'
    })
  });

  if (response.ok) {
    const data = await response.json();
    console.log(`   ✅ Comment function working!`);
    console.log(`   Comments found: ${data.total || 0}`);
    console.log(`   Success: ${data.success}`);
  } else {
    console.log(`   ❌ Comment function error: ${response.status} ${response.statusText}`);
  }
} catch (error) {
  console.log(`   ❌ Comment function failed: ${error.message}`);
}

console.log('\n🎉 Environment test completed!');
console.log('\n📚 Next steps:');
console.log('   1. If any tests failed, check your environment variables');
console.log('   2. Run: npm run fetch:comments (to test build-time fetching)');
console.log('   3. Visit your blog post to test the comment system');
