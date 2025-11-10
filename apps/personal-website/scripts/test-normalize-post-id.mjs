#!/usr/bin/env node

import { normalizePostId, KNOWN_POST_MAPPINGS } from '../src/utils/postUtils.js';

console.log('🧪 NORMALIZE POST ID TESTS\n');

const testResults = { total: 0, passed: 0, failed: 0 };

function assertEquals(actual, expected, testName) {
  testResults.total++;
  if (actual === expected) {
    console.log(`   ✅ ${testName}`);
    testResults.passed++;
  } else {
    console.log(`   ❌ ${testName}`);
    console.log(`      Expected: ${JSON.stringify(expected)}`);
    console.log(`      Actual: ${JSON.stringify(actual)}`);
    testResults.failed++;
  }
}

console.log('📋 Testing normalizePostId function:\n');

// Test 1: Returns null for empty or whitespace-only inputs
console.log('1️⃣  Empty/whitespace inputs:');
assertEquals(normalizePostId(''), null, 'Empty string returns null');
assertEquals(normalizePostId('   '), null, 'Whitespace-only string returns null');
assertEquals(normalizePostId('\t\n'), null, 'Tabs and newlines return null');
assertEquals(normalizePostId(null), null, 'Null input returns null');
assertEquals(normalizePostId(undefined), null, 'Undefined input returns null');

// Test 2: Returns correct mapped ID when exact trimmed match exists
console.log('\n2️⃣  Exact matches in KNOWN_POST_MAPPINGS:');
assertEquals(
  normalizePostId('the-great-pivot'),
  'the-great-pivot',
  'Exact match: the-great-pivot'
);
assertEquals(
  normalizePostId('autophagy'),
  'autophagy',
  'Exact match: autophagy'
);
assertEquals(
  normalizePostId('price-parity'),
  'price-parity',
  'Exact match: price-parity'
);

// Test 3: Returns correct mapped ID when lower-case match exists
console.log('\n3️⃣  Case-insensitive matches in KNOWN_POST_MAPPINGS:');
assertEquals(
  normalizePostId('THE-GREAT-PIVOT'),
  'the-great-pivot',
  'Upper-case input matches lower-case mapping'
);
assertEquals(
  normalizePostId('Price-Parity'),
  'price-parity',
  'Mixed-case input matches lower-case mapping'
);
assertEquals(
  normalizePostId('AUTOPHAGY'),
  'autophagy',
  'Upper-case single word matches lower-case mapping'
);

// Test 4: Returns lower-cased version when no mapping exists
console.log('\n4️⃣  No mapping exists:');
assertEquals(
  normalizePostId('new-blog-post'),
  'new-blog-post',
  'Lower-case input without mapping returns as-is'
);
assertEquals(
  normalizePostId('ANOTHER-NEW-POST'),
  'another-new-post',
  'Upper-case input without mapping returns lower-case'
);
assertEquals(
  normalizePostId('Mixed-Case-Post'),
  'mixed-case-post',
  'Mixed-case input without mapping returns lower-case'
);

// Test 5: Handles inputs with leading or trailing whitespace
console.log('\n5️⃣  Leading/trailing whitespace:');
assertEquals(
  normalizePostId('  the-great-pivot  '),
  'the-great-pivot',
  'Trimmed input matches known mapping'
);
assertEquals(
  normalizePostId('\tautophagy\n'),
  'autophagy',
  'Tabs and newlines trimmed, matches known mapping'
);
assertEquals(
  normalizePostId('  NEW-POST  '),
  'new-post',
  'Whitespace trimmed, returns lower-case for unknown post'
);
assertEquals(
  normalizePostId('   '),
  null,
  'Only whitespace returns null (already covered but confirms trim logic)'
);

// Generate summary
console.log(`\n${'='.repeat(50)}`);
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(50));

console.log(`\n📈 Results:`);
console.log(`   Total Tests: ${testResults.total}`);
console.log(`   ✅ Passed: ${testResults.passed}`);
console.log(`   ❌ Failed: ${testResults.failed}`);
console.log(
  `   📊 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`
);

const overallSuccess = testResults.failed === 0;

console.log(
  `\n🎯 Status: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ TESTS FAILED'}`
);

if (testResults.failed > 0) {
  console.log('\n⚠️  CRITICAL ISSUES:');
  console.log('   - Fix failed tests before proceeding');
  process.exit(1);
} else {
  console.log('\n🎉 All normalizePostId tests passed!');
}
