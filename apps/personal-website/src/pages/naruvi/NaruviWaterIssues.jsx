import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './NaruviWaterIssues.css';

const MONTHLY_TNPDCL_COST = 49757;
const LM51_PREVIOUS_LOAD_KW = 15;
const LM51_REVISED_LOAD_KW = 2;
const TNPDCL_FIXED_CHARGE_PER_KW_PER_2_MONTHS = 214;

const MONTHLY_FIXED_CHARGE_SAVINGS =
  ((LM51_PREVIOUS_LOAD_KW - LM51_REVISED_LOAD_KW) *
    TNPDCL_FIXED_CHARGE_PER_KW_PER_2_MONTHS) /
  2;

const parseInputNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

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
      transition={{ duration: 0.5 }}
      className="naruvi-report max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Naruvi Gated Community Water Management Report
        </h1>

        {/* Positive Update */}
        <div className="naruvi-light-surface bg-green-50 border-l-4 border-green-400 p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-3">
            ✅ Good News Update
          </h2>
          <p className="text-emerald-950 font-medium">
            Update date: March 6, 2026
          </p>
          <p className="text-slate-800 mt-2">
            Primary implemented action: Naruvi Owners Welfare Association
            (NOWA) has initiated solar power evacuation alignment with Tamil
            Nadu Power Distribution Corporation Limited (TNPDCL), formerly
            Tamil Nadu Generation and Distribution Corporation (TANGEDCO).
          </p>
          <p className="text-slate-800 mt-2">
            Revised solar economics: the total solar cost after subsidy is now
            expected to remain below ₹9,00,000. With the current assumptions on
            this page, that brings estimated payback down to about 25 months,
            or just over 2 years.
          </p>
          <p className="text-slate-800 mt-2">
            NOWA has handed over official intimation to shift sanctioned loads
            from LM51 to LA1D, and an online application has been submitted to
            reduce the LM51 sanctioned load from 15 kilowatts (kW) to 2 kW.
          </p>
          <p className="text-slate-800 mt-2">
            Expected impact: lower fixed electricity charges should start
            reflecting from the next bill cycle.
          </p>
          <p className="text-slate-800 mt-2">
            Water-phase refinement: based on owner feedback and the single-line
            underground plumbing constraint, NOWA is now pursuing a separate
            pressurized utility-water line for outdoor uses while retaining the
            existing RO line inside villas.
          </p>
          <p className="text-slate-800 mt-2">
            Execution status: NOWA wanted to complete the parallel line before
            March 2026, but work is delayed because vendors experienced in
            pressurized supply systems are not yet readily available. Follow-up
            is in progress.
          </p>
        </div>

        {/* Solar ROI Calculator */}
        <section className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8 not-prose">
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#78350f' }}>
            Solar Power Integration with TNPDCL: ROI Calculator
          </h2>
          <p style={{ color: '#92400e' }}>
            Editable assumptions for payback from solar consumption-offset
            savings, export credit, and sanctioned-load fixed-charge reduction.
            The default values reflect the latest update: post-subsidy capex
            below ₹9 lakh and payback of roughly 25 months.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <label className="text-sm font-medium" style={{ color: '#78350f' }}>
              One-time solar integration cost after subsidy (₹)
              <input
                type="number"
                min="0"
                className="mt-1 w-full border border-amber-300 rounded px-3 py-2 bg-white text-slate-900"
                value={solarIntegrationCost}
                onChange={(event) =>
                  setSolarIntegrationCost(parseInputNumber(event.target.value))
                }
              />
            </label>
            <label className="text-sm font-medium" style={{ color: '#78350f' }}>
              Monthly solar consumption-offset savings (₹)
              <input
                type="number"
                className="mt-1 w-full border border-amber-300 rounded px-3 py-2 bg-white text-slate-900"
                value={monthlySolarOffsetSavings}
                onChange={(event) =>
                  setMonthlySolarOffsetSavings(
                    parseInputNumber(event.target.value)
                  )
                }
              />
            </label>
            <label className="text-sm font-medium" style={{ color: '#78350f' }}>
              Monthly solar evacuation/export credit (₹)
              <input
                type="number"
                className="mt-1 w-full border border-amber-300 rounded px-3 py-2 bg-white text-slate-900"
                value={monthlySolarExportCredit}
                onChange={(event) =>
                  setMonthlySolarExportCredit(
                    parseInputNumber(event.target.value)
                  )
                }
              />
            </label>
            <label className="text-sm font-medium" style={{ color: '#78350f' }}>
              Monthly operation and maintenance cost (₹)
              <input
                type="number"
                className="mt-1 w-full border border-amber-300 rounded px-3 py-2 bg-white text-slate-900"
                value={monthlySolarMaintenanceCost}
                onChange={(event) =>
                  setMonthlySolarMaintenanceCost(
                    parseInputNumber(event.target.value)
                  )
                }
              />
            </label>
            <label className="text-sm font-medium" style={{ color: '#78350f' }}>
              LM51 current sanctioned load (kW)
              <input
                type="number"
                className="mt-1 w-full border border-amber-300 rounded px-3 py-2 bg-white text-slate-900"
                value={calculatorCurrentLoadKw}
                onChange={(event) =>
                  setCalculatorCurrentLoadKw(parseInputNumber(event.target.value))
                }
              />
            </label>
            <label className="text-sm font-medium" style={{ color: '#78350f' }}>
              LM51 revised sanctioned load (kW)
              <input
                type="number"
                className="mt-1 w-full border border-amber-300 rounded px-3 py-2 bg-white text-slate-900"
                value={calculatorRevisedLoadKw}
                onChange={(event) =>
                  setCalculatorRevisedLoadKw(parseInputNumber(event.target.value))
                }
              />
            </label>
            <label className="text-sm font-medium md:col-span-2" style={{ color: '#78350f' }}>
              TNPDCL fixed charge (₹ per kW per 2 months)
              <input
                type="number"
                className="mt-1 w-full border border-amber-300 rounded px-3 py-2 bg-white text-slate-900"
                value={calculatorFixedChargeRate}
                onChange={(event) =>
                  setCalculatorFixedChargeRate(
                    parseInputNumber(event.target.value)
                  )
                }
              />
            </label>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-5">
            <div className="naruvi-light-surface naruvi-light-card bg-white border border-amber-200 rounded p-4">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#92400e' }}>
                Fixed-charge savings
              </p>
              <p className="text-lg font-semibold" style={{ color: '#78350f' }}>
                ₹{Math.round(calculatorFixedChargeSavings).toLocaleString('en-IN')}/month
              </p>
            </div>
            <div className="naruvi-light-surface naruvi-light-card bg-white border border-amber-200 rounded p-4">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#92400e' }}>
                Net monthly savings
              </p>
              <p className="text-lg font-semibold" style={{ color: '#78350f' }}>
                ₹{Math.round(solarNetMonthlySavings).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="naruvi-light-surface naruvi-light-card bg-white border border-amber-200 rounded p-4">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#92400e' }}>
                Estimated payback
              </p>
              <p className="text-lg font-semibold" style={{ color: '#78350f' }}>
                {solarPaybackMonths
                  ? `${solarPaybackMonths} months (${solarPaybackYears} years)`
                  : 'No payback (savings <= 0)'}
              </p>
            </div>
            <div className="naruvi-light-surface naruvi-light-card bg-white border border-amber-200 rounded p-4">
              <p className="text-xs uppercase tracking-wide" style={{ color: '#92400e' }}>
                Annual ROI
              </p>
              <p className="text-lg font-semibold" style={{ color: '#78350f' }}>
                {solarAnnualRoiPercent}%
              </p>
            </div>
          </div>

          <p className="text-xs mt-3" style={{ color: '#78350f' }}>
            Net monthly savings = solar consumption-offset savings + export
            credit + LM51 fixed-charge savings - operation and maintenance cost.
          </p>
        </section>

        {/* Community Impact of Update */}
        <section className="bg-emerald-50 border-l-4 border-emerald-400 p-6 mb-8">
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">
            What this means for the community
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Solar Evacuation Milestone
              </h3>
              <p className="text-sm text-gray-700">
                The association has started with solar-power evacuation and
                grid-side alignment, which is the first executed step in the
                current cost-optimization roadmap.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Lower Fixed Charges
              </h3>
              <p className="text-sm text-gray-700">
                Reducing LM51 sanctioned load from 15 kW to 2 kW should reduce
                fixed-demand billing burden once the request is processed.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Next Bill Impact
              </h3>
              <p className="text-sm text-gray-700">
                Moving load from LM51 to LA1D and lowering LM51 sanctioned load
                should improve billing predictability, with first benefits
                expected in the next bill cycle.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Faster Solar Payback
              </h3>
              <p className="text-sm text-gray-700">
                With the revised post-subsidy cost below ₹9,00,000, the solar
                phase now appears to break even in about 25 months under the
                current savings assumptions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Revised Water Proposal
              </h3>
              <p className="text-sm text-gray-700">
                The current direction is to retain RO water inside villas,
                increase TDS to around 70, and add one separate outdoor utility
                outlet per villa using a pressurized parallel line.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Execution Delay
              </h3>
              <p className="text-sm text-gray-700">
                NOWA wanted the parallel line completed before March 2026, but
                the work is currently delayed by contractor availability for
                pressurized water-supply systems.
              </p>
            </div>
          </div>
        </section>

        <div className="prose prose-lg max-w-none">
          {/* Executive Summary */}
          <div className="naruvi-light-surface bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              Current Position: Solar Economics Improved, Water Plan Refined
            </h2>
            <p className="text-slate-800">
              Solar integration is under execution and the revised post-subsidy
              payback is now about 25 months. On water, the emerging direction
              is not to rework internal villa plumbing, but to retain RO supply
              inside villas, raise TDS to about 70, and add a separate
              pressurized utility-water outlet for each villa.
            </p>
          </div>

          {/* Current Situation */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Current Water Usage Analysis
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Current Metrics
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Total daily consumption: 29,000 litres</li>
                  <li>• Occupied villas: 35</li>
                  <li>• Assumed residents per villa: 3</li>
                  <li>• Current usage per person: 276 litres/day</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">
                  World Health Organization (WHO) Recommendations
                </h3>
                <ul className="space-y-2 text-green-900">
                  <li>• Absolute minimum: 5.3 L/person/day</li>
                  <li>• Basic domestic needs: 20 L/person/day</li>
                  <li>• Full hygiene needs: 50 L/person/day</li>
                  <li>• Optimal service: 100+ L/person/day</li>
                </ul>
              </div>
            </div>
          </section>

          {/* WHO Guidelines */}
          <section className="mb-8 not-prose">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              World Health Organization Guidelines
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <p className="mb-4" style={{ color: '#0f172a' }}>
                <strong>Single tap access (within 100m):</strong> ~50 litres per
                person per day, meeting higher hygiene needs.
              </p>
              <p style={{ color: '#0f172a' }}>
                <strong>
                  Optimal access (multiple taps, continuous supply):
                </strong>{' '}
                Over 100 litres per person per day, covering all domestic and
                hygiene requirements.
              </p>
            </div>
            <div className="mt-4 text-sm" style={{ color: '#0f172a' }}>
              <p style={{ color: '#0f172a' }}>
                <strong>My realistic opinion:</strong> 150 Litres per person per
                day
              </p>
            </div>
            <div className="mt-4 text-sm" style={{ color: '#1e293b' }}>
              <p style={{ color: '#1e293b' }}>
                Source:{' '}
                <a
                  href="https://iris.who.int/bitstream/handle/10665/338044/9789240015241-eng.pdf"
                  className="text-blue-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WHO Guidelines for Drinking-water Quality
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Latest Inputs from Owners and NOWA
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="naruvi-light-surface bg-sky-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sky-800 mb-2">
                  Strong Support for Retaining RO
                </h3>
                <p className="text-sm text-slate-800">
                  A number of owners, including some previous office bearers,
                  do not want the present concept of 100% RO usage inside the
                  villas to be disturbed because it protects appliances,
                  sanitary fittings, and internal plumbing.
                </p>
              </div>
              <div className="naruvi-light-surface bg-rose-50 p-4 rounded-lg">
                <h3 className="font-semibold text-rose-800 mb-2">
                  Counterarguments Raised by Other Owners
                </h3>
                <p className="text-sm text-slate-800">
                  The main concerns are that very low-TDS RO water around 20 may
                  not be ideal for health and plants, the RO system may reject
                  around 65% of water to the drain, and the plant adds avoidable
                  electricity cost.
                </p>
              </div>
              <div className="naruvi-light-surface bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">
                  Physical Constraint
                </h3>
                <p className="text-sm text-slate-800">
                  Internal villa plumbing is largely underground and designed as
                  a single-source supply network, which significantly limits the
                  freedom to alter the existing water circuit.
                </p>
              </div>
            </div>
          </section>

          {/* Solution */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Updated Proposal: Retain RO Supply + Add Parallel Utility Line
            </h2>

            <div className="naruvi-light-surface bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Current NOWA Direction
              </h3>
              <div className="space-y-2 text-slate-800">
                <p>
                  • <strong>Retain the existing RO line</strong> as the main
                  supply inside villas.
                </p>
                <p>
                  • <strong>Increase supplied TDS to about 70</strong> so the
                  water carries some electrolytes while remaining soft enough
                  for domestic use.
                </p>
                <p>
                  • <strong>Add one independent pressurized parallel line</strong>{' '}
                  carrying borewell plus corporation water directly to the
                  villas.
                </p>
                <p>
                  • <strong>Provide one outlet per villa</strong> on the inside
                  compound wall facing the road, with pressure similar to the
                  present RO line.
                </p>
                <p>
                  • <strong>Use the new outlet primarily for</strong> vehicle
                  washing, floor washing, garden watering, and related outdoor
                  cleaning needs.
                </p>
              </div>
            </div>

            <div className="naruvi-light-surface bg-orange-50 border-l-4 border-orange-400 p-6 mb-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                Why This Revision Makes Sense
              </h3>
              <div className="space-y-2 text-slate-800">
                <p>
                  • <strong>It preserves appliance protection</strong> by not
                  disturbing the RO-fed internal villa network.
                </p>
                <p>
                  • <strong>It avoids major internal plumbing changes</strong>{' '}
                  in villas that were originally built for a single-source
                  underground supply.
                </p>
                <p>
                  • <strong>It still reduces RO dependency</strong> because
                  outdoor and gardening uses can shift away from RO water.
                </p>
                <p>
                  • <strong>It lowers waste and energy use</strong> by reducing
                  both raw-water pumping and RO plant operating time.
                </p>
              </div>
            </div>

            {/* Energy Consumption Analysis */}
            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">
                Energy Consumption Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="naruvi-light-surface naruvi-light-card min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-700 border-b">Component</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-700 border-b">Power (kW)</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-700 border-b">Hours/Day</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-700 border-b">Energy/Day (kilowatt-hours, kWh)</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-700 border-b">Monthly Energy Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">Borewell Pump</td>
                      <td className="px-4 py-3 text-sm text-gray-600">4</td>
                      <td className="px-4 py-3 text-sm text-gray-600">10</td>
                      <td className="px-4 py-3 text-sm text-gray-600">37.3</td>
                      <td className="px-4 py-3 text-sm font-medium text-purple-800">9,567</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">RO High-Pressure Pump</td>
                      <td className="px-4 py-3 text-sm text-gray-600">10</td>
                      <td className="px-4 py-3 text-sm text-gray-600">10</td>
                      <td className="px-4 py-3 text-sm text-gray-600">100</td>
                      <td className="px-4 py-3 text-sm font-medium text-purple-800">25,650</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">Common Area Lighting</td>
                      <td className="px-4 py-3 text-sm text-gray-600">4</td>
                      <td className="px-4 py-3 text-sm text-gray-600">10</td>
                      <td className="px-4 py-3 text-sm text-gray-600">40</td>
                      <td className="px-4 py-3 text-sm font-medium text-purple-800">10,260</td>
                    </tr>
                    <tr className="naruvi-light-surface hover:bg-gray-50 bg-purple-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">Total</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">-</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">-</td>
                      <td className="px-4 py-3 text-sm font-semibold text-purple-900">177.3</td>
                      <td className="px-4 py-3 text-sm font-semibold text-purple-900">45,477</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="naruvi-light-surface naruvi-light-card bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-purple-800 mb-2">Key Parameters</h4>
                  <ul className="space-y-1 text-sm text-purple-900">
                    <li>• Electricity Tariff: ₹9/kWh (TNPDCL)</li>
                    <li>• Fixed Charge: ₹214/kW per 2 months</li>
                    <li>• Fixed cost TNPDCL: ₹4,280</li>
                    <li>• Total estimate TNPDCL cost: ₹49,757</li>
                    <li>• RO Plant Daily Supply: about 29,000 litres to villas</li>
                    <li>• Owner feedback indicates reject water may be around 65%</li>
                    <li>• Pump Runtime: 10 hours actual</li>
                    <li>• Lighting Runtime: 10 hours</li>
                  </ul>
                </div>
                <div className="naruvi-light-surface naruvi-light-card bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-purple-800 mb-2">RO Efficiency Calculation</h4>
                  <p className="text-sm text-purple-900 mb-2">
                    At 50% recovery, producing <strong>29,000 litres</strong> of
                    RO water requires about <strong>58,000 litres</strong> of
                    input water per day. If reject water is closer to 65%, the
                    input requirement can rise to about{' '}
                    <strong>82,900 litres</strong>.
                  </p>
                  <p className="text-sm text-purple-900">
                    <strong>Operational implication:</strong> shifting outdoor
                    demand to the parallel line cuts borewell pumping, RO
                    runtime, reject-water generation, and electricity use.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="naruvi-light-surface bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Existing RO Supply Inside Villas
                </h3>
                <ul className="space-y-1 text-blue-900">
                  <li>• Cooking</li>
                  <li>• Bathing</li>
                  <li>• General washing and fixture protection</li>
                  <li>• Drinking</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  New Parallel Utility Outlet
                </h3>
                <ul className="space-y-1 text-green-900">
                  <li>• Vehicle washing</li>
                  <li>• Floor washing</li>
                  <li>• Garden watering</li>
                  <li>• Outdoor cleaning and related utility use</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4 not-prose">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1. Source
                </h3>
                <p className="text-sm text-gray-700">
                  Borewell and corporation water continue to be available for a
                  separate utility service without replacing the internal RO
                  distribution line.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  2. Delivery
                </h3>
                <p className="text-sm text-gray-700">
                  A pressurized parallel line runs independently and provides one
                  outlet per villa on the inside compound wall facing the road.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  3. Benefit
                </h3>
                <p className="text-sm text-gray-700">
                  RO demand reduces without disturbing existing villa plumbing,
                  lowering water wastage and energy consumption in the process.
                </p>
              </div>
            </div>
          </section>

          {/* Implementation Strategy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Implementation Strategy
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">
                Independent Parallel Line Without Altering Internal Villa Plumbing
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Engineering Approach:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Keep the existing RO network inside villas unchanged</li>
                    <li>Lay a separate pressurized line along the common utility route</li>
                    <li>Provide one outdoor outlet per villa at the compound wall</li>
                    <li>Match outlet pressure broadly with the current RO supply pressure</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Operating Logic:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Use RO water inside villas as the protected domestic supply</li>
                    <li>Use the new utility outlet for outdoor and heavy washing needs</li>
                    <li>Raise TDS to around 70 and monitor it as part of routine plant operations</li>
                    <li>Label the new outlet clearly so use-cases remain unambiguous</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Execution Status:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>NOWA intended to complete this phase before March 2026</li>
                    <li>The work is delayed due to the availability of pressurized-supply specialists</li>
                    <li>Association follow-up is continuing to implement it as early as possible</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Analysis */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Operational and Cost Impact
            </h2>
            
            {/* TNPDCL Energy Cost */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Monthly TNPDCL Energy Cost
              </h3>
              <p className="text-2xl font-bold text-green-700 mb-2">
                ₹49,757
              </p>
              <div className="text-sm text-green-900 space-y-1">
                <p>
                  • Based on energy consumption analysis from NaruviWatercalc.csv
                </p>
                <p>• Includes monthly energy costs (₹45,477) + fixed costs (₹4,280)</p>
                <p>
                  • Current operational cost for existing system
                </p>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-6 not-prose">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#78350f' }}>
                Revised Solar Economics
              </h3>
              <p style={{ color: '#0f172a' }}>
                Using the latest assumption of post-subsidy solar cost below
                <strong> ₹9,00,000</strong>, the current calculator defaults
                produce an estimated payback of <strong>about {solarPaybackMonths} months</strong>{' '}
                ({solarPaybackYears} years). This is materially better than the
                earlier estimate and strengthens the case for the solar phase
                already under execution.
              </p>
            </div>

            <div className="mt-6 bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-lg not-prose">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#1e1b4b' }}>
                Expected Benefit of the Parallel Water Line
              </h3>
              <div className="space-y-2" style={{ color: '#0f172a' }}>
                <p>
                  • The new line should substantially reduce the volume of water
                  that has to pass through the RO plant for outdoor and utility
                  uses.
                </p>
                <p>
                  • NOWA&apos;s current working assumption is that for the volume
                  supplied through the parallel line, roughly twice that volume
                  can be saved from being pumped out of the borewells because it
                  no longer enters the RO cycle.
                </p>
                <p>
                  • Lower RO demand should reduce both borewell pumping time and
                  RO plant running time, which in turn lowers electricity cost.
                </p>
                <p>
                  • Final capex for the revised parallel-line design should be
                  confirmed after quotes from vendors who handle pressurized
                  water-supply systems.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Scope to Be Finalized Through Vendor Quotes
              </h3>
              <div className="text-sm text-blue-900 space-y-1">
                <p>• Parallel pressurized line routing across the community</p>
                <p>• One standardized outdoor outlet per villa</p>
                <p>• Pressure balancing, isolation valves, and controls</p>
                <p>• TDS-setting and monitoring protocol for the retained RO supply</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p className="font-bold">
                Note: TNPDCL costs – <span className="font-extrabold">₹49,757</span>{' '}
                are based on energy consumption analysis and may vary based on actual usage patterns. RO (Reverse
                Osmosis) plant operational costs (power, membrane replacement)
                are additional.
              </p>
            </div>
          </section>

          {/* Recommendations */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recommendations
            </h2>
            <div className="space-y-4">
              <div className="naruvi-light-surface bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Immediate Actions
                </h3>
                <ul className="list-disc list-inside text-slate-800 space-y-1">
                  <li>Close quotes from vendors experienced in pressurized supply systems</li>
                  <li>Freeze the standard location and hardware specification for one outlet per villa</li>
                  <li>Publish the operating note for RO line versus utility line usage</li>
                </ul>
              </div>
              <div className="naruvi-light-surface bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-900 mb-2">
                  Implementation Considerations
                </h3>
                <ul className="list-disc list-inside text-slate-800 space-y-1">
                  <li>Do not tamper with internal villa plumbing unless a later expert study supports it</li>
                  <li>Raise TDS only with a defined monitoring band and periodic reporting</li>
                  <li>Track pre/post metrics: RO runtime, borewell pumping hours, and electricity bills</li>
                </ul>
              </div>
              <div className="naruvi-light-surface bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold text-emerald-900 mb-2">
                  Communication to Owners
                </h3>
                <ul className="list-disc list-inside text-slate-800 space-y-1">
                  <li>Explain that the RO-protection objective inside villas is being retained</li>
                  <li>Show that outdoor uses are the first target for reducing RO dependence</li>
                  <li>Share timeline updates transparently because vendor availability is the current bottleneck</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Summary
            </h2>
            <p className="text-gray-700 mb-4">
              The revised owner-facing recommendation is to keep the present RO
              supply inside villas, modestly raise TDS to about 70, and add one
              separate pressurized borewell plus corporation-water outlet per
              villa for outdoor uses.
            </p>
            <p className="text-gray-700">
              <strong>Why this is the better fit now:</strong> it respects the
              underground single-source plumbing constraint, retains protection
              for appliances and fittings, and still reduces RO loading,
              groundwater extraction, reject-water loss, and electricity use.
            </p>
          </section>

          {/* My 2 Cents */}
          <section className="bg-yellow-50 p-4 rounded-lg mt-6 not-prose">
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#854d0e' }}>
              Postscript (PS):
            </h2>
            <p style={{ color: '#0f172a' }}>
              Reject-water reuse in selected common-area applications and rain
              water harvesting still deserve parallel study. But the most
              practical next step, based on the current owner feedback and site
              constraints, is the separate utility-water line rather than
              internal villa plumbing changes. Thank you.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mt-6 not-prose">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#991b1b' }}>
                  ⚠️ Disclaimer
                </h2>
                <div className="space-y-2" style={{ color: '#0f172a' }}>
                  <p style={{ color: '#0f172a' }}>
                    <strong>Experience Basis:</strong> This analysis is based on
                    my personal experience of facing water management issues
                    during our time living in Chennai.
                  </p>
                  <p style={{ color: '#0f172a' }}>
                    <strong>Artificial Intelligence (AI) Assistance:</strong>{' '}
                    Some structured estimates and summaries were prepared with
                    the help of AI tools.
                  </p>
                  <p style={{ color: '#0f172a' }}>
                    <strong>Expertise Level:</strong> I have limited knowledge
                    in Civil Engineering and Plumbing. This report should be
                    reviewed by qualified professionals before implementation.
                  </p>
                  <p className="text-sm font-medium mt-3" style={{ color: '#b91c1c' }}>
                    Please consult with certified engineers and plumbers for
                    professional assessment and implementation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default NaruviWaterIssues;
