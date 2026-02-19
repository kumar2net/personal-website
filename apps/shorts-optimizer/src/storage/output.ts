import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import type { DiagnosisResult } from "../optimizer/diagnose.js";
import { variantPlanSchema, type VariantPlan } from "../optimizer/rewrite.js";
import type { ShortMetrics, ShortVideo } from "../youtube/data.js";
import { toTimestampId } from "../utils/paths.js";

function metricLine(label: string, value: number | null, suffix = ""): string {
  return value == null ? `- ${label}: n/a` : `- ${label}: ${value.toFixed(2)}${suffix}`;
}

function renderDiagnosisMarkdown(params: {
  video: ShortVideo;
  metrics: ShortMetrics;
  diagnosis: DiagnosisResult;
  generatedAt: string;
}): string {
  const whyTableRows = params.diagnosis.whyEntries
    .map(
      (entry) =>
        `| ${entry.source} | ${entry.metric} | ${entry.trigger} | ${entry.change} | ${entry.why} |`,
    )
    .join("\n");

  const issues = params.diagnosis.issues
    .map(
      (issue) =>
        `- **${issue.metric}**: ${issue.issue} (current: ${
          issue.currentValue == null ? "n/a" : issue.currentValue
        }, target: ${issue.target})\n  - Evidence: ${issue.evidence}`,
    )
    .join("\n");

  return [
    `# Diagnosis for ${params.video.videoId}`,
    "",
    `Generated at: ${params.generatedAt}`,
    "",
    "## Metrics Snapshot",
    metricLine("CTR (impressionClickThroughRate)", params.metrics.impressionClickThroughRate, "%"),
    metricLine("Impressions", params.metrics.impressions),
    metricLine("Views", params.metrics.views),
    metricLine("Average View Duration", params.metrics.averageViewDuration, "s"),
    metricLine("Average View %", params.metrics.averageViewPercentage, "%"),
    metricLine("First 3s Retention Proxy", params.metrics.first3sRetentionProxy, "%"),
    `- Window: ${params.metrics.window.mode} (${params.metrics.window.startDate} -> ${params.metrics.window.endDate})`,
    `- Window note: ${params.metrics.window.note}`,
    "",
    "## Primary Fix",
    params.diagnosis.primaryFix,
    "",
    "## Metric -> Issue",
    issues,
    "",
    "## Why Report (metric -> change mapping)",
    "| source | metric | trigger | change | why |",
    "|---|---|---|---|---|",
    whyTableRows,
    "",
    "## Summary",
    params.diagnosis.summary,
    "",
  ].join("\n");
}

export function validateVariantPlan(input: unknown): VariantPlan {
  return variantPlanSchema.parse(input);
}

export async function writeOptimizerOutput(params: {
  outDir: string;
  video: ShortVideo;
  metrics: ShortMetrics;
  diagnosis: DiagnosisResult;
  variantPlan: VariantPlan;
  generatedAt: Date;
}): Promise<{ outputDir: string; timestamp: string }> {
  const timestamp = toTimestampId(params.generatedAt);
  const outputDir = path.resolve(params.outDir, params.video.videoId, timestamp);

  await mkdir(outputDir, { recursive: true });

  const validatedPlan = validateVariantPlan(params.variantPlan);
  const generatedAtIso = params.generatedAt.toISOString();

  await writeFile(
    path.join(outputDir, "metrics.json"),
    `${JSON.stringify(params.metrics, null, 2)}\n`,
    "utf8",
  );

  await writeFile(
    path.join(outputDir, "diagnosis.md"),
    renderDiagnosisMarkdown({
      video: params.video,
      metrics: params.metrics,
      diagnosis: params.diagnosis,
      generatedAt: generatedAtIso,
    }),
    "utf8",
  );

  await writeFile(
    path.join(outputDir, "variant_plan.json"),
    `${JSON.stringify(validatedPlan, null, 2)}\n`,
    "utf8",
  );

  await writeFile(path.join(outputDir, "script.txt"), `${validatedPlan.script}\n`, "utf8");

  const hashtagsLine = validatedPlan.metadata.hashtags.join(" ").trim();
  await writeFile(
    path.join(outputDir, "title_and_hashtags.txt"),
    `${validatedPlan.metadata.title}\n${hashtagsLine}\n`,
    "utf8",
  );

  await writeFile(
    path.join(outputDir, "pinned_comment.txt"),
    `${validatedPlan.metadata.pinnedComment}\n`,
    "utf8",
  );

  return { outputDir, timestamp };
}
