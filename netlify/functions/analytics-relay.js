// Serverless relay to forward analytics POSTs to external analytics backend
// Accepts POST /.netlify/functions/analytics-relay/* and proxies to https://siteanalyticsak.netlify.app/api/*

export async function handler(event) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const externalBase = 'https://siteanalyticsak.netlify.app';
  const externalApiBase = `${externalBase}/api`;

  // Determine the path after this function name to preserve endpoint semantics
  // e.g., /.netlify/functions/analytics-relay/analytics/track → /analytics/track
  const pathSuffix = (() => {
    const idx = event.path.indexOf('/.netlify/functions/analytics-relay');
    if (idx >= 0) {
      return event.path.substring(idx + '/.netlify/functions/analytics-relay'.length) || '/analytics/track';
    }
    return '/analytics/track';
  })();

  // Build candidate URLs to maximize compatibility
  const candidatePaths = Array.from(new Set([
    pathSuffix,
    pathSuffix.replace('/analytics/track', '/track'),
    pathSuffix.replace('/analytics/track', '/collect'),
    pathSuffix.replace('/analytics/track', '/events'),
    pathSuffix.replace('/analytics/track', '/ingest'),
  ]));

  const candidateBases = [externalApiBase, externalBase];
  const candidateUrls = [];
  for (const base of candidateBases) {
    for (const p of candidatePaths) {
      candidateUrls.push(base + p);
    }
  }

  const payload = event.body || '{}';

  const attemptResults = [];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      if (res.ok) {
        // Stream back upstream response without assuming JSON
        const text = await res.text();
        return { statusCode: 200, headers: corsHeaders, body: text };
      }
      const text = await res.text().catch(() => '');
      attemptResults.push({ url, status: res.status, statusText: res.statusText, bodySample: text?.slice?.(0, 200) || '' });
    } catch (_err) {
      attemptResults.push({ url, error: 'fetch_failed' });
    }
  }

  // Do not surface errors to the browser; respond 200 with debug info so client doesn't spam console
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: false, reason: 'Upstream returned non-2xx or unreachable', attempts: attemptResults }),
  };
}


