#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

console.log('📱 VIEWPORT & MOBILE RESPONSIVENESS TESTING\n');

const testResults = { total: 0, passed: 0, failed: 0, skipped: 0 };

function logTestResult(testName, status, details = '') {
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
  console.log(`   ${emoji} ${testName}${details ? ` - ${details}` : ''}`);

  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
  } else if (status === 'FAIL') {
    testResults.failed++;
  } else {
    testResults.skipped++;
  }
}

// Test viewport meta tags
function testViewportConfiguration() {
  console.log('\n📱 Testing Viewport Configuration:');

  const indexPath = 'index.html';
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');

    // Test viewport meta tag
    const hasViewportMeta = content.includes('viewport');
    logTestResult(
      'Viewport meta tag present',
      hasViewportMeta ? 'PASS' : 'FAIL'
    );

    // Test proper viewport configuration
    const hasProperViewport = content.includes(
      'width=device-width, initial-scale=1.0'
    );
    logTestResult(
      'Proper viewport configuration',
      hasProperViewport ? 'PASS' : 'FAIL'
    );

    // Test mobile-specific meta tags
    const hasMobileWebApp = content.includes('mobile-web-app-capable');
    logTestResult('Mobile web app capable', hasMobileWebApp ? 'PASS' : 'FAIL');

    const hasAppleMobileWebApp = content.includes(
      'apple-mobile-web-app-capable'
    );
    logTestResult(
      'Apple mobile web app capable',
      hasAppleMobileWebApp ? 'PASS' : 'FAIL'
    );

    // Test viewport-fit for notched devices
    const hasViewportFit = content.includes('viewport-fit=cover');
    logTestResult(
      'Viewport fit for notched devices',
      hasViewportFit ? 'PASS' : 'SKIP'
    );

    // Test user-scalable configuration
    const hasUserScalable = content.includes('user-scalable=no');
    logTestResult('User scalable disabled', hasUserScalable ? 'PASS' : 'SKIP');
  } else {
    logTestResult('index.html exists', 'FAIL', 'File not found');
  }
}

// Test mobile-specific CSS
function testMobileCSS() {
  console.log('\n📱 Testing Mobile CSS:');

  const indexPath = 'index.html';
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');

    // Test mobile-specific styles
    const hasMobileStyles = content.includes('mobile-fix');
    logTestResult(
      'Mobile-specific CSS present',
      hasMobileStyles ? 'PASS' : 'FAIL'
    );

    // Test overflow-x hidden
    const hasOverflowHidden = content.includes('overflow-x: hidden');
    logTestResult(
      'Horizontal overflow hidden',
      hasOverflowHidden ? 'PASS' : 'FAIL'
    );

    // Test webkit transforms for performance
    const hasWebkitTransforms = content.includes('-webkit-transform');
    logTestResult(
      'Webkit transforms for performance',
      hasWebkitTransforms ? 'PASS' : 'FAIL'
    );

    // Test backface visibility
    const hasBackfaceVisibility = content.includes('backface-visibility');
    logTestResult(
      'Backface visibility hidden',
      hasBackfaceVisibility ? 'PASS' : 'FAIL'
    );
  }
}

// Test ScrollToTop functionality
function testScrollToTop() {
  console.log('\n📱 Testing ScrollToTop Component:');

  const scrollToTopPath = 'src/components/ScrollToTop.jsx';
  if (fs.existsSync(scrollToTopPath)) {
    const content = fs.readFileSync(scrollToTopPath, 'utf8');

    // Test component exists
    logTestResult('ScrollToTop component exists', 'PASS');

    // Test scroll to top functionality
    const hasScrollToTop = content.includes('window.scrollTo');
    logTestResult(
      'Scroll to top functionality',
      hasScrollToTop ? 'PASS' : 'FAIL'
    );

    // Test proper scroll behavior
    const hasAutoBehavior = content.includes("behavior: 'auto'");
    logTestResult('Auto scroll behavior', hasAutoBehavior ? 'PASS' : 'FAIL');

    // Test location change detection
    const hasUseLocation = content.includes('useLocation');
    logTestResult(
      'Location change detection',
      hasUseLocation ? 'PASS' : 'FAIL'
    );

    // Test hash preservation
    const hasHashCheck = content.includes('hash');
    logTestResult('Hash preservation', hasHashCheck ? 'PASS' : 'FAIL');
  } else {
    logTestResult(
      'ScrollToTop component exists',
      'FAIL',
      'Component not found'
    );
  }
}

// Test App.jsx mobile handling
function testAppMobileHandling() {
  console.log('\n📱 Testing App.jsx Mobile Handling:');

  const appPath = 'src/App.jsx';
  if (fs.existsSync(appPath)) {
    const content = fs.readFileSync(appPath, 'utf8');

    // Test ScrollToTop import
    const hasScrollToTopImport = content.includes('ScrollToTop');
    logTestResult(
      'ScrollToTop imported',
      hasScrollToTopImport ? 'PASS' : 'FAIL'
    );

    // Test ScrollToTop usage
    const hasScrollToTopUsage = content.includes('<ScrollToTop />');
    logTestResult(
      'ScrollToTop used in App',
      hasScrollToTopUsage ? 'PASS' : 'FAIL'
    );

    // Test mobile menu state
    const hasMobileMenuState = content.includes('isMobileMenuOpen');
    logTestResult(
      'Mobile menu state management',
      hasMobileMenuState ? 'PASS' : 'FAIL'
    );

    // Test mobile menu toggle
    const hasMobileMenuToggle = content.includes('setIsMobileMenuOpen');
    logTestResult(
      'Mobile menu toggle functionality',
      hasMobileMenuToggle ? 'PASS' : 'FAIL'
    );
  } else {
    logTestResult('App.jsx exists', 'FAIL', 'File not found');
  }
}

// Test responsive design classes
function testResponsiveDesign() {
  console.log('\n📱 Testing Responsive Design Classes:');

  const appPath = 'src/App.jsx';
  if (fs.existsSync(appPath)) {
    const content = fs.readFileSync(appPath, 'utf8');

    // Test responsive breakpoint classes
    const hasResponsiveClasses = /md:|lg:|sm:|xl:/.test(content);
    logTestResult(
      'Responsive breakpoint classes',
      hasResponsiveClasses ? 'PASS' : 'FAIL'
    );

    // Test mobile-specific classes
    const hasMobileClasses =
      content.includes('mobile') || content.includes('sm:');
    logTestResult(
      'Mobile-specific classes',
      hasMobileClasses ? 'PASS' : 'FAIL'
    );

    // Test flexbox/grid layout
    const hasFlexboxGrid = content.includes('flex') || content.includes('grid');
    logTestResult('Flexbox/Grid layout', hasFlexboxGrid ? 'PASS' : 'FAIL');
  }
}

// Test main.jsx mobile handling
function testMainJSXMobileHandling() {
  console.log('\n📱 Testing main.jsx Mobile Handling:');

  const mainPath = 'src/main.jsx';
  if (fs.existsSync(mainPath)) {
    const content = fs.readFileSync(mainPath, 'utf8');

    // Test DOM ready handling
    const hasDOMReadyCheck = content.includes('document.readyState');
    logTestResult('DOM ready state check', hasDOMReadyCheck ? 'PASS' : 'FAIL');

    // Test DOMContentLoaded listener
    const hasDOMContentLoaded = content.includes('DOMContentLoaded');
    logTestResult(
      'DOMContentLoaded listener',
      hasDOMContentLoaded ? 'PASS' : 'FAIL'
    );

    // Test error handling
    const hasErrorHandling =
      content.includes('try') && content.includes('catch');
    logTestResult(
      'Error handling in main.jsx',
      hasErrorHandling ? 'PASS' : 'FAIL'
    );

    // Test root element check
    const hasRootElementCheck = content.includes("getElementById('root')");
    logTestResult(
      'Root element existence check',
      hasRootElementCheck ? 'PASS' : 'FAIL'
    );
  } else {
    logTestResult('main.jsx exists', 'FAIL', 'File not found');
  }
}

// Test blog post mobile responsiveness
function testBlogPostMobileResponsiveness() {
  console.log('\n📱 Testing Blog Post Mobile Responsiveness:');

  const blogDir = 'src/pages/blog';
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith('.jsx'));

    let totalPosts = 0;
    let postsWithResponsiveClasses = 0;
    let postsWithMobileOptimization = 0;

    blogFiles.forEach((file) => {
      totalPosts++;
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8');

      // Check for responsive classes
      if (/md:|lg:|sm:|xl:/.test(content)) {
        postsWithResponsiveClasses++;
      }

      // Check for mobile optimization
      if (
        content.includes('max-w-') ||
        content.includes('px-4') ||
        content.includes('py-')
      ) {
        postsWithMobileOptimization++;
      }
    });

    const responsiveRatio =
      totalPosts > 0 ? postsWithResponsiveClasses / totalPosts : 0;
    logTestResult(
      'Blog posts with responsive classes',
      responsiveRatio >= 0.8 ? 'PASS' : 'FAIL',
      `${postsWithResponsiveClasses}/${totalPosts} posts (${Math.round(responsiveRatio * 100)}%)`
    );

    const mobileOptimizationRatio =
      totalPosts > 0 ? postsWithMobileOptimization / totalPosts : 0;
    logTestResult(
      'Blog posts with mobile optimization',
      mobileOptimizationRatio >= 0.8 ? 'PASS' : 'FAIL',
      `${postsWithMobileOptimization}/${totalPosts} posts (${Math.round(mobileOptimizationRatio * 100)}%)`
    );
  }
}

// Test CSS output for mobile styles
function testCSSOutput() {
  console.log('\n📱 Testing CSS Output:');

  const outputCSSPath = 'src/output.css';
  if (fs.existsSync(outputCSSPath)) {
    const content = fs.readFileSync(outputCSSPath, 'utf8');

    // Test responsive utilities
    const hasResponsiveUtilities =
      content.includes('@media') ||
      content.includes('sm:') ||
      content.includes('md:');
    logTestResult(
      'Responsive utilities in CSS',
      hasResponsiveUtilities ? 'PASS' : 'FAIL'
    );

    // Test mobile-first approach
    const hasMobileFirst =
      content.includes('@media (min-width:') ||
      content.includes('@media (max-width:');
    logTestResult(
      'Mobile-first media queries',
      hasMobileFirst ? 'PASS' : 'SKIP'
    );

    // Test viewport units
    const hasViewportUnits = content.includes('vh') || content.includes('vw');
    logTestResult('Viewport units usage', hasViewportUnits ? 'PASS' : 'SKIP');
  } else {
    logTestResult(
      'output.css exists',
      'SKIP',
      'CSS file not found (may need build)'
    );
  }
}

// Main test runner
function runViewportMobileTests() {
  console.log('🚀 Starting Viewport & Mobile Responsiveness Tests\n');

  testViewportConfiguration();
  testMobileCSS();
  testScrollToTop();
  testAppMobileHandling();
  testResponsiveDesign();
  testMainJSXMobileHandling();
  testBlogPostMobileResponsiveness();
  testCSSOutput();

  // Generate summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 VIEWPORT & MOBILE TEST RESULTS SUMMARY');
  console.log('='.repeat(60));

  console.log(`\n📈 Results:`);
  console.log(`   Total Tests: ${testResults.total}`);
  console.log(`   ✅ Passed: ${testResults.passed}`);
  console.log(`   ❌ Failed: ${testResults.failed}`);
  console.log(`   ⏭️  Skipped: ${testResults.skipped}`);
  console.log(
    `   📊 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`
  );

  const overallSuccess = testResults.failed === 0;

  console.log(
    `\n🎯 Status: ${overallSuccess ? '✅ ALL MOBILE TESTS PASSED' : '❌ MOBILE TESTS FAILED'}`
  );

  if (testResults.failed > 0) {
    console.log('\n⚠️  MOBILE ISSUES DETECTED:');
    console.log('   - Fix mobile responsiveness issues');
    console.log('   - Ensure posts load from top on mobile');
    console.log('   - Test on actual mobile devices');
    process.exit(1);
  } else {
    console.log('\n🎉 Mobile responsiveness is excellent!');
    console.log('   - Posts will load from top on mobile devices');
    console.log('   - Viewport configuration is optimal');
    console.log('   - Responsive design is implemented');
    console.log('   - Mobile user experience is optimized');
  }

  console.log('\n📱 Mobile Testing Checklist:');
  console.log('   1. Test on actual mobile devices');
  console.log('   2. Verify posts load from top');
  console.log('   3. Check responsive breakpoints');
  console.log('   4. Test touch interactions');
  console.log('   5. Verify Disqus works on mobile');

  console.log('\n🔗 Test URLs:');
  console.log('   - Home: http://localhost:5173/');
  console.log('   - Blog: http://localhost:5173/blog');
  console.log('   - Test Post: http://localhost:5173/blog/habit');
}

// Run the viewport and mobile tests
runViewportMobileTests();
