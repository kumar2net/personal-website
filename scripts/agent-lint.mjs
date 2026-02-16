#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const AGENTS_DIR = path.resolve(process.cwd(), "agents");
const REQUIRED_KEYS = [
  "Owner",
  "Purpose",
  "Model",
  "Max tokens",
  "Inputs",
  "Outputs",
  "Guardrails",
  "Cost notes",
  "Test command",
];

if (!fs.existsSync(AGENTS_DIR)) {
  console.log("[agent-lint] No agents directory found. Skipping check.");
  process.exit(0);
}

const entries = fs
  .readdirSync(AGENTS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(AGENTS_DIR, entry.name));

if (entries.length === 0) {
  console.log("[agent-lint] No agent directories found. Skipping check.");
  process.exit(0);
}

const failures = [];

for (const dir of entries) {
  const mdPath = path.join(dir, "agent.md");
  if (!fs.existsSync(mdPath)) {
    failures.push(`${path.basename(dir)}: missing agent.md`);
    continue;
  }

  const content = fs.readFileSync(mdPath, "utf8");
  const missingKeys = REQUIRED_KEYS.filter((key) => {
    const pattern = new RegExp(`^\\s*-\\s*${key}\\s*:`, "m");
    return !pattern.test(content);
  });

  if (missingKeys.length) {
    failures.push(
      `${path.basename(dir)}: agent.md missing required metadata (${missingKeys.join(", ")})`,
    );
  }
}

if (failures.length) {
  console.error("[agent-lint] Agent metadata validation failed:");
  failures.forEach((item) => console.error(` - ${item}`));
  process.exit(1);
}

console.log("[agent-lint] All agent metadata docs present and valid.");
