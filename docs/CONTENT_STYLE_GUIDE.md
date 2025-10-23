# Content Style Guide

## 📝 **Content Guidelines**

This guide outlines the standards and best practices for creating and managing content on the personal website.

## 🎯 **Content Types**

### **Blog Posts**
- **Format**: JSX files in `src/pages/blog/`
- **Structure**: React components with metadata
- **Comments**: Currently disabled (Disqus removed, alternative system planned)
- **SEO**: Meta tags and structured data

### **Portfolio Items**
- **Format**: JSX components in portfolio section
- **Content**: Project descriptions, links, and images
- **Updates**: Regular portfolio updates

### **Book Content**
- **Format**: PDF extraction to markdown
- **Location**: `src/pages/books/`
- **Processing**: Automated via scripts

## 📋 **Blog Post Guidelines**

### **File Structure**
```jsx
// Example blog post structure
import React from 'react';
import { motion } from 'framer-motion';

const BlogPost = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Post Title
          </h1>
          <div className="text-gray-600">
            <time>January 2025</time>
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none">
          {/* Content goes here */}
        </div>
      </article>
    </motion.div>
  );
};

export default BlogPost;
```

### **Content Standards**
- **Tone**: Professional yet personal
- **Length**: 500-2000 words recommended
- **Formatting**: Use Tailwind CSS classes
- **Images**: Optimized and responsive
- **Links**: Include relevant external links

### **SEO Best Practices**
- **Title**: Clear, descriptive titles
- **Meta Description**: 150-160 characters
- **Keywords**: Natural keyword integration
- **Headings**: Proper heading hierarchy (H1, H2, H3)
- **Alt Text**: Descriptive image alt text

## 🖼️ **Image Guidelines**

### **Image Requirements**
- **Format**: WebP preferred, JPG/PNG acceptable
- **Size**: Optimized for web (max 1MB)
- **Dimensions**: Responsive design considerations
- **Alt Text**: Descriptive and accessible

### **Image Usage**
```jsx
// Example image component
<img
  src="/media/image.jpg"
  alt="Descriptive alt text"
  className="w-full h-auto rounded-lg shadow-md"
  loading="lazy"
/>
```

## 📚 **Book Content Guidelines**

### **PDF Processing**
- **Source**: PDF files in `docs/` directory
- **Extraction**: Automated via `npm run convert:books`
- **Output**: Markdown files in `src/pages/books/`

### **Book Structure**
```jsx
// Example book page structure
import React from 'react';
import { motion } from 'framer-motion';

const BookPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Book Title</h1>
        <div className="prose prose-lg max-w-none">
          {/* Extracted content */}
        </div>
      </div>
    </motion.div>
  );
};

export default BookPage;
```

## 🔗 **Link Guidelines**

### **Internal Links**
- Use React Router `Link` components
- Maintain consistent navigation
- Update blog index when adding posts

### **External Links**
- Include `target="_blank"` for external links
- Add `rel="noopener noreferrer"` for security
- Verify links are active and relevant

## 📱 **Mobile Considerations**

### **Responsive Design**
- **Text**: Readable on mobile devices
- **Images**: Responsive sizing
- **Navigation**: Touch-friendly
- **Loading**: Optimized for mobile networks

### **Mobile Testing**
- Test on actual devices
- Verify touch interactions
- Check readability and spacing
- Ensure no horizontal scrolling

## 🎨 **Styling Guidelines**

### **Tailwind CSS Usage**
- **Consistency**: Use established design patterns
- **Responsive**: Mobile-first approach
- **Accessibility**: High contrast and readable fonts
- **Performance**: Optimize for fast loading

### **Typography**
- **Headings**: Clear hierarchy
- **Body Text**: Readable font sizes
- **Line Height**: Adequate spacing
- **Color**: High contrast for accessibility

## 🔍 **SEO Guidelines**

### **Meta Tags**
```jsx
// Example meta tags
<Helmet>
  <title>Page Title | Kumar's Website</title>
  <meta name="description" content="Page description" />
  <meta name="keywords" content="relevant, keywords" />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Page description" />
  <meta property="og:image" content="/media/og-image.jpg" />
</Helmet>
```

### **Structured Data**
- Include JSON-LD structured data
- Mark up articles and blog posts
- Add schema.org markup where appropriate

## 📊 **Content Management**

### **Adding New Content**
1. **Blog Posts**: Create JSX file in `src/pages/blog/`
2. **Books**: Add PDF to `docs/` and run conversion script
3. **Portfolio**: Update portfolio components
4. **Images**: Add to `public/media/` directory

### **Content Updates**
- **Regular Reviews**: Monthly content review
- **Link Checks**: Verify external links
- **Performance**: Optimize images and content
- **SEO**: Update meta tags and descriptions

## 🧪 **Quality Assurance**

### **Content Review Checklist**
- [ ] Grammar and spelling checked
- [ ] Links verified and working
- [ ] Images optimized and responsive
- [ ] SEO meta tags included
- [ ] Mobile responsiveness tested
- [ ] Accessibility standards met

### **Testing Process**
```bash
# Run content-related tests
npm run test:all

# Check for broken links
npm run test:e2e

# Verify mobile responsiveness
npm run test:viewport
```

## 📈 **Analytics Integration**

### **Google Analytics 4**
- **Page Views**: Automatic tracking
- **Events**: Custom event tracking
- **User Behavior**: Engagement metrics
- **Performance**: Core Web Vitals

### **Content Performance**
- **Page Load Times**: Monitor performance
- **User Engagement**: Track time on page
- **Bounce Rate**: Optimize for engagement
- **Conversion**: Track desired actions

## 🔧 **Technical Considerations**

### **Performance**
- **Image Optimization**: Compress and resize images
- **Lazy Loading**: Implement for images and content
- **Code Splitting**: Optimize bundle size
- **Caching**: Implement proper caching strategies

### **Accessibility**
- **Alt Text**: Descriptive image alt text
- **Keyboard Navigation**: Ensure keyboard accessibility
- **Screen Readers**: Test with screen readers
- **Color Contrast**: Maintain high contrast ratios

## 📝 **Content Calendar**

### **Regular Updates**
- **Blog Posts**: Weekly or bi-weekly
- **Portfolio**: Monthly updates
- **Books**: As new content is available
- **Images**: Optimize as needed

### **Content Planning**
- **Topics**: Plan content themes
- **Keywords**: Research relevant keywords
- **Audience**: Consider target audience
- **Goals**: Align with website objectives

## 🔗 **Useful Resources**

- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Markdown**: https://github.com/remarkjs/react-markdown
- **SEO Guidelines**: https://developers.google.com/search/docs
- **Accessibility**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Last Updated**: January 2025  
**Status**: Current and actively maintained



---

## 📊 **Diagrams and Visual Content**

### **SVG Diagrams (Preferred Method)**

As of October 2025, we use custom SVG graphics instead of Mermaid diagrams for better mobile responsiveness and performance.

#### **Advantages of SVG Diagrams:**
- ✅ Perfect scaling on all devices (mobile-first responsive)
- ✅ No external dependencies (removed Mermaid library)
- ✅ Instant rendering without JavaScript initialization
- ✅ Full control over styling and layout
- ✅ Smaller bundle size (~133 packages saved)
- ✅ Better performance and faster page loads

#### **SVG Best Practices:**

1. **Use viewBox for Responsive Scaling**
   ```jsx
   <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
     {/* SVG content */}
   </svg>
   ```

2. **Responsive Text Sizing**
   ```jsx
   <text className="text-xs sm:text-sm" fill="#1e40af" fontWeight="600">Label</text>
   ```

3. **Mobile-First Containers**
   ```jsx
   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 sm:border-3 border-blue-400 rounded-xl p-4 sm:p-6 my-6 sm:my-10 shadow-xl">
     <svg viewBox="0 0 800 600" className="w-full h-auto">
       {/* SVG diagram */}
     </svg>
   </div>
   ```

4. **Arrow Markers for Flow Diagrams**
   ```jsx
   <defs>
     <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
       <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
     </marker>
   </defs>
   <line x1="100" y1="100" x2="200" y2="100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowblue)"/>
   ```

5. **Color-Coded Elements**
   - Use consistent color schemes matching the blog theme
   - Blue (#3b82f6) for general elements
   - Green (#16a34a) for positive/success states
   - Orange (#f59e0b) for processing/active states
   - Purple (#a855f7) for special features
   - Red (#dc2626) for traditional/legacy systems

#### **Example SVG Diagram Types:**

1. **Flow Diagrams**: Traditional vs Bitcoin financial systems
2. **Process Flows**: Step-by-step transaction flows
3. **Architecture Diagrams**: Lightning Network structure
4. **Comparison Diagrams**: Hierarchical vs P2P systems

#### **Deprecated: Mermaid Diagrams**

Mermaid.js diagrams have been replaced with custom SVG graphics. Do not use Mermaid for new content due to:
- ❌ Poor mobile rendering
- ❌ Large bundle size
- ❌ Initialization delays
- ❌ Limited styling control
- ❌ JavaScript dependency

If you encounter old Mermaid diagrams, convert them to SVG using the patterns demonstrated in `src/pages/blog/bitcoin-disintermediation.jsx`.

---

## 🔄 **Migration Notes**

**October 23, 2025**: All Mermaid diagrams in bitcoin-disintermediation.jsx successfully converted to mobile-responsive SVG graphics with zero dependencies.

