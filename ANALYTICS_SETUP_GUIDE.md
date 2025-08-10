# Analytics Backend Setup Guide

**Last Updated:** August 10, 2025

## Current Status

The personal website now uses an external analytics backend and dashboard at `https://siteanalyticsak.netlify.app`. The site only POSTs analytics data; there is no in-site dashboard.

## Notes

The previous in-site dashboard at `/analytics` has been removed.

## Solution Options

### Option 1: Use External Analytics (Current)

No action needed beyond endpoint configuration. The website sends analytics events to `https://siteanalyticsak.netlify.app/api`.

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

### Option 3: Use Third-Party Analytics (Alternative)

**Google Analytics:**
1. Create Google Analytics account
2. Add tracking code to your site
3. Remove custom analytics system

**Plausible Analytics:**
1. Sign up at [plausible.io](https://plausible.io)
2. Add tracking script
3. Privacy-friendly alternative

## Quick Fix Instructions

### Endpoint Configuration

Set production endpoint in `src/config/analytics.js`:

```javascript
production: {
  apiUrl: 'https://siteanalyticsak.netlify.app/api',
  debug: false,
  autoTrack: true,
  enabled: true,
  generateIds: true
}
```

### After Functions are Working:

2. **Update Tracker:**
   ```javascript
   // In public/analytics-tracker.js
   apiUrl: window.location.hostname === 'localhost' \
     ? 'http://localhost:3001/api' \
     : 'https://siteanalyticsak.netlify.app/api',
   autoTrack: true
   ```

## Current Analytics Features

Your analytics system includes:

- ✅ **Real-time visitor tracking**
- ✅ **Page view analytics**
- ✅ **Time on page metrics**
- ✅ **Top performing pages**
- ✅ **Daily visitor trends**
- ✅ **Session tracking**
- ✅ **Geolocation data**
- ✅ **Device/technology tracking**
- ✅ **Data export functionality**

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Backend | `localhost:3001` | `siteanalyticsak.netlify.app/api` |
| Tracking | ✅ Enabled | ✅ Enabled (POST-only) |
| Dashboard | ✅ N/A | ✅ External (link only) |
| Auto-track | ✅ Enabled | ✅ Enabled |

## Next Steps

1. **Choose your preferred option** (Netlify Functions recommended)
2. **Follow the setup instructions**
3. **Test the analytics system**
4. **Monitor your website traffic**

## Support

If you need help setting up any of these options, the analytics system is designed to be flexible and can work with any backend that provides the required API endpoints.

## Files Modified

- `src/config/analytics.js` - Main configuration
- `src/components/AnalyticsDashboard.jsx` - Dashboard component
- `public/analytics-tracker.js` - Client-side tracker
- `netlify/functions/analytics.js` - Serverless function (ready to use)
- `netlify.toml` - Netlify configuration 