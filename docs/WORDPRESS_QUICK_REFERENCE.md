# WordPress Auto-Publishing Quick Reference

## 🚀 Quick Start

### Test the System
```bash
# Test content extraction
npm run crosspost:extract

# Test publishing (requires API token)
npm run crosspost:test
```

### Publish Blog Posts
```bash
# Publish latest blog post
npm run crosspost:latest

# Publish all blog posts
npm run crosspost:all

# Publish specific blog post
npm run crosspost:test
```

## 📋 Available Commands

| Command | Purpose | Token Required |
|---------|---------|----------------|
| `npm run crosspost:extract` | Test content extraction | ❌ No |
| `npm run crosspost:test` | Test specific blog post | ✅ Yes |
| `npm run crosspost:latest` | Publish latest blog post | ✅ Yes |
| `npm run crosspost:all` | Publish all blog posts | ✅ Yes |
| `npm run wordpress:token` | Generate API token | ❌ No |
| `npm run wordpress:setup` | Interactive setup | ❌ No |

## 🔧 Configuration

### Environment Variables
```bash
# Local development
export WORDPRESS_API_TOKEN="your_token_here"

# GitHub Actions (repository secret)
WORDPRESS_API_TOKEN = your_token_here

# Netlify (environment variable)
WORDPRESS_API_TOKEN = your_token_here
```

### WordPress.com Application
- **Client ID**: 123358
- **Site**: kumar2net.wordpress.com
- **API Base**: https://public-api.wordpress.com/rest/v1.1

## 🔄 Workflow

### Automatic Publishing
1. Create blog post in `src/pages/blog/`
2. Push to GitHub
3. GitHub Actions automatically publishes to WordPress.com

### Manual Publishing
```bash
# Via Netlify function
curl -X POST https://kumarsite.netlify.app/.netlify/functions/wordpress-auto-publish \
  -H "Content-Type: application/json" \
  -d '{"title": "My Post", "content": "<p>Content</p>", "tags": ["tag1"]}'

# Via local script
npm run crosspost:latest
```

## 📊 Content Processing

### Extracted Elements
- **Title**: From `<h1>` tags
- **Date**: From "Date:" text
- **Tags**: From badge spans
- **Content**: JSX → HTML conversion

### Supported Content
- ✅ Text and paragraphs
- ✅ Tables and lists
- ✅ Images (path conversion)
- ✅ Basic HTML formatting
- ✅ Content badges

## 🛠️ Troubleshooting

### Common Issues
```bash
# Test content extraction
npm run crosspost:extract

# Check posted content log
cat data/wordpress-posted.json

# Test Netlify function locally
netlify dev
curl -X POST http://localhost:8888/.netlify/functions/wordpress-auto-publish \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "content": "<p>Test</p>"}'
```

### Error Messages
- **"invalid_token"**: Check API token configuration
- **"Could not extract content"**: Check JSX structure
- **Rate limiting**: Script includes delays

## 📈 Monitoring

### GitHub Actions
- Repository → Actions tab
- View workflow runs and logs

### Netlify Function
- Netlify dashboard → Functions
- View execution logs

### Posted Content
- File: `data/wordpress-posted.json`
- Tracks: file paths, post IDs, URLs, timestamps

## 🎯 URLs

- **Netlify Site**: https://kumarsite.netlify.app/
- **WordPress Site**: https://kumar2net.wordpress.com/
- **Netlify Function**: https://kumarsite.netlify.app/.netlify/functions/wordpress-auto-publish

## ✅ Status

**System Status**: ✅ LIVE AND WORKING
- ✅ API Connection: Working
- ✅ Content Processing: Working
- ✅ Automatic Publishing: Working
- ✅ Error Handling: Working
- ✅ Duplicate Prevention: Working

---

**Last Updated**: August 23, 2025


