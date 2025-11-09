import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { persistChronicle } from "./chronicle-store";

type ReflectionEntry = {
  id?: string;
  text: string;
  emoji?: string;
};

const hasKvConfig = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);

const fallbackReflections: ReflectionEntry[] = [
  { id: "ops", text: "Ops standup regained rhythm once async video updates replaced status pings.", emoji: "📼" },
  { id: "launch", text: "Launch retro crackled with customer quotes; team still flagged energy debt from back-to-back pushes.", emoji: "⚡️" },
  { id: "team", text: "Hiring chat felt muted—short sentences and filler words hint at decision fatigue creeping in.", emoji: "🧠" },
  { id: "evening", text: "Late-night log circled the same blocker four times; asks for support were implied but rarely made explicit.", emoji: "🌙" },
];

export const runtime = "nodejs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  let payload: { promptId?: string } = {};
  try {
    payload = normalizeBody(req);
  } catch (error) {
    console.error("Invalid JSON payload for chronicle merge", error);
    return res.status(400).json({ ok: false, error: "Invalid request body" });
  }

  const { promptId } = payload;
  if (!promptId) {
    return res.status(400).json({ ok: false, error: "Missing promptId" });
  }

  try {
    const entries = await loadEntries(promptId);
    if (!entries.length) {
      return res.status(404).json({ ok: false, error: "No reflections found for this week" });
    }

    const text = hasOpenAIKey
      ? await mergeWithOpenAI(entries)
      : buildLocalChronicle(entries, promptId);

    const chronicle = {
      id: `chron_${Date.now()}`,
      week: promptId,
      text,
      createdAt: new Date().toISOString(),
    };

    persistChronicle(chronicle);
    if (hasKvConfig) {
      await kv.set(`gen:chronicle:${promptId}`, JSON.stringify(chronicle));
    }

    return res.status(200).json({ ok: true, chronicle });
  } catch (error) {
    console.error("Chronicle merge failed", error);
    return res.status(500).json({ ok: false, error: "Failed to merge chronicle" });
  }
}

async function loadEntries(promptId: string): Promise<ReflectionEntry[]> {
  if (hasKvConfig) {
    const key = `gen:entries:${promptId}`;
    const raw = await kv.lrange(key, 0, -1);
    if (!raw) return [];
    return raw
      .map((entry) => {
        try {
          return JSON.parse(entry) as ReflectionEntry;
        } catch (error) {
          console.warn("Failed to parse reflection entry", error);
          return null;
        }
      })
      .filter((entry): entry is ReflectionEntry => Boolean(entry?.text));
  }

  return fallbackReflections;
}

async function mergeWithOpenAI(entries: ReflectionEntry[]) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const combined = entries.map((entry) => `• ${entry.text}`).join("\n");
  const mergePrompt = `Combine these reflections into a warm, poetic narrative for the family chronicle:\n${combined}`;
  const llm = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: mergePrompt }],
  });
  return llm.choices[0]?.message?.content ?? combined;
}

function buildLocalChronicle(entries: ReflectionEntry[], promptId: string) {
  const intro = `Week ${promptId} carried a textured pulse—equal parts steady craft and honest tension.`;
  const body = entries
    .map((entry) => {
      const prefix = entry.emoji ? `${entry.emoji} ` : "";
      return `${prefix}${entry.text}`;
    })
    .join(" ");
  const close =
    "Keep the rituals gentle, make the asks specific, and ship one bold experiment before Sunday resets the board.";

  return `${intro}\n\n${body}\n\n${close}`;
}

function normalizeBody(req: VercelRequest) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    if (!req.body.trim()) return {};
    return JSON.parse(req.body);
  }
  if (Buffer.isBuffer(req.body)) {
    const raw = req.body.toString("utf8");
    if (!raw.trim()) return {};
    return JSON.parse(raw);
  }
  return req.body as Record<string, unknown>;
}
