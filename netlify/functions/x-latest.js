// Netlify Function: Fetch latest posts from X API v2 with caching
// Requires env var: X_BEARER_TOKEN

const BASE = 'https://api.x.com/2';

async function xFetch(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'personal-website-x-latest',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`X API error ${res.status}`);
    err.status = res.status;
    err.details = text;
    throw err;
  }
  return res.json();
}

exports.handler = async (event) => {
  try {
    const token = process.env.X_BEARER_TOKEN;
    const username = (event.queryStringParameters && event.queryStringParameters.username) || 'kumar2net';
    if (!token) {
      return { statusCode: 503, body: JSON.stringify({ error: 'X_BEARER_TOKEN not configured' }) };
    }

    // Get user id
    const userResp = await xFetch(`/users/by/username/${encodeURIComponent(username)}?user.fields=profile_image_url`, token);
    const userId = userResp && userResp.data && userResp.data.id;
    if (!userId) {
      return { statusCode: 404, body: JSON.stringify({ error: 'User not found' }) };
    }

    // Get latest tweets
    const tweetsResp = await xFetch(`/users/${userId}/tweets?max_results=5&tweet.fields=created_at`, token);
    const tweets = (tweetsResp && tweetsResp.data) || [];

    const items = tweets.map((t) => ({
      id: t.id,
      text: t.text,
      created_at: t.created_at,
      url: `https://twitter.com/${username}/status/${t.id}`,
    }));

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        // cache for 5 minutes
        'cache-control': 'public, max-age=300',
      },
      body: JSON.stringify({ username, items }),
    };
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    return { statusCode: status, body: JSON.stringify({ error: 'Failed to fetch X posts', details: String(err && err.details || err && err.message || err) }) };
  }
};


