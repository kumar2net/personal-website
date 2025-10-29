const BASE = "https://api.x.com/2";
const COMMON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function xFetch(path, token) {
  const response = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "personal-website-x-latest",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const error = new Error(`X API error ${response.status}`);
    error.status = response.status;
    error.details = text;
    throw error;
  }

  return response.json();
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    return res.status(200).end();
  }

  try {
    const token = process.env.X_BEARER_TOKEN;
    const username = (req.query && req.query.username) || "kumar2net";

    if (!token) {
      Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
        res.setHeader(key, value),
      );
      res.setHeader("content-type", "application/json");
      return res
        .status(503)
        .json({ error: "X_BEARER_TOKEN not configured" });
    }

    const userResp = await xFetch(
      `/users/by/username/${encodeURIComponent(username)}?user.fields=profile_image_url`,
      token,
    );
    const userId = userResp?.data?.id;
    if (!userId) {
      Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
        res.setHeader(key, value),
      );
      res.setHeader("content-type", "application/json");
      return res.status(404).json({ error: "User not found" });
    }

    const tweetsResp = await xFetch(
      `/users/${userId}/tweets?max_results=5&tweet.fields=created_at`,
      token,
    );
    const tweets = tweetsResp?.data || [];

    const items = tweets.map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      url: `https://twitter.com/${username}/status/${tweet.id}`,
    }));

    Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    res.setHeader("content-type", "application/json");
    res.setHeader("cache-control", "public, max-age=300");
    return res.status(200).json({ username, items });
  } catch (err) {
    const status = err && err.status ? err.status : 500;
    Object.entries(COMMON_HEADERS).forEach(([key, value]) =>
      res.setHeader(key, value),
    );
    res.setHeader("content-type", "application/json");
    return res.status(status).json({
      error: "Failed to fetch X posts",
      details: String(
        (err && err.details) || (err && err.message) || err,
      ),
    });
  }
}
