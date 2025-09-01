# Personal Website

A modern, responsive personal website built with React, featuring a blog, portfolio, and various interactive features. The site is optimized for performance, security, and user experience.

## 🚀 **Live Site**

**Production URL**: https://kumarsite.netlify.app

## 🎯 **Features**

### **Core Features**
- **Responsive Blog** - Modern blog with markdown support
- **Portfolio Showcase** - Professional portfolio section
- **Interactive Components** - Dynamic content and animations
- **SEO Optimized** - Search engine friendly with meta tags
- **Performance Focused** - Fast loading and optimized bundle

### **Technical Features**
- **React 18** - Latest React with modern features
- **Vite** - Fast development and optimized builds
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **PDF Processing** - PDF content extraction and display
- **Analytics** - Google Analytics 4 integration

### **Development Features**
- **Biome** - Advanced linting and formatting
- **CodeMon** - Automated code cleanup
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
- **Netlify Functions** - Serverless functions
- **GitHub** - Version control

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
VITE_GA_MEASUREMENT_ID=your-ga-id
VITE_SEMANTIC_SEARCH_API=your-api-url
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
- **Bundle Size**: 2.11MB (optimized)
- **Load Time**: <2 seconds
- **Lighthouse Score**: >90 across all metrics
- **Mobile Performance**: Optimized for mobile devices

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

**Last Updated**: January 2025 (Updated: January 17, 2025)  
**Status**: Production ready, optimized, and actively maintained
