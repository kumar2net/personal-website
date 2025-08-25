# WordPress Cross-Publishing Quick Reference

## 🚀 PERMANENT SOLUTION - ONE-TIME SETUP

### Initial Setup (Do Once)
```bash
npm run wordpress:permanent-setup
```

### Test & Monitor
```bash
npm run wordpress:test-setup    # Test the permanent setup
npm run wordpress:status        # Check token status
```

## 📝 Publishing Commands

### Automatic Publishing
```bash
npm run crosspost:latest        # Publish latest blog post
npm run crosspost:all          # Publish all blog posts
```

### Manual Publishing
```bash
npm run crosspost:test          # Test specific blog post
npm run crosspost:extract       # Test content extraction
```

### Legacy Commands (Not Needed Anymore)
```bash
npm run wordpress:token         # Generate API token (legacy)
npm run wordpress:setup         # Interactive setup (legacy)
```

## 🔧 Configuration

### Environment Variables - OPTIONAL NOW
- **Local Development**: No environment variables needed
- **GitHub Actions**: `WORDPRESS_API_TOKEN` (optional)
- **Netlify**: `WORDPRESS_API_TOKEN` (optional)

### WordPress.com Application
- **Client ID**: 123358
- **Client Secret**: Configured in scripts
- **Site**: kumar2net.wordpress.com

## 📊 Content Processing

### What Gets Extracted
- **Title**: From `<h1>` tags
- **Date**: From "Date:" text
- **Tags**: From badge spans
- **Content**: JSX → HTML conversion

### Supported Content
- ✅ Text and paragraphs
- ✅ Tables and structured data
- ✅ Images (auto path conversion)
- ✅ Lists (ordered/unordered)
- ✅ HTML formatting
- ✅ Content badges

## 🔄 Workflow

### New Blog Post
1. Create blog post in `src/pages/blog/`
2. Push to GitHub
3. **Automatically publishes to WordPress** ✅

### Manual Publishing
1. Run `npm run crosspost:latest`
2. **No token management needed** ✅

## 🛠️ Troubleshooting

### Common Issues
- **Token Issues**: **AUTOMATICALLY HANDLED** ✅
- **Content Extraction**: Test with `npm run crosspost:extract`
- **Duplicate Posts**: Prevented by tracking
- **Rate Limiting**: Built-in delays

### Debug Commands
```bash
npm run wordpress:status        # Check token status
npm run crosspost:extract       # Test content extraction
cat data/wordpress-posted.json  # Check posted content
```

## 📈 Monitoring

### GitHub Actions
- Check "Actions" tab in repository
- Automatic publishing on push

### Token Status
```bash
npm run wordpress:status
```
Shows:
- Token age and days remaining
- Refresh capability
- Expiration warnings

### Posted Content
- File: `data/wordpress-posted.json`
- Tracks: file paths, post IDs, URLs, timestamps

## 🎯 URLs

- **Netlify Site**: https://kumarsite.netlify.app/
- **WordPress Site**: https://kumar2net.wordpress.com/
- **Latest Post**: https://kumar2net.wordpress.com/2025/08/25/%f0%9f%8c%8d-global-economic-concerns-a-2025-pew-research-perspective/

## 🎉 Benefits - PERMANENT SOLUTION

### Before (Legacy)
- ❌ Manual token generation every 30 days
- ❌ Environment variable management
- ❌ Token expiration issues
- ❌ Manual intervention required

### After (Permanent)
- ✅ One-time setup, works forever
- ✅ Automatic token refresh
- ✅ No environment variables needed
- ✅ No manual intervention
- ✅ Works with all platforms

## 📁 File Structure

```
scripts/
├── wordpress-crosspost.mjs      # Main publishing (ENHANCED)
├── wordpress-permanent-setup.mjs # PERMANENT SETUP (NEW)
├── wordpress-auto-refresh.mjs   # AUTO-REFRESH (NEW)
└── wordpress-test.mjs           # Content extraction

data/
├── wordpress-posted.json        # Posted content tracking
└── wordpress-token.json         # PERMANENT TOKENS (NEW)
```

## 🚀 Getting Started

### For New Users
1. `npm run wordpress:permanent-setup`
2. `npm run wordpress:test-setup`
3. `npm run crosspost:latest`

### For Future Posts
1. Create blog post in `src/pages/blog/`
2. Push to GitHub
3. **That's it!** ✅

---

**🎉 PERMANENT SOLUTION: Set once, works forever!**

**No more token management headaches!**


