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

Implementation Notes
- Read is marked after 3s dwell in `src/pages/blog/PostDynamic.jsx`.
- Badge shows up to 8 unread items in a popover in `src/components/UnreadBell.jsx`.
- Blog page (`src/pages/Blog.jsx`) adds a "Show unread only" toggle and an "Unread" chip on cards.
- Storage key: `user_read_posts_v1`; feature flag key: `feature_unread_v1` (defaults to on).
- Normalization relies on `normalizePostId` from `src/utils/postUtils.js` to be resilient to slug variations.
