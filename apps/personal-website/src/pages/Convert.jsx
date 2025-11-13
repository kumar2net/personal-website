import { useMemo, useState } from "react";
import { useColorMode } from "../providers/ColorModeProvider";

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
  const { mode } = useColorMode();
  const isDarkMode = mode === "dark";

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

  const formCardClasses = [
    "lg:col-span-2",
    "rounded-2xl",
    "shadow-sm",
    "p-6",
    isDarkMode ? "bg-slate-950 border border-slate-800 text-slate-100" : "bg-white border border-gray-200 text-gray-900",
  ].join(" ");

  const cardClasses = (extra = "") =>
    [
      "rounded-2xl",
      "p-6",
      "shadow-sm",
      isDarkMode ? "bg-slate-950 border border-slate-800 text-slate-100" : "bg-white border border-gray-200 text-gray-900",
      extra,
    ]
      .filter(Boolean)
      .join(" ");

  const labelClasses = `block text-sm font-semibold mb-2 ${isDarkMode ? "text-slate-200" : "text-gray-700"}`;

  const inputClasses = [
    "w-full",
    "rounded-xl",
    "px-4",
    "py-3",
    "text-lg",
    "focus:border-blue-500",
    "focus:ring",
    "focus:ring-blue-200",
    "transition",
    isDarkMode ? "border border-slate-700 bg-slate-900 text-slate-100" : "border border-gray-300 bg-white text-gray-900",
  ].join(" ");

  const selectClasses = [
    "w-full",
    "appearance-none",
    "rounded-xl",
    "px-4",
    "py-3",
    "focus:border-blue-500",
    "focus:ring",
    "focus:ring-blue-200",
    "transition",
    isDarkMode ? "border border-slate-700 bg-slate-900 text-slate-100" : "border border-gray-300 bg-white text-gray-900",
  ].join(" ");

  const subtleText = isDarkMode ? "text-slate-400" : "text-gray-500";
  const primaryText = isDarkMode ? "text-slate-100" : "text-gray-900";
  const quickButtonClasses = `rounded-full border px-4 py-2 text-sm transition ${
    isDarkMode
      ? "border-slate-700 text-slate-200 hover:border-blue-500 hover:text-blue-300"
      : "border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600"
  }`;

  const swapButtonClasses = `inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium transition ${
    isDarkMode
      ? "border-slate-700 text-slate-200 hover:bg-slate-900/50"
      : "border-gray-300 text-gray-700 hover:bg-gray-50"
  }`;

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
          <div className={formCardClasses}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="value" className={labelClasses}>
                  Value
                </label>
                <input
                  id="value"
                  inputMode="decimal"
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className={inputClasses}
                  placeholder="Enter a number"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="from" className={labelClasses}>
                    From unit
                  </label>
                  <div className="relative">
                    <select
                      id="from"
                      value={fromUnit}
                      onChange={(event) => setFromUnit(event.target.value)}
                      className={selectClasses}
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
                    <span
                      className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${subtleText}`}
                    >
                      ↓
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="to" className={labelClasses}>
                    To unit
                  </label>
                  <div className="relative">
                    <select
                      id="to"
                      value={toUnit}
                      onChange={(event) => setToUnit(event.target.value)}
                      className={selectClasses}
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
                    <span
                      className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${subtleText}`}
                    >
                      ↓
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSwap}
                  className={swapButtonClasses}
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
              <div
                className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                  isDarkMode
                    ? "border-red-500/50 bg-red-500/10 text-red-200"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {error}
              </div>
            )}
            {result && !error && (
              <div
                className={`mt-6 rounded-2xl border px-6 py-5 ${
                  isDarkMode
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <p
                  className={`text-sm uppercase font-semibold tracking-wide mb-2 ${
                    isDarkMode ? "text-emerald-200" : "text-emerald-600"
                  }`}
                >
                  Result
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-emerald-100" : "text-emerald-900"
                  }`}
                >
                  {result.output}
                </p>
                <p className={`${subtleText} mt-1`}>from {result.input}</p>
                <p
                  className={`text-xs mt-2 ${
                    resultSource === "local"
                      ? isDarkMode
                        ? "text-amber-300"
                        : "text-amber-600"
                      : subtleText
                  }`}
                >
                  {resultSource === "local"
                    ? "Converted with the offline fallback (slight rounding)."
                    : "Powered by the live API."}
                </p>
              </div>
            )}

            <div className="mt-8">
              <p className={`text-sm font-semibold mb-3 ${primaryText}`}>
                Quick examples
              </p>
              <div className="flex flex-wrap gap-3">
                {QUICK_EXAMPLES.map((example) => (
                  <button
                    type="button"
                    key={example.label}
                    onClick={() => handleExample(example)}
                    className={quickButtonClasses}
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className={cardClasses()}>
              <h2 className={`text-lg font-semibold mb-4 ${primaryText}`}>
                Latest conversions
              </h2>
              {history.length === 0 && (
                <p className={`text-sm ${subtleText}`}>
                  Run a conversion to see it here. The five most recent
                  conversions stay handy for reference.
                </p>
              )}
              <ul className="space-y-4">
                {history.map((item) => (
                  <li key={item.timestamp} className={`text-sm ${primaryText}`}>
                    <p className="font-semibold">{item.output}</p>
                    <p className={subtleText}>from {item.input}</p>
                    <p className={`text-xs mt-1 ${subtleText}`}>
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    {item.source && (
                      <p
                        className={`text-xs ${
                          item.source === "local"
                            ? isDarkMode
                              ? "text-amber-300"
                              : "text-amber-600"
                            : subtleText
                        }`}
                      >
                        {item.source === "local" ? "Offline fallback" : "Live API"}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className={cardClasses()}>
              <h2 className={`text-lg font-semibold mb-3 ${primaryText}`}>
                Supported unit groups
              </h2>
              <ul className={`space-y-2 text-sm ${subtleText}`}>
                {UNIT_GROUPS.map((group) => (
                  <li key={group.label}>
                    <span className={`${primaryText} font-medium`}>
                      {group.label}:
                    </span>{" "}
                    {group.units.join(", ")}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`rounded-2xl p-6 shadow-lg ${
                isDarkMode ? "bg-slate-900 text-slate-100" : "bg-gray-900 text-gray-100"
              }`}
            >
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
