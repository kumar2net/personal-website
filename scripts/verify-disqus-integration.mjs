#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/pages/blog');
const COMPONENT_PATH = path.join(__dirname, '../src/components/DisqusComments.jsx');

console.log('🔍 Verifying Disqus Integration\n');

// Check if DisqusComments component exists
if (!fs.existsSync(COMPONENT_PATH)) {
  console.log('❌ DisqusComments.jsx component not found');
  process.exit(1);
}

// Check component configuration
const componentContent = fs.readFileSync(COMPONENT_PATH, 'utf8');
const hasCorrectShortname = componentContent.includes('kumarsite.disqus.com');
const hasLazyLoading = componentContent.includes('IntersectionObserver');
const hasLoadingState = componentContent.includes('Loading comments');

console.log('📋 Component Verification:');
console.log(`   ✅ Component exists: ${fs.existsSync(COMPONENT_PATH)}`);
console.log(`   ✅ Correct shortname: ${hasCorrectShortname}`);
console.log(`   ✅ Lazy loading: ${hasLazyLoading}`);
console.log(`   ✅ Loading state: ${hasLoadingState}`);

// Get all blog post files
const blogFiles = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.jsx'));

let totalPosts = 0;
let migratedPosts = 0;
let oldSystemPosts = 0;

console.log('\n📝 Blog Post Verification:');

for (const file of blogFiles) {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  totalPosts++;
  
  if (content.includes('DisqusComments')) {
    migratedPosts++;
    console.log(`   ✅ ${file} - Migrated to Disqus`);
  } else if (content.includes('BlogInteractions')) {
    oldSystemPosts++;
    console.log(`   ❌ ${file} - Still using old system`);
  } else {
    console.log(`   ⚪ ${file} - No comment system`);
  }
}

console.log('\n📊 Summary:');
console.log(`   📁 Total blog posts: ${totalPosts}`);
console.log(`   ✅ Migrated to Disqus: ${migratedPosts}`);
console.log(`   ❌ Old system remaining: ${oldSystemPosts}`);
console.log(`   ⚪ No comment system: ${totalPosts - migratedPosts - oldSystemPosts}`);

// Check for any remaining old system references
const hasOldSystem = oldSystemPosts > 0;
const hasOldComponents = fs.existsSync(path.join(__dirname, '../src/components/BlogInteractions.jsx'));
const hasOldFunctions = fs.existsSync(path.join(__dirname, '../netlify/functions/blog-interactions.js'));

console.log('\n🧹 Cleanup Status:');
console.log(`   ✅ Old component removed: ${!hasOldComponents}`);
console.log(`   ✅ Old function removed: ${!hasOldFunctions}`);
console.log(`   ✅ No old system references: ${!hasOldSystem}`);

// Final status
const isComplete = hasCorrectShortname && migratedPosts > 0 && !hasOldSystem && !hasOldComponents && !hasOldFunctions;

console.log('\n🎯 Integration Status:');
if (isComplete) {
  console.log('   ✅ DISQUS INTEGRATION COMPLETE AND SUCCESSFUL!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Test on development server: http://localhost:5174');
  console.log('   2. Visit a blog post to see Disqus in action');
  console.log('   3. Deploy to production when ready');
  console.log('   4. Configure moderation settings in Disqus admin');
} else {
  console.log('   ❌ Integration incomplete - please check the issues above');
  process.exit(1);
}

console.log('\n🔗 Disqus Admin Panel: https://kumarsite.disqus.com/admin/');
console.log('📚 Documentation: docs/DISQUS_SETUP_GUIDE.md');
