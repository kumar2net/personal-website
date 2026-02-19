import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '..', '..');

const resolveOutRoot = () => {
  const configured = process.env.SHORTS_OPTIMIZER_OUT_DIR;
  if (!configured) {
    return path.join(repoRoot, 'out');
  }

  return path.isAbsolute(configured)
    ? configured
    : path.resolve(repoRoot, configured);
};

const outRoot = resolveOutRoot();
const dashboardOutputPath = path.join(
  appRoot,
  'public',
  'shorts-optimizer',
  'dashboard.json',
);

const TIMESTAMP_PATTERN =
  /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/u;

const isObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const toNumberOrNull = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
};

const toIsoFromRunId = (runId) => {
  const match = TIMESTAMP_PATTERN.exec(runId);
  if (!match) {
    return null;
  }

  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}.000Z`;
};

const safeReadJson = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
};

const listDirectories = async (dirPath) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
};

const buildRecord = ({ videoId, runId, metrics, variant, runDir }) => {
  const generatedAt =
    typeof variant?.generatedAt === 'string' && variant.generatedAt.trim()
      ? variant.generatedAt
      : toIsoFromRunId(runId) || new Date(0).toISOString();

  const metricsWindow = isObject(metrics?.window) ? metrics.window : {};

  return {
    videoId,
    runId,
    generatedAt,
    sourceVideoTitle:
      typeof variant?.sourceVideoTitle === 'string'
        ? variant.sourceVideoTitle
        : null,
    variantTitle:
      typeof variant?.metadata?.title === 'string' ? variant.metadata.title : null,
    primaryFix:
      typeof variant?.primaryFix === 'string' ? variant.primaryFix : null,
    impressions: toNumberOrNull(metrics?.impressions),
    impressionClickThroughRate: toNumberOrNull(
      metrics?.impressionClickThroughRate,
    ),
    views: toNumberOrNull(metrics?.views),
    averageViewDuration: toNumberOrNull(metrics?.averageViewDuration),
    averageViewPercentage: toNumberOrNull(metrics?.averageViewPercentage),
    first3sRetentionProxy: toNumberOrNull(metrics?.first3sRetentionProxy),
    windowMode:
      typeof metricsWindow.mode === 'string' ? metricsWindow.mode : null,
    windowStartDate:
      typeof metricsWindow.startDate === 'string' ? metricsWindow.startDate : null,
    windowEndDate:
      typeof metricsWindow.endDate === 'string' ? metricsWindow.endDate : null,
    outputPath: path.relative(repoRoot, runDir),
  };
};

const buildLatestByVideo = (records) => {
  const grouped = new Map();

  for (const record of records) {
    const current = grouped.get(record.videoId) || [];
    current.push(record);
    grouped.set(record.videoId, current);
  }

  const latest = [];

  for (const [videoId, runs] of grouped) {
    const sorted = runs
      .slice()
      .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

    const latestRun = sorted[0];
    const previousRun = sorted[1] || null;

    latest.push({
      ...latestRun,
      deltaCtrFromPrevious:
        previousRun?.impressionClickThroughRate != null &&
        latestRun.impressionClickThroughRate != null
          ? +(latestRun.impressionClickThroughRate - previousRun.impressionClickThroughRate).toFixed(2)
          : null,
      deltaAvgViewPctFromPrevious:
        previousRun?.averageViewPercentage != null &&
        latestRun.averageViewPercentage != null
          ? +(latestRun.averageViewPercentage - previousRun.averageViewPercentage).toFixed(2)
          : null,
      deltaAvgViewDurationFromPrevious:
        previousRun?.averageViewDuration != null &&
        latestRun.averageViewDuration != null
          ? +(latestRun.averageViewDuration - previousRun.averageViewDuration).toFixed(2)
          : null,
    });

    // Keep deterministic order by videoId after computing deltas.
    latest.sort((a, b) => a.videoId.localeCompare(b.videoId));
  }

  return latest;
};

const average = (values) => {
  const numbers = values.filter((value) => Number.isFinite(value));
  if (!numbers.length) {
    return null;
  }

  const total = numbers.reduce((sum, value) => sum + value, 0);
  return +(total / numbers.length).toFixed(2);
};

const buildDashboardPayload = (records) => {
  const sortedRuns = records
    .slice()
    .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

  const latestByVideo = buildLatestByVideo(sortedRuns);

  const lowCtrRuns = sortedRuns.filter(
    (run) => run.impressionClickThroughRate != null && run.impressionClickThroughRate < 4,
  ).length;

  const lowRetentionRuns = sortedRuns.filter(
    (run) => run.averageViewPercentage != null && run.averageViewPercentage < 60,
  ).length;

  const summary = {
    records: sortedRuns.length,
    uniqueVideos: new Set(sortedRuns.map((run) => run.videoId)).size,
    lowCtrRuns,
    lowRetentionRuns,
    avgCtrLatest: average(
      latestByVideo.map((run) => run.impressionClickThroughRate),
    ),
    avgViewPctLatest: average(
      latestByVideo.map((run) => run.averageViewPercentage),
    ),
    avgViewDurationLatest: average(
      latestByVideo.map((run) => run.averageViewDuration),
    ),
  };

  return {
    version: 'shorts-optimizer.dashboard.v1',
    generatedAt: new Date().toISOString(),
    sourceOutDir: path.relative(repoRoot, outRoot),
    summary,
    latestByVideo,
    runs: sortedRuns,
  };
};

const collectRuns = async () => {
  const videoIds = await listDirectories(outRoot);
  const records = [];

  for (const videoId of videoIds) {
    const videoDir = path.join(outRoot, videoId);
    const runs = await listDirectories(videoDir);

    for (const runId of runs) {
      const runDir = path.join(videoDir, runId);
      const metrics = await safeReadJson(path.join(runDir, 'metrics.json'));
      if (!isObject(metrics)) {
        continue;
      }

      const variant = await safeReadJson(path.join(runDir, 'variant_plan.json'));
      records.push(
        buildRecord({
          videoId,
          runId,
          metrics,
          variant: isObject(variant) ? variant : null,
          runDir,
        }),
      );
    }
  }

  return records;
};

const main = async () => {
  const runs = await collectRuns();
  const dashboard = buildDashboardPayload(runs);

  await fs.mkdir(path.dirname(dashboardOutputPath), { recursive: true });
  await fs.writeFile(
    dashboardOutputPath,
    `${JSON.stringify(dashboard, null, 2)}\n`,
    'utf8',
  );

  console.log(
    `[shorts-metrics] Wrote ${path.relative(repoRoot, dashboardOutputPath)} with ${dashboard.summary.records} run records across ${dashboard.summary.uniqueVideos} videos.`,
  );
};

main().catch((error) => {
  console.error('[shorts-metrics] Failed to generate dashboard JSON:', error);
  process.exit(1);
});
