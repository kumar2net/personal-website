#!/usr/bin/env node

/**
 * Script to fetch comments from Netlify Forms and display them
 * This helps you see what users are commenting on your blog posts
 */

import { config } from 'dotenv';
config();

const NETLIFY_SITE_ID = 'kumarsite'; // Your Netlify site ID
const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;

if (!NETLIFY_ACCESS_TOKEN) {
  console.error('❌ NETLIFY_ACCESS_TOKEN environment variable is required');
  console.log('Get your token from: https://app.netlify.com/user/applications#personal-access-tokens');
  process.exit(1);
}

async function fetchComments() {
  try {
    console.log('🔍 Fetching comments from Netlify Forms...\n');
    
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const forms = await response.json();
    console.log(`📋 Found ${forms.length} forms:\n`);

    for (const form of forms) {
      console.log(`📝 Form: ${form.name}`);
      console.log(`   ID: ${form.id}`);
      console.log(`   Submissions: ${form.submission_count}`);
      
      if (form.submission_count > 0) {
        // Fetch submissions for this form
        const submissionsResponse = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
          headers: {
            'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });

        if (submissionsResponse.ok) {
          const submissions = await submissionsResponse.json();
          console.log(`   Recent submissions:`);
          
          submissions.slice(0, 3).forEach((submission, index) => {
            const data = submission.data;
            console.log(`   ${index + 1}. ${data.name || 'Anonymous'} - ${data.comment?.substring(0, 50)}...`);
            console.log(`      Posted: ${new Date(submission.created_at).toLocaleDateString()}`);
          });
        }
      }
      console.log('');
    }

    console.log('✅ Comments fetched successfully!');
    console.log('\n💡 To display these comments on your blog:');
    console.log('   1. The BlogComments component is already integrated');
    console.log('   2. Comments will be displayed when users click "Show Comments"');
    console.log('   3. New comments will appear after you approve them in Netlify');

  } catch (error) {
    console.error('❌ Error fetching comments:', error.message);
    process.exit(1);
  }
}

fetchComments();
