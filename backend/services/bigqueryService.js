const { BigQuery } = require('@google-cloud/bigquery');

function getBigQueryClient() {
  const projectId = process.env.GCP_PROJECT_ID;
  return new BigQuery({ projectId });
}

function getGa4TableReference() {
  const dataset = process.env.GA4_DATASET;
  const table = process.env.GA4_TABLE || 'events_*';
  if (!dataset) {
    throw new Error('GA4_DATASET env var is required');
  }
  return `\`${process.env.GCP_PROJECT_ID}.${dataset}.${table}\``;
}

async function fetchTopPages(days) {
  const client = getBigQueryClient();
  const tableRef = getGa4TableReference();
  const query = `
    SELECT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_referrer') AS page_referrer,
      COUNT(1) AS page_views
    FROM ${tableRef}
    WHERE event_name = 'page_view'
      AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
                            AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    GROUP BY page_location, page_title, page_referrer
    HAVING page_location IS NOT NULL
    ORDER BY page_views DESC
    LIMIT 500
  `;
  const options = {
    query,
    params: { days },
    location: process.env.GCP_LOCATION || 'us-central1',
  };
  const [job] = await client.createQueryJob(options);
  const [rows] = await job.getQueryResults();
  return rows.map(r => ({
    pageLocation: r.page_location,
    pageTitle: r.page_title,
    pageReferrer: r.page_referrer,
    pageViews: Number(r.page_views) || 0,
  }));
}

async function fetchTopSearchTerms(days) {
  const client = getBigQueryClient();
  const tableRef = getGa4TableReference();
  const query = `
    SELECT
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'search_term') AS search_term,
      COUNT(1) AS occurrences
    FROM ${tableRef}
    WHERE event_name IN ('view_search_results', 'search')
      AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
                            AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    GROUP BY search_term
    HAVING search_term IS NOT NULL
    ORDER BY occurrences DESC
    LIMIT 200
  `;
  const options = {
    query,
    params: { days },
    location: process.env.GCP_LOCATION || 'us-central1',
  };
  const [job] = await client.createQueryJob(options);
  const [rows] = await job.getQueryResults();
  return rows.map(r => ({ term: r.search_term, occurrences: Number(r.occurrences) || 0 }));
}

module.exports = {
  fetchTopPages,
  fetchTopSearchTerms,
};

