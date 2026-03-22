# Shorts Micro-Soap

Minimal workspace scaffold for bilingual Tamil-English micro-soaps with a same-day sequel loop.

## What is here

- `generate-episode.mjs`: writes strict episode JSON using the Responses API or a deterministic mock fallback.
- `tts.mjs`: generates per-beat speech files with `gpt-4o-mini-tts`.
- `render.mjs`: writes `SRT`/`VTT`, assembles audio when available, and renders a simple 9:16 MP4 when `ffmpeg` is installed.
- `queue.mjs`: small rate-limit queue plus exponential-backoff retry helper.
- `codex_prompt.txt`: reusable strict-JSON seed prompt.
- `state.json`: continuity memory for names, location, and winning twists.
- `shorts.css`: subtitle-safe overlay tokens for an HTML/CSS preview if you want one later.

## Verified defaults

- Script model defaults to `gpt-5-mini`, and you can override it with `MICROSOAP_SCRIPT_MODEL` if you want a verified snapshot.
- TTS defaults to `gpt-4o-mini-tts` via the Audio Speech API.
- Voice defaults to `alloy` for both languages unless you override with `MICROSOAP_TTS_EN_VOICE` or `MICROSOAP_TTS_TA_VOICE`.
- Rate limits vary by usage tier, so the queue uses env-driven RPM caps instead of hardcoding one tier's numbers.

## Commands

From repo root:

```bash
npm run microsoap:generate -- --mock
npm run microsoap:tts -- --episode packages/shorts-microsoap/out/latest.json
npm run microsoap:render -- --episode packages/shorts-microsoap/out/latest.json
```

To keep the site demo catalog in sync:

```bash
npm run microsoap:generate -- --mock --catalog-out apps/personal-website/public/microsoap/catalog.json
```

If you want a pinned model snapshot, set `MICROSOAP_SCRIPT_MODEL` to a verified snapshot string from the OpenAI model page instead of editing the script.
