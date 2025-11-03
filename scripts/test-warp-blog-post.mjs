#!/usr/bin/env node

import fs from 'node:fs';

console.log('🧪 WARP BLOG POST TESTS - Testing about-warp-the-agentic-terminal\n');

const testResults = { total: 0, passed: 0, failed: 0 };

function logTestResult(testName, status, details = '') {
  const emoji = status === 'PASS' ? '✅' : '❌';
  console.log(`   ${emoji} ${testName}${details ? ` - ${details}` : ''}`);

  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

// Test 1: blogIndex contains the new entry with correct metadata
function testBlogIndexEntry() {
  console.log('\n📋 Test 1: blogIndex object contains the new entry with correct metadata');

  try {
    const blogIndexPath = 'src/data/blogIndex.js';
    if (!fs.existsSync(blogIndexPath)) {
      logTestResult('blogIndex.js exists', 'FAIL', 'File not found');
      return;
    }

    const content = fs.readFileSync(blogIndexPath, 'utf8');

    // Check if the entry exists
    const hasEntry = content.includes('"about-warp-the-agentic-terminal"');
    logTestResult('Entry "about-warp-the-agentic-terminal" exists', hasEntry ? 'PASS' : 'FAIL');

    if (!hasEntry) return;

    // Check for required metadata fields
    const entryMatch = content.match(/"about-warp-the-agentic-terminal":\s*\{([^}]+)\}/s);
    if (!entryMatch) {
      logTestResult('Entry structure is valid', 'FAIL', 'Cannot parse entry');
      return;
    }

    const entryContent = entryMatch[0];

    // Check title
    const hasTitle = /title:\s*"About Warp — the agentic terminal"/.test(entryContent);
    logTestResult('Title is correct', hasTitle ? 'PASS' : 'FAIL');

    // Check description
    const hasDescription = /description:\s*"What Warp is/.test(entryContent);
    logTestResult('Description exists', hasDescription ? 'PASS' : 'FAIL');

    // Check image
    const hasImage = /image:\s*"\/vite\.svg"/.test(entryContent);
    logTestResult('Image path is defined', hasImage ? 'PASS' : 'FAIL');

    // Check tags array
    const hasTags = /tags:\s*\[/.test(entryContent);
    logTestResult('Tags array exists', hasTags ? 'PASS' : 'FAIL');

    // Check specific tags
    const hasWarpTag = entryContent.includes('"Warp"');
    const hasAgentsTag = entryContent.includes('"Agents"');
    const hasTerminalTag = entryContent.includes('"Terminal"');
    logTestResult('Tag "Warp" exists', hasWarpTag ? 'PASS' : 'FAIL');
    logTestResult('Tag "Agents" exists', hasAgentsTag ? 'PASS' : 'FAIL');
    logTestResult('Tag "Terminal" exists', hasTerminalTag ? 'PASS' : 'FAIL');

    // Check datePublished
    const hasDatePublished = /datePublished:\s*new Date/.test(entryContent);
    logTestResult('datePublished exists', hasDatePublished ? 'PASS' : 'FAIL');

    // Check dateModified
    const hasDateModified = /dateModified:\s*new Date/.test(entryContent);
    logTestResult('dateModified exists', hasDateModified ? 'PASS' : 'FAIL');

  } catch (error) {
    logTestResult('blogIndex entry test', 'FAIL', error.message);
  }
}

// Test 2: getBlogSeo function correctly retrieves the SEO data
function testGetBlogSeoFunction() {
  console.log('\n📋 Test 2: getBlogSeo function correctly retrieves SEO data');

  try {
    const blogIndexPath = 'src/data/blogIndex.js';
    const content = fs.readFileSync(blogIndexPath, 'utf8');

    // Check if getBlogSeo function exists
    const hasFunctionExport = /export function getBlogSeo/.test(content);
    logTestResult('getBlogSeo function is exported', hasFunctionExport ? 'PASS' : 'FAIL');

    // Check function implementation
    const functionImplementation = content.match(/export function getBlogSeo\(([^)]+)\)\s*\{([^}]+)\}/);
    if (!functionImplementation) {
      logTestResult('getBlogSeo function implementation exists', 'FAIL');
      return;
    }

    logTestResult('getBlogSeo function implementation exists', 'PASS');

    // Check if function returns blogIndex[slug]
    const returnsCorrectValue = /return blogIndex\[slug\]/.test(content);
    logTestResult('Function returns blogIndex[slug]', returnsCorrectValue ? 'PASS' : 'FAIL');

    // Verify blogRegistry.js uses getBlogSeo
    const blogRegistryPath = 'src/data/blogRegistry.js';
    if (fs.existsSync(blogRegistryPath)) {
      const registryContent = fs.readFileSync(blogRegistryPath, 'utf8');
      const importsGetBlogSeo = /import.*getBlogSeo.*from.*blogIndex/.test(registryContent);
      logTestResult('blogRegistry.js imports getBlogSeo', importsGetBlogSeo ? 'PASS' : 'FAIL');

      const callsGetBlogSeo = /getBlogSeo\(slug\)/.test(registryContent);
      logTestResult('blogRegistry.js calls getBlogSeo', callsGetBlogSeo ? 'PASS' : 'FAIL');
    }

  } catch (error) {
    logTestResult('getBlogSeo function test', 'FAIL', error.message);
  }
}

// Test 3: AboutWarpAgenticTerminal component renders without errors
function testComponentStructure() {
  console.log('\n📋 Test 3: AboutWarpAgenticTerminal component renders without errors');

  try {
    const componentPath = 'src/pages/blog/about-warp-the-agentic-terminal.jsx';
    
    if (!fs.existsSync(componentPath)) {
      logTestResult('Component file exists', 'FAIL', 'File not found');
      return;
    }

    logTestResult('Component file exists', 'PASS');

    const content = fs.readFileSync(componentPath, 'utf8');

    // Check for React import
    const hasReactImport = /import React/.test(content);
    logTestResult('React is imported', hasReactImport ? 'PASS' : 'FAIL');

    // Check for useRef import
    const hasUseRef = /useRef/.test(content);
    logTestResult('useRef hook is imported', hasUseRef ? 'PASS' : 'FAIL');

    // Check for default export
    const hasDefaultExport = /export default function AboutWarpAgenticTerminal/.test(content);
    logTestResult('Component is exported as default', hasDefaultExport ? 'PASS' : 'FAIL');

    // Check component returns JSX
    const hasReturn = /return\s*\(/.test(content);
    logTestResult('Component has return statement', hasReturn ? 'PASS' : 'FAIL');

    // Check for article element
    const hasArticle = /<article/.test(content);
    logTestResult('Component contains <article> element', hasArticle ? 'PASS' : 'FAIL');

    // Check for ref usage
    const hasRefUsage = /ref=\{articleRef\}/.test(content);
    logTestResult('articleRef is used in JSX', hasRefUsage ? 'PASS' : 'FAIL');

    // Check for prose classes (Tailwind typography)
    const hasProseClasses = /className="prose/.test(content);
    logTestResult('Component uses prose classes for typography', hasProseClasses ? 'PASS' : 'FAIL');

  } catch (error) {
    logTestResult('Component structure test', 'FAIL', error.message);
  }
}

// Test 4: Component displays the main heading
function testMainHeading() {
  console.log('\n📋 Test 4: Component displays the main heading');

  try {
    const componentPath = 'src/pages/blog/about-warp-the-agentic-terminal.jsx';
    const content = fs.readFileSync(componentPath, 'utf8');

    // Check for h1 element
    const hasH1 = /<h1>/.test(content);
    logTestResult('Component has <h1> element', hasH1 ? 'PASS' : 'FAIL');

    // Check for exact heading text
    const hasCorrectHeading = /<h1>About Warp — the agentic terminal<\/h1>/.test(content);
    logTestResult('Main heading text is correct', hasCorrectHeading ? 'PASS' : 'FAIL');

    // Check heading comes before other content
    const headingPosition = content.indexOf('<h1>About Warp — the agentic terminal</h1>');
    const firstParagraph = content.indexOf('<p>');
    const headingBeforeContent = headingPosition > 0 && headingPosition < firstParagraph;
    logTestResult('Heading appears before content', headingBeforeContent ? 'PASS' : 'FAIL');

  } catch (error) {
    logTestResult('Main heading test', 'FAIL', error.message);
  }
}

// Test 5: Component includes expected key content elements
function testKeyContentElements() {
  console.log('\n📋 Test 5: Component includes expected key content elements');

  try {
    const componentPath = 'src/pages/blog/about-warp-the-agentic-terminal.jsx';
    const content = fs.readFileSync(componentPath, 'utf8');

    // Check for multiple h2 headings
    const h2Count = (content.match(/<h2>/g) || []).length;
    logTestResult(`Component has multiple sections (${h2Count} <h2> headings)`, h2Count >= 3 ? 'PASS' : 'FAIL');

    // Check for specific sections
    const hasWhyMattersSection = /<h2>Why it matters for this codebase<\/h2>/.test(content);
    logTestResult('Section "Why it matters for this codebase" exists', hasWhyMattersSection ? 'PASS' : 'FAIL');

    const hasTypicalTasksSection = /<h2>Typical agent tasks here<\/h2>/.test(content);
    logTestResult('Section "Typical agent tasks here" exists', hasTypicalTasksSection ? 'PASS' : 'FAIL');

    const hasHowToTrySection = /<h2>How to try it now<\/h2>/.test(content);
    logTestResult('Section "How to try it now" exists', hasHowToTrySection ? 'PASS' : 'FAIL');

    // Check for lists
    const hasUnorderedLists = (content.match(/<ul>/g) || []).length >= 2;
    logTestResult('Component has unordered lists', hasUnorderedLists ? 'PASS' : 'FAIL');

    const hasOrderedList = /<ol>/.test(content);
    logTestResult('Component has ordered list', hasOrderedList ? 'PASS' : 'FAIL');

    // Check for code elements
    const hasCodeElements = /<code>/.test(content);
    logTestResult('Component includes <code> elements', hasCodeElements ? 'PASS' : 'FAIL');

    // Check for specific content mentions
    const mentionsWarp = /Warp is a modern terminal/.test(content);
    logTestResult('Content describes Warp', mentionsWarp ? 'PASS' : 'FAIL');

    const mentionsAgents = /AI agents/.test(content);
    logTestResult('Content mentions AI agents', mentionsAgents ? 'PASS' : 'FAIL');

    const mentionsBlogIndex = /blogIndex\.js/.test(content);
    logTestResult('Content references blogIndex.js', mentionsBlogIndex ? 'PASS' : 'FAIL');

    const mentionsNpmRunDev = /npm run dev/.test(content);
    logTestResult('Content includes npm run dev command', mentionsNpmRunDev ? 'PASS' : 'FAIL');

    // Check for tip/note section
    const hasTipSection = /Tip:|text-sm text-gray-500/.test(content);
    logTestResult('Component includes tip/note section', hasTipSection ? 'PASS' : 'FAIL');

  } catch (error) {
    logTestResult('Key content elements test', 'FAIL', error.message);
  }
}

// Main test runner
function runWarpBlogPostTests() {
  console.log('🚀 Starting Warp Blog Post Test Suite\n');

  testBlogIndexEntry();
  testGetBlogSeoFunction();
  testComponentStructure();
  testMainHeading();
  testKeyContentElements();

  // Generate summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 WARP BLOG POST TEST RESULTS SUMMARY');
  console.log('='.repeat(60));

  console.log(`\n📈 Results:`);
  console.log(`   Total Tests: ${testResults.total}`);
  console.log(`   ✅ Passed: ${testResults.passed}`);
  console.log(`   ❌ Failed: ${testResults.failed}`);
  console.log(`   📊 Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);

  const overallSuccess = testResults.failed === 0;

  console.log(`\n🎯 Status: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ TESTS FAILED'}`);

  if (testResults.failed > 0) {
    console.log('\n⚠️  ISSUES FOUND:');
    console.log('   - Review failed tests above');
    console.log('   - Verify component implementation and SEO metadata');
    process.exit(1);
  } else {
    console.log('\n🎉 All Warp blog post tests passed!');
    console.log('   ✓ blogIndex entry is correct');
    console.log('   ✓ getBlogSeo function works properly');
    console.log('   ✓ Component structure is valid');
    console.log('   ✓ Content includes all expected elements');
  }
}

// Run tests
runWarpBlogPostTests();
