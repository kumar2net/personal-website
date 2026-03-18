import { useEffect, useMemo, useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  getListingReportId,
  getListingReportReviews,
  getListingReports,
  getLocalListingReportReviews,
  getLocalListingReports,
  saveListingReportReview,
} from "../../lib/engagement/blob";

const GUIDE_SLUG = "ananyas-nearby";

const reviewFilters = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
];

const reportTypeMeta = {
  stale: {
    label: "Marked stale",
    color: "warning",
    icon: ReportProblemRoundedIcon,
  },
  update: {
    label: "Suggested update",
    color: "primary",
    icon: RefreshRoundedIcon,
  },
};

const reviewStatusMeta = {
  approved: {
    label: "Approved",
    color: "success",
    icon: TaskAltRoundedIcon,
  },
  dismissed: {
    label: "Dismissed",
    color: "default",
    icon: VisibilityOffRoundedIcon,
  },
};

function formatDateTime(value) {
  if (!value) return "Unknown time";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function mergeEntries(entries = []) {
  const byId = new Map();

  entries.forEach((entry) => {
    const reportId = getListingReportId(entry);
    const previous = byId.get(reportId);
    const currentTime = Date.parse(entry?.timestamp || "") || 0;
    const previousTime = Date.parse(previous?.timestamp || "") || 0;

    if (!previous || currentTime >= previousTime) {
      byId.set(reportId, {
        ...entry,
        reportId,
      });
    }
  });

  return [...byId.values()].sort((a, b) => {
    const timeA = Date.parse(a?.timestamp || "") || 0;
    const timeB = Date.parse(b?.timestamp || "") || 0;
    return timeB - timeA;
  });
}

function buildLatestReviews(entries = []) {
  const latest = new Map();

  entries.forEach((entry) => {
    const reportId =
      typeof entry?.reportId === "string" && entry.reportId.trim()
        ? entry.reportId.trim()
        : "";
    if (!reportId) return;

    const previous = latest.get(reportId);
    const currentTime = Date.parse(entry?.timestamp || "") || 0;
    const previousTime = Date.parse(previous?.timestamp || "") || 0;

    if (!previous || currentTime >= previousTime) {
      latest.set(reportId, entry);
    }
  });

  return latest;
}

function StatCard({ label, value, tone = "default" }) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor:
          tone === "warning"
            ? alpha(theme.palette.warning.main, 0.28)
            : tone === "success"
              ? alpha(theme.palette.success.main, 0.28)
              : alpha(theme.palette.divider, 0.9),
      })}
    >
      <Stack spacing={0.6}>
        <Typography variant="overline" sx={{ opacity: 0.8 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
}

function ReportCard({
  report,
  review,
  isSaving,
  onReview,
}) {
  const reportMeta = reportTypeMeta[report.reportType] || reportTypeMeta.update;
  const ReportIcon = reportMeta.icon;
  const reviewMeta =
    review?.status && reviewStatusMeta[review.status]
      ? reviewStatusMeta[review.status]
      : null;
  const ReviewIcon = reviewMeta?.icon || CheckCircleRoundedIcon;

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 2.25,
        borderRadius: 4,
        border: "1px solid",
        borderColor: reviewMeta
          ? reviewMeta.color === "success"
            ? alpha(theme.palette.success.main, 0.3)
            : alpha(theme.palette.divider, 0.9)
          : alpha(theme.palette.warning.main, 0.3),
        backgroundColor: reviewMeta
          ? alpha(theme.palette.background.paper, 0.95)
          : alpha(theme.palette.warning.main, 0.05),
      })}
    >
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<ReportIcon />}
            label={reportMeta.label}
            size="small"
            color={reportMeta.color}
            variant="outlined"
          />
          <Chip label={report.categoryId || "uncategorized"} size="small" />
          <Chip
            label={report._source === "local" ? "This browser only" : "Blob store"}
            size="small"
            variant="outlined"
          />
          {reviewMeta ? (
            <Chip
              icon={<ReviewIcon />}
              label={reviewMeta.label}
              size="small"
              color={reviewMeta.color}
            />
          ) : (
            <Chip label="Pending review" size="small" color="warning" />
          )}
        </Stack>

        <Stack spacing={0.45}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {report.listingName || report.listingId || "Unnamed listing"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submitted {formatDateTime(report.timestamp)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Report id: {report.reportId}
          </Typography>
        </Stack>

        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
          {report.message?.trim()
            ? report.message
            : report.reportType === "stale"
              ? "Reporter marked this listing for recheck without extra notes."
              : "No extra note was included with this update."}
        </Typography>

        {review ? (
          <Typography variant="caption" color="text.secondary">
            Last review: {review.status} on {formatDateTime(review.timestamp)}
            {review.note ? ` — ${review.note}` : ""}
          </Typography>
        ) : null}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
          <Button
            variant="contained"
            color="success"
            disabled={isSaving}
            onClick={() => onReview(report, "approved")}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <TaskAltRoundedIcon />}
            sx={{ borderRadius: 999 }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            disabled={isSaving}
            onClick={() => onReview(report, "dismissed")}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <VisibilityOffRoundedIcon />}
            sx={{ borderRadius: 999 }}
          >
            Dismiss
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function LocalGuideReview() {
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [savingReportId, setSavingReportId] = useState("");

  const loadQueue = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [remoteReports, remoteReviews] = await Promise.all([
        getListingReports(GUIDE_SLUG),
        getListingReportReviews(GUIDE_SLUG),
      ]);

      const localReports = getLocalListingReports(GUIDE_SLUG).map((entry) => ({
        ...entry,
        _source: "local",
      }));
      const localReviews = getLocalListingReportReviews(GUIDE_SLUG).map((entry) => ({
        ...entry,
        _source: "local",
      }));

      setReports(
        mergeEntries([
          ...remoteReports.map((entry) => ({ ...entry, _source: "remote" })),
          ...localReports,
        ]),
      );
      setReviews([
        ...remoteReviews.map((entry) => ({ ...entry, _source: "remote" })),
        ...localReviews,
      ]);
    } catch (error) {
      setLoadError(error?.message || "Could not load the review queue.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const latestReviews = useMemo(() => buildLatestReviews(reviews), [reviews]);

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let dismissed = 0;

    reports.forEach((report) => {
      const review = latestReviews.get(report.reportId);
      if (!review) {
        pending += 1;
      } else if (review.status === "approved") {
        approved += 1;
      } else if (review.status === "dismissed") {
        dismissed += 1;
      }
    });

    return {
      total: reports.length,
      pending,
      approved,
      dismissed,
    };
  }, [reports, latestReviews]);

  const visibleReports = useMemo(() => {
    return reports.filter((report) => {
      const review = latestReviews.get(report.reportId);
      const status = review?.status || "pending";
      return filter === "all" ? true : status === filter;
    });
  }, [filter, latestReviews, reports]);

  const handleReview = async (report, status) => {
    const reportId = report?.reportId || "";
    if (!reportId) return;
    setSavingReportId(reportId);
    setFeedback(null);

    try {
      const result = await saveListingReportReview(GUIDE_SLUG, {
        reportId,
        status,
      });

      const newReview = {
        reportId,
        status,
        note: "",
        timestamp: new Date().toISOString(),
        anonymousID: `manual-${Date.now()}`,
        _source: result?.localFallback ? "local" : "remote",
      };

      setReviews((prev) => [newReview, ...prev]);
      setFeedback({
        severity: result?.localFallback ? "warning" : "success",
        message: result?.localFallback
          ? `Review saved locally on this browser for ${report.listingName || report.listingId}.`
          : `${status === "approved" ? "Approved" : "Dismissed"} ${report.listingName || report.listingId}.`,
      });
    } catch (error) {
      setFeedback({
        severity: "error",
        message: error?.message || "Could not save the review decision.",
      });
    } finally {
      setSavingReportId("");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1080, mx: "auto" }}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.16),
            backgroundImage:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 30%), linear-gradient(140deg, rgba(7, 12, 20, 0.98), rgba(12, 19, 31, 0.96))"
                : "radial-gradient(circle at top left, rgba(59, 130, 246, 0.14), transparent 28%), linear-gradient(140deg, rgba(248, 252, 255, 0.98), rgba(244, 248, 255, 0.96))",
          })}
        >
          <Stack spacing={1.4}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label="Private review queue" color="primary" size="small" />
              <Chip label={GUIDE_SLUG} size="small" variant="outlined" />
            </Stack>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.03em",
                fontSize: { xs: "2rem", md: "2.7rem" },
              }}
            >
              Local guide report review
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
              Review stale flags and update suggestions for the Ananyas local
              guide without digging through raw blob JSON. Approval does not
              automatically rewrite the public guide; it marks the report as reviewed.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <Button
                variant="contained"
                onClick={() => void loadQueue()}
                startIcon={<RefreshRoundedIcon />}
                sx={{ borderRadius: 999 }}
              >
                Refresh queue
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {feedback ? (
          <Alert
            severity={feedback.severity}
            sx={{ borderRadius: 3 }}
            onClose={() => setFeedback(null)}
          >
            {feedback.message}
          </Alert>
        ) : null}

        {loadError ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {loadError}
          </Alert>
        ) : null}

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
          <StatCard label="Total reports" value={counts.total} />
          <StatCard label="Pending" value={counts.pending} tone="warning" />
          <StatCard label="Approved" value={counts.approved} tone="success" />
          <StatCard label="Dismissed" value={counts.dismissed} />
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {reviewFilters.map((item) => (
            <Button
              key={item.value}
              variant={filter === item.value ? "contained" : "outlined"}
              onClick={() => setFilter(item.value)}
              sx={{ borderRadius: 999 }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        {isLoading ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
            <Stack spacing={1.5} alignItems="center">
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Loading listing reports...
              </Typography>
            </Stack>
          </Paper>
        ) : visibleReports.length === 0 ? (
          <Alert severity="success" sx={{ borderRadius: 3 }}>
            No reports match the current filter.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {visibleReports.map((report) => (
              <ReportCard
                key={report.reportId}
                report={report}
                review={latestReviews.get(report.reportId)}
                isSaving={savingReportId === report.reportId}
                onReview={handleReview}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
