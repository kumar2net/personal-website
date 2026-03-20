import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPayload, getSnapshotWindow } from "../api/keydata.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(
  __dirname,
  "../public/data/keydata-latest.json",
);

function isUsableSnapshot(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray(value.categories) &&
      value.categories.length > 0 &&
      value.snapshot?.key,
  );
}

async function readExistingSnapshot() {
  try {
    const raw = await readFile(OUTPUT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeSnapshot(snapshot) {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  const next = `${JSON.stringify(snapshot, null, 2)}\n`;
  const current = await readFile(OUTPUT_PATH, "utf8").catch(() => null);

  if (current === next) {
    console.log("🗂️ Key data snapshot already up to date.");
    return;
  }

  await writeFile(OUTPUT_PATH, next, "utf8");
  console.log("🗂️ Key data snapshot refreshed.");
}

async function main() {
  const snapshotWindow = getSnapshotWindow();
  const existingSnapshot = await readExistingSnapshot();
  const existingSnapshotIsHealthy =
    isUsableSnapshot(existingSnapshot) &&
    existingSnapshot.snapshot.key === snapshotWindow.key &&
    existingSnapshot.status === "ok" &&
    !existingSnapshot.snapshot?.servedStale &&
    !(existingSnapshot.warnings?.length);

  if (existingSnapshotIsHealthy) {
    console.log(
      `🗂️ Key data snapshot already covers ${snapshotWindow.key}; skipping refresh.`,
    );
    return;
  }

  try {
    const snapshot = await buildPayload(snapshotWindow, {
      fallbackPayload: existingSnapshot,
    });
    await writeSnapshot(snapshot);
    console.log(
      `📈 Key data snapshot ready for ${snapshot.snapshot?.key || snapshotWindow.key}.`,
    );
  } catch (error) {
    if (isUsableSnapshot(existingSnapshot)) {
      console.warn(
        `⚠️ Key data snapshot refresh failed, keeping existing snapshot: ${error.message}`,
      );
      return;
    }

    console.error(`❌ Key data snapshot refresh failed: ${error.message}`);
    process.exitCode = 1;
  }
}

await main();
