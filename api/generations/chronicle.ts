import { kv } from "@vercel/kv";
import { readChronicle } from "./chronicle-store";

const hasKvConfig = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export const runtime = "edge";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const week = url.searchParams.get("week");
  if (!week) {
    return new Response(JSON.stringify({ error: "Missing week parameter" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (hasKvConfig) {
    const data = await kv.get(`gen:chronicle:${week}`);
    if (data) {
      const payload = typeof data === "string" ? data : JSON.stringify(data);
      return new Response(payload, { headers: { "content-type": "application/json" } });
    }
  }

  const fallback = readChronicle(week);
  if (fallback) {
    return new Response(JSON.stringify(fallback), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "content-type": "application/json" },
  });
}
