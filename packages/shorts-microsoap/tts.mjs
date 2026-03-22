#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import { RateLimitQueue, withRetry } from './queue.mjs';
import { assertEpisodeShape } from './schema.mjs';

const PACKAGE_DIR = path.resolve('packages/shorts-microsoap');
const DEFAULT_OUT_DIR = path.join(PACKAGE_DIR, 'out', 'audio');
const DEFAULT_MODEL = process.env.MICROSOAP_TTS_MODEL || 'gpt-4o-mini-tts';
const DEFAULT_VOICE = process.env.MICROSOAP_TTS_VOICE || 'alloy';
const VOICE_BY_LANG = {
  en: process.env.MICROSOAP_TTS_EN_VOICE || DEFAULT_VOICE,
  ta: process.env.MICROSOAP_TTS_TA_VOICE || DEFAULT_VOICE,
};

function parseArgs(argv) {
  const parsed = {
    episode: path.join(PACKAGE_DIR, 'out', 'latest.json'),
    outDir: DEFAULT_OUT_DIR,
    model: DEFAULT_MODEL,
    mock: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];
    if (token === '--mock') {
      parsed.mock = true;
      continue;
    }
    if (token.startsWith('--episode=')) {
      parsed.episode = token.slice('--episode='.length);
      continue;
    }
    if (token === '--episode' && next) {
      parsed.episode = next;
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
      continue;
    }
    if (token.startsWith('--model=')) {
      parsed.model = token.slice('--model='.length);
      continue;
    }
    if (token === '--model' && next) {
      parsed.model = next;
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

async function writeBinary(filePath, response) {
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filePath, buffer);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const episodePath = path.resolve(options.episode);
  const episode = assertEpisodeShape(await readJson(episodePath));
  const outDir = path.resolve(options.outDir, episode.id);

  await fs.mkdir(outDir, { recursive: true });

  if (options.mock || !process.env.OPENAI_API_KEY) {
    const manifest = {
      version: 'microsoap.voice.v1',
      episodeId: episode.id,
      model: options.model,
      generatedAt: new Date().toISOString(),
      status: 'skipped',
      reason: options.mock ? 'mock mode' : 'missing OPENAI_API_KEY',
      beats: episode.beats.map((beat, index) => ({
        id: `beat-${index + 1}`,
        speaker: beat.speaker,
        lang: beat.lang,
        voice: VOICE_BY_LANG[beat.lang] || DEFAULT_VOICE,
        file: null,
      })),
    };
    const manifestPath = path.join(outDir, 'voice-manifest.json');
    await writeJson(manifestPath, manifest);
    console.log(`Voice manifest written without audio: ${manifestPath}`);
    return;
  }

  const queue = new RateLimitQueue({
    intervalMs: 60_000,
    intervalCap: Number(process.env.MICROSOAP_TTS_RPM || 60),
  });
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const beats = [];

  for (let index = 0; index < episode.beats.length; index += 1) {
    const beat = episode.beats[index];
    const fileName = `beat-${String(index + 1).padStart(2, '0')}-${beat.lang}.mp3`;
    const filePath = path.join(outDir, fileName);
    const voice = VOICE_BY_LANG[beat.lang] || DEFAULT_VOICE;

    const response = await queue.schedule(() =>
      withRetry(() =>
        client.audio.speech.create({
          model: options.model,
          voice,
          input: beat.line,
          response_format: 'mp3',
        }),
      ),
    );

    await writeBinary(filePath, response);

    beats.push({
      id: `beat-${index + 1}`,
      speaker: beat.speaker,
      lang: beat.lang,
      voice,
      file: fileName,
    });
  }

  const manifest = {
    version: 'microsoap.voice.v1',
    episodeId: episode.id,
    model: options.model,
    generatedAt: new Date().toISOString(),
    status: 'completed',
    beats,
  };
  const manifestPath = path.join(outDir, 'voice-manifest.json');
  await writeJson(manifestPath, manifest);
  console.log(`Voice manifest written: ${manifestPath}`);
}

main().catch((error) => {
  console.error(`[microsoap:tts] ${error.message}`);
  process.exit(1);
});
