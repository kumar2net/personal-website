import React from 'react';
import { motion } from 'framer-motion';

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

        <div className="prose prose-lg max-w-none">
          {/* Executive Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              🚨 Pressing Issue: High RO Water Consumption
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
                  WHO Recommendations
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
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              World Health Organization Guidelines
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <p className="text-gray-700 mb-4">
                <strong>Single tap access (within 100m):</strong> ~50 litres per
                person per day, meeting higher hygiene needs.
              </p>
              <p className="text-gray-700">
                <strong>
                  Optimal access (multiple taps, continuous supply):
                </strong>{' '}
                Over 100 litres per person per day, covering all domestic and
                hygiene requirements.
              </p>
            </div>
            <div className="mt-4 text-sm text-gray-700">
              <p>
                <strong>My realistic opinion:</strong> 150 Litres per person per
                day
              </p>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Source:{' '}
                <a
                  href="https://iris.who.int/bitstream/handle/10665/338044/9789240015241-eng.pdf"
                  className="text-blue-600 hover:underline"
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-700 border-b">Energy/Day (kWh)</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-purple-700 border-b">Monthly Energy (kWh)</th>
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
                <p>• Includes monthly energy costs (45,477 kWh) + fixed costs (₹4,280)</p>
                <p>
                  • Current operational cost for existing system
                </p>
              </div>
            </div>

            {/* Implementation Cost */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
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
                  • ROI expected in 2-3 years based on energy savings
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
                        Estimated Cost (INR)
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
                        1-2 HP, 2-4 bar pressure
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
                        CPVC pipes (1 inch), valves, backflow preventers
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
          <section className="bg-yellow-50 p-4 rounded-lg mt-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">PS:</h2>
            <p className="text-gray-700">
              We can even use the reject water with some dilution for
              non-potable uses in common areas—watering park plants, etc.
              Sinking one or two more borewells in close proximity to existing
              defunct borewells will not help as the issue is availability of
              water. Probably we need to explore and implement rain water
              harvesting also. Thank you.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mt-6">
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
                <h2 className="text-xl font-semibold text-red-800 mb-3">
                  ⚠️ Disclaimer
                </h2>
                <div className="text-gray-700 space-y-2">
                  <p>
                    <strong>Experience Basis:</strong> This analysis is based on
                    my personal experience of facing water management issues
                    during our time living in Chennai.
                  </p>
                  <p>
                    <strong>AI Assistance:</strong> The cost estimate table was
                    generated with the help of AI tools to provide structured
                    data.
                  </p>
                  <p>
                    <strong>Expertise Level:</strong> I have limited knowledge
                    in Civil Engineering and Plumbing. This report should be
                    reviewed by qualified professionals before implementation.
                  </p>
                  <p className="text-sm text-red-600 font-medium mt-3">
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
