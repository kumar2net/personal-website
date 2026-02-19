import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';

const DASHBOARD_URL = '/shorts-optimizer/dashboard.json';

const formatNumber = (value) =>
  value == null || Number.isNaN(value)
    ? '—'
    : new Intl.NumberFormat().format(Math.round(value));

const formatPct = (value) =>
  value == null || Number.isNaN(value) ? '—' : `${value.toFixed(2)}%`;

const formatSec = (value) =>
  value == null || Number.isNaN(value) ? '—' : `${value.toFixed(2)}s`;

const toDateLabel = (isoDate) => {
  if (!isoDate) {
    return 'Unknown';
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return parsed.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const trendChip = (value) => {
  if (value == null) {
    return <Chip size="small" variant="outlined" label="No baseline" />;
  }

  if (value > 0) {
    return <Chip size="small" color="success" label={`+${value.toFixed(2)}`} />;
  }

  if (value < 0) {
    return <Chip size="small" color="warning" label={value.toFixed(2)} />;
  }

  return <Chip size="small" variant="outlined" label="0.00" />;
};

const MetricTile = ({ label, value, hint }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}
  >
    <Stack spacing={0.8}>
      <Typography variant="overline" sx={{ letterSpacing: 1.1, opacity: 0.8 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {hint}
      </Typography>
    </Stack>
  </Paper>
);

const ShortsOptimizerDashboard = () => {
  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState('all');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${DASHBOARD_URL}?t=${Date.now()}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load dashboard index (${response.status} ${response.statusText}). Run \`npm run --workspace apps/personal-website shorts:metrics\` first.`,
        );
      }

      const json = await response.json();
      if (!json || !Array.isArray(json.runs)) {
        throw new Error('Invalid dashboard payload format.');
      }

      setPayload(json);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const runs = payload?.runs ?? [];
  const latestByVideo = payload?.latestByVideo ?? [];
  const summary = payload?.summary ?? null;

  const videoIds = useMemo(() => {
    const ids = new Set(runs.map((run) => run.videoId).filter(Boolean));
    return ['all', ...Array.from(ids).sort((a, b) => a.localeCompare(b))];
  }, [runs]);

  useEffect(() => {
    if (!videoIds.includes(selectedVideoId)) {
      setSelectedVideoId('all');
    }
  }, [videoIds, selectedVideoId]);

  const filteredRuns = useMemo(() => {
    if (selectedVideoId === 'all') {
      return runs;
    }
    return runs.filter((run) => run.videoId === selectedVideoId);
  }, [runs, selectedVideoId]);

  const chartRuns = useMemo(() => {
    const ascending = filteredRuns
      .slice()
      .sort((a, b) => new Date(a.generatedAt) - new Date(b.generatedAt));

    return ascending.slice(-20);
  }, [filteredRuns]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ width: '100%' }}
    >
      <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack spacing={0.6}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Shorts CTR Monitor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tracks CTR, retention, and watch metrics from optimizer output bundles.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Source: {payload?.sourceOutDir ?? 'out'} • Last indexed:{' '}
                {payload?.generatedAt ? toDateLabel(payload.generatedAt) : '—'}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button variant="outlined" onClick={() => void loadDashboard()}>
                Refresh data
              </Button>
            </Stack>
          </Stack>

          {isLoading ? <LinearProgress /> : null}

          {error ? <Alert severity="error">{error}</Alert> : null}

          {!isLoading && !error ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    lg: 'repeat(4, minmax(0, 1fr))',
                  },
                  gap: 2,
                }}
              >
                <MetricTile
                  label="Run Records"
                  value={formatNumber(summary?.records ?? 0)}
                  hint="Total optimization runs indexed"
                />
                <MetricTile
                  label="Tracked Videos"
                  value={formatNumber(summary?.uniqueVideos ?? 0)}
                  hint="Unique video IDs"
                />
                <MetricTile
                  label="Average CTR (Latest)"
                  value={formatPct(summary?.avgCtrLatest ?? null)}
                  hint="Average of latest run per video"
                />
                <MetricTile
                  label="Avg View % (Latest)"
                  value={formatPct(summary?.avgViewPctLatest ?? null)}
                  hint="Retention proxy across latest runs"
                />
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                  mb={2}
                >
                  <Stack spacing={0.4}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Metric Trend
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      CTR and average view percentage for the selected video.
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Video
                    </Typography>
                    <Select
                      size="small"
                      value={selectedVideoId}
                      onChange={(event) => setSelectedVideoId(event.target.value)}
                    >
                      {videoIds.map((videoId) => (
                        <MenuItem key={videoId} value={videoId}>
                          {videoId === 'all' ? 'All videos' : videoId}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                </Stack>

                {chartRuns.length ? (
                  <LineChart
                    height={320}
                    xAxis={[
                      {
                        scaleType: 'point',
                        data: chartRuns.map((run) => toDateLabel(run.generatedAt)),
                      },
                    ]}
                    series={[
                      {
                        label: 'CTR %',
                        data: chartRuns.map((run) => run.impressionClickThroughRate),
                        curve: 'linear',
                      },
                      {
                        label: 'Avg View %',
                        data: chartRuns.map((run) => run.averageViewPercentage),
                        curve: 'linear',
                      },
                    ]}
                    margin={{ top: 16, right: 24, bottom: 64, left: 56 }}
                  />
                ) : (
                  <Alert severity="info">
                    No runs available in this filter. Generate output first with
                    shorts optimizer.
                  </Alert>
                )}
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Latest Per Video
                  </Typography>

                  <TableContainer>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Video</TableCell>
                          <TableCell>Updated</TableCell>
                          <TableCell>CTR</TableCell>
                          <TableCell>Δ CTR</TableCell>
                          <TableCell>Avg View %</TableCell>
                          <TableCell>Avg Duration</TableCell>
                          <TableCell>Primary Fix</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {latestByVideo.map((run) => (
                          <TableRow key={`${run.videoId}:${run.runId}`} hover>
                            <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                              {run.videoId}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {toDateLabel(run.generatedAt)}
                            </TableCell>
                            <TableCell>{formatPct(run.impressionClickThroughRate)}</TableCell>
                            <TableCell>{trendChip(run.deltaCtrFromPrevious)}</TableCell>
                            <TableCell>{formatPct(run.averageViewPercentage)}</TableCell>
                            <TableCell>{formatSec(run.averageViewDuration)}</TableCell>
                            <TableCell sx={{ maxWidth: 380 }} title={run.primaryFix || ''}>
                              <Typography variant="body2" noWrap>
                                {run.primaryFix || '—'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Recent Runs
                  </Typography>

                  <TableContainer sx={{ maxHeight: 520 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Run</TableCell>
                          <TableCell>Video</TableCell>
                          <TableCell>CTR</TableCell>
                          <TableCell>Avg View %</TableCell>
                          <TableCell>Avg Duration</TableCell>
                          <TableCell>Impressions</TableCell>
                          <TableCell>Views</TableCell>
                          <TableCell>Output</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRuns.map((run) => (
                          <TableRow key={`${run.videoId}:${run.runId}`} hover>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              {toDateLabel(run.generatedAt)}
                            </TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{run.videoId}</TableCell>
                            <TableCell>{formatPct(run.impressionClickThroughRate)}</TableCell>
                            <TableCell>{formatPct(run.averageViewPercentage)}</TableCell>
                            <TableCell>{formatSec(run.averageViewDuration)}</TableCell>
                            <TableCell>{formatNumber(run.impressions)}</TableCell>
                            <TableCell>{formatNumber(run.views)}</TableCell>
                            <TableCell sx={{ maxWidth: 320 }} title={run.outputPath || ''}>
                              <Typography variant="caption" noWrap>
                                {run.outputPath || '—'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </Paper>
            </>
          ) : null}
        </Stack>
      </Box>
    </motion.div>
  );
};

export default ShortsOptimizerDashboard;
