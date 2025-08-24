# Personal Website

A modern, responsive personal website built with React, Vite, and Tailwind CSS. Features include blog posts, book reviews, learning resources, and interactive components.

## Features

### 🚀 Core Features
- **Responsive Design** - Works perfectly on all devices
- **Blog System** - Dynamic blog posts with markdown support
- **Book Reviews** - Interactive book content with PDF extraction
- **Learning Resources** - Educational content and techniques
- **Interactive Components** - Modern UI with smooth animations

### 💬 Blog Interactions (NEW!)
- **Like/Unlike Posts** - Users can like blog posts with permanent storage
- **Comments System** - Add, view, and delete comments on blog posts
- **Real-time Updates** - Instant feedback without page refresh
- **Permanent Storage** - Data persists across page reloads and deployments
- **Beautiful UI** - Smooth animations and clear interaction labels

### 📊 Analytics & SEO
- **Google Analytics 4** - Comprehensive analytics tracking
- **Semantic Search** - AI-powered search functionality
- **SEO Optimized** - Meta tags, structured data, and performance
- **Social Media Integration** - Open Graph and Twitter cards

### 🔧 Technical Features
- **Netlify Functions** - Serverless backend for dynamic features
- **File-based Storage** - Permanent data storage without external databases
- **WordPress Integration** - Auto-publishing to WordPress
- **Image Optimization** - Automatic image processing and optimization
- **Performance Optimized** - Fast loading with code splitting

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
git clone https://github.com/kumar2net/personal-website.git
cd personal-website
npm install
```

### Development
```bash
npm run dev
```
Visit `http://localhost:5173`

### Build & Deploy
```bash
npm run build
npm run preview
```

## Blog Interactions Setup

The blog interactions feature is automatically deployed with your site. To add it to new blog posts:

```jsx
import BlogInteractions from '../../components/BlogInteractions';

// Add to your blog post component
<BlogInteractions postId="your-blog-post-id" />
```

### Features
- **Permanent Storage** - Uses file-based JSON storage (`/tmp/blog-interactions.json`)
- **No External Dependencies** - Self-contained solution
- **Cross-Environment Support** - Works in development and production
- **User-Friendly** - Clear "Like" and "Comment" labels with count badges

## Project Structure

```
personal-website/
├── src/
│   ├── components/          # React components
│   │   ├── BlogInteractions.jsx  # Like/comment functionality
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── blog/           # Blog posts
│   │   └── ...
│   └── ...
├── netlify/
│   └── functions/          # Serverless functions
│       ├── blog-interactions.js  # Backend for likes/comments
│       └── ...
├── docs/                   # Documentation
│   ├── BLOG_INTERACTIONS_GUIDE.md
│   └── ...
└── ...
```

## Documentation

- [Blog Interactions Guide](docs/BLOG_INTERACTIONS_GUIDE.md) - Complete guide to like/comment functionality
- [Analytics Setup](docs/ANALYTICS_README.md) - Google Analytics configuration
- [WordPress Integration](docs/WORDPRESS_STATUS.md) - Auto-publishing setup

## Deployment

The site is automatically deployed to Netlify on every push to the `master` branch.

**Live Site:** https://kumarsite.netlify.app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React, Vite, Tailwind CSS, and Netlify Functions.
