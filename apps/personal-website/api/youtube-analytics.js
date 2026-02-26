import fs from "node:fs";
import path from "node:path";
import { GoogleAuth, OAuth2Client } from "google-auth-library";

const YT_DATA_BASE_URL = "https://www.googleapis.com/youtube/v3";
const YT_ANALYTICS_BASE_URL = "https://youtubeanalytics.googleapis.com/v2/reports";
const YT_METRICS =
  "views,impressions,impressionClickThroughRate,averageViewDuration,averageViewPercentage";
const YT_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];

const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;
const SHORT_MAX_SECONDS = 90;
const MAX_SHORT_SCAN = 160;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
}

function clampInt(raw, fallback, min, max) {
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return fallback;
  if (parsed < min || parsed > max) return fallback;
  return parsed;
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toFixed2(value) {
  if (value == null || !Number.isFinite(value)) return null;
  return Math.round(value * 100) / 100;
}

function toDate(value) {
  return value.toISOString().slice(0, 10);
}

function parseDate(raw) {
  if (!raw || typeof raw !== "string") return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : toDate(date);
}

function chunk(values, size) {
  const out = [];
  for (let i = 0; i < values.length; i += size) {
    out.push(values.slice(i, i + size));
  }
  return out;
}

function parseIsoDurationSeconds(raw) {
  if (typeof raw !== "string") return null;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/i.exec(raw.trim());
  if (!match) return null;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  if (![hours, minutes, seconds].every(Number.isFinite)) return null;

  return Math.round((hours * 3600 + minutes * 60 + seconds) * 100) / 100;
}

function maybeDecodeBase64(raw) {
  if (!raw || typeof raw !== "string") return null;
  const compact = raw.replace(/\s+/g, "");
  if (!compact || compact.length < 24) return null;
  const looksLikeBase64 =
    compact.length % 4 === 0 && /^[A-Za-z0-9+/=]+$/.test(compact) && !compact.startsWith("{");
  if (!looksLikeBase64) return null;
  try {
    return Buffer.from(compact, "base64").toString("utf8");
  } catch {
    return null;
  }
}

function parseServiceAccount(raw, label) {
  if (!raw || typeof raw !== "string") return null;
  const candidates = [raw.trim()];
  const decoded = maybeDecodeBase64(raw);
  if (decoded) {
    candidates.push(decoded);
  }

  let parseError;
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof parsed.client_email === "string" &&
        typeof parsed.private_key === "string"
      ) {
        return parsed;
      }
    } catch (error) {
      parseError = error;
    }
  }

  if (parseError) {
    throw new Error(`${label} JSON parse failed: ${parseError.message}`);
  }

  return null;
}

function resolveServiceAccountCredentials() {
  const envPairs = [
    { key: "GCP_SERVICE_ACCOUNT_JSON", decode: false },
    { key: "GOOGLE_SERVICE_ACCOUNT_JSON", decode: false },
    { key: "GCP_SERVICE_ACCOUNT_JSON_BASE64", decode: true },
  ];

  for (const pair of envPairs) {
    const raw = process.env[pair.key];
    if (!raw) continue;
    try {
      const candidate = pair.decode ? maybeDecodeBase64(raw) || raw : raw;
      const parsed = parseServiceAccount(candidate, pair.key);
      if (parsed) return parsed;
    } catch (error) {
      console.warn(`[youtube-analytics] Failed parsing ${pair.key}: ${error.message}`);
    }
  }

  const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!gac) return null;

  try {
    const gacParsed = parseServiceAccount(gac, "GOOGLE_APPLICATION_CREDENTIALS");
    if (gacParsed) {
      return gacParsed;
    }
  } catch (error) {
    // GOOGLE_APPLICATION_CREDENTIALS is often a file path in Vercel.
  }

  try {
    const resolvedPath = path.resolve(gac);
    if (!fs.existsSync(resolvedPath)) {
      return null;
    }
    const raw = fs.readFileSync(resolvedPath, "utf8");
    return parseServiceAccount(raw, resolvedPath);
  } catch (error) {
    console.warn(
      `[youtube-analytics] Failed reading GOOGLE_APPLICATION_CREDENTIALS: ${error.message}`,
    );
    return null;
  }
}

async function getAccessToken() {
  const clientId = process.env.YT_CLIENT_ID?.trim();
  const clientSecret = process.env.YT_CLIENT_SECRET?.trim();
  const refreshToken = process.env.YT_REFRESH_TOKEN?.trim();

  if (clientId && clientSecret && refreshToken) {
    const oauthClient = new OAuth2Client(clientId, clientSecret);
    oauthClient.setCredentials({ refresh_token: refreshToken });
    const tokenResponse = await oauthClient.getAccessToken();
    const token =
      typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
    if (!token) {
      throw new Error("OAuth refresh token flow did not return a token.");
    }
    return { token, source: "oauth_refresh" };
  }

  const credentials = resolveServiceAccountCredentials();
  const auth = new GoogleAuth(
    credentials ? { credentials, scopes: YT_SCOPES } : { scopes: YT_SCOPES },
  );
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
  if (!token) {
    throw new Error("Google auth did not return an access token.");
  }

  return {
    token,
    source: credentials ? "service_account" : "adc",
  };
}

async function fetchJson(url, token) {
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Google API error ${response.status} ${response.statusText}: ${body.slice(0, 200)}`,
    );
  }

  return response.json();
}

function normalizeAnalyticsRows(report) {
  const headers = (report?.columnHeaders ?? [])
    .map((item) => String(item?.name ?? ""))
    .filter(Boolean);
  const rows = report?.rows ?? [];
  if (!headers.length || !Array.isArray(rows)) return [];

  return rows.map((row) => {
    const item = {};
    for (let i = 0; i < headers.length; i += 1) {
      const key = headers[i];
      const rawValue = row?.[i];
      if (key === "day" || key === "video") {
        item[key] = rawValue == null ? "" : `${rawValue}`;
      } else {
        item[key] = toNumber(rawValue);
      }
    }
    return item;
  });
}

async function safeAnalyticsFetch(url, token, warnings, label) {
  try {
    return normalizeAnalyticsRows(await fetchJson(url, token));
  } catch (error) {
    warnings.push(`${label}: ${error.message}`);
    return [];
  }
}

async function fetchChannel(token) {
  const url = new URL(`${YT_DATA_BASE_URL}/channels`);
  url.searchParams.set("part", "id,snippet,contentDetails");
  url.searchParams.set("mine", "true");

  const data = await fetchJson(url, token);
  const item = data?.items?.[0];
  if (!item || !item.id) {
    throw new Error("Unable to resolve channel from authenticated account.");
  }

  const uploadsPlaylistId = item?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    throw new Error("Missing uploads playlist in channel response.");
  }

  return {
    channelId: item.id,
    channelName: item.snippet?.title || null,
    uploadsPlaylistId,
  };
}

async function fetchShortVideos(token, uploadsPlaylistId, maxVideos) {
  const videoIdSet = new Set();
  let pageToken;
  let page = 0;

  while (videoIdSet.size < maxVideos && page < 6) {
    const url = new URL(`${YT_DATA_BASE_URL}/playlistItems`);
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("playlistId", uploadsPlaylistId);
    url.searchParams.set("maxResults", "50");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const response = await fetchJson(url, token);
    for (const item of response?.items ?? []) {
      const id = item?.contentDetails?.videoId;
      if (id) {
        videoIdSet.add(id);
      }
    }

    pageToken = response?.nextPageToken;
    page += 1;
    if (!pageToken) break;
  }

  const allIds = Array.from(videoIdSet).slice(0, maxVideos);
  const videos = [];

  for (const batch of chunk(allIds, 50)) {
    const videosUrl = new URL(`${YT_DATA_BASE_URL}/videos`);
    videosUrl.searchParams.set("part", "snippet,contentDetails");
    videosUrl.searchParams.set("id", batch.join(","));
    const videosResponse = await fetchJson(videosUrl, token);

    for (const item of videosResponse?.items ?? []) {
      const durationSeconds = parseIsoDurationSeconds(item?.contentDetails?.duration);
      if (durationSeconds == null || durationSeconds <= 0 || durationSeconds > SHORT_MAX_SECONDS) {
        continue;
      }

      const publishedAt = parseDate(item?.snippet?.publishedAt);
      if (!item?.id || !publishedAt || !item?.snippet?.title) continue;

      videos.push({
        videoId: item.id,
        title: item.snippet.title,
        publishedAt,
        thumbnail: item.snippet?.thumbnails?.default?.url || null,
        durationSeconds,
      });
    }
  }

  return videos.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

function classifyHealth({ ctr, retention }) {
  if (ctr == null || retention == null) return "unknown";

  const hitCritical = ctr < 2 || retention < 25;
  const hitWarning = ctr < 3.5 || retention < 35;

  if (hitCritical) return "high";
  if (hitWarning) return "medium";
  return "low";
}

function buildRecommendations({ ctr, retention }) {
  const out = [];
  if (ctr == null) {
    out.push("Awaiting CTR values for this period.");
  } else if (ctr < 2) {
    out.push("Very low CTR; tighten hook, title, and thumbnail signal.");
  } else if (ctr < 3.5) {
    out.push("Low CTR; test stronger first 2-second hook variant.");
  } else {
    out.push("CTR is healthy.");
  }

  if (retention == null) {
    out.push("Awaiting retention trend.");
  } else if (retention < 25) {
    out.push("Retention weak; remove intro friction before core value in first 1-2 sec.");
  } else if (retention < 35) {
    out.push("Retention moderate; test a stronger pacing cadence.");
  } else {
    out.push("Retention is strong.");
  }

  return out;
}

function enrichShorts(shorts, metricRows) {
  const metricByVideo = new Map();
  for (const row of metricRows) {
    if (row.video) {
      metricByVideo.set(row.video, row);
    }
  }

  return shorts.map((short) => {
    const metrics = metricByVideo.get(short.videoId) || {};
    const ctr = toNumber(metrics.impressionClickThroughRate);
    const retention = toNumber(metrics.averageViewPercentage);
    const health = classifyHealth({ ctr, retention });
    return {
      videoId: short.videoId,
      title: short.title,
      publishedAt: short.publishedAt,
      thumbnail: short.thumbnail,
      durationSeconds: short.durationSeconds,
      views: toNumber(metrics.views),
      impressions: toNumber(metrics.impressions),
      impressionClickThroughRate: toFixed2(ctr),
      averageViewDuration: toFixed2(toNumber(metrics.averageViewDuration)),
      averageViewPercentage: toFixed2(retention),
      health,
      recommendations: buildRecommendations({ ctr, retention }),
    };
  });
}

function weightedAverage(items, valueKey, weightKey) {
  let totalWeight = 0;
  let weighted = 0;

  for (const item of items) {
    const value = toNumber(item?.[valueKey]);
    const weight = toNumber(item?.[weightKey]);
    if (value == null) continue;

    const appliedWeight = weight == null ? 1 : Math.max(0, weight);
    weighted += value * appliedWeight;
    totalWeight += appliedWeight;
  }

  if (totalWeight <= 0) return null;
  return toFixed2(weighted / totalWeight);
}

function buildTrend(records, xAxis = "day") {
  return records
    .filter((row) => row && row[xAxis])
    .map((row) => ({
      date: row[xAxis],
      views: toFixed2(row.views),
      impressions: toFixed2(row.impressions),
      ctr: toFixed2(row.impressionClickThroughRate),
      averageViewDuration: toFixed2(row.averageViewDuration),
      averageViewPercentage: toFixed2(row.averageViewPercentage),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function pctDirection(records, key) {
  if (!records.length) return null;
  const first = records[0]?.[key];
  const last = records[records.length - 1]?.[key];
  if (first == null || last == null) return null;
  const safeFirst = Number(first);
  const safeLast = Number(last);
  if (!Number.isFinite(safeFirst) || !Number.isFinite(safeLast)) return null;
  if (safeFirst <= 0) return safeLast > 0 ? 100 : 0;
  return toFixed2(((safeLast - safeFirst) / safeFirst) * 100);
}

function buildSummary(videos, channelTrend) {
  const validCtr = videos
    .map((video) => toNumber(video.impressionClickThroughRate))
    .filter((value) => value != null);
  const validRetention = videos
    .map((video) => toNumber(video.averageViewPercentage))
    .filter((value) => value != null);

  const totalViews = videos.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalImpressions = videos.reduce(
    (sum, item) => sum + (item.impressions || 0),
    0,
  );

  const avgCtr = weightedAverage(videos, "impressionClickThroughRate", "impressions");
  const avgRetention = weightedAverage(
    videos,
    "averageViewPercentage",
    "views",
  );
  const avgWatch = weightedAverage(videos, "averageViewDuration", "views");

  const insights = [];
  if (avgCtr == null) {
    insights.push("CTR data is not yet sufficient for this window.");
  } else if (avgCtr < 2.5) {
    insights.push("Avg CTR is weak (<2.5%). Prioritize thumbnail/text and first-hook.");
  } else if (avgCtr > 4) {
    insights.push("Avg CTR is healthy (>4%).");
  }

  if (avgRetention == null) {
    insights.push("Retention is unavailable; metrics likely still warming up.");
  } else if (avgRetention < 35) {
    insights.push("Retention is below 35%; consider faster value delivery.");
  }

  const ctrTrend = pctDirection(channelTrend, "ctr");
  const retentionTrend = pctDirection(channelTrend, "averageViewPercentage");

  if (ctrTrend == null) {
    insights.push("Need more than 2 days for meaningful CTR direction.");
  } else if (ctrTrend >= 10) {
    insights.push("CTR rising this window.");
  } else if (ctrTrend <= -10) {
    insights.push("CTR declining this window.");
  }

  return {
    shortCount: videos.length,
    views: toFixed2(totalViews),
    impressions: toFixed2(totalImpressions),
    avgCtr,
    avgViewPercent: avgRetention,
    avgWatchDuration: avgWatch,
    ctrTrend,
    retentionTrend,
    insights,
  };
}

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const requestUrl = new URL(req.url, "http://localhost");
  const days = clampInt(requestUrl.searchParams.get("days"), DEFAULT_DAYS, 1, MAX_DAYS);
  const limit = clampInt(
    requestUrl.searchParams.get("limit"),
    DEFAULT_LIMIT,
    1,
    MAX_LIMIT,
  );
  const requestedVideoId = requestUrl.searchParams.get("videoId")?.trim() || "all";

  const warnings = [];

  try {
    const { token, source } = await getAccessToken();
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (days - 1));

    const window = {
      days,
      startDate: toDate(startDate),
      endDate: toDate(endDate),
      limit,
      requestedVideoId,
    };

    const channel = await fetchChannel(token);

    const shortsCandidates = await fetchShortVideos(
      token,
      channel.uploadsPlaylistId,
      Math.max(limit * 8, 24),
    );

    const shortMetricsUrl = new URL(YT_ANALYTICS_BASE_URL);
    shortMetricsUrl.searchParams.set("ids", "channel==MINE");
    shortMetricsUrl.searchParams.set("startDate", window.startDate);
    shortMetricsUrl.searchParams.set("endDate", window.endDate);
    shortMetricsUrl.searchParams.set("dimensions", "video");
    shortMetricsUrl.searchParams.set("metrics", YT_METRICS);

    const rawVideoRows = await safeAnalyticsFetch(
      shortMetricsUrl,
      token,
      warnings,
      "Short metrics query",
    );

    const shortIdSet = new Set(shortsCandidates.map((short) => short.videoId));
    const shortRows = rawVideoRows.filter((row) => shortIdSet.has(row.video));

    let shortlisted = enrichShorts(shortsCandidates, shortRows)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);

    let selectedVideoId = requestedVideoId === "all" ? null : requestedVideoId;
    if (selectedVideoId) {
      const found = shortlisted.some((video) => video.videoId === selectedVideoId);
      if (!found) {
        warnings.push(
          `Requested videoId (${selectedVideoId}) is not in current top ${limit}; using strongest signal instead.`,
        );
        selectedVideoId = null;
      }
    }

    if (!selectedVideoId && shortlisted.length) {
      selectedVideoId = shortlisted[0].videoId;
    }

    const selectedVideo = shortlisted.find(
      (video) => video.videoId === selectedVideoId,
    );

    const channelTrendUrl = new URL(YT_ANALYTICS_BASE_URL);
    channelTrendUrl.searchParams.set("ids", "channel==MINE");
    channelTrendUrl.searchParams.set("startDate", window.startDate);
    channelTrendUrl.searchParams.set("endDate", window.endDate);
    channelTrendUrl.searchParams.set("dimensions", "day");
    channelTrendUrl.searchParams.set("metrics", YT_METRICS);

    const rawChannelTrendRows = await safeAnalyticsFetch(
      channelTrendUrl,
      token,
      warnings,
      "Channel trend query",
    );

    const channelTrend = buildTrend(rawChannelTrendRows, "day");

    const selectedTrendRows = selectedVideo
      ? await safeAnalyticsFetch(
          (() => {
            const selectedTrendUrl = new URL(YT_ANALYTICS_BASE_URL);
            selectedTrendUrl.searchParams.set("ids", "channel==MINE");
            selectedTrendUrl.searchParams.set("startDate", window.startDate);
            selectedTrendUrl.searchParams.set("endDate", window.endDate);
            selectedTrendUrl.searchParams.set("dimensions", "day");
            selectedTrendUrl.searchParams.set("metrics", YT_METRICS);
            selectedTrendUrl.searchParams.set("filters", `video==${selectedVideo.videoId}`);
            return selectedTrendUrl;
          })(),
          token,
          warnings,
          `Selected video trend query (${selectedVideo.videoId})`,
        )
      : [];

    const selectedVideoTrend = buildTrend(selectedTrendRows, "day");

    const summary = buildSummary(shortlisted, channelTrend);

    shortlisted = shortlisted.map((video) => ({
      ...video,
      relativeScore:
        (video.health === "low" ? 0 : video.health === "medium" ? 1 : video.health === "high" ? 2 : 3),
    }));

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      window,
      source,
      channelId: channel.channelId,
      channelName: channel.channelName,
      summary,
      videos: shortlisted,
      channelTrend,
      selectedVideo,
      selectedVideoTrend,
      selectedVideoId: selectedVideo?.videoId ?? null,
      scannedVideos: shortsCandidates.length,
      warnings,
    });
  } catch (error) {
    console.error("[youtube-analytics] Failed", error);
    const message =
      error?.message &&
      /invalid_grant|Credentials|oauth|permission|forbidden|unauthorized/i.test(
        error.message,
      )
        ? "YouTube API auth failed. Set YT_* OAuth credentials or Google service account credentials."
        : error?.message || "Unable to fetch YouTube analytics.";

    return res.status(500).json({ error: message });
  }
}
