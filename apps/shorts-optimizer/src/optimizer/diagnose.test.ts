import assert from "node:assert/strict";
import test from "node:test";
import { applyBaselineDiagnosisRules } from "./diagnose.js";
import type { ShortMetrics } from "../youtube/data.js";

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

test("baseline diagnosis includes required mandatory actions", () => {
  const decisions = applyBaselineDiagnosisRules(metrics);

  assert.ok(
    decisions.some(
      (entry) =>
        entry.metric === "impressionClickThroughRate" &&
        entry.change.toLowerCase().includes("first frame"),
    ),
  );

  assert.ok(
    decisions.some(
      (entry) =>
        entry.metric === "impressionClickThroughRate" &&
        entry.change.toLowerCase().includes("subtitle"),
    ),
  );

  assert.ok(
    decisions.some(
      (entry) =>
        entry.metric === "impressionClickThroughRate" &&
        entry.change.toLowerCase().includes("title"),
    ),
  );

  assert.ok(
    decisions.some(
      (entry) =>
        entry.metric === "averageViewPercentage" &&
        entry.change.toLowerCase().includes("pattern interrupt"),
    ),
  );

  assert.ok(
    decisions.some(
      (entry) =>
        entry.metric === "averageViewDuration" &&
        entry.change.toLowerCase().includes("cut intro"),
    ),
  );
});
