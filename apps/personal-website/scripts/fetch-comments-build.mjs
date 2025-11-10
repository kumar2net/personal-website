#!/usr/bin/env node

/**
 * Build-Time Comment Fetcher
 * 
 * This script fetches comments from Netlify Forms during build time
 * and generates a static JSON file with all comments for each blog post.
 * This enables static site generation with pre-loaded comments.
 * 
 * Usage:
 *   npm run fetch:comments
 *   node scripts/fetch-comments-build.mjs
 * 
 * Environment Variables Required:
 *   - NETLIFY_ACCESS_TOKEN: Your Netlify personal access token
 *   - NETLIFY_SITE_ID: Your Netlify site ID (defaults to 'kumarsite')
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || 'kumarsite';
const FORM_NAME = 'blog-comments';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'comments.json');

// Blog posts configuration - add your blog post slugs here
const BLOG_POSTS = [
  'common-sense-rare-commodity',
  'acronym-soup',
  'devastated-by-young-girls-demise',
  'global-economic-concerns-2025',
  'compare',
  'marketnewsfetch',
  'kumblogtipsaug3',
  'semantic-search-explained',
  'tnpdcl-automated-meter-reading',
  'sobering-week-august-2025'
];

/**
 * Fetches all forms from Netlify API
 */
async function fetchForms() {
  const response = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms`, {
    headers: {
      'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch forms: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Fetches submissions for a specific form
 */
async function fetchSubmissions(formId) {
  const response = await fetch(`https://api.netlify.com/api/v1/forms/${formId}/submissions`, {
    headers: {
      'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch submissions: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Sanitizes and validates comment data
 */
function sanitizeComment(submission) {
  const data = submission.data;
  
  // Basic validation
  if (!data.name || !data.comment) {
    return null;
  }
  
  // Sanitize content
  const sanitized = {
    id: submission.id,
    name: data.name.trim().substring(0, 100),
    email: data.email ? data.email.trim() : null,
    comment: data.comment.trim().substring(0, 2000),
    timestamp: submission.created_at,
    postSlug: data['post-slug'] || data['postSlug'] || data['post_id'] || data['postId'],
    approved: submission.state === 'received' || submission.state === 'approved',
    spam: submission.state === 'spam' || submission.state === 'blacklisted'
  };
  
  // Additional validation
  if (sanitized.comment.length < 3 || sanitized.name.length < 2) {
    return null;
  }
  
  // Basic spam detection
  const spamPatterns = [
    /https?:\/\/[^\s]+/gi,
    /[A-Z]{5,}/g,
    /(.)\1{4,}/g,
    /(buy|sell|click|free|offer|deal|discount|promo)/gi
  ];
  
  const isSpam = spamPatterns.some(pattern => 
    pattern.test(sanitized.comment) || pattern.test(sanitized.name)
  );
  
  if (isSpam) {
    sanitized.spam = true;
  }
  
  return sanitized;
}

/**
 * Groups comments by postSlug
 */
function groupCommentsByPost(comments) {
  const grouped = {};
  
  comments.forEach(comment => {
    if (!comment.postSlug) return;
    
    if (!grouped[comment.postSlug]) {
      grouped[comment.postSlug] = [];
    }
    
    grouped[comment.postSlug].push(comment);
  });
  
  // Sort comments by timestamp (newest first)
  Object.keys(grouped).forEach(postSlug => {
    grouped[postSlug].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  });
  
  return grouped;
}

/**
 * Main function to fetch and process comments
 */
async function fetchCommentsForBuild() {
  console.log('🚀 Starting build-time comment fetching...');
  
  if (!NETLIFY_ACCESS_TOKEN) {
    console.error('❌ NETLIFY_ACCESS_TOKEN environment variable is required');
    process.exit(1);
  }
  
  try {
    // Fetch forms
    console.log('📋 Fetching forms...');
    const forms = await fetchForms();
    console.log(`✅ Found ${forms.length} forms`);
    
    // Find the blog-comments form
    const targetForm = forms.find(form => form.name === FORM_NAME);
    if (!targetForm) {
      console.error(`❌ Form '${FORM_NAME}' not found`);
      console.log('Available forms:', forms.map(f => f.name));
      process.exit(1);
    }
    
    console.log(`✅ Found form '${FORM_NAME}' with ID: ${targetForm.id}`);
    
    // Fetch submissions
    console.log('📝 Fetching submissions...');
    const submissions = await fetchSubmissions(targetForm.id);
    console.log(`✅ Found ${submissions.length} total submissions`);
    
    // Process and sanitize comments
    console.log('🔍 Processing comments...');
    const processedComments = submissions
      .map(submission => sanitizeComment(submission))
      .filter(comment => {
        if (!comment) return false;
        
        // Only include approved, non-spam comments
        return comment.approved && !comment.spam;
      });
    
    console.log(`✅ Processed ${processedComments.length} valid comments`);
    
    // Group comments by post
    const groupedComments = groupCommentsByPost(processedComments);
    
    // Add empty arrays for posts with no comments
    BLOG_POSTS.forEach(postSlug => {
      if (!groupedComments[postSlug]) {
        groupedComments[postSlug] = [];
      }
    });
    
    // Create output data structure
    const outputData = {
      generatedAt: new Date().toISOString(),
      totalComments: processedComments.length,
      postsWithComments: Object.keys(groupedComments).filter(slug => groupedComments[slug].length > 0).length,
      comments: groupedComments,
      metadata: {
        formName: FORM_NAME,
        siteId: NETLIFY_SITE_ID,
        buildTime: Date.now()
      }
    };
    
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Write to file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    
    console.log('✅ Comments data written to:', OUTPUT_FILE);
    console.log(`📊 Summary:`);
    console.log(`   - Total comments: ${outputData.totalComments}`);
    console.log(`   - Posts with comments: ${outputData.postsWithComments}`);
    console.log(`   - Total posts: ${BLOG_POSTS.length}`);
    
    // Log comments per post
    Object.entries(groupedComments).forEach(([postSlug, comments]) => {
      if (comments.length > 0) {
        console.log(`   - ${postSlug}: ${comments.length} comments`);
      }
    });
    
    console.log('🎉 Build-time comment fetching completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fetching comments:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchCommentsForBuild();
}

export { fetchCommentsForBuild, groupCommentsByPost, sanitizeComment };
