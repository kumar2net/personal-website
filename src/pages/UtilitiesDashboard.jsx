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
    <div className="mb-3">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span className="ml-2">{rightLabel}</span>
      </div>
      <div className="h-3 w-full bg-gray-200 rounded">
        <div className={`h-3 ${colorClass} rounded`} style={{ width: `${pct}%` }} />
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

      <p className="text-gray-700 mb-8">
        This dashboard summarizes electricity, gas, and water consumption and unit costs across locations.
        Charts below highlight comparative usage (bars scaled within each category). Notes under each
        chart provide context for why some values may look unusual.
      </p>

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

      {/* Takeaways */}
      <section className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Key Takeaways</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Coimbatore has low cost per kWh (INR ₹2.52/kWh) with modest usage (323 kWh).</li>
          <li>Duke Energy (Florida) shows higher absolute usage (1,564 kWh) and a moderate unit cost (~$0.186/kWh).</li>
          <li>Singapore: 166 kWh at S$0.2747/kWh from SP Services breakdown; City Energy gas shown as 67 (bill kWh-equiv), m³ not provided.</li>
          <li>Gas data: Etobicoke recorded 21 m³ with an effective unit cost around C$1.78/m³ (tax-incl.). Coimbatore’s LPG shows a flat monthly fee without units.</li>
        </ul>
      </section>

      {/* Stacked totals across utilities (USD) */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">All Utilities — Stacked Charges by City (USD)</h2>
        <p className="text-gray-600 mb-4">Each bar stacks Electricity + Gas + Water totals, converted to USD using FX (₹83.5, S$1.35, C$1.36 per USD).</p>
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
              return (
                <div key={`stack-${d.city}`} className="flex flex-col items-center text-sm">
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
        </div>
      </section>
    </motion.div>
  )
}


