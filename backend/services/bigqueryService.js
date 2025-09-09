const { BigQuery } = require('@google-cloud/bigquery');

function getBigQueryClient(projectIdOverride) {
  const projectId = projectIdOverride || process.env.GCP_PROJECT_ID;
  return new BigQuery({ projectId });
}

function resolveDataset(rawDataset) {
  const raw = rawDataset ?? process.env.GA4_DATASET;
  return /^\d+$/.test(raw || '') ? `analytics_${raw}` : raw;
}

function getGa4TableReference({ projectId, dataset, table } = {}) {
  const ds = resolveDataset(dataset);
  const tbl = table || process.env.GA4_TABLE || 'events*';
  if (!ds) {
    throw new Error('GA4 dataset is required (env GA4_DATASET or override)');
  }
  const proj = projectId || process.env.GCP_PROJECT_ID;
  return `\`${proj}.${ds}.${tbl}\``;
}

async function fetchTopPages(days, { projectId, dataset, table, location } = {}) {
  const client = getBigQueryClient(projectId);
  const tableRef = getGa4TableReference({ projectId, dataset, table });
  const query = `
    SELECT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_referrer') AS page_referrer,
      COUNT(1) AS page_views
    FROM ${tableRef}
    WHERE event_name = 'page_view'
      AND event_date BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
                         AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    GROUP BY page_location, page_title, page_referrer
    HAVING page_location IS NOT NULL
    ORDER BY page_views DESC
    LIMIT 500
  `;
  const options = {
    query,
    params: { days },
    // GA4 BigQuery export commonly uses multi-region 'US' or 'EU'
    location: location || process.env.BIGQUERY_LOCATION || process.env.GA4_LOCATION || 'US',
  };
  try {
    const [job] = await client.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    return rows.map(r => ({
      pageLocation: r.page_location,
      pageTitle: r.page_title,
      pageReferrer: r.page_referrer,
      pageViews: Number(r.page_views) || 0,
    }));
  } catch (error) {
    if (/Not found/i.test(error.message) || /No matching tables/i.test(error.message)) {
      return [];
    }
    throw error;
  }
}

async function fetchTopSearchTerms(days, { projectId, dataset, table, location } = {}) {
  const client = getBigQueryClient(projectId);
  const tableRef = getGa4TableReference({ projectId, dataset, table });
  const query = `
    SELECT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'search_term') AS search_term,
      COUNT(1) AS occurrences
    FROM ${tableRef}
    WHERE event_name IN ('view_search_results', 'search')
      AND event_date BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
                         AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    GROUP BY search_term
    HAVING search_term IS NOT NULL
    ORDER BY occurrences DESC
    LIMIT 200
  `;
  const options = {
    query,
    params: { days },
    location: location || process.env.BIGQUERY_LOCATION || process.env.GA4_LOCATION || 'US',
  };
  try {
    const [job] = await client.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    return rows.map(r => ({ term: r.search_term, occurrences: Number(r.occurrences) || 0 }));
  } catch (error) {
    if (/Not found/i.test(error.message) || /No matching tables/i.test(error.message)) {
      return [];
    }
    throw error;
  }
}

module.exports = {
  fetchTopPages,
  fetchTopSearchTerms,
  /**
   * Find latest GA4 daily events table like events_YYYYMMDD
   */
  findLatestEventsTable: async function findLatestEventsTable({ projectId, dataset } = {}) {
    const proj = projectId || process.env.GCP_PROJECT_ID;
    const ds = resolveDataset(dataset);
    const client = getBigQueryClient(proj);
    const [tables] = await client.dataset(ds).getTables();
    const suffixes = tables
      .map(t => t.id)
      .filter(id => /^events_\d{8}$/.test(id))
      .map(id => id.replace('events_', ''))
      .sort((a, b) => b.localeCompare(a));
    if (suffixes.length === 0) return null;
    return `events_${suffixes[0]}`;
  }
};

