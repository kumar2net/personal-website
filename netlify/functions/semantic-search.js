/*
  Netlify Function: semantic-search
  - POST body: { q: string, topK?: number }
  - Response: { results: [{ id, title, url, excerpt, score }], tookMs }
*/

const { v1: aiplatform } = require('@google-cloud/aiplatform');

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_LOCATION = process.env.GCP_LOCATION || 'us-central1';
const VERTEX_INDEX_ENDPOINT_ID = process.env.VERTEX_INDEX_ENDPOINT_ID;
const VERTEX_EMBED_DIM = Number(process.env.VERTEX_EMBED_DIM || '768');
const GCP_SERVICE_ACCOUNT_JSON = process.env.GCP_SERVICE_ACCOUNT_JSON;

async function embedQuery(text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: { parts: [{ text }] } }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini embed error: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values)) throw new Error('Invalid embedding response');
  if (values.length !== VERTEX_EMBED_DIM) {
    throw new Error(`Embedding dimension mismatch: got ${values.length}, expected ${VERTEX_EMBED_DIM}`);
  }
  return values;
}

function loadMapping() {
  try {
    // Use require to load json at runtime in Netlify env
    const mapping = require('../../src/data/semantic-mapping.json');
    if (!Array.isArray(mapping)) return [];
    return mapping;
  } catch (e) {
    return [];
  }
}

exports.handler = async (event) => {
  const started = Date.now();
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  if (!GEMINI_API_KEY) return jsonResponse(500, { error: 'Missing GEMINI_API_KEY' });
  if (!GCP_PROJECT_ID) return jsonResponse(500, { error: 'Missing GCP_PROJECT_ID' });
  if (!GCP_SERVICE_ACCOUNT_JSON) return jsonResponse(500, { error: 'Missing GCP_SERVICE_ACCOUNT_JSON' });
  if (!VERTEX_INDEX_ENDPOINT_ID) return jsonResponse(500, { error: 'Missing VERTEX_INDEX_ENDPOINT_ID' });

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const q = (payload?.q || '').toString().trim();
  const topK = Math.max(1, Math.min(10, Number(payload?.topK || 5)));
  if (!q) return jsonResponse(400, { error: 'q is required' });

  try {
    const queryEmbedding = await embedQuery(q);

    const mapping = loadMapping();
    const byId = new Map(mapping.map((m) => [m.id, m]));

    const credentials = JSON.parse(GCP_SERVICE_ACCOUNT_JSON);
    const clientOptions = {
      projectId: GCP_PROJECT_ID,
      apiEndpoint: `${GCP_LOCATION}-aiplatform.googleapis.com`,
    };
    if (credentials) clientOptions.credentials = credentials;
    const matchServiceClient = new aiplatform.MatchServiceClient(clientOptions);

    const indexEndpoint = `projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}/indexEndpoints/${VERTEX_INDEX_ENDPOINT_ID}`;

    const request = {
      indexEndpoint,
      deployedIndexId: undefined,
      queries: [
        {
          datapoint: { featureVector: queryEmbedding },
          neighborCount: topK,
        },
      ],
    };
    if (process.env.VERTEX_DEPLOYED_INDEX_ID) {
      request.deployedIndexId = process.env.VERTEX_DEPLOYED_INDEX_ID;
    }

    const [response] = await matchServiceClient.findNeighbors(request);
    const neighbors = response?.nearestNeighbors?.[0]?.neighbors || [];
    const results = neighbors.map((n) => {
      const id = n?.datapoint?.datapointId;
      const score = n?.distance || 0;
      const meta = byId.get(id) || { id, title: id, url: `/blog/${id}`, excerpt: '' };
      return { id, title: meta.title, url: meta.url, excerpt: meta.excerpt, score };
    });

    return jsonResponse(200, { results, tookMs: Date.now() - started, provider: 'vertex' });
  } catch (err) {
    return jsonResponse(500, { error: 'Search failed', details: String(err) });
  }
};


