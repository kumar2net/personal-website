#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import OpenAI from "openai";

const WORK_DIR = path.resolve(
  "generate/ytshorts/tn-assembly-elections-2026-sora2",
);
const MODEL = process.env.SORA_MODEL || "sora-2";
const SIZE = "720x1280";
const SECONDS = "12";
const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 20 * 60_000;

const BASE_STYLE = [
  "Create a vertical 9:16 cinematic educational political explainer short.",
  "Abstract map-heavy visuals, clean infographics, realistic textures, crisp motion.",
  "Fast pacing with hard cuts and subtle zoom movement.",
  "No party logos, no real people, no copyrighted characters, no brand marks.",
  "No on-screen subtitles in generated clips.",
].join(" ");

const SEGMENTS = [
  {
    name: "hook-myth",
    prompt: [
      "0-12s hook segment.",
      "Open with a rapid montage of animated election map tiles dropping, then regrouping.",
      "Show a high-contrast seat-meter race that spikes from 0 toward 234 in three lanes.",
      "Keep the frame energetic with quick rhythm and strong contrast in the first 2 seconds.",
      "End by freezing on a split belt map with TVK as a disruptive wildcard.",
    ].join(" "),
  },
  {
    name: "context-compression",
    prompt: [
      "0-12s context segment.",
      "Show a clean Tamil Nadu belt map with 4 regions: North, East metro band, Western Kongu edge, South belt.",
      "Animate region strength as a bar stack: transfer pressure, metro churn, alliance hold.",
      "Cut every 2-3 seconds between district-level map cards and coalition flow arrows.",
      "End on the textless card: one election, three forces, every vote re-routed through alliances.",
    ].join(" "),
  },
  {
    name: "seat-math-breakdown",
    prompt: [
      "0-12s breakdown segment.",
      "Visualize three vote-transfer scenarios as quick scenario cards: continuity drag, TVK expansion, micro-target.",
      "Show seat numbers as animated counters with overlap zones and uncertainty bands.",
      "Use red/blue/amber overlays to show AIADMK swing, DMK swing, and TVK disruption zones.",
      "Keep camera locked to the motion graphics deck and avoid long static shots.",
    ].join(" "),
  },
  {
    name: "payoff-cta",
    prompt: [
      "0-12s payoff segment.",
      "Show a final one-minute-to-victory meter: alliances + turnout + transfer decide winner, not freebies alone.",
      "Cut from party promise cards to coalition arrows to a final closing frame of a map becoming a single question-mark node.",
      "Finish with a high-energy pause and wide-open ending energy for comments.",
    ].join(" "),
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nowIso() {
  return new Date().toISOString();
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function downloadBinary(response, outPath) {
  if (!response.ok) {
    throw new Error(`Failed to download content (${response.status}) -> ${outPath}`);
  }
  const arr = await response.arrayBuffer();
  await fs.writeFile(outPath, Buffer.from(arr));
}

async function pollUntilFinished(client, videoId) {
  const started = Date.now();
  let last = null;

  while (true) {
    const job = await client.videos.retrieve(videoId);
    if (job.status !== last) {
      console.log(`[${nowIso()}] ${videoId} status=${job.status} progress=${job.progress}%`);
      last = job.status;
    }
    if (job.status === "completed") return job;
    if (job.status === "failed") {
      const err = job.error ? `${job.error.code}: ${job.error.message}` : "unknown error";
      throw new Error(`Video ${videoId} failed: ${err}`);
    }
    if (Date.now() - started > POLL_TIMEOUT_MS) {
      throw new Error(`Timeout waiting for ${videoId} after ${POLL_TIMEOUT_MS / 1000}s`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

async function run() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Export it or source .env first.");
  }

  await ensureDir(WORK_DIR);

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const manifest = {
    generatedAt: nowIso(),
    model: MODEL,
    size: SIZE,
    secondsPerClip: SECONDS,
    clips: [],
  };

  for (let i = 0; i < SEGMENTS.length; i += 1) {
    const segment = SEGMENTS[i];
    const clipNum = String(i + 1).padStart(2, "0");
    const clipPrefix = `tn-elections-sora2-${clipNum}-${segment.name}`;
    const prompt = `${BASE_STYLE} ${segment.prompt}`;

    console.log(`[${nowIso()}] Creating clip ${clipNum}: ${segment.name}`);
    const created = await client.videos.create({
      model: MODEL,
      seconds: SECONDS,
      size: SIZE,
      prompt,
    });

    console.log(`[${nowIso()}] Created ${created.id} (status=${created.status})`);
    const completed = await pollUntilFinished(client, created.id);

    const videoOut = path.join(WORK_DIR, `${clipPrefix}.mp4`);
    const thumbOut = path.join(WORK_DIR, `${clipPrefix}-thumbnail.jpg`);
    const metaOut = path.join(WORK_DIR, `${clipPrefix}.json`);

    const videoRes = await client.videos.downloadContent(completed.id, {
      variant: "video",
    });
    await downloadBinary(videoRes, videoOut);

    const thumbRes = await client.videos.downloadContent(completed.id, {
      variant: "thumbnail",
    });
    await downloadBinary(thumbRes, thumbOut);

    const clipMeta = {
      generatedAt: nowIso(),
      videoId: completed.id,
      model: completed.model,
      seconds: completed.seconds,
      size: completed.size,
      status: completed.status,
      progress: completed.progress,
      prompt,
      output: path.basename(videoOut),
      thumbnail: path.basename(thumbOut),
      remixedFromVideoId: completed.remixed_from_video_id,
      expiresAt: completed.expires_at,
      completedAt: completed.completed_at,
    };
    await writeJson(metaOut, clipMeta);

    manifest.clips.push({
      name: segment.name,
      videoId: completed.id,
      file: path.basename(videoOut),
      thumbnail: path.basename(thumbOut),
      metadata: path.basename(metaOut),
    });
  }

  const concatListPath = path.join(WORK_DIR, "concat-list.txt");
  const concatLines = manifest.clips
    .map((clip) => `file '${path.join(WORK_DIR, clip.file).replace(/'/g, "'\\''")}'`)
    .join("\n");
  await fs.writeFile(concatListPath, `${concatLines}\n`, "utf8");

  manifest.concatList = path.basename(concatListPath);
  await writeJson(path.join(WORK_DIR, "manifest.json"), manifest);

  console.log(`[${nowIso()}] Done. Generated ${manifest.clips.length} Sora clips.`);
}

run().catch((err) => {
  console.error(`[${nowIso()}] ERROR: ${err.message}`);
  process.exitCode = 1;
});
