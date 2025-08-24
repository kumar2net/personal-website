#!/usr/bin/env node

import fetch from 'node-fetch';

// Configuration
const API_URL = process.env.NETLIFY_URL 
  ? `${process.env.NETLIFY_URL}/.netlify/functions/blog-interactions`
  : 'http://localhost:8888/.netlify/functions/blog-interactions';

const TEST_POST_ID = 'test-post-persistence';

async function testAPI(action, data = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script',
      },
      body: JSON.stringify({
        postId: TEST_POST_ID,
        action,
        ...data
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error testing ${action}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing Blog Interactions Persistence\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Get initial likes
  console.log('1. Getting initial likes...');
  let result = await testAPI('get-likes');
  console.log(`   Initial likes: ${result?.totalLikes || 0}`);
  const initialLikes = result?.totalLikes || 0;

  // Test 2: Add a like
  console.log('\n2. Adding a like...');
  result = await testAPI('like');
  console.log(`   Success: ${result?.success}`);
  console.log(`   Total likes: ${result?.totalLikes}`);

  // Test 3: Get likes again (should be incremented)
  console.log('\n3. Verifying like was persisted...');
  result = await testAPI('get-likes');
  console.log(`   Current likes: ${result?.totalLikes}`);
  if (result?.totalLikes > initialLikes) {
    console.log('   ✅ Like was persisted!');
  } else {
    console.log('   ❌ Like was not persisted');
  }

  // Test 4: Get initial comments
  console.log('\n4. Getting initial comments...');
  result = await testAPI('get-comments');
  console.log(`   Initial comments: ${result?.totalComments || 0}`);
  const initialComments = result?.totalComments || 0;

  // Test 5: Add a comment
  console.log('\n5. Adding a test comment...');
  const testComment = {
    content: `Test comment at ${new Date().toISOString()}`,
    author: 'Test Script'
  };
  result = await testAPI('add-comment', testComment);
  console.log(`   Success: ${result?.success}`);
  console.log(`   Total comments: ${result?.totalComments}`);
  const commentId = result?.comment?.id;

  // Test 6: Get comments again (should include new comment)
  console.log('\n6. Verifying comment was persisted...');
  result = await testAPI('get-comments');
  console.log(`   Current comments: ${result?.totalComments}`);
  const foundComment = result?.comments?.find(c => c.id === commentId);
  if (foundComment) {
    console.log('   ✅ Comment was persisted!');
    console.log(`   Comment: "${foundComment.content}" by ${foundComment.author}`);
  } else {
    console.log('   ❌ Comment was not persisted');
  }

  // Test 7: Delete the test comment (cleanup)
  if (commentId) {
    console.log('\n7. Cleaning up test comment...');
    result = await testAPI('delete-comment', { commentId });
    console.log(`   Success: ${result?.success}`);
    console.log(`   Remaining comments: ${result?.totalComments}`);
  }

  console.log('\n✨ Persistence test complete!');
  console.log('\nNOTE: If running locally, make sure to run "netlify dev" instead of "npm run dev"');
  console.log('      to test the actual Netlify Functions with Blobs storage.\n');
}

// Run tests
runTests().catch(console.error);