import { GoogleAuth } from "google-auth-library";

const SITE_URL = "https://kumar2net.com/";
const SITEMAP_URL = "https://kumar2net.com/sitemap.xml";

function parseServiceAccountJson(raw) {
  if (!raw || typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      "Invalid GSC_SERVICE_ACCOUNT_KEY_JSON (must be valid JSON).",
    );
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const keyJson = process.env.GSC_SERVICE_ACCOUNT_KEY_JSON;
    if (!keyJson) {
      return res.status(200).json({
        ok: false,
        skipped: true,
        reason: "Missing GSC_SERVICE_ACCOUNT_KEY_JSON",
      });
    }

    const credentials = parseServiceAccountJson(keyJson);
    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/webmasters"],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    if (!accessToken) {
      throw new Error("Could not retrieve access token.");
    }

    const encodedSiteUrl = encodeURIComponent(SITE_URL);
    const encodedSitemapUrl = encodeURIComponent(SITEMAP_URL);
    const apiEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps/${encodedSitemapUrl}`;

    const response = await fetch(apiEndpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const details = await response.text();
      return res.status(response.status).json({
        ok: false,
        error: "Sitemap submission failed",
        status: response.status,
        statusText: response.statusText,
        details,
      });
    }

    return res.status(200).json({ ok: true, submitted: true });
  } catch (error) {
    console.error("[sitemap-submit] Handler failed:", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to submit sitemap",
      details: error?.message || String(error),
    });
  }
}

