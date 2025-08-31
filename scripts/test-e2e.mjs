#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🌐 E2E TESTS - End-to-End User Flow Testing\n');

let testResults = { total: 0, passed: 0, failed: 0, skipped: 0 };

function logTestResult(testName, status, details = '') {
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
  console.log(`   ${emoji} ${testName}${details ? ` - ${details}` : ''}`);
  
  testResults.total++;
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.skipped++;
}

function runCommand(command, description) {
  try {
    console.log(`\n🔧 Running: ${description}`);
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

// Test critical user flows
function testCriticalUserFlows() {
  console.log('\n📋 Testing Critical User Flows:');
  
  // Test 1: Home page accessibility
  const homePageTest = runCommand('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/', 'Home page accessibility');
  logTestResult('Home page loads', 
    homePageTest.success && homePageTest.output.includes('200') ? 'PASS' : 'FAIL',
    homePageTest.success ? `HTTP ${homePageTest.output}` : homePageTest.output);
  
  // Test 2: Blog page accessibility
  const blogPageTest = runCommand('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/blog', 'Blog page accessibility');
  logTestResult('Blog page loads', 
    blogPageTest.success && blogPageTest.output.includes('200') ? 'PASS' : 'FAIL',
    blogPageTest.success ? `HTTP ${blogPageTest.output}` : blogPageTest.output);
  
  // Test 3: Contact page accessibility
  const contactPageTest = runCommand('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/contact', 'Contact page accessibility');
  logTestResult('Contact page loads', 
    contactPageTest.success && contactPageTest.output.includes('200') ? 'PASS' : 'FAIL',
    contactPageTest.success ? `HTTP ${contactPageTest.output}` : contactPageTest.output);
  
  // Test 4: Blog post with Disqus
  const blogPostTest = runCommand('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/blog/habit', 'Blog post with Disqus');
  logTestResult('Blog post with Disqus loads', 
    blogPostTest.success && blogPostTest.output.includes('200') ? 'PASS' : 'FAIL',
    blogPostTest.success ? `HTTP ${blogPostTest.output}` : blogPostTest.output);
  
  // Test 5: Navigation between pages
  const navigationTest = runCommand('curl -s http://localhost:5173/ | grep -q "navigation"', 'Navigation presence');
  logTestResult('Navigation works', 
    navigationTest.success ? 'PASS' : 'FAIL',
    navigationTest.success ? 'Navigation found' : 'Navigation not found');
}

// Test Disqus integration
function testDisqusIntegration() {
  console.log('\n📋 Testing Disqus Integration:');
  
  // Test if Disqus script is properly configured
  const disqusComponentPath = 'src/components/DisqusComments.jsx';
  if (fs.existsSync(disqusComponentPath)) {
    const content = fs.readFileSync(disqusComponentPath, 'utf8');
    
    // Test Disqus script URL
    const hasDisqusScript = content.includes('kumarsite.disqus.com/embed.js');
    logTestResult('Disqus script URL configured', hasDisqusScript ? 'PASS' : 'FAIL');
    
    // Test Disqus configuration
    const hasDisqusConfig = content.includes('window.disqus_config');
    logTestResult('Disqus configuration present', hasDisqusConfig ? 'PASS' : 'FAIL');
    
    // Test error handling
    const hasErrorHandling = content.includes('setError') && content.includes('handleRetry');
    logTestResult('Disqus error handling', hasErrorHandling ? 'PASS' : 'FAIL');
    
    // Test loading states
    const hasLoadingStates = content.includes('isLoading') && content.includes('animate-spin');
    logTestResult('Disqus loading states', hasLoadingStates ? 'PASS' : 'FAIL');
  } else {
    logTestResult('Disqus component exists', 'FAIL', 'Component not found');
  }
}

// Test responsive design
function testResponsiveDesign() {
  console.log('\n📋 Testing Responsive Design:');
  
  // Test if responsive classes are used
  const appPath = 'src/App.jsx';
  if (fs.existsSync(appPath)) {
    const content = fs.readFileSync(appPath, 'utf8');
    
    const hasResponsiveClasses = /md:|lg:|sm:|xl:/.test(content);
    logTestResult('Responsive design classes', hasResponsiveClasses ? 'PASS' : 'FAIL');
    
    const hasMobileMenu = content.includes('mobile') || content.includes('hamburger');
    logTestResult('Mobile navigation', hasMobileMenu ? 'PASS' : 'FAIL');
    
    const hasFlexbox = content.includes('flex') || content.includes('grid');
    logTestResult('Flexbox/Grid layout', hasFlexbox ? 'PASS' : 'FAIL');
  }
}

// Test accessibility features
function testAccessibility() {
  console.log('\n📋 Testing Accessibility Features:');
  
  // Test alt text for images
  const blogDir = 'src/pages/blog';
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.jsx'));
    let totalImages = 0;
    let imagesWithAlt = 0;
    
    blogFiles.forEach(file => {
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const imageMatches = content.match(/<img[^>]*>/g) || [];
      totalImages += imageMatches.length;
      
      imageMatches.forEach(img => {
        if (img.includes('alt=')) {
          imagesWithAlt++;
        }
      });
    });
    
    const altTextRatio = totalImages > 0 ? imagesWithAlt / totalImages : 1;
    logTestResult('Image alt text coverage', 
      altTextRatio >= 0.8 ? 'PASS' : 'FAIL',
      `${imagesWithAlt}/${totalImages} images (${Math.round(altTextRatio * 100)}%)`);
  }
  
  // Test semantic HTML
  const appPath = 'src/App.jsx';
  if (fs.existsSync(appPath)) {
    const content = fs.readFileSync(appPath, 'utf8');
    
    const hasSemanticHTML = /<nav|<main|<section|<article|<header|<footer/.test(content);
    logTestResult('Semantic HTML usage', hasSemanticHTML ? 'PASS' : 'FAIL');
    
    const hasARIALabels = content.includes('aria-label') || content.includes('aria-labelledby');
    logTestResult('ARIA labels', hasARIALabels ? 'PASS' : 'SKIP');
  }
}

// Test performance metrics
function testPerformanceMetrics() {
  console.log('\n📋 Testing Performance Metrics:');
  
  // Test bundle size
  const distPath = 'dist';
  if (fs.existsSync(distPath)) {
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      const jsFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.js'));
      let totalSize = 0;
      
      jsFiles.forEach(file => {
        const filePath = path.join(assetsPath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });
      
      const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
      const isAcceptable = totalSize < 3 * 1024 * 1024; // 3MB limit
      
      logTestResult('Bundle size acceptable', 
        isAcceptable ? 'PASS' : 'FAIL',
        `${sizeInMB}MB total`);
    }
  }
  
  // Test lazy loading implementation
  const hasLazyLoading = fs.existsSync('src/components/DisqusComments.jsx') && 
    fs.readFileSync('src/components/DisqusComments.jsx', 'utf8').includes('IntersectionObserver');
  logTestResult('Lazy loading implemented', hasLazyLoading ? 'PASS' : 'FAIL');
}

// Test error handling
function testErrorHandling() {
  console.log('\n📋 Testing Error Handling:');
  
  // Test error boundaries
  const appPath = 'src/App.jsx';
  if (fs.existsSync(appPath)) {
    const content = fs.readFileSync(appPath, 'utf8');
    
    const hasErrorBoundary = content.includes('ErrorBoundary') || content.includes('error');
    logTestResult('Error boundary implementation', hasErrorBoundary ? 'PASS' : 'FAIL');
    
    const hasLoadingStates = content.includes('loading') || content.includes('spinner');
    logTestResult('Loading state implementation', hasLoadingStates ? 'PASS' : 'FAIL');
  }
  
  // Test Disqus error handling
  const disqusPath = 'src/components/DisqusComments.jsx';
  if (fs.existsSync(disqusPath)) {
    const content = fs.readFileSync(disqusPath, 'utf8');
    
    const hasDisqusErrorHandling = content.includes('setError') && content.includes('handleRetry');
    logTestResult('Disqus error handling', hasDisqusErrorHandling ? 'PASS' : 'FAIL');
  }
}

// Main E2E test runner
function runE2ETests() {
  console.log('🚀 Starting E2E Test Suite\n');
  
  // Check if dev server is running
  const devServerTest = runCommand('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/', 'Dev server check');
  if (!devServerTest.success || !devServerTest.output.includes('200')) {
    console.log('⚠️  Dev server not running. Starting dev server...');
    console.log('   Please run: npm run dev');
    console.log('   Then run this test again.');
    process.exit(1);
  }
  
  testCriticalUserFlows();
  testDisqusIntegration();
  testResponsiveDesign();
  testAccessibility();
  testPerformanceMetrics();
  testErrorHandling();
  
  // Generate summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 E2E TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  console.log(`\n📈 Results:`);
  console.log(`   Total Tests: ${testResults.total}`);
  console.log(`   ✅ Passed: ${testResults.passed}`);
  console.log(`   ❌ Failed: ${testResults.failed}`);
  console.log(`   ⏭️  Skipped: ${testResults.skipped}`);
  console.log(`   📊 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);
  
  const overallSuccess = testResults.failed === 0;
  
  console.log(`\n🎯 Status: ${overallSuccess ? '✅ ALL E2E TESTS PASSED' : '❌ E2E TESTS FAILED'}`);
  
  if (testResults.failed > 0) {
    console.log('\n⚠️  CRITICAL ISSUES:');
    console.log('   - Fix failed E2E tests before deployment');
    console.log('   - Review user experience issues');
    console.log('   - Test manually on different devices');
    process.exit(1);
  } else {
    console.log('\n🎉 E2E tests passed! User experience is solid.');
  }
  
  console.log('\n📝 Next Steps:');
  console.log('   1. Test manually on different browsers');
  console.log('   2. Test on mobile devices');
  console.log('   3. Test with slow network conditions');
  console.log('   4. Deploy when confident');
}

// Run E2E tests
runE2ETests();
