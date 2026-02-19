import OpenAI from "openai";
import { z } from "zod";
import type { RuntimeConfig } from "../config/env.js";
import type { DiagnosisResult } from "./diagnose.js";
import type { ShortMetrics, ShortVideo } from "../youtube/data.js";
import { extractResponseText, safeJsonParse } from "../utils/openai.js";

const captionCueSchema = z.object({
  startSec: z.number().min(0),
  endSec: z.number().min(0),
  text: z.string().min(1),
  styleHint: z.string().optional(),
});

const sceneSchema = z.object({
  id: z.string().min(1),
  startSec: z.number().min(0),
  endSec: z.number().min(0),
  segment: z.string().min(1),
  objective: z.string().min(1),
  visuals: z.array(z.string()).min(1),
  overlays: z.array(z.string()).min(1),
  audioCues: z.array(z.string()).min(1),
  editNotes: z.array(z.string()).min(1),
});

export const variantPlanSchema = z.object({
  version: z.literal("shorts-optimizer.variant.v1"),
  videoId: z.string().min(1),
  generatedAt: z.string().min(1),
  sourceVideoTitle: z.string().min(1),
  primaryFix: z.string().min(1),
  hookLine: z.string().min(1),
  firstFrame: z.object({
    visual: z.string().min(1),
    subtitleLine: z.string().min(1),
    motionCue: z.string().min(1),
  }),
  script: z.string().min(1),
  timeline: z.object({
    totalDurationSec: z.number().min(40).max(60),
    scenes: z.array(sceneSchema).min(4),
    captions: z.array(captionCueSchema).min(4),
    loop: z.object({
      handoffSec: z.number().min(0),
      bridgeLine: z.string().min(1),
      visualCue: z.string().min(1),
    }),
  }),
  metadata: z.object({
    title: z.string().min(1),
    hashtags: z.array(z.string().min(1)).min(2),
    tags: z.array(z.string().min(1)).min(2),
    pinnedComment: z.string().min(1),
  }),
  editDecisionList: z
    .array(
      z.object({
        metric: z.string().min(1),
        signal: z.string().min(1),
        change: z.string().min(1),
        why: z.string().min(1),
      }),
    )
    .min(1),
});

export type VariantPlan = z.infer<typeof variantPlanSchema>;

function sanitizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/giu, "")
    .trim();
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function inferCoreIdea(title: string): string {
  const compact = title.replace(/[()]/gu, " ").replace(/\s+/gu, " ").trim();
  return compact.length > 80 ? compact.slice(0, 80).trim() : compact;
}

function hasLowCtr(diagnosis: DiagnosisResult): boolean {
  return diagnosis.whyEntries.some(
    (entry) =>
      entry.metric === "impressionClickThroughRate" &&
      entry.change.toLowerCase().includes("title"),
  );
}

function buildFallbackPlan(params: {
  video: ShortVideo;
  metrics: ShortMetrics;
  diagnosis: DiagnosisResult;
  generatedAt: string;
}): VariantPlan {
  const coreIdea = inferCoreIdea(params.video.title);
  const hookLine = hasLowCtr(params.diagnosis)
    ? `Stop scrolling: ${coreIdea} is not what most people think.`
    : `Quick reality check: ${coreIdea}.`;

  const title = hasLowCtr(params.diagnosis)
    ? `${coreIdea} (The Real Fix in 50s)`
    : coreIdea;

  const tags = unique(
    [...(params.video.tags ?? []), "shorts", "youtube-shorts", "high-retention"]
      .map(sanitizeTag)
      .filter(Boolean),
  ).slice(0, 10);

  const hashtags = unique(tags.map((tag) => `#${tag}`)).slice(0, 8);

  const scriptLines = [
    `[0-2s] ${hookLine}`,
    "[3-12s] Context: one sentence setup, why this problem matters now.",
    "[13-35s] Core insight: one idea, one contrast, one proof point.",
    "[36-50s] Payoff: reframe mistake and state practical fix clearly.",
    "[50-55s] CTA: ask a focused follow-up question to trigger comments.",
  ];

  const script = scriptLines.join("\n");

  const scenes: VariantPlan["timeline"]["scenes"] = [
    {
      id: "scene-01-hook",
      startSec: 0,
      endSec: 2,
      segment: "hook",
      objective: "Pattern interrupt in first frame to improve CTR.",
      visuals: [
        "Begin mid-thought with immediate motion and tight crop.",
        "Use high-contrast object/action tied to the core claim.",
      ],
      overlays: [hookLine],
      audioCues: ["Short hit + whoosh at 0.2s"],
      editNotes: ["No greeting or branding card before the hook."],
    },
    {
      id: "scene-02-context",
      startSec: 3,
      endSec: 12,
      segment: "context compression",
      objective: "Set context fast with one-sentence chunks.",
      visuals: [
        "Switch framing every 2-3s.",
        "Use one concrete visual anchor for the problem.",
      ],
      overlays: ["Why this matters right now"],
      audioCues: ["Beat continues, no dead air"],
      editNotes: ["Subtitle timing locked to spoken pauses."],
    },
    {
      id: "scene-03-breakdown",
      startSec: 13,
      endSec: 35,
      segment: "core insight",
      objective: "Deliver one insight with contrast and number.",
      visuals: [
        "Before vs after visual progression.",
        "Add micro-zoom every 3-5s.",
      ],
      overlays: ["One idea only"],
      audioCues: ["Subtle emphasis on the key numeric point"],
      editNotes: ["Cut filler phrases to keep pacing dense."],
    },
    {
      id: "scene-04-payoff",
      startSec: 36,
      endSec: 50,
      segment: "payoff",
      objective: "Clarify mistake vs real fix.",
      visuals: ["Summarize with a clean, high-contrast frame."],
      overlays: ["The real issue is X -> Y"],
      audioCues: ["Resolve tone; slight downbeat pause before CTA"],
      editNotes: ["Move payoff earlier if completion is weak."],
    },
    {
      id: "scene-05-cta-loop",
      startSec: 50,
      endSec: 55,
      segment: "curiosity CTA",
      objective: "Create comment-triggering open loop.",
      visuals: ["Mirror opening shot with unresolved next-step question."],
      overlays: ["Should I test this next?"],
      audioCues: ["Hold last beat for loop-ready cut"],
      editNotes: ["Avoid generic 'like & subscribe'."],
    },
  ];

  const captions: VariantPlan["timeline"]["captions"] = [
    { startSec: 0, endSec: 2, text: hookLine, styleHint: "bold-high-contrast" },
    {
      startSec: 3,
      endSec: 8,
      text: "Most people miss this one detail.",
      styleHint: "standard",
    },
    {
      startSec: 8,
      endSec: 12,
      text: "Here is the context in one sentence.",
      styleHint: "standard",
    },
    {
      startSec: 13,
      endSec: 25,
      text: "Core insight with contrast and proof.",
      styleHint: "emphasis",
    },
    {
      startSec: 25,
      endSec: 35,
      text: "This is where most viewers drop if pacing slows.",
      styleHint: "standard",
    },
    {
      startSec: 36,
      endSec: 50,
      text: "So the real issue is not X, it is Y.",
      styleHint: "emphasis",
    },
    {
      startSec: 50,
      endSec: 55,
      text: "Want part 2 on this? Comment your take.",
      styleHint: "cta",
    },
  ];

  const editDecisionList = params.diagnosis.whyEntries.map((entry) => ({
    metric: entry.metric,
    signal: entry.trigger,
    change: entry.change,
    why: entry.why,
  }));

  return {
    version: "shorts-optimizer.variant.v1",
    videoId: params.video.videoId,
    generatedAt: params.generatedAt,
    sourceVideoTitle: params.video.title,
    primaryFix: params.diagnosis.primaryFix,
    hookLine,
    firstFrame: {
      visual: "Immediate motion close-up tied to the core claim.",
      subtitleLine: hookLine,
      motionCue: "Hard punch-in within first 0.5s",
    },
    script,
    timeline: {
      totalDurationSec: 55,
      scenes,
      captions,
      loop: {
        handoffSec: 54,
        bridgeLine: "But the next test changes everything.",
        visualCue: "Last frame mirrors first frame for seamless loop",
      },
    },
    metadata: {
      title,
      hashtags,
      tags,
      pinnedComment: "What should I test next: hook, pacing, or payoff?",
    },
    editDecisionList,
  };
}

function mergeFallbackWithCandidate(
  fallback: VariantPlan,
  candidate: Partial<VariantPlan>,
): VariantPlan {
  return {
    ...fallback,
    ...candidate,
    firstFrame: {
      ...fallback.firstFrame,
      ...(candidate.firstFrame ?? {}),
    },
    timeline: {
      ...fallback.timeline,
      ...(candidate.timeline ?? {}),
      scenes: candidate.timeline?.scenes ?? fallback.timeline.scenes,
      captions: candidate.timeline?.captions ?? fallback.timeline.captions,
      loop: {
        ...fallback.timeline.loop,
        ...(candidate.timeline?.loop ?? {}),
      },
    },
    metadata: {
      ...fallback.metadata,
      ...(candidate.metadata ?? {}),
    },
    editDecisionList: candidate.editDecisionList ?? fallback.editDecisionList,
  };
}

function ensureMandatoryDecisionCoverage(
  plan: VariantPlan,
  diagnosis: DiagnosisResult,
): VariantPlan {
  const existing = new Set(
    plan.editDecisionList.map((entry) => `${entry.metric}::${entry.change.toLowerCase()}`),
  );

  const merged = [...plan.editDecisionList];

  for (const entry of diagnosis.whyEntries) {
    const key = `${entry.metric}::${entry.change.toLowerCase()}`;
    if (!existing.has(key)) {
      merged.push({
        metric: entry.metric,
        signal: entry.trigger,
        change: entry.change,
        why: entry.why,
      });
      existing.add(key);
    }
  }

  return {
    ...plan,
    editDecisionList: merged,
  };
}

async function runLlmRewrite(params: {
  config: RuntimeConfig;
  video: ShortVideo;
  metrics: ShortMetrics;
  diagnosis: DiagnosisResult;
  skillRules: string;
  fallback: VariantPlan;
}): Promise<VariantPlan | null> {
  if (!params.config.openAiApiKey) {
    return null;
  }

  const client = new OpenAI({ apiKey: params.config.openAiApiKey });

  const response = await client.responses.create({
    model: params.config.openAiModel,
    temperature: 0,
    max_output_tokens: 2400,
    text: {
      format: {
        type: "json_schema",
        name: "shorts_variant",
        schema: {
          type: "object",
          additionalProperties: false,
          required: [
            "version",
            "videoId",
            "generatedAt",
            "sourceVideoTitle",
            "primaryFix",
            "hookLine",
            "firstFrame",
            "script",
            "timeline",
            "metadata",
            "editDecisionList",
          ],
          properties: {
            version: { type: "string" },
            videoId: { type: "string" },
            generatedAt: { type: "string" },
            sourceVideoTitle: { type: "string" },
            primaryFix: { type: "string" },
            hookLine: { type: "string" },
            firstFrame: {
              type: "object",
              additionalProperties: false,
              required: ["visual", "subtitleLine", "motionCue"],
              properties: {
                visual: { type: "string" },
                subtitleLine: { type: "string" },
                motionCue: { type: "string" },
              },
            },
            script: { type: "string" },
            timeline: {
              type: "object",
              additionalProperties: false,
              required: ["totalDurationSec", "scenes", "captions", "loop"],
              properties: {
                totalDurationSec: { type: "number" },
                scenes: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: [
                      "id",
                      "startSec",
                      "endSec",
                      "segment",
                      "objective",
                      "visuals",
                      "overlays",
                      "audioCues",
                      "editNotes",
                    ],
                    properties: {
                      id: { type: "string" },
                      startSec: { type: "number" },
                      endSec: { type: "number" },
                      segment: { type: "string" },
                      objective: { type: "string" },
                      visuals: { type: "array", items: { type: "string" } },
                      overlays: { type: "array", items: { type: "string" } },
                      audioCues: { type: "array", items: { type: "string" } },
                      editNotes: { type: "array", items: { type: "string" } },
                    },
                  },
                },
                captions: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["startSec", "endSec", "text"],
                    properties: {
                      startSec: { type: "number" },
                      endSec: { type: "number" },
                      text: { type: "string" },
                      styleHint: { type: "string" },
                    },
                  },
                },
                loop: {
                  type: "object",
                  additionalProperties: false,
                  required: ["handoffSec", "bridgeLine", "visualCue"],
                  properties: {
                    handoffSec: { type: "number" },
                    bridgeLine: { type: "string" },
                    visualCue: { type: "string" },
                  },
                },
              },
            },
            metadata: {
              type: "object",
              additionalProperties: false,
              required: ["title", "hashtags", "tags", "pinnedComment"],
              properties: {
                title: { type: "string" },
                hashtags: { type: "array", items: { type: "string" } },
                tags: { type: "array", items: { type: "string" } },
                pinnedComment: { type: "string" },
              },
            },
            editDecisionList: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["metric", "signal", "change", "why"],
                properties: {
                  metric: { type: "string" },
                  signal: { type: "string" },
                  change: { type: "string" },
                  why: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: [
              "You are a Shorts rewrite planner.",
              "Use ytshortsak rules exactly: hook under 2s, one idea only, 45-55s target, captions always on, dynamic visual changes every 2-3s.",
              "Do not output ffmpeg steps. Output edit decisions + timeline JSON only.",
              "Always keep baseline metric-linked decisions in editDecisionList.",
              "Canonical rules:",
              params.skillRules,
            ].join("\n\n"),
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify(
              {
                video: params.video,
                metrics: params.metrics,
                diagnosis: params.diagnosis,
                requiredBaselineDecisions: params.diagnosis.whyEntries,
                fallbackTemplate: params.fallback,
              },
              null,
              2,
            ),
          },
        ],
      },
    ],
  });

  const text = extractResponseText(response);
  const parsed = safeJsonParse<unknown>(text);
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const merged = mergeFallbackWithCandidate(
    params.fallback,
    parsed as Partial<VariantPlan>,
  );

  const validated = variantPlanSchema.parse(merged);
  return ensureMandatoryDecisionCoverage(validated, params.diagnosis);
}

export async function rewriteShortVariant(params: {
  config: RuntimeConfig;
  video: ShortVideo;
  metrics: ShortMetrics;
  diagnosis: DiagnosisResult;
  skillRules: string;
  generatedAt: string;
}): Promise<VariantPlan> {
  const fallback = buildFallbackPlan({
    video: params.video,
    metrics: params.metrics,
    diagnosis: params.diagnosis,
    generatedAt: params.generatedAt,
  });

  const llmPlan = await runLlmRewrite({
    config: params.config,
    video: params.video,
    metrics: params.metrics,
    diagnosis: params.diagnosis,
    skillRules: params.skillRules,
    fallback,
  }).catch(() => null);

  return llmPlan ?? fallback;
}
