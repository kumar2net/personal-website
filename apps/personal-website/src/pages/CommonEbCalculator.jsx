import { useMemo, useState } from "react";
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
const ROYAL_STORES_PER_FLAT_SHARE = 0.5;

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

function calculateSplit(rawAmount) {
  const amount = parseAmount(rawAmount);
  const hasAmount = amount != null;

  if (!hasAmount) {
    return {
      amount: null,
      hasAmount: false,
      basePerFlat: null,
      royalStores: null,
      flatsPool: null,
      perFlat: null,
      savingsVsEqualSplit: null,
    };
  }

  const basePerFlat = amount / FLAT_COUNT;
  const royalStores = basePerFlat * ROYAL_STORES_PER_FLAT_SHARE;
  const flatsPool = amount - royalStores;
  const perFlat = flatsPool / FLAT_COUNT;

  return {
    amount,
    hasAmount: true,
    basePerFlat,
    royalStores,
    flatsPool,
    perFlat,
    savingsVsEqualSplit: basePerFlat - perFlat,
  };
}

function buildCsv(row) {
  const headers = [
    "Current Billing Cycle Common Amount",
    "Base Flat Amount Divide by 8",
    "Royal Stores 50% of Base Flat Amount",
    "Amount Left for 8 Flats",
    "Each Flat Share",
    "Savings vs Divide by 8",
  ];

  const values = [
    row.amount ?? "",
    row.basePerFlat ?? "",
    row.royalStores ?? "",
    row.flatsPool ?? "",
    row.perFlat ?? "",
    row.savingsVsEqualSplit ?? "",
  ];

  return [headers, values]
    .map((columns) =>
      columns
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}

function downloadCsv(row) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([buildCsv(row)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "aishwarya-enclave-common-eb-current-cycle.csv";
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
  const [commonAmount, setCommonAmount] = useState("");

  const row = useMemo(() => calculateSplit(commonAmount), [commonAmount]);

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
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 860 }}
        >
          Enter the current billing cycle common EB amount. The calculator uses
          this split: base flat amount is common EB divided by 8, Royal Stores
          pays 50% of that base flat amount, and the remaining bill is shared
          equally across the 8 flats.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          flexWrap="wrap"
        >
          <Chip label="1 current billing cycle row" color="primary" variant="outlined" />
          <Chip label="Base flat amount = common EB ÷ 8" color="primary" variant="outlined" />
          <Chip
            label="Royal Stores = 50% of base flat amount"
            color="primary"
            variant="outlined"
          />
        </Stack>
      </Stack>

      <Alert severity="info" variant="outlined">
        Formula used: <strong>Base flat amount = Common amount ÷ 8</strong>,{" "}
        <strong>Royal Stores = 50% of base flat amount</strong>, and{" "}
        <strong>Each flat = (Common amount - Royal Stores share) ÷ 8</strong>.
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
          label="Common EB Amount"
          value={formatCurrency(row.amount)}
          helper="Current billing cycle input"
        />
        <SummaryCard
          label="Royal Stores"
          value={formatCurrency(row.royalStores)}
          helper="50% of the base divide-by-8 amount"
        />
        <SummaryCard
          label="Left for 8 Flats"
          value={formatCurrency(row.flatsPool)}
          helper="Remaining amount after Royal Stores share"
        />
        <SummaryCard
          label="Each Flat Share"
          value={formatCurrency(row.perFlat)}
          helper={`Savings vs divide-by-8: ${formatCurrency(
            row.savingsVsEqualSplit,
          )}`}
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
              Current Billing Cycle
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update the common EB amount in the single row below.
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            onClick={() => downloadCsv(row)}
            disabled={!row.hasAmount}
          >
            Export CSV
          </Button>
        </Stack>

        <Divider />

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 920 }}>
            <TableHead>
              <TableRow>
                <TableCell>Current Billing Cycle Common Amount</TableCell>
                <TableCell>Base Flat Amount</TableCell>
                <TableCell>Royal Stores</TableCell>
                <TableCell>Left for 8 Flats</TableCell>
                <TableCell>Each Flat Share</TableCell>
                <TableCell>Savings Per Flat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell sx={{ minWidth: 240 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={commonAmount}
                    onChange={(event) => setCommonAmount(event.target.value)}
                    placeholder="0.00"
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </TableCell>
                <TableCell>{formatCurrency(row.basePerFlat)}</TableCell>
                <TableCell>{formatCurrency(row.royalStores)}</TableCell>
                <TableCell>{formatCurrency(row.flatsPool)}</TableCell>
                <TableCell>{formatCurrency(row.perFlat)}</TableCell>
                <TableCell>{formatCurrency(row.savingsVsEqualSplit)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
