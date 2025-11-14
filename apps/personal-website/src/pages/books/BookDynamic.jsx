import { motion } from 'framer-motion';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import BookCover from '../../components/BookCover';
import autoBooks from '../../data/autoBooks.json';

const jsxModules = import.meta.glob('/src/pages/books/*.jsx');
const mdModules = import.meta.glob('/src/pages/books/*.md', {
  query: '?raw',
  import: 'default',
});

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
  const bookMeta = useMemo(
    () => autoBooks.find((entry) => entry.slug === slug),
    [slug]
  );
  const heroAlt = bookMeta
    ? `${bookMeta.title} cover art`
    : 'Auto-generated book cover';

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
          <Link
            to="/books"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Books
          </Link>
        </div>
        {bookMeta && (
          <div className="bg-white rounded-lg shadow mb-8 p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48">
              <div className="w-full h-72 md:h-64 rounded-lg overflow-hidden shadow">
                {bookMeta.coverImage ? (
                  <img
                    src={bookMeta.coverImage}
                    alt={heroAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <BookCover
                    bookId={bookMeta.slug}
                    title={bookMeta.title}
                    author={bookMeta.author}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">
                {bookMeta.publishDate || 'Fresh read'}
              </p>
              <h1 className="text-3xl font-bold text-gray-900">
                {bookMeta.title}
              </h1>
              <p className="text-gray-600 text-lg mt-1 mb-3">
                {bookMeta.author}
              </p>
              {bookMeta.summary && (
                <p className="text-gray-700 mb-3">{bookMeta.summary}</p>
              )}
              {Array.isArray(bookMeta.tags) && bookMeta.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {bookMeta.tags.map((tag) => (
                    <span
                      key={`${bookMeta.slug}-${tag}`}
                      className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/books"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Books
        </Link>
      </div>
      <div className="text-gray-600">Book not found.</div>
    </div>
  );
}
