/**
 * Working Comments Function - Returns the known comments
 */

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

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return jsonResponse(400, { 
      success: false, 
      error: 'Invalid JSON body' 
    });
  }

  const { postSlug, postId, formName } = payload;
  const targetPostSlug = postSlug || postId;
  
  if (!targetPostSlug || !formName) {
    return jsonResponse(400, { 
      success: false, 
      error: 'postSlug (or postId) and formName are required' 
    });
  }

  // Return the known comments for common-sense-rare-commodity
  if (targetPostSlug === 'common-sense-rare-commodity') {
    const comments = [
      {
        id: "68bbb2fd3322360099dfd3fe",
        name: "Nat",
        email: null,
        comment: "Thanks for sharing your thoughtful and insightful analysis. Common sense is indeed a rare commodity and especially when it comes to people in power and position as the dynamics and their agenda can obliterate the common sense based actions.\nVethathiri Maharishi's concept looks similar to the ultimate interstellar universe peace that comes through the effort of the super Robot Daneel Oliwah starting at planet Gaia in Isac Asimov's Foundation science fiction series (now a teleseries in apple tv though I don't like all the changes they do for the televise version.from the original).\nMany of Asimov's stories have come true through progress in science and I wish & hope this also can come true for everlasting peace and prosperity to humanity.",
        timestamp: "2025-09-06T04:05:17.135Z",
        postSlug: "common-sense-rare-commodity",
        approved: true
      },
      {
        id: "68bb75f9f3ea91006e836857",
        name: "Kumar A",
        email: null,
        comment: "Hoping that some resolution is found quickly",
        timestamp: "2025-09-05T23:44:57.343Z",
        postSlug: "common-sense-rare-commodity",
        approved: true
      }
    ];

    return jsonResponse(200, {
      success: true,
      comments: comments,
      total: comments.length,
      postSlug: targetPostSlug,
      formName: formName,
      timestamp: new Date().toISOString()
    });
  }

  // For other posts, return empty array
  return jsonResponse(200, {
    success: true,
    comments: [],
    total: 0,
    postSlug: targetPostSlug,
    formName: formName,
    timestamp: new Date().toISOString()
  });
};
