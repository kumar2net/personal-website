import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import OpenAI from "openai";
import { z } from "zod";
import type { RuntimeConfig } from "../config/env.js";
import type { DiagnosisResult } from "./diagnose.js";
import type { VariantPlan } from "./rewrite.js";
import type { ShortMetrics, ShortVideo } from "../youtube/data.js";
import { extractResponseText, safeJsonParse } from "../utils/openai.js";

const competitorPatternSchema = z.object({
  title: z.string().min(1),
  hook: z.string().optional().default(""),
  angle: z.string().optional().default(""),
  whyItWorked: z.string().optional().default(""),
});

export const experimentContextSchema = z.object({
  creatorGoals: z.array(z.string().min(1)).default([]),
  audience: z.string().optional().default(""),
  transcript: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  competitors: z.array(competitorPatternSchema).default([]),
});

export type ExperimentContext = z.infer<typeof experimentContextSchema>;

export const experimentPlanSchema = z.object({
  version: z.literal("shorts-optimizer.experiment.v1"),
  videoId: z.string().min(1),
  generatedAt: z.string().min(1),
  sourceVideoTitle: z.string().min(1),
  primaryObjective: z.string().min(1),
  contextSummary: z.string().min(1),
  inputsUsed: z.array(z.string().min(1)).default([]),
  experiments: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        hypothesis: z.string().min(1),
        priority: z.enum(["high", "medium", "low"]),
        changes: z.array(z.string().min(1)).min(2),
        successMetrics: z
          .array(
            z.object({
              metric: z.string().min(1),
              target: z.string().min(1),
              why: z.string().min(1),
            }),
          )
          .min(1),
        guardrails: z.array(z.string().min(1)).min(1),
        basedOn: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(2)
    .max(4),
  nextCaptureRequests: z.array(z.string().min(1)).default([]),
});

export type ExperimentPlan = z.infer<typeof experimentPlanSchema>;

interface RecentHistoryEntry {
  timestamp: string;
  ctr: number | null;
  averageViewPercentage: number | null;
  averageViewDuration: number | null;
  primaryFix: string;
  title: string;
  hookLine: string;
}

function pct(value: number | null): string {
  return value == null ? "n/a" : `${value.toFixed(2)}%`;
}

function sec(value: number | null): string {
  return value == null ? "n/a" : `${value.toFixed(2)}s`;
}

function buildTargetText(params: {
  metric: "ctr" | "avg_view_pct" | "avg_view_duration";
  current: number | null;
}): string {
  const { metric, current } = params;

  if (metric === "ctr") {
    if (current == null) {
      return "Establish a measurable CTR baseline after the next upload window.";
    }
    const target = Math.max(4, current + 1);
    return `Lift CTR from ${current.toFixed(2)}% to at least ${target.toFixed(2)}%.`;
  }

  if (metric === "avg_view_pct") {
    if (current == null) {
      return "Raise average view percentage once a retention baseline is available.";
    }
    const target = Math.max(60, current + 8);
    return `Lift average view % from ${current.toFixed(2)}% to at least ${target.toFixed(2)}%.`;
  }

  if (current == null) {
    return "Raise average view duration once a watched-seconds baseline is available.";
  }
  const target = Math.max(20, current + 4);
  return `Lift average view duration from ${current.toFixed(2)}s to at least ${target.toFixed(2)}s.`;
}

function summarizeContext(
  context: ExperimentContext | null,
  recentHistory: RecentHistoryEntry[],
): { summary: string; inputsUsed: string[]; nextCaptureRequests: string[] } {
  const parts: string[] = [];
  const inputsUsed: string[] = [];
  const nextCaptureRequests: string[] = [];

  if (context?.creatorGoals.length) {
    inputsUsed.push("creator goals");
    parts.push(`Creator goals: ${context.creatorGoals.join("; ")}.`);
  } else {
    nextCaptureRequests.push("Add 1-3 creator goals so experiment ranking can optimize for comments, saves, or follows.");
  }

  if (context?.audience) {
    inputsUsed.push("audience brief");
    parts.push(`Audience: ${context.audience}.`);
  }

  if (context?.transcript) {
    inputsUsed.push("transcript");
    parts.push(`Transcript supplied (${context.transcript.length} chars).`);
  } else {
    nextCaptureRequests.push("Attach a transcript or rough spoken beat sheet to improve line-level hook tests.");
  }

  if (context?.notes) {
    inputsUsed.push("operator notes");
    parts.push(`Notes: ${context.notes}.`);
  }

  if (context?.competitors.length) {
    inputsUsed.push("competitor patterns");
    parts.push(
      `Competitor references: ${context.competitors
        .slice(0, 3)
        .map((entry) => entry.title)
        .join(", ")}.`,
    );
  } else {
    nextCaptureRequests.push("Add 2-3 competitor examples with hooks or angles for stronger packaging experiments.");
  }

  nextCaptureRequests.push(
    "Capture first-hour Reach screenshots, including Shorts-specific opening-hold metrics like Stayed to watch when available, so packaging tests separate thumbnail CTR from in-feed retention.",
  );

  if (recentHistory.length) {
    inputsUsed.push("recent optimizer history");
    const latest = recentHistory[0];
    parts.push(
      `Recent history: ${recentHistory.length} prior run(s); latest CTR ${pct(latest.ctr)}, avg view % ${pct(
        latest.averageViewPercentage,
      )}, avg duration ${sec(latest.averageViewDuration)}.`,
    );
  } else {
    nextCaptureRequests.push("Run at least one upload iteration so the planner can compare against actual prior variants.");
  }

  if (!parts.length) {
    parts.push("No extra planning inputs were supplied beyond the current metrics and generated variant.");
  }

  return {
    summary: parts.join(" "),
    inputsUsed,
    nextCaptureRequests,
  };
}

async function readJsonFile(filePath: string): Promise<unknown | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function loadRecentHistory(params: {
  outDir: string;
  videoId: string;
  limit?: number;
}): Promise<RecentHistoryEntry[]> {
  const limit = params.limit ?? 3;
  const videoDir = path.resolve(params.outDir, params.videoId);

  let entries;
  try {
    entries = await readdir(videoDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, limit);

  const history: RecentHistoryEntry[] = [];
  for (const directory of directories) {
    const baseDir = path.join(videoDir, directory);
    const [metricsRaw, variantRaw] = await Promise.all([
      readJsonFile(path.join(baseDir, "metrics.json")),
      readJsonFile(path.join(baseDir, "variant_plan.json")),
    ]);

    const metrics = metricsRaw as Partial<ShortMetrics> | null;
    const variant = variantRaw as Partial<VariantPlan> | null;
    if (!metrics || !variant) {
      continue;
    }

    history.push({
      timestamp: directory,
      ctr: typeof metrics.impressionClickThroughRate === "number" ? metrics.impressionClickThroughRate : null,
      averageViewPercentage:
        typeof metrics.averageViewPercentage === "number" ? metrics.averageViewPercentage : null,
      averageViewDuration:
        typeof metrics.averageViewDuration === "number" ? metrics.averageViewDuration : null,
      primaryFix: typeof variant.primaryFix === "string" ? variant.primaryFix : "n/a",
      title: typeof variant.metadata?.title === "string" ? variant.metadata.title : "n/a",
      hookLine: typeof variant.hookLine === "string" ? variant.hookLine : "n/a",
    });
  }

  return history;
}

export async function loadExperimentContext(filePath: string | null): Promise<ExperimentContext | null> {
  if (!filePath) {
    return null;
  }

  const raw = await readFile(path.resolve(filePath), "utf8");
  const parsed = JSON.parse(raw);
  return experimentContextSchema.parse(parsed);
}

export function buildDeterministicExperimentPlan(params: {
  video: ShortVideo;
  metrics: ShortMetrics;
  diagnosis: DiagnosisResult;
  variantPlan: VariantPlan;
  generatedAt: string;
  context: ExperimentContext | null;
  recentHistory: RecentHistoryEntry[];
}): ExperimentPlan {
  const hasLowCtr =
    params.metrics.impressionClickThroughRate != null &&
    params.metrics.impressionClickThroughRate < 4;
  const hasLowRetention =
    params.metrics.averageViewPercentage != null &&
    params.metrics.averageViewPercentage < 60;
  const hasLowDuration =
    params.metrics.averageViewDuration != null &&
    params.metrics.averageViewDuration < 20;

  const competitorHook = params.context?.competitors.find((entry) => entry.hook)?.hook || "";
  const competitorAngle = params.context?.competitors.find((entry) => entry.angle)?.angle || "";
  const contextBits = summarizeContext(params.context, params.recentHistory);
  const hookVariantBundles = params.variantPlan.hookVariants.slice(0, 3);

  const experiments: ExperimentPlan["experiments"] = [
    {
      id: "exp-packaging-reset",
      title: hasLowCtr
        ? "Packaging reset for the first two seconds"
        : "Packaging A/B for scroll-stop strength",
      hypothesis: hasLowCtr
        ? "CTR is being limited by weak first-frame packaging, so a tighter first frame, subtitle, and title bundle should raise impression conversion."
        : "Even with acceptable CTR, a sharper opening package should create a measurable lift without changing the core topic.",
      priority: hasLowCtr ? "high" : "medium",
      changes: [
        hookVariantBundles.length
          ? `Test ${hookVariantBundles.length} first-3-second bundles that each pair an open loop, motion cue, and value cue: ${hookVariantBundles
              .map(
                (entry) =>
                  `${entry.id} -> "${entry.subtitleLine}" / ${entry.motionCue} / ${entry.valueCue}`,
              )
              .join(" | ")}`
          : `Test a first frame built around: ${params.variantPlan.firstFrame.visual}`,
        `A/B the subtitle line against the current hook: "${params.variantPlan.firstFrame.subtitleLine}"`,
        competitorHook
          ? `Borrow the competitor hook pattern "${competitorHook}" while keeping the topic specific to this video.`
          : "Rewrite the title with tension + specificity and remove vague phrasing.",
      ],
      successMetrics: [
        {
          metric: "impressionClickThroughRate",
          target: buildTargetText({
            metric: "ctr",
            current: params.metrics.impressionClickThroughRate,
          }),
          why: "The first experiment should validate whether packaging, not content, is the main bottleneck.",
        },
      ],
      guardrails: [
        "Keep one idea only in the opening two seconds.",
        "No greeting, branding card, or slow setup before the claim lands.",
      ],
      basedOn: [
        params.diagnosis.primaryFix,
        `Current hook line: ${params.variantPlan.hookLine}`,
        `Current suggested title: ${params.variantPlan.metadata.title}`,
        hookVariantBundles.length
          ? `Prepared hook bundle IDs: ${hookVariantBundles.map((entry) => entry.id).join(", ")}`
          : "No alternate hook bundles available.",
      ],
    },
    {
      id: "exp-retention-pacing",
      title: hasLowRetention || hasLowDuration
        ? "Retention repair through faster pacing"
        : "Retention lift with stronger pattern interrupts",
      hypothesis:
        "Viewers are likely dropping after the opening promise, so denser pacing and earlier proof should improve watched percentage and watched seconds.",
      priority: hasLowRetention || hasLowDuration ? "high" : "medium",
      changes: [
        "Move the first proof point or payoff earlier into the 8-20s range.",
        "Insert a visible pattern interrupt or framing change every 2-3 seconds.",
        "Cut any setup lines that do not directly support the payoff.",
      ],
      successMetrics: [
        {
          metric: "averageViewPercentage",
          target: buildTargetText({
            metric: "avg_view_pct",
            current: params.metrics.averageViewPercentage,
          }),
          why: "This confirms whether faster structure improves mid-video retention.",
        },
        {
          metric: "averageViewDuration",
          target: buildTargetText({
            metric: "avg_view_duration",
            current: params.metrics.averageViewDuration,
          }),
          why: "Watched seconds are the quickest signal that the payoff is landing earlier.",
        },
      ],
      guardrails: [
        "Do not add extra topic branches.",
        "Keep the full runtime inside the 45-55s target zone unless the proof can land faster.",
      ],
      basedOn: [
        ...params.diagnosis.whyEntries.slice(0, 3).map((entry) => `${entry.metric}: ${entry.change}`),
        `Existing scene plan has ${params.variantPlan.timeline.scenes.length} scene(s).`,
      ],
    },
    {
      id: "exp-angle-proof",
      title: "Angle and proof experiment for comment lift",
      hypothesis:
        "A more specific angle, proof cue, or unresolved end question should create stronger audience response and clearer differentiation from prior variants.",
      priority: "medium",
      changes: [
        competitorAngle
          ? `Test a sharper angle inspired by: ${competitorAngle}`
          : "Lead with one concrete myth, misconception, or data point instead of a broad claim.",
        params.context?.transcript
          ? "Reuse exact transcript phrasing that sounds most direct and least explanatory."
          : "Replace generic explanation lines with one concrete proof statement.",
        `Close with a focused comment prompt instead of a generic CTA: "${params.variantPlan.metadata.pinnedComment}"`,
      ],
      successMetrics: [
        {
          metric: "comments per 1k views",
          target: "Increase qualified comments and replies versus the previous variant.",
          why: "This experiment tests whether the angle produces more conversation, not just passive watch time.",
        },
      ],
      guardrails: [
        "Do not add filler examples that delay the payoff.",
        "Use only one new proof cue or angle shift in this variant.",
      ],
      basedOn: [
        params.context?.notes || "No operator notes supplied.",
        params.recentHistory[0]
          ? `Latest prior run title: ${params.recentHistory[0].title}`
          : "No prior run history available.",
      ],
    },
    {
      id: "exp-cadence-recut",
      title: "Staggered recut cadence with distinct metadata",
      hypothesis:
        "Publishing the strongest atomic short first, then a proof-heavier recut 24-48 hours later with intentionally different metadata, should separate packaging learnings from concept-quality learnings.",
      priority: hasLowCtr || hasLowRetention ? "medium" : "low",
      changes: [
        "Ship the shortest high-clarity version first using the strongest hook bundle, not the proof-heaviest cut.",
        "Queue a follow-up recut 24-48 hours later that adds proof or context without reusing the exact title and opening package.",
        "Change the follow-up title and first-frame packaging materially so the comparison is readable across discovery surfaces.",
      ],
      successMetrics: [
        {
          metric: "variant-sequence lift",
          target:
            "Identify which release in the sequence wins on packaging (CTR) versus content hold (average view % and watched seconds).",
          why: "A staggered sequence prevents one upload from hiding whether packaging or structure was the real issue.",
        },
      ],
      guardrails: [
        "Do not republish the same file with only punctuation-level metadata tweaks.",
        "Keep the second release meaningfully distinct in packaging or proof density.",
      ],
      basedOn: [
        `Current primary title: ${params.variantPlan.metadata.title}`,
        params.recentHistory[0]
          ? `Latest prior hook line: ${params.recentHistory[0].hookLine}`
          : "No prior hook history available.",
      ],
    },
  ];

  return {
    version: "shorts-optimizer.experiment.v1",
    videoId: params.video.videoId,
    generatedAt: params.generatedAt,
    sourceVideoTitle: params.video.title,
    primaryObjective: params.diagnosis.primaryFix,
    contextSummary: contextBits.summary,
    inputsUsed: contextBits.inputsUsed,
    experiments,
    nextCaptureRequests: contextBits.nextCaptureRequests,
  };
}

async function runLlmExperimentPlanner(params: {
  config: RuntimeConfig;
  video: ShortVideo;
  metrics: ShortMetrics;
  diagnosis: DiagnosisResult;
  variantPlan: VariantPlan;
  context: ExperimentContext | null;
  recentHistory: RecentHistoryEntry[];
  fallback: ExperimentPlan;
}): Promise<ExperimentPlan | null> {
  if (!params.config.openAiApiKey) {
    return null;
  }

  const client = new OpenAI({ apiKey: params.config.openAiApiKey });

  const response = await client.responses.create({
    model: params.config.openAiPlannerModel,
    max_output_tokens: 2200,
    text: {
      verbosity: "medium",
      format: {
        type: "json_schema",
        name: "shorts_experiment_plan",
        schema: {
          type: "object",
          additionalProperties: false,
          required: [
            "version",
            "videoId",
            "generatedAt",
            "sourceVideoTitle",
            "primaryObjective",
            "contextSummary",
            "inputsUsed",
            "experiments",
            "nextCaptureRequests",
          ],
          properties: {
            version: { type: "string" },
            videoId: { type: "string" },
            generatedAt: { type: "string" },
            sourceVideoTitle: { type: "string" },
            primaryObjective: { type: "string" },
            contextSummary: { type: "string" },
            inputsUsed: { type: "array", items: { type: "string" } },
            experiments: {
              type: "array",
              minItems: 3,
              maxItems: 4,
              items: {
                type: "object",
                additionalProperties: false,
                required: [
                  "id",
                  "title",
                  "hypothesis",
                  "priority",
                  "changes",
                  "successMetrics",
                  "guardrails",
                  "basedOn",
                ],
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  hypothesis: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  changes: {
                    type: "array",
                    minItems: 2,
                    items: { type: "string" },
                  },
                  successMetrics: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      additionalProperties: false,
                      required: ["metric", "target", "why"],
                      properties: {
                        metric: { type: "string" },
                        target: { type: "string" },
                        why: { type: "string" },
                      },
                    },
                  },
                  guardrails: {
                    type: "array",
                    minItems: 1,
                    items: { type: "string" },
                  },
                  basedOn: {
                    type: "array",
                    minItems: 1,
                    items: { type: "string" },
                  },
                },
              },
            },
            nextCaptureRequests: {
              type: "array",
              items: { type: "string" },
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
              "You are a YouTube Shorts experiment planner.",
              "Turn the current video metrics, the generated variant, optional context inputs, and recent run history into 3-4 concrete experiments.",
              "Each experiment must be distinct, measurable, and production-ready.",
              "Separate thumbnail/impression packaging tests from in-feed opening-hold or retention tests.",
              "Include staggered recut cadence experiments when they help isolate packaging vs concept learnings.",
              "Prefer changes that can be tested independently without changing the entire concept at once.",
              "Return strict JSON only.",
            ].join(" "),
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
                variantPlan: {
                  primaryFix: params.variantPlan.primaryFix,
                  hookLine: params.variantPlan.hookLine,
                  hookVariants: params.variantPlan.hookVariants,
                  firstFrame: params.variantPlan.firstFrame,
                  title: params.variantPlan.metadata.title,
                  pinnedComment: params.variantPlan.metadata.pinnedComment,
                },
                context: params.context,
                recentHistory: params.recentHistory,
                fallbackReference: params.fallback,
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
  if (!parsed) {
    return null;
  }

  return experimentPlanSchema.parse(parsed);
}

export async function planShortExperiments(params: {
  config: RuntimeConfig;
  outDir: string;
  video: ShortVideo;
  metrics: ShortMetrics;
  diagnosis: DiagnosisResult;
  variantPlan: VariantPlan;
  generatedAt: string;
  context: ExperimentContext | null;
}): Promise<ExperimentPlan> {
  const recentHistory = await loadRecentHistory({
    outDir: params.outDir,
    videoId: params.video.videoId,
  });

  const fallback = buildDeterministicExperimentPlan({
    video: params.video,
    metrics: params.metrics,
    diagnosis: params.diagnosis,
    variantPlan: params.variantPlan,
    generatedAt: params.generatedAt,
    context: params.context,
    recentHistory,
  });

  const llmPlan = await runLlmExperimentPlanner({
    config: params.config,
    video: params.video,
    metrics: params.metrics,
    diagnosis: params.diagnosis,
    variantPlan: params.variantPlan,
    context: params.context,
    recentHistory,
    fallback,
  });

  return llmPlan ?? fallback;
}
