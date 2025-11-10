# Sitemap Generation Tests

## Overview

The `test-sitemap.mjs` script provides comprehensive unit tests for the sitemap generation functionality in `generate-sitemap.mjs`. It validates all core functions and ensures both XML and HTML sitemaps are generated correctly.

## Test Coverage

### 1. `escapeHtml` Function Tests (9 tests)
Tests the HTML escaping utility function that prevents XSS vulnerabilities:

- **Plain text**: Verifies normal text passes through unchanged
- **HTML tags**: Ensures `<script>` and other tags are properly escaped
- **Ampersand**: Validates `&` becomes `&amp;`
- **Double quotes**: Checks `"` becomes `&quot;`
- **Single quotes**: Confirms `'` becomes `&#39;`
- **Complex HTML**: Tests multiple special characters in one string
- **Empty string**: Handles empty input correctly
- **Undefined value**: Coerces undefined to empty string
- **Null value**: Converts null to string "null"

### 2. `getBlogRoutes` Function Tests (7 tests)
Validates blog post URL generation from the blog index:

- **Array return type**: Confirms function returns an array
- **URL normalization**: All routes start with `/`
- **Blog path structure**: All routes are under `/blog`
- **Sorting**: Routes are alphabetically sorted
- **Uniqueness**: No duplicate URLs
- **Known posts**: Verifies specific posts exist (e.g., `/blog/habit`)
- **Minimum routes**: Ensures blog posts are found

### 3. `generateSitemap` Function Tests (11 tests)
Tests XML sitemap generation:

- **XML declaration**: Validates proper XML header
- **Namespace**: Confirms correct sitemap.org schema
- **Closing tags**: Ensures proper XML structure
- **URL inclusion**: All provided URLs appear in output
- **Priority values**:
  - Homepage: 1.0
  - Blog posts: 0.7
  - Static pages: 0.8
- **Change frequency**:
  - Homepage: daily
  - Blog posts: weekly
  - Static pages: weekly
- **Last modified date**: Uses current date in ISO format
- **Balanced tags**: All `<url>` tags are properly closed

### 4. `generateHtmlSitemap` Function Tests (14 tests)
Tests HTML sitemap generation:

- **DOCTYPE**: Proper HTML5 declaration
- **HTML structure**: Valid `<html lang="en">` tag
- **Meta tags**: Charset and viewport present
- **Title tag**: Correct page title
- **Section headings**: "Main Pages" and "Blog Posts" sections
- **XML sitemap link**: Link to sitemap.xml
- **Route presence**: All main routes included
- **Blog entries**: All blog posts included
- **XSS protection**: Special characters properly escaped
- **HTML entities**: Escaped characters use correct entities
- **Last updated date**: Current date displayed
- **Homepage label**: "/" displays as "Homepage"
- **Embedded styles**: CSS styles included

### 5. Main Function Integration Tests (6 tests)
Validates end-to-end sitemap generation:

- **XML file exists**: sitemap.xml created in public/
- **XML valid structure**: Proper XML formatting
- **XML contains URLs**: Multiple URLs present
- **HTML file exists**: sitemap.html created in public/
- **HTML valid structure**: Proper HTML5 document
- **HTML sections present**: Both main pages and blog sections

## Running the Tests

### Run sitemap tests only:
```bash
npm run test:sitemap
```

### Run as part of full test suite:
```bash
npm run test:all
```

### Direct execution:
```bash
node scripts/test-sitemap.mjs
```

## Test Output

The test suite provides:
- Real-time test results with ✅/❌ indicators
- Detailed failure messages when tests don't pass
- Summary statistics:
  - Total tests run
  - Tests passed
  - Tests failed
  - Success rate percentage

### Example Output:
```
🧪 SITEMAP UNIT TESTS

📋 Testing escapeHtml function:
   ✅ escapeHtml - Plain text
   ✅ escapeHtml - HTML tags
   ...

==================================================
📊 TEST SUMMARY
==================================================
Total Tests: 47
✅ Passed: 47
❌ Failed: 0
Success Rate: 100.0%
==================================================

✅ All tests passed!
```

## Exit Codes

- **0**: All tests passed
- **1**: One or more tests failed

## Prerequisites

Before running the integration tests:
1. Generate sitemaps: `npm run sitemap`
2. Ensure `src/data/blogIndex.js` exists and is valid
3. Node.js with ESM support

## Test Methodology

- **Unit tests**: Test individual functions in isolation
- **Integration tests**: Verify actual generated files
- **Mock functions**: Replicate logic from source for testability
- **No external dependencies**: Tests are self-contained

## Maintenance

When updating `generate-sitemap.mjs`:
1. Update corresponding mock functions in `test-sitemap.mjs`
2. Add new test cases for new functionality
3. Run tests to ensure no regressions
4. Update this README with new test coverage

## Related Files

- `scripts/generate-sitemap.mjs` - Source code being tested
- `src/data/blogIndex.js` - Blog post metadata
- `public/sitemap.xml` - Generated XML sitemap
- `public/sitemap.html` - Generated HTML sitemap
- `package.json` - Test script definitions

## Best Practices

1. **Run before commits**: Always run sitemap tests before committing changes
2. **Generate first**: Run `npm run sitemap` before integration tests
3. **Check failures**: Review detailed error messages for failed tests
4. **Update tests**: Add tests when adding new sitemap features
5. **Verify manually**: Occasionally check generated sitemaps in browser

## Troubleshooting

### Tests fail with "File not found"
- Run `npm run sitemap` to generate sitemap files first

### Blog route tests fail
- Check `src/data/blogIndex.js` for syntax errors
- Verify blog post metadata is correctly formatted

### HTML escaping tests fail
- Review `escapeHtml` function implementation
- Check for changes in escape character handling

### Integration tests fail
- Verify Node.js version supports ESM
- Check file permissions in `public/` directory
- Ensure no other process is writing to sitemap files

## Future Enhancements

Potential test additions:
- Validate XML against sitemap schema
- Test sitemap size limits (50,000 URLs)
- Check URL encoding for special characters
- Verify lastmod date format compliance
- Test sitemap index generation (for large sites)
- Add performance benchmarks
- Test with various blog index configurations
