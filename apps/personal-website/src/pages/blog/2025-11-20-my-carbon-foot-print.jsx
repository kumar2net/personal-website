import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

const COIMBATORE_FACTORS = {
  electricityKwh: 323,
  electricityEmission: 0.708, // kg CO2e per kWh (CEA India 2022)
  waterM3: 15, // 500 L/day × 30
  waterEmission: 0.344, // kg CO2e per m³ (pumping + treatment)
  lpgKg: 10,
  lpgEmission: 3.0, // kg CO2e per kg LPG
  travelKm: 60,
  travelEmission: 0.18, // kg CO2e per km (tailpipe + upstream for gasoline car)
  foodSpendInr: 20000,
  fxInrPerUsd: 83.5,
  foodEmissionPerInr1000: 1.93, // kg CO2e per ₹1,000 (India food supply chain intensity)
  familyMembers: 2,
};

const quote = "you need to measuer to improve";

function formatNumber(value, options = {}) {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    ...options,
  });
}

function buildSources() {
  const foodKg =
    (COIMBATORE_FACTORS.foodSpendInr / 1000) * COIMBATORE_FACTORS.foodEmissionPerInr1000;

  const sources = [
    {
      id: "electricity",
      category: "Electricity",
      activity: `${COIMBATORE_FACTORS.electricityKwh} kWh grid power`,
      factor: `${COIMBATORE_FACTORS.electricityEmission} kg/kWh`,
      emissionsKg: COIMBATORE_FACTORS.electricityKwh * COIMBATORE_FACTORS.electricityEmission,
      note: "CEA India 2022 grid intensity; heavy coal mix.",
    },
    {
      id: "lpg",
      category: "Cooking gas",
      activity: `${COIMBATORE_FACTORS.lpgKg} kg LPG cylinder use`,
      factor: `${COIMBATORE_FACTORS.lpgEmission} kg/kg`,
      emissionsKg: COIMBATORE_FACTORS.lpgKg * COIMBATORE_FACTORS.lpgEmission,
      note: "IPCC LPG factor ~3 kg CO2e per kg.",
    },
    {
      id: "water",
      category: "Water",
      activity: `${COIMBATORE_FACTORS.waterM3} m³ RO-treated water`,
      factor: `${COIMBATORE_FACTORS.waterEmission} kg/m³`,
      emissionsKg: COIMBATORE_FACTORS.waterM3 * COIMBATORE_FACTORS.waterEmission,
      note: "Includes pumping + treatment (global utilities benchmarks).",
    },
    {
      id: "travel",
      category: "Travel",
      activity: `${COIMBATORE_FACTORS.travelKm} km car rides`,
      factor: `${COIMBATORE_FACTORS.travelEmission} kg/km`,
      emissionsKg: COIMBATORE_FACTORS.travelKm * COIMBATORE_FACTORS.travelEmission,
      note: "Compact petrol car at ~17 g/MJ (~0.17 kg/km).",
    },
    {
      id: "food",
      category: "Food",
      activity: `₹${formatNumber(COIMBATORE_FACTORS.foodSpendInr, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      })} groceries`,
      factor: `${COIMBATORE_FACTORS.foodEmissionPerInr1000} kg/₹1,000`,
      emissionsKg: foodKg,
      note: "India grocery supply-chain intensity (incl. cold-chain + processing).",
    },
  ];

  const householdMonthlyKg = sources.reduce((sum, item) => sum + item.emissionsKg, 0);
  const perPersonMonthlyKg = householdMonthlyKg / COIMBATORE_FACTORS.familyMembers;
  const perPersonAnnualTons = (perPersonMonthlyKg * 12) / 1000;

  return {
    sources,
    householdMonthlyKg,
    perPersonMonthlyKg,
    perPersonAnnualTons,
  };
}

const { sources, householdMonthlyKg, perPersonMonthlyKg, perPersonAnnualTons } = buildSources();

const comparison = [
  {
    label: "You (per person, annualized)",
    value: Number(perPersonAnnualTons.toFixed(2)),
    color: "#0ea5e9",
  },
  { label: "India average", value: 2.2, color: "#f97316" },
  { label: "Global average", value: 4.73, color: "#84cc16" },
];

const columns = [
  { field: "category", headerName: "Category", flex: 0.8, minWidth: 140 },
  { field: "activity", headerName: "Activity", flex: 1.2, minWidth: 220 },
  { field: "factor", headerName: "Factor", flex: 0.8, minWidth: 150 },
  { field: "note", headerName: "Why this factor?", flex: 1.5, minWidth: 280 },
];

export default function MyCarbonFootPrint() {
  const pieData = sources.map((s, idx) => ({
    id: s.id,
    value: Number(s.emissionsKg.toFixed(1)),
    label: s.category,
    color: ["#0ea5e9", "#f97316", "#06b6d4", "#6366f1", "#84cc16"][idx % 5],
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
        <Chip label="Coimbatore" color="primary" variant="outlined" />
        <Chip label="2-person household" variant="outlined" />
        <Chip label="MUI X v8 charts" variant="outlined" />
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(14,165,233,0.04))",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "2.4rem" }, fontWeight: 800 }}>
            My Carbon Foot Print
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            “{quote}” — transparent math for our 2-person family using Coimbatore utility bills, ₹20k groceries, and 100 km
            travel.
          </Typography>
          <Divider />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Monthly footprint (household)
              </Typography>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
                {formatNumber(householdMonthlyKg)} kg CO₂e
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per person: {formatNumber(perPersonMonthlyKg)} kg/month ·{" "}
                {formatNumber(perPersonAnnualTons, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} t/year (tons of
                carbon dioxide equivalent)
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                COP30 check-in
              </Typography>
              <Typography variant="body2" color="text.secondary">
                COP30 mitigation drafts push emerging economies toward sub-2 t CO₂e/person/year. We’re at{" "}
                {formatNumber(perPersonAnnualTons, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} t — below the
                India mean (2.2) and global (4.73); keep trimming electricity + food intensity to stay comfortably under the
                2 t lane.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Transparent math (MUI X Data Grid)
          </Typography>
            <Box sx={{ height: 420 }}>
              <DataGrid
                rows={sources}
                columns={columns}
                disableColumnMenu
                disableRowSelectionOnClick
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5]}
              />
            </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            You vs India vs World (t CO₂e per person per year)
          </Typography>
          <BarChart
            dataset={comparison}
            xAxis={[{ scaleType: "band", dataKey: "label" }]}
            series={[
              {
                dataKey: "value",
                label: "t CO₂e",
                valueFormatter: (v) => `${v} t`,
                color: "#0ea5e9",
              },
            ]}
            slotProps={{
              legend: { hidden: true },
            }}
            height={300}
            margin={{ top: 10, bottom: 40, left: 60, right: 10 }}
            sx={{
              "& .MuiChartsAxis-tickLabel": { fontWeight: 600 },
            }}
          />
          <Stack spacing={1}>
            {comparison.map((item) => (
              <Stack key={item.label} direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: 1,
                    backgroundColor: item.color,
                  }}
                />
                <Typography variant="body2">
                  {item.label}: {item.value} t CO₂e/person/year
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Household mix (exploded)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This pie shows only our household split (no India/global comparison); hover slices to see the monthly kg CO₂e each
            category contributes.
          </Typography>
          <PieChart
            height={320}
            series={[
              {
                data: pieData.map((d, i) => ({
                  ...d,
                  innerRadius: 30,
                  outerRadius: 120,
                  paddingAngle: 1.5,
                  cornerRadius: 4,
                  highlighted: i === 0,
                })),
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -12 },
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
            sx={{
              "& text": { fontWeight: 600 },
            }}
          />
          <Stack spacing={0.75}>
            {pieData.map((item) => (
              <Stack key={item.id} direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: 1,
                    backgroundColor: item.color,
                  }}
                />
                <Typography variant="body2">
                  {item.label}: {formatNumber(item.value)} kg CO₂e/month
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            What this means
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Biggest levers
              </Typography>
              <Stack spacing={1.25}>
                <Typography variant="body2">
                  • Electricity (228.7 kg) dominates because of coal-heavy grid intensity; daytime solar + efficiency cuts fastest.
                </Typography>
                <Typography variant="body2">
                  • Groceries (≈38.6 kg with COP30 factor) are modest here; tighter cold-chain/veg-heavy choices keep it low.
                </Typography>
                <Typography variant="body2">
                  • LPG (30 kg) and car travel (18 kg) are smaller; induction cooking and 1 rideshare/EV swap weekly trims both.
                </Typography>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                How you compare
              </Typography>
              <Stack spacing={1.25}>
                <Typography variant="body2">
                  • Your per-person annualized footprint: {formatNumber(perPersonAnnualTons, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} t
                  CO₂e.
                </Typography>
                <Typography variant="body2">• India average: ~2.2 t CO₂e/person/year.</Typography>
                <Typography variant="body2">• Global average: ~4.73 t CO₂e/person/year.</Typography>
                <Typography variant="body2">
                  Target: align with COP30’s sub-2 t/person trajectory by shaving ~0.1–0.3 t via electricity + food tweaks.
                </Typography>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ borderRadius: 3, alignItems: "flex-start" }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Assumptions you can swap if the family disagrees
          </Typography>
          <Typography variant="body2" color="text.primary">
            • India grid intensity: 0.708 kg/kWh (CEA 2022) — replace with smart-meter emissions if you have them.
            <br />
            • Grocery intensity: 1.93 kg per ₹1,000 (COP30-aligned). Adjust up/down for meatier or veg-heavy baskets.
            <br />
            • Travel: 0.18 kg/km (gasoline tailpipe + upstream). Swap with your EV/scooter factor to recalc instantly.
            <br />
            • Water: 0.344 kg/m³ includes pumping + RO treatment; if you rainwater-harvest, set this near zero.
          </Typography>
        </Box>
      </Alert>
      <Box sx={{ fontSize: "0.95rem", color: "text.secondary" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          PS: Sources & Acronyms
        </Typography>
        <Typography component="div" variant="body2" sx={{ lineHeight: 1.6 }}>
          • CEA: Central Electricity Authority (India) 2022 grid intensity — 0.708 kg CO₂e/kWh (kilogram of carbon dioxide
          equivalent per kilowatt-hour of electricity).<br />
          • IPCC: Intergovernmental Panel on Climate Change LPG factor — 3.0 kg CO₂e/kg LPG.<br />
          • Water factor: 0.344 kg CO₂e/m³ for pumping + reverse osmosis treatment (global utilities benchmarks).<br />
          • Food factor: 1.93 kg CO₂e per ₹1,000 spend (India grocery supply-chain intensity, COP30-aligned notes).<br />
          • Travel factor: 0.18 kg CO₂e/km (tailpipe 144 g + upstream 36 g per km for gasoline car in India).<br />
          • COP30 target: keep per-capita annual footprint below ~2 t CO₂e/person/year for a 1.5 °C-compatible lifestyle.<br />
          • CO₂e: Carbon dioxide equivalent; kWh: kilowatt-hour; LPG: liquefied petroleum gas; RO: reverse osmosis.
        </Typography>
      </Box>

    </Box>
  );
}
