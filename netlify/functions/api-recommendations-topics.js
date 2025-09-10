// Netlify function: topics from real GA4 BigQuery (no placeholders)
const { BigQuery } = require('@google-cloud/bigquery');

function getBigQueryClient() {
  const projectId = String(process.env.GCP_PROJECT_ID || '').trim();
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (saJson) {
    const creds = JSON.parse(saJson);
    return new BigQuery({ projectId, credentials: { client_email: creds.client_email, private_key: creds.private_key } });
  }
  return new BigQuery({ projectId });
}

function resolveDataset(raw) {
  return /^\d+$/.test(raw || '') ? `analytics_${raw}` : raw;
}

function getTableRef({ projectId, dataset, table }) {
  return `\`${projectId}.${resolveDataset(dataset)}.${table || 'events*'}\``;
}

async function fetchTopPages(client, opts, days) {
  const query = `
    SELECT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_referrer') AS page_referrer,
      COUNT(1) AS page_views
    FROM ${getTableRef(opts)}
    WHERE event_name = 'page_view'
      AND event_date BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
                         AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
      AND (
        (@host_regex IS NOT NULL AND REGEXP_CONTAINS((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), @host_regex))
        OR
        (@host_regex IS NULL AND NOT REGEXP_CONTAINS((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), r'^https?://(localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0|[^/]+:(5173|8888))'))
      )
    GROUP BY page_location, page_title, page_referrer
    HAVING page_location IS NOT NULL
    ORDER BY page_views DESC
    LIMIT 500`;
  const [job] = await client.createQueryJob({ query, params: { days, host_regex: process.env.GA4_ALLOWED_HOST_REGEX || null }, types: { days: 'INT64', host_regex: 'STRING' }, location: process.env.BIGQUERY_LOCATION || 'US' });
  const [rows] = await job.getQueryResults();
  return rows.map(r => ({
    pageLocation: r.page_location,
    pageTitle: r.page_title,
    pageReferrer: r.page_referrer,
    pageViews: Number(r.page_views) || 0,
  }));
}

async function fetchTopSearchTerms(client, opts, days) {
  const query = `
    SELECT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'search_term') AS search_term,
      COUNT(1) AS occurrences
    FROM ${getTableRef(opts)}
    WHERE event_name IN ('view_search_results', 'search')
      AND event_date BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
                         AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
      AND (
        (@host_regex IS NOT NULL AND REGEXP_CONTAINS((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), @host_regex))
        OR
        (@host_regex IS NULL AND NOT REGEXP_CONTAINS((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), r'^https?://(localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0|[^/]+:(5173|8888))'))
      )
    GROUP BY search_term
    HAVING search_term IS NOT NULL
    ORDER BY occurrences DESC
    LIMIT 200`;
  const [job] = await client.createQueryJob({ query, params: { days, host_regex: process.env.GA4_ALLOWED_HOST_REGEX || null }, types: { days: 'INT64', host_regex: 'STRING' }, location: process.env.BIGQUERY_LOCATION || 'US' });
  const [rows] = await job.getQueryResults();
  return rows.map(r => ({ term: r.search_term, occurrences: Number(r.occurrences) || 0 }));
}

function synthesizeTopics(topPages, topSearchTerms, limit) {
  const topics = [];
  const seen = new Set();
  for (const p of topPages.slice(0, 50)) {
    if (topics.length >= limit) break;
    const title = (p.pageTitle || '').trim();
    const key = title.toLowerCase();
    if (!title || seen.has(key)) continue;
    seen.add(key);
    topics.push({
      title,
      rationale: `High engagement on ${p.pageLocation} (views: ${p.pageViews}).`,
      keywords: topSearchTerms.slice(0, 5).map(s => s.term),
    });
  }
  if (topics.length < limit) {
    for (const s of topSearchTerms.slice(0, 20)) {
      if (topics.length >= limit) break;
      const t = (s.term || '').trim();
      if (!t) continue;
      const key = `about ${t}`;
      if (seen.has(key)) continue;
      seen.add(key);
      topics.push({ title: `About ${t}`, rationale: `Frequent searches for “${t}”.`, keywords: [t] });
    }
  }
  return topics.slice(0, limit);
}

exports.handler = async (event) => {
  try {
    const url = new URL(event.rawUrl || 'http://localhost');
    const days = parseInt(url.searchParams.get('days') || '14');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '6'), 25);
    const language = (url.searchParams.get('language') || 'en').toString();

    const projectId = process.env.GCP_PROJECT_ID;
    const dataset = process.env.GA4_DATASET;
    const table = process.env.GA4_TABLE || 'events*';
    if (!projectId || !dataset) {
      return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Missing GCP_PROJECT_ID or GA4_DATASET env vars' }) };
    }

    const client = getBigQueryClient();
    const opts = { projectId, dataset, table };
    let [pages, terms] = await Promise.all([
      fetchTopPages(client, opts, days).catch(() => []),
      fetchTopSearchTerms(client, opts, days).catch(() => []),
    ]);

    // fallback to latest daily table if wildcard is empty
    if ((pages.length === 0 && terms.length === 0)) {
      const [datasets] = await client.getDatasets();
      const dsId = resolveDataset(dataset);
      const ds = datasets.find(d => d.id === dsId) || client.dataset(dsId);
      const [tables] = await ds.getTables();
      const latest = tables.map(t => t.id).filter(id => /^events_\d{8}$/.test(id)).sort((a,b)=> b.localeCompare(a))[0];
      if (latest) {
        const latestOpts = { projectId, dataset, table: latest };
        [pages, terms] = await Promise.all([
          fetchTopPages(client, latestOpts, days).catch(() => []),
          fetchTopSearchTerms(client, latestOpts, days).catch(() => []),
        ]);
      }
    }

    if (pages.length === 0 && terms.length === 0) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, data: { topics: [], inputs: { days, limit, language } }, cached: false }) };
    }

    const topics = synthesizeTopics(pages, terms, limit);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data: { topics, inputs: { days, limit, language } }, cached: false })
    };
  } catch (error) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, error: error.message }) };
  }
};


