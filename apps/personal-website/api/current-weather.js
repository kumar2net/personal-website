import OpenAI from "openai";
import { recordTokenUsage } from "../../../scripts/token-usage.mjs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_LOCATION = "Chennai, Tamil Nadu, India";
const DEFAULT_MODEL =
  process.env.WEATHER_OPENAI_MODEL ||
  process.env.OPENAI_MODEL ||
  "gpt-4.1-mini";
const WEATHER_BATCH_TOOL_NAME = "get_current_weather_batch";
const WORLD_CLOCK_LOCATIONS = [
  {
    key: "SIN",
    city: "Singapore",
    location: "Singapore, Singapore",
  },
  {
    key: "MAA",
    city: "Chennai",
    location: "Chennai, Tamil Nadu, India",
  },
  {
    key: "LON",
    city: "London",
    location: "London, United Kingdom",
  },
  {
    key: "MCO",
    city: "Orlando",
    location: "Orlando, Florida, United States",
  },
  {
    key: "SFO",
    city: "San Francisco",
    location: "San Francisco, California, United States",
  },
];

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

function parseLocation(req) {
  const queryLocation =
    typeof req?.query?.location === "string" ? req.query.location : "";

  if (queryLocation.trim()) {
    return queryLocation.trim();
  }

  const url = new URL(req?.url || "/", "http://localhost");
  const location = url.searchParams.get("location");
  return location?.trim() || DEFAULT_LOCATION;
}

function readQueryParam(req, name) {
  const directValue =
    typeof req?.query?.[name] === "string" ? req.query[name] : "";

  if (directValue.trim()) {
    return directValue.trim();
  }

  const url = new URL(req?.url || "/", "http://localhost");
  return url.searchParams.get(name)?.trim() || "";
}

function normalizeRequestItem(item, index) {
  return {
    key:
      typeof item?.key === "string" && item.key.trim()
        ? item.key.trim()
        : `city-${index + 1}`,
    city:
      typeof item?.city === "string" && item.city.trim()
        ? item.city.trim()
        : String(item?.location || DEFAULT_LOCATION)
            .split(",")[0]
            .trim(),
    location:
      typeof item?.location === "string" && item.location.trim()
        ? item.location.trim()
        : DEFAULT_LOCATION,
  };
}

function roundTemperature(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }
  return Math.round(numericValue * 10) / 10;
}

function toFahrenheit(celsius) {
  const numericValue = Number(celsius);
  if (!Number.isFinite(numericValue)) {
    return null;
  }
  return roundTemperature((numericValue * 9) / 5 + 32);
}

function buildSummary(payload) {
  const city = payload?.location?.split(",")?.[0] || "Current location";
  const celsius = payload?.temperature?.celsius;
  const fahrenheit = payload?.temperature?.fahrenheit;

  if (!Number.isFinite(celsius) || !Number.isFinite(fahrenheit)) {
    return `${city} weather is available now.`;
  }

  return `${city} is currently ${celsius}°C / ${fahrenheit}°F.`;
}

function buildBatchSummary(items) {
  const cities = items.map((item) => item.city).filter(Boolean);

  if (!cities.length) {
    return "Current temperatures are available now.";
  }

  if (cities.length === 1) {
    return `${cities[0]} weather is available now.`;
  }

  return `Current temperatures loaded for ${cities.join(", ")}.`;
}

async function geocodeLocation(location) {
  const candidates = Array.from(
    new Set(
      [location, location.split(",")[0]?.trim()]
        .map((candidate) => candidate?.trim())
        .filter(Boolean),
    ),
  );

  for (const candidate of candidates) {
    const params = new URLSearchParams({
      name: candidate,
      count: "1",
      language: "en",
      format: "json",
    });

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
      {
        headers: { "User-Agent": "personal-website-current-weather" },
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Geocoding failed (${response.status}): ${detail}`);
    }

    const data = await response.json();
    const result = Array.isArray(data?.results) ? data.results[0] : null;

    if (result) {
      return result;
    }
  }

  throw new Error(`No weather location match found for "${location}".`);
}

async function fetchCurrentWeather(location) {
  const geocode = await geocodeLocation(location);
  const params = new URLSearchParams({
    latitude: String(geocode.latitude),
    longitude: String(geocode.longitude),
    current: "temperature_2m,apparent_temperature,weather_code,is_day",
    timezone: "auto",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    {
      headers: { "User-Agent": "personal-website-current-weather" },
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Weather fetch failed (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const current = data?.current;
  const celsius = roundTemperature(current?.temperature_2m);
  const apparentCelsius = roundTemperature(current?.apparent_temperature);

  if (!current || !Number.isFinite(celsius)) {
    throw new Error("Weather response did not include current temperature.");
  }

  const payload = {
    requestedLocation: location,
    location: [geocode.name, geocode.admin1, geocode.country]
      .filter(Boolean)
      .join(", "),
    timezone: data?.timezone || geocode.timezone || null,
    observedAt: current.time || null,
    latitude: geocode.latitude,
    longitude: geocode.longitude,
    weatherCode: current.weather_code ?? null,
    isDay: Boolean(current.is_day),
    temperature: {
      celsius,
      fahrenheit: toFahrenheit(celsius),
      apparentCelsius,
      apparentFahrenheit: toFahrenheit(apparentCelsius),
    },
    provider: "open-meteo",
  };

  return {
    ...payload,
    summary: buildSummary(payload),
  };
}

async function fetchWeatherBatch(requestItems) {
  return Promise.all(
    requestItems.map(async (requestItem, index) => ({
      ...normalizeRequestItem(requestItem, index),
      ...(await fetchCurrentWeather(requestItem.location)),
    })),
  );
}

async function resolveBatchWithFunctionCalling(requestItems) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const normalizedItems = requestItems.map(normalizeRequestItem);
  const input = [
    {
      role: "user",
      content: [
        "Fetch the current temperature for each world clock city.",
        "Use the weather batch tool with the provided keys and locations, then reply with one short summary sentence.",
        `Cities: ${JSON.stringify(normalizedItems)}`,
      ].join(" "),
    },
  ];
  const tools = [
    {
      type: "function",
      name: WEATHER_BATCH_TOOL_NAME,
      description:
        "Look up the current weather for one or more cities and return temperature details for each item.",
      strict: true,
      parameters: {
        type: "object",
        properties: {
          locations: {
            type: "array",
            description: "The list of cities to look up.",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                  description: "Stable identifier for the location.",
                },
                city: {
                  type: "string",
                  description: "Short city display name.",
                },
                location: {
                  type: "string",
                  description: "City and country or region to look up.",
                },
              },
              required: ["key", "city", "location"],
              additionalProperties: false,
            },
            minItems: 1,
          },
        },
        required: ["locations"],
        additionalProperties: false,
      },
    },
  ];

  const firstResponse = await client.responses.create({
    model: DEFAULT_MODEL,
    input,
    tools,
    tool_choice: { type: "function", name: WEATHER_BATCH_TOOL_NAME },
    parallel_tool_calls: false,
  });

  const toolCalls = firstResponse.output.filter(
    (item) =>
      item.type === "function_call" && item.name === WEATHER_BATCH_TOOL_NAME,
  );

  if (!toolCalls.length) {
    throw new Error("OpenAI did not return a weather tool call.");
  }

  // The docs pattern is: inspect function calls, execute them locally,
  // then send function_call_output back for the final model response.
  const weatherResults = [];
  const toolOutputs = [];
  const requestItemsByKey = new Map(
    normalizedItems.map((item) => [item.key, item]),
  );

  for (const toolCall of toolCalls) {
    const parsedArguments = JSON.parse(toolCall.arguments || "{}");
    const parsedLocations = Array.isArray(parsedArguments.locations)
      ? parsedArguments.locations
      : normalizedItems;
    const effectiveItems = parsedLocations.map((item, index) =>
      normalizeRequestItem(
        {
          ...requestItemsByKey.get(item?.key),
          ...item,
        },
        index,
      ),
    );
    const weatherPayload = await fetchWeatherBatch(effectiveItems);
    weatherResults.push(...weatherPayload);
    toolOutputs.push({
      type: "function_call_output",
      call_id: toolCall.call_id,
      output: JSON.stringify({ items: weatherPayload }),
    });
  }

  const finalResponse = await client.responses.create({
    model: DEFAULT_MODEL,
    input: [...input, ...firstResponse.output, ...toolOutputs],
  });

  const usageRecords = [firstResponse, finalResponse]
    .map((response) => response?.usage)
    .filter(Boolean);

  const usage = usageRecords.reduce(
    (totals, current) => ({
      input_tokens: totals.input_tokens + (current?.input_tokens || 0),
      output_tokens: totals.output_tokens + (current?.output_tokens || 0),
      total_tokens: totals.total_tokens + (current?.total_tokens || 0),
    }),
    { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
  );

  recordTokenUsage({
    provider: "openai",
    route: "current-weather",
    model: finalResponse.model || firstResponse.model || DEFAULT_MODEL,
    request_id: finalResponse.id || firstResponse.id,
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    total_tokens: usage.total_tokens,
    meta: {
      locations: normalizedItems.map((item) => item.location),
      tool: WEATHER_BATCH_TOOL_NAME,
    },
  });

  return {
    items: weatherResults,
    model: finalResponse.model || firstResponse.model || DEFAULT_MODEL,
    summary: finalResponse.output_text?.trim() || buildBatchSummary(weatherResults),
    fallback: false,
    usedFunctionCalling: true,
  };
}

function flattenBatchPayload(payload, warning = "") {
  const firstItem = payload?.items?.[0];

  if (!firstItem) {
    return {
      error: "Current weather lookup failed",
      detail: "No weather payload returned.",
    };
  }

  return {
    ...firstItem,
    model: payload.model,
    summary: firstItem.summary || payload.summary,
    fallback: Boolean(payload.fallback),
    usedFunctionCalling: Boolean(payload.usedFunctionCalling),
    ...(warning ? { warning } : {}),
  };
}

export const runtime = "nodejs";

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed. Use GET /api/current-weather.",
    });
  }

  const preset = readQueryParam(req, "preset");
  const isWorldClockPreset = preset === "world-clock";
  const parsedLocation = parseLocation(req);
  const requestItems = isWorldClockPreset
    ? WORLD_CLOCK_LOCATIONS.map((item, index) => normalizeRequestItem(item, index))
    : [
        normalizeRequestItem(
          {
            key: "default",
            city: parsedLocation.split(",")[0].trim(),
            location: parsedLocation,
          },
          0,
        ),
      ];

  try {
    let payload;

    if (process.env.OPENAI_API_KEY) {
      try {
        payload = await resolveBatchWithFunctionCalling(requestItems);
      } catch (openaiError) {
        console.error("Function-calling weather lookup failed", openaiError);
        const fallbackPayload = await fetchWeatherBatch(requestItems);
        payload = {
          items: fallbackPayload,
          model: "open-meteo-fallback",
          fallback: true,
          usedFunctionCalling: false,
          summary: buildBatchSummary(fallbackPayload),
          warning: "OpenAI weather orchestration failed; served direct weather.",
        };
      }
    } else {
      const fallbackPayload = await fetchWeatherBatch(requestItems);
      payload = {
        items: fallbackPayload,
        model: "open-meteo-fallback",
        fallback: true,
        usedFunctionCalling: false,
        summary: buildBatchSummary(fallbackPayload),
      };
    }

    res.setHeader(
      "Cache-Control",
      "public, max-age=300, s-maxage=600, stale-while-revalidate=900",
    );

    if (isWorldClockPreset) {
      return res.status(200).json(payload);
    }

    if (payload?.error) {
      return res.status(500).json(payload);
    }

    const flattenedPayload = flattenBatchPayload(payload, payload.warning || "");
    if (flattenedPayload?.error) {
      return res.status(500).json(flattenedPayload);
    }

    return res.status(200).json(flattenedPayload);
  } catch (error) {
    console.error("Current weather handler failed", error);
    return res.status(500).json({
      error: "Current weather lookup failed",
      detail: error?.message || "Unknown error",
    });
  }
}
