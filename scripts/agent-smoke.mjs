#!/usr/bin/env node
import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";

const DEFAULT_COMMANDS = [
  "npm run agent:lint",
  "npm run retriever:determinism",
  "npm run idempotency:check",
  "npm run token:budget",
];

function parseArgs(argv) {
  const commands = [];
  let repeat = Number(process.env.AGENT_SMOKE_REPEAT || "1");

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--repeat" || arg === "-n") {
      repeat = Number(argv[i + 1] || repeat);
      i += 1;
      continue;
    }
    if (arg === "--command" || arg === "-c") {
      const command = argv[i + 1];
      if (command) {
        commands.push(command);
      }
      i += 1;
    }
  }

  return {
    commands: commands.length ? commands : DEFAULT_COMMANDS,
    repeat: Math.max(1, Math.trunc(repeat) || 1),
  };
}

function percentile(values, percentileRank) {
  if (!values.length) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.ceil((percentileRank / 100) * sorted.length) - 1,
  );
  return sorted[Math.max(0, index)];
}

function detectCacheHit(output) {
  return /\bcache-(etag|fallback|hit)\b/i.test(output);
}

function runCommand(command) {
  return new Promise((resolve) => {
    const started = performance.now();
    const child = spawn(command, {
      cwd: process.cwd(),
      env: process.env,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.on("close", (code) => {
      resolve({
        code,
        output,
        latencyMs: Math.round(performance.now() - started),
      });
    });
  });
}

async function main() {
  const { commands, repeat } = parseArgs(process.argv.slice(2));
  const results = [];

  for (let iteration = 1; iteration <= repeat; iteration += 1) {
    for (const command of commands) {
      const result = await runCommand(command);
      const record = {
        command,
        iteration,
        success: result.code === 0,
        cache_hit: detectCacheHit(result.output),
        latency_ms: result.latencyMs,
      };
      results.push(record);
      console.log(JSON.stringify(record));

      if (result.code !== 0) {
        process.stderr.write(result.output);
      }
    }
  }

  const failures = results.filter((result) => !result.success);
  const latencies = results.map((result) => result.latency_ms);
  const summary = {
    samples: results.length,
    failures: failures.length,
    cache_hit_rate: results.length
      ? Number(
          (results.filter((result) => result.cache_hit).length / results.length).toFixed(4),
        )
      : 0,
    p50_ms: percentile(latencies, 50),
    p95_ms: percentile(latencies, 95),
  };
  console.log(JSON.stringify({ summary }));

  if (failures.length) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`[agent-smoke] ${error.stack || error.message}`);
  process.exit(1);
});
