# Blog Interactions Guide

## Overview
Like and comment functionality for blog posts using Netlify Functions with permanent file-based storage.

## Components

### 1. Netlify Function: `blog-interactions.js`
- Handles likes and comments
- Uses file-based JSON storage for persistence
- CORS-enabled
- No external database dependencies

### 2. React Component: `BlogInteractions.jsx`
- Like/unlike button with visual feedback and clear "Like" label
- Comment form and list with clear "Comment" label
- Smooth animations using Framer Motion
- **Mock API for local development** - Works without server in dev mode
- **Clear UI labels** - "Like" and "Comment" text next to icons for better UX

## Usage

### Adding to Blog Posts

1. **Import:**
```jsx
import BlogInteractions from '../../components/BlogInteractions';
```

2. **Add component:**
```jsx
<BlogInteractions postId="your-blog-post-id" />
```

3. **Place at end of content:**
```jsx
<div className="space-y-8">
  <div className="prose prose-lg max-w-none">
    {/* Your blog content */}
  </div>
  <BlogInteractions postId="your-blog-post-id" />
</div>
```

## Development vs Production

### Development Mode
- Uses **mock API** with in-memory storage
- No server dependency required
- Works immediately with `npm run dev`
- Data persists during development session

### Production Mode
- Uses **real Netlify Functions** with file-based storage
- Automatically deployed with your site
- **Permanent data storage** - Data persists across function restarts and page reloads

## API Actions

- `like` / `unlike` - Toggle post likes
- `get-likes` - Get like count
- `add-comment` - Add new comment
- `get-comments` - Get all comments
- `delete-comment` - Remove comment

## Storage

- **Development**: In-memory storage (resets on page refresh)
- **Production**: File-based JSON storage (`/tmp/blog-interactions.json`)
- **Persistence**: Data survives function restarts, page reloads, and deployments

## Technical Details

### Storage Format
```json
{
  "likes": {
    "post-id": {
      "users": ["user-id-1", "user-id-2"],
      "totalLikes": 2
    }
  },
  "comments": {
    "post-id": [
      {
        "id": "comment-id",
        "author": "Author Name",
        "content": "Comment text",
        "timestamp": "2025-08-24T01:15:05.653Z",
        "replies": []
      }
    ]
  }
}
```

### User Identification
- Uses IP + User-Agent hash for simple user identification
- No authentication required
- Can be enhanced with proper auth later

## Deployment

Automatically deployed with your Netlify site. Test locally with `netlify dev`.

## Benefits
- ✅ **Permanent storage** - Data never gets lost
- ✅ **No external dependencies** - Self-contained solution
- ✅ **Simple and reliable** - File-based storage
- ✅ **Fast performance** - Local file I/O
- ✅ **Easy to backup** - JSON file can be exported/imported
