# YouTube Shorts Skill Framework (40-60 Seconds)

## Core Objective
Create high-retention, insight-dense, scroll-stopping vertical videos (9:16) that:
- Hook in under 2 seconds
- Deliver one powerful idea
- Create a curiosity loop
- End with a micro-CTA or open question

Target duration: 45-55 seconds  
Format: 9:16 | 1080x1920 | fast pacing

## Structure Template (High Retention Formula)

### 0-2 sec -> Pattern Interrupt Hook
- Start mid-thought
- Bold claim
- Contrarian statement
- Surprising fact
- Emotional spike

Examples:
- "Nobody eats rice correctly."
- "This is why your abscess keeps coming back."
- "AI will replace this job first."
- "You've been cooking peanuts wrong."

Do not include intro, greeting, or channel branding.

### 3-12 sec -> Context Compression
Give just enough background for the viewer to understand the problem.

Rules:
- One sentence per idea
- No fluff
- Visual change every 2-3 seconds
- Subtitles always on

### 13-35 sec -> Core Insight / Breakdown
Deliver the main value with:
- Visual progression
- Numbers
- Before vs after
- Analogy (vada metaphor can work)
- Contrasts
- Data point

One idea only. Do not stack multiple lessons.

### 36-50 sec -> Payoff
Summarize the insight clearly:
- "So the real issue isn't X - it's Y."
- "The mistake isn't eating rice. It's how you combine it."
- "AI won't replace you. People using AI will."

### 50-60 sec -> Curiosity Hook / CTA
Avoid generic "Like & Subscribe."

Use:
- "Should I test this next?"
- "Comment 'rice' if you want GI breakdown."
- "Want the Tamil version?"
- "Part 2?"

## Visual Style
- Vertical 9:16 always
- Fast jump cuts
- Zoom-ins every 3-5 sec
- On-screen captions (large, high contrast)
- Clean background
- No long transitions
- Hard cuts over cinematic fades

## Audio Rules
- Energetic but conversational
- Slight urgency
- Clear pauses after key lines
- Subtitle pacing matches speech
- No dead air longer than 1 second

If using AI TTS:
- Use expressive voice
- Slight speed increase (1.05-1.1x)
- Clean noise floor

## Content Types That Work

### 1. Food Science
- Glycemic index
- Calories comparison
- Cooking transformation (green -> paste -> tadka -> final)
- Cultural twist

### 2. Health Reality Checks
- Diabetes truths
- Abscess root causes
- What doctors do not emphasize
- Simple prevention frameworks

### 3. AI and Future
- AI job myths
- Data center energy
- Specific knowledge
- Automation systems

### 4. Philosophy in 60 sec
- Moral dilemma
- Sandel-style question
- "What would you choose?"

## Retention Optimization
- First frame must move
- No static frame over 3 seconds
- Text appears progressively
- Add subtle sound emphasis for key words
- Cut anything boring aggressively

If it drags, remove 20%.

## Titling Strategy
Use tension plus specificity.

Examples:
- "White Rice vs Red Rice (The Real Difference)"
- "Why AI Data Centers Are Changing Energy"
- "Your Doctor Won't Explain This About Abscess"
- "Peanuts: Raw vs Boiled vs Roasted"

Avoid:
- "My thoughts on..."
- "Today I will explain..."

## Series Strategy
Build arcs instead of random Shorts:
- Rice Series (GI, calories, metabolism, myths)
- Peanut Series (raw vs boiled vs roasted)
- AI Energy Series
- Diabetes Reality Series

Build anticipation.

## Prompt Template for Sora / Video Generation
"Create a 9:16 vertical 50-second short.  
Fast cuts.  
Hook in first 2 seconds.  
Deliver one core idea.  
High contrast captions.  
Energetic pacing.  
End with open curiosity loop.  
Topic: {insert topic}.  
Target audience: Gen Z + millennials."

## Latest Tweaks (Sora 2 Production)
- Default to `sora-2` for drafts and volume. Use `sora-2-pro` for hero shots or final renders when motion/texture fidelity is worth the extra cost.
- Keep the repo pattern: generate in `8-12s` chunks and stitch into `40-60s` outputs.
- Start with portrait `720x1280`; only move to higher-cost sizes when the thumbnail/readability payoff is clear.
- Use four-segment flow for the clip plan:
  1) Hook myth break
  2) Context compression
  3) Science breakdown
  4) Payoff + curiosity CTA
- Keep prompts visual-first and text-light.
- Avoid baked-in subtitles or readable on-screen text in generated clips; add captions in post so wording stays editable.
- Treat native Sora audio as ambience/foley. For scripted explainers, prefer a separate narration track so wording, pacing, and captions stay deterministic.
- Keep camera and composition dynamic every 2-3 seconds.
- Keep one insight only across all segments.

## Production Pipeline (Sora + TTS + Captions)
1. Lock the hook, payoff, and CTA before rendering. One idea, one promise, one emotional takeaway.
2. Render visual segments with `/v1/videos` using `sora-2` or `sora-2-pro`. Persist prompts, job ids, sizes, and per-segment outputs.
3. Generate narration with `/v1/audio/speech`. Default to `gpt-4o-mini-tts`; use `tts-1` or `tts-1-hd` only when you need older compatibility or a simpler voice set.
4. If you need word-level caption timing, transcribe the final narration audio with `whisper-1`, `response_format: "verbose_json"`, and `timestamp_granularities: ["word"]`. Current OpenAI docs only document word timestamps for `whisper-1`, not `gpt-4o-transcribe`.
5. Emit `final.vtt` and/or `final.srt` from the transcript JSON. Keep captions editable and add them in post.
6. Expect local post-processing when stitching multiple Sora clips or mixing narration. Do not promise an API-only workflow if the actual pipeline still needs `ffmpeg` or equivalent.

## Cost + Latency Guardrails
- Official 720p portrait pricing is `sora-2` at `$0.10/sec` and `sora-2-pro` at `$0.30/sec`.
- Batch pricing is materially cheaper for queue-based runs, so use it for bulk variant exploration instead of serial one-off renders.
- Quick math: a `15s` Short is roughly `$1.50` on `sora-2` or `$4.50` on `sora-2-pro`; a `48s` Short is roughly `$4.80` or `$14.40` before TTS/transcription.
- Treat Sora render time as async minutes, not realtime seconds. Queue variants in parallel instead of blocking on one clip at a time.

## Science Grounding Rules (Food/Health Shorts)
- State evidence strength honestly: "linked with", "associated with", not absolute cure/prevention language.
- Prefer meal-context framing over single-food absolutism.
- If comparing rice vs wheat for glycemic control, emphasize:
  1) grain refinement,
  2) portion size,
  3) protein + fiber pairing.
- Include a brief educational disclaimer when discussing health outcomes.

## Upload Package Checklist
- `final.mp4` (or `final-sora2.mp4`)
- `final.srt` and/or `final.vtt`
- `title.txt`
- `description.txt`
- `tags.txt`
- `pinned-comment.txt`
- `thumbnail.jpg`
- `upload-manifest.json`

## Personal Edge
Leverage:
- Tamil cultural references
- Family stories
- Local food context
- Data + philosophy mix
- Analytical but grounded tone

This differentiates from generic Shorts.

## Rule of One
One video.  
One insight.  
One emotional takeaway.  
Not five.

## Success Metrics
A good Short targets:
- `videoThumbnailImpressionsClickRate` above your recent baseline, not a random universal CTR target
- 70%+ retention at 30 sec
- 100%+ watch time ratio or strong `averageViewPercentage`
- rising `engagedViews` and comments per view
- 3-8% comment rate
- Shares greater than likes

Interpretation:
- Low CTR + decent AVD -> packaging problem (first frame, title, first subtitle line)
- Strong CTR + weak AVD -> hook sold the click, but the body/pacing failed
- Drop at 5 sec -> hook weak
- Drop at 20 sec -> pacing too slow
- Drop at 40 sec -> payoff unclear

## Early-Hour Analytics Decisioning
- Use official YouTube targeted-query metrics when available: `videoThumbnailImpressions`, `videoThumbnailImpressionsClickRate`, `views`, `engagedViews`, `averageViewDuration`, and `averageViewPercentage`.
- Do not claim documented 5-minute CTR rollups for these metrics. In this repo, early-hour readouts are same-day partial/day-level proxies, not minute-precise truth.
- Read CTR together with context. YouTube explicitly notes that early CTR can be inflated by loyal-audience traffic before wider distribution kicks in.
- If CTR and AVD both beat the 7-day baseline in the first review window, keep packaging and treat the variant as a winner candidate.
- If CTR is weak but AVD is solid, change first frame, title, and first subtitle line before rewriting the whole script.
- If CTR is acceptable but AVD or average view % is weak, tighten pacing, move payoff earlier, and add a pattern interrupt by 2-3 seconds.
- Repo-friendly thresholds:
  1) CTR < `4%` -> repackage opener
  2) Avg view % < `60%` -> tighten pacing
  3) Avg view duration < `20s` on a 40-60s Short -> cut intro and move payoff earlier

## Experimentation Loop
Post -> analyze thumbnail CTR, AVD, and retention graph -> rewrite opener or pacing -> rerun variation.

Iteration beats perfection.
