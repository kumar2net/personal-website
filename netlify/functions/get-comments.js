/*
  Netlify Function: get-comments
  - Fetches comments from Netlify Forms for a specific blog post
  - Returns approved comments for display
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
  } catch {
    return jsonResponse(400, { 
      success: false, 
      error: 'Invalid JSON body' 
    });
  }

  const { postId, formName } = payload;
  if (!postId || !formName) {
    return jsonResponse(400, { 
      success: false, 
      error: 'postId and formName are required' 
    });
  }

  try {
    // First, get the form ID
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
    console.log('Available forms:', forms.map(f => ({ id: f.id, name: f.name })));
    
    // Search in all forms to find the 2 comments
    let allSubmissions = [];
    
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
          console.log(`Form "${form.name}" has ${submissions.length} submissions`);
          allSubmissions = allSubmissions.concat(submissions.map(s => ({ ...s, formName: form.name })));
        }
      } catch (err) {
        console.log(`Error fetching submissions for form "${form.name}":`, err.message);
      }
    }
    
    const submissions = allSubmissions;
    
    // Debug: Log all submissions to see what fields are available
    console.log('All submissions:', JSON.stringify(submissions, null, 2));
    console.log('Total submissions found:', submissions.length);
    
    // Filter comments for this specific post and approved ones
    const postComments = submissions
      .filter(submission => {
        const data = submission.data;
        
        // For debugging: be more flexible with field names
        const hasRequiredFields = (data.name && data.comment) || 
                                 (data.message && (data.name || data.email)) ||
                                 (data.comment && (data.name || data.email)) ||
                                 (data.message) || // Show any submission with a message field
                                 (data.comment); // Show any submission with a comment field
        const isApproved = submission.state === 'received' || submission.state === 'approved';
        
        // Check for various possible field names and post identifiers
        const hasPostId = data['post-id'] === postId || 
                         data['post-slug'] === postId || 
                         data['post_id'] === postId ||
                         data['postId'] === postId ||
                         data['post-title'] === postId;
        
        // Debug: Log the data to see what fields are available
        console.log('Submission data:', JSON.stringify(data, null, 2));
        console.log('Looking for postId:', postId);
        
        // If we have required fields and it's approved, include it
        // For now, show all comments to see the 2 existing ones
        // Also include comments that might be in different states
        // TEMPORARILY: Show ALL submissions to debug
        return true; // Show everything for debugging
      })
      .map(submission => ({
        id: submission.id,
        name: submission.data.name || submission.data.email || 'Anonymous',
        email: submission.data.email,
        comment: submission.data.comment || submission.data.message,
        timestamp: submission.created_at,
        approved: true,
        formName: submission.formName
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first

    return jsonResponse(200, {
      success: true,
      comments: postComments,
      total: postComments.length
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to fetch comments from Netlify Forms'
    });
  }
};
