# Blog Interactions Guide

## Overview
Like and comment functionality for blog posts using Netlify Functions and Blobs.

## Components

### 1. Netlify Function: `blog-interactions.js`
- Handles likes and comments
- Uses Netlify Blobs for storage
- CORS-enabled

### 2. React Component: `BlogInteractions.jsx`
- Like/unlike button with visual feedback and clear "Like" label
- Comment form and list with clear "Comment" label
- Smooth animations using Framer Motion
- **Mock API for local development** - Works without Netlify Blobs in dev mode
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
- No Netlify Blobs dependency required
- Works immediately with `npm run dev`
- Data persists during development session

### Production Mode
- Uses **real Netlify Functions** with Blobs storage
- Automatically deployed with your site
- Persistent data storage

## API Actions

- `like` / `unlike` - Toggle post likes
- `get-likes` - Get like count
- `add-comment` - Add new comment
- `get-comments` - Get all comments
- `delete-comment` - Remove comment

## Storage

- **Development**: In-memory storage (resets on page refresh)
- **Production**: Netlify Blobs with automatic configuration

## Deployment

Automatically deployed with your Netlify site. Test locally with `netlify dev`.
