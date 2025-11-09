import { kv } from "@vercel/kv";

export const runtime = "edge";

export default async function handler(req) {
  const url = new URL(req.url);
  const week = url.searchParams.get("week");
  const data = await kv.get(`gen:chronicle:${week}`);
  if (!data) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  return new Response(data, { headers: { "content-type": "application/json" } });
}
