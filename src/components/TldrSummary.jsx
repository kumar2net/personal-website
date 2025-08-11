import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useContentText } from '../hooks/useContentText';
import { useTldrSummary } from '../hooks/useTldrSummary';

export default function TldrSummary({ slug, articleRef, disabled = false }) {
  const location = useLocation();
  const derivedSlug = useMemo(() => {
    if (slug) return slug;
    const path = location?.pathname || '';
    const parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'post';
  }, [location?.pathname, slug]);

  const { getTextFromRef } = useContentText(5000);
  const text = useMemo(() => getTextFromRef(articleRef), [articleRef, getTextFromRef]);
  const { summary, loading, error } = useTldrSummary({ slug: derivedSlug, text, enabled: !disabled });

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">AI-generated TL;DR</span>
        {loading && (
          <span className="text-xs text-gray-400">Generating…</span>
        )}
      </div>
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : summary ? (
        <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="h-3 w-11/12 rounded bg-gray-200" />
          <div className="h-3 w-10/12 rounded bg-gray-200" />
          <div className="h-3 w-8/12 rounded bg-gray-200" />
        </div>
      )}
    </div>
  );
}


