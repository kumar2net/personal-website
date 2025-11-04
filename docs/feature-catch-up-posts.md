# Feature: Blog Catch-up Experience

## Overview

Replace the legacy unread posts bell with a catch-up workflow that surfaces new blog content and lets readers mark themselves as caught up.

## Components

- Hook: `src/hooks/useCatchUpPosts.js`
- Header UI: `src/components/CatchUpMenu.jsx`
- Blog banner & filter: `src/pages/Blog.jsx`
- Post view auto-marking: `src/pages/blog/PostDynamic.jsx`
- Status surface: `src/pages/Status.jsx`

## Behavior

- Store the last catch-up timestamp (`user_last_catchup_v1`) in `localStorage`.
- Compare each post's `dateModified` (fallback to `datePublished`) against that timestamp.
- Header pill displays `Catch up (N new)` and opens a modal list of up to 12 posts with quick links and a "Mark as caught up" action.
- Blog page banner echoes the count, shows a preview list, and offers a filter to view only new posts.
- Opening a post waits 3 seconds before marking it as seen, so scrolling a post updates the timestamp automatically.
- `/status` shows the stored timestamp, lists queued posts, and includes QA buttons for marking caught up or resetting the timestamp.

## Analytics / Notes

- No GA events yet; instrumentation can hook into the catch-up actions if needed later.
- The modal uses a simple portal to avoid extra dependencies.
- Removing the unread bell eliminated feature flags (`VITE_FEATURE_UNREAD`, `feature_unread_v1`) and the per-slug read map.
