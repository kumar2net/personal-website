#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import OpenAI from "openai";

const execFileAsync = promisify(execFile);

const WORK_DIR = path.resolve("generate/ytshorts/crude-oil-lpg-india-sora2");
const MODEL = process.env.SORA_MODEL || "sora-2";
const SIZE = "720x1280";
const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 20 * 60_000;
const TOPIC = "What 1 barrel of crude oil becomes, with LPG focus in Indian kitchens";

const BASE_STYLE = [
  "Use case: YouTube Short.",
  "Primary request: modern vertical infographic-documentary video about crude oil outputs and LPG in India.",
  "Style/format: premium motion graphics blended with realistic refinery and kitchen details, mobile-first framing, no presenter.",
  "Lighting/mood: clean cinematic realism, high readability, smooth motion, factual and grounded.",
  "Color palette: refinery silver, deep blue, warm yellow, LPG red.",
  "Constraints: vertical 9:16, clean negative space, fictional scenes only, no logos, no watermarks, no readable on-screen text, no captions baked into the frames.",
  "Avoid: gibberish labels, clutter, shaky motion, warped anatomy, crowds, presenter shots, fast chaotic transitions.",
].join("\n");

const SEGMENTS = [
  {
    index: 1,
    name: "hook-barrel",
    seconds: "8",
    prompt: [
      "Scene/background: dawn refinery skyline with light steam, metallic atmosphere, cinematic depth.",
      "Subject: a single crude oil barrel centered in frame.",
      "Action: beat 1 (0-2s) strong pattern-interrupt reveal of the barrel with a glowing circular measurement ring; beat 2 (2-5s) the barrel rotates while liquid measurement graphics pulse around it; beat 3 (5-8s) the frame hints that the barrel will split into multiple fuels.",
      "Camera: low-angle medium shot, slow push-in, stable cinematic motion.",
      "Audio: subtle industrial ambience, soft metallic hum, no dialogue.",
    ].join("\n"),
  },
  {
    index: 2,
    name: "fuel-breakdown",
    seconds: "12",
    prompt: [
      "Scene/background: clean infographic space layered over a realistic refinery process wall.",
      "Subject: the barrel opens into four distinct fuel streams.",
      "Action: beat 1 (0-4s) crude flows into a refinery column; beat 2 (4-8s) four clearly separated output streams branch outward into an LPG cylinder, petrol pump nozzle and car fuel can, diesel truck tank, and jet-fuel wing refuel icon; beat 3 (8-12s) the outputs settle into a balanced four-part composition with precise volumes implied by container fill levels.",
      "Camera: mostly straight-on composition with gentle parallax and slight zoom for clarity.",
      "Audio: quiet mechanical ambience and soft whoosh transitions, no dialogue.",
    ].join("\n"),
  },
  {
    index: 3,
    name: "india-kitchen-lpg",
    seconds: "12",
    prompt: [
      "Scene/background: warm Indian home kitchen, realistic utensils, tiled wall, daylight entering softly.",
      "Subject: a red LPG cylinder, gas line, burner, steel pan, and hands-only household action.",
      "Action: beat 1 (0-4s) an LPG cylinder is set neatly into a kitchen corner; beat 2 (4-8s) a burner clicks on and a blue flame appears under a pan; beat 3 (8-12s) quick visual progression across apartment and semi-urban kitchens shows LPG as a widespread cooking fuel without showing faces.",
      "Camera: medium close-up and detail shots with smooth lateral slide and gentle push-in.",
      "Audio: gas click, soft kitchen room tone, gentle cooking ambience, no dialogue.",
    ].join("\n"),
  },
  {
    index: 4,
    name: "system-payoff",
    seconds: "8",
    prompt: [
      "Scene/background: stylized aerial refinery-to-daily-life system map at dusk.",
      "Subject: one crude source feeding household cooking, cars and bikes, trucks and buses, and aircraft.",
      "Action: beat 1 (0-4s) refined fuel streams leave the refinery and travel into four daily-life destinations; beat 2 (4-8s) the frame resolves into a clean top-level system view with the barrel, refinery tower, kitchen stove, vehicle lane, freight lane, and airplane all connected.",
      "Camera: vertical crane-up into a symmetrical final composition, smooth and stable.",
      "Audio: deep atmospheric synth bed with transport ambience, no dialogue.",
    ].join("\n"),
  },
];

const TITLE = "What 1 Barrel of Crude Oil Becomes in India";

const DESCRIPTION = `What do we actually get from 1 barrel of crude oil?

This Short shows how one crude oil barrel becomes multiple fuels, with a special focus on LPG and why it matters in Indian kitchens.

Key idea: crude oil is not one product. It becomes a connected energy system that powers cooking, transport, freight, and flights.

#CrudeOil #LPG #India #Petrol #Diesel #JetFuel #EnergyExplained #OilRefinery #YouTubeShorts
`;

const TAGS = [
  "#CrudeOil",
  "#LPG",
  "#India",
  "#Petrol",
  "#Diesel",
  "#JetFuel",
  "#EnergyExplained",
  "#OilRefinery",
  "#CookingGas",
  "#YouTubeShorts",
].join(" ");

const PINNED_COMMENT = "Want Part 2 on how refineries split crude into different fuels? Comment \"REFINERY\".";

const SRT = `1
00:00:00,000 --> 00:00:03,500
One barrel of crude oil means 159 litres.

2
00:00:03,500 --> 00:00:11,500
But it does not become just one fuel.
From one barrel, refineries produce LPG, petrol, diesel, and jet fuel.

3
00:00:11,500 --> 00:00:20,500
For many Indian households, the most familiar product in that chain is LPG cooking gas.

4
00:00:20,500 --> 00:00:31,000
Petrol powers cars and bikes.
Diesel powers trucks, buses, and generators.
Jet fuel powers aircraft.

5
00:00:31,000 --> 00:00:40,000
That is the real story of crude oil:
one source, many fuels, and a direct link from refinery towers to the Indian kitchen.
`;

function nowIso() {
  return new Date().toISOString();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeText(filePath, data) {
  await fs.writeFile(filePath, `${data.endsWith("\n") ? data : `${data}\n`}`, "utf8");
}

async function writeJson(filePath, data) {
  await writeText(filePath, JSON.stringify(data, null, 2));
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
  let lastStatus = null;

  while (true) {
    const job = await client.videos.retrieve(videoId);
    if (job.status !== lastStatus) {
      console.log(`[${nowIso()}] ${videoId} status=${job.status} progress=${job.progress}%`);
      lastStatus = job.status;
    }
    if (job.status === "completed") {
      return job;
    }
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

async function renderFinalVideo(clips, outputPath) {
  const args = ["-y"];
  for (const clip of clips) {
    args.push("-i", clip.filePath);
  }

  const concatInputs = clips
    .map((_, idx) => `[${idx}:v:0][${idx}:a:0]`)
    .join("");
  const filter = `${concatInputs}concat=n=${clips.length}:v=1:a=1[v][a]`;

  args.push(
    "-filter_complex",
    filter,
    "-map",
    "[v]",
    "-map",
    "[a]",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "18",
    "-preset",
    "medium",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    outputPath,
  );

  await execFileAsync("ffmpeg", args, { cwd: WORK_DIR, maxBuffer: 1024 * 1024 * 16 });
}

async function writePackageFiles(clips, finalVideoPath, masterVideoPath) {
  const concatListPath = path.join(WORK_DIR, "concat-list.txt");
  const concatList = clips
    .map((clip) => `file '${clip.filePath.replace(/'/g, "'\\''")}'`)
    .join("\n");
  await writeText(concatListPath, concatList);

  await fs.copyFile(clips[0].thumbnailPath, path.join(WORK_DIR, "thumbnail.jpg"));
  await fs.copyFile(finalVideoPath, path.join(WORK_DIR, "final.mp4"));

  const storyboard = [
    "# Storyboard",
    "",
    `Topic: ${TOPIC}`,
    "",
    "## Segments",
    ...clips.map((clip) => {
      const lines = [
        `- ${String(clip.segment.index).padStart(2, "0")} ${clip.segment.name} (${clip.segment.seconds}s)`,
        `  Visual intent: ${clip.segment.summary}`,
        `  Overlay suggestion: ${clip.segment.overlay}`,
      ];
      return lines.join("\n");
    }),
    "",
    "## Voiceover",
    "One barrel of crude oil means 159 litres.",
    "But it does not become just one fuel.",
    "From one barrel, refineries produce LPG, petrol, diesel, and jet fuel.",
    "For many Indian households, the most familiar product in that chain is LPG cooking gas.",
    "That is the real story of crude oil: one source, many fuels, and a direct link from refinery towers to the Indian kitchen.",
  ].join("\n");

  await writeText(path.join(WORK_DIR, "storyboard.md"), storyboard);
  await writeText(path.join(WORK_DIR, "title.txt"), TITLE);
  await writeText(path.join(WORK_DIR, "description.txt"), DESCRIPTION);
  await writeText(path.join(WORK_DIR, "tags.txt"), TAGS);
  await writeText(path.join(WORK_DIR, "pinned-comment.txt"), PINNED_COMMENT);
  await writeText(path.join(WORK_DIR, "final.srt"), SRT);

  await writeJson(path.join(WORK_DIR, "upload-manifest.json"), {
    project: "crude-oil-lpg-india-sora2",
    created_at: nowIso(),
    format: {
      aspect_ratio: "9:16",
      size: SIZE,
      target_duration_seconds: 40,
    },
    outputs: {
      final_video: path.basename(finalVideoPath),
      final_video_alias: "final.mp4",
      master_video: path.basename(masterVideoPath),
      captions: "final.srt",
      thumbnail: "thumbnail.jpg",
      title: "title.txt",
      description: "description.txt",
      tags: "tags.txt",
      pinned_comment: "pinned-comment.txt",
      storyboard: "storyboard.md",
    },
    notes: {
      model: MODEL,
      workflow: "4 Sora clips stitched with ffmpeg concat filter",
      narration: "not generated in this pass; captions file included for post workflow",
    },
  });
}

async function run() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Export it or source .env first.");
  }

  await ensureDir(WORK_DIR);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const manifest = {
    generatedAt: nowIso(),
    topic: TOPIC,
    model: MODEL,
    size: SIZE,
    clips: [],
  };

  const clips = [];

  for (const segment of SEGMENTS) {
    const clipNum = String(segment.index).padStart(2, "0");
    const prefix = `crude-oil-lpg-sora2-${clipNum}-${segment.name}`;
    const prompt = `${BASE_STYLE}\n${segment.prompt}`;
    const promptPath = path.join(WORK_DIR, `${prefix}.prompt.txt`);
    const videoPath = path.join(WORK_DIR, `${prefix}.mp4`);
    const thumbnailPath = path.join(WORK_DIR, `${prefix}-thumbnail.jpg`);
    const metadataPath = path.join(WORK_DIR, `${prefix}.json`);

    await writeText(promptPath, prompt);
    console.log(`[${nowIso()}] Creating clip ${clipNum}: ${segment.name} (${segment.seconds}s)`);

    const created = await client.videos.create({
      model: MODEL,
      size: SIZE,
      seconds: segment.seconds,
      prompt,
    });

    console.log(`[${nowIso()}] Created ${created.id} (status=${created.status})`);
    const completed = await pollUntilFinished(client, created.id);

    const videoRes = await client.videos.downloadContent(completed.id, { variant: "video" });
    await downloadBinary(videoRes, videoPath);

    const thumbRes = await client.videos.downloadContent(completed.id, { variant: "thumbnail" });
    await downloadBinary(thumbRes, thumbnailPath);

    const clipMeta = {
      generatedAt: nowIso(),
      videoId: completed.id,
      model: completed.model,
      size: completed.size,
      seconds: completed.seconds,
      status: completed.status,
      progress: completed.progress,
      promptFile: path.basename(promptPath),
      output: path.basename(videoPath),
      thumbnail: path.basename(thumbnailPath),
      expiresAt: completed.expires_at,
      completedAt: completed.completed_at,
    };
    await writeJson(metadataPath, clipMeta);

    const clipRecord = {
      segment: {
        index: segment.index,
        name: segment.name,
        seconds: segment.seconds,
        summary:
          {
            "hook-barrel": "single-barrel hook with a measurement reveal and refinery setup",
            "fuel-breakdown": "barrel split into LPG, petrol, diesel, and jet-fuel outputs",
            "india-kitchen-lpg": "LPG shown as everyday cooking fuel in Indian kitchens",
            "system-payoff": "refinery-to-home and transport system payoff",
          }[segment.name] || segment.name,
        overlay:
          {
            "hook-barrel": "1 BARREL OF CRUDE OIL = 159 LITRES",
            "fuel-breakdown": "LPG 5-8 L | PETROL 65-72 L | DIESEL 40-48 L | JET FUEL 13-16 L",
            "india-kitchen-lpg": "IN INDIA, LPG IS USED MAINLY FOR COOKING",
            "system-payoff": "ONE SOURCE. MANY FUELS. DAILY LIFE.",
          }[segment.name] || "",
      },
      videoId: completed.id,
      filePath: videoPath,
      thumbnailPath,
      metadataPath,
    };

    clips.push(clipRecord);
    manifest.clips.push({
      name: segment.name,
      seconds: segment.seconds,
      videoId: completed.id,
      file: path.basename(videoPath),
      thumbnail: path.basename(thumbnailPath),
      metadata: path.basename(metadataPath),
    });
  }

  const masterVideoPath = path.join(WORK_DIR, "sora2-master-40s.mp4");
  const finalVideoPath = path.join(WORK_DIR, "final-sora2.mp4");

  console.log(`[${nowIso()}] Stitching ${clips.length} clips into final MP4`);
  await renderFinalVideo(clips, masterVideoPath);
  await fs.copyFile(masterVideoPath, finalVideoPath);

  manifest.outputs = {
    masterVideo: path.basename(masterVideoPath),
    finalVideo: path.basename(finalVideoPath),
  };
  await writeJson(path.join(WORK_DIR, "manifest.json"), manifest);
  await writePackageFiles(clips, finalVideoPath, masterVideoPath);

  console.log(`[${nowIso()}] Done. Final video: ${finalVideoPath}`);
}

run().catch((err) => {
  console.error(`[${nowIso()}] ERROR: ${err.message}`);
  process.exitCode = 1;
});
