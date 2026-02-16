#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const API_DIR = path.resolve(process.cwd(), "apps", "personal-website", "api");
const SIDEEFFECT_PATTERNS = [
  /persistBlobJSON\(/,
  /\bwriteFile\(/,
  /\bwriteFileSync\(/,
  /\bput\(/,
  /\bappendFile\(/,
];

const IDEMPOTENCY_MARKERS = [
  /\bwithIdempotentExecution\b/,
  /\bIdempotency\b/i,
];

function inspectApiFiles() {
  const files = fs
    .readdirSync(API_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .map((entry) => path.join(API_DIR, entry.name));

  const failures = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const hasSideEffect = SIDEEFFECT_PATTERNS.some((pattern) => pattern.test(content));
    const hasGuard = IDEMPOTENCY_MARKERS.some((pattern) => pattern.test(content));
    if (hasSideEffect && !hasGuard) {
      failures.push(file.replace(`${process.cwd()}/`, ""));
    }
  }

  if (failures.length) {
    console.error("[idempotency-guard] Missing idempotency markers:");
    failures.forEach((entry) => console.error(` - ${entry}`));
    process.exit(1);
  }

  console.log("[idempotency-guard] No unguarded side-effect files detected.");
}

inspectApiFiles();
