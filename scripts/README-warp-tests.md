# Warp Blog Post Test Suite

This document describes the test suite for the "About Warp — the agentic terminal" blog post.

## Test File
`test-warp-blog-post.mjs`

## Purpose
Ensures the Warp blog post is properly integrated into the website with correct metadata, SEO data, and component structure.

## Running Tests

```bash
# Run the Warp blog post tests specifically
npm run test:warp-blog

# Or run directly with node
node scripts/test-warp-blog-post.mjs
```

## Test Cases

### Test 1: blogIndex Entry Metadata
Verifies that the `blogIndex` object in `src/data/blogIndex.js` contains:
- ✅ Entry with slug "about-warp-the-agentic-terminal"
- ✅ Correct title: "About Warp — the agentic terminal"
- ✅ Description starting with "What Warp is"
- ✅ Image path defined ("/vite.svg")
- ✅ Tags array with "Warp", "Agents", "Terminal", "Productivity"
- ✅ datePublished field
- ✅ dateModified field

### Test 2: getBlogSeo Function
Verifies the SEO data retrieval function:
- ✅ Function is exported from `src/data/blogIndex.js`
- ✅ Function implementation exists and is correct
- ✅ Function returns `blogIndex[slug]`
- ✅ Function is imported by `src/data/blogRegistry.js`
- ✅ Function is called in `blogRegistry.js`

### Test 3: Component Structure
Verifies the React component structure:
- ✅ Component file exists at `src/pages/blog/about-warp-the-agentic-terminal.jsx`
- ✅ React is imported
- ✅ useRef hook is imported and used
- ✅ Component is exported as default
- ✅ Component has return statement
- ✅ Component uses `<article>` element
- ✅ articleRef is properly used
- ✅ Prose classes are applied for typography

### Test 4: Main Heading
Verifies the main heading display:
- ✅ Component has `<h1>` element
- ✅ Heading text is exactly "About Warp — the agentic terminal"
- ✅ Heading appears before other content

### Test 5: Key Content Elements
Verifies all expected content sections and elements:
- ✅ Multiple sections (3 `<h2>` headings)
- ✅ "Why it matters for this codebase" section
- ✅ "Typical agent tasks here" section
- ✅ "How to try it now" section
- ✅ Unordered lists for bullet points
- ✅ Ordered list for steps
- ✅ Code elements for inline code references
- ✅ Content describes Warp
- ✅ Content mentions AI agents
- ✅ Content references `blogIndex.js`
- ✅ Content includes `npm run dev` command
- ✅ Tip/note section with styling

## Test Results

The test suite runs 38 individual test assertions across 5 main test categories:

1. **blogIndex Entry**: 10 tests
2. **getBlogSeo Function**: 5 tests
3. **Component Structure**: 8 tests
4. **Main Heading**: 3 tests
5. **Key Content Elements**: 12 tests

## Success Criteria

All 38 tests must pass for the test suite to succeed. The test script:
- Returns exit code 0 on success
- Returns exit code 1 on failure
- Provides detailed output for each test
- Shows a summary with success rate

## Integration

This test is integrated into the project's test suite:
- Can be run individually with `npm run test:warp-blog`
- Included in comprehensive test runs
- Validates blog post structure and content

## Maintenance

When updating the Warp blog post, ensure:
1. The blogIndex entry in `src/data/blogIndex.js` remains complete
2. The component structure in `about-warp-the-agentic-terminal.jsx` is maintained
3. All key content sections are preserved
4. Run tests after making changes: `npm run test:warp-blog`
