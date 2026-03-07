#!/usr/bin/env node
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import OpenAI from 'openai';
import { loadManifest } from './schema.mjs';
import { buildRenderPlan } from './plan.mjs';

const execFileAsync = promisify(execFile);
const DEFAULT_TTS_MODEL = process.env.BLOG_TTS_MODEL || 'gpt-4o-mini-tts';
const DEFAULT_TTS_VOICE = process.env.BLOG_TTS_EN_VOICE || 'alloy';
function parseArgs(args) {
  const parsed = {
    manifest: '',
    cut: '',
    lang: 'en',
    out: '',
    voice: DEFAULT_TTS_VOICE,
    model: DEFAULT_TTS_MODEL,
    keepTemp: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg.startsWith('--manifest=')) {
      parsed.manifest = arg.slice('--manifest='.length);
      continue;
    }
    if (arg === '--manifest' && next) {
      parsed.manifest = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--cut=')) {
      parsed.cut = arg.slice('--cut='.length);
      continue;
    }
    if (arg === '--cut' && next) {
      parsed.cut = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--lang=')) {
      parsed.lang = arg.slice('--lang='.length);
      continue;
    }
    if (arg === '--lang' && next) {
      parsed.lang = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--out=')) {
      parsed.out = arg.slice('--out='.length);
      continue;
    }
    if (arg === '--out' && next) {
      parsed.out = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--voice=')) {
      parsed.voice = arg.slice('--voice='.length);
      continue;
    }
    if (arg === '--voice' && next) {
      parsed.voice = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--model=')) {
      parsed.model = arg.slice('--model='.length);
      continue;
    }
    if (arg === '--model' && next) {
      parsed.model = next;
      index += 1;
      continue;
    }
    if (arg === '--keep-temp') {
      parsed.keepTemp = true;
    }
  }

  return parsed;
}

function ensureApiKey() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for shorts:render');
  }
  return apiKey;
}

async function run(command, args, options = {}) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    maxBuffer: 20 * 1024 * 1024,
    ...options,
  });
  return { stdout, stderr };
}

async function probeDuration(filePath) {
  const { stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    filePath,
  ]);
  const value = Number.parseFloat(stdout.trim());
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Unable to determine duration for ${filePath}`);
  }
  return value;
}

function atempoChain(targetRate) {
  const filters = [];
  let rate = targetRate;

  while (rate > 2) {
    filters.push('atempo=2');
    rate /= 2;
  }
  while (rate < 0.5) {
    filters.push('atempo=0.5');
    rate /= 0.5;
  }
  filters.push(`atempo=${rate.toFixed(5)}`);
  return filters.join(',');
}

function toSrtTimestamp(seconds) {
  const safe = Math.max(0, seconds);
  const totalMs = Math.round(safe * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

async function synthesizeSegment(client, segment, destination, options) {
  const response = await client.audio.speech.create({
    model: options.model,
    voice: options.voice,
    input: segment.text,
    response_format: 'mp3',
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, buffer);
}

async function buildNarration(client, audioSegments, destination, tempDir, options) {
  const fittedSegments = [];

  for (let index = 0; index < audioSegments.length; index += 1) {
    const segment = audioSegments[index];
    const sourcePath = path.join(tempDir, `tts-${String(index + 1).padStart(2, '0')}.mp3`);
    const fittedPath = path.join(tempDir, `tts-fit-${String(index + 1).padStart(2, '0')}.wav`);
    const targetDuration = segment.t1 - segment.t0;
    await synthesizeSegment(client, segment, sourcePath, options);
    const actualDuration = await probeDuration(sourcePath);
    const rate = actualDuration / targetDuration;
    const audioFilter = `${atempoChain(rate)},volume=1.8`;

    await run('ffmpeg', [
      '-y',
      '-i',
      sourcePath,
      '-filter:a',
      audioFilter,
      '-ar',
      '48000',
      '-ac',
      '1',
      '-t',
      targetDuration.toFixed(3),
      fittedPath,
    ]);

    fittedSegments.push({
      path: fittedPath,
      startMs: Math.round(segment.t0 * 1000),
    });
  }

  const filterParts = [];
  const mixInputs = [];
  const ffmpegArgs = ['-y'];

  fittedSegments.forEach((segment, index) => {
    ffmpegArgs.push('-i', segment.path);
    filterParts.push(
      `[${index}:a]adelay=${segment.startMs}|${segment.startMs}[a${index}]`,
    );
    mixInputs.push(`[a${index}]`);
  });

  filterParts.push(`${mixInputs.join('')}amix=inputs=${mixInputs.length}:duration=longest:normalize=0[aout]`);
  ffmpegArgs.push(
    '-filter_complex',
    filterParts.join(';'),
    '-map',
    '[aout]',
    '-ar',
    '48000',
    '-ac',
    '1',
    destination,
  );

  await run('ffmpeg', ffmpegArgs);
}

async function stitchVideo(videoPaths, destination, fps) {
  const tempListDir = await mkdtemp(path.join(os.tmpdir(), 'shorts-concat-'));
  const listPath = path.join(tempListDir, 'inputs.txt');
  const contents = videoPaths.map((entry) => `file '${entry.replace(/'/g, "'\\''")}'`).join('\n') + '\n';
  await writeFile(listPath, contents, 'utf8');

  try {
    await run('ffmpeg', [
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      listPath,
      '-r',
      String(fps),
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-an',
      destination,
    ]);
  } finally {
    await rm(tempListDir, { recursive: true, force: true });
  }
}

function buildVideoFilter(plan, subtitlePath) {
  const totalDuration = plan.cut.range[1] - plan.cut.range[0];
  void subtitlePath;

  const filters = [
    'scale=1080:1920:force_original_aspect_ratio=increase',
    'crop=1080:1920',
    'format=yuv420p',
    'drawbox=x=72:y=72:w=936:h=24:color=#1A1C22@0.92:t=fill',
    `drawbox=x=72:y=72:w='min(936, 936*(t/${totalDuration.toFixed(3)}))':h=24:color=#00C2FF@0.96:t=fill`,
  ];

  return filters.join(',');
}

async function writeSubtitles(plan, destination) {
  const body = plan.audio.segments
    .map((segment, index) => `${index + 1}\n${toSrtTimestamp(segment.t0)} --> ${toSrtTimestamp(segment.t1)}\n${segment.text.trim()}`)
    .join('\n\n');
  await writeFile(destination, `${body}\n`, 'utf8');
}

function resolveSource(baseDir, source) {
  if (/^[a-z]+:\/\//iu.test(source)) {
    throw new Error(`Video source must be a local file path for rendering: ${source}`);
  }
  return path.resolve(baseDir, source);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.manifest) {
    console.error('Usage: node scripts/shorts-manifest/render-locale.mjs --manifest <path> [--cut <name>] [--lang en] [--out <path>] [--voice alloy] [--model gpt-4o-mini-tts]');
    process.exit(1);
  }

  const manifestPath = path.resolve(options.manifest);
  const manifestDir = path.dirname(manifestPath);
  const manifest = await loadManifest(manifestPath);
  const plan = buildRenderPlan(manifest, {
    cutName: options.cut || undefined,
    lang: options.lang || 'en',
  });

  if (!plan.audio?.segments?.length) {
    throw new Error(`No audio segments found for lang=${plan.lang}`);
  }

  const apiKey = ensureApiKey();
  const client = new OpenAI({ apiKey });

  const outputPath = path.resolve(options.out || path.join(manifestDir, plan.localeMetadata?.output || `renders/${plan.lang}.mp4`));
  await mkdir(path.dirname(outputPath), { recursive: true });

  const tempDir = await mkdtemp(path.join(os.tmpdir(), `shorts-render-${plan.lang}-`));
  try {
    const videoSources = plan.videoSources
      .slice()
      .sort((a, b) => a.in - b.in)
      .map((entry) => resolveSource(manifestDir, entry.source));

    const stitchedVideoPath = path.join(tempDir, 'video-base.mp4');
    const narrationPath = path.join(tempDir, `${plan.lang}-narration.wav`);
    const subtitlePath = path.join(tempDir, `${plan.lang}.srt`);

    await stitchVideo(videoSources, stitchedVideoPath, plan.project.fps);
    await buildNarration(client, plan.audio.segments, narrationPath, tempDir, {
      model: options.model,
      voice: options.voice,
    });
    await writeSubtitles(plan, subtitlePath);

    const videoFilter = buildVideoFilter(plan, subtitlePath);
    await run('ffmpeg', [
      '-y',
      '-i',
      stitchedVideoPath,
      '-i',
      narrationPath,
      '-filter_complex',
      `[0:v]${videoFilter}[vout]`,
      '-map',
      '[vout]',
      '-map',
      '1:a',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-r',
      String(plan.project.fps),
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-shortest',
      outputPath,
    ]);

    console.log(`Rendered: ${outputPath}`);
  } finally {
    if (!options.keepTemp) {
      await rm(tempDir, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
