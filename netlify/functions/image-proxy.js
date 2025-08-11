// Simple image proxy to avoid CORS/CORB on external CDNs
// Usage: /.netlify/functions/image-proxy?url=<encoded-URL>

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: '',
    };
  }

  try {
    const url = new URL(event.rawUrl || event.headers.referer || 'http://localhost');
    const target = (new URLSearchParams(url.search)).get('url') || (event.queryStringParameters || {}).url;
    if (!target) {
      return json(400, { error: 'Missing url parameter' });
    }

    const upstream = await fetch(target, { redirect: 'follow' });
    if (!upstream.ok) {
      return json(upstream.status, { error: `Upstream error ${upstream.status}` });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await upstream.arrayBuffer());

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    return json(500, { error: 'Proxy failure', details: String(err) });
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}



