# WordPress Auto-Publishing Quick Reference

**Last Updated**: August 24, 2025

## 🚀 Quick Commands

### Publishing
```bash
# Publish latest blog post
npm run crosspost:latest

# Publish all blog posts
npm run crosspost:all

# Test specific blog post
npm run crosspost:test src/pages/blog/your-post.jsx

# Test content extraction
npm run crosspost:extract
```

### Token Management
```bash
# Generate new token
npm run wordpress:token

# Setup WordPress integration
npm run wordpress:setup
```

## 📝 Blog Post Structure Best Practices

### ✅ Recommended JSX Structure
```jsx
const YourBlogPost = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Your Blog Title</h1>
      
      {/* Date and metadata */}
      <div className="flex items-center text-gray-600 mb-8">
        <span>{new Date().toLocaleDateString()}</span>
      </div>

      {/* IMPORTANT: Single prose div for content extraction */}
      <div className="prose prose-lg max-w-none">
        {/* All your content goes here */}
        <p>Your content...</p>
        <h2>Your sections...</h2>
        <p>More content...</p>
      </div>
    </div>
  );
};
```

### ❌ Avoid Complex Structures
```jsx
// DON'T: Nested sections with complex div hierarchies
<div className="prose">
  <section className="mb-8">
    <div className="space-y-8">
      <div ref={articleRef} className="prose prose-lg max-w-none">
        <header className="text-center mb-10">
          <div className="mb-10 text-center">
            {/* This can confuse content extraction */}
          </div>
        </header>
      </div>
    </div>
  </section>
</div>
```

## 🔍 Content Extraction Troubleshooting

### Check Content Length
```bash
npm run crosspost:extract | grep "Content length"
```

**Warning Signs:**
- Content length < 1000 characters
- Only title and description extracted
- Missing main content sections

### Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Incomplete Content** | Content length < 1000 chars | Simplify JSX structure |
| **Missing Sections** | Only title extracted | Check prose div placement |
| **Nested Divs** | Extraction stops early | Flatten structure |
| **Complex Components** | React components interfere | Move components outside prose div |

### Manual HTML Posting (Backup Solution)
```javascript
// Create HTML version of content
const htmlContent = `
<p>Your content in HTML format...</p>
<h2>Your sections...</h2>
`;

// Post directly via API
const response = await fetch(`${apiBase}/sites/${siteId}/posts/new`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Your Title",
    content: htmlContent,
    status: 'publish'
  })
});
```

## 🛠️ Troubleshooting Steps

### 1. Content Extraction Issues
```bash
# Step 1: Test content extraction
npm run crosspost:extract

# Step 2: Check content length
# If < 1000 characters, content extraction failed

# Step 3: Simplify JSX structure
# Remove nested sections, flatten divs

# Step 4: Test again
npm run crosspost:extract
```

### 2. Reposting Issues
```bash
# Clear posted log to allow reposting
# Edit data/wordpress-posted.json and remove the entry

# Then repost
npm run crosspost:latest
```

### 3. Token Issues
```bash
# Generate new token
npm run wordpress:token

# Set environment variable
export WORDPRESS_API_TOKEN="your_new_token"
```

## 📊 Content Verification Checklist

### Before Publishing
- [ ] Content length > 1000 characters
- [ ] All sections present in extraction
- [ ] JSX structure simplified
- [ ] Single prose div contains all content

### After Publishing
- [ ] Check WordPress post URL
- [ ] Verify all content sections displayed
- [ ] Confirm tables and formatting intact
- [ ] Test all links work properly

## 🎯 Best Practices Summary

### ✅ Do's
1. **Use Simple JSX Structure**: Single prose div, minimal nesting
2. **Test Content Extraction**: Always run `npm run crosspost:extract`
3. **Verify Content Length**: Ensure > 1000 characters
4. **Check WordPress Post**: Always verify after publishing
5. **Prepare HTML Backup**: For complex content

### ❌ Don'ts
1. **Complex Nested Structures**: Avoid deeply nested sections
2. **Multiple Prose Divs**: Use only one prose div per post
3. **React Components in Content**: Keep components outside prose div
4. **Skip Content Testing**: Always test before publishing
5. **Ignore Content Length**: Short content usually means extraction failed

## 🔧 Emergency Procedures

### Content Extraction Failed
1. Simplify JSX structure
2. Remove nested sections
3. Test extraction again
4. If still failing, use manual HTML posting

### WordPress Post Incomplete
1. Check WordPress post URL
2. If content missing, clear posted log
3. Simplify JSX and repost
4. Use manual HTML as last resort

### Token Expired
1. Generate new token: `npm run wordpress:token`
2. Update environment variables
3. Test with: `npm run crosspost:test`

## 📞 Quick Reference URLs

- **WordPress Site**: https://kumar2net.wordpress.com/
- **Netlify Site**: https://kumarsite.netlify.app/
- **GitHub Repository**: Your repository
- **Posted Content Log**: `data/wordpress-posted.json`

---

**Remember**: Always test content extraction before publishing, and keep JSX structures simple for reliable WordPress auto-publishing!


