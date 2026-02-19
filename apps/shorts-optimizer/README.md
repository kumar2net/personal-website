# Shorts CTR Optimizer

A deterministic CLI agent that audits recent YouTube Shorts, diagnoses low CTR/retention, and produces upload-ready variant assets under `/out`.

## `#ytshortsak.md` constraints summary

The optimizer enforces these canonical rules from `skills/ytshortsak.md`:
- hook in <2s, no greeting/branding intro
- one idea only, 45-55s target, curiosity-loop ending
- hard-cut pacing, visual changes every 2-3s, captions always on
- retention-first edits: first frame motion, pattern interrupts, fast payoff
- title style: tension + specificity (avoid generic "my thoughts" phrasing)

## What it generates

For each optimized video:

```text
/out/{videoId}/{timestamp}/
  metrics.json
  diagnosis.md
  variant_plan.json
  script.txt
  title_and_hashtags.txt
  pinned_comment.txt
```

No `ffmpeg` is required. `variant_plan.json` is renderer-agnostic (timeline + edit-decision list).

## Setup

From repo root:

```bash
npm install
npm run --workspace apps/shorts-optimizer build
```

### Environment variables

- `OPENAI_API_KEY` (optional, enables LLM diagnosis/rewrite refinement)
- `OPENAI_MODEL` (optional, default: `gpt-4.1-mini`)
- YouTube auth (choose one):
  - OAuth refresh token flow:
    - `YT_CLIENT_ID`
    - `YT_CLIENT_SECRET`
    - `YT_REFRESH_TOKEN`
  - or ADC/service account path via standard Google auth env vars

Optional:
- `SHORTS_OPTIMIZER_OUT_DIR` (default: `<repo>/out`)
- `SHORTS_OPTIMIZER_FIXTURE` (path to mock JSON fixture)
- `SHORTS_OPTIMIZER_MOCK=1` (force fixture mode)

## CLI

From `apps/shorts-optimizer`:

```bash
node dist/index.js optimize --last 10
node dist/index.js optimize --videoId dQw4w9WgXcQ
node dist/index.js optimize --last 1 --channelMine
```

Mock mode (works without API creds):

```bash
node dist/index.js optimize --last 1 --mock
```

The summary table prints:
- `videoId`
- CTR
- suggested primary fix
- output folder

## Notes

- First 2-hour granularity is used as a proxy only when possible; YouTube Analytics is day-granular for these metrics. Otherwise, the optimizer uses a 7-day window fallback.
- Required baseline rules are always applied before LLM refinement:
  - CTR < 4% -> change first frame + first subtitle line + title
  - Avg view % < 60% -> add 2-3s pattern interrupt + tighten pacing
  - Avg view duration < 20s for 40-60s Shorts -> cut intro + move payoff earlier
