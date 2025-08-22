import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

const jsxModules = import.meta.glob('/src/pages/books/*.jsx');
const mdModules = import.meta.glob('/src/pages/books/*.md', { query: '?raw', import: 'default' });

// Function to strip frontmatter from markdown content
function stripFrontmatter(content) {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterEndIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        frontmatterEndIndex = i;
        break;
      }
    }
  }
  
  if (frontmatterEndIndex !== -1) {
    return lines.slice(frontmatterEndIndex + 1).join('\n');
  }
  
  return content;
}

export default function BookDynamic() {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState('');

  const LazyComponent = useMemo(() => {
    const path = `/src/pages/books/${slug}.jsx`;
    if (jsxModules[path]) {
      return React.lazy(jsxModules[path]);
    }
    return null;
  }, [slug]);

  useEffect(() => {
    const path = `/src/pages/books/${slug}.md`;
    if (mdModules[path]) {
      mdModules[path]().then((raw) => {
        const content = raw || '';
        const strippedContent = stripFrontmatter(content);
        setMarkdown(strippedContent);
      });
    } else {
      setMarkdown('');
    }
  }, [slug]);

  if (LazyComponent) {
    return (
      <Suspense fallback={<div>Loading…</div>}>
        <LazyComponent />
      </Suspense>
    );
  }

  if (markdown) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <Link to="/books" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Books
          </Link>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/books" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Books
        </Link>
      </div>
      <div className="text-gray-600">Book not found.</div>
    </div>
  );
}
