import { startTransition, useEffect, useRef, useState } from "react";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const STATIC_SNAPSHOT_ENDPOINT = "/data/keydata-latest.json";
const DEFAULT_DYNAMIC_ENDPOINT = "/api/keydata";
const LOCAL_PAYLOAD_CACHE_KEY = "kumar2net:keydata-payload:v1";
const LOCAL_PAYLOAD_CACHE_MAX_AGE_MS = 36 * 60 * 60 * 1000;

const DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const TIMESTAMP_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

const METRIC_GLOSSARY = [
  {
    term: "VIX",
    explanation:
      "The CBOE Volatility Index. It reflects implied S&P 500 volatility over the next 30 days, so rising VIX usually signals stress or fear in U.S. equities.",
  },
  {
    term: "WTI and Brent",
    explanation:
      "The two main crude benchmarks. WTI is the U.S. marker; Brent is the global seaborne marker. They matter because oil feeds inflation, transport costs, and geopolitical risk.",
  },
  {
    term: "Henry Hub",
    explanation:
      "The U.S. natural-gas benchmark. It helps read power prices, industrial fuel costs, and parts of the energy-transition supply chain.",
  },
  {
    term: "SMH",
    explanation:
      "A semiconductor ETF. It is a quick shorthand for chip-sector breadth when you want more than a single-stock view like NVDA or AMD.",
  },
  {
    term: "Magnificent 7",
    explanation:
      "Apple, Microsoft, Amazon, Alphabet, Meta, NVIDIA, and Tesla. They remain a useful mega-cap growth basket, even when their stories diverge.",
  },
];

function getEndpointCandidates(preferStatic) {
  const configuredEndpoint =
    import.meta.env.VITE_KEYDATA_ENDPOINT || DEFAULT_DYNAMIC_ENDPOINT;
  const dynamicCandidates = [];
  const candidates = preferStatic ? [STATIC_SNAPSHOT_ENDPOINT] : [];

  if (
    import.meta.env.DEV &&
    !import.meta.env.VITE_KEYDATA_ENDPOINT &&
    typeof window !== "undefined" &&
    window.location.port !== "3000"
  ) {
    dynamicCandidates.push("http://localhost:3000/api/keydata");
  }

  dynamicCandidates.push(configuredEndpoint);

  if (preferStatic) {
    candidates.push(...dynamicCandidates);
  } else {
    candidates.push(...dynamicCandidates, STATIC_SNAPSHOT_ENDPOINT);
  }

  return candidates;
}

function hasUsablePayloadShape(payload) {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      Array.isArray(payload.categories) &&
      payload.categories.length > 0,
  );
}

function getNextRefreshTimestamp(payload) {
  const nextRefreshAt = payload?.snapshot?.nextRefreshAt;
  if (!nextRefreshAt) {
    return null;
  }

  const timestamp = Date.parse(nextRefreshAt);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isPastRefreshBoundary(payload, now = Date.now()) {
  const nextRefreshTimestamp = getNextRefreshTimestamp(payload);
  return nextRefreshTimestamp != null && now >= nextRefreshTimestamp;
}

function readCachedKeyDataPayload() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_PAYLOAD_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const cachedEntry = JSON.parse(raw);
    const savedAt = Number(cachedEntry?.savedAt);
    const payload = cachedEntry?.payload;
    const isExpired =
      Number.isFinite(savedAt) &&
      Date.now() - savedAt > LOCAL_PAYLOAD_CACHE_MAX_AGE_MS;

    if (isExpired || !hasUsablePayloadShape(payload)) {
      window.localStorage.removeItem(LOCAL_PAYLOAD_CACHE_KEY);
      return null;
    }

    return payload;
  } catch {
    window.localStorage.removeItem(LOCAL_PAYLOAD_CACHE_KEY);
    return null;
  }
}

function writeCachedKeyDataPayload(payload) {
  if (typeof window === "undefined" || !hasUsablePayloadShape(payload)) {
    return;
  }

  try {
    window.localStorage.setItem(
      LOCAL_PAYLOAD_CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        payload,
      }),
    );
  } catch {
    // Ignore storage quota and serialization failures.
  }
}

async function fetchKeyDataPayload({
  signal,
  bypassBrowserCache = false,
  preferStatic = false,
} = {}) {
  const candidates = getEndpointCandidates(preferStatic);
  let lastError;
  let staleFallback = null;

  for (const endpoint of candidates) {
    try {
      const response = await fetch(endpoint, {
        cache: bypassBrowserCache ? "no-store" : "default",
        signal,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.error || `Key data request failed (${response.status})`,
        );
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
          `Key data endpoint did not return JSON (${contentType || "unknown content type"})`,
        );
      }

      const payload = await response.json();

      if (!hasUsablePayloadShape(payload)) {
        throw new Error("Key data payload is missing market categories");
      }

      if (
        endpoint === STATIC_SNAPSHOT_ENDPOINT &&
        isPastRefreshBoundary(payload)
      ) {
        staleFallback = payload;
        continue;
      }

      return payload;
    } catch (error) {
      lastError = error;
      if (signal?.aborted) {
        throw error;
      }
    }
  }

  if (staleFallback) {
    return staleFallback;
  }

  throw lastError || new Error("Key data request failed");
}

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) {
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

function formatAsOf(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }

  return DAY_FORMATTER.format(date);
}

function getHeatTone(theme, change) {
  if (change == null || Number.isNaN(change)) {
    return {
      accent: theme.palette.text.secondary,
      background: alpha(theme.palette.text.primary, 0.04),
      border: alpha(theme.palette.text.primary, 0.1),
      muted: alpha(theme.palette.text.primary, 0.08),
    };
  }

  const magnitude = Math.min(Math.abs(change) / 4, 1);
  const isPositive = change >= 0;
  const paletteKey = isPositive ? "success" : "error";
  const accent = theme.palette[paletteKey].main;

  return {
    accent,
    background: alpha(accent, 0.12 + magnitude * 0.14),
    border: alpha(accent, 0.24 + magnitude * 0.16),
    muted: alpha(accent, 0.12),
  };
}

function Sparkline({ points, color }) {
  if (!Array.isArray(points) || points.length < 2) {
    return (
      <Box
        sx={{
          height: 48,
          borderRadius: 3,
          bgcolor: "action.hover",
        }}
      />
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 100;
  const height = 36;
  const coordinates = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <Box sx={{ mt: 1.5 }}>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="48"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          points={coordinates.join(" ")}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}

function ChangeBadge({ label, value }) {
  const theme = useTheme();
  const tone = getHeatTone(theme, value);

  return (
    <Box
      sx={{
        px: 1.1,
        py: 0.7,
        borderRadius: 999,
        border: "1px solid",
        borderColor: tone.border,
        backgroundColor: tone.muted,
        minWidth: 74,
      }}
    >
      <Typography variant="caption" sx={{ display: "block", opacity: 0.78 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: tone.accent }}>
        {formatPercent(value)}
      </Typography>
    </Box>
  );
}

function ChangeText({ value }) {
  const theme = useTheme();
  const tone = getHeatTone(theme, value);

  return (
    <Typography
      variant="body2"
      sx={{ fontWeight: 700, color: tone.accent, whiteSpace: "nowrap" }}
    >
      {formatPercent(value)}
    </Typography>
  );
}

function SummaryCard({ eyebrow, value, detail }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: (theme) =>
          alpha(theme.palette.background.paper, 0.88),
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: "text.secondary", letterSpacing: 1.1 }}
      >
        {eyebrow}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
        {detail}
      </Typography>
    </Paper>
  );
}

function InsightCard({ insight }) {
  const theme = useTheme();
  const paletteKey =
    insight.tone === "positive"
      ? "success"
      : insight.tone === "negative"
        ? "error"
        : "info";
  const accent = theme.palette[paletteKey].main;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 4,
        border: "1px solid",
        borderColor: alpha(accent, 0.22),
        backgroundColor: alpha(accent, 0.06),
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Typography
          variant="overline"
          sx={{ color: accent, letterSpacing: 1.1, fontWeight: 700 }}
        >
          Generated insight
        </Typography>
        <Chip
          size="small"
          label={
            insight.tone === "positive"
              ? "Constructive"
              : insight.tone === "negative"
                ? "Defensive"
                : "Mixed"
          }
          sx={{
            borderColor: alpha(accent, 0.32),
            color: accent,
          }}
          variant="outlined"
        />
      </Stack>

      <Typography variant="h6" sx={{ mt: 1, lineHeight: 1.25 }}>
        {insight.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {insight.summary}
      </Typography>

      <Stack spacing={0.8} sx={{ mt: 1.75 }}>
        {insight.evidence?.map((entry) => (
          <Typography key={entry} variant="body2" color="text.secondary">
            {`\u2022 ${entry}`}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}

function InsightsSection({ insights, snapshot }) {
  if (!insights?.length) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box sx={{ maxWidth: 760 }}>
          <Typography variant="h5">Daily generated insights</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.9 }}>
            {snapshot?.cadenceLabel ||
              "This page refreshes on a daily snapshot cadence."}
          </Typography>
        </Box>
        <Chip
          label={
            snapshot?.key ? `Snapshot ${formatAsOf(snapshot.key)}` : "Daily snapshot"
          }
          variant="outlined"
        />
      </Stack>

      <Box
        sx={{
          mt: 2.5,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            xl: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </Box>
    </Paper>
  );
}

function MagnificentSevenTable({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box>
          <Typography variant="h5">Magnificent 7 Share Prices</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            A quick bottom-of-page check on the mega-cap U.S. platform and AI names.
          </Typography>
        </Box>
        <Chip label="Bottom table" variant="outlined" />
      </Stack>

      <TableContainer sx={{ mt: 2.5, overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ticker</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="right">Share Price</TableCell>
              <TableCell align="right">1D</TableCell>
              <TableCell align="right">1W</TableCell>
              <TableCell align="right">1M</TableCell>
              <TableCell align="right">As Of</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>{item.ticker}</TableCell>
                <TableCell>{item.label}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatMetricValue(item)}
                </TableCell>
                <TableCell align="right">
                  <ChangeText value={item.changes.dayPct} />
                </TableCell>
                <TableCell align="right">
                  <ChangeText value={item.changes.weekPct} />
                </TableCell>
                <TableCell align="right">
                  <ChangeText value={item.changes.monthPct} />
                </TableCell>
                <TableCell align="right" sx={{ color: "text.secondary" }}>
                  {formatAsOf(item.asOf)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function MetricGlossary() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="h5">What these metrics mean</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        A quick plain-language read on the shorthand used throughout the page.
      </Typography>
      <Box
        sx={{
          mt: 2.5,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        {METRIC_GLOSSARY.map((entry) => (
          <Paper
            key={entry.term}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: (theme) =>
                alpha(theme.palette.background.paper, 0.82),
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {entry.term}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {entry.explanation}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}

function MarketTile({ item }) {
  const theme = useTheme();
  const tone = getHeatTone(theme, item.changes.dayPct);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.2,
        borderRadius: 4,
        border: "1px solid",
        borderColor: tone.border,
        backgroundImage: `linear-gradient(180deg, ${tone.background}, ${alpha(
          theme.palette.background.paper,
          0.96,
        )})`,
        transition: "transform 180ms ease, border-color 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" gap={2}>
        <Box>
          <Typography
            variant="overline"
            sx={{ color: tone.accent, letterSpacing: 1.2 }}
          >
            {item.ticker}
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            {item.label}
          </Typography>
        </Box>
        <Chip
          label={item.sourceLabel}
          size="small"
          variant="outlined"
          sx={{
            borderColor: tone.border,
            color: "text.secondary",
            alignSelf: "flex-start",
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="baseline"
        spacing={1}
        sx={{ mt: 2.25 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.4 }}>
          {formatMetricValue(item)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.unitLabel === "price" ? "last close" : item.unitLabel}
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
        As of {formatAsOf(item.asOf)}
      </Typography>

      <Sparkline points={item.sparkline} color={tone.accent} />

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <ChangeBadge label="1D" value={item.changes.dayPct} />
        <ChangeBadge label="1W" value={item.changes.weekPct} />
        <ChangeBadge label="1M" value={item.changes.monthPct} />
      </Stack>
    </Paper>
  );
}

function KeyDataSection({ group }) {
  const positiveCount = group.items.filter(
    (item) => (item.changes.dayPct || 0) > 0,
  ).length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "1.9rem" } }}>
            {group.label}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {group.description}
          </Typography>
        </Box>
        <Chip
          label={`${positiveCount}/${group.items.length} up today`}
          color={positiveCount >= Math.ceil(group.items.length / 2) ? "success" : "default"}
          variant={positiveCount >= Math.ceil(group.items.length / 2) ? "filled" : "outlined"}
        />
      </Stack>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        {group.items.map((item) => (
          <MarketTile key={item.id} item={item} />
        ))}
      </Box>
    </Paper>
  );
}

export default function KeyData() {
  const theme = useTheme();
  const initialPayloadRef = useRef();

  if (initialPayloadRef.current === undefined) {
    initialPayloadRef.current = readCachedKeyDataPayload();
  }

  const [payload, setPayload] = useState(initialPayloadRef.current || null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!initialPayloadRef.current);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const cachedPayload = initialPayloadRef.current;
    const hasCachedPayload = Boolean(cachedPayload);
    const shouldBypassBrowserCache = isPastRefreshBoundary(cachedPayload);

    async function loadInitialData() {
      if (hasCachedPayload) {
        setIsRefreshing(true);
      }

      try {
        const nextPayload = await fetchKeyDataPayload({
          signal: controller.signal,
          bypassBrowserCache: shouldBypassBrowserCache,
          preferStatic: true,
        });
        writeCachedKeyDataPayload(nextPayload);
        startTransition(() => {
          setPayload(nextPayload);
          setError("");
        });
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError?.message || "Unable to load key data.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    loadInitialData();
    return () => controller.abort();
  }, []);

  async function refresh() {
    const controller = new AbortController();
    setIsRefreshing(true);

    try {
      const nextPayload = await fetchKeyDataPayload({
        signal: controller.signal,
        bypassBrowserCache: true,
        preferStatic: false,
      });
      writeCachedKeyDataPayload(nextPayload);
      startTransition(() => {
        setPayload(nextPayload);
        setError("");
      });
    } catch (refreshError) {
      setError(refreshError?.message || "Unable to reload key data.");
    } finally {
      setIsRefreshing(false);
      controller.abort();
    }
  }

  if (isLoading && !payload) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading the daily key data...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!payload) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {error || "Unable to load the market key data."}
      </Alert>
    );
  }

  const generatedAt = payload.snapshot?.generatedAt || payload.generatedAt;
  const generatedAtLabel = generatedAt
    ? TIMESTAMP_FORMATTER.format(new Date(generatedAt))
    : "Unknown time";
  const nextRefreshLabel = payload.snapshot?.nextRefreshAt
    ? TIMESTAMP_FORMATTER.format(new Date(payload.snapshot.nextRefreshAt))
    : "Unknown time";
  const breadth = payload.highlights?.breadth;
  const leader = payload.highlights?.leaders?.[0];
  const laggard = payload.highlights?.laggards?.[0];
  const strongestMonth = payload.highlights?.strongestMonth?.[0];

  return (
    <Stack spacing={3.5}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.75, md: 4 },
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          backgroundImage: `radial-gradient(circle at top left, ${alpha(
            theme.palette.primary.main,
            0.18,
          )}, transparent 38%), linear-gradient(180deg, ${alpha(
            theme.palette.background.paper,
            0.96,
          )}, ${alpha(theme.palette.background.default, 0.92)})`,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Typography
              variant="overline"
              sx={{ color: "primary.main", letterSpacing: 1.4 }}
            >
              Daily Key Data
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 1,
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.02,
              }}
            >
              Your daily pulse across U.S., India, crude, renewables, and AI hardware.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1.5, maxWidth: 680 }}
            >
              This daily snapshot tracks the themes that keep showing up in
              your writing and investing curiosity: benchmark indices, energy
              stress, the transition stack, the AI build-out, and a generated
              read on what the numbers imply.
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2.25 }}>
              <Chip label="USA + India" color="primary" variant="outlined" />
              <Chip label="Crude + volatility" color="primary" variant="outlined" />
              <Chip label="Renewables" color="primary" variant="outlined" />
              <Chip label="AI infrastructure" color="primary" variant="outlined" />
            </Stack>
          </Box>

          <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={1.5}>
            <Button
              variant="contained"
              color="primary"
              onClick={refresh}
              disabled={isRefreshing}
              startIcon={
                isRefreshing ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <RefreshRoundedIcon />
                )
              }
            >
              {isRefreshing ? "Reloading..." : "Reload snapshot"}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Snapshot {payload.snapshot?.key ? formatAsOf(payload.snapshot.key) : "Unknown date"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Built {generatedAtLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Next refresh after {nextRefreshLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Data is end-of-day and source timestamps can differ by market.
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {error ? (
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      ) : null}

      {payload.warnings?.length ? (
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          {payload.warnings.join(" ")}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <SummaryCard
          eyebrow="Breadth"
          value={
            breadth ? `${breadth.positive}/${breadth.total} positive` : "—"
          }
          detail="Simple 1-day breadth across the tracked watchlist."
        />
        <SummaryCard
          eyebrow="Leader"
          value={
            leader ? `${leader.ticker} ${formatPercent(leader.changePct)}` : "—"
          }
          detail={leader ? `${leader.label} led the 1-day tape.` : "No leader available."}
        />
        <SummaryCard
          eyebrow="Laggard"
          value={
            laggard
              ? `${laggard.ticker} ${formatPercent(laggard.changePct)}`
              : "—"
          }
          detail={
            laggard ? `${laggard.label} was the weakest 1-day move.` : "No laggard available."
          }
        />
        <SummaryCard
          eyebrow="Strongest 1M"
          value={
            strongestMonth
              ? `${strongestMonth.ticker} ${formatPercent(
                  strongestMonth.changePct,
                )}`
              : "—"
          }
          detail={
            strongestMonth
              ? `${strongestMonth.label} has the strongest 1-month change in the current set.`
              : "No 1-month leader available."
          }
        />
      </Box>

      <InsightsSection insights={payload.insights} snapshot={payload.snapshot} />

      {payload.categories.map((group) => (
        <KeyDataSection key={group.id} group={group} />
      ))}

      <MagnificentSevenTable items={payload.magnificentSeven} />

      <MetricGlossary />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5">How to read this page</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1.25}>
          {payload.notes?.map((note) => (
            <Typography key={note} variant="body2" color="text.secondary">
              {note}
            </Typography>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
