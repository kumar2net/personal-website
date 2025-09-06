/*
  Simple test to verify Netlify Access Token is working
*/

const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || 'kumarsite';

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (!NETLIFY_ACCESS_TOKEN) {
    return jsonResponse(500, { 
      success: false, 
      error: 'NETLIFY_ACCESS_TOKEN not configured' 
    });
  }

  try {
    // Test the token by fetching site info
    const siteResponse = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!siteResponse.ok) {
      return jsonResponse(500, {
        success: false,
        error: `Token test failed: ${siteResponse.status} ${siteResponse.statusText}`,
        tokenConfigured: true,
        tokenLength: NETLIFY_ACCESS_TOKEN.length
      });
    }

    const siteData = await siteResponse.json();

    return jsonResponse(200, {
      success: true,
      message: 'Token is working',
      siteName: siteData.name,
      siteId: siteData.id,
      tokenLength: NETLIFY_ACCESS_TOKEN.length
    });

  } catch (error) {
    console.error('Error:', error);
    return jsonResponse(500, {
      success: false,
      error: error.message,
      tokenConfigured: !!NETLIFY_ACCESS_TOKEN,
      tokenLength: NETLIFY_ACCESS_TOKEN ? NETLIFY_ACCESS_TOKEN.length : 0
    });
  }
};
