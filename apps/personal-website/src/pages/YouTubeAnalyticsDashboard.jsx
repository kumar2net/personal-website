import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";

const DASHBOARD_API = "/api/youtube-analytics";
const DAY_OPTIONS = [7, 14, 30, 60, 90];
const LIMIT_OPTIONS = [6, 10, 12, 16, 20];

function formatInt(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat().format(Math.round(value));
}

function formatPct(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value * 10) / 10}%`;
}

function formatDuration(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

function healthChip(level) {
  if (level === "high") {
    return <Chip size="small" color="error" label="Needs work" />;
  }
  if (level === "medium") {
    return <Chip size="small" color="warning" label="Watch" />;
  }
  if (level === "low") {
    return <Chip size="small" color="success" label="Healthy" />;
  }
  return <Chip size="small" variant="outlined" label="No signal" />;
}

const SummaryTile = ({ label, value, hint }) => (
  <Card
    elevation={0}
    sx={{
      p: 1,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      backgroundColor: "background.paper",
    }}
  >
    <CardContent sx={{ p: 1.5 }}>
      <Stack spacing={0.8}>
        <Typography variant="overline" sx={{ opacity: 0.8 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {hint ? <Typography variant="caption">{hint}</Typography> : null}
      </Stack>
    </CardContent>
  </Card>
);

const YouTubeAnalyticsDashboard = () => {
  const [days, setDays] = useState(30);
  const [limit, setLimit] = useState(12);
  const [selectedVideoId, setSelectedVideoId] = useState("all");
  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const videos = payload?.videos ?? [];
  const summary = payload?.summary ?? {};

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        days: String(days),
        limit: String(limit),
        videoId: selectedVideoId,
      });

      const response = await fetch(`${DASHBOARD_API}?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed (${response.status}).`);
      }

      const rawText = await response.text();
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        const preview = rawText.slice(0, 180);
        const suffix = rawText.length > 180 ? "…" : "";
        throw new Error(
          `Unexpected API response (${response.status}). Content-Type: ${contentType || "none"}. Preview: ${preview}${suffix}`,
        );
      }

      const json = JSON.parse(rawText);
      setPayload(json);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
    } finally {
      setIsLoading(false);
    }
  }, [days, limit, selectedVideoId]);

  useEffect(() => {
    void load();
  }, [load]);

  const videoOptions = useMemo(() => {
    return [{ label: "Channel trend", value: "all" }, ...videos.map((video) => ({
      label: video.title,
      value: video.videoId,
    }))];
  }, [videos]);

  useEffect(() => {
    if (!videoOptions.some((option) => option.value === selectedVideoId)) {
      setSelectedVideoId("all");
    }
  }, [selectedVideoId, videoOptions]);

  const trendData = useMemo(() => {
    if (!payload) {
      return [];
    }
    return selectedVideoId === "all"
      ? payload.channelTrend
      : payload.selectedVideoTrend;
  }, [payload, selectedVideoId]);

  const hasTrend = Boolean(trendData?.length);
  const chartDates = (trendData ?? []).map((row) => row.date);
  const chartCtr = (trendData ?? []).map((row) => row.ctr);
  const chartRetention = (trendData ?? []).map((row) => row.averageViewPercentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack spacing={0.4}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              YouTube Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Live short performance for CTR and retention coaching.
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            onClick={() => {
              void load();
            }}
          >
            Refresh
          </Button>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={String(days)}
                onChange={(event) => setDays(Number(event.target.value))}
                aria-label="Days window"
                displayEmpty
              >
                {DAY_OPTIONS.map((value) => (
                  <MenuItem key={value} value={String(value)}>
                    {value} days
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={String(limit)}
                onChange={(event) => setLimit(Number(event.target.value))}
                aria-label="Top shorts limit"
                displayEmpty
              >
                {LIMIT_OPTIONS.map((value) => (
                  <MenuItem key={value} value={String(value)}>
                    Top {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 320 }}>
              <Select
                value={selectedVideoId}
                onChange={(event) => setSelectedVideoId(event.target.value)}
                aria-label="Select video"
                displayEmpty
              >
                {videoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {payload?.warnings?.length ? (
            <Alert severity="warning" sx={{ mt: 1.5 }}>
              <Stack component="ul" spacing={0.4} sx={{ m: 0, pl: 2.2 }}>
                {payload.warnings.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </Stack>
            </Alert>
          ) : null}
        </Paper>

        {isLoading ? (
          <Stack direction="row" spacing={1.2} justifyContent="center" alignItems="center" py={8}>
            <CircularProgress size={22} />
            <Typography variant="body2">Loading analytics…</Typography>
          </Stack>
        ) : null}

        {error ? <Alert severity="error">{error}</Alert> : null}

        {!isLoading && !error ? (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              <SummaryTile
                label="Tracked Shorts"
                value={formatInt(summary.shortCount)}
                hint={`Scanned ${payload?.scannedVideos ?? 0} recent shorts`}
              />
              <SummaryTile
                label="Total Views"
                value={formatInt(summary.views)}
                hint="Windowed total"
              />
              <SummaryTile
                label="Avg CTR"
                value={formatPct(summary.avgCtr)}
                hint={
                  summary.ctrTrend == null
                    ? "Need more trend data"
                    : `Delta ${summary.ctrTrend >= 0 ? "+" : ""}${summary.ctrTrend}% over window`
                }
              />
              <SummaryTile
                label="Avg Retention"
                value={formatPct(summary.avgViewPercent)}
                hint={
                  summary.retentionTrend == null
                    ? "Need more trend data"
                    : `Delta ${summary.retentionTrend >= 0 ? "+" : ""}${summary.retentionTrend}% over window`
                }
              />
            </Box>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                p: 2,
                minHeight: 320,
              }}
            >
              <Stack spacing={1.2} mb={2}>
                <Typography variant="h6">Trend</Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedVideoId === "all"
                    ? "Channel trend for the selected window"
                    : `Trend for ${payload?.selectedVideo?.title || "selected short"}`}
                </Typography>
              </Stack>
              {hasTrend ? (
                <LineChart
                  height={280}
                  series={[
                    {
                      id: "ctr",
                      label: "CTR (%)",
                      data: chartCtr,
                      yAxisId: "left",
                      color: "#3b82f6",
                    },
                    {
                      id: "ret",
                      label: "Retention (%)",
                      data: chartRetention,
                      yAxisId: "right",
                      color: "#14b8a6",
                    },
                  ]}
                  xAxis={[{ data: chartDates, scaleType: "point" }]}
                  yAxis={[
                    { id: "left", label: "CTR (%)" },
                    { id: "right", label: "Retention (%)", position: "right" },
                  ]}
                />
              ) : (
                <Stack spacing={1} alignItems="center" py={10}>
                  <Typography variant="body2" color="text.secondary">
                    No trend rows available yet.
                  </Typography>
                </Stack>
              )}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={2} p={2}>
                <Typography variant="h6">Top Shorts</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sorted by views in the selected window. Click a row to change chart focus.
                </Typography>
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Short</TableCell>
                      <TableCell align="right">Published</TableCell>
                      <TableCell align="right">Views</TableCell>
                      <TableCell align="right">Impressions</TableCell>
                      <TableCell align="right">CTR</TableCell>
                      <TableCell align="right">Avg View %</TableCell>
                      <TableCell align="right">Health</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {videos.map((video) => {
                      const isSelected =
                        video.videoId && video.videoId === selectedVideoId;
                      return (
                        <TableRow
                          key={video.videoId}
                          hover
                          onClick={() => setSelectedVideoId(video.videoId)}
                          selected={isSelected}
                          sx={{
                            cursor: "pointer",
                            "&.Mui-selected": {
                              backgroundColor: "action.selected",
                            },
                          }}
                        >
                          <TableCell>
                            <Stack spacing={0.4}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {video.title}
                              </Typography>
                              <Stack direction="row" spacing={0.7} flexWrap="wrap">
                                <Typography variant="caption" color="text.secondary">
                                  {formatDuration(video.durationSeconds)}
                                </Typography>
                                {video.recommendations?.slice(0, 1).map((item) => (
                                  <Typography
                                    key={item}
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    • {item}
                                  </Typography>
                                ))}
                              </Stack>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">{video.publishedAt}</TableCell>
                          <TableCell align="right">{formatInt(video.views)}</TableCell>
                          <TableCell align="right">{formatInt(video.impressions)}</TableCell>
                          <TableCell align="right">{formatPct(video.impressionClickThroughRate)}</TableCell>
                          <TableCell align="right">{formatPct(video.averageViewPercentage)}</TableCell>
                          <TableCell align="right">{healthChip(video.health)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {!videos.length ? (
                <Box p={2}>
                  <Typography variant="body2" color="text.secondary">
                    No shorts found for this window.
                  </Typography>
                </Box>
              ) : null}
            </Paper>

            {payload?.selectedVideo ? (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Focus short
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {payload.selectedVideo.title}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {payload.selectedVideo.recommendations?.map((note) => (
                    <Chip key={note} size="small" label={note} variant="outlined" />
                  ))}
                </Stack>
              </Paper>
            ) : null}

            {(summary?.insights?.length || 0) > 0 ? (
              <Alert severity="info">
                <Stack spacing={0.4}>
                  {summary.insights.map((insight) => (
                    <Typography key={insight} variant="body2">
                      • {insight}
                    </Typography>
                  ))}
                </Stack>
              </Alert>
            ) : null}
          </>
        ) : null}
      </Stack>
    </motion.div>
  );
};

export default YouTubeAnalyticsDashboard;
