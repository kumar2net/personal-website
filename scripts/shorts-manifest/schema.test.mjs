import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { loadManifest } from './schema.mjs';
import { buildRenderPlan } from './plan.mjs';

const templateManifestPath = path.resolve('content/shorts/template/manifest.json');

test('loadManifest resolves shorts companion files', async () => {
  const manifest = await loadManifest(templateManifestPath);

  assert.equal(manifest.template.tokens.brand.safe_margin, 72);
  assert.equal(manifest.slots.lower_third.handle, '__SHORT_HANDLE__');
  assert.equal(manifest.metadata.locales.en.output, 'renders/en.mp4');
});

test('buildRenderPlan includes template slots and locale metadata', async () => {
  const manifest = await loadManifest(templateManifestPath);
  const renderPlan = buildRenderPlan(manifest, {
    cutName: 'shorts-9.16-hi',
    lang: 'hi',
  });

  assert.equal(renderPlan.lang, 'hi');
  assert.equal(renderPlan.localeMetadata.output, 'renders/hi.mp4');
  assert.equal(renderPlan.captions.length, 12);
  assert.equal(renderPlan.audio.lang, 'hi');
  assert.equal(renderPlan.slots.cta.site, '__SHORT_SITE__');
  assert.equal(renderPlan.template.id, 'canonical-9x16-v1');
});
