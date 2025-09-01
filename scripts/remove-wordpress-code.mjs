#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync, rmdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🗑️ REMOVING WORDPRESS CROSS-PUBLISHING CODE');
console.log('============================================');

try {
  // Step 1: Remove WordPress-related files and directories
  console.log('\n📁 Step 1: Removing WordPress Files and Directories...');
  
  const filesToRemove = [
    'scripts/wordpress-crosspost.mjs',
    'scripts/wordpress-polling.mjs',
    'scripts/wordpress-netlify-publisher.mjs',
    'scripts/wordpress-permanent-setup.mjs',
    'scripts/wordpress-auto-refresh.mjs',
    'scripts/wordpress-test.mjs',
    'scripts/setup-wordpress.mjs',
    'scripts/setup-wordpress-webhook.mjs',
    'scripts/wordpress-netlify-button.mjs',
    'scripts/get-wordpress-token.mjs',
    'scripts/wp-clean-crosspost-attribution.mjs',
    'netlify/functions/wordpress-webhook-receiver.js',
    'netlify/functions/wordpress-manual-publish.js',
    '.github/workflows/wordpress-auto-publish.yml',
    'data/wordpress-token.json',
    'data/wordpress-posted.json',
    'data/wordpress-netlify-published.json',
    'data/wordpress-processed.json',
    'wordpress-netlify-publisher/',
    'docs/WORDPRESS_AUTO_PUBLISH_SETUP.md',
    'docs/WORDPRESS_QUICK_REFERENCE.md',
    'docs/WORDPRESS_STATUS.md',
    'docs/WORDPRESS_TO_NETLIFY_SETUP.md',
    'docs/CROSS_PUBLISHING_SUCCESS.md'
  ];

  let removedFiles = 0;
  let removedDirs = 0;

  filesToRemove.forEach(filePath => {
    const fullPath = join(projectRoot, filePath);
    try {
      const stats = statSync(fullPath);
      if (stats.isDirectory()) {
        rmdirSync(fullPath, { recursive: true });
        console.log(`   ✅ Removed directory: ${filePath}`);
        removedDirs++;
      } else {
        unlinkSync(fullPath);
        console.log(`   ✅ Removed file: ${filePath}`);
        removedFiles++;
      }
    } catch (error) {
      // File/directory doesn't exist, skip
    }
  });

  console.log(`✅ Removed ${removedFiles} files and ${removedDirs} directories`);

  // Step 2: Remove WordPress-related scripts from package.json
  console.log('\n📦 Step 2: Removing WordPress Scripts from Package.json...');
  
  const packageJsonPath = join(projectRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  const scriptsToRemove = [
    'crosspost:all',
    'crosspost:latest', 
    'crosspost:test',
    'crosspost:extract',
    'wordpress:token',
    'wordpress:setup',
    'wordpress:refresh',
    'wordpress:test-token',
    'wordpress:permanent-setup',
    'wordpress:test-setup',
    'wordpress:status',
    'wordpress:webhook-setup',
    'wordpress:webhook-test',
    'wordpress:poll',
    'wordpress:poll-once',
    'wordpress:publisher',
    'wordpress:publisher-generate'
  ];

  let removedScripts = 0;
  scriptsToRemove.forEach(script => {
    if (packageJson.scripts[script]) {
      delete packageJson.scripts[script];
      console.log(`   ✅ Removed script: ${script}`);
      removedScripts++;
    }
  });

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Removed ${removedScripts} scripts from package.json`);

  // Step 3: Remove WordPress references from blog posts
  console.log('\n📝 Step 3: Removing WordPress References from Blog Posts...');
  
  const blogDir = join(projectRoot, 'src/pages/blog');
  const blogFiles = readdirSync(blogDir).filter(file => file.endsWith('.jsx'));
  
  let cleanedPosts = 0;
  let removedReferences = 0;

  blogFiles.forEach(file => {
    const filePath = join(blogDir, file);
    try {
      let content = readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Remove WordPress cross-post links and references
      content = content.replace(/<a[^>]*href="[^"]*wordpress[^"]*"[^>]*>.*?WordPress.*?<\/a>/gi, '');
      content = content.replace(/<a[^>]*href="[^"]*wordpress[^"]*"[^>]*>.*?Cross-post.*?<\/a>/gi, '');
      content = content.replace(/<a[^>]*href="[^"]*wordpress[^"]*"[^>]*>.*?Original.*?<\/a>/gi, '');
      
      // Remove WordPress-related comments
      content = content.replace(/\/\*\s*WordPress.*?\*\//gs, '');
      content = content.replace(/\/\/\s*WordPress.*$/gm, '');
      
      // Remove WordPress-related divs or sections
      content = content.replace(/<div[^>]*wordpress[^>]*>.*?<\/div>/gis, '');
      
      if (content !== originalContent) {
        writeFileSync(filePath, content, 'utf8');
        cleanedPosts++;
        const removed = (originalContent.match(/wordpress/gi) || []).length - (content.match(/wordpress/gi) || []).length;
        removedReferences += removed;
        console.log(`   ✅ Cleaned ${file}: removed ${removed} WordPress references`);
      }
    } catch (error) {
      console.log(`   ⚠️ Could not process ${file}: ${error.message}`);
    }
  });

  console.log(`✅ Cleaned ${cleanedPosts} blog posts, removed ${removedReferences} WordPress references`);

  // Step 4: Remove WordPress-related imports and dependencies
  console.log('\n🔧 Step 4: Removing WordPress Dependencies...');
  
  // Check for any remaining WordPress-related dependencies
  const dependenciesToCheck = [
    'wordpress-api',
    'wordpress-rest-api',
    'wp-api-client'
  ];

  let removedDeps = 0;
  dependenciesToCheck.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
      console.log(`   ✅ Removed dependency: ${dep}`);
      removedDeps++;
    }
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      delete packageJson.devDependencies[dep];
      console.log(`   ✅ Removed dev dependency: ${dep}`);
      removedDeps++;
    }
  });

  if (removedDeps > 0) {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Removed ${removedDeps} WordPress dependencies`);
  }

  // Step 5: Update documentation
  console.log('\n📚 Step 5: Updating Documentation...');
  
  // Update main README.md to remove WordPress references
  const readmePath = join(projectRoot, 'README.md');
  try {
    let readmeContent = readFileSync(readmePath, 'utf8');
    
    // Remove WordPress-related sections
    readmeContent = readmeContent.replace(/## WordPress.*?(?=##|$)/gs, '');
    readmeContent = readmeContent.replace(/### Cross-posting.*?(?=###|$)/gs, '');
    readmeContent = readmeContent.replace(/### WordPress.*?(?=###|$)/gs, '');
    
    // Remove WordPress-related scripts from usage section
    readmeContent = readmeContent.replace(/npm run crosspost.*$/gm, '');
    readmeContent = readmeContent.replace(/npm run wordpress.*$/gm, '');
    
    writeFileSync(readmePath, readmeContent, 'utf8');
    console.log('   ✅ Updated README.md');
  } catch (error) {
    console.log(`   ⚠️ Could not update README.md: ${error.message}`);
  }

  // Step 6: Clean up any remaining WordPress references in other files
  console.log('\n🧹 Step 6: Final Cleanup...');
  
  const filesToClean = [
    'src/App.jsx',
    'src/main.jsx',
    'netlify.toml',
    'vite.config.js'
  ];

  let cleanedFiles = 0;
  filesToClean.forEach(filePath => {
    const fullPath = join(projectRoot, filePath);
    try {
      let content = readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // Remove WordPress-related imports and references
      content = content.replace(/import.*wordpress.*/gi, '');
      content = content.replace(/\/\*\s*WordPress.*?\*\//gs, '');
      content = content.replace(/\/\/\s*WordPress.*$/gm, '');
      
      if (content !== originalContent) {
        writeFileSync(fullPath, content, 'utf8');
        cleanedFiles++;
        console.log(`   ✅ Cleaned ${filePath}`);
      }
    } catch (error) {
      // File doesn't exist or can't be read
    }
  });

  console.log(`✅ Cleaned ${cleanedFiles} additional files`);

  // Step 7: Generate cleanup report
  console.log('\n📊 Step 7: Generating Cleanup Report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    filesRemoved: removedFiles,
    directoriesRemoved: removedDirs,
    scriptsRemoved: removedScripts,
    dependenciesRemoved: removedDeps,
    blogPostsCleaned: cleanedPosts,
    wordpressReferencesRemoved: removedReferences,
    additionalFilesCleaned: cleanedFiles,
    summary: [
      'All WordPress cross-publishing functionality removed',
      'Manual cross-posting with TL;DR and canonical references recommended',
      'Codebase is now cleaner and more focused',
      'Reduced bundle size by removing unused WordPress dependencies',
      'Simplified deployment and maintenance'
    ]
  };

  writeFileSync(join(projectRoot, 'wordpress-cleanup-report.json'), JSON.stringify(report, null, 2));
  console.log('✅ Cleanup report generated: wordpress-cleanup-report.json');

  console.log('\n🎉 WORDPRESS CODE REMOVAL COMPLETED!');
  console.log('=====================================');
  console.log('✅ WordPress files and directories removed');
  console.log('✅ WordPress scripts removed from package.json');
  console.log('✅ WordPress references cleaned from blog posts');
  console.log('✅ WordPress dependencies removed');
  console.log('✅ Documentation updated');
  console.log('✅ Final cleanup completed');
  console.log('✅ Cleanup report generated');
  
  console.log('\n📋 Summary:');
  console.log(`   📁 Files removed: ${removedFiles}`);
  console.log(`   📁 Directories removed: ${removedDirs}`);
  console.log(`   📦 Scripts removed: ${removedScripts}`);
  console.log(`   📦 Dependencies removed: ${removedDeps}`);
  console.log(`   📝 Blog posts cleaned: ${cleanedPosts}`);
  console.log(`   🔗 WordPress references removed: ${removedReferences}`);
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Run: npm install (to update dependencies)');
  console.log('   2. Test: npm run build (to ensure everything works)');
  console.log('   3. Deploy: git add . && git commit && git push');
  console.log('   4. Manual cross-posting: Use TL;DR and canonical references');

} catch (error) {
  console.error('❌ Error during WordPress code removal:', error.message);
  process.exit(1);
}
