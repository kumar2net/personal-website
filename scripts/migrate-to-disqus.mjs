#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/pages/blog');

// Get all blog post files
function getBlogFiles() {
  const files = fs.readdirSync(BLOG_DIR);
  return files.filter(file => file.endsWith('.jsx'));
}

// Get blog files that actually have BlogInteractions
function getBlogFilesWithInteractions() {
  const allFiles = getBlogFiles();
  const filesWithInteractions = [];
  
  for (const file of allFiles) {
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('BlogInteractions')) {
      filesWithInteractions.push(file);
    }
  }
  
  // Sort by modification time (newest first) and take last 5
  const filesWithStats = filesWithInteractions.map(file => {
    const filePath = path.join(BLOG_DIR, file);
    const stats = fs.statSync(filePath);
    return { file, mtime: stats.mtime };
  });
  
  const sortedFiles = filesWithStats
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 5)
    .map(item => item.file);
  
  return sortedFiles;
}

// Extract post ID from filename or content
function extractPostId(filename, content) {
  // Try to find postId in existing BlogInteractions usage
  const postIdMatch = content.match(/postId="([^"]+)"/);
  if (postIdMatch) {
    return postIdMatch[1];
  }
  
  // Fallback to filename without extension
  return filename.replace('.jsx', '');
}

// Generate canonical URL for the post
function generatePostUrl(postId) {
  return `https://kumarsite.netlify.app/blog/${postId}`;
}

// Generate post title from content
function extractPostTitle(content) {
  // Try to find h1 title
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (h1Match) {
    return h1Match[1] + ' - Kumar\'s Blog';
  }
  
  // Fallback to postId
  return `${postId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Kumar's Blog`;
}

// Migrate a single blog post
function migrateBlogPost(filePath) {
  console.log(`\n📝 Migrating: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already migrated
  if (content.includes('DisqusComments')) {
    console.log('   ⏭️  Already migrated, skipping...');
    return;
  }
  
  // Extract post ID
  const postId = extractPostId(path.basename(filePath), content);
  const postUrl = generatePostUrl(postId);
  const postTitle = extractPostTitle(content);
  
  console.log(`   📍 Post ID: ${postId}`);
  console.log(`   🔗 URL: ${postUrl}`);
  
  // Replace import
  content = content.replace(
    /import BlogInteractions from '\.\.\/\.\.\/components\/BlogInteractions';/g,
    "import DisqusComments from '../../components/DisqusComments';"
  );
  
  // Replace component usage
  content = content.replace(
    /<BlogInteractions[^>]*\/>/g,
    `<DisqusComments 
        postId="${postId}"
        postUrl="${postUrl}"
        postTitle="${postTitle}"
      />`
  );
  
  // Handle cases with props
  content = content.replace(
    /<BlogInteractions([^>]*)\/>/g,
    (match, props) => {
      // Extract postId from props if present
      const propMatch = props.match(/postId="([^"]+)"/);
      const finalPostId = propMatch ? propMatch[1] : postId;
      const finalPostUrl = generatePostUrl(finalPostId);
      const finalPostTitle = extractPostTitle(content);
      
      return `<DisqusComments 
        postId="${finalPostId}"
        postUrl="${finalPostUrl}"
        postTitle="${finalPostTitle}"
      />`;
    }
  );
  
  // Write updated content
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('   ✅ Migration completed');
}

// Main migration function
function migrateAllBlogPosts() {
  console.log('🚀 Starting Disqus Migration (Last 5 Posts Only)\n');
  
  const blogFiles = getBlogFilesWithInteractions();
  console.log(`📁 Found ${blogFiles.length} blog post files with BlogInteractions`);
  
  let migrated = 0;
  let skipped = 0;
  
  for (const file of blogFiles) {
    const filePath = path.join(BLOG_DIR, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('BlogInteractions')) {
        migrateBlogPost(filePath);
        migrated++;
      } else {
        console.log(`\n⏭️  Skipping ${file} - no BlogInteractions found`);
        skipped++;
      }
    } catch (error) {
      console.error(`\n❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Migration Summary:`);
  console.log(`   ✅ Migrated: ${migrated} files`);
  console.log(`   ⏭️  Skipped: ${skipped} files`);
  console.log(`   📊 Total: ${blogFiles.length} files (last 5 with BlogInteractions)`);
  
  console.log(`\n📋 Next Steps:`);
  console.log(`   1. Update your Disqus shortname in DisqusComments.jsx`);
  console.log(`   2. Test the migration on a few posts`);
  console.log(`   3. Deploy to production`);
  console.log(`   4. Remove old test scripts and documentation`);
}

// Run migration
migrateAllBlogPosts();
