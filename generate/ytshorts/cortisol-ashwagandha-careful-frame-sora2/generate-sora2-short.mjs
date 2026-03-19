#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import OpenAI from "openai";

const execFileAsync = promisify(execFile);

const PROJECT = "cortisol-ashwagandha-careful-frame-sora2";
const WORK_DIR = path.resolve(`generate/ytshorts/${PROJECT}`);
const MODEL = process.env.SORA_MODEL || "sora-2";
const SIZE = "720x1280";
const TTS_MODEL = process.env.BLOG_TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.BLOG_TTS_VOICE || "alloy";
const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 30 * 60_000;
const TOPIC =
  "Keep the useful cortisol-rhythm framework, but treat ashwagandha as a cautious footnote instead of a default evening hack.";

const TITLE = "Good Cortisol Advice, Bad Supplement Shortcut?";

const DESCRIPTION = `Most cortisol advice online gets mixed together.
The strongest parts are still the boring ones: morning light, hydration, exercise timing, dim evenings, and slower breathing.

This Short makes one narrow point:
the lifestyle framework is useful, but ashwagandha should not be framed like a casual default fix for evening cortisol.

In this Short:
- What the original cortisol framework gets right
- Where the supplement claim gets shaky
- Why "mixed evidence" is not the same as "routine recommendation"

Educational content only. Not medical advice.

#shorts #cortisol #ashwagandha #sleep #stress #wellness #healthliteracy
`;

const TAGS = [
  "cortisol",
  "ashwagandha",
  "cortisol advice",
  "stress hormone myth",
  "sleep routine",
  "health literacy",
  "supplement caution",
  "evening cortisol",
  "Huberman cortisol",
  "wellness myths",
].join(", ");

const PINNED_COMMENT =
  'Want the source stack behind the "mixed evidence, real safety caveat" claim? Comment: SOURCES';

const NARRATION_SEGMENTS = [
  {
    t0: 0,
    t1: 6,
    text: "The cortisol framework is not the problem. The supplement shortcut is.",
  },
  {
    t0: 6,
    t1: 18,
    text: "Morning light, hydration, exercise timing, dim evenings, and slower breathing all make sense.",
  },
  {
    t0: 18,
    t1: 30,
    text: "The weak point is treating ashwagandha like a casual evening cortisol hack.",
  },
  {
    t0: 30,
    t1: 42,
    text: "The evidence is mixed, not zero, and liver-safety warnings make casual framing reckless.",
  },
  {
    t0: 42,
    t1: 48,
    text: "Keep the routine. Make the supplement a footnote. Want the sources?",
  },
];

const BASE_STYLE = [
  "Use case: YouTube Short.",
  "Primary request: create a vertical editorial explainer that contrasts solid daily routine advice with one questionable shortcut.",
  "Style/format: premium editorial explainer, cinematic but factual, mobile-first composition, no presenter talking to camera.",
  "Lighting/mood: grounded, clear, evidence-first, slight urgency without fearmongering.",
  "Color palette: sunrise gold, evening blue, clinical white, muted amber warning accents.",
  "Constraints: vertical 9:16, no readable on-screen text, no logos, no watermarks, no public figures, no faces, fictional scenes only, under-18 safe, no graphic medical imagery.",
  "Avoid: celebrity likenesses, warped hands, gibberish labels, clutter, body horror, dramatic hospital scenes, advertising aesthetics, pills, capsules, syringes, medical packaging, and product-shot framing.",
].join("\n");

const SEGMENTS = [
  {
    index: 1,
    name: "hook-myth-break",
    seconds: "12",
    summary:
      "Pattern interrupt that separates the solid cortisol routine from the shaky supplement shortcut.",
    overlay: "GOOD ROUTINE, WEAK SHORTCUT",
    prompt: [
      "Scene/background: split day-to-night visual world in a clean apartment, one side sunrise window light and water glass, the other side dim evening lamp and a small abstract amber shortcut token.",
      "Subject: anonymous hands only, water glass, sunrise light, dim lamp, abstract wave graphic with no readable text, and a small neutral amber object.",
      "Action: beat 1 (0-3s) fast contrast between bright morning routine cues and quiet evening cues; beat 2 (3-8s) the amber shortcut token slides into frame as the questionable element; beat 3 (8-12s) the routine elements stay centered while the amber token drifts to the edge with a subtle caution glow.",
      "Camera: locked vertical framing with quick punch-ins every 2-3 seconds, crisp hard cuts, no face reveal.",
      "Audio: soft morning room tone, a quick water-glass clink, gentle evening lamp hum, and one subtle whoosh transition; no music and no speech.",
      "Dialogue: none.",
    ].join("\n"),
  },
  {
    index: 2,
    name: "context-compression",
    seconds: "12",
    summary:
      "Compress the original Sanjaay Babu routine: morning light and hydration, exercise timing, dim lights, breathing.",
    overlay: "KEEP THE BORING BASICS",
    prompt: [
      "Scene/background: realistic home and gym-adjacent micro-scenes stitched into one coherent day rhythm.",
      "Subject: curtains opening to sunlight, hand lifting a water bottle, workout shoes and towel, warm low lamp at night, anonymous person seated doing a slow two-step inhale and long exhale without showing the face.",
      "Action: beat 1 (0-4s) morning light and hydration; beat 2 (4-8s) exercise timing cues and a calm productive daytime feel; beat 3 (8-12s) evening dim light, slower breathing, and nervous-system downshift.",
      "Camera: fast but stable macro-to-medium transitions, subtle zooms, dynamic cuts every 2-3 seconds.",
      "Audio: curtain rustle, water pour, soft shoe steps, quiet room tone, and one clear slow exhale in the final beat; no music and no speech.",
      "Dialogue: none.",
    ].join("\n"),
  },
  {
    index: 3,
    name: "evidence-breakdown",
    seconds: "12",
    summary:
      "Show the narrow disagreement: ashwagandha is not pure quack, but evidence is mixed and safety caveats are real.",
    overlay: "MIXED EVIDENCE, REAL CAVEAT",
    prompt: [
      "Scene/background: clean research-desk and editorial evidence-board hybrid set, calm clinical realism.",
      "Subject: stacked paper studies with charts too blurred to read, abstract balance scale, amber caution triangle, varied generic objects implying inconsistency, anonymous hands moving evidence cards.",
      "Action: beat 1 (0-4s) a few positive-looking graph pulses appear on the evidence board; beat 2 (4-8s) different generic shapes rotate into frame, implying inconsistency and uncertainty; beat 3 (8-12s) the balance scale levels out while the amber caution triangle glows as a safety signal.",
      "Camera: precise tabletop top-down mixed with slow push-ins, highly legible composition, no gore and no readable labels.",
      "Audio: paper movement, subtle desk taps, quiet editorial room tone, and one restrained caution chime near the end; no music and no speech.",
      "Dialogue: none.",
    ].join("\n"),
  },
  {
    index: 4,
    name: "payoff-cta",
    seconds: "12",
    summary:
      "Resolve the thesis: keep the routine in the center, move the supplement to the margin, end with an open curiosity loop.",
    overlay: "FOOTNOTE, NOT DEFAULT",
    prompt: [
      "Scene/background: calm evening routine tableau in a modern bedroom-living space with warm low light and uncluttered surfaces.",
      "Subject: warm lamp, book, breathing posture, balanced dinner plate, sleep mask, and a small neutral amber token moved off to the side like an optional footnote.",
      "Action: beat 1 (0-4s) lifestyle routine elements take center frame in a clean sequence; beat 2 (4-8s) the amber token is placed gently at the edge of the composition instead of the center; beat 3 (8-12s) final resolved composition suggests the routine is primary and the shortcut is secondary, ending with open-question energy.",
      "Camera: smooth vertical crane and close detail cuts, premium calm finish, no faces, no text.",
      "Audio: lamp click, page turn, plate set-down, calm room tone, and a soft resolving swell at the end; no speech.",
      "Dialogue: none.",
    ].join("\n"),
  },
];

function nowIso() {
  return new Date().toISOString();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function atempoChain(targetRate) {
  const filters = [];
  let rate = targetRate;

  while (rate > 2) {
    filters.push("atempo=2");
    rate /= 2;
  }
  while (rate < 0.5) {
    filters.push("atempo=0.5");
    rate /= 0.5;
  }
  filters.push(`atempo=${rate.toFixed(5)}`);
  return filters.join(",");
}

function toSrtTimestamp(seconds) {
  const safe = Math.max(0, seconds);
  const totalMs = Math.round(safe * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function buildSrt(segments) {
  return `${segments
    .map(
      (segment, index) =>
        `${index + 1}\n${toSrtTimestamp(segment.t0)} --> ${toSrtTimestamp(segment.t1)}\n${segment.text}`,
    )
    .join("\n\n")}\n`;
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

async function probeDuration(filePath) {
  const { stdout } = await execFileAsync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ],
    {
      cwd: WORK_DIR,
      maxBuffer: 1024 * 1024,
    },
  );
  return Number.parseFloat(stdout.trim());
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

async function synthesizeSegment(client, segment, destination) {
  const response = await client.audio.speech.create({
    model: TTS_MODEL,
    voice: TTS_VOICE,
    input: segment.text,
    response_format: "mp3",
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(destination, buffer);
}

async function buildNarration(client, destination) {
  const textPath = path.join(WORK_DIR, "voiceover.txt");
  const tempDir = path.join(WORK_DIR, ".tts-temp");
  await writeText(textPath, NARRATION_SEGMENTS.map((segment) => segment.text).join("\n"));
  await fs.rm(tempDir, { recursive: true, force: true });
  await ensureDir(tempDir);

  try {
    const fittedSegments = [];

    for (let index = 0; index < NARRATION_SEGMENTS.length; index += 1) {
      const segment = NARRATION_SEGMENTS[index];
      const clipId = String(index + 1).padStart(2, "0");
      const sourcePath = path.join(tempDir, `tts-${clipId}.mp3`);
      const fittedPath = path.join(tempDir, `tts-fit-${clipId}.wav`);
      const targetDuration = segment.t1 - segment.t0;

      await synthesizeSegment(client, segment, sourcePath);
      const actualDuration = await probeDuration(sourcePath);
      const rate = actualDuration / targetDuration;
      const audioFilter = `${atempoChain(rate)},volume=1.65`;

      await execFileAsync(
        "ffmpeg",
        [
          "-y",
          "-i",
          sourcePath,
          "-filter:a",
          audioFilter,
          "-ar",
          "48000",
          "-ac",
          "2",
          "-t",
          targetDuration.toFixed(3),
          fittedPath,
        ],
        {
          cwd: WORK_DIR,
          maxBuffer: 1024 * 1024 * 8,
        },
      );

      fittedSegments.push({
        path: fittedPath,
        startMs: Math.round(segment.t0 * 1000),
      });
    }

    const filterParts = [];
    const mixInputs = [];
    const ffmpegArgs = ["-y"];

    fittedSegments.forEach((segment, index) => {
      ffmpegArgs.push("-i", segment.path);
      filterParts.push(`[${index}:a]adelay=${segment.startMs}|${segment.startMs}[a${index}]`);
      mixInputs.push(`[a${index}]`);
    });

    filterParts.push(
      `${mixInputs.join("")}amix=inputs=${mixInputs.length}:duration=longest:normalize=0[aout]`,
    );
    ffmpegArgs.push(
      "-filter_complex",
      filterParts.join(";"),
      "-map",
      "[aout]",
      "-ar",
      "48000",
      "-ac",
      "2",
      destination,
    );

    await execFileAsync("ffmpeg", ffmpegArgs, {
      cwd: WORK_DIR,
      maxBuffer: 1024 * 1024 * 16,
    });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function renderMasterVideo(clips, outputPath) {
  const args = ["-y"];
  for (const clip of clips) {
    args.push("-i", clip.filePath);
  }

  const concatInputs = clips.map((_, idx) => `[${idx}:v:0][${idx}:a:0]`).join("");
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

  await execFileAsync("ffmpeg", args, {
    cwd: WORK_DIR,
    maxBuffer: 1024 * 1024 * 16,
  });
}

async function renderFinalVideo(masterVideoPath, narrationPath, outputPath) {
  await execFileAsync(
    "ffmpeg",
    [
      "-y",
      "-i",
      masterVideoPath,
      "-i",
      narrationPath,
      "-filter_complex",
      "[0:a]volume=0.24[bg];[1:a]volume=1.45[narr];[bg][narr]amix=inputs=2:duration=first:normalize=0[aout]",
      "-map",
      "0:v:0",
      "-map",
      "[aout]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-shortest",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    {
      cwd: WORK_DIR,
      maxBuffer: 1024 * 1024 * 16,
    },
  );
}

async function writePackageFiles(clips, finalVideoPath, masterVideoPath, narrationPath) {
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
    ...SEGMENTS.map((segment) =>
      `- ${String(segment.index).padStart(2, "0")} ${segment.name} (${segment.seconds}s): ${segment.summary}`,
    ),
    "",
    "## Editorial Thesis",
    "- Keep the solid cortisol-rhythm advice from the original post.",
    "- Narrow disagreement: do not normalize ashwagandha as a casual evening default.",
    "- Mixed evidence is not the same as zero evidence, but it still needs a safety caveat.",
  ].join("\n");

  await writeText(path.join(WORK_DIR, "storyboard.md"), storyboard);
  await writeText(path.join(WORK_DIR, "title.txt"), TITLE);
  await writeText(path.join(WORK_DIR, "description.txt"), DESCRIPTION);
  await writeText(path.join(WORK_DIR, "tags.txt"), TAGS);
  await writeText(path.join(WORK_DIR, "pinned-comment.txt"), PINNED_COMMENT);
  await writeText(path.join(WORK_DIR, "final.srt"), buildSrt(NARRATION_SEGMENTS));

  await writeJson(path.join(WORK_DIR, "upload-manifest.json"), {
    project: PROJECT,
    created_at: nowIso(),
    format: {
      aspect_ratio: "9:16",
      size: SIZE,
      target_duration_seconds: 48,
    },
    outputs: {
      final_video: path.basename(finalVideoPath),
      final_video_alias: "final.mp4",
      master_video: path.basename(masterVideoPath),
      voiceover_audio: path.basename(narrationPath),
      voiceover_script: "voiceover.txt",
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
      tts_model: TTS_MODEL,
      tts_voice: TTS_VOICE,
      workflow: "4 Sora clips with native ambient audio stitched and mixed with TTS narration in post",
      narration: "generated in this pass and mixed over native Sora clip audio",
      sources: [
        "Sanjaay Babu original cortisol post (2026-03-13)",
        "Reply blog post (2026-03-17)",
      ],
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
    const prefix = `${PROJECT}-${clipNum}-${segment.name}`;
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

    const thumbRes = await client.videos.downloadContent(completed.id, {
      variant: "thumbnail",
    });
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
      summary: segment.summary,
      overlaySuggestion: segment.overlay,
      expiresAt: completed.expires_at,
      completedAt: completed.completed_at,
    };
    await writeJson(metadataPath, clipMeta);

    const clipRecord = {
      segment,
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

  const masterVideoPath = path.join(WORK_DIR, "sora2-master-48s.mp4");
  const narrationPath = path.join(WORK_DIR, "voiceover.wav");
  const finalVideoPath = path.join(WORK_DIR, "final-sora2.mp4");

  console.log(`[${nowIso()}] Stitching ${clips.length} clips into native-audio master MP4`);
  await renderMasterVideo(clips, masterVideoPath);
  console.log(`[${nowIso()}] Synthesizing narration with ${TTS_MODEL}/${TTS_VOICE}`);
  await buildNarration(client, narrationPath);
  console.log(`[${nowIso()}] Mixing narration with native clip audio`);
  await renderFinalVideo(masterVideoPath, narrationPath, finalVideoPath);

  manifest.outputs = {
    masterVideo: path.basename(masterVideoPath),
    narrationAudio: path.basename(narrationPath),
    finalVideo: path.basename(finalVideoPath),
  };
  await writeJson(path.join(WORK_DIR, "manifest.json"), manifest);
  await writePackageFiles(clips, finalVideoPath, masterVideoPath, narrationPath);

  console.log(`[${nowIso()}] Done. Final video: ${finalVideoPath}`);
}

run().catch((err) => {
  console.error(`[${nowIso()}] ERROR: ${err.message}`);
  process.exitCode = 1;
});
