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
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
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


