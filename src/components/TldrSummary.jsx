import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useContentText } from '../hooks/useContentText';
import { useTldrSummary } from '../hooks/useTldrSummary';

export default function TldrSummary({ slug, articleRef, disabled = false }) {
  const location = useLocation();
  const derivedSlug = useMemo(() => {
    if (slug) {
      return slug;
    }
    const path = location?.pathname || '';
    const parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'post';
  }, [location?.pathname, slug]);

  const { getTextFromRef } = useContentText(5000);
  const [articleText, setArticleText] = useState('');

  // Observe DOM content so we extract text after mount and on updates
  useEffect(() => {
    const element = articleRef?.current;
    if (!element) {
      return;
    }

    const extract = () => {
      const txt = getTextFromRef(articleRef);
      if (txt && txt !== articleText) {
        setArticleText(txt);
      }
    };

    // Initial extraction after current tick
    const timer = setTimeout(extract, 0);

    const observer = new MutationObserver(() => extract());
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [articleRef, getTextFromRef, articleText]);

  const hasText = articleText && articleText.length > 40;
  const { summary, loading, error, model, created, fallback } = useTldrSummary({
    slug: derivedSlug,
    text: articleText,
    enabled: !disabled && hasText,
  });

  const formattedDate = useMemo(() => {
    if (!created) {
      return '';
    }
    const d = new Date(created * 1000);
    const day = String(d.getDate()).padStart(2, '0');
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`; // dd-mmm-yyyy
  }, [created]);

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
          AI-generated TL;DR
        </span>
        {loading && <span className="text-xs text-gray-400">Generating…</span>}
      </div>
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : summary ? (
        <>
          <p className="text-sm leading-relaxed text-gray-800">{summary}</p>
          <div className="mt-2 text-[11px] text-gray-500">
            <span>Model: {model || 'unknown'}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
            {fallback && (
              <>
                <span className="mx-2">•</span>
                <span>fallback</span>
              </>
            )}
          </div>
        </>
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
