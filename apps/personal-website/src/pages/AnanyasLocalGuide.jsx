import { useState } from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SEO from "../components/SEO";
import { ananyasLocalGuide } from "../data/ananyasLocalGuide";
import { saveListingReport } from "../../lib/engagement/blob";

const categoryIcons = {
  fruits: ShoppingBasketRoundedIcon,
  medicines: LocalPharmacyRoundedIcon,
  groceries: LocalGroceryStoreRoundedIcon,
  services: HandymanRoundedIcon,
};

const DAY_MS = 24 * 60 * 60 * 1000;

const verificationMethodMeta = {
  "directory-only": {
    label: "Directory only",
    color: "warning",
  },
  "official-site": {
    label: "Official site",
    color: "success",
  },
  "shortlist-only": {
    label: "Shortlist only",
    color: "warning",
  },
};

function parseIsoDate(value) {
  if (!value || typeof value !== "string") return null;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function formatGuideDate(value) {
  const parsed = parseIsoDate(value);
  if (!parsed) return value || "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function addDaysToIso(value, days) {
  const parsed = parseIsoDate(value);
  if (!parsed || !Number.isFinite(days)) return null;
  return new Date(parsed.getTime() + days * DAY_MS);
}

function formatDateObject(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function getOptionalChipProps(color, variant = "outlined") {
  if (!color || color === "default") {
    return { variant };
  }
  return { color, variant };
}

function getVerificationState(item) {
  const verifiedAt = parseIsoDate(item.verifiedAt);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const staleAfterDays = Number(item.staleAfterDays) || 30;
  const ageDays =
    verifiedAt == null ? null : Math.max(0, Math.floor((now - verifiedAt) / DAY_MS));
  const nextReviewDate = addDaysToIso(item.verifiedAt, staleAfterDays);
  const methodMeta =
    verificationMethodMeta[item.verificationMethod] || verificationMethodMeta["directory-only"];

  let freshnessLabel = "Missing check date";
  let freshnessColor = "warning";
  let tone = "unknown";

  if (ageDays != null) {
    if (ageDays >= staleAfterDays) {
      freshnessLabel = ageDays === staleAfterDays ? "Recheck now" : "Needs recheck";
      freshnessColor = "error";
      tone = "stale";
    } else if (staleAfterDays - ageDays <= 7) {
      freshnessLabel = "Recheck soon";
      freshnessColor = "warning";
      tone = "soon";
    } else {
      freshnessLabel = ageDays === 0 ? "Checked today" : `Checked ${ageDays}d ago`;
      freshnessColor = "success";
      tone = "fresh";
    }
  }

  return {
    methodLabel: methodMeta.label,
    methodColor: methodMeta.color,
    freshnessLabel,
    freshnessColor,
    tone,
    lastCheckedText: item.verifiedAt
      ? `Last checked ${formatGuideDate(item.verifiedAt)} by ${item.verifiedBy || "Unknown"}.`
      : "No verification date recorded yet.",
    refreshWindowText: nextReviewDate
      ? ageDays != null && ageDays >= staleAfterDays
        ? `Refresh overdue since ${formatDateObject(nextReviewDate)}.`
        : `Refresh after ${formatDateObject(nextReviewDate)}.`
      : "No refresh window defined.",
  };
}

function toReportId(groupId, label) {
  const normalizedLabel =
    typeof label === "string" && label.trim()
      ? label
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : "item";
  return `${groupId}:${normalizedLabel}`;
}

function ListingCard({ item, reportTarget, onSuggestUpdate, onMarkStale }) {
  const verification = getVerificationState(item);

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 2.25,
        borderRadius: 4,
        border: "1px solid",
        borderColor:
          verification.tone === "stale"
            ? alpha(theme.palette.error.main, 0.38)
            : verification.tone === "soon"
              ? alpha(theme.palette.warning.main, 0.3)
              : verification.tone === "fresh"
                ? alpha(theme.palette.success.main, 0.22)
                : alpha(theme.palette.divider, 0.9),
        backgroundColor:
          verification.tone === "stale"
            ? alpha(theme.palette.error.main, 0.05)
            : alpha(theme.palette.background.paper, 0.96),
        boxShadow: `0 18px 42px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.22 : 0.08)}`,
        height: "100%",
      })}
    >
      <Stack spacing={1.4} height="100%">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label={item.area} size="small" />
          {item.hours ? (
            <Chip
              label={item.hours}
              size="small"
              variant="outlined"
              sx={{ maxWidth: "100%" }}
            />
          ) : null}
          <Chip
            label={verification.methodLabel}
            size="small"
            {...getOptionalChipProps(verification.methodColor)}
          />
          <Chip
            label={verification.freshnessLabel}
            size="small"
            {...getOptionalChipProps(verification.freshnessColor, "filled")}
          />
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.address}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
          {item.note}
        </Typography>
        <Stack spacing={0.45}>
          <Typography variant="caption" color="text.secondary">
            {verification.lastCheckedText}
          </Typography>
          <Typography
            variant="caption"
            color={verification.tone === "stale" ? "error.main" : "text.secondary"}
          >
            {verification.refreshWindowText}
          </Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
          <Button
            component="a"
            href={item.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            endIcon={<LaunchRoundedIcon />}
            sx={{ borderRadius: 999 }}
          >
            Open map
          </Button>
          <Button
            component="a"
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            endIcon={<ArrowOutwardRoundedIcon />}
            sx={{ borderRadius: 999 }}
          >
            Source
          </Button>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
          <Button
            variant="outlined"
            onClick={() => onSuggestUpdate(reportTarget)}
            sx={{ borderRadius: 999 }}
          >
            Suggest update
          </Button>
          <Button
            color="warning"
            variant="text"
            onClick={() => onMarkStale(reportTarget)}
            sx={{ borderRadius: 999 }}
          >
            Mark stale
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

function AdditionCard({ item, reportTarget, onSuggestUpdate, onMarkStale }) {
  const verification = getVerificationState(item);

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 2.25,
        borderRadius: 4,
        border: "1px solid",
        borderColor:
          verification.tone === "stale"
            ? alpha(theme.palette.error.main, 0.3)
            : alpha(theme.palette.primary.main, 0.14),
        backgroundColor:
          verification.tone === "stale"
            ? alpha(theme.palette.error.main, 0.04)
            : alpha(theme.palette.primary.main, 0.04),
        boxShadow: `0 14px 32px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.18 : 0.06)}`,
        height: "100%",
      })}
    >
      <Stack spacing={1.35} height="100%">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={verification.methodLabel}
            size="small"
            {...getOptionalChipProps(verification.methodColor)}
          />
          <Chip
            label={verification.freshnessLabel}
            size="small"
            {...getOptionalChipProps(verification.freshnessColor, "filled")}
          />
        </Stack>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
        <Stack spacing={0.75}>
          {item.examples.map((example) => (
            <Typography
              key={example}
              variant="body2"
              sx={{ lineHeight: 1.7, color: "text.secondary" }}
            >
              {example}
            </Typography>
          ))}
        </Stack>
        <Stack spacing={0.45}>
          <Typography variant="caption" color="text.secondary">
            {verification.lastCheckedText}
          </Typography>
          <Typography
            variant="caption"
            color={verification.tone === "stale" ? "error.main" : "text.secondary"}
          >
            {verification.refreshWindowText}
          </Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Button
            component="a"
            href={item.shortlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            endIcon={<LaunchRoundedIcon />}
            sx={{ borderRadius: 999 }}
          >
            {item.shortlistLabel}
          </Button>
          <Chip label={item.sourceLabel} size="small" variant="outlined" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
          <Button
            variant="outlined"
            onClick={() => onSuggestUpdate(reportTarget)}
            sx={{ borderRadius: 999 }}
          >
            Suggest update
          </Button>
          <Button
            color="warning"
            variant="text"
            onClick={() => onMarkStale(reportTarget)}
            sx={{ borderRadius: 999 }}
          >
            Mark stale
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function AnanyasLocalGuide() {
  const [reportDialog, setReportDialog] = useState({
    open: false,
    target: null,
  });
  const [reportNote, setReportNote] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportFeedback, setReportFeedback] = useState(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const openUpdateDialog = (target) => {
    setReportDialog({ open: true, target });
    setReportNote("");
    setReportError("");
  };

  const closeUpdateDialog = () => {
    if (isSubmittingReport) return;
    setReportDialog({ open: false, target: null });
    setReportNote("");
    setReportError("");
  };

  const submitReport = async ({ target, reportType, message = "" }) => {
    if (!target) return;
    setIsSubmittingReport(true);
    setReportError("");
    setReportFeedback(null);

    try {
      await saveListingReport(ananyasLocalGuide.slug, {
        listingId: target.reportId,
        listingName: target.name,
        categoryId: target.categoryId,
        reportType,
        message,
      });

      setReportFeedback({
        severity: "success",
        message:
          reportType === "stale"
            ? `${target.name} was marked for recheck.`
            : `Update suggestion sent for ${target.name}.`,
      });
    } catch (error) {
      const fallback =
        reportType === "stale"
          ? "Could not store the stale report right now."
          : "Could not store the update suggestion right now.";
      throw new Error(error?.message || fallback);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleMarkStale = async (target) => {
    try {
      await submitReport({ target, reportType: "stale" });
    } catch (error) {
      setReportFeedback({
        severity: "error",
        message: error.message,
      });
    }
  };

  const handleSubmitUpdate = async () => {
    const trimmedNote = reportNote.trim();
    if (trimmedNote.length < 5) {
      setReportError("Add a short note so the update can be reviewed.");
      return;
    }

    try {
      await submitReport({
        target: reportDialog.target,
        reportType: "update",
        message: trimmedNote,
      });
      closeUpdateDialog();
    } catch (error) {
      setReportError(error.message);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1120, mx: "auto" }}>
      <SEO
        title="Ananyas Nearby Essentials"
        description="Starter local guide for groceries, fruits, medicines, and practical services around Ananyas Nana Nani Homes in Thondamuthur and Dhaliyur, Coimbatore."
        canonicalPath="/local/ananyas-nearby"
        type="website"
      />

      <Stack spacing={3.5}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 3, md: 4.5 },
            borderRadius: 5,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.16),
            backgroundImage:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 32%), radial-gradient(circle at top right, rgba(34, 197, 94, 0.16), transparent 26%), linear-gradient(135deg, rgba(6, 10, 18, 0.98), rgba(10, 18, 28, 0.96))"
                : "radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 24%), linear-gradient(135deg, rgba(248, 252, 255, 0.98), rgba(242, 248, 255, 0.96))",
            boxShadow: `0 24px 64px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.28 : 0.08)}`,
          })}
        >
          <Stack spacing={2.2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnRoundedIcon color="primary" />
              <Chip label="Local guide beta" color="primary" size="small" />
            </Stack>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                maxWidth: 760,
              }}
            >
              Nearby essentials for Phase 7 at Ananyas Nana Nani Homes
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 760, fontSize: { xs: "1rem", md: "1.08rem" } }}
            >
              A practical starter directory for fruits, medicines, groceries,
              and day-to-day support around the Thondamuthur, Dhaliyur, and
              Vadavalli corridor in Coimbatore.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Chip label={ananyasLocalGuide.communityName} />
              <Chip
                label={`Compiled from public web sources on ${ananyasLocalGuide.compiledOn}`}
                variant="outlined"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {ananyasLocalGuide.communityAddress}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <Button
                component="a"
                href={ananyasLocalGuide.campusMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                endIcon={<LaunchRoundedIcon />}
                sx={{ borderRadius: 999 }}
              >
                Open campus area map
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Each card now shows source strength and a refresh window. Fast-moving
          items like tiffin, taxis, and repair vendors should be rechecked every
          14 to 21 days; slower listings are pushed to 30 to 45 days.
        </Alert>

        {reportFeedback ? (
          <Alert
            severity={reportFeedback.severity}
            sx={{ borderRadius: 3 }}
            onClose={() => setReportFeedback(null)}
          >
            {reportFeedback.message}
          </Alert>
        ) : null}

        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2.25, md: 3 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
          })}
        >
          <Stack spacing={1.1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Notes
            </Typography>
            {ananyasLocalGuide.notes.map((note) => (
              <Typography key={note} variant="body2" color="text.secondary">
                {note}
              </Typography>
            ))}
          </Stack>
        </Paper>

        {ananyasLocalGuide.categories.map((category) => {
          const Icon = categoryIcons[category.id] || LocationOnRoundedIcon;
          return (
            <Stack key={category.id} spacing={1.8}>
              <Stack spacing={0.8}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Icon color="primary" />
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {category.title}
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary">
                  {category.description}
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                    xl: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {category.items.map((item) => {
                  const reportTarget = {
                    reportId: item.id || toReportId(category.id, item.name),
                    name: item.name,
                    categoryId: category.id,
                  };

                  return (
                    <ListingCard
                      key={item.name}
                      item={item}
                      reportTarget={reportTarget}
                      onSuggestUpdate={openUpdateDialog}
                      onMarkStale={handleMarkStale}
                    />
                  );
                })}
              </Box>
            </Stack>
          );
        })}

        <Divider />

        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2.25, md: 3 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.14),
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          })}
        >
          <Stack spacing={1.6}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Next useful additions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              These are the next categories worth verifying on the ground once
              you move in. They are higher leverage than adding more generic
              store listings.
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {ananyasLocalGuide.nextUsefulAdditions.map((item) => {
                const reportTarget = {
                  reportId: item.id || toReportId("next-addition", item.title),
                  name: item.title,
                  categoryId: "next-addition",
                };

                return (
                  <AdditionCard
                    key={item.id}
                    item={item}
                    reportTarget={reportTarget}
                    onSuggestUpdate={openUpdateDialog}
                    onMarkStale={handleMarkStale}
                  />
                );
              })}
            </Box>
          </Stack>
        </Paper>
      </Stack>

      <Dialog
        open={reportDialog.open}
        onClose={closeUpdateDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Suggest an update</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              This stores a manual review note for{" "}
              <strong>{reportDialog.target?.name || "this listing"}</strong>.
            </Typography>
            <TextField
              autoFocus
              multiline
              minRows={4}
              maxRows={8}
              label="What should change?"
              placeholder="Example: They no longer deliver to Ananyas, but the store is still open."
              value={reportNote}
              onChange={(event) => {
                setReportNote(event.target.value);
                if (reportError) {
                  setReportError("");
                }
              }}
              error={Boolean(reportError)}
              helperText={reportError || "Include the issue, the correction, or what you verified."}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeUpdateDialog} disabled={isSubmittingReport}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitUpdate}
            disabled={isSubmittingReport}
          >
            {isSubmittingReport ? "Sending..." : "Send update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
