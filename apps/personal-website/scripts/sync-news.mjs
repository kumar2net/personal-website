import { execa } from "execa";
import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const personalSiteRoot = path.resolve(__dirname, "..");
const newsRoot = path.resolve(personalSiteRoot, "../news");
const newsDist = path.join(newsRoot, "dist");
const targetDir = path.join(personalSiteRoot, "public/news");

console.log("→ Building news desk bundle...");
await execa("npm", ["run", "build"], {
  cwd: newsRoot,
  stdio: "inherit",
});

console.log("→ Syncing news assets into personal site public/news …");
await rm(targetDir, { recursive: true, force: true });
await mkdir(targetDir, { recursive: true });
await cp(newsDist, targetDir, { recursive: true });

console.log("✓ news.kumar2net.com assets ready under public/news");
