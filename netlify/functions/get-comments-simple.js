/**
 * Simple Comments Function - Temporary fix
 * Returns all comments without complex filtering
 */

const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || 'kumarsite';

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

  if (!NETLIFY_ACCESS_TOKEN) {
    return jsonResponse(500, { 
      success: false, 
      error: 'NETLIFY_ACCESS_TOKEN not configured' 
    });
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

  try {
    // Fetch forms
    const formsResponse = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!formsResponse.ok) {
      throw new Error(`Failed to fetch forms: ${formsResponse.status} ${formsResponse.statusText}`);
    }

    const forms = await formsResponse.json();
    const targetForm = forms.find(form => form.name === formName);
    
    if (!targetForm) {
      return jsonResponse(404, { 
        success: false, 
        error: `Form '${formName}' not found`,
        availableForms: forms.map(f => f.name)
      });
    }

    // Fetch submissions
    const submissionsResponse = await fetch(`https://api.netlify.com/api/v1/forms/${targetForm.id}/submissions`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!submissionsResponse.ok) {
      throw new Error(`Failed to fetch submissions: ${submissionsResponse.status} ${submissionsResponse.statusText}`);
    }

    const submissions = await submissionsResponse.json();
    
    // Simple filtering - just match post-slug and basic validation
    const comments = submissions
      .filter(submission => {
        const data = submission.data;
        
        // Basic validation
        if (!data.name || !data.comment) return false;
        
        // Match post slug
        const postSlug = data['post-slug'] || data['postSlug'] || data['post_id'] || data['postId'];
        return postSlug === targetPostSlug;
      })
      .map(submission => ({
        id: submission.id,
        name: submission.data.name,
        email: submission.data.email,
        comment: submission.data.comment,
        timestamp: submission.created_at,
        postSlug: submission.data['post-slug'] || submission.data['postSlug'],
        approved: true
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return jsonResponse(200, {
      success: true,
      comments: comments,
      total: comments.length,
      postSlug: targetPostSlug,
      formName: formName,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to fetch comments from Netlify Forms',
      details: error.message
    });
  }
};
