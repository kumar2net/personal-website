# Personal Website

A modern, performant personal website built with React, featuring a blog, portfolio, and various interactive components.

## 🚀 Features

### Core Features
- **Blog System**: Markdown-based blog posts with Disqus comments
- **Portfolio**: Professional showcase of work and projects
- **Album**: Photo and video gallery with mobile optimization
- **Books**: PDF content extraction and book reviews
- **Music**: Audio player with playlist management
- **Analytics**: Google Analytics 4 integration with topic suggestions

### Technical Features
- **PDF Processing**: Advanced PDF content extraction using pdfjs-dist
- **Semantic Search**: AI-powered search functionality
- **Content Summarization**: Automated TL;DR generation
- **Mobile Optimization**: Responsive design with mobile-specific handling
- **Performance**: Optimized bundle size and loading times
- **Security**: Comprehensive CSP headers and error boundaries

### Development Features
- **Code Quality**: Biome linting and formatting
- **Testing**: Comprehensive test suite (unit, e2e, accessibility)
- **Code Analysis**: CodeMon for unused code detection
- **Automated Workflows**: Pre-deployment checks and validation

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Framer Motion**: Smooth animations and transitions

### Content Processing
- **pdfjs-dist**: Advanced PDF text extraction and processing
- **react-markdown**: Markdown rendering in React
- **gray-matter**: Frontmatter parsing
- **mammoth**: DOCX to Markdown conversion
- **turndown**: HTML to Markdown conversion

### Analytics & Search
- **Google Analytics 4**: Comprehensive analytics
- **Semantic Search**: AI-powered content search
- **Topic Suggestions**: Automated content recommendations

### Comments & Interaction
- **Disqus**: Third-party commenting system
- **Lazy Loading**: Performance-optimized comment loading

### Development Tools
- **Biome**: Fast linter and formatter
- **CodeMon**: Code analysis and cleanup
- **ESLint**: Additional linting rules
- **Netlify CLI**: Local development and deployment

## 📁 Project Structure

```
personal-website/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components and blog posts
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external service integrations
│   ├── utils/              # Utility functions
│   └── shared/             # Shared types and constants
├── scripts/                # Node.js automation scripts
├── docs/                   # Documentation and guides
├── netlify/
│   └── functions/          # Netlify serverless functions
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/personal-website.git
cd personal-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test:all        # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # End-to-end tests
npm run test:viewport   # Mobile responsiveness tests

# Code Quality
npm run biome:check     # Check code quality
npm run biome:fix       # Fix code quality issues
npm run quality:check   # Full quality check
npm run quality:fix     # Fix all quality issues

# Content Management
npm run cms:convert     # Convert markdown to JSX
npm run sitemap         # Generate sitemap
npm run ga:topics       # Generate topic suggestions

# Cleanup
npm run cleanup:quick   # Quick cleanup
npm run cleanup:full    # Full cleanup
npm run clean:whistle   # Complete cleanup and optimization
```

## 📝 Content Management

### Adding Blog Posts
1. Create a new `.jsx` file in `src/pages/blog/`
2. Use the blog post template with frontmatter
3. Add Disqus comments component
4. Update the blog index if needed

### PDF Content Extraction
```bash
# Extract PDF content to markdown
node scripts/extract-pdf-content.mjs

# Extract utility bill data
node scripts/extract-utility-bills.mjs
```

### Converting Documents
```bash
# Convert DOCX to Markdown
npm run convert:books
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
# Google Analytics
GA_MEASUREMENT_ID=your-ga-id
GA_PRIVATE_KEY_ID=your-private-key
GA_PRIVATE_KEY=your-private-key
GA_CLIENT_EMAIL=your-client-email
GA_CLIENT_ID=your-client-id

# Other services
DISQUS_SHORTNAME=your-disqus-shortname
```

### Biome Configuration
The project uses Biome for code quality. Configuration is in `biome.json`:
- Linting rules for code quality
- Formatting rules for consistency
- Security-focused configuration

### Netlify Configuration
Netlify configuration is in `netlify.toml`:
- Edge functions for CSP headers
- Build settings and redirects
- Function configurations

## 🧪 Testing

### Test Types
- **Unit Tests**: Component functionality and utilities
- **Integration Tests**: API interactions and data flow
- **End-to-End Tests**: User workflows and interactions
- **Accessibility Tests**: WCAG compliance
- **Performance Tests**: Load times and responsiveness
- **Security Tests**: Vulnerability scanning

### Running Tests
```bash
# Run all tests
npm run test:all

# Run specific test types
npm run test:unit
npm run test:e2e
npm run test:viewport

# Pre-deployment testing
npm run test:pre-deploy
```

## 🚀 Deployment

### Netlify Deployment
The site is automatically deployed to Netlify:
- **URL**: https://kumarsite.netlify.app
- **Branch**: `master`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### Pre-deployment Checklist
```bash
# Run pre-deployment checks
npm run pre-deploy

# This includes:
# - Unit tests
# - End-to-end tests
# - Build verification
# - Quality checks
```

## 📊 Performance

### Current Metrics
- **Bundle Size**: ~200KB (92% reduction from original)
- **Lighthouse Score**: >90 across all categories
- **Load Time**: <2 seconds
- **Mobile Performance**: Optimized for all devices

### Optimization Features
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components and images
- **Tree Shaking**: Unused code elimination
- **Minification**: Production build optimization
- **Caching**: Efficient asset caching

## 🔒 Security

### Security Features
- **Content Security Policy**: Comprehensive CSP headers
- **Error Boundaries**: Graceful error handling
- **Input Validation**: Data sanitization
- **Dependency Auditing**: Regular security scans
- **HTTPS**: Secure connections

### CSP Configuration
The site implements comprehensive CSP headers via Netlify Edge Functions:
- Script source restrictions
- Style source controls
- Frame ancestor policies
- Object source restrictions

## 📚 Documentation

### Key Documentation Files
- `docs/JANUARY_2025_UPDATE_SUMMARY.md` - Comprehensive update summary
- `docs/COMPREHENSIVE_TESTING_FRAMEWORK.md` - Testing framework details
- `docs/ANALYTICS_SYSTEM_DOCUMENTATION.md` - Analytics setup and usage
- `docs/SEO_SETUP.md` - SEO configuration and optimization
- `docs/CONTENT_STYLE_GUIDE.md` - Content creation guidelines

### Recent Changes
- **WordPress Integration**: Removed in favor of manual cross-posting
- **PlantUML**: Removed, using Mermaid diagrams instead
- **PDF Libraries**: Consolidated to pdfjs-dist only
- **Code Quality**: Enhanced with Biome and CodeMon
- **Bundle Size**: 92% reduction through optimization

## 🤝 Contributing

### Development Workflow
1. Create a feature branch
2. Make your changes
3. Run tests and quality checks
4. Submit a pull request

### Code Quality Standards
- Follow Biome linting rules
- Write comprehensive tests
- Update documentation
- Ensure mobile responsiveness
- Maintain accessibility standards

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
1. Check the documentation in the `docs/` directory
2. Review recent changes in `docs/JANUARY_2025_UPDATE_SUMMARY.md`
3. Run the test suite to identify issues
4. Check the deployment status and logs

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
