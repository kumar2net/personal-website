const NodeCache = require('node-cache');
const { fetchTopPages, fetchTopSearchTerms } = require('./bigqueryService');
const { generateTopicsPrompted } = require('./vertexService');

const cacheTtlSeconds = parseInt(process.env.CACHE_TTL_SECONDS || '3600');
const cache = new NodeCache({ stdTTL: cacheTtlSeconds });

function buildPrompt({ topPages, topSearchTerms, language, limit }) {
  const systemInstruction = process.env.RECOMMENDER_SYSTEM_INSTRUCTION || 'You are a helpful blog topic recommender.';
  const pagesText = topPages.slice(0, 50).map((p, i) => `${i + 1}. ${p.pageTitle || ''} — ${p.pageLocation} (views: ${p.pageViews})`).join('\n');
  const searchText = topSearchTerms.slice(0, 50).map((s, i) => `${i + 1}. ${s.term} (${s.occurrences})`).join('\n');
  return [
    systemInstruction,
    `Language: ${language}`,
    'You are given recent site analytics. Produce concise blog post topic recommendations.',
    `Return exactly ${limit} items as JSON array with objects {title, rationale, keywords}.`,
    '',
    'Top Pages:',
    pagesText,
    '',
    'Top Search Terms:',
    searchText,
  ].join('\n');
}

function tryParseTopics(text) {
  try {
    // Try to extract JSON array from the text
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const json = text.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    }
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

async function getRecommendedTopics({ days = 14, limit = 10, language = 'en' }) {
  const cacheKey = `topics:${days}:${limit}:${language}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const [topPages, topSearchTerms] = await Promise.all([
    fetchTopPages(days),
    fetchTopSearchTerms(days),
  ]);

  const prompt = buildPrompt({ topPages, topSearchTerms, language, limit });
  const raw = await generateTopicsPrompted(prompt);
  const topics = tryParseTopics(raw).slice(0, limit).map(item => ({
    title: item.title || item.topic || '',
    rationale: item.rationale || item.reason || '',
    keywords: item.keywords || item.tags || [],
  }));

  const payload = { topics, inputs: { days, limit, language } };
  cache.set(cacheKey, payload);
  return payload;
}

module.exports = {
  getRecommendedTopics,
};

