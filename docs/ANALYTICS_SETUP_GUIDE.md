# Google Analytics (GA4) Setup Guide

**Last Updated:** August 10, 2025

## Current Status

The personal website now uses Google Analytics 4 (GA4) exclusively.

## Notes

The previous in-site dashboard at `/analytics` has been removed.

## Solution Options

### Option 1: Google Analytics 4 (Current)

1. Create a GA4 property and a Web data stream.
2. Copy the Measurement ID and add the GA tag in `index.html`.
3. Keep `send_page_view: false`.
4. SPA page_view tracking is wired in `src/App.jsx`.

### Option 2: Deploy Separate Backend (Optional)

**Using Railway:**
1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Deploy the backend code from your existing analytics backend
4. Update the API URL in `src/config/analytics.js`

**Using Render:**
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Deploy the backend code
4. Update the API URL

### Option 3: Other privacy tools (optional)

Consider Plausible, Fathom, etc., if you want a privacy-focused alternative.

## Quick Fix Instructions

### GA Tag Configuration

In `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);} 
  gtag('js', new Date());
  gtag('config', 'G-XXXX', { send_page_view: false });
<\/script>
```

### SPA Route Tracking

In `src/App.jsx` send `page_view` on route changes with React Router.

## Analytics Features

- **Page view analytics**
- **Realtime (via GA4 Realtime)**

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Tracking | ✅ Enabled | ✅ Enabled |
| Dashboard | GA4 Realtime | GA4 Realtime |
| Auto-track | Manual (SPA) | Manual (SPA) |

## Next Steps

1. **Choose your preferred option** (Netlify Functions recommended)
2. **Follow the setup instructions**
3. **Test the analytics system**
4. **Monitor your website traffic**

## Support

If you need help setting up any of these options, the analytics system is designed to be flexible and can work with any backend that provides the required API endpoints.

## Files Modified

- `index.html` - GA tag
- `src/App.jsx` - SPA page_view tracking
- `netlify.toml` - Remove analytics redirects/functions
Last updated: 2025-08-11
