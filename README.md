# Personal Website

A modern personal website built with React, Vite, and Tailwind CSS.

## Development

### Standard Development
```bash
npm run dev
```

### Development with Netlify Functions
To run the development server with Netlify functions (for tech trends, semantic search, etc.):

```bash
npm run dev:netlify
```

This will start both the Vite dev server and Netlify dev server, allowing you to test serverless functions locally.

### Building for Production
```bash
npm run build
```

## Features

- **Tech Trends Dashboard**: Real-time trending topics from Hacker News, GitHub, and Reddit
- **Semantic Search**: AI-powered search across blog content
- **Blog System**: Markdown-based blog with dynamic routing
- **Book Reviews**: Cornell method book notes and reviews
- **Google Analytics 4**: Automated content analysis and topic suggestions
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Analytics

The project includes Google Analytics 4 integration with automated content analysis and blog topic generation.

### Analytics Scripts

- `npm run ga:topics` - Generate general blog topic suggestions
- `npm run ga:topic-suggestions` - **MAIN** Generate specific topic suggestions based on GA4 data
- `npm run ga:config` - Show GA4 configuration details
- `npm run ga:test` - Test GA4 API connection
- `npm run ga:all` - Run all analytics scripts

### Current Recommendations

Based on your GA4 data (36 users, 14-minute sessions, 6.8% bounce rate), the system recommends focusing on:

1. **Technology** - Advanced AI Development, Machine Learning, API Development
2. **Trade & Economics** - India-US Trade Relations, Global Supply Chain Analysis
3. **Productivity & Learning** - Keyboard Shortcuts, Workflow Automation, Time Management

See `docs/GA4_ANALYTICS_DOCUMENTATION.md` for detailed documentation.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Netlify Functions
- React Router
