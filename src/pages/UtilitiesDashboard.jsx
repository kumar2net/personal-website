import { motion } from 'framer-motion'

// Simple utilities dashboard for utility bills: electricity, gas, and water
// Uses inline data derived from docs/utildata parsing

// FX assumptions for USD equivalents (match summary doc)
const FX = {
  USD: 1,
  INR: 83.5,   // ₹83.5 per USD
  SGD: 1.35,   // S$1.35 per USD
  CAD: 1.36    // C$1.36 per USD
}

function toUsdEquivalent(currency, localValue) {
  if (localValue == null || Number.isNaN(localValue)) return null
  const perUsd = FX[currency]
  if (!perUsd) return null
  // local currency per unit → USD per unit
  // If perUsd is currency per USD, divide local by perUsd
  return +(localValue / perUsd).toFixed(4)
}

function normalizedGasUsdPerKwh(gasItem) {
  // Energy factors (LHV approximations)
  const energyPerUnitKwh =
    gasItem.unitLabel === 'm³' ? 9.94 :
    gasItem.unitLabel === 'kg' ? 12.78 :
    gasItem.unitLabel === 'kWh-e' ? 1.0 : null

  const localUnitPrice = gasItem.costPerUnitLocal ?? gasItem.costPerM3
  if (!energyPerUnitKwh || localUnitPrice == null) return null
  const usdPerUnit = toUsdEquivalent(gasItem.currency, localUnitPrice)
  if (usdPerUnit == null) return null
  return +(usdPerUnit / energyPerUnitKwh).toFixed(3) // USD/kWh
}

const DATA = {
  electricity: [
    {
      city: 'Coimbatore, TN, India',
      unitsKwh: 323,
      currency: 'INR',
      costPerKwh: 2.52,
      total: 813,
      label: 'Tamil Nadu Power Distribution (May 24–Jul 26, 2025)'
    },
    {
      city: 'Altamonte Springs, FL, USA',
      unitsKwh: 1564,
      currency: 'USD',
      costPerKwh: 0.1858,
      total: 290.57,
      label: 'Duke Energy (Jul 15–Aug 13, 2025)'
    },
    {
      city: 'Singapore',
      unitsKwh: 166,
      currency: 'SGD',
      costPerKwh: 0.2747,
      total: 45.6,
      label: 'SP Services (Jul 6–Aug 5, 2025) — electricity 166 kWh @ S$0.2747/kWh'
    },
    {
      city: 'Toronto, ON, Canada',
      unitsKwh: 702,
      currency: 'CAD',
      costPerKwh: 0.1876,
      total: 131.69,
      label: 'CARMA (Jun 23–Jul 23, 2025) — ~702 kWh @ C$0.1876/kWh'
    }
  ],
  gas: [
    {
      city: 'Etobicoke, ON, Canada',
      unitsM3: 21,
      unitLabel: 'm³',
      unitsLocal: 21,
      currency: 'CAD',
      costPerM3: 1.78, // 37.32 / 21 ≈ 1.777...
      costPerUnitLocal: 1.78,
      total: 37.32,
      label: 'Enbridge Gas (Jul 13–Aug 13, 2025) (taxes included)'
    },
    {
      city: 'Coimbatore, TN, India',
      unitsM3: null,
      unitLabel: 'kg',
      unitsLocal: 10,
      currency: 'INR',
      costPerM3: null,
      costPerUnitLocal: 66.0, // ₹66/kg
      total: 660,
      label: 'Indane LPG ~10 kg/month @ ₹660 ⇒ ₹66/kg'
    },
    {
      city: 'Singapore',
      unitsM3: null,
      unitLabel: 'kWh-e',
      unitsLocal: 67,
      currency: 'SGD',
      costPerM3: null,
      costPerUnitLocal: 0.2228, // S$/kWh-e
      total: 14.93,
      label: 'City Energy gas appears as 67 (bill kWh-equiv) @ S$0.2228; m³ not provided'
    }
  ],
  water: [
    {
      city: 'Coimbatore, TN, India',
      unitsM3: 15.0, // 500 liters/day × 30 days = 15,000 liters = 15 m³
      currency: 'INR',
      costPerM3: 166.67, // ₹2,500 / 15 m³ = ₹166.67/m³
      total: 2500,
      label: 'Coimbatore Groundwater (RO treated) — 500 liters/day × 30 days = 15 m³ @ ₹166.67/m³'
    },
    {
      city: 'Toronto, ON, Canada',
      unitsM3: 7.0,
      currency: 'CAD',
      costPerM3: 4.6872,
      total: 32.81,
      label: 'CARMA Cold Water Consumption — 7 m³ @ C$4.6872/m³'
    },
    {
      city: 'Lake Mary, FL, USA',
      unitsM3: 309.27,
      currency: 'USD',
      costPerM3: 0.36,
      total: 110.05,
      label: 'Seminole County Utilities — derived from UsageX100 (hundreds of gallons)'
    },
    {
      city: 'Singapore',
      unitsM3: 57.0,
      currency: 'SGD',
      costPerM3: 0.3235,
      total: 18.44,
      label: 'SP Services — Water 57 m³; effective includes WBT/WCT (S$18.44 total)'
    }
  ]
}

function formatCurrency(value, currency) {
  if (value == null || Number.isNaN(value)) return '—'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency
    }).format(value)
  } catch {
    return `${currency} ${value}`
  }
}

function BarRow({ label, value, max, rightLabel, colorClass = 'bg-blue-500' }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0
  return (
    <div className="mb-3 group">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span className="font-medium">{label}</span>
        <span className="ml-2 font-semibold">{rightLabel}</span>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded relative overflow-hidden">
        <div 
          className={`h-3 ${colorClass} rounded transition-all duration-300 ease-out group-hover:shadow-md`} 
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
}

export default function UtilitiesDashboard() {
  function normalizeCity(rawCity) {
    if (!rawCity) return rawCity
    // Toronto / Etobicoke → Toronto
    if (rawCity.includes('Etobicoke')) return 'Toronto, ON, Canada'
    if (rawCity === 'Toronto' || rawCity.includes('Toronto, ON')) return 'Toronto, ON, Canada'
    // Altamonte Springs / Lake Mary → Altamonte Springs
    if (rawCity.includes('Altamonte Springs')) return 'Altamonte Springs, FL, USA'
    if (rawCity === 'Lake Mary' || rawCity.includes('Lake Mary, FL')) return 'Altamonte Springs, FL, USA'
    return rawCity
  }
  const maxKwh = Math.max(...DATA.electricity.map(d => d.unitsKwh))
  const costPerKwhUsd = DATA.electricity.map(d => toUsdEquivalent(d.currency, d.costPerKwh) || 0)
  const maxCostPerKwhUsd = Math.max(...costPerKwhUsd, 0)
  const m3Items = DATA.gas.filter(d => d.unitsM3 != null)
  const maxM3 = Math.max(...m3Items.map(d => d.unitsM3 || 0), 0)
  const maxUnitsLocal = Math.max(...DATA.gas.map(d => d.unitsLocal || 0), 0)
  const gasLocalUnitPrices = DATA.gas.map(d => (d.costPerUnitLocal ?? d.costPerM3))
  const gasUsdUnitPrices = gasLocalUnitPrices.map((v, i) => {
    const currency = DATA.gas[i].currency
    return v != null ? toUsdEquivalent(currency, v) || 0 : 0
  })
  const maxCostPerUnitUsd = Math.max(...gasUsdUnitPrices, 0)
  const normalizedGas = DATA.gas.map(d => ({ city: normalizeCity(d.city), value: normalizedGasUsdPerKwh(d) }))
  const maxNormalizedUsdPerKwh = Math.max(...normalizedGas.map(d => d.value || 0))
  // Build stacked totals (USD) by city across electricity, gas, water
  const cityTotals = new Map()

  function addToCity(city, key, currency, value) {
    if (value == null) return
    const normalized = normalizeCity(city)
    const usd = toUsdEquivalent(currency, value) || 0
    if (!cityTotals.has(normalized)) cityTotals.set(normalized, { electricity: 0, gas: 0, water: 0, total: 0 })
    const entry = cityTotals.get(normalized)
    entry[key] += usd
    entry.total += usd
  }

  DATA.electricity.forEach(d => addToCity(d.city, 'electricity', d.currency, d.total))
  DATA.gas.forEach(d => addToCity(d.city, 'gas', d.currency, d.total))
  DATA.water.forEach(d => addToCity(d.city, 'water', d.currency, d.total))

  const stackedData = Array.from(cityTotals.entries()).map(([city, v]) => ({ city, ...v }))
  const maxStacked = Math.max(...stackedData.map(d => d.total || 0), 0)
  const maxWaterM3 = Math.max(...DATA.water.map(d => d.unitsM3 || 0), 0)
  const maxWaterCostUsd = Math.max(...DATA.water.map(d => toUsdEquivalent(d.currency, d.costPerM3) || 0), 0)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-3xl font-bold mb-6">Utilities Dashboard</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">How to read this dashboard</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Charts compare usage and costs across cities (bars scaled within each category)</li>
                <li>All costs converted to USD for apples-to-apples comparison</li>
                <li>Hover over stacked bars for detailed breakdown</li>
                <li>Notes provide context for unusual values or missing data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Summary</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-indigo-800">Highest Electricity</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  {DATA.electricity.reduce((max, d) => d.unitsKwh > max.unitsKwh ? d : max).unitsKwh.toLocaleString()} kWh
                </p>
                <p className="text-sm text-indigo-600">
                  {DATA.electricity.reduce((max, d) => d.unitsKwh > max.unitsKwh ? d : max).city}
                </p>
              </div>
              <div className="text-indigo-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-amber-800">Lowest Cost/kWh</h3>
                <p className="text-2xl font-bold text-amber-600">
                  ${Math.min(...DATA.electricity.map(d => toUsdEquivalent(d.currency, d.costPerKwh) || Infinity)).toFixed(3)}
                </p>
                <p className="text-sm text-amber-600">
                  {DATA.electricity.reduce((min, d) => {
                    const usdCost = toUsdEquivalent(d.currency, d.costPerKwh) || Infinity
                    const minUsdCost = toUsdEquivalent(min.currency, min.costPerKwh) || Infinity
                    return usdCost < minUsdCost ? d : min
                  }).city}
                </p>
              </div>
              <div className="text-amber-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-cyan-800">Total Cities</h3>
                <p className="text-2xl font-bold text-cyan-600">
                  {new Set([...DATA.electricity.map(d => normalizeCity(d.city)), ...DATA.gas.map(d => normalizeCity(d.city)), ...DATA.water.map(d => normalizeCity(d.city))]).size}
                </p>
                <p className="text-sm text-cyan-600">Unique locations</p>
              </div>
              <div className="text-cyan-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Electricity usage */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Electricity — kWh by City</h2>
        <p className="text-gray-600 mb-4">Compares absolute electricity consumption across cities.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="font-medium mb-3">kWh Consumed</h3>
            {DATA.electricity.map((d) => (
              <BarRow
                key={`${d.city}-kwh`}
                label={d.city}
                value={d.unitsKwh}
                max={maxKwh}
                rightLabel={`${d.unitsKwh.toLocaleString()} kWh`}
                colorClass="bg-indigo-500"
              />
            ))}
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="font-medium mb-3">Cost per kWh (bars in USD; label local + USD)</h3>
            {DATA.electricity.map((d) => (
              <BarRow
                key={`${d.city}-costkwh`}
                label={d.city}
                value={toUsdEquivalent(d.currency, d.costPerKwh) || 0}
                max={maxCostPerKwhUsd || 1}
                rightLabel={`${d.currency} ${d.costPerKwh.toLocaleString(undefined, { maximumFractionDigits: 4 })}/kWh · $${toUsdEquivalent(d.currency, d.costPerKwh)?.toLocaleString(undefined, { maximumFractionDigits: 4 })}/kWh`}
                colorClass="bg-green-500"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          {DATA.electricity.map((d) => (
            <div key={`${d.city}-note`}>• {d.city}: {d.label}. Total: {formatCurrency(d.total, d.currency)}</div>
          ))}
        </div>
        <div className="mt-2 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r">
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> Altamonte Springs, FL is a large bungalow-style house with a mini pool. Pool maintenance costs (filtering, cleaning, chemical treatment) are not included in utility bills but contribute to overall household expenses. Pool pumps typically run 6-12 hours daily, adding to electricity consumption.
          </div>
        </div>
        <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r">
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> Coimbatore, TN uses a Reverse Osmosis (RO) system for groundwater treatment across all usage types (drinking, cooking, bathing, etc.). This advanced water purification system significantly increases water costs compared to typical Indian household costs, as RO systems require electricity for operation, regular filter replacements, and maintenance.
          </div>
        </div>
      </section>

      {/* Water */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Water</h2>
        <p className="text-gray-600 mb-4">Consumption in m³ and unit prices (bars in USD; label local + USD).</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="font-medium mb-3">m³ Consumed</h3>
            {DATA.water.map((d) => (
              <BarRow
                key={`${d.city}-water-m3`}
                label={d.city}
                value={d.unitsM3 || 0}
                max={maxWaterM3 || 1}
                rightLabel={`${d.unitsM3?.toLocaleString()} m³`}
                colorClass="bg-blue-600"
              />
            ))}
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="font-medium mb-3">Cost per m³ (bars in USD; label local + USD)</h3>
            {DATA.water.map((d) => (
              <BarRow
                key={`${d.city}-water-cost`}
                label={d.city}
                value={toUsdEquivalent(d.currency, d.costPerM3) || 0}
                max={maxWaterCostUsd || 1}
                rightLabel={`${d.currency} ${d.costPerM3.toLocaleString(undefined, { maximumFractionDigits: 4 })}/m³ · $${toUsdEquivalent(d.currency, d.costPerM3)?.toLocaleString(undefined, { maximumFractionDigits: 4 })}/m³`}
                colorClass="bg-cyan-600"
              />
            ))}
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          {DATA.water.map((d) => (
            <div key={`${d.city}-water-note`}>• {d.city}: {d.label}. Total: {formatCurrency(d.total, d.currency)}</div>
          ))}
        </div>
      </section>

      {/* Gas usage */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Gas — by local units</h2>
        <p className="text-gray-600 mb-4">Bars show local units consumed and local/US unit prices.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="font-medium mb-3">Units Consumed (local)</h3>
            {DATA.gas.map((d) => (
              <BarRow
                key={`${d.city}-unitslocal`}
                label={d.city}
                value={d.unitsLocal || 0}
                max={maxUnitsLocal || 1}
                rightLabel={d.unitsLocal != null && d.unitLabel ? `${d.unitsLocal} ${d.unitLabel}` : '—'}
                colorClass="bg-blue-500"
              />
            ))}
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="font-medium mb-3">Cost per unit (bars in USD; label local + USD)</h3>
            {DATA.gas.map((d) => (
              <BarRow
                key={`${d.city}-costunit`}
                label={d.city}
                value={(() => {
                  const local = d.costPerUnitLocal ?? d.costPerM3
                  return local != null ? (toUsdEquivalent(d.currency, local) || 0) : 0
                })()}
                max={maxCostPerUnitUsd || 1}
                rightLabel={(() => {
                  const local = d.costPerUnitLocal ?? d.costPerM3
                  if (local == null) return '—'
                  const unit = d.unitLabel || (d.costPerM3 != null ? 'm³' : 'unit')
                  const usd = toUsdEquivalent(d.currency, local)
                  return `${d.currency} ${local.toLocaleString(undefined, { maximumFractionDigits: 2 })}/${unit} · $${usd?.toLocaleString(undefined, { maximumFractionDigits: 2 })}/${unit}`
                })()}
                colorClass="bg-amber-500"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          {DATA.gas.map((d) => (
            <div key={`${d.city}-gasnote`}>• {d.city}: {d.label}{d.total != null ? ` — Total: ${formatCurrency(d.total, d.currency)}` : ''}</div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Note: Altamonte Springs, FL (Orlando area) hotplate is electric; no gas usage.
        </div>
      </section>

      {/* Normalized Gas Cost */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Normalized Gas Cost (USD/kWh)</h2>
        <p className="text-gray-600 mb-4">Energy-normalized comparison using LHV: natural gas ≈ 9.94 kWh/m³, LPG ≈ 12.78 kWh/kg, City Energy (SG) shown as billed kWh-e.</p>
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-medium mb-3">USD per kWh</h3>
          {normalizedGas.map((d) => (
            <BarRow
              key={`${d.city}-normusd`}
              label={d.city}
              value={d.value || 0}
              max={maxNormalizedUsdPerKwh || 1}
              rightLabel={d.value != null ? `$${d.value.toLocaleString(undefined, { maximumFractionDigits: 3 })}/kWh` : '—'}
              colorClass="bg-teal-500"
            />
          ))}
        </div>
      </section>

      {/* Hotplate Electricity Insights */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Hotplate Electricity Consumption</h2>
        <p className="text-gray-600 mb-4">4-burner electric range consumption compared to actual monthly bills from our utility data.</p>
        
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">4-Burner Range Specifications</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Range Power:</span>
                  <span className="font-medium">8-10 kW</span>
                </div>
                <div className="flex justify-between">
                  <span>Typical Usage Pattern:</span>
                  <span className="font-medium">2-3 burners active</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Active Power:</span>
                  <span className="font-medium">4-6 kW</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Daily Cooking Time:</span>
                  <span className="font-medium">2 hours</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Daily Consumption (2 hours cooking)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Typical usage (5 kW):</span>
                  <span className="font-medium">10 kWh/day</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Monthly estimate:</span>
                  <span className="font-medium">300 kWh/month</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2 text-green-800">Comparison with Actual Bills (Electric Cooking Cities):</h4>
            <div className="text-sm text-green-700 space-y-2">
              <div className="flex justify-between">
                <span>Duke Energy (Florida):</span>
                <span className="font-medium">1,564 kWh total → 300 kWh = 19% of bill</span>
              </div>
              <div className="flex justify-between">
                <span>Toronto CARMA:</span>
                <span className="font-medium">704 kWh total → 300 kWh = 43% of bill</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Note: Singapore and Coimbatore use gas cooking (not electric hotplates)
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">Key Insights:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Bill Impact:</strong> Electric cooking represents 19-43% of total electricity consumption in electric cooking cities</li>
              <li>• <strong>Regional Variation:</strong> Higher impact in Toronto (43%) vs Florida (19%) due to lower overall consumption</li>
              <li>• <strong>Peak Usage Impact:</strong> Cooking during peak hours (5-8 PM) can significantly impact electricity bills in time-of-use areas</li>
              <li>• <strong>Cost Impact:</strong> At local rates: Florida $55.80/month, Toronto C$36.60/month</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Takeaways */}
      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Key Takeaways</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Coimbatore has low cost per kWh (INR ₹2.52/kWh) with modest usage (323 kWh).</li>
          <li>Duke Energy (Florida) shows higher absolute usage (1,564 kWh) and a moderate unit cost (~$0.186/kWh).</li>
          <li>Singapore: 166 kWh at S$0.2747/kWh from SP Services breakdown; City Energy gas shown as 67 (bill kWh-equiv), m³ not provided.</li>
          <li>Gas data: Etobicoke recorded 21 m³ with an effective unit cost around C$1.78/m³ (tax-incl.). Coimbatore's LPG shows a flat monthly fee without units.</li>
          <li><strong>Hotplate Impact:</strong> 4-burner electric ranges (2 hours/day) add ~300 kWh/month, representing 19-43% of bills in electric cooking cities (Florida, Toronto).</li>
        </ul>
      </section>

      {/* Stacked totals across utilities (USD) */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">All Utilities — Stacked Charges by City (USD)</h2>
        <p className="text-gray-600 mb-4">Each bar stacks Electricity + Gas + Water totals, converted to USD using FX (₹83.5, S$1.35, C$1.36 per USD). Hover over bars for detailed breakdown.</p>
                <div className="p-4 bg-white rounded-xl shadow">
          <div className="flex items-end gap-6 overflow-x-auto pb-2">
            {stackedData.map(d => {
              const e = d.electricity || 0
              const g = d.gas || 0
              const w = d.water || 0
              const total = Math.max(d.total || 0, 0)
              const height = maxStacked > 0 ? Math.max(6, Math.round((total / maxStacked) * 220)) : 0
              const eHeight = total > 0 ? Math.round((e / total) * height) : 0
              const gHeight = total > 0 ? Math.round((g / total) * height) : 0
              const wHeight = Math.max(0, height - eHeight - gHeight)
              const ePercent = total > 0 ? Math.round((e / total) * 100) : 0
              const gPercent = total > 0 ? Math.round((g / total) * 100) : 0
              const wPercent = total > 0 ? Math.round((w / total) * 100) : 0
              
              return (
                <div key={`stack-${d.city}`} className="flex flex-col items-center text-sm group relative">
                  <div className="w-10 bg-gray-200 rounded flex flex-col justify-end" style={{ height }}>
                    {e > 0 && <div className="bg-indigo-500" style={{ height: eHeight }} />}
                    {g > 0 && <div className="bg-amber-500" style={{ height: gHeight }} />}
                    {w > 0 && <div className="bg-cyan-600" style={{ height: wHeight }} />}
                  </div>
                  
                  <div className="mt-2 text-center max-w-[7rem] leading-tight">
                    <div className="font-medium">{d.city}</div>
                    <div className="text-gray-600">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-4 text-sm text-gray-700">
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-indigo-500" />Electricity</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-amber-500" />Gas</div>
            <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-cyan-600" />Water</div>
          </div>
          
          {/* Cost Breakdown Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold">City</th>
                  <th className="text-right p-3 border border-gray-200 font-semibold">Electricity</th>
                  <th className="text-right p-3 border border-gray-200 font-semibold">Gas</th>
                  <th className="text-right p-3 border border-gray-200 font-semibold">Water</th>
                  <th className="text-right p-3 border border-gray-200 font-semibold bg-gray-100">Total (USD)</th>
                </tr>
              </thead>
              <tbody>
                {stackedData.map((d, index) => {
                  const e = d.electricity || 0
                  const g = d.gas || 0
                  const w = d.water || 0
                  const total = d.total || 0
                  return (
                    <tr key={`table-${d.city}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-200 font-medium">{d.city}</td>
                      <td className="p-3 border border-gray-200 text-right">{e > 0 ? `$${e.toFixed(2)}` : '—'}</td>
                      <td className="p-3 border border-gray-200 text-right">{g > 0 ? `$${g.toFixed(2)}` : '—'}</td>
                      <td className="p-3 border border-gray-200 text-right">{w > 0 ? `$${w.toFixed(2)}` : '—'}</td>
                      <td className="p-3 border border-gray-200 text-right font-semibold bg-gray-100">${total.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
                    </div>
         

          </div>
        </section>

        {/* Toronto Time-of-Use Pricing Insight */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Toronto's Futuristic Time-of-Use Pricing</h3>
                <div className="text-blue-700 space-y-3">
                  <p>
                    <strong>Three-Tier Pricing Structure:</strong> Toronto's CARMA utility implements sophisticated time-of-use pricing with three distinct rate periods:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-3">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <div className="font-semibold text-red-700">On Peak</div>
                      <div className="text-lg font-bold text-red-600">C$0.158/kWh</div>
                      <div className="text-sm text-red-600">135 kWh used</div>
                      <div className="text-xs text-gray-600">Highest rate period</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="font-semibold text-green-700">Off Peak</div>
                      <div className="text-lg font-bold text-green-600">C$0.076/kWh</div>
                      <div className="text-sm text-green-600">480 kWh used</div>
                      <div className="text-xs text-gray-600">Lowest rate period</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="font-semibold text-yellow-700">Mid Peak</div>
                      <div className="text-lg font-bold text-yellow-600">C$0.122/kWh</div>
                      <div className="text-sm text-yellow-600">89 kWh used</div>
                      <div className="text-xs text-gray-600">Medium rate period</div>
                    </div>
                  </div>
                  <p className="mt-4">
                    <strong>Granular Consumption Monitoring:</strong> This pricing model suggests Toronto utilities are collecting consumption data at very granular intervals—likely 15-30 minute intervals—enabling precise time-of-use billing. This represents a <strong>futuristic approach</strong> to utility management that:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Encourages demand-side management during off-peak hours</li>
                    <li>Provides consumers with detailed insights into their usage patterns</li>
                    <li>Enables dynamic pricing based on real-time grid conditions</li>
                    <li>Supports smart grid infrastructure and renewable energy integration</li>
                  </ul>
                  <p className="mt-3 text-sm italic">
                    <strong>Note:</strong> This level of granular data collection and dynamic pricing represents the future of utility management, where consumers can optimize their usage patterns for both cost savings and grid stability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    )
  }


