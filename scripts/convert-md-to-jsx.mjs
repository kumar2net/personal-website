#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, '../src/pages/blog');

function convertMarkdownToJSX(mdContent, frontmatter, filename) {
  const title = frontmatter.title || 'Untitled';
  const date = frontmatter.date ? new Date(frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown Date';
  
  const tags = frontmatter.tags || [];
  const author = frontmatter.author || 'Kumar';
  const excerpt = frontmatter.excerpt || '';
  const featuredImage = frontmatter.featured_image || null;
  
  const tagElements = tags.map(tag => 
    `<span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">${tag}</span>`
  ).join('\n        ');
  
  const featuredImageElement = featuredImage ? 
    `<img src="${featuredImage}" alt="${title}" className="w-full h-64 object-cover rounded-lg mb-8" />` : '';

  return `import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import BlogInteractions from '../../components/BlogInteractions';

const ${filename.charAt(0).toUpperCase() + filename.slice(1).replace(/[-_]/g, '')} = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>
      
      <h1 className="text-4xl font-bold mb-6">${title}</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Date: ${date}</span>
        <span className="mx-2">•</span>
        <span>By ${author}</span>
      </div>

      ${featuredImageElement}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        ${tagElements}
      </div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          ${excerpt ? `<p className="text-lg text-gray-700 mb-8 italic">${excerpt}</p>` : ''}
          
          <div dangerouslySetInnerHTML={{ __html: \`${mdContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
        </div>
        
        <BlogInteractions articleRef={articleRef} />
      </div>
    </motion.div>
  );
};

export default ${filename.charAt(0).toUpperCase() + filename.slice(1).replace(/[-_]/g, '')};
`;
}

function processMarkdownFiles() {
  const files = fs.readdirSync(blogDir);
  
  files.forEach(file => {
    if (file.endsWith('.md') && file !== '_template.md') {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      try {
        const { data: frontmatter, content: mdContent } = matter(content);
        const filename = path.basename(file, '.md');
        const jsxContent = convertMarkdownToJSX(mdContent, frontmatter, filename);
        
        const jsxFilePath = path.join(blogDir, `${filename}.jsx`);
        fs.writeFileSync(jsxFilePath, jsxContent);
        
        console.log(`✅ Converted ${file} to ${filename}.jsx`);
        
        // Optionally delete the markdown file
        // fs.unlinkSync(filePath);
        // console.log(`🗑️  Deleted ${file}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
  });
}

// Run the conversion
processMarkdownFiles();
