/**
 * Comments Function - Fetches from Netlify Forms API with caching
 * Automatically syncs with Netlify dashboard changes
 * Includes rate limiting protection and caching
 */

const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID || 'kumarsite';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cache = {
  forms: null,
  submissions: {},
  lastFetch: {
    forms: 0,
    submissions: {}
  }
};

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

// Check if cache is still valid
function isCacheValid(cacheKey, cacheType = 'forms') {
  const now = Date.now();
  const lastFetch = cache.lastFetch[cacheType];

  if (cacheType === 'submissions') {
    return cache.lastFetch.submissions[cacheKey] &&
           (now - cache.lastFetch.submissions[cacheKey]) < CACHE_DURATION;
  }

  return lastFetch && (now - lastFetch) < CACHE_DURATION;
}

// Get cached data
function getCachedData(cacheKey, cacheType = 'forms') {
  if (cacheType === 'submissions') {
    return cache.submissions[cacheKey] || null;
  }
  return cache.forms;
}

// Set cached data
function setCachedData(data, cacheKey, cacheType = 'forms') {
  const now = Date.now();

  if (cacheType === 'submissions') {
    cache.submissions[cacheKey] = data;
    cache.lastFetch.submissions[cacheKey] = now;
  } else {
    cache.forms = data;
    cache.lastFetch.forms = now;
  }
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
    // Check cache for forms data first
    let forms = getCachedData('forms');
    let targetForm = null;

    if (!forms || !isCacheValid('forms')) {
      // Fetch forms from Netlify API if not cached or cache expired
      console.log('Fetching forms from Netlify API (cache miss or expired)');
      const formsResponse = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms`, {
        headers: {
          'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!formsResponse.ok) {
        throw new Error(`Failed to fetch forms: ${formsResponse.status} ${formsResponse.statusText}`);
      }

      forms = await formsResponse.json();
      setCachedData(forms, 'forms');
    } else {
      console.log('Using cached forms data');
    }

    targetForm = forms.find(form => form.name === formName);

    if (!targetForm) {
      return jsonResponse(404, {
        success: false,
        error: `Form '${formName}' not found`,
        availableForms: forms.map(f => f.name)
      });
    }

    // Check cache for submissions data
    const submissionsCacheKey = targetForm.id;
    let submissions = getCachedData(submissionsCacheKey, 'submissions');

    if (!submissions || !isCacheValid(submissionsCacheKey, 'submissions')) {
      // Fetch submissions from the target form if not cached or cache expired
      console.log(`Fetching submissions for form ${targetForm.id} from Netlify API (cache miss or expired)`);
      const submissionsResponse = await fetch(`https://api.netlify.com/api/v1/forms/${targetForm.id}/submissions`, {
        headers: {
          'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!submissionsResponse.ok) {
        throw new Error(`Failed to fetch submissions: ${submissionsResponse.status} ${submissionsResponse.statusText}`);
      }

      submissions = await submissionsResponse.json();
      setCachedData(submissions, submissionsCacheKey, 'submissions');
    } else {
      console.log(`Using cached submissions data for form ${targetForm.id}`);
    }

    // Filter and format comments for the specific post
    const comments = submissions
      .filter(submission => {
        const data = submission.data;

        // Basic validation - must have name and comment
        if (!data.name || !data.comment) return false;

        // Match post slug - check various possible field names
        const submissionPostSlug = data['post-slug'] || data['postSlug'] || data['post_id'] || data['postId'];
        return submissionPostSlug === targetPostSlug;
      })
      .map(submission => ({
        id: submission.id,
        name: submission.data.name,
        email: submission.data.email || null,
        comment: submission.data.comment,
        timestamp: submission.created_at,
        postSlug: submission.data['post-slug'] || submission.data['postSlug'] || targetPostSlug,
        approved: true // All Netlify form submissions are considered approved
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
