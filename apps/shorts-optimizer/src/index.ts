#!/usr/bin/env node
import path from "node:path";
import { readFile } from "node:fs/promises";
import dotenv from "dotenv";
import { loadRuntimeConfig } from "./config/env.js";
import { diagnoseShort } from "./optimizer/diagnose.js";
import { rewriteShortVariant } from "./optimizer/rewrite.js";
import { writeOptimizerOutput } from "./storage/output.js";
import { YouTubeAnalyticsClient } from "./youtube/analytics.js";
import { detectRepoRoot } from "./utils/paths.js";

interface CliOptions {
  command: string | null;
  last: number;
  videoId: string | null;
  channelMine: boolean;
  mock: boolean;
  help: boolean;
}

interface SummaryRow {
  videoId: string;
  ctr: number | null;
  primaryFix: string;
  outputDir: string;
}

function printUsage(): void {
  console.log(`Shorts CTR Optimizer\n\nUsage:\n  node dist/index.js optimize --last 10\n  node dist/index.js optimize --videoId <id>\n  node dist/index.js optimize --last 1 --mock\n\nOptions:\n  --last <n>       Optimize last N shorts (default: 3)\n  --videoId <id>   Optimize a specific video\n  --channelMine    Explicitly use authenticated channel\n  --mock           Use fixture mode\n  --help           Show usage\n`);
}

function parseArgs(argv: string[]): CliOptions {
  const parsed: CliOptions = {
    command: argv[0] ?? null,
    last: 3,
    videoId: null,
    channelMine: false,
    mock: false,
    help: false,
  };

  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      parsed.help = true;
      continue;
    }

    if (token === "--channelMine") {
      parsed.channelMine = true;
      continue;
    }

    if (token === "--mock") {
      parsed.mock = true;
      continue;
    }

    if (token.startsWith("--last=")) {
      parsed.last = Math.max(1, Number(token.slice("--last=".length)) || 1);
      continue;
    }

    if (token === "--last" && argv[index + 1]) {
      parsed.last = Math.max(1, Number(argv[index + 1]) || 1);
      index += 1;
      continue;
    }

    if (token.startsWith("--videoId=")) {
      parsed.videoId = token.slice("--videoId=".length);
      continue;
    }

    if (token === "--videoId" && argv[index + 1]) {
      parsed.videoId = argv[index + 1];
      index += 1;
      continue;
    }
  }

  return parsed;
}

function pct(value: number | null): string {
  if (value == null) {
    return "n/a";
  }
  return `${value.toFixed(2)}%`;
}

function printSummary(rows: SummaryRow[]): void {
  if (!rows.length) {
    console.log("No videos were optimized.");
    return;
  }

  const headers = ["videoId", "CTR", "suggested primary fix", "output folder"];

  const widths = {
    videoId: Math.max(headers[0].length, ...rows.map((row) => row.videoId.length)),
    ctr: Math.max(headers[1].length, ...rows.map((row) => pct(row.ctr).length)),
    fix: Math.max(headers[2].length, ...rows.map((row) => row.primaryFix.length)),
  };

  const line = `${headers[0].padEnd(widths.videoId)}  ${headers[1].padEnd(widths.ctr)}  ${headers[2].padEnd(widths.fix)}  ${headers[3]}`;
  console.log(line);
  console.log(`${"-".repeat(widths.videoId)}  ${"-".repeat(widths.ctr)}  ${"-".repeat(widths.fix)}  ${"-".repeat(headers[3].length)}`);

  for (const row of rows) {
    console.log(
      `${row.videoId.padEnd(widths.videoId)}  ${pct(row.ctr).padEnd(widths.ctr)}  ${row.primaryFix.padEnd(widths.fix)}  ${row.outputDir}`,
    );
  }
}

async function loadSkillRules(repoRoot: string): Promise<string> {
  const skillPath = path.resolve(repoRoot, "skills/ytshortsak.md");
  return readFile(skillPath, "utf8");
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.help || options.command !== "optimize") {
    printUsage();
    if (options.help) {
      return;
    }
    process.exitCode = 1;
    return;
  }

  const repoRoot = detectRepoRoot(process.cwd());

  dotenv.config({ path: path.resolve(repoRoot, ".env") });
  dotenv.config({ path: path.resolve(repoRoot, ".env.local"), override: false });

  const runtime = loadRuntimeConfig({
    env: process.env,
    repoRoot,
    forceMock: options.mock,
  });

  if (runtime.mockMode && runtime.mockReason) {
    console.log(`[shorts-optimizer] ${runtime.mockReason}`);
  }
  if (!runtime.openAiApiKey) {
    console.log("[shorts-optimizer] OPENAI_API_KEY missing. Using deterministic rewrite fallback only.");
  }

  const skillRules = await loadSkillRules(repoRoot);
  const ytClient = new YouTubeAnalyticsClient(runtime);

  const targetVideos = await ytClient.listTargetVideos({
    last: options.last,
    videoId: options.videoId ?? undefined,
    channelMine: options.channelMine,
  });

  if (!targetVideos.length) {
    throw new Error("No matching Shorts were found.");
  }

  const summary: SummaryRow[] = [];

  for (const video of targetVideos) {
    const generatedAt = new Date();
    const metrics = await ytClient.fetchMetrics(video);

    const diagnosis = await diagnoseShort({
      config: runtime,
      video,
      metrics,
      skillRules,
    });

    const variantPlan = await rewriteShortVariant({
      config: runtime,
      video,
      metrics,
      diagnosis,
      skillRules,
      generatedAt: generatedAt.toISOString(),
    });

    const written = await writeOptimizerOutput({
      outDir: runtime.outDir,
      video,
      metrics,
      diagnosis,
      variantPlan,
      generatedAt,
    });

    summary.push({
      videoId: video.videoId,
      ctr: metrics.impressionClickThroughRate,
      primaryFix: diagnosis.primaryFix,
      outputDir: written.outputDir,
    });
  }

  printSummary(summary);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[shorts-optimizer] ${message}`);
  process.exit(1);
});
