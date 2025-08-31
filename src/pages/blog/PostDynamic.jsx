import React, { Suspense, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

const jsxModules = import.meta.glob('/src/pages/blog/*.jsx');
const mdModules = import.meta.glob('/src/pages/blog/*.md', {
  query: '?raw',
  import: 'default',
});

export default function PostDynamic() {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState('');

  const LazyComponent = useMemo(() => {
    const path = `/src/pages/blog/${slug}.jsx`;
    if (jsxModules[path]) {
      return React.lazy(jsxModules[path]);
    }
    return null;
  }, [slug]);

  useEffect(() => {
    const path = `/src/pages/blog/${slug}.md`;
    if (mdModules[path]) {
      mdModules[path]().then((raw) => setMarkdown(raw || ''));
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
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    );
  }

  return <div className="text-gray-600">Post not found.</div>;
}
