# Website Analytics (GA4)

This site now uses Google Analytics 4 (GA4) exclusively.

**Last Updated:** August 10, 2025

## Setup

- The GA tag is added in `index.html` using your Measurement ID.
- `send_page_view: false` is set to prevent automatic pageview; SPA route changes are tracked manually.
- SPA page_view events are emitted in `src/App.jsx` on React Router navigation.

## How it works

- Initial load: GA script initializes.
- On each route change: a `page_view` event is sent with `page_path`, `page_location`, and `page_title`.

## Testing

Use GA4 Realtime and the “Test” button to verify events when navigating the site.

## Removed

- Custom tracker (`public/analytics-tracker.js`)
- React hook (`src/hooks/useAnalytics.js`)
- Netlify analytics functions and relays
- Docs and config referencing the external analytics backend
Last updated: 2025-08-11
