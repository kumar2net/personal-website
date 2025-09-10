const { BigQuery } = require('@google-cloud/bigquery');

function getClient() {
  const projectId = String(process.env.GCP_PROJECT_ID || '').trim();
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (saJson) {
    const creds = JSON.parse(saJson);
    return new BigQuery({ projectId, credentials: { client_email: creds.client_email, private_key: creds.private_key } });
  }
  return new BigQuery({ projectId });
}

function resolveDataset(raw) { return /^\d+$/.test(raw || '') ? `analytics_${raw}` : raw; }
function tableRef({ projectId, dataset, table }) { return `\`${projectId}.${resolveDataset(dataset)}.${table || 'events*'}\``; }

exports.handler = async (event) => {
  try {
    const url = new URL(event.rawUrl || 'http://localhost');
    const days = parseInt(url.searchParams.get('days') || '14');
    const table = url.searchParams.get('table') || 'events*';
    const projectId = process.env.GCP_PROJECT_ID;
    const dataset = process.env.GA4_DATASET;
    const location = process.env.BIGQUERY_LOCATION || 'US';
    const hostRegex = process.env.GA4_ALLOWED_HOST_REGEX || null;
    if (!projectId || !dataset) {
      return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Missing GCP_PROJECT_ID or GA4_DATASET' }) };
    }

    const client = getClient();
    const opts = { projectId, dataset, table };

    const qCounts = `
      SELECT event_date, event_name, COUNT(1) c
      FROM ${tableRef(opts)}
      WHERE event_date BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
        AND (
          (@host_regex IS NOT NULL AND REGEXP_CONTAINS((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), @host_regex))
          OR
          (@host_regex IS NULL AND NOT REGEXP_CONTAINS((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), r'^https?://(localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0|[^/]+:(5173|8888))'))
        )
      GROUP BY event_date, event_name
      ORDER BY event_date DESC, c DESC
      LIMIT 100`;

    const [job1] = await client.createQueryJob({ query: qCounts, params: { days, host_regex: hostRegex }, types: { days: 'INT64', host_regex: 'STRING' }, location });
    const [counts] = await job1.getQueryResults();

    const qTopPages = `
      SELECT
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
        COUNT(1) AS page_views
      FROM ${tableRef(opts)}
      WHERE event_name='page_view'
        AND event_date BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @days DAY))
                           AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
        AND (
          (@host_regex IS NOT NULL AND REGEXP_CONTAINS((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), @host_regex))
          OR
          (@host_regex IS NULL AND NOT REGEXP_CONTAINS((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'), r'^https?://(localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0|[^/]+:(5173|8888))'))
        )
      GROUP BY page_location, page_title
      ORDER BY page_views DESC
      LIMIT 50`;

    const [job2] = await client.createQueryJob({ query: qTopPages, params: { days, host_regex: hostRegex }, types: { days: 'INT64', host_regex: 'STRING' }, location });
    const [pages] = await job2.getQueryResults();

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, projectId, dataset, table, days, hostRegex, counts, pages }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
  }
};


