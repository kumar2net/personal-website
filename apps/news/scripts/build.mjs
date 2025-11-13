import { cp, mkdir, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const publicDir = resolve(projectRoot, "public");
const distDir = resolve(projectRoot, "dist");

try {
  await stat(publicDir);
} catch {
  console.error("Missing public directory. Nothing to build.");
  process.exit(1);
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });
console.log(`News desk copied → ${distDir}`);
