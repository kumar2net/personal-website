/**
 * Debug Comments Function
 * Temporary function to debug comment filtering issues
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
    
    // Debug: Show all submissions and their processing
    const debugInfo = {
      targetPostSlug,
      totalSubmissions: submissions.length,
      submissions: submissions.map(submission => {
        const data = submission.data;
        const hasRequiredFields = data.name && data.comment;
        const isApproved = submission.state === 'received' || submission.state === 'approved';
        const matchesPost = data['post-slug'] === targetPostSlug;
        
        return {
          id: submission.id,
          state: submission.state,
          hasRequiredFields,
          isApproved,
          matchesPost,
          postSlug: data['post-slug'],
          name: data.name,
          comment: data.comment?.substring(0, 50) + '...',
          wouldPassFilter: hasRequiredFields && isApproved && matchesPost
        };
      })
    };

    return jsonResponse(200, {
      success: true,
      debug: debugInfo
    });

  } catch (error) {
    console.error('Error in debug function:', error);
    return jsonResponse(500, {
      success: false,
      error: 'Debug function failed',
      details: error.message
    });
  }
};
