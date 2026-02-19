import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function findUp(startDir: string, markerFile: string): string | null {
  let current = path.resolve(startDir);

  while (true) {
    const marker = path.join(current, markerFile);
    if (fs.existsSync(marker)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }

    current = parent;
  }
}

export function detectRepoRoot(startDir = process.cwd()): string {
  const fromCwd = findUp(startDir, "turbo.json");
  if (fromCwd) {
    return fromCwd;
  }

  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const fromModule = findUp(moduleDir, "turbo.json");
  return fromModule ?? startDir;
}

export function toTimestampId(date = new Date()): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/u, "Z");
}
