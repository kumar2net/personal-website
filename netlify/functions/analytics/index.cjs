// Directory-based Netlify Function (CommonJS)
// Ingestion endpoint that stores events to Netlify Blobs (if available) and always returns 2xx

let getStore;
try {
  ({ getStore } = require('@netlify/blobs'));
} catch (_) {
  getStore = null;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
};

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // Lightweight, no-data GETs to avoid console errors in external dashboards
  if (event.httpMethod === 'GET' || event.httpMethod === 'HEAD') {
    const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };

    // Determine the requested sub-path after the function name
    const fnMarker = '/.netlify/functions/analytics';
    const idx = event.path.indexOf(fnMarker);
    const suffix = idx >= 0 ? (event.path.substring(idx + fnMarker.length) || '/') : '/';

    // Minimal, schema-compatible empty payloads per route
    const respond = (obj) => ({ statusCode: 200, headers: jsonHeaders, body: JSON.stringify(obj) });

    if (suffix.includes('/api/analytics/metrics/realtime')) {
      return respond({ data: { metrics: { active_visitors: '0', page_views_24h: '0' } } });
    }
    if (suffix.includes('/api/analytics/metrics/daily')) {
      return respond({ data: { metrics: [] } });
    }
    if (suffix.includes('/api/analytics/pages/top')) {
      return respond({ data: { pages: [] } });
    }
    if (suffix.includes('/api/analytics/geolocation')) {
      return respond({ data: { geolocation: [] } });
    }
    if (suffix.includes('/api/analytics/devices/breakdown')) {
      return respond({ data: { device_types: [] } });
    }
    if (suffix.includes('/api/analytics/os/breakdown')) {
      return respond({ data: { operating_systems: [] } });
    }
    if (suffix.includes('/api/analytics/browsers/breakdown')) {
      return respond({ data: { browsers: [] } });
    }
    if (suffix.includes('/api/analytics/devices')) {
      return respond({ data: { devices: [] } });
    }

    // Default empty response
    return respond({ ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  try {
    const store = getStore ? getStore('analytics-events') : null;

    const receivedAt = new Date();
    const dateKey = receivedAt.toISOString().slice(0, 10);
    const eventId = generateId();

    let payload;
    try { payload = JSON.parse(event.body || '{}'); } catch (_) { payload = { raw: event.body }; }

    const ip = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || '';
    const userAgent = event.headers['user-agent'] || '';

    const record = {
      event_id: eventId,
      received_at: receivedAt.toISOString(),
      ip,
      user_agent: userAgent,
      ...payload,
    };

    if (store && store.setJSON) {
      const key = `${dateKey}/${eventId}.json`;
      await store.setJSON(key, record);
    }

    return { statusCode: 204, headers: corsHeaders, body: '' };
  } catch (_err) {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
};


