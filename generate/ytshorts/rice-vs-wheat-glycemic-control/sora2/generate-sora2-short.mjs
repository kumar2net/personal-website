#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import OpenAI from "openai";

const WORK_DIR = path.resolve(
  "generate/ytshorts/rice-vs-wheat-glycemic-control/sora2",
);
const MODEL = process.env.SORA_MODEL || "sora-2";
const SIZE = "720x1280";
const SECONDS = "12";
const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 20 * 60_000;

const BASE_STYLE = [
  "Create a vertical 9:16 cinematic educational short.",
  "Indian food context, clean natural light, realistic textures, crisp motion.",
  "Fast pacing with hard cuts and subtle zoom movement.",
  "No brand logos, no channel branding, no watermarks.",
  "Do not render any on-screen text captions.",
].join(" ");

const SEGMENTS = [
  {
    name: "hook-myth",
    prompt: [
      "0-12s hook segment.",
      "Open with fast split-frame contrast: white rice bowl on one side, chapati stack on the other.",
      "Show glucose spike waveform appearing behind both foods with equal intensity.",
      "Transition to a South Indian dinner plate with sambar, poriyal, and curd.",
      "Tone: myth-busting, energetic, scroll-stopping first 2 seconds.",
    ].join(" "),
  },
  {
    name: "context-problem",
    prompt: [
      "0-12s context segment.",
      "Show family dinner table in South India where one person switches rice to chapati.",
      "Camera tracks plate composition: carb, dal/protein, vegetables, and fats.",
      "Visual focus shifts from grain choice to whole meal balance.",
      "Keep dynamic cuts every 2-3 seconds.",
    ].join(" "),
  },
  {
    name: "science-breakdown",
    prompt: [
      "0-12s science segment.",
      "Show neutral nutrition-lab style setup with two matched meals: rice plate and chapati plate.",
      "Display glucose monitor-like line plots rising similarly for both plates (no readable text).",
      "Then highlight three visual levers: refined vs whole grain, portion size measuring cup, protein+fiber pairing.",
      "Clean infographic aesthetic without text.",
    ].join(" "),
  },
  {
    name: "payoff-cta",
    prompt: [
      "0-12s payoff segment.",
      "Show before-and-after style plate progression: refined-heavy plate to balanced plate.",
      "Include close shots of red rice, whole wheat, dal, curd, and vegetables.",
      "End with confident direct-to-camera framing of a creator in a clean kitchen, inviting a follow-up.",
      "Finish with open curiosity energy for Part 2.",
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
    const clipPrefix = `rice-vs-wheat-sora2-${clipNum}-${segment.name}`;
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
