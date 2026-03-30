import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './NaruviWaterIssues.css';

const LAST_UPDATED = 'March 30, 2026';
const COMMUNITY_UPDATE_DATE = 'March 30, 2026';

const DAILY_RO_PERMEATE_L = 29000;
const OCCUPIED_VILLAS = 35;
const ASSUMED_RESIDENTS_PER_VILLA = 3;
const DAILY_PER_CAPITA_L = Math.round(
  DAILY_RO_PERMEATE_L / OCCUPIED_VILLAS / ASSUMED_RESIDENTS_PER_VILLA
);

const HALF_RECOVERY_RAW_INPUT_L = DAILY_RO_PERMEATE_L * 2;
const HIGH_REJECT_RECOVERY = 0.35;
const HIGH_REJECT_RAW_INPUT_L = Math.round(
  DAILY_RO_PERMEATE_L / HIGH_REJECT_RECOVERY
);
const HIGH_REJECT_VOLUME_L = HIGH_REJECT_RAW_INPUT_L - DAILY_RO_PERMEATE_L;
const SHIFTED_OUTPUT_EXAMPLE_L = 1000;
const RAW_WATER_SAVED_AT_50_RECOVERY_L = SHIFTED_OUTPUT_EXAMPLE_L * 2;
const RAW_WATER_SAVED_AT_35_RECOVERY_L = Math.round(
  SHIFTED_OUTPUT_EXAMPLE_L / HIGH_REJECT_RECOVERY
);

const MONTHLY_VARIABLE_ENERGY_COST = 45477;
const MONTHLY_FIXED_CHARGE = 4280;
const MONTHLY_TNPDCL_COST = MONTHLY_VARIABLE_ENERGY_COST + MONTHLY_FIXED_CHARGE;
const BOREWELL_PUMP_MONTHLY_COST = 9567;
const RO_PUMP_MONTHLY_COST = 25650;
const LIGHTING_MONTHLY_COST = 10260;
const RO_PUMP_SHARE_PERCENT = Math.round(
  (RO_PUMP_MONTHLY_COST / MONTHLY_VARIABLE_ENERGY_COST) * 100
);
const WATER_PRODUCTION_SHARE_PERCENT = Math.round(
  ((RO_PUMP_MONTHLY_COST + BOREWELL_PUMP_MONTHLY_COST) /
    MONTHLY_VARIABLE_ENERGY_COST) *
    100
);

const MONTHLY_FIXED_CHARGE_SAVINGS_REFERENCE = 1391;
const LM51_PREVIOUS_LOAD_KW = 15;
const LM51_REVISED_LOAD_KW = 2;
const TNPDCL_FIXED_CHARGE_PER_KW_PER_2_MONTHS = 214;

const VILLA_SAMPLE_BILL = {
  billDate: 'July 26, 2025',
  billPeriod: 'May 24, 2025 to July 26, 2025',
  tariff: 'LA1A',
  sanctionedLoadKw: 13,
  energyKwh: 323,
  maxDemandKw: 2.6,
  payableRs: 813,
};

const toneClasses = {
  sky: 'border-sky-200 bg-sky-50',
  emerald: 'border-emerald-200 bg-emerald-50',
  amber: 'border-amber-200 bg-amber-50',
  rose: 'border-rose-200 bg-rose-50',
  violet: 'border-violet-200 bg-violet-50',
  slate: 'border-slate-200 bg-slate-50',
};

const parseInputNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumber = (value) => value.toLocaleString('en-IN');

const formatCurrency = (value) =>
  `₹${Math.round(value).toLocaleString('en-IN')}`;

const snapshotItems = [
  {
    eyebrow: 'RO permeate model',
    value: `${formatNumber(DAILY_RO_PERMEATE_L)} L/day`,
    detail:
      'Latest archived plant model used on this page for current-system sizing.',
    tone: 'sky',
  },
  {
    eyebrow: 'Use intensity',
    value: `${formatNumber(DAILY_PER_CAPITA_L)} L/person/day`,
    detail: `${OCCUPIED_VILLAS} occupied villas x ${ASSUMED_RESIDENTS_PER_VILLA} assumed residents each.`,
    tone: 'emerald',
  },
  {
    eyebrow: 'Shared-system power model',
    value: formatCurrency(MONTHLY_TNPDCL_COST),
    detail: `${formatCurrency(MONTHLY_VARIABLE_ENERGY_COST)} energy + ${formatCurrency(MONTHLY_FIXED_CHARGE)} fixed charge per month.`,
    tone: 'amber',
  },
  {
    eyebrow: 'Latest villa bill found',
    value: `${formatCurrency(VILLA_SAMPLE_BILL.payableRs)} for ${formatNumber(
      VILLA_SAMPLE_BILL.energyKwh
    )} kWh`,
    detail: `Single-villa TNPDCL bill dated ${VILLA_SAMPLE_BILL.billDate}; not the same billing context as the shared plant model.`,
    tone: 'slate',
  },
];

const refreshNotes = [
  {
    title: 'Source dates exposed',
    body: 'The page now labels which numbers come from the archived plant calculation, the July 2025 villa bill, and the March 2026 community update.',
    tone: 'sky',
  },
  {
    title: 'Current design promoted',
    body: 'The preferred design is now clearly the parallel utility-water line. The older single-line mixing idea is treated as background, not the active recommendation.',
    tone: 'emerald',
  },
  {
    title: 'Technical diagrams added',
    body: 'Water architecture and solar-billing logic are now shown visually so owners can inspect the proposed operating model without parsing long paragraphs.',
    tone: 'amber',
  },
];

const updateTrackers = [
  {
    title: 'Solar economics updated',
    body: 'Latest owner input says the current solar plan is grid-connected only, without any BESS, and total cost should remain under ₹9,00,000 once TNPDCL gives back the subsidy. That pulls payback down to about 25 months, or just over 2 years.',
    tone: 'emerald',
  },
  {
    title: 'Owner opinion has split cleanly',
    body: 'A strong owner group wants to retain 100% RO usage inside villas for appliance and fitting protection, while the opposing view points to low-TDS water, high reject volume, and avoidable energy cost.',
    tone: 'sky',
  },
  {
    title: 'Current NOWA design direction',
    body: 'The office is contemplating one additional pressurized parallel line for outdoor utility use, a TDS increase to roughly 70, and retention of the existing indoor RO supply.',
    tone: 'amber',
  },
];

const sourceRegister = [
  {
    title: 'Archived plant model',
    date: 'NaruviWatercalc.csv',
    body: `29,000 L/day RO permeate, ${formatCurrency(
      MONTHLY_TNPDCL_COST
    )}/month shared-system power model, and the 50% recovery baseline come from the archived community calculation sheet.`,
  },
  {
    title: 'Sample TNPDCL villa bill',
    date: VILLA_SAMPLE_BILL.billDate,
    body: `The latest Naruvi-specific bill found in the repo is a single-villa LA1A bill: ${formatNumber(
      VILLA_SAMPLE_BILL.energyKwh
    )} kWh, ${formatCurrency(VILLA_SAMPLE_BILL.payableRs)}, 13 kW sanctioned load, 2.6 kW max demand.`,
  },
  {
    title: 'Community status note',
    date: COMMUNITY_UPDATE_DATE,
    body: 'Latest owner input added on March 30, 2026: solar should land below ₹9 lakh after subsidy, the indoor RO line remains politically important, and NOWA is contemplating a parallel utility-water line plus a TDS reset to about 70.',
  },
  {
    title: 'Groundwater-recharge priority',
    date: COMMUNITY_UPDATE_DATE,
    body: 'Owner observation over the last four years is that both monsoons have been weak at the site, so rainwater harvesting is now being treated as the clearest low-hanging fruit for recharging the water table.',
  },
  {
    title: 'Public benchmark',
    date: 'WHO domestic water quantity guidance',
    body: 'Basic domestic service starts around 20 L/person/day, higher hygiene around 50 L/person/day, and optimal domestic service above 100 L/person/day.',
  },
];

const nextActions = [
  'Close vendor quotes from teams that have actually built pressurized supply systems in existing villa layouts.',
  'Freeze one standard outdoor outlet design per villa, including isolation valves and labelling.',
  'Publish a short owner note distinguishing indoor RO use from the new outdoor utility-water use.',
  'Capture the first post-change bills before claiming realized savings from solar export or LM51 fixed-charge reduction.',
];

const monitoringItems = [
  'RO plant runtime hours per day',
  'Borewell pump runtime hours per day',
  'TNPDCL common-service bill before and after the tariff/load changes',
  'Delivered TDS band for the retained indoor RO line',
  'Outdoor utility-line uptake after one outlet per villa goes live',
  'Rainwater harvesting capture and recharge status before and after each monsoon',
];

const SummaryCard = ({ eyebrow, value, detail, tone = 'slate' }) => (
  <div
    className={`naruvi-light-surface naruvi-light-card rounded-2xl border p-5 ${toneClasses[tone]}`}
  >
    <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
      {eyebrow}
    </p>
    <p className="mt-3 text-2xl font-semibold leading-tight">{value}</p>
    <p className="mt-2 text-sm leading-6 opacity-90">{detail}</p>
  </div>
);

const InsightCard = ({ title, body, tone = 'slate' }) => (
  <div
    className={`naruvi-light-surface naruvi-light-card rounded-2xl border p-5 ${toneClasses[tone]}`}
  >
    <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-800">{body}</p>
  </div>
);

const WaterArchitectureDiagram = () => (
  <figure className="naruvi-light-surface naruvi-light-card rounded-2xl border border-slate-200 bg-white p-4">
    <svg
      className="naruvi-diagram"
      viewBox="0 0 960 560"
      role="img"
      aria-labelledby="naruvi-water-diagram-title naruvi-water-diagram-desc"
    >
      <title id="naruvi-water-diagram-title">
        Proposed Naruvi water architecture
      </title>
      <desc id="naruvi-water-diagram-desc">
        Borewell and corporation water feed both the RO plant for protected
        indoor use and a separate utility booster line for outdoor uses, while
        keeping the indoor villa plumbing unchanged.
      </desc>
      <defs>
        <marker
          id="naruvi-arrow-blue"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path d="M0,0 L12,6 L0,12 z" fill="#2563eb" />
        </marker>
        <marker
          id="naruvi-arrow-green"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path d="M0,0 L12,6 L0,12 z" fill="#059669" />
        </marker>
      </defs>

      <rect
        x="20"
        y="20"
        width="920"
        height="520"
        rx="28"
        fill="#f8fafc"
        stroke="#cbd5e1"
      />
      <text x="52" y="64" className="naruvi-diagram-title">
        Proposed Water Architecture
      </text>
      <text x="52" y="92" className="naruvi-diagram-subtitle">
        Contemplated direction as of March 30, 2026: keep the indoor RO loop
        intact, add one outdoor utility outlet per villa, and shift outdoor
        demand away from the RO plant.
      </text>

      <rect
        x="60"
        y="170"
        width="190"
        height="120"
        rx="20"
        fill="#dbeafe"
        stroke="#60a5fa"
        strokeWidth="2"
      />
      <text x="155" y="210" textAnchor="middle" className="naruvi-diagram-label">
        <tspan x="155" dy="0">
          Borewell +
        </tspan>
        <tspan x="155" dy="28">
          Corporation Water
        </tspan>
      </text>
      <text x="155" y="266" textAnchor="middle" className="naruvi-diagram-small">
        Existing raw-water sources
      </text>

      <rect
        x="390"
        y="95"
        width="190"
        height="120"
        rx="20"
        fill="#eff6ff"
        stroke="#2563eb"
        strokeWidth="2"
      />
      <text x="485" y="145" textAnchor="middle" className="naruvi-diagram-label">
        <tspan x="485" dy="0">
          RO Plant
        </tspan>
        <tspan x="485" dy="28">
          Protected Indoor Feed
        </tspan>
      </text>
      <text x="485" y="192" textAnchor="middle" className="naruvi-diagram-small">
        Soft water retained for kitchen, bath, fixtures
      </text>

      <rect
        x="390"
        y="325"
        width="190"
        height="120"
        rx="20"
        fill="#ecfdf5"
        stroke="#10b981"
        strokeWidth="2"
      />
      <text x="485" y="374" textAnchor="middle" className="naruvi-diagram-label">
        <tspan x="485" dy="0">
          Utility Tank +
        </tspan>
        <tspan x="485" dy="28">
          Booster / Valves
        </tspan>
      </text>
      <text x="485" y="421" textAnchor="middle" className="naruvi-diagram-small">
        Separate pressurized service
      </text>

      <rect
        x="690"
        y="75"
        width="210"
        height="160"
        rx="20"
        fill="#eff6ff"
        stroke="#2563eb"
        strokeWidth="2"
      />
      <text x="795" y="118" textAnchor="middle" className="naruvi-diagram-label">
        Indoor RO Loop
      </text>
      <text x="795" y="152" textAnchor="middle" className="naruvi-diagram-small">
        Kitchen
      </text>
      <text x="795" y="178" textAnchor="middle" className="naruvi-diagram-small">
        Bathing / fixtures
      </text>
      <text x="795" y="204" textAnchor="middle" className="naruvi-diagram-small">
        Drinking and appliance protection
      </text>

      <rect
        x="690"
        y="305"
        width="210"
        height="150"
        rx="20"
        fill="#ecfdf5"
        stroke="#10b981"
        strokeWidth="2"
      />
      <text x="795" y="349" textAnchor="middle" className="naruvi-diagram-label">
        Outdoor Utility Outlet
      </text>
      <text x="795" y="381" textAnchor="middle" className="naruvi-diagram-small">
        Vehicle washing
      </text>
      <text x="795" y="407" textAnchor="middle" className="naruvi-diagram-small">
        Floor washing
      </text>
      <text x="795" y="433" textAnchor="middle" className="naruvi-diagram-small">
        Garden watering / cleaning
      </text>

      <path
        d="M250 205 H390"
        fill="none"
        stroke="#2563eb"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-blue)"
      />
      <path
        d="M250 255 V385 H390"
        fill="none"
        stroke="#059669"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-green)"
      />
      <path
        d="M580 155 H690"
        fill="none"
        stroke="#2563eb"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-blue)"
      />
      <path
        d="M580 385 H690"
        fill="none"
        stroke="#059669"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-green)"
      />

      <path
        d="M690 245 H900"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="12 10"
      />
      <text x="795" y="272" textAnchor="middle" className="naruvi-diagram-note">
        Internal villa plumbing remains untouched
      </text>

      <rect
        x="60"
        y="455"
        width="840"
        height="54"
        rx="16"
        fill="#fff7ed"
        stroke="#fdba74"
      />
      <text x="80" y="487" className="naruvi-diagram-note">
        Engineering intent: shift outdoor demand first. Every 1,000 L/day moved
        off RO can save roughly {formatNumber(RAW_WATER_SAVED_AT_50_RECOVERY_L)}
        {' '}
        to {formatNumber(RAW_WATER_SAVED_AT_35_RECOVERY_L)} L/day of raw-water
        extraction, depending on actual recovery.
      </text>
    </svg>
    <figcaption className="mt-3 text-sm leading-6 text-slate-700">
      Current NOWA contemplation: do not retrofit hidden indoor pipelines. Add
      one separate pressurized outdoor utility-water point per villa and use it
      to remove outdoor demand from the RO loop first.
    </figcaption>
  </figure>
);

const EnergyBillingDiagram = () => (
  <figure className="naruvi-light-surface naruvi-light-card rounded-2xl border border-slate-200 bg-white p-4">
    <svg
      className="naruvi-diagram"
      viewBox="0 0 960 540"
      role="img"
      aria-labelledby="naruvi-energy-diagram-title naruvi-energy-diagram-desc"
    >
      <title id="naruvi-energy-diagram-title">
        Solar and billing logic for Naruvi
      </title>
      <desc id="naruvi-energy-diagram-desc">
        Rooftop solar and TNPDCL grid supply meet at the common service meter,
        which feeds the RO pump, borewell pump, and common lighting. Savings
        come from consumption offset, export credit, and lower fixed charges
        after reducing LM51 sanctioned load.
      </desc>
      <defs>
        <marker
          id="naruvi-arrow-amber"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path d="M0,0 L12,6 L0,12 z" fill="#d97706" />
        </marker>
        <marker
          id="naruvi-arrow-slate"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path d="M0,0 L12,6 L0,12 z" fill="#475569" />
        </marker>
      </defs>

      <rect
        x="20"
        y="20"
        width="920"
        height="500"
        rx="28"
        fill="#f8fafc"
        stroke="#cbd5e1"
      />
      <text x="52" y="64" className="naruvi-diagram-title">
        Solar and Billing Logic
      </text>
      <text x="52" y="92" className="naruvi-diagram-subtitle">
        The calculator below is driven by three value paths: solar consumption
        offset, export credit, and an optional fixed-charge reduction if the
        LM51 load-rationalization track also lands.
      </text>

      <rect
        x="60"
        y="80"
        width="210"
        height="110"
        rx="20"
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth="2"
      />
      <text x="165" y="128" textAnchor="middle" className="naruvi-diagram-label">
        Rooftop Solar
      </text>
      <text x="165" y="160" textAnchor="middle" className="naruvi-diagram-small">
        Post-subsidy capex assumed below
      </text>
      <text x="165" y="182" textAnchor="middle" className="naruvi-diagram-small">
        {formatCurrency(890000)}
      </text>

      <rect
        x="60"
        y="260"
        width="210"
        height="110"
        rx="20"
        fill="#e2e8f0"
        stroke="#64748b"
        strokeWidth="2"
      />
      <text x="165" y="308" textAnchor="middle" className="naruvi-diagram-label">
        TNPDCL Grid
      </text>
      <text x="165" y="340" textAnchor="middle" className="naruvi-diagram-small">
        Imports cover shortfall
      </text>
      <text x="165" y="362" textAnchor="middle" className="naruvi-diagram-small">
        Exports create credit
      </text>

      <rect
        x="380"
        y="170"
        width="210"
        height="140"
        rx="20"
        fill="#eff6ff"
        stroke="#2563eb"
        strokeWidth="2"
      />
      <text x="485" y="214" textAnchor="middle" className="naruvi-diagram-label">
        Common Service Meter
      </text>
      <text x="485" y="248" textAnchor="middle" className="naruvi-diagram-small">
        Solar offset + export accounting
      </text>
      <text x="485" y="270" textAnchor="middle" className="naruvi-diagram-small">
        LM51 load reduction and LA1D action
      </text>
      <text x="485" y="292" textAnchor="middle" className="naruvi-diagram-small">
        must show up in future bills
      </text>

      <rect
        x="690"
        y="70"
        width="190"
        height="120"
        rx="20"
        fill="#ede9fe"
        stroke="#8b5cf6"
        strokeWidth="2"
      />
      <text x="785" y="118" textAnchor="middle" className="naruvi-diagram-label">
        RO Pump
      </text>
      <text x="785" y="150" textAnchor="middle" className="naruvi-diagram-small">
        {formatCurrency(RO_PUMP_MONTHLY_COST)}/month
      </text>
      <text x="785" y="172" textAnchor="middle" className="naruvi-diagram-small">
        {RO_PUMP_SHARE_PERCENT}% of modeled variable energy
      </text>

      <rect
        x="690"
        y="220"
        width="190"
        height="110"
        rx="20"
        fill="#dcfce7"
        stroke="#22c55e"
        strokeWidth="2"
      />
      <text x="785" y="265" textAnchor="middle" className="naruvi-diagram-label">
        Borewell Pump
      </text>
      <text x="785" y="296" textAnchor="middle" className="naruvi-diagram-small">
        {formatCurrency(BOREWELL_PUMP_MONTHLY_COST)}/month
      </text>

      <rect
        x="690"
        y="360"
        width="190"
        height="110"
        rx="20"
        fill="#fee2e2"
        stroke="#f87171"
        strokeWidth="2"
      />
      <text x="785" y="405" textAnchor="middle" className="naruvi-diagram-label">
        Common Lighting
      </text>
      <text x="785" y="436" textAnchor="middle" className="naruvi-diagram-small">
        {formatCurrency(LIGHTING_MONTHLY_COST)}/month
      </text>

      <path
        d="M270 135 H380"
        fill="none"
        stroke="#d97706"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-amber)"
      />
      <path
        d="M270 315 H340 V260 H380"
        fill="none"
        stroke="#475569"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-slate)"
      />
      <path
        d="M590 210 H690"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-slate)"
      />
      <path
        d="M590 260 H650 V275 H690"
        fill="none"
        stroke="#22c55e"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-slate)"
      />
      <path
        d="M590 310 H650 V415 H690"
        fill="none"
        stroke="#ef4444"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#naruvi-arrow-slate)"
      />

      <rect
        x="60"
        y="408"
        width="530"
        height="68"
        rx="16"
        fill="#fff7ed"
        stroke="#fdba74"
      />
      <text x="82" y="437" className="naruvi-diagram-note">
        Savings levers on this page: monthly solar offset, export credit, and a
        reference fixed-charge reduction of about {formatCurrency(
          MONTHLY_FIXED_CHARGE_SAVINGS_REFERENCE
        )}
        /month if LM51 sanctioned load falls from {LM51_PREVIOUS_LOAD_KW} kW to
        {' '}
        {LM51_REVISED_LOAD_KW} kW at {formatCurrency(
          TNPDCL_FIXED_CHARGE_PER_KW_PER_2_MONTHS
        )}
        {' '}
        per kW per two months.
      </text>
    </svg>
    <figcaption className="mt-3 text-sm leading-6 text-slate-700">
      The page still uses editable assumptions, because the solar capex update
      is recent and realized savings cannot be confirmed until post-change
      TNPDCL bills and export credits actually land.
    </figcaption>
  </figure>
);

const NaruviWaterIssues = () => {
  const [solarIntegrationCost, setSolarIntegrationCost] = useState(890000);
  const [monthlySolarOffsetSavings, setMonthlySolarOffsetSavings] =
    useState(31500);
  const [monthlySolarExportCredit, setMonthlySolarExportCredit] =
    useState(5000);
  const [monthlySolarMaintenanceCost, setMonthlySolarMaintenanceCost] =
    useState(1500);
  const [calculatorCurrentLoadKw, setCalculatorCurrentLoadKw] = useState(
    LM51_PREVIOUS_LOAD_KW
  );
  const [calculatorRevisedLoadKw, setCalculatorRevisedLoadKw] = useState(
    LM51_REVISED_LOAD_KW
  );
  const [calculatorFixedChargeRate, setCalculatorFixedChargeRate] = useState(
    TNPDCL_FIXED_CHARGE_PER_KW_PER_2_MONTHS
  );

  const calculatorFixedChargeSavings = Math.max(
    0,
    ((Math.max(0, calculatorCurrentLoadKw - calculatorRevisedLoadKw) *
      calculatorFixedChargeRate) /
      2)
  );

  const solarNetMonthlySavings =
    monthlySolarOffsetSavings +
    monthlySolarExportCredit +
    calculatorFixedChargeSavings -
    monthlySolarMaintenanceCost;

  const solarPaybackMonths =
    solarNetMonthlySavings > 0
      ? Math.ceil(solarIntegrationCost / solarNetMonthlySavings)
      : null;

  const solarPaybackYears = solarPaybackMonths
    ? (solarPaybackMonths / 12).toFixed(1)
    : null;

  const solarAnnualRoiPercent =
    solarIntegrationCost > 0
      ? ((solarNetMonthlySavings * 12 * 100) / solarIntegrationCost).toFixed(1)
      : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="naruvi-report mx-auto max-w-6xl px-4 pb-12"
    >
      <div className="rounded-[28px] bg-white p-6 shadow-lg md:p-10">
        <section className="mb-10">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Updated {LAST_UPDATED}
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Naruvi Water Management Report
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
            This refresh incorporates the latest owner input: solar capex should
            stay below ₹9 lakh after subsidy, owner sentiment still strongly
            favors retaining the indoor RO supply, and the current NOWA
            contemplation is a separate outdoor utility-water line rather than
            hidden indoor plumbing changes.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {snapshotItems.map((item) => (
              <SummaryCard key={item.eyebrow} {...item} />
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-3xl border-2 border-cyan-300 bg-cyan-50 p-6 shadow-sm">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-800">
              Immediate Priority
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-cyan-950">
              Rainwater harvesting should be treated as the low-hanging fruit
              and implemented ASAP
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-800">
              Owner observation over the last four years is that both the South
              West and North East monsoons have largely been a flop show at the
              site. That makes it even more important to capture every bit of
              rainfall available and use it to recharge the water table instead
              of letting runoff escape.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-800">
              This page now treats rainwater harvesting as a separate urgent
              workstream, not a side note behind solar or RO optimization.
              Water-table recharge is the cleanest near-term resilience move
              available to the community.
            </p>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-900">
                Latest Owner Update On Record
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-950">
                Update date: {COMMUNITY_UPDATE_DATE}. Latest owner input says
                solar should come in below ₹9,00,000 after TNPDCL gives back
                the subsidy, strong owner opinion still favors retaining the
                RO-fed villa network, and the current NOWA office is
                contemplating a parallel outdoor utility-water line plus a TDS
                reset to about 70.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {updateTrackers.map((item) => (
              <InsightCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900">
            What Changed In This Refresh
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {refreshNotes.map((item) => (
              <InsightCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900">
            Latest Evidence Register
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
            The page now distinguishes between local Naruvi-specific evidence,
            public benchmark guidance, and unresolved items that still need
            vendor confirmation.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {sourceRegister.map((item) => (
              <div
                key={item.title}
                className="naruvi-light-surface naruvi-light-card rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {item.date}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900">
            Two Different Billing Lenses
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="naruvi-light-surface naruvi-light-card rounded-2xl border border-sky-200 bg-sky-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">
                Latest Single-Villa Bill In The Repo
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-800">
                Bill date: {VILLA_SAMPLE_BILL.billDate}. Billing period:{' '}
                {VILLA_SAMPLE_BILL.billPeriod}. Tariff: {VILLA_SAMPLE_BILL.tariff}
                . Energy consumed: {formatNumber(VILLA_SAMPLE_BILL.energyKwh)}{' '}
                kWh. Payable amount: {formatCurrency(VILLA_SAMPLE_BILL.payableRs)}.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-800">
                This is a domestic villa bill with subsidy effects, so it cannot
                be used directly to validate the community common-services
                estimate below.
              </p>
            </div>

            <div className="naruvi-light-surface naruvi-light-card rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">
                Shared Common-Services Model
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-800">
                The archived community calculation uses a {formatCurrency(9)}
                /kWh energy assumption and a fixed monthly charge of{' '}
                {formatCurrency(MONTHLY_FIXED_CHARGE)} to model the RO plant,
                borewell pump, and common lighting together.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-800">
                Result: {formatCurrency(MONTHLY_TNPDCL_COST)}/month modeled
                TNPDCL cost, with the RO pump alone accounting for about{' '}
                {RO_PUMP_SHARE_PERCENT}% of variable energy spend and water
                production loads together accounting for about{' '}
                {WATER_PRODUCTION_SHARE_PERCENT}%.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-800">
                This page now treats the fixed-charge reduction as an editable
                assumption in the calculator, not as the main update. The main
                confirmed refresh is the lower solar capex and the revised water
                design direction from owners and NOWA.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-800">
                There is no BESS or battery-energy-storage-system scope in this
                Naruvi solar plan. The current economics shown here are for a
                direct grid-connected solar setup.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900">
            Technical Diagrams
          </h2>
          <div className="mt-5 grid gap-6">
            <WaterArchitectureDiagram />
            <EnergyBillingDiagram />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900">
            Water Balance And Benchmark Notes
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="naruvi-light-surface naruvi-light-card rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">
                Current Modeled Water Balance
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-800">
                <li>
                  RO permeate delivered to villas: about{' '}
                  {formatNumber(DAILY_RO_PERMEATE_L)} L/day.
                </li>
                <li>
                  At 50% recovery, raw-water input is about{' '}
                  {formatNumber(HALF_RECOVERY_RAW_INPUT_L)} L/day.
                </li>
                <li>
                  If reject water is closer to 65%, raw-water input can rise to
                  about {formatNumber(HIGH_REJECT_RAW_INPUT_L)} L/day, with
                  reject volume around {formatNumber(HIGH_REJECT_VOLUME_L)}{' '}
                  L/day.
                </li>
                <li>
                  The latest owner update explicitly flags this high reject
                  water loss and drain discharge as one of the main reasons to
                  move outdoor demand away from the RO loop.
                </li>
              </ul>
            </div>

            <div className="naruvi-light-surface naruvi-light-card rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">
                WHO Domestic Water Guidance
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-800">
                <li>Absolute drinking minimum: about 5.3 L/person/day.</li>
                <li>Basic domestic service: about 20 L/person/day.</li>
                <li>Higher hygiene level: about 50 L/person/day.</li>
                <li>Optimal domestic service: above 100 L/person/day.</li>
              </ul>
              <p className="mt-4 text-sm leading-6 text-slate-800">
                Current modeled use intensity at Naruvi is about{' '}
                {formatNumber(DAILY_PER_CAPITA_L)} L/person/day, so the
                immediate target is not scarcity relief. It is avoiding
                unnecessary RO treatment for outdoor uses.
              </p>
            </div>

            <div className="naruvi-light-surface naruvi-light-card rounded-2xl border border-violet-200 bg-violet-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">
                Practical Leverage
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-800">
                <li>
                  Every {formatNumber(SHIFTED_OUTPUT_EXAMPLE_L)} L/day removed
                  from RO demand saves around{' '}
                  {formatNumber(RAW_WATER_SAVED_AT_50_RECOVERY_L)} L/day of
                  raw-water extraction at 50% recovery.
                </li>
                <li>
                  Under a harsher 35% recovery case, the same shift saves about{' '}
                  {formatNumber(RAW_WATER_SAVED_AT_35_RECOVERY_L)} L/day.
                </li>
                <li>
                  That is why a dedicated outdoor utility line is the cleanest
                  first move: it attacks waste without opening walls or floors
                  inside occupied villas.
                </li>
                <li>
                  The owner note also states that for the volume shifted to the
                  parallel line, roughly twice that quantity can be saved from
                  being pumped out of the borewells.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Solar Power Integration With TNPDCL: ROI Calculator
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-800">
            These defaults reflect the latest owner note on this page:
            capex below {formatCurrency(900000)} after TNPDCL gives back the
            subsidy, payback of about 25 months, and no battery-storage layer in
            the current solar scope. The older LM51 fixed-charge reduction
            remains an optional assumption. Treat this as a planning tool until
            future bills confirm the realized savings.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-900">
              One-time solar integration cost after subsidy (₹)
              <input
                type="number"
                min="0"
                className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-slate-900"
                value={solarIntegrationCost}
                onChange={(event) =>
                  setSolarIntegrationCost(parseInputNumber(event.target.value))
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-900">
              Monthly solar consumption-offset savings (₹)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-slate-900"
                value={monthlySolarOffsetSavings}
                onChange={(event) =>
                  setMonthlySolarOffsetSavings(
                    parseInputNumber(event.target.value)
                  )
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-900">
              Monthly solar export credit (₹)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-slate-900"
                value={monthlySolarExportCredit}
                onChange={(event) =>
                  setMonthlySolarExportCredit(
                    parseInputNumber(event.target.value)
                  )
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-900">
              Monthly operation and maintenance cost (₹)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-slate-900"
                value={monthlySolarMaintenanceCost}
                onChange={(event) =>
                  setMonthlySolarMaintenanceCost(
                    parseInputNumber(event.target.value)
                  )
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-900">
              LM51 current sanctioned load (kW)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-slate-900"
                value={calculatorCurrentLoadKw}
                onChange={(event) =>
                  setCalculatorCurrentLoadKw(parseInputNumber(event.target.value))
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-900">
              LM51 revised sanctioned load (kW)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-slate-900"
                value={calculatorRevisedLoadKw}
                onChange={(event) =>
                  setCalculatorRevisedLoadKw(parseInputNumber(event.target.value))
                }
              />
            </label>
            <label className="text-sm font-medium text-slate-900 md:col-span-2">
              TNPDCL fixed charge (₹ per kW per 2 months)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-slate-900"
                value={calculatorFixedChargeRate}
                onChange={(event) =>
                  setCalculatorFixedChargeRate(
                    parseInputNumber(event.target.value)
                  )
                }
              />
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <SummaryCard
              eyebrow="Fixed-charge savings"
              value={`${formatCurrency(calculatorFixedChargeSavings)}/month`}
              detail="Derived from the LM51 sanctioned-load delta and the tariff assumption above."
              tone="amber"
            />
            <SummaryCard
              eyebrow="Net monthly savings"
              value={formatCurrency(solarNetMonthlySavings)}
              detail="Offset savings + export credit + fixed-charge savings - O&M."
              tone="emerald"
            />
            <SummaryCard
              eyebrow="Estimated payback"
              value={
                solarPaybackMonths
                  ? `${solarPaybackMonths} months`
                  : 'No payback'
              }
              detail={
                solarPaybackMonths
                  ? `${solarPaybackYears} years at the current assumptions.`
                  : 'Savings must exceed costs to produce a payback.'
              }
              tone="sky"
            />
            <SummaryCard
              eyebrow="Annual ROI"
              value={`${solarAnnualRoiPercent}%`}
              detail="Illustrative annualized return on the current capex assumption."
              tone="slate"
            />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-900">
            Immediate Next Actions
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="naruvi-light-surface naruvi-light-card rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">
                What Should Happen Next
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-800">
                {nextActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                <li>
                  Start rainwater harvesting as an urgent parallel workstream so
                  every usable spell of rain is captured for groundwater
                  recharge.
                </li>
                <li>
                  Document the final operating note: retain indoor RO use, raise
                  supplied TDS to around 70, and reserve the new outlet for
                  vehicle washing, floor washing, garden watering, and related
                  outdoor cleaning.
                </li>
              </ul>
            </div>

            <div className="naruvi-light-surface naruvi-light-card rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">
                What Must Be Measured
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-800">
                {monitoringItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-2xl font-semibold text-red-900">
            Caveats
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-red-950">
            <p>
              This is still an owner-facing engineering note, not a stamped
              plumbing or electrical design package. The water architecture is a
              practical recommendation based on the site constraint that hidden
              indoor pipelines are hard to rework safely.
            </p>
            <p>
              Community-specific claims such as post-subsidy solar capex,
              planned tariff migration, and vendor delay status should be
              checked again against live quotes, applications, and future bills
              before anyone treats them as closed facts.
            </p>
            <p>
              Public benchmark used on this page: World Health Organization,
              <a
                href="https://iris.who.int/handle/10665/338044"
                className="ml-1 text-red-900 underline decoration-red-300 underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Domestic water quantity, service level and health, 2nd ed.
              </a>
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default NaruviWaterIssues;
