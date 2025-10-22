#!/usr/bin/env node

/**
 * Chrome DevTools Test Script
 * Tests the development server for common errors
 */

import puppeteer from 'puppeteer';

const DEV_URL = 'http://localhost:5173';
const TIMEOUT = 30000;

async function testDevServer() {
  console.log('🔧 Chrome DevTools Test Suite\n');
  console.log('='.repeat(50));

  let browser;
  let allTestsPassed = true;

  try {
    console.log('\n📍 Launching Chrome...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Collect console messages
    const consoleMessages = [];
    const errors = [];
    const warnings = [];

    page.on('console', (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
      });

      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    // Collect page errors
    const pageErrors = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    // Collect failed requests
    const failedRequests = [];
    page.on('requestfailed', (request) => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure().errorText,
      });
    });

    console.log(`\n🌐 Navigating to ${DEV_URL}...`);
    await page.goto(DEV_URL, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT,
    });

    // Wait for React to load
    await page.waitForSelector('#root', { timeout: TIMEOUT });

    console.log('\n✅ Page loaded successfully\n');
    console.log('='.repeat(50));

    // Test 1: Check for Service Worker status
    console.log('\n📋 Test 1: Service Worker Status');
    const swStatus = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistrations().then((regs) => {
        return {
          count: regs.length,
          registrations: regs.map((r) => ({
            scope: r.scope,
            active: r.active?.state || 'none',
          })),
        };
      });
    });

    if (swStatus.count === 0) {
      console.log('   ✅ PASS: No Service Workers registered in development');
    } else {
      console.log(
        `   ⚠️  WARNING: ${swStatus.count} Service Worker(s) found:`,
        swStatus.registrations
      );
    }

    // Test 2: Check console errors
    console.log('\n📋 Test 2: Console Errors');
    const criticalErrors = errors.filter(
      (err) =>
        !err.includes('DevTools') &&
        !err.includes('Extension') &&
        !err.includes('[HMR]')
    );

    if (criticalErrors.length === 0) {
      console.log('   ✅ PASS: No critical console errors');
    } else {
      console.log(`   ❌ FAIL: ${criticalErrors.length} console error(s):`);
      criticalErrors.forEach((err, i) => {
        console.log(`      ${i + 1}. ${err.substring(0, 100)}`);
      });
      allTestsPassed = false;
    }

    // Test 3: Check failed requests
    console.log('\n📋 Test 3: Failed Network Requests');
    if (failedRequests.length === 0) {
      console.log('   ✅ PASS: All network requests successful');
    } else {
      console.log(`   ❌ FAIL: ${failedRequests.length} failed request(s):`);
      failedRequests.forEach((req, i) => {
        console.log(`      ${i + 1}. ${req.url} - ${req.failure}`);
      });
      allTestsPassed = false;
    }

    // Test 4: Check for page errors
    console.log('\n📋 Test 4: JavaScript Page Errors');
    if (pageErrors.length === 0) {
      console.log('   ✅ PASS: No JavaScript page errors');
    } else {
      console.log(`   ❌ FAIL: ${pageErrors.length} page error(s):`);
      pageErrors.forEach((err, i) => {
        console.log(`      ${i + 1}. ${err.substring(0, 100)}`);
      });
      allTestsPassed = false;
    }

    // Test 5: Check React app rendering
    console.log('\n📋 Test 5: React App Rendering');
    const appRendered = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });

    if (appRendered) {
      console.log('   ✅ PASS: React app rendered successfully');
    } else {
      console.log('   ❌ FAIL: React app did not render');
      allTestsPassed = false;
    }

    // Test 6: Check for HMR connection
    console.log('\n📋 Test 6: Vite HMR Connection');
    const hmrMessages = consoleMessages.filter((msg) =>
      msg.text.includes('[vite]')
    );
    const hmrConnected = hmrMessages.some((msg) =>
      msg.text.includes('connected')
    );

    if (hmrConnected) {
      console.log('   ✅ PASS: Vite HMR connected');
    } else {
      console.log('   ⚠️  WARNING: Vite HMR connection not detected');
    }

    // Test 7: Check manifest
    console.log('\n📋 Test 7: PWA Manifest');
    const manifestLink = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]');
      return link ? link.href : null;
    });

    if (manifestLink) {
      console.log(`   ✅ PASS: Manifest found at ${manifestLink}`);
    } else {
      console.log('   ⚠️  WARNING: No manifest link found');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 Test Summary:');
    console.log(`   Total Console Messages: ${consoleMessages.length}`);
    console.log(`   Errors: ${criticalErrors.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    console.log(`   Failed Requests: ${failedRequests.length}`);
    console.log(`   Page Errors: ${pageErrors.length}`);

    if (allTestsPassed) {
      console.log('\n✅ ALL TESTS PASSED - Development environment is clean!\n');
      process.exit(0);
    } else {
      console.log(
        '\n❌ SOME TESTS FAILED - Check errors above and fix issues.\n'
      );
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    console.error('\nMake sure the dev server is running on', DEV_URL);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run tests
testDevServer();

