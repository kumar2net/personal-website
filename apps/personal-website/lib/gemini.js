import { GoogleAuth } from "google-auth-library";

const GEMINI_SCOPES = [
  "https://www.googleapis.com/auth/generative-language",
];

let authClientPromise = null;

function getDefaultModel() {
  return process.env.GEMINI_EMBED_MODEL || "text-embedding-004";
}

function getApiBase() {
  return (
    process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com"
  );
}

function getApiKey() {
  return process.env.GEMINI_API_KEY?.trim() || "";
}

function getServiceAccountCredentials() {
  const raw = process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    return null;
  }
  if (
    raw.includes("YOUR_PROJECT") ||
    raw.includes('"..."') ||
    raw.includes("'...'")
  ) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (
      !parsed?.private_key ||
      typeof parsed.private_key !== "string" ||
      parsed.private_key.includes("...")
    ) {
      return null;
    }
    return parsed;
  } catch (err) {
    throw new Error(
      `GCP_SERVICE_ACCOUNT_JSON is not valid JSON: ${err.message || err}`,
    );
  }
}

async function getAuthClient() {
  if (!authClientPromise) {
    const credentials = getServiceAccountCredentials();
    if (!credentials) {
      authClientPromise = Promise.resolve(null);
    } else {
      const auth = new GoogleAuth({
        credentials,
        scopes: GEMINI_SCOPES,
      });
      authClientPromise = auth.getClient().catch((err) => {
        console.warn(
          "[gemini] Failed to initialize service account auth, falling back to API key if available:",
          err?.message || err,
        );
        return null;
      });
    }
  }
  return authClientPromise;
}

async function getAuthHeaders() {
  const client = await getAuthClient();
  if (client) {
    const accessToken = await client.getAccessToken();
    const token =
      typeof accessToken === "string" ? accessToken : accessToken?.token;
    if (!token) {
      throw new Error("Failed to obtain OAuth token for Gemini API");
    }
    return { Authorization: `Bearer ${token}` };
  }
  const apiKey = getApiKey();
  if (apiKey) {
    return { "x-goog-api-key": apiKey };
  }
  throw new Error(
    "Gemini credentials missing. Set GCP_SERVICE_ACCOUNT_JSON or GEMINI_API_KEY.",
  );
}

export async function embedTextWithGemini(
  text,
  { model } = {},
) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required to generate embeddings");
  }
  const headers = await getAuthHeaders();
  const resolvedModel = model || getDefaultModel();
  let url = `${getApiBase()}/v1beta/models/${resolvedModel}:embedContent`;
  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };
  const apiKey = headers["x-goog-api-key"];
  if (apiKey) {
    url = `${url}?key=${encodeURIComponent(apiKey)}`;
    delete requestHeaders["x-goog-api-key"];
  }
  const body = {
    content: {
      parts: [{ text }],
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `${headers.Authorization ? "Gemini OAuth embed error" : "Gemini embed error"}: ${
        res.status
      } ${errText}`,
    );
  }

  const data = await res.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values)) {
    throw new Error("Gemini response missing embedding values");
  }
  return values.map((value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  });
}
