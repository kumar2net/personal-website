#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import { assertEpisodeShape, buildEpisodeJsonSchema, toCatalogEpisode } from './schema.mjs';

const PACKAGE_DIR = path.resolve('packages/shorts-microsoap');
const DEFAULT_STATE_PATH = path.join(PACKAGE_DIR, 'state.json');
const DEFAULT_OUT_DIR = path.join(PACKAGE_DIR, 'out');
const DEFAULT_MODEL = process.env.MICROSOAP_SCRIPT_MODEL || 'gpt-5-mini';

function parseArgs(argv) {
  const parsed = {
    state: DEFAULT_STATE_PATH,
    outDir: DEFAULT_OUT_DIR,
    model: DEFAULT_MODEL,
    mock: false,
    catalogOut: '',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];
    if (token === '--mock') {
      parsed.mock = true;
      continue;
    }
    if (token.startsWith('--state=')) {
      parsed.state = token.slice('--state='.length);
      continue;
    }
    if (token === '--state' && next) {
      parsed.state = next;
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
      continue;
    }
    if (token.startsWith('--catalog-out=')) {
      parsed.catalogOut = token.slice('--catalog-out='.length);
      continue;
    }
    if (token === '--catalog-out' && next) {
      parsed.catalogOut = next;
      index += 1;
    }
  }

  return parsed;
}

async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function extractResponseText(response) {
  if (!response || !Array.isArray(response.output)) {
    return '';
  }
  return response.output
    .flatMap((entry) => entry.content || [])
    .filter((entry) => entry.type === 'output_text')
    .map((entry) => entry.text || '')
    .join('')
    .trim();
}

function toEpisodeId(seriesSlug, episodeNumber) {
  return `${seriesSlug}-${String(episodeNumber).padStart(3, '0')}`;
}

function buildMockEpisode(state, episodeId) {
  const leadA = state.characters?.[0]?.name || 'Ananya';
  const leadB = state.characters?.[1]?.name || 'Karthik';
  const location = state.locations?.[0] || 'Rajiv Street terrace';
  const continuity = state.recentOutcomes?.[0]?.summary || 'A letter appears after the power cut.';

  return {
    id: episodeId,
    title: `Rain on ${location}`,
    durationSec: state.targetDurationSec || 24,
    continuityTokens: [leadA, leadB, location, continuity].filter(Boolean),
    beats: [
      {
        beat: 'hook',
        speaker: leadA,
        lang: 'en',
        line: 'The lights are back. So who left this letter here?',
      },
      {
        beat: 'pivot',
        speaker: leadB,
        lang: 'ta',
        line: 'இது நம்ம வீட்டு எழுத்தே இல்ல... ஆனா பெயர் உன்னோடே இருக்கு.',
        pronunciation: 'idhu namma veettu ezhuthe illa... aana peyar unnode irukku.',
      },
      {
        beat: 'cliffhanger',
        speaker: leadA,
        lang: 'en',
        line: 'If my name is on it, why is tonight’s date from next week?',
      },
    ],
    audiencePrompt: {
      text: 'Pick the next twist.',
      choices: [
        { id: 'A', label: 'The letter predicts tomorrow’s blackout' },
        { id: 'B', label: 'The neighbour forged the note to hide a drone video' },
      ],
    },
  };
}

async function generateEpisodeFromModel({ state, episodeId, model }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for live generation');
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const schema = buildEpisodeJsonSchema();

  const response = await client.responses.create({
    model,
    text: {
      format: {
        type: 'json_schema',
        name: 'microsoap_episode',
        schema,
      },
    },
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: [
              'You write buildable bilingual micro-soap episodes for vertical short video.',
              'Return exactly one 15-30 second episode with exactly 3 beats in this order: hook, pivot, cliffhanger.',
              'Mix Tamil and English naturally across the three beats.',
              'If a beat is in Tamil, include a brief Latin-script pronunciation string.',
              'Keep each spoken line short enough for a fast 22-28 second render.',
              'End with a one-line audience prompt and exactly two continuation choices labelled A and B.',
            ].join(' '),
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: JSON.stringify(
              {
                episodeId,
                seriesTitle: state.seriesTitle,
                localePair: state.localePair,
                targetDurationSec: state.targetDurationSec,
                characters: state.characters,
                locations: state.locations,
                continuityTokens: state.continuityTokens,
                recentOutcomes: state.recentOutcomes?.slice(0, 3) || [],
                constraints: {
                  maxBeats: 3,
                  maxChoices: 2,
                  maxSecondsPerLine: 8,
                },
              },
              null,
              2,
            ),
          },
        ],
      },
    ],
  });

  const text = extractResponseText(response);
  if (!text) {
    throw new Error('Model returned empty episode JSON');
  }
  return JSON.parse(text);
}

function updateState(state, episode) {
  const nextEpisodeNumber = Number(state.nextEpisodeNumber || 1) + 1;
  const historyEntry = {
    episodeId: episode.id,
    title: episode.title,
    generatedAt: episode.generatedAt,
    continuityTokens: episode.continuityTokens,
  };

  return {
    ...state,
    nextEpisodeNumber,
    lastGeneratedAt: episode.generatedAt,
    recentEpisodes: [historyEntry, ...(state.recentEpisodes || [])].slice(0, 5),
  };
}

async function updateCatalog(catalogPath, state, episode) {
  const existing = await readJson(catalogPath, {
    version: 'microsoap.catalog.v1',
    generatedAt: '',
    series: {
      title: state.seriesTitle,
      description: state.description || 'Bilingual Tamil-English micro-soap experiments.',
    },
    episodes: [],
  });

  const nextCatalog = {
    ...existing,
    version: 'microsoap.catalog.v1',
    generatedAt: episode.generatedAt,
    series: {
      title: state.seriesTitle,
      description: state.description || existing.series?.description || '',
    },
    episodes: [toCatalogEpisode(episode), ...(existing.episodes || []).filter((entry) => entry.id !== episode.id)].slice(0, 5),
  };

  await writeJson(catalogPath, nextCatalog);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const statePath = path.resolve(options.state);
  const outDir = path.resolve(options.outDir);
  const state = await readJson(statePath);

  if (!state) {
    throw new Error(`State file not found: ${statePath}`);
  }

  const episodeNumber = Number(state.nextEpisodeNumber || 1);
  const episodeId = toEpisodeId(state.seriesSlug || 'microsoap', episodeNumber);
  const baseEpisode =
    options.mock || !process.env.OPENAI_API_KEY
      ? buildMockEpisode(state, episodeId)
      : await generateEpisodeFromModel({ state, episodeId, model: options.model });

  const episode = assertEpisodeShape({
    ...baseEpisode,
    id: episodeId,
    generatedAt: new Date().toISOString(),
    assets: baseEpisode.assets || {},
  });

  const episodePath = path.join(outDir, 'episodes', `${episode.id}.json`);
  await writeJson(episodePath, episode);
  await writeJson(path.join(outDir, 'latest.json'), episode);
  await writeJson(statePath, updateState(state, episode));

  if (options.catalogOut) {
    await updateCatalog(path.resolve(options.catalogOut), state, episode);
  }

  console.log(`Episode written: ${episodePath}`);
  if (options.catalogOut) {
    console.log(`Catalog updated: ${path.resolve(options.catalogOut)}`);
  }
}

main().catch((error) => {
  console.error(`[microsoap:generate] ${error.message}`);
  process.exit(1);
});
