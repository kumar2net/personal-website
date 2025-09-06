/*
  Debug function to see all forms and submissions
  This will help us understand the structure of your 2 comments
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
    
    // Get all submissions from all forms
    const allData = [];
    
    for (const form of forms) {
      try {
        const submissionsResponse = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions`, {
          headers: {
            'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });

        if (submissionsResponse.ok) {
          const submissions = await submissionsResponse.json();
          allData.push({
            formName: form.name,
            formId: form.id,
            submissionCount: submissions.length,
            submissions: submissions.map(s => ({
              id: s.id,
              state: s.state,
              created_at: s.created_at,
              data: s.data
            }))
          });
        }
      } catch (err) {
        allData.push({
          formName: form.name,
          formId: form.id,
          error: err.message
        });
      }
    }

    return jsonResponse(200, {
      success: true,
      totalForms: forms.length,
      forms: forms.map(f => ({ id: f.id, name: f.name })),
      allData
    });

  } catch (error) {
    console.error('Error:', error);
    return jsonResponse(500, {
      success: false,
      error: error.message
    });
  }
};
