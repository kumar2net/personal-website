/*
  Displays the DOCX content directly in the browser without external viewers.
  We keep the content unchanged per user preference, and add a cover and badges.
*/

import { renderAsync } from 'docx-preview';
import { useEffect, useRef, useState } from 'react';
import docxAssetUrl from '../../docs/Applying_Cornell_method.docx?url';

function BookCornellMethod() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const _absoluteDocxUrl = new URL(docxAssetUrl, window.location.origin).href;

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        const response = await fetch(docxAssetUrl);
        const arrayBuffer = await response.arrayBuffer();
        if (!isCancelled && containerRef.current) {
          await renderAsync(arrayBuffer, containerRef.current, undefined, {
            inWrapper: true,
            className: 'docx',
          });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to render Cornell method doc:', err);
        setError('Failed to render document. You can download it below.');
        setIsLoading(false);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, []);

  // no zoom controls; keep minimal UI

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          Applying the Cornell Method
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

      <div className="w-full">
        <img
          loading="lazy"
          decoding="async"
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop"
          alt="Applying the Cornell Method cover"
          className="rounded-md w-full max-h-96 object-cover"
        />
        <p className="text-xs text-gray-500 mt-1 text-right">Photo: Unsplash</p>
      </div>

      <section className="bg-white rounded-lg shadow p-0 overflow-hidden">
        <div
          className="p-2 sm:p-4 overflow-auto"
          style={{ width: '100%', height: '75vh' }}
        >
          {isLoading && (
            <div className="text-gray-600 text-sm">Loading document…</div>
          )}
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div ref={containerRef} className="docx-container" />
        </div>
      </section>
    </div>
  );
}

export default BookCornellMethod;
