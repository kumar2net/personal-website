import { NextRequest, NextResponse } from "next/server";

/**
 * U.S. lifestyle unit converter API
 *
 * This serverless function can be added to a Next.js (Vercel) project at
 * `/api/convert.ts` to provide conversions between various units commonly
 * used in the United States and their metric counterparts. It supports
 * distance, weight, volume, pressure, power, area, and temperature.
 *
 * To use this API, deploy it with your Next.js application (e.g. via
 * Vercel). You can then send POST requests to `/api/convert` with a JSON
 * payload containing `value`, `from`, and `to` properties. The response
 * will include an `input` string and an `output` string with the converted
 * value.
 *
 * Example:
 *
 * ```json
 * {
 *   "value": 10,
 *   "from": "km",
 *   "to": "mi"
 * }
 * ```
 *
 * returns
 *
 * ```json
 * {
 *   "input": "10 km",
 *   "output": "6.214 mi"
 * }
 * ```
 */
export async function POST(req: NextRequest) {
  // Parse the request body; if the JSON is malformed, return an error.
  let body: { value: number; from: string; to: string };
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { value, from, to } = body;

  // Check that the input parameters exist and value is a number.
  if (typeof value !== "number" || !from || !to) {
    return NextResponse.json(
      { error: "Request must include numeric value, from unit, and to unit" },
      { status: 400 }
    );
  }

  // Conversion factors for linear conversions. Keys are formatted as
  // `${from}-${to}` and map to multiplication factors.
  const conversions: Record<string, number> = {
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

    // Power
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

  // Temperature conversions (non-linear), handled separately.
  if (from === "C" && to === "F") {
    const result = (value * 9) / 5 + 32;
    return NextResponse.json({ input: `${value}\u00B0C`, output: `${result.toFixed(2)}\u00B0F` });
  }
  if (from === "F" && to === "C") {
    const result = ((value - 32) * 5) / 9;
    return NextResponse.json({ input: `${value}\u00B0F`, output: `${result.toFixed(2)}\u00B0C` });
  }

  // Look up the conversion factor for the requested conversion.
  const key = `${from}-${to}`;
  const factor = conversions[key];

  if (!factor) {
    return NextResponse.json(
      { error: `Unsupported conversion type: ${from} to ${to}` },
      { status: 400 }
    );
  }

  // Perform the linear conversion and round to 3 decimal places for readability.
  const converted = Number((value * factor).toFixed(3));
  return NextResponse.json({ input: `${value} ${from}`, output: `${converted} ${to}` });
}