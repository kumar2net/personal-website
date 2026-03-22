# Shorts Template

Starter pack for the canonical 9:16 multilingual Shorts workflow from the March 7, 2026 plan.

## What is included

- `manifest.json`: `sora-manifest.v1` project wired to English, Tamil, and Hindi cuts.
- `tokens.json`: brand tokens and safe-zone defaults.
- `slots.json`: hook, lower-third, sticker, payoff, and CTA swap slots.
- `metadata.json`: locale-specific YouTube titles, descriptions, tags, and output paths.
- `strategy.json`: hook formula, republish cadence, and upload/export specs for the shared Shorts playbook.
- `shorts_multilang_captioner.yaml`: agent prompt scaffold for SRT translation, TTS, and renders.
- `overlays/`: hook progress bars, lower-third, stickers, and CTA SVG starter assets.
- `captions/`: starter SRT files for `en`, `ta`, and `hi`.

## Usage

```bash
npm run shorts:scaffold -- --slug ai-on-upi --title "AI on UPI"
npm run shorts:validate -- --manifest content/shorts/ai-on-upi/manifest.json
npm run shorts:plan -- --manifest content/shorts/ai-on-upi/manifest.json --cut shorts-9.16-en --lang en
npm run shorts:subs -- --manifest content/shorts/ai-on-upi/manifest.json --lang ta
```

The manifest auto-loads `tokens.json`, `slots.json`, `metadata.json`, and `strategy.json` through `template.companionFiles`, so the repo CLI sees one coherent render bundle while you still edit the companion files directly.

The default delivery spec is `MP4 + H.264 + AAC`, `1080x1920` at `30fps`, with editable `SRT` and `VTT` subtitle outputs and supporting-asset slots for thumbnails and spritesheets.
