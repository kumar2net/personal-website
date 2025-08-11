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
  const [model, setModel] = useState('');
  const [created, setCreated] = useState(0);
  const [fallback, setFallback] = useState(false);

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
          if (!cancelled) {
            setSummary(parsed.summary || '');
            setModel(parsed.model || '');
            setCreated(parsed.created || 0);
            setFallback(Boolean(parsed.fallback));
          }
          setLoading(false);
          return;
        }

        // Ensure functions resolve when app is opened on Vite port (5173/5174)
        const isLocalHost = typeof window !== 'undefined' && (
          window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        );
        const isVitePort = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
        const functionsBase = isLocalHost && isVitePort ? 'http://localhost:8888' : '';

        const resp = await fetch(`${functionsBase}/.netlify/functions/tldr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, content: safeText }),
        });

        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(errText || `HTTP ${resp.status}`);
        }
        const data = await resp.json();
        const result = {
          summary: data.summary,
          model: data.model,
          inputHash: data.inputHash,
          created: data.created,
          fallback: Boolean(data.fallback),
        };
        localStorage.setItem(cacheKey, JSON.stringify(result));
        if (!cancelled) {
          setSummary(result.summary);
          setModel(result.model || '');
          setCreated(result.created || 0);
          setFallback(Boolean(result.fallback));
        }
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

  return { summary, loading, error, model, created, fallback };
}


