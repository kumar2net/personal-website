import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { persistChronicle } from "./chronicle-store";

type ReflectionEntry = {
  id?: string;
  text: string;
  emoji?: string;
};

type OpenAIUsageDetails = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

type ChronicleBuildResult = {
  text: string;
  usage?: OpenAIUsageDetails;
  model?: string;
  usedFallback?: boolean;
  fallbackReason?: string;
};

type PricingInfo = {
  displayName: string;
  promptPer1K: number;
  completionPer1K: number;
};

type OpenAITokenUsagePayload = {
  source: "openai";
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  promptRatePer1k: number;
  completionRatePer1k: number;
};

type FallbackTokenUsagePayload = {
  source: "fallback";
  message: string;
};

type TokenUsagePayload = OpenAITokenUsagePayload | FallbackTokenUsagePayload;

const hasKvConfig = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);

const DEFAULT_MODEL = "gpt-5.1";

function parseEnvNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isNaN(value) ? fallback : value;
}

const MODEL_PRICING: Record<string, PricingInfo> = {
  [DEFAULT_MODEL]: {
    displayName: "GPT-5.1",
    promptPer1K: parseEnvNumber(
      "GENERATIONS_GPT5_1_PROMPT_COST_PER_1K",
      parseEnvNumber("GENERATIONS_GPT4O_MINI_PROMPT_COST_PER_1K", 0.0015),
    ),
    completionPer1K: parseEnvNumber(
      "GENERATIONS_GPT5_1_COMPLETION_COST_PER_1K",
      parseEnvNumber("GENERATIONS_GPT4O_MINI_COMPLETION_COST_PER_1K", 0.0035),
    ),
  },
};

function getPricingForModel(model: string): PricingInfo {
  return MODEL_PRICING[model] ?? MODEL_PRICING[DEFAULT_MODEL];
}

function buildTokenUsagePayload(
  usage: OpenAIUsageDetails,
  model: string = DEFAULT_MODEL,
): OpenAITokenUsagePayload {
  const pricing = getPricingForModel(model);
  const promptTokens = usage.promptTokens ?? 0;
  const completionTokens = usage.completionTokens ?? 0;
  const totalTokens = usage.totalTokens ?? promptTokens + completionTokens;
  const promptCost = (promptTokens / 1000) * pricing.promptPer1K;
  const completionCost = (completionTokens / 1000) * pricing.completionPer1K;
  const costUsd = promptCost + completionCost;

  return {
    source: "openai",
    model: pricing.displayName,
    promptTokens,
    completionTokens,
    totalTokens,
    costUsd,
    promptRatePer1k: pricing.promptPer1K,
    completionRatePer1k: pricing.completionPer1K,
  };
}

function createFallbackUsage(reason?: string): FallbackTokenUsagePayload {
  const baseMessage = hasOpenAIKey
    ? "OpenAI merge was skipped or failed; presenting a local chronicle so no tokens were billed."
    : "No OpenAI API key configured; using the local chronicle generator.";
  return {
    source: "fallback",
    message: reason ? `${reason}. ${baseMessage}` : baseMessage,
  };
}

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
  if (!promptId) return res.status(400).json({ ok: false, error: "Missing promptId" });

  try {
    const entries = await loadEntries(promptId);
    if (!entries.length) {
      return res.status(404).json({ ok: false, error: "No reflections found for this week" });
    }

    const { text, usage, model, fallbackReason } = await buildChronicleText(entries, promptId);

    const chronicle = {
      id: `chron_${Date.now()}`,
      week: promptId,
      text,
      createdAt: new Date().toISOString(),
    };

    persistChronicle(chronicle);
    if (hasKvConfig) {
      try {
        await kv.set(`gen:chronicle:${promptId}`, JSON.stringify(chronicle));
      } catch (error) {
        console.warn("KV chronicle cache failed", error);
      }
    }

    const tokenUsage = usage
      ? buildTokenUsagePayload(usage, model ?? DEFAULT_MODEL)
      : createFallbackUsage(fallbackReason);

    return res.status(200).json({ ok: true, chronicle, tokenUsage });
  } catch (error) {
    console.error("Chronicle merge failed", error);
    return res.status(500).json({ ok: false, error: "Failed to merge chronicle" });
  }
}

async function loadEntries(promptId: string): Promise<ReflectionEntry[]> {
  if (hasKvConfig) {
    try {
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
    } catch (error) {
      console.warn("KV reflections read failed, falling back to static entries", error);
    }
  }

  return fallbackReflections;
}

async function buildChronicleText(entries: ReflectionEntry[], promptId: string): Promise<ChronicleBuildResult> {
  if (!hasOpenAIKey) {
    return {
      text: buildLocalChronicle(entries, promptId),
      usedFallback: true,
      fallbackReason: "OpenAI API key not provided",
    };
  }

  try {
    return await mergeWithOpenAI(entries);
  } catch (error) {
    console.warn("OpenAI merge failed, falling back to local chronicle", error);
    return {
      text: buildLocalChronicle(entries, promptId),
      usedFallback: true,
      fallbackReason: "OpenAI merge failed",
    };
  }
}

async function mergeWithOpenAI(entries: ReflectionEntry[]): Promise<ChronicleBuildResult> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const combined = entries.map((entry) => `• ${entry.text}`).join("\n");
  const mergePrompt = `Combine these reflections into a warm, poetic narrative for the family chronicle:\n${combined}`;
  const llm = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: "user", content: mergePrompt }],
  });
  const usage: OpenAIUsageDetails = {
    promptTokens: llm.usage?.prompt_tokens ?? 0,
    completionTokens: llm.usage?.completion_tokens ?? 0,
    totalTokens: llm.usage?.total_tokens ?? 0,
  };
  return {
    text: llm.choices[0]?.message?.content ?? combined,
    usage,
    model: DEFAULT_MODEL,
  };
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
