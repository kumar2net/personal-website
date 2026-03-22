import { useMemo, useState } from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";
import ShoppingBasketRoundedIcon from "@mui/icons-material/ShoppingBasketRounded";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import SEO from "../components/SEO";
import { ananyasLocalGuide } from "../data/ananyasLocalGuide";
import { saveListingReport } from "../../lib/engagement/blob";

const categoryIcons = {
  fruits: ShoppingBasketRoundedIcon,
  flowers: LocalFloristRoundedIcon,
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

function buildGuideSpreadsheetRows(guide) {
  return guide.categories.flatMap((category) =>
    category.items.map((item) => {
      const verification = getVerificationState(item);
      const toneRank =
        verification.tone === "stale"
          ? 0
          : verification.tone === "soon"
            ? 1
            : verification.tone === "fresh"
              ? 2
              : 3;

      return {
        id: item.id || toReportId(category.id, item.name),
        categoryId: category.id,
        categoryTitle: category.title,
        name: item.name,
        area: item.area,
        address: item.address,
        hours: item.hours || "Check timings directly",
        note: item.note,
        sourceLabel: item.sourceLabel,
        sourceUrl: item.sourceUrl,
        mapUrl: item.mapUrl,
        verificationMethod: verification.methodLabel,
        verificationMethodColor: verification.methodColor,
        freshnessLabel: verification.freshnessLabel,
        freshnessColor: verification.freshnessColor,
        freshnessTone: verification.tone,
        freshnessRank: toneRank,
        lastCheckedText: verification.lastCheckedText,
        refreshWindowText: verification.refreshWindowText,
        lastCheckedAt: item.verifiedAt || "",
        nextReviewAt: addDaysToIso(item.verifiedAt, Number(item.staleAfterDays) || 30)
          ?.toISOString()
          ?.slice(0, 10) || "",
      };
    }),
  );
}

function escapeCsvValue(value) {
  const normalized = value == null ? "" : String(value);
  const escaped = normalized.replace(/"/g, '""');

  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }

  return escaped;
}

function createGuideCsv(rows) {
  const headers = [
    "Category",
    "Listing",
    "Area",
    "Address",
    "Hours",
    "Note",
    "Verification Method",
    "Freshness",
    "Last Checked",
    "Refresh Window",
    "Source Label",
    "Source URL",
    "Map URL",
  ];

  const lines = rows.map((row) =>
    [
      row.categoryTitle,
      row.name,
      row.area,
      row.address,
      row.hours,
      row.note,
      row.verificationMethod,
      row.freshnessLabel,
      row.lastCheckedText,
      row.refreshWindowText,
      row.sourceLabel,
      row.sourceUrl,
      row.mapUrl,
    ]
      .map(escapeCsvValue)
      .join(","),
  );

  return [headers.join(","), ...lines].join("\n");
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

function QuickJumpCard({ href, icon: Icon, eyebrow, title, description, meta }) {
  return (
    <Paper
      component="a"
      href={href}
      elevation={0}
      sx={(theme) => ({
        p: 2.5,
        borderRadius: 4,
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.14),
        backgroundImage:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(8, 15, 26, 0.9))"
            : "linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(244, 248, 255, 0.96))",
        boxShadow: `0 16px 34px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.24 : 0.08)}`,
        color: "inherit",
        textDecoration: "none",
        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 24px 44px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.3 : 0.12)}`,
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      })}
    >
      <Stack spacing={1.35}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
          <Chip label={eyebrow} size="small" color="primary" variant="outlined" />
          <Icon color="primary" />
        </Stack>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.7 }}>
            {description}
          </Typography>
        </Box>
        <Chip
          label={meta}
          size="small"
          sx={{ alignSelf: "flex-start", borderRadius: 999 }}
        />
      </Stack>
    </Paper>
  );
}

function SpreadsheetTable({ rows, csvDownloadUrl, onSuggestUpdate, onMarkStale }) {
  const freshnessSummary = rows.reduce(
    (summary, row) => {
      summary.total += 1;
      if (row.freshnessTone === "stale") {
        summary.stale += 1;
      } else if (row.freshnessTone === "soon") {
        summary.soon += 1;
      } else if (row.freshnessTone === "fresh") {
        summary.fresh += 1;
      } else {
        summary.unknown += 1;
      }
      return summary;
    },
    { total: 0, fresh: 0, soon: 0, stale: 0, unknown: 0 },
  );

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Listing",
        minWidth: 230,
        flex: 1.1,
        renderCell: (params) => (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.sourceLabel}
            </Typography>
          </Box>
        ),
      },
      {
        field: "categoryTitle",
        headerName: "Category",
        minWidth: 170,
        flex: 0.8,
      },
      {
        field: "area",
        headerName: "Area",
        minWidth: 160,
        flex: 0.8,
      },
      {
        field: "hours",
        headerName: "Hours",
        minWidth: 210,
        flex: 1,
      },
      {
        field: "address",
        headerName: "Address",
        minWidth: 260,
        flex: 1.25,
        renderCell: (params) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 1, whiteSpace: "normal", lineHeight: 1.6 }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: "note",
        headerName: "Why it matters",
        minWidth: 300,
        flex: 1.45,
        renderCell: (params) => (
          <Typography variant="body2" sx={{ py: 1, whiteSpace: "normal", lineHeight: 1.7 }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "freshnessLabel",
        headerName: "Freshness",
        minWidth: 170,
        flex: 0.8,
        sortComparator: (_v1, _v2, param1, param2) =>
          (param1.api.getRow(param1.id)?.freshnessRank ?? 99) -
          (param2.api.getRow(param2.id)?.freshnessRank ?? 99),
        renderCell: (params) => (
          <Chip
            label={params.row.freshnessLabel}
            size="small"
            {...getOptionalChipProps(params.row.freshnessColor, "filled")}
          />
        ),
      },
      {
        field: "verificationMethod",
        headerName: "Verification",
        minWidth: 170,
        flex: 0.8,
        renderCell: (params) => (
          <Chip
            label={params.row.verificationMethod}
            size="small"
            {...getOptionalChipProps(params.row.verificationMethodColor)}
          />
        ),
      },
      {
        field: "lastCheckedAt",
        headerName: "Last checked",
        minWidth: 150,
        flex: 0.7,
        valueFormatter: (value) => (value ? formatGuideDate(value) : "Unknown"),
      },
      {
        field: "nextReviewAt",
        headerName: "Refresh after",
        minWidth: 150,
        flex: 0.7,
        valueFormatter: (value) => (value ? formatGuideDate(value) : "Unknown"),
      },
      {
        field: "links",
        headerName: "Links",
        minWidth: 190,
        flex: 0.9,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} sx={{ py: 0.75 }}>
            <Button
              component="a"
              href={params.row.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="small"
              sx={{ borderRadius: 999 }}
              onClick={(event) => event.stopPropagation()}
            >
              Map
            </Button>
            <Button
              component="a"
              href={params.row.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              size="small"
              sx={{ borderRadius: 999 }}
              endIcon={<ArrowOutwardRoundedIcon />}
              onClick={(event) => event.stopPropagation()}
            >
              Source
            </Button>
          </Stack>
        ),
      },
      {
        field: "report",
        headerName: "Report",
        minWidth: 180,
        flex: 0.95,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const reportTarget = {
            reportId: params.row.id,
            name: params.row.name,
            categoryId: params.row.categoryId,
          };

          return (
            <Stack direction="row" spacing={1} sx={{ py: 0.75 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: 999 }}
                onClick={(event) => {
                  event.stopPropagation();
                  onSuggestUpdate(reportTarget);
                }}
              >
                Update
              </Button>
              <Button
                color="warning"
                variant="text"
                size="small"
                sx={{ borderRadius: 999 }}
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkStale(reportTarget);
                }}
              >
                Stale
              </Button>
            </Stack>
          );
        },
      },
    ],
    [onMarkStale, onSuggestUpdate],
  );

  return (
    <Paper
      id="spreadsheet-view"
      elevation={0}
      sx={(theme) => ({
        p: { xs: 2.25, md: 3 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.14),
        backgroundColor: alpha(theme.palette.background.paper, 0.94),
        scrollMarginTop: theme.spacing(12),
      })}
    >
      <Stack spacing={2.25}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1.75}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Spreadsheet view
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75, maxWidth: 760 }}>
              One clean sheet for scanning every listing, comparing freshness, and
              exporting the guide into Excel or Google Sheets.
            </Typography>
          </Box>
          <Button
            component="a"
            href={csvDownloadUrl}
            download="ananyas-nearby-guide.csv"
            variant="contained"
            startIcon={<DownloadRoundedIcon />}
            sx={{ borderRadius: 999 }}
          >
            Download CSV
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label={`${freshnessSummary.total} listings`} />
          <Chip
            label={`${freshnessSummary.fresh} fresh`}
            {...getOptionalChipProps("success", "filled")}
          />
          <Chip
            label={`${freshnessSummary.soon} recheck soon`}
            {...getOptionalChipProps("warning", "filled")}
          />
          <Chip
            label={`${freshnessSummary.stale} overdue`}
            {...getOptionalChipProps("error", "filled")}
          />
          {freshnessSummary.unknown ? (
            <Chip label={`${freshnessSummary.unknown} missing dates`} variant="outlined" />
          ) : null}
        </Stack>

        <Box
          sx={(theme) => ({
            height: 720,
            width: "100%",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.9),
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: alpha(theme.palette.background.default, 0.55),
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              alignItems: "flex-start",
              py: 1,
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            "& .MuiDataGrid-toolbarContainer": {
              px: 1.25,
              py: 1,
              gap: 1,
              borderBottom: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.7),
            },
            "& .MuiDataGrid-row.row-stale": {
              backgroundColor: alpha(theme.palette.error.main, 0.035),
            },
            "& .MuiDataGrid-row.row-soon": {
              backgroundColor: alpha(theme.palette.warning.main, 0.04),
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          })}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            density="compact"
            pageSizeOptions={[10, 25, 50]}
            getRowHeight={() => "auto"}
            getEstimatedRowHeight={() => 108}
            getRowClassName={(params) =>
              params.row.freshnessTone === "stale"
                ? "row-stale"
                : params.row.freshnessTone === "soon"
                  ? "row-soon"
                  : ""
            }
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: {
                sortModel: [{ field: "freshnessLabel", sort: "asc" }],
              },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {
                  debounceMs: 300,
                  placeholder: "Filter listings, category, area, or notes",
                },
              },
            }}
          />
        </Box>
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
  const spreadsheetRows = buildGuideSpreadsheetRows(ananyasLocalGuide);
  const csvDownloadUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(
    `\uFEFF${createGuideCsv(spreadsheetRows)}`,
  )}`;

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
      const result = await saveListingReport(ananyasLocalGuide.slug, {
        listingId: target.reportId,
        listingName: target.name,
        categoryId: target.categoryId,
        reportType,
        message,
      });

      setReportFeedback({
        severity: result?.localFallback ? "warning" : "success",
        message: result?.localFallback
          ? reportType === "stale"
            ? `${target.name} was saved locally on this device for recheck. Configure blob writes to collect reports centrally.`
            : `Your update for ${target.name} was saved locally on this device. Configure blob writes to collect reports centrally.`
          : reportType === "stale"
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

  const topJumpCards = [
    {
      href: "#spreadsheet-view",
      icon: TableChartRoundedIcon,
      eyebrow: "Fast scan",
      title: "Spreadsheet view",
      description:
        "See every store and service in one table with hours, freshness, and links.",
      meta: `${spreadsheetRows.length} rows`,
    },
    {
      href: "#cards-view",
      icon: ViewModuleRoundedIcon,
      eyebrow: "Detailed browse",
      title: "Card view",
      description:
        "Use the fuller cards when you want context, notes, and bigger tap targets.",
      meta: `${ananyasLocalGuide.categories.length} sections`,
    },
    {
      href: "#next-additions",
      icon: ChecklistRoundedIcon,
      eyebrow: "Watchlist",
      title: "Next additions",
      description:
        "Keep track of high-value services that still need on-ground verification.",
      meta: `${ananyasLocalGuide.nextUsefulAdditions.length} items`,
    },
  ];

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
            <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
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
              <Button
                component="a"
                href="#spreadsheet-view"
                variant="outlined"
                startIcon={<TableChartRoundedIcon />}
                sx={{ borderRadius: 999 }}
              >
                Jump to spreadsheet
              </Button>
              <Button
                component="a"
                href={csvDownloadUrl}
                download="ananyas-nearby-guide.csv"
                variant="outlined"
                startIcon={<DownloadRoundedIcon />}
                sx={{ borderRadius: 999 }}
              >
                Download CSV
              </Button>
              <Button
                component={RouterLink}
                to="/utilities/local-guide-review"
                variant="outlined"
                startIcon={<LockRoundedIcon />}
                sx={{ borderRadius: 999 }}
              >
                Review reports
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {topJumpCards.map((card) => (
            <QuickJumpCard key={card.href} {...card} />
          ))}
        </Box>

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

        <SpreadsheetTable
          rows={spreadsheetRows}
          csvDownloadUrl={csvDownloadUrl}
          onSuggestUpdate={openUpdateDialog}
          onMarkStale={handleMarkStale}
        />

        <Stack
          id="cards-view"
          spacing={3.5}
          sx={(theme) => ({ scrollMarginTop: theme.spacing(12) })}
        >
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
        </Stack>

        <Divider />

        <Paper
          id="next-additions"
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2.25, md: 3 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.14),
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            scrollMarginTop: theme.spacing(12),
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
