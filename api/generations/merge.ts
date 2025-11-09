import OpenAI from "openai";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { promptId } = req.body || {};
  const key = `gen:entries:${promptId}`;

  const raw = await kv.lrange(key, 0, -1);
  const entries = raw.map((e) => JSON.parse(e));

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const combined = entries.map((e) => `• ${e.text}`).join("\n");

  const mergePrompt = `Combine these reflections into a warm, poetic narrative for the family chronicle:\n${combined}`;

  const llm = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: mergePrompt }],
  });

  const mergedText = llm.choices[0].message.content;
  const chronicle = {
    id: `chron_${Date.now()}`,
    week: promptId,
    text: mergedText,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`gen:chronicle:${promptId}`, JSON.stringify(chronicle));
  res.json({ ok: true, chronicle });
}
