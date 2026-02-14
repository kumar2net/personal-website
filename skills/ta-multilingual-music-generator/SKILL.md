---
name: ta-multilingual-music-generator
description: Generate multilingual music writing packs from Tamil hints (`lang=ta`), including philosophical interpretation, lyrics in English/Hindi/Kannada/Spanish, Sanskrit interludes, and arrangement prompts with Om-chant background cues. Use when a request starts from a Tamil sentence and needs cross-language song creation with a knowledge-seeking spiritual theme.
---

# TA Multilingual Music Generator

## Core Goal

Transform a Tamil seed line into a unified multilingual song package that can be sent to a music model or a human composer.

## Workflow

1. Capture intent.
- Keep the original Tamil line exactly as provided.
- Detect explicit constraints: mood, tempo, genre, audience, and length.
- If constraints are missing, default to contemplative world-fusion, `74 BPM`, `4/4`, and a 3-4 minute track.

2. Interpret philosophy.
- Explain the seed idea in 3-5 sentences with knowledge-seeking as the center.
- For `அகம் பிரம்மாஸ்மி`, preserve user wording and optionally provide normalized Sanskrit form: `अहं ब्रह्मास्मि` / `Aham Brahmasmi`.
- Keep tone reflective and grounded, not dogmatic.

3. Build lyrical architecture.
- Create one narrative arc: invocation -> inquiry -> insight -> collective uplift.
- Write dedicated lyric blocks in English, Hindi, Kannada, and Spanish.
- Keep meaning aligned across languages while adapting idiom naturally.
- Insert Sanskrit interludes between major sections.

4. Compose Sanskrit interludes.
- Keep each interlude to 1-2 chant-friendly lines.
- Prefer wisdom and illumination motifs.
- Include transliteration for each Sanskrit line.

5. Add musical direction.
- Keep `Om` as a soft background chant (drone or layered pad) that supports, not overwhelms, vocals.
- Provide arrangement map: intro, verse cycles, interludes, bridge, outro.
- Provide instrument palette and dynamics (for example: tanpura/drone, soft percussion, ambient pads, flute/strings, optional piano).

6. Deliver generation-ready package.
- Follow `references/output-template.md`.
- End with one compact music-generation prompt that includes mood, language mix, interlude placement, and Om BGM behavior.

## Quality Gate

Pass output only if all checks succeed:
- Include Tamil source line and philosophical explanation.
- Include English, Hindi, Kannada, and Spanish lyric blocks.
- Include at least two Sanskrit interludes with transliteration.
- Keep the central message focused on seeking knowledge.
- Include explicit Om background-chant production guidance.

## Style Rules

- Keep language respectful across traditions.
- Prefer singable lines and clear rhythmic phrasing.
- Avoid dense abstractions that are hard to perform.
- Avoid stereotypes and literal mistranslations.
