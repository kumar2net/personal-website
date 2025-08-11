import { useEffect, useMemo, useState } from 'react';

async function hashTextSha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function useTldrSummary({ slug, text, enabled = true }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const safeText = useMemo(() => (text || '').trim(), [text]);

  useEffect(() => {
    if (!enabled) return;
    if (!safeText) return;

    let cancelled = false;

    async function fetchSummary() {
      try {
        setLoading(true);
        setError('');

        const inputHash = await hashTextSha256(safeText);
        const cacheKey = `tldr:${slug || 'auto'}:${inputHash}`;

        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!cancelled) setSummary(parsed.summary || '');
          setLoading(false);
          return;
        }

        const resp = await fetch('/.netlify/functions/tldr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, content: safeText }),
        });

        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(errText || `HTTP ${resp.status}`);
        }
        const data = await resp.json();
        const result = { summary: data.summary, model: data.model, inputHash: data.inputHash };
        localStorage.setItem(cacheKey, JSON.stringify(result));
        if (!cancelled) setSummary(result.summary);
      } catch (err) {
        if (!cancelled) setError(String(err?.message || err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSummary();

    return () => {
      cancelled = true;
    };
  }, [enabled, safeText, slug]);

  return { summary, loading, error };
}


