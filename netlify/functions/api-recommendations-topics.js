// Netlify function: topics recommendations proxy/fallback
// - If backend is not configured, returns synthesized topics from local GA4 JSON

exports.handler = async (event) => {
  try {
    const url = new URL(event.rawUrl || 'http://localhost');
    const days = parseInt(url.searchParams.get('days') || '14');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '6'), 25);
    const language = (url.searchParams.get('language') || 'en').toString();

    // Try to load local GA4 recommendations JSON (bundled at build time)
    let ga4;
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      ga4 = require('../../src/data/ga4-recommendations.json');
    } catch (_) {
      ga4 = null;
    }

    const topics = [];
    if (ga4 && Array.isArray(ga4.trending_posts)) {
      for (const post of ga4.trending_posts) {
        if (topics.length >= limit) break;
        topics.push({
          title: post.title || 'Untitled',
          rationale: `High engagement on ${post.url} (views: ${post.views || 0}).`,
          keywords: ['GA4', 'trending', 'engagement'],
        });
      }
    }

    // If still empty, provide minimal informative response
    const safeTopics = topics.length > 0 ? topics : [
      {
        title: 'Configure Backend for Live Topics',
        rationale: 'Set BACKEND_API_URL or deploy the Express backend and add a redirect from /api/recommendations/topics to it.',
        keywords: ['setup', 'backend', 'Netlify']
      }
    ];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data: { topics: safeTopics.slice(0, limit), inputs: { days, limit, language } }, cached: false }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};


