const NodeCache = require('node-cache');
const { fetchTopPages, fetchTopSearchTerms } = require('./bigqueryService');
const { generateTopicsPrompted } = require('./vertexService');

const cacheTtlSeconds = parseInt(process.env.CACHE_TTL_SECONDS || '3600');
const cache = new NodeCache({ stdTTL: cacheTtlSeconds });
const isDevMockMode = process.env.RECOMMENDER_DEV_MODE === 'true';

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

  // Dev mock mode: bypass external services for local development
  if (isDevMockMode) {
    const seeds = [
      { title: 'AI-Assisted Writing Workflows', rationale: 'Leverage GA4 interest in AI tools to propose actionable writing workflows.', keywords: ['AI', 'writing', 'workflow'] },
      { title: 'Personal Knowledge Management with Markdown', rationale: 'High engagement on note-taking pages suggests PKM content resonates.', keywords: ['PKM', 'Markdown', 'productivity'] },
      { title: 'Google Analytics 4: Practical Reports', rationale: 'Search terms indicate readers want GA4 hands-on reporting guides.', keywords: ['GA4', 'reports', 'analytics'] },
      { title: 'Tailwind Tips for Content Sites', rationale: 'Frontend performance and styling are recurring interests.', keywords: ['Tailwind', 'performance', 'CSS'] },
      { title: 'Generative AI for Topic Ideation', rationale: 'Combine top pages and search intent to ideate topics systematically.', keywords: ['Generative AI', 'ideation', 'topics'] },
    ];
    const topics = Array.from({ length: limit }).map((_, i) => {
      const base = seeds[i % seeds.length];
      return {
        title: base.title + (limit > seeds.length ? ` #${Math.floor(i / seeds.length) + 1}` : ''),
        rationale: base.rationale,
        keywords: base.keywords,
      };
    });
    const payload = { topics, inputs: { days, limit, language }, mock: true };
    cache.set(cacheKey, payload);
    return payload;
  }

  const [topPages, topSearchTerms] = await Promise.all([
    fetchTopPages(days).catch(() => []),
    fetchTopSearchTerms(days).catch(() => []),
  ]);

  // If there is no GA4 signal yet, do not fabricate topics
  if ((topPages?.length || 0) === 0 && (topSearchTerms?.length || 0) === 0) {
    const payload = { topics: [], inputs: { days, limit, language } };
    cache.set(cacheKey, payload);
    return payload;
  }

  try {
    const prompt = buildPrompt({ topPages, topSearchTerms, language, limit });
    const raw = await generateTopicsPrompted(prompt);
    const parsed = tryParseTopics(raw);
    const topics = parsed.slice(0, limit).map(item => ({
      title: item.title || item.topic || '',
      rationale: item.rationale || item.reason || '',
      keywords: item.keywords || item.tags || [],
    }));
    const payload = { topics, inputs: { days, limit, language } };
    cache.set(cacheKey, payload);
    return payload;
  } catch (_) {
    // On error, return empty rather than placeholders
    const payload = { topics: [], inputs: { days, limit, language } };
    cache.set(cacheKey, payload);
    return payload;
  }
}

module.exports = {
  getRecommendedTopics,
};

