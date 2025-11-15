## Reflections Feedback Capture (MVP)

### Objective
Ship a /reflections page with a lightweight family-feedback flow that lets relatives react to blog content, stores the last few notes per section in the Vercel Blob store (`store_jf0xCffb3qOqwhu6`), and keeps the UX simple enough for quick reactions on any device.

### Context
- Feedback originates from specific blog posts/sections, but it will be surfaced through a new `/reflections` entry point that can reference recent posts.
- Vercel Blob storage is already provisioned; the product just needs helper utilities and a simple UI to read/write JSON payloads.
- Only trusted family members use it, so we prioritize convenience over heavy auth. Lightweight guardrails (e.g., trimming input, short history) are enough.

### Primary Use Cases
1. A family member reads a blog post and wants to leave a short note or emoji reaction for a specific section.
2. The author (Kumara) opens `/reflections` to skim the latest notes grouped by post/section.
3. A user revisits a section and sees recent reactions (max ~8) to understand prior discussion.

### Functional Requirements
- **Blob helper**: `src/utils/blob.js` exposes `saveJSON(path, data)` and `loadJSON(path)` thin wrappers over `@vercel/blob`’s `put`/`get` for JSON payloads.
- **QuickForm component**:
  - Inline emoji shortcuts (`❤️ 👍 🤔 😂 🙌`) that append to the textarea on click.
  - Local state showing up to the last eight entries with timestamp metadata.
  - Handles optimistic UI (update list immediately, then persist).
  - Rejects empty submissions and trims whitespace.
- **Section embedding**:
  - `QuickForm` mounts within each blog section (after `<h2>` or analogous MDX container) with props `postId` and `sectionId`.
  - Each section writes to `/notes/{postId}/{sectionId}.json` in Blob storage.
  - `/reflections` route presents or links to the same components so the family has a canonical feedback hub.
- **Styling/UX**: Keep layout minimal (textarea, emoji row, list). Ensure it inherits site typography and works on mobile without scrolling jitter.

### Non-Functional Requirements
- Works in static/SSR builds without server-only APIs (client-side fetch to Blob).
- Handles missing files gracefully (returns empty state).
- Keeps bundle weight minimal (plain React hooks, no heavy UI library).
- Privacy: Content is public but obscure; avoid listing direct Blob URLs in UI to minimize casual discovery.

### Data & Storage
- Storage path: `/notes/{postId}/{sectionId}.json`.
- Schema: simple array of `{ text: string, ts: number }`. No user IDs.
- Retention: Automatically slice history to eight items client-side to limit Blob size.

### Dependencies / Technical Notes
- Uses `@vercel/blob` client (already in dependencies or to be added).
- Requires ensuring MDX or blog page can import React component (`QuickForm`) without breaking static generation.
- Build/test pipeline must pass (`pnpm turbo test` or equivalent).

### Milestones & Acceptance Criteria
1. **Helper & Component**: Blob utility and `QuickForm` committed with tests or storybook preview optional.
2. **Blog Integration**: All blog sections (or at least the newest posts) render the form with unique IDs; build succeeds locally.
3. **/reflections route**: Page deploys successfully on Vercel and links from nav/footers as appropriate.
4. **QA**: Manual test confirms emojis append, submissions persist, reload shows data, and Blob store updates.

### Open Questions
1. Should `/reflections` show aggregated data (latest across posts) or simply describe how to leave feedback?
2. Do we need lightweight spam protection (rate limiting, hidden honeypot)?
3. Is there a need for deletion/admin tools for outdated or incorrect notes?
