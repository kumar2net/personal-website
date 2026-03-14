import {
  HEATMAP_GROUPS,
  HEATMAP_SOURCE_LABELS,
  MAGNIFICENT_SEVEN,
} from "../lib/heatmapConfig.js";

const COMMON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DAY_MS = 24 * 60 * 60 * 1000;
const SNAPSHOT_REFRESH_UTC_HOUR = 2;
const SNAPSHOT_REFRESH_UTC_MINUTE = 0;
const BROWSER_CACHE_MAX_AGE_SECONDS = 5 * 60;
const CDN_STALE_SECONDS = 12 * 60 * 60;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_FETCH_ATTEMPTS = 3;
const STOOQ_LOOKBACK_DAYS = 120;
const FRED_LOOKBACK_DAYS = 180;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const NSE_HEADERS = {
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Origin: "https://www.nseindia.com",
  Referer: "https://www.nseindia.com/market-data/live-equity-market",
  "User-Agent": USER_AGENT,
};

const STOOQ_HEADERS = {
  "User-Agent": USER_AGENT,
};

let memoryCache = {
  key: "",
  nextRefreshAt: 0,
  payload: null,
};

function applyCors(res) {
  Object.entries(COMMON_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function toCompactDate(date) {
  return date.replaceAll("-", "");
}

function getSnapshotWindow(now = new Date()) {
  const refreshToday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      SNAPSHOT_REFRESH_UTC_HOUR,
      SNAPSHOT_REFRESH_UTC_MINUTE,
      0,
      0,
    ),
  );
  const activeRefreshAt =
    now.valueOf() >= refreshToday.valueOf()
      ? refreshToday
      : new Date(refreshToday.valueOf() - DAY_MS);
  const nextRefreshAt = new Date(activeRefreshAt.valueOf() + DAY_MS);
  const cacheSeconds = Math.max(
    60,
    Math.floor((nextRefreshAt.valueOf() - now.valueOf()) / 1000),
  );

  return {
    key: toIsoDate(activeRefreshAt),
    activeRefreshAt,
    nextRefreshAt,
    cacheSeconds,
    cadenceLabel: "Refreshes once daily after 07:30 IST (02:00 UTC).",
  };
}

function buildHttpCacheControl(cacheSeconds) {
  const browserCacheSeconds = Math.min(
    BROWSER_CACHE_MAX_AGE_SECONDS,
    cacheSeconds,
  );
  return `public, max-age=${browserCacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CDN_STALE_SECONDS}`;
}

function parseIsoDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function parseNseDate(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const [dayRaw, monthRaw, yearRaw] = value.split("-");
  const day = Number(dayRaw);
  const year = Number(yearRaw);
  const monthMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  const month = monthMap[String(monthRaw || "").slice(0, 3).toLowerCase()];

  if (!Number.isFinite(day) || !Number.isFinite(year) || month == null) {
    return null;
  }

  const date = new Date(Date.UTC(year, month, day));
  return Number.isNaN(date.valueOf()) ? null : date;
}

function parseCsvRows(text) {
  return String(text || "")
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(",").map((part) => part.trim()));
}

function parseStooqSeries(text) {
  return parseCsvRows(text)
    .map(([date, open, high, low, close, volume]) => ({
      date,
      dateObject: parseIsoDate(date),
      open: numberOrNull(open),
      high: numberOrNull(high),
      low: numberOrNull(low),
      close: numberOrNull(close),
      volume: numberOrNull(volume),
    }))
    .filter((row) => row.dateObject && row.close != null)
    .sort((left, right) => left.date.localeCompare(right.date));
}

function parseFredSeries(text) {
  return parseCsvRows(text)
    .map(([date, value]) => ({
      date,
      dateObject: parseIsoDate(date),
      close: numberOrNull(value),
    }))
    .filter((row) => row.dateObject && row.close != null)
    .sort((left, right) => left.date.localeCompare(right.date));
}

function roundValue(value, decimals = 2) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Number(value.toFixed(decimals));
}

function calcPercentChange(current, baseline) {
  if (!Number.isFinite(current) || !Number.isFinite(baseline) || baseline === 0) {
    return null;
  }
  return roundValue(((current - baseline) / baseline) * 100, 2);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatMetricValue(item) {
  const value = Number(item?.latestValue);
  if (!Number.isFinite(value)) {
    return "—";
  }

  const digits =
    value >= 1000 ? 0 : value >= 100 ? 2 : value >= 10 ? 2 : 3;
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits === 0 ? 0 : Math.min(digits, 2),
  }).format(value);

  if (typeof item.unitLabel === "string" && item.unitLabel.startsWith("USD/")) {
    return `$${formatted}`;
  }

  return formatted;
}

function findReferencePoint(rows, daysBack) {
  if (!rows.length) {
    return null;
  }

  const latest = rows.at(-1);
  const targetMs =
    latest.dateObject.valueOf() - daysBack * 24 * 60 * 60 * 1000;

  for (let index = rows.length - 1; index >= 0; index -= 1) {
    if (rows[index].dateObject.valueOf() <= targetMs) {
      return rows[index];
    }
  }

  return rows[0] || null;
}

function summarizeSeries(rows) {
  if (rows.length < 2) {
    throw new Error("Not enough history to calculate changes");
  }

  const latest = rows.at(-1);
  const previous = rows.at(-2);
  const oneWeekAgo = findReferencePoint(rows, 7);
  const oneMonthAgo = findReferencePoint(rows, 30);

  return {
    asOf: latest.date,
    latestValue: latest.close,
    previousClose: previous.close,
    dayChangePct: calcPercentChange(latest.close, previous.close),
    weekChangePct: oneWeekAgo
      ? calcPercentChange(latest.close, oneWeekAgo.close)
      : null,
    monthChangePct: oneMonthAgo
      ? calcPercentChange(latest.close, oneMonthAgo.close)
      : null,
    sparkline: rows.slice(-20).map((row) => roundValue(row.close, 4)),
  };
}

function formatSourceUrl(definition) {
  if (definition.source === "stooq") {
    return `https://stooq.com/q/?s=${encodeURIComponent(definition.symbol)}`;
  }

  if (definition.source === "fred") {
    return `https://fred.stlouisfed.org/series/${definition.seriesId}`;
  }

  if (definition.source === "nse") {
    return "https://www.nseindia.com/market-data/live-equity-market";
  }

  return null;
}

function normalizeItem(definition, summary) {
  return {
    id: definition.id,
    label: definition.label,
    ticker: definition.ticker,
    source: definition.source,
    sourceLabel: HEATMAP_SOURCE_LABELS[definition.source] || definition.source,
    sourceUrl: formatSourceUrl(definition),
    unitLabel: definition.unitLabel || "price",
    asOf: summary.asOf,
    latestValue: roundValue(summary.latestValue, 4),
    previousClose: roundValue(summary.previousClose, 4),
    changes: {
      dayPct: summary.dayChangePct,
      weekPct: summary.weekChangePct,
      monthPct: summary.monthChangePct,
    },
    sparkline: summary.sparkline,
  };
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchText(url, headers = {}) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        const details = await response.text().catch(() => "");
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        error.details = details;
        throw error;
      }

      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < MAX_FETCH_ATTEMPTS) {
        await sleep(200 * attempt);
        continue;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
}

async function fetchJson(url, headers = {}) {
  const text = await fetchText(url, headers);
  return JSON.parse(text);
}

async function loadStooqItem(definition) {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - STOOQ_LOOKBACK_DAYS);

  const url =
    `https://stooq.com/q/d/l/?s=${encodeURIComponent(definition.symbol)}` +
    `&d1=${toCompactDate(toIsoDate(startDate))}` +
    `&d2=${toCompactDate(toIsoDate(endDate))}` +
    "&i=d";

  const text = await fetchText(url, STOOQ_HEADERS);
  const rows = parseStooqSeries(text);

  return normalizeItem(definition, summarizeSeries(rows));
}

async function loadFredItem(definition) {
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - FRED_LOOKBACK_DAYS);

  const url =
    `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(
      definition.seriesId,
    )}` + `&cosd=${toIsoDate(startDate)}`;

  const text = await fetchText(url, STOOQ_HEADERS);
  const rows = parseFredSeries(text);

  return normalizeItem(definition, summarizeSeries(rows));
}

async function loadNseIndexMap() {
  const json = await fetchJson(
    "https://www.nseindia.com/api/allIndices",
    NSE_HEADERS,
  );

  const rows = Array.isArray(json?.data) ? json.data : [];
  return new Map(rows.map((row) => [row.index, row]));
}

function loadNseItem(definition, indexMap) {
  const row = indexMap.get(definition.index);

  if (!row) {
    throw new Error(`Missing NSE index ${definition.index}`);
  }

  const latestValue = numberOrNull(row.last);
  const previousClose = numberOrNull(row.previousClose);
  const weekValue = numberOrNull(row.oneWeekAgoVal);
  const monthValue = numberOrNull(row.oneMonthAgoVal);
  const asOfDate = parseNseDate(row.previousDay) || new Date();

  if (latestValue == null || previousClose == null) {
    throw new Error(`Invalid NSE payload for ${definition.index}`);
  }

  return normalizeItem(definition, {
    asOf: toIsoDate(asOfDate),
    latestValue,
    previousClose,
    dayChangePct:
      numberOrNull(row.percentChange) ??
      calcPercentChange(latestValue, previousClose),
    weekChangePct: calcPercentChange(latestValue, weekValue),
    monthChangePct: calcPercentChange(latestValue, monthValue),
    sparkline: [
      monthValue,
      weekValue,
      previousClose,
      latestValue,
    ].filter((value) => Number.isFinite(value)),
  });
}

async function settleWithConcurrency(values, worker, concurrency) {
  const results = new Array(values.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      try {
        results[currentIndex] = {
          status: "fulfilled",
          value: await worker(values[currentIndex], currentIndex),
        };
      } catch (reason) {
        results[currentIndex] = {
          status: "rejected",
          reason,
        };
      }
    }
  }

  const workerCount = Math.min(Math.max(concurrency, 1), values.length || 1);
  await Promise.all(
    Array.from({ length: workerCount }, () => runWorker()),
  );
  return results;
}

function buildHighlights(categories) {
  const flatItems = categories.flatMap((group) => group.items);
  const withDay = flatItems.filter((item) => item.changes.dayPct != null);
  const withMonth = flatItems.filter((item) => item.changes.monthPct != null);
  const sortedDay = [...withDay].sort(
    (left, right) => right.changes.dayPct - left.changes.dayPct,
  );
  const sortedMonth = [...withMonth].sort(
    (left, right) => right.changes.monthPct - left.changes.monthPct,
  );

  return {
    breadth: {
      positive: withDay.filter((item) => item.changes.dayPct > 0).length,
      negative: withDay.filter((item) => item.changes.dayPct < 0).length,
      flat: withDay.filter((item) => item.changes.dayPct === 0).length,
      total: withDay.length,
    },
    leaders: sortedDay.slice(0, 3).map((item) => ({
      label: item.label,
      ticker: item.ticker,
      changePct: item.changes.dayPct,
    })),
    laggards: [...sortedDay]
      .reverse()
      .slice(0, 3)
      .map((item) => ({
        label: item.label,
        ticker: item.ticker,
        changePct: item.changes.dayPct,
      })),
    strongestMonth: sortedMonth.slice(0, 3).map((item) => ({
      label: item.label,
      ticker: item.ticker,
      changePct: item.changes.monthPct,
    })),
  };
}

function averageChange(items, horizon) {
  const values = items
    .map((item) => item?.changes?.[horizon])
    .filter((value) => Number.isFinite(value));

  if (!values.length) {
    return null;
  }

  return roundValue(
    values.reduce((sum, value) => sum + value, 0) / values.length,
    2,
  );
}

function findGroup(categories, id) {
  return categories.find((group) => group.id === id) || null;
}

function findItem(items, id) {
  return items.find((item) => item.id === id) || null;
}

function pickMover(items, horizon, direction = "max") {
  const validItems = items.filter((item) => Number.isFinite(item?.changes?.[horizon]));

  if (!validItems.length) {
    return null;
  }

  return [...validItems].sort((left, right) =>
    direction === "min"
      ? left.changes[horizon] - right.changes[horizon]
      : right.changes[horizon] - left.changes[horizon],
  )[0];
}

function describeVixRegime(value) {
  if (!Number.isFinite(value)) {
    return "unknown";
  }

  if (value < 15) {
    return "calm";
  }

  if (value < 20) {
    return "contained";
  }

  if (value < 25) {
    return "elevated";
  }

  return "stressed";
}

function buildInsights(categories, magnificentSeven, highlights) {
  const insights = [];
  const breadth = highlights?.breadth;
  const macroGroup = findGroup(categories, "macro-temperature");
  const usGroup = findGroup(categories, "us-market-pulse");
  const indiaGroup = findGroup(categories, "india-market-pulse");
  const renewablesGroup = findGroup(categories, "renewables-transition");
  const aiGroup = findGroup(categories, "ai-infrastructure");
  const vix = macroGroup ? findItem(macroGroup.items, "vix") : null;
  const wti = macroGroup ? findItem(macroGroup.items, "wti") : null;
  const brent = macroGroup ? findItem(macroGroup.items, "brent") : null;
  const henryHub = macroGroup ? findItem(macroGroup.items, "henry-hub") : null;

  if (breadth?.total) {
    const positiveShare = breadth.positive / breadth.total;
    const vixValue = vix?.latestValue;
    let tone = "neutral";
    let title = "Risk tone is mixed";
    let summary =
      "Breadth is split enough that the daily tape does not point to a clean risk-on or risk-off read.";

    if (positiveShare >= 0.6 && (!Number.isFinite(vixValue) || vixValue < 18)) {
      tone = "positive";
      title = "Risk tone is constructive";
      summary = `Breadth is healthy at ${breadth.positive}/${breadth.total} positive, and VIX is ${formatMetricValue(
        vix,
      )}, which keeps the volatility backdrop relatively calm.`;
    } else if (
      positiveShare <= 0.4 ||
      (Number.isFinite(vixValue) && vixValue >= 22)
    ) {
      tone = "negative";
      title = "Risk tone is cautious";
      summary = `Only ${breadth.positive}/${breadth.total} tracked instruments are positive, and VIX is ${formatMetricValue(
        vix,
      )}, which points to a more defensive tone.`;
    } else if (Number.isFinite(vixValue)) {
      summary = `Breadth is ${breadth.positive}/${breadth.total} positive and VIX sits in a ${describeVixRegime(
        vixValue,
      )} regime at ${formatMetricValue(vix)}.`;
    }

    insights.push({
      id: "risk-tone",
      title,
      summary,
      tone,
      evidence: [
        `Breadth: ${breadth.positive} up, ${breadth.negative} down, ${breadth.flat} flat`,
        `VIX: ${formatMetricValue(vix)} (${describeVixRegime(vix?.latestValue)})`,
      ],
    });
  }

  if (usGroup && indiaGroup) {
    const usDay = averageChange(usGroup.items, "dayPct");
    const indiaDay = averageChange(indiaGroup.items, "dayPct");
    const usLeader = pickMover(usGroup.items, "dayPct");
    const indiaLeader = pickMover(indiaGroup.items, "dayPct");

    if (Number.isFinite(usDay) && Number.isFinite(indiaDay)) {
      const spread = roundValue(usDay - indiaDay, 2);
      let tone = "neutral";
      let title = "U.S. and India are moving in step";
      let summary = `The U.S. basket is averaging ${formatPercent(
        usDay,
      )} for the day versus ${formatPercent(
        indiaDay,
      )} for India, so cross-market leadership is fairly balanced.`;

      if (spread >= 0.5) {
        tone = usDay > 0 ? "positive" : "negative";
        title = "U.S. indices are leading the day";
        summary = `The U.S. basket is averaging ${formatPercent(
          usDay,
        )} versus ${formatPercent(
          indiaDay,
        )} in India, with ${usLeader?.ticker || "U.S. benchmarks"} setting the stronger pace.`;
      } else if (spread <= -0.5) {
        tone = indiaDay > 0 ? "positive" : "negative";
        title = "India is leading the day";
        summary = `India is averaging ${formatPercent(
          indiaDay,
        )} versus ${formatPercent(
          usDay,
        )} for the U.S. group, with ${indiaLeader?.ticker || "the India basket"} showing the firmer tone.`;
      } else if (usDay > 0 && indiaDay > 0) {
        tone = "positive";
      } else if (usDay < 0 && indiaDay < 0) {
        tone = "negative";
      }

      insights.push({
        id: "cross-market",
        title,
        summary,
        tone,
        evidence: [
          `U.S. average 1D: ${formatPercent(usDay)}`,
          `India average 1D: ${formatPercent(indiaDay)}`,
          `${usLeader?.ticker || "U.S."} lead: ${formatPercent(
            usLeader?.changes?.dayPct,
          )} | ${indiaLeader?.ticker || "India"} lead: ${formatPercent(
            indiaLeader?.changes?.dayPct,
          )}`,
        ],
      });
    }
  }

  if (aiGroup) {
    const aiDay = averageChange(aiGroup.items, "dayPct");
    const aiMonth = averageChange(aiGroup.items, "monthPct");
    const aiLeader = pickMover(aiGroup.items, "dayPct");
    const aiLaggard = pickMover(aiGroup.items, "dayPct", "min");

    if (Number.isFinite(aiDay) || Number.isFinite(aiMonth)) {
      let tone = "neutral";
      let title = "AI infrastructure is mixed";
      let summary = `The AI hardware stack is averaging ${formatPercent(
        aiDay,
      )} on the day and ${formatPercent(aiMonth)} over one month, so the trend is not one-way.`;

      if (Number.isFinite(aiDay) && Number.isFinite(aiMonth)) {
        if (aiDay >= 0.75 && aiMonth >= 5) {
          tone = "positive";
          title = "AI infrastructure remains a leadership pocket";
          summary = `The AI hardware stack is averaging ${formatPercent(
            aiDay,
          )} on the day and ${formatPercent(
            aiMonth,
          )} over one month, which still looks like leadership rather than a one-off bounce.`;
        } else if (aiDay <= -0.75 && aiMonth < 0) {
          tone = "negative";
          title = "AI infrastructure has lost short-term momentum";
          summary = `The group is averaging ${formatPercent(
            aiDay,
          )} on the day and ${formatPercent(
            aiMonth,
          )} over one month, which suggests the AI complex is under distribution rather than extending.`;
        }
      }

      insights.push({
        id: "ai-infrastructure",
        title,
        summary,
        tone,
        evidence: [
          `AI average 1D: ${formatPercent(aiDay)}`,
          `AI average 1M: ${formatPercent(aiMonth)}`,
          `Leader: ${aiLeader?.ticker || "—"} ${formatPercent(
            aiLeader?.changes?.dayPct,
          )} | Laggard: ${aiLaggard?.ticker || "—"} ${formatPercent(
            aiLaggard?.changes?.dayPct,
          )}`,
        ],
      });
    }
  }

  if (macroGroup && renewablesGroup) {
    const oilDay = averageChange(
      [wti, brent].filter(Boolean),
      "dayPct",
    );
    const renewablesDay = averageChange(renewablesGroup.items, "dayPct");
    const renewablesMonth = averageChange(renewablesGroup.items, "monthPct");

    if (Number.isFinite(oilDay) || Number.isFinite(renewablesDay)) {
      let tone = "neutral";
      let title = "Energy and transition signals are mixed";
      let summary = `Oil is moving ${formatPercent(
        oilDay,
      )} on average for the day while the renewables basket is at ${formatPercent(
        renewablesDay,
      )}, so macro energy and transition equities are not telling the same story cleanly.`;

      if (Number.isFinite(oilDay) && Number.isFinite(renewablesDay)) {
        if (oilDay >= 1 && renewablesDay < 0) {
          tone = "negative";
          title = "Energy pressure is firm while transition names lag";
          summary = `WTI and Brent are up ${formatPercent(
            oilDay,
          )} on average while renewables are down ${formatPercent(
            renewablesDay,
          )}, a combination that usually points to a tougher macro backdrop for the transition trade.`;
        } else if (oilDay <= -1 && renewablesDay > 0) {
          tone = "positive";
          title = "Energy pressure is easing while transition names improve";
          summary = `Oil is down ${formatPercent(
            oilDay,
          )} on average and renewables are up ${formatPercent(
            renewablesDay,
          )}, which is a friendlier setup for clean-energy equities.`;
        }
      }

      insights.push({
        id: "energy-transition",
        title,
        summary,
        tone,
        evidence: [
          `WTI: ${formatMetricValue(wti)} | Brent: ${formatMetricValue(brent)}`,
          `Henry Hub: ${formatMetricValue(henryHub)} | Renewables average 1D: ${formatPercent(
            renewablesDay,
          )}`,
          `Renewables average 1M: ${formatPercent(renewablesMonth)}`,
        ],
      });
    }
  }

  if (magnificentSeven.length) {
    const mag7Day = averageChange(magnificentSeven, "dayPct");
    const positiveCount = magnificentSeven.filter(
      (item) => (item.changes.dayPct || 0) > 0,
    ).length;
    const mag7Leader = pickMover(magnificentSeven, "dayPct");
    const mag7Laggard = pickMover(magnificentSeven, "dayPct", "min");

    let tone = "neutral";
    let title = "Magnificent 7 breadth is mixed";
    let summary = `${positiveCount}/7 Magnificent 7 names are positive, and the basket is averaging ${formatPercent(
      mag7Day,
    )} for the day.`;

    if (positiveCount >= 5 && Number.isFinite(mag7Day) && mag7Day > 0.5) {
      tone = "positive";
      title = "Mega-cap growth is carrying the tape";
      summary = `${positiveCount}/7 Magnificent 7 names are positive, with the basket averaging ${formatPercent(
        mag7Day,
      )}; that is broad enough to matter for index tone.`;
    } else if (
      positiveCount <= 2 &&
      Number.isFinite(mag7Day) &&
      mag7Day < 0
    ) {
      tone = "negative";
      title = "Mega-cap growth breadth is narrow";
      summary = `Only ${positiveCount}/7 Magnificent 7 names are positive, and the basket is averaging ${formatPercent(
        mag7Day,
      )}, so index support from mega-cap tech looks thin.`;
    }

    insights.push({
      id: "magnificent-seven",
      title,
      summary,
      tone,
      evidence: [
        `Positive names: ${positiveCount}/7`,
        `Leader: ${mag7Leader?.ticker || "—"} ${formatPercent(
          mag7Leader?.changes?.dayPct,
        )}`,
        `Laggard: ${mag7Laggard?.ticker || "—"} ${formatPercent(
          mag7Laggard?.changes?.dayPct,
        )}`,
      ],
    });
  }

  return insights;
}

function uniqueDefinitions(definitions) {
  const idsInOrder = [];
  const byId = new Map();

  definitions.forEach((definition) => {
    if (!byId.has(definition.id)) {
      idsInOrder.push(definition.id);
      byId.set(definition.id, definition);
      return;
    }

    byId.set(definition.id, {
      ...byId.get(definition.id),
      ...definition,
    });
  });

  return idsInOrder.map((id) => byId.get(id));
}

async function buildPayload(snapshotWindow) {
  const warnings = [];
  const nseDefinitions = HEATMAP_GROUPS.flatMap((group) =>
    group.items.filter((item) => item.source === "nse"),
  );
  const stooqDefinitions = uniqueDefinitions([
    ...HEATMAP_GROUPS.flatMap((group) =>
      group.items.filter((item) => item.source === "stooq"),
    ),
    ...MAGNIFICENT_SEVEN,
  ]);
  const fredDefinitions = HEATMAP_GROUPS.flatMap((group) =>
    group.items.filter((item) => item.source === "fred"),
  );

  const [nseResult, stooqResults, fredResults] = await Promise.all([
    nseDefinitions.length
      ? loadNseIndexMap()
          .then(
            (indexMap) =>
              new Map(
                nseDefinitions.map((definition) => [
                  definition.id,
                  loadNseItem(definition, indexMap),
                ]),
              ),
          )
          .then(
            (value) => ({ status: "fulfilled", value }),
            (reason) => ({ status: "rejected", reason }),
          )
      : Promise.resolve({ status: "fulfilled", value: new Map() }),
    settleWithConcurrency(
      stooqDefinitions,
      (definition) => loadStooqItem(definition),
      4,
    ),
    settleWithConcurrency(
      fredDefinitions,
      (definition) => loadFredItem(definition),
      2,
    ),
  ]);

  if (nseResult.status === "rejected") {
    warnings.push(`NSE India feed unavailable: ${nseResult.reason?.message || "Unknown error"}`);
  }

  const itemMap = new Map();

  if (nseResult.status === "fulfilled") {
    nseResult.value.forEach((item, key) => {
      itemMap.set(key, item);
    });
  }

  stooqResults.forEach((result, index) => {
    const definition = stooqDefinitions[index];
    if (result.status === "fulfilled") {
      itemMap.set(definition.id, result.value);
      return;
    }

    warnings.push(
      `${definition.label} unavailable from Stooq: ${
        result.reason?.message || "Unknown error"
      }`,
    );
  });

  fredResults.forEach((result, index) => {
    const definition = fredDefinitions[index];
    if (result.status === "fulfilled") {
      itemMap.set(definition.id, result.value);
      return;
    }

    warnings.push(
      `${definition.label} unavailable from FRED: ${
        result.reason?.message || "Unknown error"
      }`,
    );
  });

  const categories = HEATMAP_GROUPS.map((group) => {
    const items = group.items
      .map((definition) => itemMap.get(definition.id))
      .filter(Boolean);

    return {
      id: group.id,
      label: group.label,
      description: group.description,
      items,
    };
  }).filter((group) => group.items.length > 0);

  if (!categories.length) {
    throw new Error("No market data sources returned any usable data");
  }

  const highlights = buildHighlights(categories);
  const magnificentSeven = MAGNIFICENT_SEVEN.map((definition) =>
    itemMap.get(definition.id),
  ).filter(Boolean);
  const insights = buildInsights(categories, magnificentSeven, highlights);
  const generatedAt = new Date().toISOString();

  return {
    generatedAt,
    status: warnings.length ? "partial" : "ok",
    snapshot: {
      key: snapshotWindow.key,
      generatedAt,
      refreshAt: snapshotWindow.activeRefreshAt.toISOString(),
      nextRefreshAt: snapshotWindow.nextRefreshAt.toISOString(),
      cadenceLabel: snapshotWindow.cadenceLabel,
      servedStale: false,
    },
    highlights,
    insights,
    categories,
    magnificentSeven,
    warnings,
    notes: [
      "This snapshot refreshes once daily after 07:30 IST (02:00 UTC) so the latest U.S. close and the prior India close land in the same daily read.",
      "U.S. equities and ETFs are derived from delayed daily history served by Stooq.",
      "India indices use NSE India's public market snapshot endpoint.",
      "Macro commodities and VIX come from FRED and can lag the freshest equity close by a session or more.",
    ],
  };
}

function buildStalePayload(payload, error, snapshotWindow) {
  return {
    ...payload,
    status: "stale",
    snapshot: {
      ...(payload.snapshot || {}),
      nextRefreshAt: snapshotWindow.nextRefreshAt.toISOString(),
      cadenceLabel:
        payload.snapshot?.cadenceLabel || snapshotWindow.cadenceLabel,
      servedStale: true,
      staleReason: error?.message || "Unknown refresh error",
      requestedKey: snapshotWindow.key,
    },
    warnings: [
      `Fresh snapshot for ${snapshotWindow.key} failed; serving the most recent successful snapshot instead.`,
      ...(payload.warnings || []),
    ],
  };
}

async function getPayload() {
  const snapshotWindow = getSnapshotWindow();

  if (
    memoryCache.payload &&
    memoryCache.key === snapshotWindow.key &&
    memoryCache.nextRefreshAt > Date.now()
  ) {
    return {
      payload: memoryCache.payload,
      cacheSeconds: snapshotWindow.cacheSeconds,
    };
  }

  try {
    const payload = await buildPayload(snapshotWindow);
    memoryCache = {
      key: snapshotWindow.key,
      payload,
      nextRefreshAt: snapshotWindow.nextRefreshAt.valueOf(),
    };

    return {
      payload,
      cacheSeconds: snapshotWindow.cacheSeconds,
    };
  } catch (error) {
    if (memoryCache.payload) {
      return {
        payload: buildStalePayload(memoryCache.payload, error, snapshotWindow),
        cacheSeconds: Math.min(snapshotWindow.cacheSeconds, 15 * 60),
      };
    }

    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    applyCors(res);
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    applyCors(res);
    res.setHeader("content-type", "application/json");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { payload, cacheSeconds } = await getPayload();

    applyCors(res);
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", buildHttpCacheControl(cacheSeconds));
    return res.status(200).json(payload);
  } catch (error) {
    applyCors(res);
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "no-cache");
    return res.status(500).json({
      error: "Unable to build heatmap",
      details: String(error?.message || error),
    });
  }
}
