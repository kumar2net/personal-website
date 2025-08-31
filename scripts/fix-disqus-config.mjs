#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Disqus Configuration Issues\n');

function extractPostId(filename, content) {
  // Try to extract from filename first
  const nameFromFile = path.basename(filename, '.jsx');
  
  // Try to extract from content (look for postId in existing DisqusComments)
  const postIdMatch = content.match(/postId="([^"]+)"/);
  if (postIdMatch) {
    return postIdMatch[1];
  }
  
  return nameFromFile;
}

function generatePostUrl(postId) {
  return `https://kumarsite.netlify.app/blog/${postId}`;
}

function extractPostTitle(content) {
  // Try to extract title from content
  const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (titleMatch) {
    return `${titleMatch[1]} - Kumar's Blog`;
  }
  
  // Fallback to filename
  const filename = path.basename(content, '.jsx');
  return `${filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Kumar's Blog`;
}

function fixDisqusConfig(filePath) {
  console.log(`\n📝 Fixing: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if has import but no component usage
  const hasImport = content.includes('import DisqusComments');
  const hasComponent = content.includes('<DisqusComments');
  
  if (!hasImport) {
    console.log('   ⏭️  No Disqus import found, skipping...');
    return;
  }
  
  if (hasComponent) {
    console.log('   ✅ Already has Disqus component, skipping...');
    return;
  }
  
  // Extract post information
  const postId = extractPostId(path.basename(filePath), content);
  const postUrl = generatePostUrl(postId);
  const postTitle = extractPostTitle(content);
  
  console.log(`   📍 Post ID: ${postId}`);
  console.log(`   🔗 URL: ${postUrl}`);
  
  // Find the right place to insert Disqus component
  // Look for the closing div before the navigation section
  const disqusComponent = `
      {/* Blog interactions */}
      <DisqusComments 
        postId="${postId}"
        postUrl="${postUrl}"
        postTitle="${postTitle}"
      />

      <div className="mt-12 pt-8 border-t border-gray-200">`;
  
  // Replace the navigation section with our new structure
  content = content.replace(
    /<div className="mt-12 pt-8 border-t border-gray-200">/,
    disqusComponent
  );
  
  // Write updated content
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('   ✅ Disqus configuration fixed');
}

function fixAllDisqusConfigs() {
  const blogDir = 'src/pages/blog';
  const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.jsx'));
  
  let totalFiles = 0;
  let fixedFiles = 0;
  let skippedFiles = 0;
  
  blogFiles.forEach(file => {
    totalFiles++;
    const filePath = path.join(blogDir, file);
    
    try {
      fixDisqusConfig(filePath);
      fixedFiles++;
    } catch (error) {
      console.log(`   ❌ Error fixing ${file}: ${error.message}`);
      skippedFiles++;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Disqus Configuration Fix Summary:');
  console.log(`   📊 Total files: ${totalFiles}`);
  console.log(`   ✅ Fixed: ${fixedFiles}`);
  console.log(`   ⏭️  Skipped: ${skippedFiles}`);
  
  if (fixedFiles > 0) {
    console.log('\n📋 Next Steps:');
    console.log('   1. Run test script: node scripts/test-disqus-click.mjs');
    console.log('   2. Test on development server: npm run dev');
    console.log('   3. Verify Disqus loads on all blog posts');
    console.log('   4. Test click functionality');
  }
}

// Run the script
fixAllDisqusConfigs();
