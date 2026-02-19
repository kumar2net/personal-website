import OpenAI from "openai";
import { z } from "zod";
import type { RuntimeConfig } from "../config/env.js";
import type { ShortMetrics, ShortVideo } from "../youtube/data.js";
import { extractResponseText, safeJsonParse } from "../utils/openai.js";

export interface RuleDecision {
  source: "baseline" | "llm";
  metric: string;
  trigger: string;
  change: string;
  why: string;
}

export interface DiagnosisIssue {
  metric: string;
  currentValue: number | null;
  target: string;
  issue: string;
  evidence: string;
}

export interface DiagnosisResult {
  summary: string;
  primaryFix: string;
  issues: DiagnosisIssue[];
  whyEntries: RuleDecision[];
}

const llmDiagnosisSchema = z.object({
  summary: z.string().min(1),
  primaryFix: z.string().min(1),
  issues: z
    .array(
      z.object({
        metric: z.string().min(1),
        currentValue: z.number().nullable(),
        target: z.string().min(1),
        issue: z.string().min(1),
        evidence: z.string().min(1),
      }),
    )
    .default([]),
  refinements: z
    .array(
      z.object({
        metric: z.string().min(1),
        trigger: z.string().min(1),
        change: z.string().min(1),
        why: z.string().min(1),
      }),
    )
    .default([]),
});

function metricValue(value: number | null): string {
  if (value == null) {
    return "n/a";
  }
  return `${value.toFixed(2)}`;
}

export function applyBaselineDiagnosisRules(metrics: ShortMetrics): RuleDecision[] {
  const decisions: RuleDecision[] = [];

  const ctr = metrics.impressionClickThroughRate;
  if (ctr != null && ctr < 4) {
    decisions.push(
      {
        source: "baseline",
        metric: "impressionClickThroughRate",
        trigger: `CTR ${metricValue(ctr)}% is below 4.00%`,
        change: "Replace first frame with high-motion pattern interrupt visual.",
        why: "Low CTR indicates the packaging is not stopping scrolls quickly.",
      },
      {
        source: "baseline",
        metric: "impressionClickThroughRate",
        trigger: `CTR ${metricValue(ctr)}% is below 4.00%`,
        change: "Rewrite first subtitle line as a contrarian 0-2s hook.",
        why: "The opening line must increase curiosity before swipe-away.",
      },
      {
        source: "baseline",
        metric: "impressionClickThroughRate",
        trigger: `CTR ${metricValue(ctr)}% is below 4.00%`,
        change: "Retitle using tension + specificity format.",
        why: "Title relevance and tension directly affect impression conversion.",
      },
    );
  }

  const avgViewPct = metrics.averageViewPercentage;
  if (avgViewPct != null && avgViewPct < 60) {
    decisions.push(
      {
        source: "baseline",
        metric: "averageViewPercentage",
        trigger: `Average view % ${metricValue(avgViewPct)} is below 60.00`,
        change: "Insert a pattern interrupt at 2-3s with a visual or tonal shift.",
        why: "Early pacing refresh reduces drop-off after the opening hook.",
      },
      {
        source: "baseline",
        metric: "averageViewPercentage",
        trigger: `Average view % ${metricValue(avgViewPct)} is below 60.00`,
        change: "Tighten pacing by removing low-signal filler lines.",
        why: "Dense progression keeps one-idea narrative retention high.",
      },
    );
  }

  const avgViewDuration = metrics.averageViewDuration;
  const duration = metrics.durationSeconds;
  const isShortInRange = duration != null && duration >= 40 && duration <= 60;
  if (isShortInRange && avgViewDuration != null && avgViewDuration < 20) {
    decisions.push(
      {
        source: "baseline",
        metric: "averageViewDuration",
        trigger: `Average view duration ${metricValue(avgViewDuration)}s is below 20s for a 40-60s short`,
        change: "Cut intro setup and start mid-thought in the first line.",
        why: "The current opening delays value delivery.",
      },
      {
        source: "baseline",
        metric: "averageViewDuration",
        trigger: `Average view duration ${metricValue(avgViewDuration)}s is below 20s for a 40-60s short`,
        change: "Move payoff statement earlier into the 30-40s segment.",
        why: "Earlier payoff increases completion likelihood.",
      },
    );
  }

  if (!decisions.length) {
    decisions.push({
      source: "baseline",
      metric: "overall",
      trigger: "No baseline threshold breaches",
      change: "Keep current structure and run a title/hook A/B test only.",
      why: "Metrics are above minimum thresholds, so optimize incrementally.",
    });
  }

  return decisions;
}

function choosePrimaryFix(decisions: RuleDecision[]): string {
  const ctrFix = decisions.find((entry) => entry.metric === "impressionClickThroughRate");
  if (ctrFix) {
    return "Repackage the opening (first frame + first subtitle + title) to raise CTR.";
  }

  const retentionFix = decisions.find((entry) => entry.metric === "averageViewPercentage");
  if (retentionFix) {
    return "Add a 2-3s pattern interrupt and tighten pacing for better retention.";
  }

  const durationFix = decisions.find((entry) => entry.metric === "averageViewDuration");
  if (durationFix) {
    return "Cut intro and move payoff earlier to increase watched seconds.";
  }

  return decisions[0]?.change ?? "No changes required.";
}

function buildDefaultIssues(metrics: ShortMetrics): DiagnosisIssue[] {
  return [
    {
      metric: "impressionClickThroughRate",
      currentValue: metrics.impressionClickThroughRate,
      target: ">= 4.0%",
      issue:
        metrics.impressionClickThroughRate != null && metrics.impressionClickThroughRate < 4
          ? "CTR is below baseline threshold."
          : "CTR is within baseline range.",
      evidence: `impressionClickThroughRate=${metricValue(metrics.impressionClickThroughRate)}%`,
    },
    {
      metric: "averageViewPercentage",
      currentValue: metrics.averageViewPercentage,
      target: ">= 60%",
      issue:
        metrics.averageViewPercentage != null && metrics.averageViewPercentage < 60
          ? "Average view percentage indicates early/mid-video drop-off."
          : "Average view percentage is within baseline range.",
      evidence: `averageViewPercentage=${metricValue(metrics.averageViewPercentage)}%`,
    },
    {
      metric: "averageViewDuration",
      currentValue: metrics.averageViewDuration,
      target: ">= 20s for 40-60s shorts",
      issue:
        metrics.averageViewDuration != null && metrics.averageViewDuration < 20
          ? "Average watched seconds are low for this short length."
          : "Average watched seconds are acceptable.",
      evidence: `averageViewDuration=${metricValue(metrics.averageViewDuration)}s`,
    },
  ];
}

function buildDeterministicSummary(metrics: ShortMetrics, decisions: RuleDecision[]): string {
  const parts = [
    `CTR is ${metricValue(metrics.impressionClickThroughRate)}%.`,
    `Avg view % is ${metricValue(metrics.averageViewPercentage)}%.`,
    `Avg view duration is ${metricValue(metrics.averageViewDuration)}s.`,
  ];

  const primary = choosePrimaryFix(decisions);
  parts.push(`Primary fix: ${primary}`);

  if (metrics.first3sRetentionProxy != null) {
    parts.push(`First-3s retention proxy: ${metricValue(metrics.first3sRetentionProxy)}%.`);
  } else {
    parts.push("First-3s retention proxy: unavailable from current analytics response.");
  }

  return parts.join(" ");
}

async function runLlmDiagnosis(params: {
  config: RuntimeConfig;
  video: ShortVideo;
  metrics: ShortMetrics;
  baselineDecisions: RuleDecision[];
  skillRules: string;
}): Promise<z.infer<typeof llmDiagnosisSchema> | null> {
  if (!params.config.openAiApiKey) {
    return null;
  }

  const client = new OpenAI({ apiKey: params.config.openAiApiKey });

  const inputPayload = {
    video: {
      videoId: params.video.videoId,
      title: params.video.title,
      durationSeconds: params.video.durationSeconds,
      publishedAt: params.video.publishedAt,
    },
    metrics: {
      impressions: params.metrics.impressions,
      impressionClickThroughRate: params.metrics.impressionClickThroughRate,
      views: params.metrics.views,
      averageViewDuration: params.metrics.averageViewDuration,
      averageViewPercentage: params.metrics.averageViewPercentage,
      first3sRetentionProxy: params.metrics.first3sRetentionProxy,
      window: params.metrics.window,
    },
    baselineDecisions: params.baselineDecisions,
  };

  const response = await client.responses.create({
    model: params.config.openAiModel,
    temperature: 0,
    max_output_tokens: 1200,
    text: {
      format: {
        type: "json_schema",
        name: "shorts_diagnosis",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["summary", "primaryFix", "issues", "refinements"],
          properties: {
            summary: { type: "string" },
            primaryFix: { type: "string" },
            issues: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["metric", "currentValue", "target", "issue", "evidence"],
                properties: {
                  metric: { type: "string" },
                  currentValue: { type: ["number", "null"] },
                  target: { type: "string" },
                  issue: { type: "string" },
                  evidence: { type: "string" },
                },
              },
            },
            refinements: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["metric", "trigger", "change", "why"],
                properties: {
                  metric: { type: "string" },
                  trigger: { type: "string" },
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
              "You are a YouTube Shorts diagnostic engine.",
              "Always preserve required baseline decisions and only add precise refinements.",
              "Return strict JSON that maps metrics to concrete edit changes.",
              "Reference CTR, averageViewDuration, averageViewPercentage, and first3sRetentionProxy when available.",
              "Follow these canonical generation rules for context:",
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
            text: JSON.stringify(inputPayload, null, 2),
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

  return llmDiagnosisSchema.parse(parsed);
}

export async function diagnoseShort(params: {
  config: RuntimeConfig;
  video: ShortVideo;
  metrics: ShortMetrics;
  skillRules: string;
}): Promise<DiagnosisResult> {
  const baselineDecisions = applyBaselineDiagnosisRules(params.metrics);

  const llm = await runLlmDiagnosis({
    config: params.config,
    video: params.video,
    metrics: params.metrics,
    baselineDecisions,
    skillRules: params.skillRules,
  }).catch(() => null);

  const llmDecisions: RuleDecision[] =
    llm?.refinements.map((entry) => ({
      source: "llm",
      metric: entry.metric,
      trigger: entry.trigger,
      change: entry.change,
      why: entry.why,
    })) ?? [];

  const whyEntries = [...baselineDecisions, ...llmDecisions];

  return {
    summary: llm?.summary ?? buildDeterministicSummary(params.metrics, baselineDecisions),
    primaryFix: llm?.primaryFix ?? choosePrimaryFix(baselineDecisions),
    issues: llm?.issues ?? buildDefaultIssues(params.metrics),
    whyEntries,
  };
}
