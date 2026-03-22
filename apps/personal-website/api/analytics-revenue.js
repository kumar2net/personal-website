const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_MP_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const EU_MP_ENDPOINT = "https://region1.google-analytics.com/mp/collect";
const DEFAULT_GA4_MEASUREMENT_ID = "G-PZ37S6E5BL";

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }

  const raw = await new Promise((resolve, reject) => {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk;
    });
    req.on("end", () => resolve(buffer));
    req.on("error", reject);
  });

  return raw ? JSON.parse(raw) : {};
}

function trimString(value, maxLength = 240) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sanitizeNumber(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return null;
  }
  return Number(amount.toFixed(2));
}

function normalizeEventName(value) {
  const cleaned = trimString(value, 60).replace(/[^a-zA-Z0-9_]/g, "_");
  if (!cleaned || !/^[a-zA-Z]/.test(cleaned)) {
    return "";
  }
  return cleaned;
}

function normalizeParamName(value) {
  const cleaned = trimString(value, 40).replace(/[^a-zA-Z0-9_]/g, "_");
  if (!cleaned || !/^[a-zA-Z]/.test(cleaned)) {
    return "";
  }
  return cleaned;
}

function sanitizeParamValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Number(value.toFixed(2)) : undefined;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  const cleaned = trimString(value, 100);
  return cleaned || undefined;
}

function eventParamsFromProperties(properties = {}) {
  return Object.fromEntries(
    Object.entries(properties || {}).flatMap(([rawKey, rawValue]) => {
      const key = normalizeParamName(rawKey);
      const value = sanitizeParamValue(rawValue);
      return key && value !== undefined ? [[key, value]] : [];
    }),
  );
}

function measurementProtocolEndpoint() {
  const explicitEndpoint = trimString(process.env.GA4_MP_ENDPOINT, 500);
  if (explicitEndpoint) {
    return explicitEndpoint;
  }

  return String(process.env.GA4_MP_REGION || "").trim().toLowerCase() === "eu"
    ? EU_MP_ENDPOINT
    : DEFAULT_MP_ENDPOINT;
}

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const measurementId = trimString(
    process.env.GA4_MEASUREMENT_ID || DEFAULT_GA4_MEASUREMENT_ID,
    80,
  );
  const apiSecret = trimString(process.env.GA4_MP_API_SECRET, 160);

  if (!measurementId) {
    return res.status(503).json({
      ok: false,
      skipped: true,
      reason: "missing_ga4_measurement_id",
    });
  }

  if (!apiSecret) {
    return res.status(503).json({
      ok: false,
      skipped: true,
      reason: "missing_ga4_mp_api_secret",
      measurement_id: measurementId,
    });
  }

  const eventName = normalizeEventName(body.event_name || body.name);
  if (!eventName) {
    return res.status(400).json({ error: "Missing or invalid event_name" });
  }

  const clientId =
    trimString(body.client_id || body.clientId, 160) ||
    `server_${Date.now()}`;
  const sessionId = trimString(body.session_id || body.sessionId, 160);
  const eventId = trimString(body.event_id || body.eventId, 160);
  const transactionId = trimString(
    body.transaction_id || body.transactionId,
    160,
  );
  const pageLocation = trimString(
    body.page_location || body.pageLocation,
    500,
  );
  const pageReferrer = trimString(body.referrer || body.page_referrer, 500);
  const currency = trimString(body.currency || "USD", 12).toUpperCase() || "USD";
  const value = sanitizeNumber(body.value_usd ?? body.valueUsd ?? body.value);
  const engagementTimeMsec = Math.max(
    1,
    Math.min(
      Number(body.engagement_time_msec || body.engagementTimeMsec || 1000) || 1000,
      60 * 60 * 1000,
    ),
  );

  const params = {
    ...eventParamsFromProperties(body.properties || body.props || {}),
    engagement_time_msec: engagementTimeMsec,
    ...(sessionId ? { session_id: sessionId } : {}),
    ...(eventId ? { event_id: eventId } : {}),
    ...(pageLocation ? { page_location: pageLocation } : {}),
    ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
    ...(transactionId ? { transaction_id: transactionId } : {}),
    ...(value === null
      ? {}
      : {
          currency,
          value,
        }),
  };

  const endpoint = measurementProtocolEndpoint();
  const url = new URL(endpoint);
  url.searchParams.set("measurement_id", measurementId);
  url.searchParams.set("api_secret", apiSecret);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      events: [
        {
          name: eventName,
          params,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(502).json({
      ok: false,
      error: "ga4_measurement_protocol_forward_failed",
      status: response.status,
      detail: trimString(errorText, 400),
    });
  }

  return res.status(200).json({
    ok: true,
    forwarded: true,
    event_name: eventName,
  });
}
