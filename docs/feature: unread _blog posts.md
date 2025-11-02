new feature: un read blog posts notification system
1. the user when he uses my kuamr2net.com web application in his browser he will be notified about the unread blog posts.
2. count of unread blog posts and blog post title

# Feature: Unread Blog Posts Notifications

Status: In progress

Decisions
- Read trigger: dwell_3s
- Baseline: none
- Popover limit: 8

Overview
Implements per-browser unread tracking using localStorage. Navbar badge shows unread count; popover lists up to 8 unread with links; posts are marked read after 3s dwell.

Architecture
- Registry: `src/data/blogRegistry.js`
- Store: `src/utils/unreadStore.js`
- Hook: `src/hooks/useUnreadPosts.js`
- UI: `src/components/UnreadBell.jsx`
- Integrations: `src/App.jsx` (navbar), `src/pages/blog/PostDynamic.jsx` (mark-read), `src/pages/Blog.jsx` (toggle + chip)

Changelog
- 2025-11-02: Implemented registry, store, hook, UnreadBell; wired into navbar and post dwell (3s); added Blog page toggle and Unread chip.
- 2025-11-02: Fixed build error by adjusting `blogRegistry` to glob MD files with `?raw` (avoid Vite import analysis on markdown).
- 2025-11-02: Build verified with `vite build` (no errors); ready for QA.
- 2025-11-02: Added GA4 events (unread_badge_shown, unread_panel_open, unread_post_click) and mobile navbar bell; created PR.
 - 2025-11-02: Env+localStorage feature flag gating added; badge capped to "9+"; GA4 event for Blog toggle.

Implementation Notes
- Read is marked after 3s dwell in `src/pages/blog/PostDynamic.jsx`.
- Badge shows up to 8 unread items in a popover in `src/components/UnreadBell.jsx`.
- Blog page (`src/pages/Blog.jsx`) adds a "Show unread only" toggle and an "Unread" chip on cards.
- Storage key: `user_read_posts_v1`; feature flag key: `feature_unread_v1` (defaults to on).
- Normalization relies on `normalizePostId` from `src/utils/postUtils.js` to be resilient to slug variations.
- GA4 events fire only if `window.gtag` is present.
- Mobile: Unread bell added next to the hamburger menu in `src/App.jsx`.
- Feature flag gating:
  - Env breaker: `VITE_FEATURE_UNREAD=on|off` (defaults to `on` when absent) — set in Vercel Project Settings.
  - Local switch: `localStorage.setItem('feature_unread_v1','on|off')` — per‑browser override.
  - Effective state = env AND local. See `isFeatureEnabled()` in `src/utils/unreadStore.js`.
  - Badge count is capped to "9+" for large counts.

Pull Request
- https://github.com/kumar2net/personal-website/pull/17

Phase 2 (optional, Vercel-friendly)
- Goal: cross-device sync of read state.
- Recommended: Vercel KV (`@vercel/kv`) keyed by anonymous `user_id`.
  - API endpoints: `GET /api/unread?uid=<id>`, `PUT /api/unread` (merge strategy).
  - Env: `KV_REST_API_URL`, `KV_REST_API_TOKEN` configured in Vercel.
- Alternatives: Vercel Postgres or Vercel Blob (`@vercel/blob`) if KV isn’t available.
- No Netlify-specific components; deployment target is Vercel.
