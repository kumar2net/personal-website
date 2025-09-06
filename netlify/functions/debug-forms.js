/*
  Debug function to see all forms and submissions
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

  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  if (!NETLIFY_ACCESS_TOKEN) {
    return jsonResponse(500, { 
      success: false, 
      error: 'NETLIFY_ACCESS_TOKEN not configured' 
    });
  }

  try {
    // Get all forms
    const formsResponse = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!formsResponse.ok) {
      throw new Error(`Failed to fetch forms: ${formsResponse.status}`);
    }

    const forms = await formsResponse.json();
    
    // Get submissions for each form
    const formsWithSubmissions = await Promise.all(
      forms.map(async (form) => {
        const submissionsResponse = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
          headers: {
            'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });

        let submissions = [];
        if (submissionsResponse.ok) {
          submissions = await submissionsResponse.json();
        }

        return {
          ...form,
          submissions: submissions
        };
      })
    );

    return jsonResponse(200, {
      success: true,
      forms: formsWithSubmissions
    });

  } catch (error) {
    console.error('Error fetching forms:', error);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to fetch forms'
    });
  }
};
