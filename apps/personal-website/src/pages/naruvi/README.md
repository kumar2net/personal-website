# Naruvi Section

Owner-facing report for the `/naruvi` route.

## Current Scope

- Date-stamped status snapshot for the Naruvi water-management discussion
- Source register separating local figures, public benchmarks, and pending confirmations
- Editable solar ROI calculator
- Two embedded technical diagrams:
  - Proposed parallel utility-water architecture
  - Solar and TNPDCL billing logic

## Current Design Direction

The active recommendation is now the parallel utility-water approach:

- Keep the indoor RO-fed villa network unchanged
- Add one pressurized outdoor utility-water outlet per villa
- Shift outdoor demand away from the RO plant first
- Confirm savings only after post-change TNPDCL bills and vendor scope are available

The older single-line mixing concept is historical background, not the preferred
design on the page anymore.

## Files

- `NaruviWaterIssues.jsx` - main route component, calculations, and diagrams
- `NaruviWaterIssues.css` - light-surface and SVG typography styling
- `index.js` - re-export for route loading
