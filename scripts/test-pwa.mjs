#!/usr/bin/env node

/**
 * PWA Testing Script
 * Comprehensive testing for PWA features including push notifications
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkFileContent(filePath, requiredContent) {
  if (!checkFileExists(filePath)) {
    return { exists: false, content: false };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const hasContent = requiredContent.some(item => content.includes(item));
  
  return { exists: true, content: hasContent };
}

async function runLighthouseAudit() {
  try {
    log('Running Lighthouse PWA audit...', 'blue');
    
    // Check if lighthouse is installed
    try {
      execSync('npx lighthouse --version', { stdio: 'pipe' });
    } catch (error) {
      log('Installing Lighthouse...', 'yellow');
      execSync('npm install -g lighthouse', { stdio: 'inherit' });
    }
    
    // Run lighthouse audit
    const result = execSync('npx lighthouse http://localhost:8888 --only-categories=pwa --output=json --quiet', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const audit = JSON.parse(result);
    const pwaScore = audit.categories.pwa.score * 100;
    
    log(`Lighthouse PWA Score: ${pwaScore.toFixed(0)}/100`, pwaScore >= 90 ? 'green' : 'red');
    
    return {
      score: pwaScore,
      passed: pwaScore >= 90,
      details: audit.categories.pwa.auditRefs.map(ref => ({
        id: ref.id,
        weight: ref.weight,
        result: audit.audits[ref.id]?.score === 1 ? 'PASS' : 'FAIL'
      }))
    };
  } catch (error) {
    log('Lighthouse audit failed. Make sure the dev server is running on localhost:8888', 'red');
    return { score: 0, passed: false, error: error.message };
  }
}

function testPWAFiles() {
  log('\n🔍 Testing PWA Files...', 'bold');
  
  const tests = [
    {
      name: 'Web App Manifest',
      file: 'public/manifest.json',
      requiredContent: ['name', 'short_name', 'start_url', 'display', 'icons']
    },
    {
      name: 'Service Worker',
      file: 'public/sw.js',
      requiredContent: ['addEventListener', 'push', 'notificationclick', 'fetch']
    },
    {
      name: 'Offline Page',
      file: 'public/offline.html',
      requiredContent: ['offline', 'You\'re Offline']
    },
    {
      name: 'Push Notification Service',
      file: 'src/services/pushNotificationService.js',
      requiredContent: ['subscribe', 'unsubscribe', 'requestPermission']
    },
    {
      name: 'Service Worker Service',
      file: 'src/services/serviceWorkerService.js',
      requiredContent: ['register', 'unregister', 'checkForUpdates']
    },
    {
      name: 'Notification Permission Component',
      file: 'src/components/NotificationPermission.jsx',
      requiredContent: ['NotificationPermission', 'requestPermission']
    },
    {
      name: 'Notifications Page',
      file: 'src/pages/Notifications.jsx',
      requiredContent: ['Notification Settings', 'NotificationPermission']
    }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  tests.forEach(test => {
    const result = checkFileContent(test.file, test.requiredContent);
    if (result.exists && result.content) {
      log(`✅ ${test.name}`, 'green');
      passed++;
    } else {
      log(`❌ ${test.name}`, 'red');
      if (!result.exists) {
        log(`   File not found: ${test.file}`, 'red');
      } else {
        log(`   Missing required content`, 'red');
      }
    }
  });
  
  log(`\nPWA Files: ${passed}/${total} passed`, passed === total ? 'green' : 'yellow');
  return { passed, total, allPassed: passed === total };
}

function testNetlifyFunctions() {
  log('\n🔧 Testing Netlify Functions...', 'bold');
  
  const functions = [
    'netlify/functions/push-subscription.js',
    'netlify/functions/send-push-notification.js',
    'netlify/functions/disqus-webhook.js',
    'netlify/functions/blog-publish-notification.js'
  ];
  
  let passed = 0;
  let total = functions.length;
  
  functions.forEach(func => {
    if (checkFileExists(func)) {
      log(`✅ ${path.basename(func)}`, 'green');
      passed++;
    } else {
      log(`❌ ${path.basename(func)}`, 'red');
    }
  });
  
  log(`\nNetlify Functions: ${passed}/${total} passed`, passed === total ? 'green' : 'yellow');
  return { passed, total, allPassed: passed === total };
}

function testHTMLIntegration() {
  log('\n🌐 Testing HTML Integration...', 'bold');
  
  const htmlFile = 'index.html';
  const requiredContent = [
    'manifest.json',
    'theme-color',
    'apple-mobile-web-app-title',
    'apple-touch-icon'
  ];
  
  const result = checkFileContent(htmlFile, requiredContent);
  
  if (result.exists && result.content) {
    log('✅ HTML PWA integration', 'green');
    return { passed: true };
  } else {
    log('❌ HTML PWA integration', 'red');
    return { passed: false };
  }
}

function testPackageJson() {
  log('\n📦 Testing Package.json Dependencies...', 'bold');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['web-push'];
  
  let passed = 0;
  let total = requiredDeps.length;
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      log(`✅ ${dep}`, 'green');
      passed++;
    } else {
      log(`❌ ${dep}`, 'red');
    }
  });
  
  log(`\nDependencies: ${passed}/${total} passed`, passed === total ? 'green' : 'yellow');
  return { passed, total, allPassed: passed === total };
}

function testNetlifyConfig() {
  log('\n⚙️ Testing Netlify Configuration...', 'bold');
  
  const configFile = 'netlify.toml';
  const requiredContent = [
    'VAPID_PUBLIC_KEY',
    'VAPID_PRIVATE_KEY',
    'manifest.json',
    'sw.js'
  ];
  
  const result = checkFileContent(configFile, requiredContent);
  
  if (result.exists && result.content) {
    log('✅ Netlify PWA configuration', 'green');
    return { passed: true };
  } else {
    log('❌ Netlify PWA configuration', 'red');
    return { passed: false };
  }
}

async function testServiceWorkerRegistration() {
  log('\n🔧 Testing Service Worker Registration...', 'bold');
  
  const mainFile = 'src/main.jsx';
  const requiredContent = [
    'serviceWorkerService',
    'serviceWorker.initialize'
  ];
  
  const result = checkFileContent(mainFile, requiredContent);
  
  if (result.exists && result.content) {
    log('✅ Service Worker registration in main.jsx', 'green');
    return { passed: true };
  } else {
    log('❌ Service Worker registration in main.jsx', 'red');
    return { passed: false };
  }
}

function generateTestReport(results) {
  log('\n📊 PWA Test Report', 'bold');
  log('='.repeat(50), 'blue');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r.passed || r.allPassed).length;
  
  log(`Overall Score: ${passedTests}/${totalTests} tests passed`, 
      passedTests === totalTests ? 'green' : 'yellow');
  
  log('\nDetailed Results:', 'bold');
  Object.entries(results).forEach(([test, result]) => {
    const status = result.passed || result.allPassed ? '✅' : '❌';
    const score = result.passed !== undefined ? 
      (result.passed ? 'PASS' : 'FAIL') : 
      `${result.passed || 0}/${result.total || 0}`;
    
    log(`${status} ${test}: ${score}`, result.passed || result.allPassed ? 'green' : 'red');
  });
  
  if (passedTests === totalTests) {
    log('\n🎉 All PWA tests passed! Your app is ready for deployment.', 'green');
  } else {
    log('\n⚠️ Some tests failed. Please fix the issues before deploying.', 'yellow');
  }
  
  return { totalTests, passedTests, allPassed: passedTests === totalTests };
}

async function main() {
  log('🚀 Starting PWA Testing Suite...', 'bold');
  log('='.repeat(50), 'blue');
  
  const results = {};
  
  // Run all tests
  results['PWA Files'] = testPWAFiles();
  results['Netlify Functions'] = testNetlifyFunctions();
  results['HTML Integration'] = testHTMLIntegration();
  results['Package Dependencies'] = testPackageJson();
  results['Netlify Configuration'] = testNetlifyConfig();
  results['Service Worker Registration'] = await testServiceWorkerRegistration();
  
  // Run Lighthouse audit if dev server is running
  try {
    results['Lighthouse PWA Score'] = await runLighthouseAudit();
  } catch (error) {
    log('Skipping Lighthouse audit (dev server not running)', 'yellow');
  }
  
  // Generate report
  const report = generateTestReport(results);
  
  // Exit with appropriate code
  process.exit(report.allPassed ? 0 : 1);
}

// Run the tests
main().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
