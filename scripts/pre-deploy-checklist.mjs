#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log(
  '🚀 PRE-DEPLOYMENT CHECKLIST - Ensuring Quality Before Deployment\n'
);

console.log('🚨 MANDATORY: Before deployment, you MUST:');
console.log('   1. Open Chrome DevTools (F12)');
console.log('   2. Navigate to latest blog post: http://localhost:5173/blog/sobering-week-august-2025');
console.log('   3. Check Console tab for ANY errors');
console.log('   4. Verify zero JavaScript errors before proceeding');
console.log('   5. Test on mobile Chrome browser\n');

const checklistResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  critical: 0,
};

function logChecklistItem(item, status, details = '') {
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
  const critical = item.includes('CRITICAL') ? '🔥 ' : '';
  console.log(
    `   ${emoji} ${critical}${item}${details ? ` - ${details}` : ''}`
  );

  checklistResults.total++;
  if (status === 'PASS') {
    checklistResults.passed++;
    if (item.includes('CRITICAL')) {
      checklistResults.critical++;
    }
  } else if (status === 'FAIL') {
    checklistResults.failed++;
  } else {
    checklistResults.skipped++;
  }
}

function runCommand(command, _description) {
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

// Function to get the latest blog post URL
function getLatestBlogPostUrl() {
  try {
    const blogContent = fs.readFileSync('src/pages/Blog.jsx', 'utf8');
    const blogPostsMatch = blogContent.match(/const blogPosts = \[([\s\S]*?)\];/);
    
    if (blogPostsMatch) {
      const blogPostsStr = blogPostsMatch[1];
      // Find the first link in the blogPosts array (latest post)
      const linkMatch = blogPostsStr.match(/link: '([^']+)'/);
      if (linkMatch) {
        return `http://localhost:5173${linkMatch[1]}`;
      }
    }
  } catch (error) {
    console.warn('Could not parse latest blog post:', error.message);
  }
  
  // Fallback to known latest post
  return 'http://localhost:5173/blog/sobering-week-august-2025';
}

// 1. CRITICAL CHECKS
function runCriticalChecks() {
  console.log('\n🔥 CRITICAL CHECKS (Must Pass)');
  console.log('='.repeat(50));

  // Check if all critical files exist
  const criticalFiles = [
    'src/App.jsx',
    'package.json',
    'vite.config.js',
    'netlify.toml',
  ];

  criticalFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      logChecklistItem(`CRITICAL: ${file} exists`, 'PASS');
    } else {
      logChecklistItem(`CRITICAL: ${file} exists`, 'FAIL', 'File missing');
    }
  });



  // Check build process
  const buildResult = runCommand('npm run build', 'Build process');
  logChecklistItem(
    'CRITICAL: Build process',
    buildResult.success ? 'PASS' : 'FAIL',
    buildResult.success ? 'Build successful' : buildResult.output
  );
}

// 2. UNIT TESTS
function runUnitTestChecks() {
  console.log('\n📋 UNIT TEST CHECKS');
  console.log('='.repeat(50));

  // Run unit tests
  const unitTestResult = runCommand('npm run test:unit', 'Unit tests');
  logChecklistItem('Unit tests pass', unitTestResult.success ? 'PASS' : 'FAIL');

  // Check component functionality
  const componentsToCheck = [
    { path: 'src/App.jsx', name: 'App component' },
    { path: 'src/pages/Blog.jsx', name: 'Blog component' },
  ];

  componentsToCheck.forEach((component) => {
    if (fs.existsSync(component.path)) {
      const content = fs.readFileSync(component.path, 'utf8');
      const hasReactImports =
        content.includes('import React') || 
        content.includes("from 'react'") ||
        content.includes("from 'react-router-dom'") ||
        content.includes("from 'framer-motion'") ||
        content.includes('export default');
      logChecklistItem(
        `${component.name} structure`,
        hasReactImports ? 'PASS' : 'FAIL'
      );
    } else {
      logChecklistItem(
        `${component.name} structure`,
        'FAIL',
        'Component not found'
      );
    }
  });
}

// 3. E2E TESTS
function runE2EChecks() {
  console.log('\n🌐 E2E TEST CHECKS');
  console.log('='.repeat(50));

  // Check if dev server is running
  const devServerTest = runCommand(
    'curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/',
    'Dev server'
  );
  if (devServerTest.success && devServerTest.output.includes('200')) {
    logChecklistItem('Dev server running', 'PASS');

    // Test critical pages
    const latestBlogPostUrl = getLatestBlogPostUrl();
    const pagesToTest = [
      { url: 'http://localhost:5173/', name: 'Home page' },
      { url: 'http://localhost:5173/blog', name: 'Blog page' },
      { url: 'http://localhost:5173/contact', name: 'Contact page' },
      {
        url: latestBlogPostUrl,
        name: 'Latest blog post',
      },
      {
        url: 'http://localhost:5173/blog/habit',
        name: 'Blog post with Disqus',
      },
    ];

    pagesToTest.forEach((page) => {
      const pageTest = runCommand(
        `curl -s -o /dev/null -w "%{http_code}" ${page.url}`,
        page.name
      );
      logChecklistItem(
        `${page.name} loads`,
        pageTest.success && pageTest.output.includes('200') ? 'PASS' : 'FAIL'
      );
    });
  } else {
    logChecklistItem(
      'Dev server running',
      'SKIP',
      'Dev server not running - run npm run dev first'
    );
  }
}

// 4. PERFORMANCE CHECKS
function runPerformanceChecks() {
  console.log('\n⚡ PERFORMANCE CHECKS');
  console.log('='.repeat(50));

  // Check bundle size
  const distPath = 'dist';
  if (fs.existsSync(distPath)) {
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      const jsFiles = fs
        .readdirSync(assetsPath)
        .filter((file) => file.endsWith('.js'));
      let totalSize = 0;

      jsFiles.forEach((file) => {
        const filePath = path.join(assetsPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });

      const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
      const isAcceptable = totalSize < 3 * 1024 * 1024; // 3MB limit

      logChecklistItem(
        'Bundle size acceptable',
        isAcceptable ? 'PASS' : 'FAIL',
        `${sizeInMB}MB`
      );
    }
  }

  // Check lazy loading
  const hasLazyLoading =
    fs.existsSync('src/components/DisqusComments.jsx') &&
    fs
      .readFileSync('src/components/DisqusComments.jsx', 'utf8')
      .includes('IntersectionObserver');
  logChecklistItem(
    'Lazy loading implemented',
    hasLazyLoading ? 'PASS' : 'FAIL'
  );
}

// 5. SECURITY CHECKS
function runSecurityChecks() {
  console.log('\n🔒 SECURITY CHECKS');
  console.log('='.repeat(50));

  // Check for hardcoded secrets
  const filesToCheck = ['src/App.jsx', 'src/pages/Blog.jsx', 'package.json'];
  let hasSecrets = false;

  filesToCheck.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (
        content.includes('password=') ||
        content.includes('secret=') ||
        content.includes('token=') ||
        content.includes('api_key=') ||
        content.includes('private_key=')
      ) {
        hasSecrets = true;
      }
    }
  });

  logChecklistItem('No hardcoded secrets', !hasSecrets ? 'PASS' : 'FAIL');

  // Check HTTPS URLs
  const hasHTTPS =
    fs.existsSync('src/App.jsx') &&
    fs.readFileSync('src/App.jsx', 'utf8').includes('https://');
  logChecklistItem('HTTPS URLs used', hasHTTPS ? 'PASS' : 'SKIP');
}

// 6. ACCESSIBILITY CHECKS
function runAccessibilityChecks() {
  console.log('\n♿ ACCESSIBILITY CHECKS');
  console.log('='.repeat(50));

  // Check alt text for images
  const blogDir = 'src/pages/blog';
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith('.jsx'));
    let totalImages = 0;
    let imagesWithAlt = 0;

    blogFiles.forEach((file) => {
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const imageMatches = content.match(/<img[^>]*>/g) || [];
      totalImages += imageMatches.length;

      imageMatches.forEach((img) => {
        if (img.includes('alt=')) {
          imagesWithAlt++;
        }
      });
    });

    const altTextRatio = totalImages > 0 ? imagesWithAlt / totalImages : 1;
    logChecklistItem(
      'Image alt text coverage',
      altTextRatio >= 0.8 ? 'PASS' : 'FAIL',
      `${imagesWithAlt}/${totalImages} images (${Math.round(altTextRatio * 100)}%)`
    );
  }

  // Check semantic HTML
  const hasSemanticHTML =
    fs.existsSync('src/App.jsx') &&
    /<nav|<main|<section|<article|<header|<footer/.test(
      fs.readFileSync('src/App.jsx', 'utf8')
    );
  logChecklistItem('Semantic HTML usage', hasSemanticHTML ? 'PASS' : 'FAIL');
}

// 7. DEPLOYMENT READINESS
function runDeploymentReadinessChecks() {
  console.log('\n🚀 DEPLOYMENT READINESS CHECKS');
  console.log('='.repeat(50));

  // Check git status
  const gitStatus = runCommand('git status --porcelain', 'Git status');
  const hasUncommittedChanges =
    gitStatus.success && gitStatus.output.trim() !== '';
  logChecklistItem(
    'All changes committed',
    !hasUncommittedChanges ? 'PASS' : 'FAIL',
    hasUncommittedChanges
      ? 'Uncommitted changes detected'
      : 'All changes committed'
  );

  // Check if on main branch
  const gitBranch = runCommand('git branch --show-current', 'Git branch');
  const isOnMainBranch =
    gitBranch.success && gitBranch.output.trim() === 'main';
  logChecklistItem(
    'On main branch',
    isOnMainBranch ? 'PASS' : 'FAIL',
    isOnMainBranch ? 'On main branch' : `On branch: ${gitBranch.output.trim()}`
  );

  // Check Netlify configuration
  const hasNetlifyConfig = fs.existsSync('netlify.toml');
  logChecklistItem('Netlify configuration', hasNetlifyConfig ? 'PASS' : 'FAIL');

  // Check environment variables (if any)
  const hasEnvFile = fs.existsSync('.env') || fs.existsSync('.env.local');
  logChecklistItem(
    'Environment variables',
    hasEnvFile ? 'PASS' : 'SKIP',
    hasEnvFile ? 'Environment file found' : 'No environment file needed'
  );
}

// Main checklist runner
function runPreDeploymentChecklist() {
  console.log('🚀 Starting Pre-Deployment Checklist\n');

  runCriticalChecks();
  runUnitTestChecks();
  runE2EChecks();
  runPerformanceChecks();
  runSecurityChecks();
  runAccessibilityChecks();
  runDeploymentReadinessChecks();

  // Generate summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 PRE-DEPLOYMENT CHECKLIST SUMMARY');
  console.log('='.repeat(60));

  console.log(`\n📈 Results:`);
  console.log(`   Total Checks: ${checklistResults.total}`);
  console.log(`   ✅ Passed: ${checklistResults.passed}`);
  console.log(`   ❌ Failed: ${checklistResults.failed}`);
  console.log(`   ⏭️  Skipped: ${checklistResults.skipped}`);
  console.log(`   🔥 Critical Passed: ${checklistResults.critical}`);
  console.log(
    `   📊 Success Rate: ${Math.round((checklistResults.passed / checklistResults.total) * 100)}%`
  );

  // Determine deployment readiness
  const criticalFailures = checklistResults.failed > 0;
  const allCriticalPassed = checklistResults.critical >= 5; // Minimum critical checks

  console.log(
    `\n🎯 Deployment Status: ${!criticalFailures && allCriticalPassed ? '✅ READY FOR DEPLOYMENT' : '❌ NOT READY FOR DEPLOYMENT'}`
  );

  if (criticalFailures) {
    console.log('\n⚠️  CRITICAL ISSUES DETECTED:');
    console.log('   - Fix all failed checks before deployment');
    console.log('   - Review critical issues first');
    console.log('   - Re-run checklist after fixes');
    process.exit(1);
  } else if (!allCriticalPassed) {
    console.log('\n⚠️  CRITICAL CHECKS INCOMPLETE:');
    console.log('   - Ensure all critical checks pass');
    console.log('   - Review skipped critical items');
    process.exit(1);
  } else {
    console.log('\n🎉 DEPLOYMENT APPROVED!');
    console.log('   - All critical checks passed');
    console.log('   - Quality standards met');
    console.log('   - Ready for production deployment');
  }

  console.log('\n📝 Next Steps:');
  if (!criticalFailures && allCriticalPassed) {
    console.log('   1. Deploy to production');
    console.log('   2. Monitor deployment');
    console.log('   3. Verify live site functionality');
    console.log('   4. Test on different devices/browsers');
  } else {
    console.log('   1. Fix failed checks');
    console.log('   2. Address critical issues');
    console.log('   3. Re-run checklist');
    console.log('   4. Deploy only when all checks pass');
  }

  console.log('\n🔗 Useful Commands:');
  console.log('   npm run test:all        - Run all tests');
  console.log('   npm run test:pre-deploy - Run pre-deployment tests');
  console.log('   npm run build           - Build for production');
  console.log('   git add . && git commit -m "message" && git push');
}

// Run the pre-deployment checklist
runPreDeploymentChecklist();
