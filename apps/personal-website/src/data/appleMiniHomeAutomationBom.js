const csvColumns = [
  "scope",
  "category",
  "item",
  "qty",
  "approx_unit_cost_inr",
  "approx_line_cost_inr",
  "function",
  "price_basis",
  "notes",
];

const escapeCsvCell = (value) => {
  const normalized = value == null ? "" : String(value);
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
};

const buildCsvDownloadHref = (rows) => {
  const csvBody = [
    csvColumns.join(","),
    ...rows.map((row) =>
      csvColumns
        .map((column) => {
          const value = row[column];
          return escapeCsvCell(value == null ? "" : value);
        })
        .join(","),
    ),
  ].join("\n");

  return `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${csvBody}`)}`;
};

const rows = [
  {
    scope: "Core",
    category: "Controller",
    item: "Mac mini (M4, base configuration)",
    qty: 1,
    approx_unit_cost_inr: 59900,
    approx_line_cost_inr: 59900,
    function:
      "Runs kumclaw, Home Assistant, automations, dashboards, and the server-side OpenAI bridge.",
    price_basis: "Apple India starting price",
    notes: "Existing monitor, keyboard, and phone or tablet client are assumed.",
  },
  {
    scope: "Core",
    category: "Network",
    item: "Wi-Fi 6 router or mesh upgrade",
    qty: 1,
    approx_unit_cost_inr: 6500,
    approx_line_cost_inr: 6500,
    function:
      "Provides stable whole-home Wi-Fi coverage for relays, sensors, dashboards, and Mac mini API traffic.",
    price_basis: "Representative India retail price rounded",
    notes:
      "Include this only if the current router does not give dependable 2.4 GHz coverage in every room.",
  },
  {
    scope: "Core",
    category: "Lighting",
    item: "Wi-Fi in-wall relay module",
    qty: 6,
    approx_unit_cost_inr: 2000,
    approx_line_cost_inr: 12000,
    function:
      "Controls six switched lighting circuits while preserving manual wall-switch behavior.",
    price_basis: "Representative India market price rounded",
    notes:
      "This reference setup assumes six light circuits. Quantity scales directly with room count.",
  },
  {
    scope: "Core",
    category: "Sensors",
    item: "Wi-Fi motion sensor",
    qty: 2,
    approx_unit_cost_inr: 2200,
    approx_line_cost_inr: 4400,
    function:
      "Feeds occupancy and motion events into Home Assistant for lights, hallway scenes, and night automations.",
    price_basis: "Representative India market price rounded",
    notes:
      "Two motion zones assumed: entry and common area. Prefer USB-powered or mains-powered Wi-Fi models where practical.",
  },
  {
    scope: "Core",
    category: "Sensors",
    item: "Wi-Fi temperature and humidity sensor",
    qty: 3,
    approx_unit_cost_inr: 1600,
    approx_line_cost_inr: 4800,
    function:
      "Tracks room climate for AC logic, comfort tuning, and room-by-room automation rules.",
    price_basis: "Representative India market price rounded",
    notes:
      "Three climate zones assumed for bedrooms and living area. Strong Wi-Fi coverage matters more here than battery life.",
  },
  {
    scope: "Core",
    category: "Sensors",
    item: "Wi-Fi door and window sensor",
    qty: 2,
    approx_unit_cost_inr: 1700,
    approx_line_cost_inr: 3400,
    function:
      "Detects door or window state so AC, security, and arrival routines can react correctly.",
    price_basis: "Representative India market price rounded",
    notes:
      "Two monitored openings assumed in the baseline. Choose local-API or well-supported Home Assistant integrations.",
  },
  {
    scope: "Core",
    category: "AC control",
    item: "SwitchBot Hub Mini IR bridge",
    qty: 2,
    approx_unit_cost_inr: 3500,
    approx_line_cost_inr: 7000,
    function:
      "Sends IR commands to two split AC units instead of switching compressor power with a generic relay.",
    price_basis: "India dealer price rounded",
    notes: "Two AC rooms assumed. Add one IR hub per additional independent AC zone.",
  },
  {
    scope: "Optional",
    category: "Fan path",
    item: "Wi-Fi smart BLDC fan replacement path",
    qty: 3,
    approx_unit_cost_inr: 5500,
    approx_line_cost_inr: 16500,
    function:
      "Budget for replacing three fan-room endpoints when safe retrofit control is unclear on existing BLDC fans.",
    price_basis: "Representative India retail price rounded",
    notes:
      "Optional line item. Use only if current fans do not expose a safe Wi-Fi or vendor-supported automation path.",
  },
  {
    scope: "Software",
    category: "Automation",
    item: "Home Assistant",
    qty: 1,
    approx_unit_cost_inr: 0,
    approx_line_cost_inr: 0,
    function:
      "Provides local device integrations, scenes, schedules, dashboards, and automation logic.",
    price_basis: "Open-source software",
    notes: "Runs on the Mac mini in the reference design.",
  },
  {
    scope: "Software",
    category: "AI orchestration",
    item: "kumclaw",
    qty: 1,
    approx_unit_cost_inr: 0,
    approx_line_cost_inr: 0,
    function:
      "Routes natural-language tool calls, keeps guardrails local, and brokers actions into Home Assistant.",
    price_basis: "Self-hosted on existing hardware",
    notes: "No separate hardware budgeted beyond the Mac mini.",
  },
  {
    scope: "Ops",
    category: "Voice usage",
    item: "OpenAI voice API usage",
    qty: 1,
    approx_unit_cost_inr: null,
    approx_line_cost_inr: null,
    function:
      "Handles speech input, model reasoning, tool calling, and spoken confirmations.",
    price_basis: "Usage-based operating cost",
    notes: "Variable monthly spend. Excluded from the capital subtotal.",
  },
];

const coreHardwareSubtotalInr = rows
  .filter((row) => row.scope === "Core")
  .reduce((sum, row) => sum + (row.approx_line_cost_inr || 0), 0);

const expandedHardwareSubtotalInr = rows
  .filter((row) => row.scope === "Core" || row.scope === "Optional")
  .reduce((sum, row) => sum + (row.approx_line_cost_inr || 0), 0);

export const appleMiniHomeAutomationBom = {
  pricingCheckedAt: "March 24, 2026",
  referenceSetup:
    "Reference setup: a 2-bedroom home with strong room-to-room Wi-Fi coverage, 6 light circuits, 3 fan rooms, and 2 AC rooms.",
  assumptions: [
    "The Mac mini hosts both kumclaw and Home Assistant, while an existing phone or tablet is reused as the microphone and dashboard client.",
    "This version assumes Wi-Fi-only relays and sensors, so 2.4 GHz coverage must be stable in every room before device rollout.",
    "Existing backup power can be reused if available, so no new backup-power hardware is budgeted here.",
    "Unit costs are planning numbers for India and are rounded to absorb small GST, shipping, and seller swings.",
    "Electrician labor, switchboard rework, MCB or RCCB upgrades, and extra wiring materials are not included in the subtotal.",
  ],
  coreHardwareSubtotalInr,
  expandedHardwareSubtotalInr,
  csvDownloadName: "apple-mini-home-automation-bom.csv",
  csvDownloadHref: buildCsvDownloadHref(rows),
  rows,
};
