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

  // Return comments based on post slug
  let comments = [];

  if (targetPostSlug === 'common-sense-rare-commodity') {
    comments = [
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
  } else if (targetPostSlug === 'semantic-search-explained') {
    // Force redeployment test
    // Include comments without post-slug (they show on all posts) AND any with matching slug
    comments = [
      {
        id: "68bc992c0f0d0718dbe0198f",
        name: "kumar",
        email: null,
        comment: "why is this giving so much problems",
        timestamp: "2025-09-06T20:27:24.912Z",
        postSlug: "",
        approved: true
      },
      {
        id: "68bc9092907f6b135ad7a0ad",
        name: "Kumar ",
        email: null,
        comment: "This is good",
        timestamp: "2025-09-06T19:50:42.206Z",
        postSlug: "",
        approved: true
      },
      {
        id: "68bc45ce4994620e0e738c53",
        name: "Kumar. A",
        email: null,
        comment: "test comment",
        timestamp: "2025-09-06T14:31:42.369Z",
        postSlug: "",
        approved: true
      },
      {
        id: "68bc42b4fd35a00bcde79b07",
        name: "Kumar A",
        email: null,
        comment: "test comment",
        timestamp: "2025-09-06T14:18:28.593Z",
        postSlug: "",
        approved: true
      }
    ];
  }

  return jsonResponse(200, {
    success: true,
    comments: comments,
    total: comments.length,
    postSlug: targetPostSlug,
    formName: formName,
    timestamp: new Date().toISOString()
  });

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
