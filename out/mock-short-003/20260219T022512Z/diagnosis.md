# Diagnosis for mock-short-003

Generated at: 2026-02-19T02:25:12.690Z

## Metrics Snapshot
- CTR (impressionClickThroughRate): 2.90%
- Impressions: 3900.00
- Views: 111.00
- Average View Duration: 18.50s
- Average View %: 51.50%
- First 3s Retention Proxy: 58.20%
- Window: last_7_days (2026-02-12 -> 2026-02-19)
- Window note: Fixture fallback window.

## Primary Fix
Repackage the opening (first frame + first subtitle + title) to raise CTR.

## Metric -> Issue
- **impressionClickThroughRate**: CTR is below baseline threshold. (current: 2.9, target: >= 4.0%)
  - Evidence: impressionClickThroughRate=2.90%
- **averageViewPercentage**: Average view percentage indicates early/mid-video drop-off. (current: 51.5, target: >= 60%)
  - Evidence: averageViewPercentage=51.50%
- **averageViewDuration**: Average watched seconds are low for this short length. (current: 18.5, target: >= 20s for 40-60s shorts)
  - Evidence: averageViewDuration=18.50s

## Why Report (metric -> change mapping)
| source | metric | trigger | change | why |
|---|---|---|---|---|
| baseline | impressionClickThroughRate | CTR 2.90% is below 4.00% | Replace first frame with high-motion pattern interrupt visual. | Low CTR indicates the packaging is not stopping scrolls quickly. |
| baseline | impressionClickThroughRate | CTR 2.90% is below 4.00% | Rewrite first subtitle line as a contrarian 0-2s hook. | The opening line must increase curiosity before swipe-away. |
| baseline | impressionClickThroughRate | CTR 2.90% is below 4.00% | Retitle using tension + specificity format. | Title relevance and tension directly affect impression conversion. |
| baseline | averageViewPercentage | Average view % 51.50 is below 60.00 | Insert a pattern interrupt at 2-3s with a visual or tonal shift. | Early pacing refresh reduces drop-off after the opening hook. |
| baseline | averageViewPercentage | Average view % 51.50 is below 60.00 | Tighten pacing by removing low-signal filler lines. | Dense progression keeps one-idea narrative retention high. |
| baseline | averageViewDuration | Average view duration 18.50s is below 20s for a 40-60s short | Cut intro setup and start mid-thought in the first line. | The current opening delays value delivery. |
| baseline | averageViewDuration | Average view duration 18.50s is below 20s for a 40-60s short | Move payoff statement earlier into the 30-40s segment. | Earlier payoff increases completion likelihood. |

## Summary
CTR is 2.90%. Avg view % is 51.50%. Avg view duration is 18.50s. Primary fix: Repackage the opening (first frame + first subtitle + title) to raise CTR. First-3s retention proxy: 58.20%.
