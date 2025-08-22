# Book Conversion Guide

## Overview

This guide explains how to convert different source formats (PDF, DOCX) into readable content for the website's Books section.

## Supported Formats

### PDF Files
- **Tool**: `pdftotext` (from poppler-utils)
- **Installation**: `brew install poppler` (macOS)
- **Usage**: `pdftotext docs/filename.pdf src/pages/books/filename.txt`

### DOCX Files
- **Tool**: Custom Node.js script
- **Script**: `scripts/convert-docx-to-md.mjs`
- **Usage**: `node scripts/convert-docx-to-md.mjs`

## Conversion Process

### Step 1: Prepare Source File
1. Place the source file (PDF/DOCX) in the `docs/` directory
2. Ensure the file has a descriptive name

### Step 2: Extract Content

#### For PDF Files:
```bash
# Extract text content
pdftotext docs/Atheism.pdf src/pages/books/atheism.txt

# Review the extracted content
cat src/pages/books/atheism.txt
```

#### For DOCX Files:
```bash
# Run the conversion script
node scripts/convert-docx-to-md.mjs

# The script will create a markdown file in src/pages/books/
```

### Step 3: Create JSX Component
1. Create a new JSX file: `src/pages/books/bookname.jsx`
2. Structure the component with proper React imports
3. Format the content with appropriate HTML elements
4. Add styling using Tailwind CSS classes

### Step 4: Add Route
1. Import the component in `src/App.jsx`
2. Add a route: `<Route path="/books/bookname" element={<BookComponent />} />`

### Step 5: Update Books Page
1. Add the book entry to `src/pages/Books.jsx`
2. Include proper metadata (title, author, description, tags)
3. Add appropriate badges and styling

## Example: Atheism Book Conversion

### Source File
- **File**: `docs/Atheism.pdf`
- **Author**: Tom Miles
- **Title**: "Atheism: A Wonderful World Without Religion"

### Conversion Steps
1. **Extract text**: `pdftotext docs/Atheism.pdf src/pages/books/atheism.txt`
2. **Review content**: Check the extracted text for formatting issues
3. **Create JSX**: Build `src/pages/books/atheism.jsx` with formatted content
4. **Add route**: Update `src/App.jsx` with the new route
5. **Update books page**: Add entry to `src/pages/Books.jsx`

### Final Structure
```
src/pages/books/
├── atheism.jsx          # Main component
├── atheism.md           # Markdown version (for reference)
└── atheism.txt          # Raw extracted text (can be deleted)
```

## Content Formatting Guidelines

### JSX Structure
```jsx
import React from 'react'
import { Link } from 'react-router-dom'

function BookName() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with back link */}
      <div className="mb-8">
        <Link to="/books" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Books
        </Link>
        <h1 className="text-4xl font-bold mb-4">Book Title</h1>
        <p className="text-gray-600 text-lg mb-2">By Author Name</p>
        {/* Tags */}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {/* Book content sections */}
      </div>
    </div>
  )
}

export default BookName
```

### Styling Classes
- **Container**: `max-w-4xl mx-auto px-4 py-8`
- **Sections**: `mb-8` for spacing
- **Headings**: `text-2xl font-semibold mb-4`
- **Paragraphs**: `mb-4`
- **Quotes**: `bg-gray-50 border-l-4 border-blue-500 p-4 mb-4`
- **Notes**: `bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8`

## Quality Checklist

- [ ] Content is properly formatted and readable
- [ ] All sections have appropriate headings
- [ ] Quotes and important text are highlighted
- [ ] Navigation works correctly
- [ ] Mobile responsiveness is maintained
- [ ] Tags and metadata are accurate
- [ ] Book appears in the correct order on the Books page

## Troubleshooting

### PDF Issues
- **Poor text extraction**: Try different PDF tools or manual transcription
- **Formatting problems**: Clean up the extracted text manually
- **Missing content**: Check if the PDF has text layers or is image-based

### DOCX Issues
- **Script errors**: Check Node.js version and dependencies
- **Formatting loss**: Review the generated markdown and adjust manually
- **Missing content**: Ensure the DOCX file is not corrupted

## Best Practices

1. **Always backup** the original source files
2. **Test thoroughly** on different devices and screen sizes
3. **Maintain consistency** with existing book styling
4. **Update documentation** when adding new books
5. **Clean up temporary files** after conversion
6. **Verify accessibility** of the final content

---

**Last Updated**: January 16, 2025


