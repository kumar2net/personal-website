#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 UNIT TESTS - Component & Functionality Testing\n');

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

function testComponent(componentPath, componentName, requiredFeatures) {
  console.log(`\n📋 Testing ${componentName}:`);

  if (!fs.existsSync(componentPath)) {
    logTestResult(`${componentName} exists`, 'FAIL', 'Component not found');
    return;
    return;
  }

  logTestResult(`${componentName} exists`, 'PASS');

  const content = fs.readFileSync(componentPath, 'utf8');

  requiredFeatures.forEach((feature) => {
    const hasFeature = feature.pattern.test(content);
    const status = hasFeature ? 'PASS' : feature.required ? 'FAIL' : 'SKIP';
    logTestResult(feature.name, status);
  });
}

// Test DisqusComments component
function testDisqusComponent() {
  const disqusFeatures = [
    { name: 'Error handling', pattern: /setError\(/, required: true },
    { name: 'Loading states', pattern: /isLoading/, required: true },
    { name: 'Retry functionality', pattern: /handleRetry/, required: true },
    {
      name: 'Script error handling',
      pattern: /script\.onerror/,
      required: true,
    },
    { name: 'Script load handling', pattern: /script\.onload/, required: true },
    {
      name: 'DISQUS reset functionality',
      pattern: /DISQUS\.reset/,
      required: true,
    },
    { name: 'Proper initialization', pattern: /setTimeout/, required: true },
    {
      name: 'Script management',
      pattern: /scriptRef\.current|script\.onload/,
      required: true,
    },
    {
      name: 'Intersection Observer',
      pattern: /IntersectionObserver/,
      required: true,
    },
    {
      name: 'React hooks usage',
      pattern: /useEffect|useState|useRef/,
      required: true,
    },
  ];

  testComponent(
    'src/components/DisqusComments.jsx',
    'DisqusComments',
    disqusFeatures
  );
}

// Test App component
function testAppComponent() {
  const appFeatures = [
    {
      name: 'React Router setup',
      pattern: /BrowserRouter|Routes|Route/,
      required: true,
    },
    { name: 'Navigation setup', pattern: /navigation|menu/, required: true },
    { name: 'Error boundary', pattern: /ErrorBoundary|error/, required: true },
    { name: 'Loading states', pattern: /loading|spinner/, required: true },
    { name: 'Mobile menu', pattern: /mobile|menu/, required: true },
    {
      name: 'Analytics tracking',
      pattern: /trackClick|analytics/,
      required: false,
    },
  ];

  testComponent('src/App.jsx', 'App', appFeatures);
}

// Test Blog component
function testBlogComponent() {
  const blogFeatures = [
    { name: 'Blog post list', pattern: /blogPosts|posts/, required: true },
    { name: 'Search functionality', pattern: /search|filter/, required: false },
    { name: 'Pagination', pattern: /pagination|page/, required: false },
    {
      name: 'Responsive design',
      pattern: /grid|flex|responsive/,
      required: true,
    },
  ];

  testComponent('src/pages/Blog.jsx', 'Blog', blogFeatures);
}

// Test Contact component
function testContactComponent() {
  const contactFeatures = [
    { name: 'Contact form', pattern: /form|input|textarea/, required: true },
    { name: 'Form validation', pattern: /validation|required/, required: true },
    {
      name: 'Submit handling',
      pattern: /onSubmit|handleSubmit/,
      required: true,
    },
    { name: 'Success/error states', pattern: /success|error/, required: true },
  ];

  testComponent('src/pages/Contact.jsx', 'Contact', contactFeatures);
}



// Test utility functions
function testUtilityFunctions() {
  console.log('\n📋 Testing Utility Functions:');

  // Test if utility files exist
  const utilityFiles = [
    'src/utils/helpers.js',
    'src/services/api.js',
    'src/hooks/useLocalStorage.js',
  ];

  utilityFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      logTestResult(`${path.basename(file)} exists`, 'PASS');
    } else {
      logTestResult(`${path.basename(file)} exists`, 'SKIP', 'File not found');
    }
  });
}

// Test configuration files
function testConfigurationFiles() {
  console.log('\n📋 Testing Configuration Files:');

  const configFiles = [
    { path: 'package.json', name: 'Package.json' },
    { path: 'vite.config.js', name: 'Vite Config' },
    { path: 'tailwind.config.js', name: 'Tailwind Config' },
    { path: 'netlify.toml', name: 'Netlify Config' },
  ];

  configFiles.forEach((file) => {
    if (fs.existsSync(file.path)) {
      logTestResult(`${file.name} exists`, 'PASS');
    } else {
      logTestResult(
        `${file.name} exists`,
        'FAIL',
        'Configuration file missing'
      );
    }
  });
}

// Main test runner
function runUnitTests() {
  console.log('🚀 Starting Unit Test Suite\n');

  testDisqusComponent();
  testAppComponent();
  testBlogComponent();
  testContactComponent();

  testUtilityFunctions();
  testConfigurationFiles();

  // Generate summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 UNIT TEST RESULTS SUMMARY');
  console.log('='.repeat(50));

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
    `\n🎯 Status: ${overallSuccess ? '✅ ALL UNIT TESTS PASSED' : '❌ UNIT TESTS FAILED'}`
  );

  if (testResults.failed > 0) {
    console.log('\n⚠️  CRITICAL ISSUES:');
    console.log('   - Fix failed unit tests before proceeding');
    console.log('   - Review component functionality');
    process.exit(1);
  } else {
    console.log('\n🎉 Unit tests passed! Ready for integration testing.');
  }
}

// Run unit tests
runUnitTests();
