import { useMemo, useState } from "react";

const UNIT_GROUPS = [
  { label: "Distance", units: ["km", "mi", "m", "ft", "in", "cm"] },
  { label: "Weight / Mass", units: ["kg", "lb", "oz", "g"] },
  {
    label: "Volume (liquid)",
    units: ["l", "gal", "cup", "ml", "tbsp", "tsp"],
  },
  { label: "Pressure", units: ["psi", "bar"] },
  { label: "Power / Energy", units: ["hp", "kw", "btu", "kj"] },
  { label: "Area / Land", units: ["sqft", "m2", "acre", "ha"] },
  { label: "Temperature", units: ["C", "F"] },
];

const UNIT_LABELS = {
  km: "Kilometers (km)",
  mi: "Miles (mi)",
  m: "Meters (m)",
  ft: "Feet (ft)",
  in: "Inches (in)",
  cm: "Centimeters (cm)",
  kg: "Kilograms (kg)",
  lb: "Pounds (lb)",
  oz: "Ounces (oz)",
  g: "Grams (g)",
  l: "Liters (l)",
  gal: "Gallons (gal)",
  cup: "Cups (cup)",
  ml: "Milliliters (ml)",
  tbsp: "Tablespoons (tbsp)",
  tsp: "Teaspoons (tsp)",
  psi: "Pounds per square inch (psi)",
  bar: "Bar (bar)",
  hp: "Horsepower (hp)",
  kw: "Kilowatts (kW)",
  btu: "British thermal units (BTU)",
  kj: "Kilojoules (kJ)",
  sqft: "Square feet (sq ft)",
  m2: "Square meters (m²)",
  acre: "Acres",
  ha: "Hectares (ha)",
  C: "Celsius (°C)",
  F: "Fahrenheit (°F)",
};

const QUICK_EXAMPLES = [
  { label: "10 km → mi", value: 10, from: "km", to: "mi" },
  { label: "5 kg → lb", value: 5, from: "kg", to: "lb" },
  { label: "2 gal → l", value: 2, from: "gal", to: "l" },
  { label: "72 °F → °C", value: 72, from: "F", to: "C" },
  { label: "500 sqft → m²", value: 500, from: "sqft", to: "m2" },
];

const API_ENDPOINT = "/api/convert";

const LINEAR_CONVERSIONS = {
  // Distance
  "km-mi": 0.621371,
  "mi-km": 1.60934,
  "m-ft": 3.28084,
  "ft-m": 0.3048,
  "in-cm": 2.54,
  "cm-in": 0.393701,

  // Weight / Mass
  "kg-lb": 2.20462,
  "lb-kg": 0.453592,
  "oz-g": 28.3495,
  "g-oz": 0.035274,

  // Volume (liquid)
  "l-gal": 0.264172,
  "gal-l": 3.78541,
  "cup-ml": 240,
  "ml-cup": 0.004167,
  "tbsp-ml": 15,
  "ml-tbsp": 0.0667,
  "tsp-ml": 5,
  "ml-tsp": 0.2,

  // Pressure
  "psi-bar": 0.0689476,
  "bar-psi": 14.5038,

  // Power / Energy
  "hp-kw": 0.7457,
  "kw-hp": 1.34102,
  "btu-kj": 1.05506,
  "kj-btu": 0.947817,

  // Area / Land
  "sqft-m2": 0.092903,
  "m2-sqft": 10.7639,
  "acre-ha": 0.404686,
  "ha-acre": 2.47105,
};

const SUPPORTED_LINEAR_UNITS = new Set(
  Object.keys(LINEAR_CONVERSIONS).flatMap((key) => key.split("-")),
);

const convertTemperature = (value, from, to) => {
  if (from === "C" && to === "F") {
    return (value * 9) / 5 + 32;
  }
  if (from === "F" && to === "C") {
    return ((value - 32) * 5) / 9;
  }
  return null;
};

const convertLocally = (value, from, to) => {
  if (from === to) {
    return { input: `${value} ${from}`, output: `${value} ${to}` };
  }

  const temp = convertTemperature(value, from, to);
  if (temp !== null) {
    return {
      input: `${value}°${from}`,
      output: `${temp.toFixed(2)}°${to}`,
    };
  }

  const key = `${from}-${to}`;
  const factor = LINEAR_CONVERSIONS[key];
  if (!factor) {
    return null;
  }

  const converted = Number((value * factor).toFixed(3));
  return { input: `${value} ${from}`, output: `${converted} ${to}` };
};

function Convert() {
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("km");
  const [toUnit, setToUnit] = useState("mi");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultSource, setResultSource] = useState("api");

  const allUnits = useMemo(
    () =>
      UNIT_GROUPS.reduce(
        (acc, group) => acc.concat(group.units),
        /** @type {string[]} */ ([]),
      ),
    [],
  );

  const handleExample = (example) => {
    setInputValue(String(example.value));
    setFromUnit(example.from);
    setToUnit(example.to);
    setResult(null);
    setError("");
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const numericValue = Number(inputValue);

    if (Number.isNaN(numericValue)) {
      setError("Please enter a number to convert.");
      setResult(null);
      return;
    }

    if (!allUnits.includes(fromUnit) || !allUnits.includes(toUnit)) {
      setError("Select valid units to convert.");
      setResult(null);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: numericValue,
          from: fromUnit,
          to: toUnit,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to convert the value.");
      }

      setResult(payload);
      setResultSource("api");
      setHistory((prev) => {
        const next = [
          {
            ...payload,
            source: "api",
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ];
        return next.slice(0, 5);
      });
    } catch (err) {
      const fallback = convertLocally(numericValue, fromUnit, toUnit);
      if (fallback) {
        setResult(fallback);
        setResultSource("local");
        setHistory((prev) => {
          const next = [
            {
              ...fallback,
              source: "local",
              timestamp: new Date().toISOString(),
            },
            ...prev,
          ];
          return next.slice(0, 5);
        });
        setError("");
      } else {
        setResult(null);
        setError(
          err instanceof Error ? err.message : "Conversion failed.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
          <p className="uppercase text-xs font-semibold tracking-widest mb-2">
            Utilities
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Convert U.S. lifestyle units to metric and back
          </h1>
          <p className="text-white/80 max-w-3xl">
            A lightweight tool backed by the `/api/convert` endpoint. Perfect
            for USD-based energy, travel, cooking, or home projects where you
            need quick US ↔ metric conversions.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="value"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Value
                </label>
                <input
                  id="value"
                  inputMode="decimal"
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-slate-700 px-4 py-3 text-lg bg-white dark:bg-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  placeholder="Enter a number"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="from"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    From unit
                  </label>
                  <div className="relative">
                    <select
                      id="from"
                      value={fromUnit}
                      onChange={(event) => setFromUnit(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-300 dark:border-slate-700 px-4 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white dark:bg-slate-900 dark:text-slate-100"
                    >
                      {UNIT_GROUPS.map((group) => (
                        <optgroup label={group.label} key={group.label}>
                          {group.units.map((unit) => (
                            <option key={unit} value={unit}>
                              {UNIT_LABELS[unit] || unit}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ↓
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="to"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    To unit
                  </label>
                  <div className="relative">
                    <select
                      id="to"
                      value={toUnit}
                      onChange={(event) => setToUnit(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-300 dark:border-slate-700 px-4 py-3 focus:border-blue-500 focus:ring focus:ring-blue-200 transition bg-white dark:bg-slate-900 dark:text-slate-100"
                    >
                      {UNIT_GROUPS.map((group) => (
                        <optgroup label={group.label} key={group.label}>
                          {group.units.map((unit) => (
                            <option key={unit} value={unit}>
                              {UNIT_LABELS[unit] || unit}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ↓
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Swap units
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-60 transition"
                >
                  {isSubmitting ? "Converting..." : "Convert value"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {result && !error && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5">
                <p className="text-sm uppercase font-semibold tracking-wide text-emerald-600 mb-2">
                  Result
                </p>
                <p className="text-3xl font-bold text-emerald-900">
                  {result.output}
                </p>
                <p className="text-gray-600 mt-1">from {result.input}</p>
                <p
                  className={`text-xs mt-2 ${resultSource === "local" ? "text-amber-600" : "text-gray-400"}`}
                >
                  {resultSource === "local"
                    ? "Converted with the offline fallback (slight rounding)."
                    : "Powered by the live API."}
                </p>
              </div>
            )}

            <div className="mt-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Quick examples
              </p>
              <div className="flex flex-wrap gap-3">
                {QUICK_EXAMPLES.map((example) => (
                  <button
                    type="button"
                    key={example.label}
                    onClick={() => handleExample(example)}
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600 transition"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Latest conversions
              </h2>
              {history.length === 0 && (
                <p className="text-sm text-gray-500">
                  Run a conversion to see it here. The five most recent
                  conversions stay handy for reference.
                </p>
              )}
              <ul className="space-y-4">
                {history.map((item) => (
                  <li key={item.timestamp} className="text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">
                      {item.output}
                    </p>
                    <p className="text-gray-500">from {item.input}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    {item.source && (
                      <p className={`text-xs ${item.source === "local" ? "text-amber-600" : "text-gray-400"}`}>
                        {item.source === "local" ? "Offline fallback" : "Live API"}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Supported unit groups
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                {UNIT_GROUPS.map((group) => (
                  <li key={group.label}>
                    <span className="text-gray-900 font-medium">
                      {group.label}:
                    </span>{" "}
                    {group.units.join(", ")}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 text-gray-100 rounded-2xl p-6 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">
                API access
              </p>
              <p className="text-sm mb-4 text-gray-200">
                Call the same converter from code by sending a POST request to{" "}
                <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                  {API_ENDPOINT}
                </code>{" "}
                with{" "}
                <code className="text-xs bg-gray-800 px-2 py-1 rounded">
                  {"{ value, from, to }"}
                </code>
                .
              </p>
              <pre className="text-xs bg-gray-800/80 rounded-xl p-4 overflow-x-auto">
{`curl -X POST ${API_ENDPOINT} \\
  -H 'Content-Type: application/json' \\
  -d '{"value":10,"from":"km","to":"mi"}'`}
              </pre>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Convert;
