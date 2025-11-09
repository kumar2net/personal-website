# Feature: Blog Catch-up Experience *(retired)*

## Overview

The catch-up workflow that replaced the unread posts bell has been removed. Navigation now links directly to the blog with no unread counters or local-storage tracking.

## Components

- **Removed in November 2025**
  - Hook: `src/hooks/useCatchUpPosts.js`
  - Header UI: `src/components/CatchUpMenu.jsx`
  - Blog banner & filter: `src/pages/Blog.jsx`
  - Post view auto-marking: `src/pages/blog/PostDynamic.jsx`
  - Status surface: `src/pages/Status.jsx`

## Behavior

- Historic reference (no longer active):
  - Store the last catch-up timestamp (`user_last_catchup_v1`) in `localStorage`.
  - Compare each post's `dateModified` (fallback to `datePublished`) against that timestamp.
  - Header pill displays `Catch up (N new)` and opens a modal list of up to 12 posts with quick links and a "Mark as caught up" action.
  - Blog page banner echoes the count, shows a preview list, and offers a filter to view only new posts.
  - Opening a post waits 3 seconds before marking it as seen, so scrolling a post updates the timestamp automatically.
  - `/status` shows the stored timestamp, lists queued posts, and includes QA buttons for marking caught up or resetting the timestamp.

## Analytics / Notes

- Historic notes (kept for archival context):
  - No GA events were added; instrumentation could have hooked into the catch-up actions if needed.
  - The modal used a simple portal to avoid extra dependencies.
  - Removing the unread bell eliminated feature flags (`VITE_FEATURE_UNREAD`, `feature_unread_v1`) and the per-slug read map.
