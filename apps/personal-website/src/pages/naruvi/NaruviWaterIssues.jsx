import React from 'react';
import { motion } from 'framer-motion';

const MONTHLY_TNPDCL_COST = 49757;
const LM51_PREVIOUS_LOAD_KW = 15;
const LM51_REVISED_LOAD_KW = 2;
const TNPDCL_FIXED_CHARGE_PER_KW_PER_2_MONTHS = 214;
const INVESTMENT_LOW = 575000;
const INVESTMENT_HIGH = 675000;

const MONTHLY_FIXED_CHARGE_SAVINGS =
  ((LM51_PREVIOUS_LOAD_KW - LM51_REVISED_LOAD_KW) *
    TNPDCL_FIXED_CHARGE_PER_KW_PER_2_MONTHS) /
  2;

const ROI_SCENARIOS = [
  { name: 'Conservative', operationalReduction: 0.2, color: '#ca8a04' },
  { name: 'Balanced', operationalReduction: 0.3, color: '#2563eb' },
  { name: 'Accelerated', operationalReduction: 0.4, color: '#059669' },
].map((scenario) => {
  const variableSavings = MONTHLY_TNPDCL_COST * scenario.operationalReduction;
  const totalMonthlySavings = variableSavings + MONTHLY_FIXED_CHARGE_SAVINGS;
  const lowMonths = Math.ceil(INVESTMENT_LOW / totalMonthlySavings);
  const highMonths = Math.ceil(INVESTMENT_HIGH / totalMonthlySavings);

  return {
    ...scenario,
    variableSavings: Math.round(variableSavings),
    totalMonthlySavings: Math.round(totalMonthlySavings),
    lowMonths,
    highMonths,
    lowYears: (lowMonths / 12).toFixed(1),
    highYears: (highMonths / 12).toFixed(1),
  };
});

const ROI_CHART_MAX_MONTHS = Math.max(
  ...ROI_SCENARIOS.map((scenario) => scenario.highMonths),
  24
);
const ROI_FASTEST_MONTHS = Math.min(
  ...ROI_SCENARIOS.map((scenario) => scenario.lowMonths)
);
const ROI_SLOWEST_MONTHS = Math.max(
  ...ROI_SCENARIOS.map((scenario) => scenario.highMonths)
);
const ROI_AXIS_TICKS = Array.from(
  { length: Math.floor(ROI_CHART_MAX_MONTHS / 12) + 1 },
  (_, index) => index * 12
);

const NaruviWaterIssues = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Naruvi Gated Community Water Management Report
        </h1>

        {/* Positive Update */}
        <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-3">
            ✅ Good News Update
          </h2>
          <p className="text-green-700 font-medium">
            Update date: February 19, 2026
          </p>
          <p className="text-green-700 mt-2">
            Today, Naruvi Owners Welfare Association (NOWA) handed over the
            official intimation to Tamil Nadu Power Distribution Corporation
            Limited (TNPDCL), formerly Tamil Nadu Generation and Distribution
            Corporation (TANGEDCO), to shift sanctioned loads from LM51 to
            LA1D.
            An online application has also been submitted to reduce the LM51
            sanctioned load from 15 kilowatts (kW) to 2 kW to reduce fixed
            charges.
            The benefit is expected to reflect in the next electricity bill.
          </p>
          <p className="text-green-700">
            Borewell 1 is being revived and can now augment our water supply.
            Kudos to the Executive Team for moving this forward.
          </p>
          <p className="text-green-700 mt-2">
            This is a meaningful shift from only relying on RO for all use cases to using
            borewell water for appropriate non-potable needs.
          </p>
        </div>

        {/* Community Impact of Update */}
        <section className="bg-emerald-50 border-l-4 border-emerald-400 p-6 mb-8">
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">
            What this means for the community
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Supply Stability
              </h3>
              <p className="text-sm text-gray-700">
                Additional borewell support should reduce pressure on the RO plant,
                improving day-to-day availability of clean water for households.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Lower Operating Stress
              </h3>
              <p className="text-sm text-gray-700">
                Sharing non-potable demand with borewell/reject-water streams can
                lower overall RO demand, which should reduce waste and energy intensity.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Power Bill Impact
              </h3>
              <p className="text-sm text-gray-700">
                Moving load from LM51 to LA1D and lowering LM51 from 15 kW to 2 kW
                should reduce fixed demand charges and improve operating cost
                predictability. The first full benefit is expected in the next bill cycle.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-emerald-800 mb-2">
                Financial Breathing Room
              </h3>
              <p className="text-sm text-gray-700">
                Better resource balancing can lower recurring costs over time,
                creating room for faster implementation of control, monitoring, and safety upgrades.
              </p>
            </div>
          </div>
        </section>

        <div className="prose prose-lg max-w-none">
          {/* Executive Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              🚨 Pressing Issue: High Reverse Osmosis (RO) Water Consumption
            </h2>
            <p className="text-blue-700">
              Current daily consumption: <strong>29,000 litres</strong> across
              35 occupied villas
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
                <ul className="space-y-2 text-green-600">
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

          {/* Solution */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Proposed Solution: Dual Water System
            </h2>
            
            {/* Technical Context */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 mb-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                Technical Context
              </h3>
              <div className="space-y-2 text-orange-700">
                <p>• <strong>RO Efficiency:</strong> RO systems typically have 50% efficiency - permeate (clean water) is 50% of input, reject water is 50%</p>
                <p>• <strong>Borewell Depth:</strong> Borewells are typically sunk to 300-500 feet depth to access groundwater</p>
                <p>• <strong>Current Issue:</strong> System uses 100% RO water, resulting in significant waste of reject water</p>
              </div>
            </div>

            {/* Energy Consumption Analysis */}
            <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">
                Energy Consumption Analysis
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
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
                      <td className="px-4 py-3 text-sm font-medium text-purple-600">9,567</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">RO High-Pressure Pump</td>
                      <td className="px-4 py-3 text-sm text-gray-600">10</td>
                      <td className="px-4 py-3 text-sm text-gray-600">10</td>
                      <td className="px-4 py-3 text-sm text-gray-600">100</td>
                      <td className="px-4 py-3 text-sm font-medium text-purple-600">25,650</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">Common Area Lighting</td>
                      <td className="px-4 py-3 text-sm text-gray-600">4</td>
                      <td className="px-4 py-3 text-sm text-gray-600">10</td>
                      <td className="px-4 py-3 text-sm text-gray-600">40</td>
                      <td className="px-4 py-3 text-sm font-medium text-purple-600">10,260</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-purple-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">Total</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">-</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">-</td>
                      <td className="px-4 py-3 text-sm font-semibold text-purple-700">177.3</td>
                      <td className="px-4 py-3 text-sm font-semibold text-purple-700">45,477</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-purple-800 mb-2">Key Parameters</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Electricity Tariff: ₹9/kWh (TNPDCL)</li>
                    <li>• Fixed Charge: ₹214/kW per 2 months</li>
                    <li>• Fixed cost TNPDCL: ₹4,280</li>
                    <li>• Total estimate TNPDCL cost: ₹49,757</li>
                    <li>• RO Plant Daily Output: 29,000 litres permeate (58,000 litres input)</li>
                    <li>• Pump Runtime: 10 hours actual</li>
                    <li>• Lighting Runtime: 10 hours</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-purple-800 mb-2">RO Efficiency Calculation</h4>
                  <p className="text-sm text-purple-700 mb-2">
                    With 50% efficiency, we need <strong>58,000 litres</strong> of input water to get <strong>29,000 litres</strong> of permeate per day.
                  </p>
                  <p className="text-sm text-purple-700">
                    <strong>Cost Impact:</strong> Electricity cost for RO Water represents <strong>67%</strong> of total energy consumption.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">
                  Potable Uses (RO Water)
                </h3>
                <ul className="space-y-1 text-blue-600">
                  <li>• Cooking</li>
                  <li>• Bathing</li>
                  <li>• Washing</li>
                  <li>• Drinking</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">
                  Non-Potable Uses (Borewell hardwater)
                </h3>
                <ul className="space-y-1 text-green-600">
                  <li>• Plant watering</li>
                  <li>• Car washing</li>
                  <li>• Outdoor area cleaning</li>
                  <li>• Toilet flushing</li>
                </ul>
              </div>
            </div>

            {/* Solution Diagram */}
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Solution Diagram
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <img
                  loading="lazy"
                  decoding="async"
                  src="/media/naruviSolution1.png"
                  alt="Naruvi Water Solution Diagram"
                  className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                  style={{ maxHeight: '500px' }}
                />
                <p className="text-sm text-gray-600 mt-3">
                  Proposed dual water system implementation for Naruvi Gated
                  Community
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
                Using Existing Single Plumbing Line (With Valves and Controls)
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Reject Water Integration:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Introduce bore water into existing plumbing line</li>
                    <li>Route only to dedicated non-potable points</li>
                    <li>Use manual or automatic mixing valves at each point</li>
                    <li>Install check valves and backflow preventers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Safety Measures:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Install isolating valves for control</li>
                    <li>Clear labeling inside homes</li>
                    <li>User education and periodic supervision</li>
                    <li>Prevent cross-contamination</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cost Analysis */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Cost Analysis
            </h2>
            
            {/* TNPDCL Energy Cost */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Monthly TNPDCL Energy Cost
              </h3>
              <p className="text-2xl font-bold text-green-700 mb-2">
                ₹49,757
              </p>
              <div className="text-sm text-green-600 space-y-1">
                <p>
                  • Based on energy consumption analysis from NaruviWatercalc.csv
                </p>
                <p>• Includes monthly energy costs (₹45,477) + fixed costs (₹4,280)</p>
                <p>
                  • Current operational cost for existing system
                </p>
              </div>
            </div>

            {/* ROI Extrapolation Cost */}
            <div className="mt-6 bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-lg not-prose">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#1e1b4b' }}>
                Return on Investment (ROI) Extrapolation Cost (Expected Break-even)
              </h3>
              <p style={{ color: '#0f172a' }}>
                Baseline monthly TNPDCL cost: <strong>₹49,757</strong>. LM51 fixed-charge reduction estimate
                after load change from 15 kW to 2 kW: <strong>~₹1,391/month</strong>. Bars show projected
                break-even window from lower capex (₹5,75,000) to upper capex (₹6,75,000).
              </p>

              <div className="space-y-4 mt-4">
                {ROI_SCENARIOS.map((scenario) => (
                  <div key={scenario.name}>
                    <div className="flex items-center justify-between text-sm" style={{ color: '#0f172a' }}>
                      <span className="font-semibold">
                        {scenario.name} ({Math.round(scenario.operationalReduction * 100)}% operational savings)
                      </span>
                      <span>
                        {scenario.lowMonths}-{scenario.highMonths} months ({scenario.lowYears}-{scenario.highYears} years)
                      </span>
                    </div>
                    <div className="relative h-4 bg-white border border-slate-300 rounded mt-2 overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(scenario.highMonths / ROI_CHART_MAX_MONTHS) * 100}%`,
                          backgroundColor: scenario.color,
                          opacity: 0.35,
                        }}
                      />
                      <div
                        className="absolute top-0 h-full w-1 bg-slate-900"
                        style={{
                          left: `calc(${(scenario.lowMonths / ROI_CHART_MAX_MONTHS) * 100}% - 2px)`,
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#334155' }}>
                      Monthly savings used: ~₹{scenario.totalMonthlySavings.toLocaleString()} (energy + fixed-charge reduction)
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs mt-3" style={{ color: '#475569' }}>
                {ROI_AXIS_TICKS.map((tick) => (
                  <span key={tick}>{tick}m</span>
                ))}
              </div>

              <p className="mt-4" style={{ color: '#0f172a' }}>
                Extrapolated ROI window: <strong>{ROI_FASTEST_MONTHS}-{ROI_SLOWEST_MONTHS} months</strong>{' '}
                ({(ROI_FASTEST_MONTHS / 12).toFixed(1)}-{(ROI_SLOWEST_MONTHS / 12).toFixed(1)} years).
                Practical expectation is around the Balanced case, approximately{' '}
                <strong>
                  {ROI_SCENARIOS[1].lowMonths}-{ROI_SCENARIOS[1].highMonths} months
                </strong>
                .
              </p>
            </div>

            {/* Implementation Cost */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                Implementation Cost (One-time)
              </h3>
              <p className="text-2xl font-bold text-blue-700 mb-2">
                ₹5,75,000 to ₹6,75,000
              </p>
              <div className="text-sm text-blue-600 space-y-1">
                <p>
                  • Equipment, materials, installation, and control systems
                </p>
                <p>• Includes plumbing retrofit inside homes</p>
                <p>
                  • ROI depends on realized savings. See extrapolation chart above.
                </p>
              </div>
            </div>

            {/* Detailed Cost Breakdown */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Detailed Cost Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Component
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Details/Specs
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Estimated Cost (Indian Rupees, INR)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        RO Reject Water Storage Tank
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ~12,000 liters capacity, food grade plastic
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ₹1,20,000
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Includes level sensors and fittings
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Centrifugal/Submersible Pump
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        1-2 horsepower (HP), 2-4 bar pressure
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ₹30,000 - ₹50,000
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Suitable for reject water pumping
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Piping and Fittings
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Chlorinated Polyvinyl Chloride (CPVC) pipes (1 inch),
                        valves, backflow preventers
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ₹1,50,000
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Includes installation cost for community piping
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Mixing & Control Valves
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Motorized/manual valves, backflow preventers
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ₹50,000
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        For switching between potable and reject water
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Water Quality Monitoring System
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Basic sensors, test kits
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ₹25,000
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        For periodic quality assurance
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Electrical Controls & Panel
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Automation panels, switches, wiring
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ₹50,000
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Controls pumps and valves remotely or automatically
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Plumbing Retrofit in Homes
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Valves, check valves, piping for taps
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ₹1,50,000 - ₹2,00,000
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Includes labor and material for ~39 houses
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Community Awareness & Signage
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Sign boards, user manuals
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        ₹10,000
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        For labeling and educating residents
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-yellow-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        Contingency
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        10% of total
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-yellow-600">
                        ₹40,000
                      </td>
                      <td className="px-3 text-sm text-gray-600">
                        For unexpected expenses
                      </td>
                    </tr>
                  </tbody>
                </table>
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
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">
                  Immediate Actions
                </h3>
                <ul className="list-disc list-inside text-blue-600 space-y-1">
                  <li>Get multiple local quotes for competitive pricing</li>
                  <li>Verify vendor support and warranty terms</li>
                  <li>Plan user education program</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-700 mb-2">
                  Implementation Considerations
                </h3>
                <ul className="list-disc list-inside text-yellow-600 space-y-1">
                  <li>Less costly and disruptive than dual plumbing</li>
                  <li>
                    Suitable for communities with moderate modification scope
                  </li>
                  <li>Requires clear signage and user education</li>
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
              For retrofit in existing homes, using the single plumbing line
              with valves and backflow preventers for controlled borewater usage
              is feasible and cost-effective.
            </p>
            <p className="text-gray-700">
              <strong>Critical Success Factors:</strong> Clear signage, user
              education, and periodic supervision to avoid misuse or
              contamination.
            </p>
          </section>

          {/* My 2 Cents */}
          <section className="bg-yellow-50 p-4 rounded-lg mt-6 not-prose">
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#854d0e' }}>
              Postscript (PS):
            </h2>
            <p style={{ color: '#0f172a' }}>
              We can even use the reject water with some dilution for
              non-potable uses in common areas—watering park plants, etc.
              Sinking one or two more borewells in close proximity to existing
              defunct borewells will not help as the issue is availability of
              water. Probably we need to explore and implement rain water
              harvesting also. Thank you.
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
                    <strong>Artificial Intelligence (AI) Assistance:</strong> The cost estimate table was
                    generated with the help of AI tools to provide structured
                    data.
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
