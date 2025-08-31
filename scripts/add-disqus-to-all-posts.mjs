#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

console.log('🚀 Adding Disqus to All Blog Posts\n');

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
  return `${filename.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} - Kumar's Blog`;
}

function addDisqusToBlogPost(filePath) {
  console.log(`\n📝 Processing: ${path.basename(filePath)}`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already has Disqus
  if (content.includes('DisqusComments')) {
    console.log('   ⏭️  Already has Disqus, skipping...');
    return;
  }

  // Extract post information
  const postId = extractPostId(path.basename(filePath), content);
  const postUrl = generatePostUrl(postId);
  const postTitle = extractPostTitle(content);

  console.log(`   📍 Post ID: ${postId}`);
  console.log(`   🔗 URL: ${postUrl}`);

  // Add import if not present
  if (!content.includes('import DisqusComments')) {
    // Find the last import statement
    const importMatch = content.match(/(import.*from.*['"];?\s*)/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      const disqusImport =
        "import DisqusComments from '../../components/DisqusComments';";
      content = content.replace(lastImport, `${lastImport}\n${disqusImport}`);
    } else {
      // Add at the beginning if no imports found
      content = `${disqusImport}\n${content}`;
    }
  }

  // Add Disqus component before the closing component tag
  const disqusComponent = `
      {/* Blog interactions */}
      <DisqusComments 
        postId="${postId}"
        postUrl="${postUrl}"
        postTitle="${postTitle}"
      />
    </motion.div>`;

  // Replace the closing motion.div with our new structure
  content = content.replace(
    /<\/motion\.div>\s*\);\s*};?\s*export default/,
    `${disqusComponent}\n  );\n};\n\nexport default`
  );

  // Write updated content
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('   ✅ Disqus added successfully');
}

function addDisqusToAllBlogPosts() {
  const blogDir = 'src/pages/blog';
  const blogFiles = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.jsx'));

  let totalFiles = 0;
  let processedFiles = 0;
  let skippedFiles = 0;

  blogFiles.forEach((file) => {
    totalFiles++;
    const filePath = path.join(blogDir, file);

    try {
      addDisqusToBlogPost(filePath);
      processedFiles++;
    } catch (error) {
      console.log(`   ❌ Error processing ${file}: ${error.message}`);
      skippedFiles++;
    }
  });

  console.log(`\n${'='.repeat(50)}`);
  console.log('🎉 Disqus Integration Summary:');
  console.log(`   📊 Total files: ${totalFiles}`);
  console.log(`   ✅ Processed: ${processedFiles}`);
  console.log(`   ⏭️  Skipped: ${skippedFiles}`);

  if (processedFiles > 0) {
    console.log('\n📋 Next Steps:');
    console.log('   1. Test on development server: npm run dev');
    console.log('   2. Verify Disqus loads on blog posts');
    console.log('   3. Test click functionality');
    console.log('   4. Deploy to production when ready');
  }
}

// Run the script
addDisqusToAllBlogPosts();
