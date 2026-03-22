#!/usr/bin/env node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { assertEpisodeShape } from './schema.mjs';

const execFileAsync = promisify(execFile);
const PACKAGE_DIR = path.resolve('packages/shorts-microsoap');

function parseArgs(argv) {
  const parsed = {
    episode: path.join(PACKAGE_DIR, 'out', 'latest.json'),
    voiceManifest: '',
    outDir: path.join(PACKAGE_DIR, 'out', 'renders'),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];
    if (token.startsWith('--episode=')) {
      parsed.episode = token.slice('--episode='.length);
      continue;
    }
    if (token === '--episode' && next) {
      parsed.episode = next;
      index += 1;
      continue;
    }
    if (token.startsWith('--voice-manifest=')) {
      parsed.voiceManifest = token.slice('--voice-manifest='.length);
      continue;
    }
    if (token === '--voice-manifest' && next) {
      parsed.voiceManifest = next;
      index += 1;
      continue;
    }
    if (token.startsWith('--out-dir=')) {
      parsed.outDir = token.slice('--out-dir='.length);
      continue;
    }
    if (token === '--out-dir' && next) {
      parsed.outDir = next;
      index += 1;
    }
  }

  return parsed;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeText(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, value.endsWith('\n') ? value : `${value}\n`, 'utf8');
}

async function commandExists(command) {
  try {
    await execFileAsync('which', [command]);
    return true;
  } catch {
    return false;
  }
}

async function probeDuration(filePath) {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    filePath,
  ]);
  return Number.parseFloat(stdout.trim());
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

function toVttTimestamp(seconds) {
  return toSrtTimestamp(seconds).replace(',', '.');
}

function buildSrt(segments) {
  return `${segments
    .map(
      (segment, index) =>
        `${index + 1}\n${toSrtTimestamp(segment.t0)} --> ${toSrtTimestamp(segment.t1)}\n${segment.text}`,
    )
    .join('\n\n')}\n`;
}

function buildVtt(segments) {
  return `WEBVTT\n\n${segments
    .map((segment) => `${toVttTimestamp(segment.t0)} --> ${toVttTimestamp(segment.t1)}\n${segment.text}`)
    .join('\n\n')}\n`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const episodePath = path.resolve(options.episode);
  const episode = assertEpisodeShape(await readJson(episodePath));
  const outDir = path.resolve(options.outDir, episode.id);
  await fs.mkdir(outDir, { recursive: true });

  const voiceManifestPath = options.voiceManifest
    ? path.resolve(options.voiceManifest)
    : path.join(PACKAGE_DIR, 'out', 'audio', episode.id, 'voice-manifest.json');
  const voiceManifest = await readJson(voiceManifestPath).catch(() => null);
  const beatFiles = (voiceManifest?.beats || [])
    .map((beat) => ({
      ...beat,
      absolutePath: beat.file ? path.resolve(path.dirname(voiceManifestPath), beat.file) : null,
    }))
    .filter((beat) => beat.absolutePath);

  const renderPlan = {
    version: 'microsoap.render.v1',
    episodeId: episode.id,
    generatedAt: new Date().toISOString(),
    inputs: {
      episode: episodePath,
      voiceManifest: voiceManifestPath,
    },
    outputs: {
      srt: path.join(outDir, 'final.srt'),
      vtt: path.join(outDir, 'final.vtt'),
      audio: path.join(outDir, 'final-audio.m4a'),
      video: path.join(outDir, 'final.mp4'),
      thumbnail: path.join(outDir, 'thumbnail.jpg'),
    },
  };

  let segments = [];
  if (beatFiles.length && (await commandExists('ffprobe'))) {
    let cursor = 0;
    for (let index = 0; index < beatFiles.length; index += 1) {
      const duration = await probeDuration(beatFiles[index].absolutePath);
      const textParts = [episode.beats[index]?.speaker, episode.beats[index]?.line];
      if (episode.beats[index]?.pronunciation) {
        textParts.push(`(${episode.beats[index].pronunciation})`);
      }
      segments.push({
        t0: cursor,
        t1: cursor + duration,
        text: textParts.filter(Boolean).join(': '),
      });
      cursor += duration;
    }
  } else {
    let cursor = 0;
    const defaultDuration = episode.durationSec / episode.beats.length;
    segments = episode.beats.map((beat) => {
      const entry = {
        t0: cursor,
        t1: cursor + defaultDuration,
        text: [beat.speaker, beat.line, beat.pronunciation ? `(${beat.pronunciation})` : '']
          .filter(Boolean)
          .join(': '),
      };
      cursor += defaultDuration;
      return entry;
    });
  }

  await writeText(renderPlan.outputs.srt, buildSrt(segments));
  await writeText(renderPlan.outputs.vtt, buildVtt(segments));
  await writeJson(path.join(outDir, 'render-plan.json'), renderPlan);

  if (!beatFiles.length || !(await commandExists('ffmpeg')) || !(await commandExists('ffprobe'))) {
    console.log(`Render plan written without media assembly: ${path.join(outDir, 'render-plan.json')}`);
    return;
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'microsoap-render-'));
  try {
    const concatListPath = path.join(tempDir, 'concat.txt');
    const concatList = beatFiles
      .map((entry) => `file '${entry.absolutePath.replace(/'/g, "'\\''")}'`)
      .join('\n');
    await writeText(concatListPath, concatList);

    await execFileAsync('ffmpeg', [
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      concatListPath,
      '-af',
      'loudnorm=I=-14:TP=-1:LRA=11',
      '-ar',
      '48000',
      '-ac',
      '1',
      renderPlan.outputs.audio,
    ]);

    const totalDuration = segments[segments.length - 1]?.t1 || episode.durationSec;
    await execFileAsync('ffmpeg', [
      '-y',
      '-f',
      'lavfi',
      '-i',
      `color=c=0x0F172A:s=1080x1920:d=${totalDuration.toFixed(3)}`,
      '-i',
      renderPlan.outputs.audio,
      '-vf',
      `subtitles=${renderPlan.outputs.srt}:force_style='Alignment=2,MarginV=180,FontSize=26,Outline=2,Shadow=0'`,
      '-map',
      '0:v',
      '-map',
      '1:a',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-shortest',
      renderPlan.outputs.video,
    ]);

    await execFileAsync('ffmpeg', [
      '-y',
      '-ss',
      String(Math.max(0, totalDuration / 2)),
      '-i',
      renderPlan.outputs.video,
      '-vframes',
      '1',
      renderPlan.outputs.thumbnail,
    ]);

    await writeJson(path.join(outDir, 'upload-manifest.json'), {
      version: 'microsoap.upload.v1',
      episodeId: episode.id,
      video: path.basename(renderPlan.outputs.video),
      audio: path.basename(renderPlan.outputs.audio),
      subtitles: ['final.srt', 'final.vtt'],
      thumbnail: path.basename(renderPlan.outputs.thumbnail),
    });

    console.log(`Rendered episode: ${renderPlan.outputs.video}`);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`[microsoap:render] ${error.message}`);
  process.exit(1);
});
