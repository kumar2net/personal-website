// Serverless relay to forward analytics POSTs to external analytics backend
// Accepts POST /analytics-relay/* and proxies to https://siteanalyticsak.netlify.app/api/*

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

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      if (res.ok) {
        const data = await res.text();
        return { statusCode: 200, headers: corsHeaders, body: data };
      }
    } catch (_err) {
      // try next
    }
  }

  return {
    statusCode: 502,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Upstream analytics endpoint not reachable or returned non-2xx' }),
  };
}


