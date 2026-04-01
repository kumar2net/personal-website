import { useMemo, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const FLAT_COUNT = 8;
const ROYAL_STORES_SHARE = 0.5;
const INITIAL_ROW_COUNT = 12;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }

  return currencyFormatter.format(value);
}

function createRow(period = "", commonAmount = "", notes = "") {
  return {
    id:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    period,
    commonAmount,
    notes,
  };
}

function getPeriodLabel(offset = 0) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + offset);

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function createInitialRows() {
  return Array.from({ length: INITIAL_ROW_COUNT }, (_, index) =>
    createRow(getPeriodLabel(index)),
  );
}

function parseAmount(rawValue) {
  if (rawValue === "" || rawValue == null) {
    return null;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function calculateRow(row) {
  const amount = parseAmount(row.commonAmount);
  const hasAmount = amount != null;

  if (!hasAmount) {
    return {
      ...row,
      amount: null,
      hasAmount: false,
      equalSplit: null,
      royalStores: null,
      flatsPool: null,
      perFlat: null,
      savingsVsEqualSplit: null,
    };
  }

  const equalSplit = amount / FLAT_COUNT;
  const royalStores = amount * ROYAL_STORES_SHARE;
  const flatsPool = amount - royalStores;
  const perFlat = flatsPool / FLAT_COUNT;

  return {
    ...row,
    amount,
    hasAmount: true,
    equalSplit,
    royalStores,
    flatsPool,
    perFlat,
    savingsVsEqualSplit: equalSplit - perFlat,
  };
}

function buildCsv(rows) {
  const headers = [
    "Period",
    "Common EB Amount",
    "Equal Split Divide by 8",
    "Royal Stores 50%",
    "Flats Pool 50%",
    "Each Flat Share",
    "Savings vs Divide by 8",
    "Notes",
  ];

  const csvRows = rows.map((row) => [
    row.period,
    row.amount ?? "",
    row.equalSplit ?? "",
    row.royalStores ?? "",
    row.flatsPool ?? "",
    row.perFlat ?? "",
    row.savingsVsEqualSplit ?? "",
    row.notes,
  ]);

  return [headers, ...csvRows]
    .map((columns) =>
      columns
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}

function downloadCsv(rows) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "aishwarya-enclave-common-eb.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function SummaryCard({ label, value, helper }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          {helper ? (
            <Typography variant="body2" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function CommonEbCalculator() {
  const [rows, setRows] = useState(() => createInitialRows());

  const calculatedRows = useMemo(
    () => rows.map((row) => calculateRow(row)),
    [rows],
  );

  const filledRowCount = useMemo(
    () => calculatedRows.filter((row) => row.hasAmount).length,
    [calculatedRows],
  );

  const summary = useMemo(
    () =>
      calculatedRows.reduce(
        (totals, row) => {
          if (!row.hasAmount) {
            return totals;
          }

          return {
            commonAmount: totals.commonAmount + row.amount,
            royalStores: totals.royalStores + row.royalStores,
            flatsPool: totals.flatsPool + row.flatsPool,
            perFlat: totals.perFlat + row.perFlat,
            savingsVsEqualSplit:
              totals.savingsVsEqualSplit + row.savingsVsEqualSplit,
          };
        },
        {
          commonAmount: 0,
          royalStores: 0,
          flatsPool: 0,
          perFlat: 0,
          savingsVsEqualSplit: 0,
        },
      ),
    [calculatedRows],
  );

  const handleRowChange = (rowId, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleAddRow = () => {
    setRows((currentRows) => [...currentRows, createRow(getPeriodLabel(currentRows.length))]);
  };

  const handleDeleteRow = (rowId) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== rowId));
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Typography
          component="h1"
          variant="h3"
          sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}
        >
          Aishwarya Enclave Common EB Calculator
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 860 }}>
          Enter the monthly common EB bill and the sheet will calculate the
          Aishwarya Enclave split automatically: Royal Stores pays 50% of the
          total and the remaining 50% is shared equally across 8 flats.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap">
          <Chip label="8 flats" color="primary" variant="outlined" />
          <Chip label="Royal Stores: 50%" color="primary" variant="outlined" />
          <Chip label="Each flat: common amount ÷ 16" color="primary" variant="outlined" />
        </Stack>
      </Stack>

      <Alert severity="info" variant="outlined">
        Reference split by 8: <strong>Common amount ÷ 8</strong>. Aishwarya
        Enclave split: <strong>Royal Stores = 50%</strong>, and{" "}
        <strong>each flat = (remaining 50%) ÷ 8</strong>.
      </Alert>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <SummaryCard
          label="Common EB Total"
          value={formatCurrency(summary.commonAmount)}
          helper={`${filledRowCount} filled month${filledRowCount === 1 ? "" : "s"}`}
        />
        <SummaryCard
          label="Royal Stores Total"
          value={formatCurrency(summary.royalStores)}
          helper="50% of the total common EB"
        />
        <SummaryCard
          label="All Flats Total"
          value={formatCurrency(summary.flatsPool)}
          helper="Combined share for the 8 flats"
        />
        <SummaryCard
          label="Each Flat Total"
          value={formatCurrency(summary.perFlat)}
          helper={`Savings vs divide-by-8: ${formatCurrency(summary.savingsVsEqualSplit)}`}
        />
      </Box>

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ px: 3, py: 2.5 }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Monthly Sheet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Edit the amount column only. All other payment columns update
              automatically.
            </Typography>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={() => downloadCsv(calculatedRows)}
              disabled={filledRowCount === 0}
            >
              Export CSV
            </Button>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleAddRow}>
              Add Month
            </Button>
          </Stack>
        </Stack>

        <Divider />

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 1120 }}>
            <TableHead>
              <TableRow>
                <TableCell>Period</TableCell>
                <TableCell>Common EB Amount</TableCell>
                <TableCell>Divide by 8</TableCell>
                <TableCell>Royal Stores 50%</TableCell>
                <TableCell>Flats Pool 50%</TableCell>
                <TableCell>Each Flat Share</TableCell>
                <TableCell>Savings Per Flat</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calculatedRows.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell sx={{ minWidth: 160 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={row.period}
                      onChange={(event) =>
                        handleRowChange(row.id, "period", event.target.value)
                      }
                      placeholder="Apr 2026"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 170 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={row.commonAmount}
                      onChange={(event) =>
                        handleRowChange(row.id, "commonAmount", event.target.value)
                      }
                      placeholder="0.00"
                      inputProps={{ min: 0, step: "0.01" }}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(row.equalSplit)}</TableCell>
                  <TableCell>{formatCurrency(row.royalStores)}</TableCell>
                  <TableCell>{formatCurrency(row.flatsPool)}</TableCell>
                  <TableCell>{formatCurrency(row.perFlat)}</TableCell>
                  <TableCell>{formatCurrency(row.savingsVsEqualSplit)}</TableCell>
                  <TableCell sx={{ minWidth: 220 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={row.notes}
                      onChange={(event) =>
                        handleRowChange(row.id, "notes", event.target.value)
                      }
                      placeholder="Optional note"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      color="inherit"
                      size="small"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => handleDeleteRow(row.id)}
                      disabled={rows.length === 1}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
