import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDeterministicExperimentPlan,
  experimentContextSchema,
  experimentPlanSchema,
} from "./experiment.js";
import type { DiagnosisResult } from "./diagnose.js";
import type { VariantPlan } from "./rewrite.js";
import type { ShortMetrics, ShortVideo } from "../youtube/data.js";

const video: ShortVideo = {
  videoId: "mock-short-001",
  title: "Why Your 2.4GHz Wi-Fi Feels Slow",
  description: "Quick explainer short",
  publishedAt: "2026-02-19T12:00:00.000Z",
  durationSeconds: 52,
  tags: ["wifi", "networking"],
};

const metrics: ShortMetrics = {
  videoId: "mock-short-001",
  impressions: 4200,
  impressionClickThroughRate: 3.1,
  views: 130,
  averageViewDuration: 17.8,
  averageViewPercentage: 42.3,
  first3sRetentionProxy: 56.4,
  durationSeconds: 52,
  window: {
    mode: "last_7_days",
    startDate: "2026-02-12",
    endDate: "2026-02-19",
    note: "Fixture test window",
  },
};

const diagnosis: DiagnosisResult = {
  summary: "CTR and retention are both below target.",
  primaryFix: "Repackage the opening and tighten pacing.",
  issues: [
    {
      metric: "impressionClickThroughRate",
      currentValue: 3.1,
      target: ">= 4.0%",
      issue: "CTR is below threshold.",
      evidence: "impressionClickThroughRate=3.10%",
    },
  ],
  whyEntries: [
    {
      source: "baseline",
      metric: "impressionClickThroughRate",
      trigger: "CTR 3.10% is below 4.00%",
      change: "Rewrite first subtitle line as a contrarian 0-2s hook.",
      why: "The opening line must increase curiosity before swipe-away.",
    },
    {
      source: "baseline",
      metric: "averageViewPercentage",
      trigger: "Average view % 42.30 is below 60.00",
      change: "Insert a pattern interrupt at 2-3s with a visual or tonal shift.",
      why: "Early pacing refresh reduces drop-off after the opening hook.",
    },
  ],
};

const variantPlan: VariantPlan = {
  version: "shorts-optimizer.variant.v1",
  videoId: "mock-short-001",
  generatedAt: "2026-02-19T12:00:00.000Z",
  sourceVideoTitle: "Why Your 2.4GHz Wi-Fi Feels Slow",
  primaryFix: "Repackage opening",
  hookLine: "Stop scrolling: this is the real problem.",
  firstFrame: {
    visual: "Fast close-up motion",
    subtitleLine: "This is what nobody tells you.",
    motionCue: "Punch-in",
  },
  script: "[0-2s] Hook\n[3-12s] Context\n[13-35s] Insight\n[36-50s] Payoff\n[50-55s] CTA",
  timeline: {
    totalDurationSec: 55,
    scenes: [
      {
        id: "scene-1",
        startSec: 0,
        endSec: 2,
        segment: "hook",
        objective: "pattern interrupt",
        visuals: ["fast zoom"],
        overlays: ["hook text"],
        audioCues: ["hit"],
        editNotes: ["no intro"],
      },
      {
        id: "scene-2",
        startSec: 3,
        endSec: 12,
        segment: "context",
        objective: "compression",
        visuals: ["visual shift"],
        overlays: ["context"],
        audioCues: ["beat"],
        editNotes: ["captions on"],
      },
      {
        id: "scene-3",
        startSec: 13,
        endSec: 35,
        segment: "insight",
        objective: "one idea",
        visuals: ["before vs after"],
        overlays: ["proof"],
        audioCues: ["accent"],
        editNotes: ["tight pacing"],
      },
      {
        id: "scene-4",
        startSec: 36,
        endSec: 50,
        segment: "payoff",
        objective: "clear reframe",
        visuals: ["summary frame"],
        overlays: ["x -> y"],
        audioCues: ["resolve"],
        editNotes: ["move payoff earlier"],
      },
    ],
    captions: [
      { startSec: 0, endSec: 2, text: "Hook" },
      { startSec: 3, endSec: 8, text: "Context A" },
      { startSec: 8, endSec: 12, text: "Context B" },
      { startSec: 13, endSec: 20, text: "Insight A" },
    ],
    loop: {
      handoffSec: 54,
      bridgeLine: "Wait for part 2",
      visualCue: "mirror frame",
    },
  },
  metadata: {
    title: "Why This Actually Happens",
    hashtags: ["#shorts", "#wifi"],
    tags: ["shorts", "wifi"],
    pinnedComment: "What should I test next?",
  },
  editDecisionList: [
    {
      metric: "impressionClickThroughRate",
      signal: "CTR below threshold",
      change: "Rewrite first frame",
      why: "Need stronger scroll stop",
    },
  ],
};

test("experiment context schema accepts normalized planner context", () => {
  const parsed = experimentContextSchema.parse({
    creatorGoals: ["Raise comments", "Improve retention"],
    audience: "Busy tech-curious viewers on mobile",
    competitors: [{ title: "Wi-Fi myth breakdown", hook: "You were told this wrong" }],
  });

  assert.equal(parsed.creatorGoals.length, 2);
  assert.equal(parsed.competitors[0]?.title, "Wi-Fi myth breakdown");
});

test("deterministic experiment plan produces a valid multi-experiment plan", () => {
  const plan = buildDeterministicExperimentPlan({
    video,
    metrics,
    diagnosis,
    variantPlan,
    generatedAt: "2026-02-19T12:00:00.000Z",
    context: {
      creatorGoals: ["Raise comments", "Improve retention"],
      audience: "Busy tech-curious viewers on mobile",
      transcript: "Most people blame the router, but the bottleneck is interference.",
      notes: "Push harder on the myth-busting angle.",
      competitors: [
        {
          title: "Wi-Fi myth breakdown",
          hook: "You were told this wrong",
          angle: "Name the myth before explaining the fix",
          whyItWorked: "Immediate tension and a concrete claim.",
        },
      ],
    },
    recentHistory: [
      {
        timestamp: "20260219T120000Z",
        ctr: 2.8,
        averageViewPercentage: 39.5,
        averageViewDuration: 15.4,
        primaryFix: "Rework opening",
        title: "Stop Blaming Your Router",
        hookLine: "This is not the problem you think it is.",
      },
    ],
  });

  const parsed = experimentPlanSchema.parse(plan);
  assert.equal(parsed.videoId, "mock-short-001");
  assert.equal(parsed.experiments.length, 3);
  assert.ok(parsed.inputsUsed.includes("transcript"));
  assert.ok(parsed.experiments.some((entry) => entry.id === "exp-packaging-reset"));
});
