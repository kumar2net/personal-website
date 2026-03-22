function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertChoice(choice, index) {
  if (!choice || typeof choice !== 'object') {
    throw new Error(`audiencePrompt.choices[${index}] must be an object`);
  }
  assertNonEmptyString(choice.id, `audiencePrompt.choices[${index}].id`);
  assertNonEmptyString(choice.label, `audiencePrompt.choices[${index}].label`);
}

function assertBeat(beat, index) {
  if (!beat || typeof beat !== 'object') {
    throw new Error(`beats[${index}] must be an object`);
  }
  assertNonEmptyString(beat.beat, `beats[${index}].beat`);
  assertNonEmptyString(beat.speaker, `beats[${index}].speaker`);
  assertNonEmptyString(beat.lang, `beats[${index}].lang`);
  assertNonEmptyString(beat.line, `beats[${index}].line`);
  if (beat.pronunciation != null && typeof beat.pronunciation !== 'string') {
    throw new Error(`beats[${index}].pronunciation must be a string when provided`);
  }
}

export function assertEpisodeShape(episode) {
  if (!episode || typeof episode !== 'object') {
    throw new Error('episode must be an object');
  }

  assertNonEmptyString(episode.id, 'episode.id');
  assertNonEmptyString(episode.title, 'episode.title');
  if (!Number.isFinite(episode.durationSec) || episode.durationSec < 15 || episode.durationSec > 30) {
    throw new Error('episode.durationSec must be a number between 15 and 30');
  }
  if (!Array.isArray(episode.continuityTokens)) {
    throw new Error('episode.continuityTokens must be an array');
  }
  if (!Array.isArray(episode.beats) || episode.beats.length !== 3) {
    throw new Error('episode.beats must contain exactly 3 beats');
  }
  episode.beats.forEach(assertBeat);
  if (!episode.audiencePrompt || typeof episode.audiencePrompt !== 'object') {
    throw new Error('episode.audiencePrompt must be an object');
  }
  assertNonEmptyString(episode.audiencePrompt.text, 'episode.audiencePrompt.text');
  if (!Array.isArray(episode.audiencePrompt.choices) || episode.audiencePrompt.choices.length !== 2) {
    throw new Error('episode.audiencePrompt.choices must contain exactly 2 choices');
  }
  episode.audiencePrompt.choices.forEach(assertChoice);
  return episode;
}

export function toCatalogEpisode(episode) {
  return {
    id: episode.id,
    title: episode.title,
    durationSec: episode.durationSec,
    generatedAt: episode.generatedAt,
    continuityTokens: episode.continuityTokens,
    beats: episode.beats,
    audiencePrompt: episode.audiencePrompt,
    assets: episode.assets || {},
  };
}

export function buildEpisodeJsonSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'durationSec', 'continuityTokens', 'beats', 'audiencePrompt'],
    properties: {
      title: { type: 'string' },
      durationSec: { type: 'number' },
      continuityTokens: {
        type: 'array',
        minItems: 2,
        maxItems: 6,
        items: { type: 'string' },
      },
      beats: {
        type: 'array',
        minItems: 3,
        maxItems: 3,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['beat', 'speaker', 'lang', 'line'],
          properties: {
            beat: { type: 'string', enum: ['hook', 'pivot', 'cliffhanger'] },
            speaker: { type: 'string' },
            lang: { type: 'string', enum: ['en', 'ta'] },
            line: { type: 'string' },
            pronunciation: { type: 'string' },
          },
        },
      },
      audiencePrompt: {
        type: 'object',
        additionalProperties: false,
        required: ['text', 'choices'],
        properties: {
          text: { type: 'string' },
          choices: {
            type: 'array',
            minItems: 2,
            maxItems: 2,
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'label'],
              properties: {
                id: { type: 'string', enum: ['A', 'B'] },
                label: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };
}
