# Diagnosis for mock-short-002

Generated at: 2026-02-19T02:24:51.086Z

## Metrics Snapshot
- CTR (impressionClickThroughRate): 4.80%
- Impressions: 6800.00
- Views: 326.00
- Average View Duration: 28.20s
- Average View %: 63.00%
- First 3s Retention Proxy: 69.80%
- Window: last_7_days (2026-02-12 -> 2026-02-19)
- Window note: Fixture fallback window.

## Primary Fix
Keep current structure and run a title/hook A/B test only.

## Metric -> Issue
- **impressionClickThroughRate**: CTR is within baseline range. (current: 4.8, target: >= 4.0%)
  - Evidence: impressionClickThroughRate=4.80%
- **averageViewPercentage**: Average view percentage is within baseline range. (current: 63, target: >= 60%)
  - Evidence: averageViewPercentage=63.00%
- **averageViewDuration**: Average watched seconds are acceptable. (current: 28.2, target: >= 20s for 40-60s shorts)
  - Evidence: averageViewDuration=28.20s

## Why Report (metric -> change mapping)
| source | metric | trigger | change | why |
|---|---|---|---|---|
| baseline | overall | No baseline threshold breaches | Keep current structure and run a title/hook A/B test only. | Metrics are above minimum thresholds, so optimize incrementally. |

## Summary
CTR is 4.80%. Avg view % is 63.00%. Avg view duration is 28.20s. Primary fix: Keep current structure and run a title/hook A/B test only. First-3s retention proxy: 69.80%.
