# Google Analytics (GA4) Production Setup Guide

**Last Updated:** August 10, 2025

## Current Status

Production analytics now use Google Analytics 4 (GA4). The site posts page_view events via `gtag.js` and manual SPA routing hooks.

## GA4 Setup

1. Add GA tag in `index.html` with Measurement ID (`G-...`).
2. Configure `send_page_view: false`.
3. In `src/App.jsx`, send `page_view` on route changes.
4. Deploy and verify in GA4 Realtime.

## Development

- Use GA4 DebugView or Tag Assistant for validation.

## Troubleshooting

- Ensure only one GA tag is present.
- If duplicate pageviews, confirm `send_page_view: false` and SPA hook is active.

### Testing

Test the analytics system:

1. **Health Check**: `curl https://your-backend.com/api/health`
2. **Track Page View**: `curl -X POST https://your-backend.com/api/analytics/track`
3. **Get Metrics**: `curl https://your-backend.com/api/analytics/metrics/realtime`

## Security Considerations

- Use HTTPS for all production endpoints
- Implement rate limiting on the backend
- Validate all incoming data
- Use environment variables for sensitive data
- Consider implementing authentication for admin endpoints

## Performance

- The analytics system is designed to be lightweight
- Data is sent asynchronously to avoid blocking the UI
- Failed requests are retried with exponential backoff
- Analytics data is stored efficiently in PostgreSQL 