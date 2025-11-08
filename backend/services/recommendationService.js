const NodeCache = require('node-cache');
const { fetchTopPages, fetchTopSearchTerms, findLatestEventsTable } = require('./bigqueryService');
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
  } catch {
    return [];
  }
}

function synthesizeTopics(topPages, topSearchTerms, limit) {
  const topics = [];
  const titleSeen = new Set();
  const candidates = topPages
    .filter(p => p?.pageTitle)
    .slice(0, 50)
    .map((p, i) => ({
      title: String(p.pageTitle).trim() || `Idea ${i + 1}`,
      rationale: `High engagement on ${p.pageLocation} (${p.pageViews} views).` ,
      keywords: (topSearchTerms || []).slice(0, 5).map(t => t.term),
    }));
  for (const c of candidates) {
    if (topics.length >= limit) break;
    const key = c.title.toLowerCase();
    if (titleSeen.has(key)) continue;
    titleSeen.add(key);
    topics.push(c);
  }
  // If still short, backfill with generic themes from search terms
  if (topics.length < limit && Array.isArray(topSearchTerms)) {
    for (const s of topSearchTerms.slice(0, 20)) {
      if (topics.length >= limit) break;
      const t = (s.term || '').trim();
      if (!t) continue;
      const key = `about ${t}`;
      if (titleSeen.has(key)) continue;
      titleSeen.add(key);
      topics.push({
        title: `About ${t}`,
        rationale: `Frequent searches for “${t}”.` ,
        keywords: [t],
      });
    }
  }
  return topics.slice(0, limit);
}

async function getRecommendedTopics({ days = 14, limit = 10, language = 'en', projectId, dataset, table, location, noCache = false } = {}) {
  const cacheKey = `topics:${days}:${limit}:${language}:${projectId || ''}:${dataset || ''}:${table || ''}:${location || ''}`;
  const cached = !noCache ? cache.get(cacheKey) : null;
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

  const overrides = { projectId, dataset, table, location };
  let [topPages, topSearchTerms] = await Promise.all([
    fetchTopPages(days, overrides).catch(() => []),
    fetchTopSearchTerms(days, overrides).catch(() => []),
  ]);

  // If there is no GA4 signal yet, do not fabricate topics
  if ((topPages?.length || 0) === 0 && (topSearchTerms?.length || 0) === 0) {
    // Fallback A: try yesterday's daily table explicitly
    try {
      const now = new Date();
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      const yyyy = y.getFullYear();
      const mm = String(y.getMonth() + 1).padStart(2, '0');
      const dd = String(y.getDate()).padStart(2, '0');
      const fallbackTable = `events_${yyyy}${mm}${dd}`;
      const fbOverrides = { ...overrides, table: fallbackTable };
      const [fbPages, fbTerms] = await Promise.all([
        fetchTopPages(days, fbOverrides).catch(() => []),
        fetchTopSearchTerms(days, fbOverrides).catch(() => []),
      ]);
      if ((fbPages?.length || 0) > 0 || (fbTerms?.length || 0) > 0) {
        topPages = fbPages;
        topSearchTerms = fbTerms;
      }
    } catch {
      // ignore fallback errors
    }

    // Fallback B: discover latest daily table from BigQuery and try it
    if ((topPages?.length || 0) === 0 && (topSearchTerms?.length || 0) === 0) {
      try {
        const latest = await findLatestEventsTable({ projectId, dataset });
        if (latest) {
          const discOverrides = { ...overrides, table: latest };
          const [dp, dt] = await Promise.all([
            fetchTopPages(days, discOverrides).catch(() => []),
            fetchTopSearchTerms(days, discOverrides).catch(() => []),
          ]);
          if ((dp?.length || 0) > 0 || (dt?.length || 0) > 0) {
            topPages = dp;
            topSearchTerms = dt;
          }
        }
      } catch {
        // ignore discovery errors
      }
    }
  }

  if ((topPages?.length || 0) === 0 && (topSearchTerms?.length || 0) === 0) {
    const payload = { topics: [], inputs: { days, limit, language, projectId, dataset, table, location } };
    cache.set(cacheKey, payload);
    return payload;
  }

  try {
    const prompt = buildPrompt({ topPages, topSearchTerms, language, limit });
    const raw = await generateTopicsPrompted(prompt);
    const parsed = tryParseTopics(raw);
    let topics = parsed.slice(0, limit).map(item => ({
      title: item.title || item.topic || '',
      rationale: item.rationale || item.reason || '',
      keywords: item.keywords || item.tags || [],
    }));
    if (!Array.isArray(topics) || topics.length === 0) {
      topics = synthesizeTopics(topPages, topSearchTerms, limit);
    }
    const payload = { topics, inputs: { days, limit, language, projectId, dataset, table, location } };
    cache.set(cacheKey, payload);
    return payload;
  } catch {
    // Fallback to synthesized topics if model fails
    const topics = synthesizeTopics(topPages, topSearchTerms, limit);
    const payload = { topics, inputs: { days, limit, language, projectId, dataset, table, location } };
    cache.set(cacheKey, payload);
    return payload;
  }
}

module.exports = {
  getRecommendedTopics,
};
