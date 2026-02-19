import assert from "node:assert/strict";
import test from "node:test";
import { validateVariantPlan } from "./output.js";

const validVariant = {
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
      }
    ],
    captions: [
      { startSec: 0, endSec: 2, text: "Hook" },
      { startSec: 3, endSec: 8, text: "Context A" },
      { startSec: 8, endSec: 12, text: "Context B" },
      { startSec: 13, endSec: 20, text: "Insight A" }
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

test("variant plan schema accepts valid plan", () => {
  const parsed = validateVariantPlan(validVariant);
  assert.equal(parsed.videoId, "mock-short-001");
});

test("variant plan schema rejects invalid plan", () => {
  const invalid = {
    ...validVariant,
    metadata: {
      ...validVariant.metadata,
      title: "",
    },
  };

  assert.throws(() => validateVariantPlan(invalid));
});
