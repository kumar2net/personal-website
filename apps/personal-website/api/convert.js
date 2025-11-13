const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

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

const SUPPORTED_LINEAR_UNITS = Array.from(
  new Set(
    Object.keys(LINEAR_CONVERSIONS).flatMap((key) => key.split("-")),
  ),
).sort();

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

function convertTemperature(value, from, to) {
  if (from === "C" && to === "F") {
    return (value * 9) / 5 + 32;
  }
  if (from === "F" && to === "C") {
    return ((value - 32) * 5) / 9;
  }
  return null;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    if (!req.body.trim()) {
      return {};
    }
    return JSON.parse(req.body);
  }

  const rawBody = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", (err) => reject(err));
  });

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      message:
        "Send a POST request with JSON { value, from, to } to convert between US lifestyle units and metric equivalents.",
      supportedLinearUnits: SUPPORTED_LINEAR_UNITS,
      supportedTemperatureUnits: ["C", "F"],
      example: { value: 10, from: "km", to: "mi" },
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST with JSON { value, from, to }.",
    });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { value, from, to } = body || {};

  if (
    typeof value !== "number" ||
    Number.isNaN(value) ||
    typeof from !== "string" ||
    typeof to !== "string"
  ) {
    return res.status(400).json({
      error: "Request must include numeric value plus string from/to units.",
    });
  }

  if (from === to) {
    return res
      .status(200)
      .json({ input: `${value} ${from}`, output: `${value} ${to}` });
  }

  const temperatureResult = convertTemperature(value, from, to);
  if (temperatureResult !== null) {
    return res.status(200).json({
      input: `${value}°${from}`,
      output: `${temperatureResult.toFixed(2)}°${to}`,
    });
  }

  const factor = LINEAR_CONVERSIONS[`${from}-${to}`];
  if (!factor) {
    return res.status(400).json({
      error: `Unsupported conversion type: ${from} to ${to}`,
      supportedLinearUnits: SUPPORTED_LINEAR_UNITS,
    });
  }

  const converted = Number((value * factor).toFixed(3));
  return res
    .status(200)
    .json({ input: `${value} ${from}`, output: `${converted} ${to}` });
}
