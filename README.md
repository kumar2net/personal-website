# Personal Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/38e812a5-b162-4c0a-a9c7-c59a4b497fcd/deploy-status)](https://app.netlify.com/projects/kumarsite/deploys)

A modern, responsive personal website built with React, featuring a blog, portfolio, and various interactive features. The site is optimized for performance, security, and user experience.

## 🚀 **Live Site**

**Production URL**: https://kumarsite.netlify.app

## 📝 **Recent Updates (January 2025)**

### **New Blog Post: "Common Sense is a Rare Commodity"**
- ✅ **Created comprehensive blog post** - Analysis of India-US trade relations and tariff policies
- ✅ **Interactive comment system** - Netlify Forms with localStorage fallback for reliability
- ✅ **Like functionality** - Interactive like button with visual feedback
- ✅ **Accessibility compliance** - Full WCAG guidelines with ARIA labels and screen reader support
- ✅ **SEO optimization** - Integrated into blog array and SEO index with dynamic dates
- ✅ **Image integration** - Tag cloud visualization of trade relations concepts
- ✅ **Production deployment** - Successfully deployed and tested on live site

### **Technical Improvements**
- Implemented hybrid comment storage (Netlify Forms + localStorage fallback)
- Enhanced form validation and error handling
- Added comprehensive accessibility features
- Improved user experience with loading states and success messages
- Fixed React warnings and console errors
- Added proper ARIA labels and live regions for dynamic content

## 🎯 **Features**

### **Core Features**
- **Responsive Blog** - Modern blog with markdown support and interactive comments
- **Interactive Comment System** - Netlify Forms with localStorage fallback for reliability
- **Like Functionality** - Interactive like buttons with visual feedback
- **Portfolio Showcase** - Professional portfolio section
- **Music Curation** - Latest additions to KUMAR_2005 playlist with artist information
- **Interactive Components** - Dynamic content and animations
- **SEO Optimized** - Route-level titles, descriptions, canonical, OG/Twitter, JSON-LD
- **Elsewhere Hub** - WordPress posts feed + prominent X (Twitter) link
- **Performance Focused** - Fast loading and optimized bundle

### **Technical Features**
- **React 18** - Latest React with modern features
- **Vite** - Fast development and optimized builds
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **PDF Processing** - PDF content extraction and display
- **Analytics** - Google Analytics 4 integration

### **Development Features**
- **Biome** - Advanced linting and formatting (33% error reduction achieved)
- **ES Modules** - Modern JavaScript module system for Netlify functions
- **CORS Support** - Cross-origin resource sharing for WordPress integration
- **Comprehensive Testing** - Unit, E2E, and accessibility tests
- **Security Headers** - CSP and security policies
- **Automated Deployment** - Netlify CI/CD

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Routing
- **Framer Motion** - Animations

### **Content Processing**
- **React Markdown** - Markdown rendering
- **Gray Matter** - Front matter parsing
- **PDF.js** - PDF content extraction
- **Mammoth** - DOCX to Markdown conversion

### **Development Tools**
- **Biome** - Linting and formatting
- **CodeMon** - Code cleanup and analysis
- **Netlify CLI** - Deployment tools
- **ESLint** - Code quality

### **Deployment**
- **Netlify** - Hosting and CDN
- **Netlify Functions** - Serverless functions (ES modules)
- **GitHub** - Version control
- **CORS Headers** - Cross-origin support for WordPress integration

### **SEO**
- **react-helmet-async** provider and a reusable `SEO` component
- Structured data: Person + Article JSON-LD
- Internal linking and canonical URLs

## 📁 **Project Structure**

```
personal-website/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   │   ├── blog/           # Blog posts
│   │   └── books/          # Book content
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and utility services
│   └── utils/              # Utility functions
├── scripts/                # Build and utility scripts
├── docs/                   # Documentation
├── netlify/
│   └── functions/          # Serverless functions
├── backend/                 # Express backend (GA4 topic recommender)
└── public/                 # Static assets
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone https://github.com/kumar2net/personal-website.git
cd personal-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Development Commands**
```bash
# Development
npm run dev              # Start dev server
npm run dev:netlify      # Start with Netlify functions

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test:all        # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # End-to-end tests

# Code Quality
npm run biome:check     # Lint code
npm run biome:format    # Format code
npm run clean:whistle   # Full cleanup

# Content Management
npm run convert:books   # Convert DOCX to Markdown
npm run semantic:index  # Index semantic search
npm run sitemap         # Generate sitemap
```

## 📝 **Content Management**

### **Adding Blog Posts**
1. Create a new `.jsx` file in `src/pages/blog/`
2. Use the existing blog post structure as template
3. Add metadata and content
4. Update the blog listing in `src/pages/Blog.jsx`

### **Adding Books**
1. Place PDF files in `docs/`
2. Run `npm run convert:books` to extract content
3. Create book pages in `src/pages/books/`

### **Content Conversion**
- **DOCX to Markdown**: `npm run convert:books`
- **PDF Content Extraction**: Automated via scripts
- **Image Optimization**: Manual optimization recommended

## 🧪 **Testing**

### **Test Types**
- **Unit Tests**: Component functionality
- **E2E Tests**: User workflows
- **Accessibility Tests**: WCAG compliance
- **Performance Tests**: Load times and responsiveness
- **Security Tests**: Vulnerability scanning

### **Running Tests**
```bash
npm run test:all        # All tests
npm run test:unit       # Unit tests
npm run test:e2e        # E2E tests
npm run test:pre-deploy # Pre-deployment checks
```

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file for local development:
```env
VITE_GA_MEASUREMENT_ID=G-PZ37S6E5BL
VITE_SEMANTIC_SEARCH_API=your-api-url
# X API (optional, used for graceful Elsewhere fallback)
X_BEARER_TOKEN=your-x-bearer-token
```

### **Netlify Configuration**
- `netlify.toml` - Build and deployment settings
- `netlify/functions/` - Serverless functions
- Edge functions for security headers

## 🚀 **Deployment**

### **Automatic Deployment**
- **Production**: Automatic deployment on push to `master`
- **Preview**: Automatic deployment on pull requests
- **Functions**: Automatic deployment of serverless functions

### **Manual Deployment**
```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

## 📊 **Performance**

### **Optimizations**
- **Code Splitting**: Dynamic imports for better loading
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format and lazy loading
- **Caching**: Aggressive caching strategies
- **CDN**: Global content delivery via Netlify

### **Metrics**
- **Bundle Size**: 3.01MB (optimized, 651.38 kB gzipped)
- **Load Time**: <2 seconds
- **Lighthouse Score**: >90 across all metrics
- **Mobile Performance**: Optimized for mobile devices
- **Code Quality**: 33% reduction in linting errors (370 → 247)

## 🔒 **Security**

### **Security Measures**
- **Content Security Policy (CSP)**: XSS protection
- **HTTPS Enforcement**: Secure connections only
- **Permissions Policy**: Enhanced privacy controls
- **Input Validation**: Data sanitization
- **Dependency Audits**: Regular security scanning

### **Security Headers**
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

## 📈 **Analytics**

### **Google Analytics 4**
- Page view tracking
- User behavior analysis
- Performance monitoring
- Custom event tracking

### **GA4 Topic Recommender (New)**
- Branch: merged to `master`
- Backend endpoint: `GET /api/recommendations/topics?days={1|7|14}&limit={1..25}&language=en`
- Backend lives in `backend/` (Express). See `backend/README.md` for full details.
- Vertex model: `gemini-2.5-flash-lite` (us-central1)
- GA4 → BigQuery (US): dataset `analytics_12010944378`, table pattern `events*` (daily + intraday)

Quick start (local):
```bash
# 1) Backend env (backend/.env)
GCP_PROJECT_ID=my-project-74001686249
GCP_LOCATION=us-central1
GA4_DATASET=analytics_12010944378
GA4_TABLE=events*
BIGQUERY_LOCATION=US
RECOMMENDER_MODEL=gemini-2.5-flash-lite

# 2) Run backend (from backend/)
cd backend && PORT=3001 node server.js

# 3) Test endpoints
curl -s "http://localhost:3001/api/health"
curl -s "http://localhost:3001/api/recommendations/topics?days=7&limit=8&language=en"
```

Notes:
- Until GA4 export creates tables, the endpoint returns an empty `topics: []` (no placeholders).
- GA measurement ID embedded in `index.html`: `G-PZ37S6E5BL` (immediately after `<head>` element as per Google instructions).
- Tag Assistant: Connected on September 3, 2025. Use Tag Assistant Connect; GTM preview is not applicable (no GTM container on the site).

### **Performance Monitoring**
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Error tracking and reporting

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:all`
5. Submit a pull request

### **Code Standards**
- Follow Biome linting rules
- Write comprehensive tests
- Update documentation
- Follow React best practices

## 📚 **Documentation**

### **Available Documentation**
- `docs/JANUARY_2025_UPDATE_SUMMARY.md` - Recent updates
- `docs/ANALYTICS_README.md` - Analytics setup
- `docs/CONTENT_STYLE_GUIDE.md` - Content guidelines
- `docs/DEPLOYMENT_STATUS.md` - Deployment information
- `docs/SEO_SETUP.md` - SEO configuration
- `docs/ELSEWHERE_INTEGRATION.md` - WordPress + X integration (Elsewhere)
- `docs/naruviwater/` - Naruvi Water Management Report documentation

### **Specialized Reports**
- **Naruvi Water Management Report** (`/naruvi`) - Comprehensive water management analysis for gated communities
  - Technical analysis and cost estimates
  - Mobile-optimized web presentation
  - Professional engineering recommendations
  - Accessible via direct URL for discrete access

## 🔗 **Links**

- **Live Site**: https://kumarsite.netlify.app
- **GitHub Repository**: https://github.com/kumar2net/personal-website
- **Netlify Dashboard**: https://app.netlify.com/projects/kumarsite
- **Documentation**: `/docs` directory

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

---

**Last Updated**: January 15, 2025  
**Status**: Production ready, optimized, and actively maintained

## 🆕 **Recent Updates (January 2025)**

### **Code Quality Improvements**
- ✅ **33% Error Reduction**: Reduced linting errors from 370 to 247
- ✅ **ES Module Migration**: Converted all Netlify functions to modern ES modules
- ✅ **CORS Integration**: Fixed WordPress feed CORS policy errors
- ✅ **Accessibility**: Enhanced SVG titles and button types
- ✅ **React Optimization**: Improved hook dependencies and performance

### **WordPress Integration**
- ✅ **CORS Headers**: Added comprehensive CORS support for cross-origin requests
- ✅ **Error Handling**: Robust error handling for WordPress feed failures
- ✅ **Environment Detection**: Dynamic URL construction for dev/prod environments
- ✅ **JSON Validation**: Content-type validation to prevent parsing errors

### **Technical Improvements**
- ✅ **Import Statements**: Updated to use `with` instead of deprecated `assert`
- ✅ **Template Literals**: Replaced string concatenation with template literals
- ✅ **Array Keys**: Fixed React key prop issues for better performance
- ✅ **Optional Chaining**: Modernized conditional checks
