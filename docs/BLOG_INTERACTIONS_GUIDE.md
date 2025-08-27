# Blog Interactions Guide

## Overview
Like and comment functionality for blog posts using Netlify Functions with **permanent Netlify Blobs storage**.

## Components

### 1. Netlify Function: `blog-interactions.js`
- Handles likes and comments
- **Uses Netlify Blobs for truly persistent storage**
- Data persists across function restarts, deployments, and server migrations
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
- Uses **real Netlify Functions** with Netlify Blobs storage
- Automatically deployed with your site
- **Truly permanent data storage** - Data persists indefinitely in Netlify Blobs

## API Actions

- `like` / `unlike` - Toggle post likes
- `get-likes` - Get like count
- `add-comment` - Add new comment
- `get-comments` - Get all comments
- `delete-comment` - Remove comment

## Storage

- **Development**: In-memory storage (resets on page refresh)
- **Production**: Netlify Blobs storage (permanent, cloud-based storage)
- **Persistence**: Data survives function restarts, deployments, server migrations, and is truly permanent

## Technical Details

### Storage Implementation
- **Netlify Blobs**: A key-value store provided by Netlify
- **Automatic persistence**: No manual file management needed
- **Global distribution**: Data is stored in Netlify's infrastructure
- **No size limits**: Suitable for growing interaction data

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

Automatically deployed with your Netlify site. The Netlify Blobs storage is automatically provisioned and managed by Netlify.

### Environment Variables (Optional)
If you need to configure the storage explicitly, you can set:
- `NETLIFY_SITE_ID`: Your Netlify site ID
- `NETLIFY_AUTH_TOKEN`: Authentication token for Netlify API

These are usually handled automatically by Netlify.

## Benefits
- ✅ **Truly permanent storage** - Data stored in Netlify Blobs, never gets lost
- ✅ **No external dependencies** - Built into Netlify platform
- ✅ **Scalable** - Handles growing data without performance issues
- ✅ **Reliable** - Managed by Netlify's infrastructure
- ✅ **Zero maintenance** - No database to manage or backup
- ✅ **Global distribution** - Fast access from anywhere
