import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiBookOpen } from 'react-icons/hi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import markdownContent from './applying-cornell-method.md?raw';

const lines = markdownContent.split('\n');
const title = lines[0].replace(/^#\s*/, '');
const body = lines.slice(1).join('\n');

function ApplyingCornellMethodMd() {
  const [_coverUrl, _setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop'
  );

  useEffect(() => {
    // Using static placeholder cover as requested
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-6 sm:py-8"
    >
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          {title || 'Applying the Cornell Method'}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          <img
            loading="lazy"
            decoding="async"
            src="https://img.shields.io/badge/Note--Taking-Cornell%20Method-blue"
            alt="Cornell Method badge"
          />
          <img
            loading="lazy"
            decoding="async"
            src="https://img.shields.io/badge/Study%20Skills-Productivity-green"
            alt="Study skills badge"
          />
        </div>
      </header>

      <div className="w-full mt-4">
        <div className="rounded-md w-full max-h-96 h-56 sm:h-72 bg-gray-100 border flex items-center justify-center">
          <HiBookOpen className="w-20 h-20 text-gray-400" aria-hidden="true" />
          <span className="sr-only">Book cover placeholder</span>
        </div>
      </div>

      <div className="prose prose-neutral sm:prose-lg max-w-none mt-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </motion.div>
  );
}

export default ApplyingCornellMethodMd;
