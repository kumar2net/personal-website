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
    if (!enabled) {
      return;
    }
    if (!safeText) {
      return;
    }

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

        const candidateEndpoints = [];
        const netlifyPort =
          import.meta.env.VITE_TLDR_NETLIFY_PORT || '8889';
        const isLocalHost =
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');
        const isVitePort =
          typeof window !== 'undefined' &&
          (window.location.port === '5173' || window.location.port === '5174');

        if (isLocalHost && isVitePort) {
          candidateEndpoints.push(
            `http://localhost:${netlifyPort}/.netlify/functions/tldr`
          );
        }

        const envOverride = import.meta.env.VITE_TLDR_ENDPOINT;
        if (envOverride) {
          candidateEndpoints.push(envOverride);
        }

        candidateEndpoints.push('/api/tldr', '/.netlify/functions/tldr');
        const uniqueEndpoints = Array.from(
          new Set(candidateEndpoints.filter(Boolean))
        );

        if (uniqueEndpoints.length === 0) {
          throw new Error('No TL;DR endpoint configured');
        }

        let data = null;
        let lastError = null;

        for (const endpoint of uniqueEndpoints) {
          try {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slug, content: safeText }),
            });

            if (!response.ok) {
              const errText = await response.text();
              lastError = new Error(
                errText || `HTTP ${response.status} at ${endpoint}`
              );
              continue;
            }

            data = await response.json();
            break;
          } catch (err) {
            lastError = err;
          }
        }

        if (!data) {
          throw lastError || new Error('TL;DR request failed');
        }
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
        if (!cancelled) {
          setError(String(err?.message || err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSummary();

    return () => {
      cancelled = true;
    };
  }, [enabled, safeText, slug]);

  return { summary, loading, error, model, created, fallback };
}
