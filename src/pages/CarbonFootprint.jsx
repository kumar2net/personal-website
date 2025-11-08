import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const CLIMATIQ_ESTIMATE_URL = "https://api.climatiq.io/estimate";
const DATA_VERSION = "27.27";
const SAMPLE_INPUTS = {
  energy: "320",
  water: "8500",
  waterType: "RO",
  lpgCount: "1",
  lpgSize: "15",
  wasteWet: "28",
  wasteDry: "16",
  travelCar: "750",
  travelFlight: "0",
  travelTrain: "180",
  travelBus: "120",
  customActivityId: "",
  customLabel: "",
  customAmount: "",
  customUnit: "kg",
};

const TRAVEL_FACTORS = {
  travelCar: {
    label: "Personal car",
    activity_id: "passenger_vehicle-vehicle",
  },
  travelFlight: {
    label: "Flights",
    activity_id: "flight_international", // economy class
  },
  travelTrain: {
    label: "Train travel",
    activity_id: "passenger_train",
  },
  travelBus: {
    label: "City bus",
    activity_id: "passenger_bus",
  },
};

const WATER_FACTORS = {
  RO: "water_distribution_drinking",
  Raw: "water_distribution_groundwater",
};

const WASTE_FACTORS = {
  wet: "waste_disposal_organic",
  dry: "waste_disposal_material",
};

const UNIT_TO_KG = {
  kg: 1,
  g: 1 / 1000,
  lb: 0.45359237,
  lbs: 0.45359237,
  tonne: 1000,
  t: 1000,
};

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function convertToKg(value, unit) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }
  const normalized = typeof unit === "string" ? unit.toLowerCase() : "";
  const factor = UNIT_TO_KG[normalized];
  if (factor != null) {
    return value * factor;
  }
  return value; // assume already in kg
}

function formatNumber(value, digits = 2) {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return value.toFixed(digits);
}

function buildRequests(state) {
  const requests = [];
  const push = (entry) => {
    if (entry.amount != null && entry.parameters) {
      requests.push(entry);
    }
  };

  const energy = toNumber(state.energy);
  push({
    label: "Electricity",
    friendlyLabel: "Electricity (kWh)",
    amount: energy,
    unit: "kWh",
    emissionFactorId: "electricity_grid_mix",
    info: "Monthly grid electricity (kWh).",
    parameters: {
      energy,
      energy_unit: "kWh",
    },
  });

  const water = toNumber(state.water);
  if (water != null) {
    push({
      label: `${state.waterType || "Water"}`,
      friendlyLabel: `Water (${state.waterType || "RO/raw"})`,
      amount: water,
      unit: "L",
      emissionFactorId: WATER_FACTORS[state.waterType] || WATER_FACTORS.RO,
      info: "Monthly liters consumed of the selected water type.",
      parameters: {
        volume: water,
        volume_unit: "L",
      },
    });
  }

  const lpgCount = toNumber(state.lpgCount);
  const lpgSize = Number(state.lpgSize) || 0;
  if (lpgCount != null && lpgSize > 0) {
    const totalKg = lpgCount * lpgSize;
    push({
      label: `LPG ${lpgSize} kg cylinders`,
      friendlyLabel: `LPG (${lpgSize} kg cylinders)`,
      amount: totalKg,
      unit: "kg",
      emissionFactorId: "lpg_consumption",
      info: "Multiply monthly cylinder count by the chosen size.",
      parameters: {
        weight: totalKg,
        weight_unit: "kg",
      },
    });
  }

  const wetWaste = toNumber(state.wasteWet);
  push({
    label: "Wet waste",
    friendlyLabel: "Wet waste (kg)",
    amount: wetWaste,
    unit: "kg",
    emissionFactorId: WASTE_FACTORS.wet,
    info: "Estimate of wet/organic waste in kilograms.",
    parameters: {
      weight: wetWaste,
      weight_unit: "kg",
    },
  });

  const dryWaste = toNumber(state.wasteDry);
  push({
    label: "Dry waste",
    friendlyLabel: "Dry waste (kg)",
    amount: dryWaste,
    unit: "kg",
    emissionFactorId: WASTE_FACTORS.dry,
    info: "Estimate of dry/nonorganic waste in kilograms.",
    parameters: {
      weight: dryWaste,
      weight_unit: "kg",
    },
  });

  Object.keys(TRAVEL_FACTORS).forEach((travelKey) => {
    const amount = toNumber(state[travelKey]);
    const travel = TRAVEL_FACTORS[travelKey];
    push({
      label: travel.label,
      friendlyLabel: `${travel.label} (km)`,
      amount,
      unit: "km",
      emissionFactorId: travel.activity_id,
      info: `Monthly ${travel.label.toLowerCase()} distance in kilometers.`,
      parameters: {
        distance: amount,
        distance_unit: "km",
      },
    });
  });

  const customAmount = toNumber(state.customAmount);
  if (customAmount != null && state.customActivityId?.trim()) {
    push({
      label: state.customLabel || state.customActivityId,
      friendlyLabel: state.customLabel || state.customActivityId,
      amount: customAmount,
      unit: state.customUnit || "kg",
      emissionFactorId: state.customActivityId.trim(),
      info: "Custom Climatiq activity ID.",
      parameters: {
        amount: customAmount,
        unit: state.customUnit || "kg",
      },
    });
  }

  return requests.filter((req) => req.amount != null);
}

async function requestEstimate(apiKey, request) {
  const payload = {
    emission_factor: {
      activity_id: request.emissionFactorId,
      data_version: DATA_VERSION,
    },
    parameters: request.parameters,
  };
  const response = await fetch(CLIMATIQ_ESTIMATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  const data = await response.json();
  const co2eValue = Number(data?.co2e?.value);
  const co2eUnit = data?.co2e?.unit;
  const co2eKg = convertToKg(co2eValue, co2eUnit);
  if (co2eKg == null) {
    throw new Error("Climatiq responded without CO₂e data");
  }
  return {
    ...request,
    co2eValue,
    co2eUnit,
    co2eKg,
    raw: data,
  };
}

export default function CarbonFootprint() {
  const [formState, setFormState] = useState({
    energy: "",
    water: "",
    waterType: "RO",
    lpgCount: "",
    lpgSize: "10",
    wasteWet: "",
    wasteDry: "",
    travelCar: "",
    travelFlight: "",
    travelTrain: "",
    travelBus: "",
    customActivityId: "",
    customLabel: "",
    customAmount: "",
    customUnit: "kg",
  });
  const [results, setResults] = useState([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = import.meta.env.VITE_CLIMATIQ_API_KEY?.trim();

  const totalKg = useMemo(
    () => results.reduce((sum, item) => sum + (item.co2eKg || 0), 0),
    [results],
  );

  const largestContributor = useMemo(() => {
    if (!results.length) {
      return null;
    }
    return results.reduce((prev, current) =>
      (current.co2eKg || 0) > (prev.co2eKg || 0) ? current : prev,
    );
  }, [results]);

  const handleInputChange = (key) => (event) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleUseDefaults = () => {
    setFormState(SAMPLE_INPUTS);
    setError("");
    setNotes("Loaded a typical family household as a starting point.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotes("");
    setResults([]);

    if (!apiKey) {
      setError(
        "Set VITE_CLIMATIQ_API_KEY in your environment before running estimates.",
      );
      return;
    }

    const requests = buildRequests(formState);
    if (!requests.length) {
      setError("Please provide at least one metric to estimate.");
      return;
    }

    setIsLoading(true);
    try {
      const settled = await Promise.allSettled(
        requests.map((entry) => requestEstimate(apiKey, entry)),
      );
      const successful = [];
      const failures = [];
      settled.forEach((item, idx) => {
        if (item.status === "fulfilled") {
          successful.push(item.value);
        } else {
          failures.push(`${requests[idx].friendlyLabel}: ${item.reason?.message}`);
        }
      });
      if (!successful.length) {
        throw new Error(
          failures.length
            ? failures.join("; ")
            : "Climatiq requests failed",
        );
      }
      if (failures.length) {
        setNotes(`Partial results: ${failures.join("; ")}`);
      }
      setResults(successful);
    } catch (err) {
      setError(err?.message || "Estimation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <p className="text-sm font-semibold text-teal-600">Carbon footprint</p>
        <h1 className="text-3xl font-bold text-gray-900">
          Monthly Carbon Footprint MVP
        </h1>
        <p className="text-gray-600">
          Enter the key monthly inputs (all metric units) and Climatiq will
          return a single emissions estimate plus a quick breakdown so you can
          spot the biggest contributors. No account, no storage, just fast
          awareness.
        </p>
        <p className="text-xs text-gray-500">
          Metrics assume: energy (kWh), water (liters), LPG cylinders (kg),
          waste (kg), and travel (km). You can also add one custom Climatiq
          activity by ID.
        </p>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-[1fr,0.95fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Inputs
              </h2>
              <button
                type="button"
                onClick={handleUseDefaults}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Load sample values
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Suggested averages help you get a quick reading when some inputs
              are missing.
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="text-sm text-gray-700">
              <span className="font-semibold">Energy (kWh)</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={formState.energy}
                onChange={handleInputChange("energy")}
                placeholder="e.g., 320"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
              <span className="text-xs text-gray-500">
                Total meter reading for the month.
              </span>
            </label>
            <label className="text-sm text-gray-700">
              <span className="font-semibold">Water (liters)</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={formState.water}
                  onChange={handleInputChange("water")}
                  placeholder="e.g., 8500"
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <select
                  value={formState.waterType}
                  onChange={handleInputChange("waterType")}
                  className="rounded border border-gray-300 bg-white px-2 text-sm text-gray-600 focus:border-teal-500 focus:outline-none"
                >
                  <option value="RO">RO water</option>
                  <option value="Raw">Raw water</option>
                </select>
              </div>
              <span className="text-xs text-gray-500">
                Choose the dominant treatment level so Climatiq uses the right
                factor.
              </span>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="text-sm text-gray-700">
              <span className="font-semibold">LPG cylinders (per month)</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={formState.lpgCount}
                  onChange={handleInputChange("lpgCount")}
                  placeholder="Count"
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <select
                  value={formState.lpgSize}
                  onChange={handleInputChange("lpgSize")}
                  className="rounded border border-gray-300 bg-white px-2 text-sm text-gray-600 focus:border-teal-500 focus:outline-none"
                >
                  <option value="10">10 kg</option>
                  <option value="15">15 kg</option>
                </select>
              </div>
              <span className="text-xs text-gray-500">
                Multiply count by kilo weight to give total kg of LPG.
              </span>
            </label>
            <label className="text-sm text-gray-700">
              <span className="font-semibold">Waste (kg/month)</span>
              <div className="mt-1 grid gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={formState.wasteWet}
                  onChange={handleInputChange("wasteWet")}
                  placeholder="Wet waste"
                  className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={formState.wasteDry}
                  onChange={handleInputChange("wasteDry")}
                  placeholder="Dry waste"
                  className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
              <span className="text-xs text-gray-500">
                Approximate wet and dry waste you separate in a month.
              </span>
            </label>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Travel (km/month)</p>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries({
                travelCar: "Car",
                travelFlight: "Flight",
                travelTrain: "Train",
                travelBus: "Bus",
              }).map(([field, label]) => (
                <label key={field} className="text-sm text-gray-700">
                  {label}
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={formState[field]}
                    onChange={handleInputChange(field)}
                    placeholder="km"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  />
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Reasonable defaults are: car 750 km, flight 0 km, train 180 km,
              bus 120 km. Leave blank if not applicable.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Custom Climatiq category</p>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="text"
                value={formState.customActivityId}
                onChange={handleInputChange("customActivityId")}
                placeholder="activity_id (e.g., flight_domestic)"
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
              <input
                type="text"
                value={formState.customLabel}
                onChange={handleInputChange("customLabel")}
                placeholder="Friendly label (optional)"
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={formState.customAmount}
                  onChange={handleInputChange("customAmount")}
                  placeholder="Amount"
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
                <select
                  value={formState.customUnit}
                  onChange={handleInputChange("customUnit")}
                  className="rounded border border-gray-300 bg-white px-2 text-sm text-gray-600 focus:border-teal-500 focus:outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="kWh">kWh</option>
                  <option value="km">km</option>
                  <option value="L">L</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Enter one additional Climatiq activity ID and its monthly amount.
              Exact IDs are listed at climatiq.io/emission-factors.
            </p>
          </div>

          {apiKey ? null : (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Climatiq API key is missing. Set `VITE_CLIMATIQ_API_KEY` locally in
              `.env` before running estimates.
            </div>
          )}

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-teal-300"
          >
            {isLoading ? "Estimating…" : "Estimate monthly footprint"}
          </button>
          {notes ? (
            <p className="text-xs text-gray-500">{notes}</p>
          ) : null}
        </form>

        <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Results</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {results.length ? "Your monthly CO₂e" : "Awaiting inputs"}
              </h2>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Total (kg CO₂e)</p>
              <p className="text-lg font-semibold text-gray-900">
                {results.length ? formatNumber(totalKg) : "—"}
              </p>
              <p className="text-xs text-gray-500">{results.length ? `${formatNumber(totalKg / 1000)} tonnes` : ""}</p>
            </div>
          </div>

          {!results.length ? (
            <p className="text-sm text-gray-500">
              Fill at least one input and submit to get a Climatiq-based estimate.
            </p>
          ) : (
            <div className="space-y-4">
              {largestContributor ? (
                <div className="rounded-xl bg-gradient-to-r from-teal-50 to-white p-4 text-sm text-teal-800">
                  Largest contributor: <strong>{largestContributor.label}</strong> (~{formatNumber(largestContributor.co2eKg)} kg CO₂e).
                </div>
              ) : null}
              <div className="space-y-3">
                {results.map((row) => (
                  <div
                    key={`${row.label}-${row.amount}-${row.emissionFactorId}-${row.co2eKg}`}
                    className="flex flex-col gap-1 rounded-xl border border-gray-100 px-4 py-3 text-sm text-gray-700 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{row.friendlyLabel}</p>
                      <span className="text-xs text-gray-500">{row.amount} {row.unit || ""}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {row.info}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>CO₂e</span>
                      <span>
                        {formatNumber(row.co2eKg)} kg / {formatNumber(row.co2eKg / 1000)} t
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Factor: {row.emissionFactorId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
