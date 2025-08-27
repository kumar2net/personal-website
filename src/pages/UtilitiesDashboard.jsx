import { motion } from 'framer-motion'

// Simple utilities dashboard for utility bills: electricity and gas
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
  const maxKwh = Math.max(...DATA.electricity.map(d => d.unitsKwh))
  const maxCostPerKwh = Math.max(...DATA.electricity.map(d => d.costPerKwh))
  const m3Items = DATA.gas.filter(d => d.unitsM3 != null)
  const maxM3 = Math.max(...m3Items.map(d => d.unitsM3 || 0), 0)
  const maxUnitsLocal = Math.max(...DATA.gas.map(d => d.unitsLocal || 0), 0)
  const maxCostPerUnit = Math.max(...DATA.gas.map(d => (d.costPerUnitLocal ?? d.costPerM3 ?? 0)))
  const normalizedGas = DATA.gas.map(d => ({ city: d.city, value: normalizedGasUsdPerKwh(d) }))
  const maxNormalizedUsdPerKwh = Math.max(...normalizedGas.map(d => d.value || 0))

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-3xl font-bold mb-6">Utilities Dashboard</h1>

      <p className="text-gray-700 mb-8">
        This dashboard summarizes electricity and gas consumption and unit costs across locations.
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
            <h3 className="font-medium mb-3">Cost per kWh (local + USD)</h3>
            {DATA.electricity.map((d) => (
              <BarRow
                key={`${d.city}-costkwh`}
                label={d.city}
                value={d.costPerKwh}
                max={maxCostPerKwh}
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
            <h3 className="font-medium mb-3">Cost per unit (local + USD)</h3>
            {DATA.gas.map((d) => (
              <BarRow
                key={`${d.city}-costunit`}
                label={d.city}
                value={(d.costPerUnitLocal ?? d.costPerM3) || 0}
                max={maxCostPerUnit || 1}
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
    </motion.div>
  )
}


