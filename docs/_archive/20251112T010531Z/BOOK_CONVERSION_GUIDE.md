# Book Conversion Guide

**Last Updated:** August 8, 2025

This guide outlines the standardized process for converting PDF books to markdown format for the website.

## 🎯 Default Process for All Books

**All books going forward should follow this markdown-based process:**

1. **PDF Source**: Place PDF files in `docs/` directory
2. **Markdown Conversion**: Convert to markdown using the conversion script
3. **Content Display**: Use BookDynamic component to render markdown files
4. **Navigation**: Link directly to markdown files via `/books/:slug` route

## 📋 Conversion Steps

### Step 1: Prepare PDF File
```bash
# Place PDF in docs directory
cp your-book.pdf docs/Your_Book_Title.pdf
```

### Step 2: Convert PDF to Markdown
```bash
# Use the conversion script
node scripts/convert-pdf-to-md.mjs docs/Your_Book_Title.pdf
```

### Step 3: Review and Edit Markdown
- Check the generated markdown file in `src/pages/books/`
- Edit frontmatter (title, author, description, tags, date)
- Clean up formatting and structure
- Add any missing content or corrections

### Step 4: Update Books Page
- Add book entry to `src/pages/Books.jsx`
- Link to `/books/your-book-slug` (markdown route)
- Add appropriate tags and description

### Step 5: Test and Deploy
- Test the book page locally
- Commit and push changes
- Verify deployment

## 🔧 Technical Implementation

### BookDynamic Component
- **File**: `src/pages/books/BookDynamic.jsx`
- **Purpose**: Renders markdown files with consistent styling
- **Features**: 
  - Automatic markdown rendering
  - Back to Books navigation
  - Responsive design
  - Framer Motion animations

### Route Configuration
```javascript
// In App.jsx
<Route path="/books/:slug" element={<BookDynamic />} />
```

### Markdown File Structure
```markdown
---
title: "Book Title"
author: "Author Name"
description: "Brief description of the book"
tags: ["tag1", "tag2", "tag3"]
date: "YYYY-MM-DD"
---

# Book Title

*By Author Name*

---

## Content starts here...
```

## 📚 Current Books Status

### ✅ Converted to Markdown
1. **Atheism: A Wonderful World Without Religion** by Tom Miles
   - **File**: `src/pages/books/atheism.md`
   - **Route**: `/books/atheism`
   - **Status**: ✅ Live

2. **The Brain: The Story of You** by David Eagleman
   - **File**: `src/pages/books/the-brain-story.md`
   - **Route**: `/books/the-brain-story`
   - **Status**: ✅ Live

### 📖 Legacy Books (JSX Components)
1. **Applying the Cornell Method**
   - **File**: `src/pages/books/applying-cornell-method.jsx`
   - **Route**: `/books/applying-cornell-method`
   - **Status**: ⚠️ Needs conversion

## 🛠️ Conversion Script

### Usage
```bash
node scripts/convert-pdf-to-md.mjs <pdf-file-path>
```

### Example
```bash
node scripts/convert-pdf-to-md.mjs docs/The_Brain_The_Story.pdf
```

### Features
- Automatic filename generation
- Frontmatter template
- Text cleaning and formatting
- Chapter detection
- Error handling

## 📁 File Structure

```
src/pages/books/
├── BookDynamic.jsx           # Dynamic markdown renderer
├── atheism.md               # Atheism book (markdown)
├── the-brain-story.md       # Brain book (markdown)
├── applying-cornell-method.jsx  # Legacy JSX component
└── ...
```

## 🎨 Styling

### Markdown Rendering
- Uses `react-markdown` with `remark-gfm`
- Tailwind CSS prose classes
- Responsive design
- Consistent typography

### Content Badges
- NEW/UPDATED indicators automatically applied
- Based on system dates
- Auto-expiration after 7/30 days

## 🔄 Migration Process

### For Legacy JSX Books
1. Extract content from JSX component
2. Create markdown file with proper frontmatter
3. Update Books.jsx to link to markdown route
4. Test and remove old JSX component
5. Update documentation

### Example Migration
```bash
# 1. Create markdown file
cp src/pages/books/applying-cornell-method.jsx src/pages/books/applying-cornell-method.md

# 2. Edit markdown file with proper structure
# 3. Update Books.jsx link
# 4. Test and deploy
```

## 📝 Best Practices

### Content Organization
- Use clear, descriptive filenames
- Include comprehensive frontmatter
- Organize content with proper headings
- Add relevant tags for categorization

### Quality Assurance
- Review converted content for accuracy
- Check formatting and readability
- Test on different screen sizes
- Verify all links work correctly

### Performance
- Optimize images and media
- Use appropriate file sizes
- Monitor load times
- Implement lazy loading where needed

## 🚀 Future Enhancements

### Planned Features
- [ ] Automatic PDF text extraction
- [ ] AI-powered content summarization
- [ ] Interactive reading progress
- [ ] Book search functionality
- [ ] Reading time estimates
- [ ] Social sharing features

### Technical Improvements
- [ ] Better PDF parsing accuracy
- [ ] Enhanced markdown formatting
- [ ] Improved error handling
- [ ] Performance optimizations
- [ ] Accessibility enhancements

---

**Note**: This process ensures consistency across all books and provides a better user experience with faster loading times and improved maintainability.


