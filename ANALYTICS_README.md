# Website Analytics Integration

This document explains how to use the analytics system integrated into your personal website.

**Last Updated:** August 6, 2025 (14:52 UTC)

## Overview

The analytics system tracks:
- Page views and navigation
- User interactions (clicks, form submissions)
- Time spent on pages
- Visitor sessions
- Real-time metrics

## Setup

### 1. Backend Requirements

**Development:**
Make sure your analytics backend is running:
```bash
cd /Users/kumar/siteanalytics/backend
npm run dev
```

The backend should be running on `http://localhost:3001`

**Production:**
The analytics backend is deployed at: `https://siteanalyticsak.netlify.app`

### 2. Configuration

Update the analytics configuration in `src/config/analytics.js`:

```javascript
// Production configuration (current)
production: {
  apiEndpoint: 'https://siteanalyticsak.netlify.app',
  debug: false,
  autoTrack: true,
  enabled: true
}
```

## Features

### Automatic Tracking

The system automatically tracks:
- Page views when navigating between routes
- Time spent on each page
- Session management
- Mobile vs desktop navigation

### Manual Event Tracking

You can track custom events using the `useAnalytics` hook:

```javascript
import { useAnalytics } from './hooks/useAnalytics';

function MyComponent() {
  const { trackClick, trackEvent, trackExternalLink } = useAnalytics();

  const handleButtonClick = () => {
    trackClick('cta_button', { location: 'hero_section' });
  };

  const handleFormSubmit = () => {
    trackEvent('contact_form_submit', { form_type: 'contact' });
  };

  const handleExternalLink = () => {
    trackExternalLink('https://github.com/username', 'GitHub Profile');
  };

  return (
    <button onClick={handleButtonClick}>
      Click Me
    </button>
  );
}
```

### Available Tracking Methods

- `trackClick(buttonName, additionalData)` - Track button clicks
- `trackEvent(eventName, eventData)` - Track custom events
- `trackFormSubmit(formName, additionalData)` - Track form submissions
- `trackExternalLink(url, linkText)` - Track external link clicks
- `trackSocialInteraction(platform, action)` - Track social media interactions

## Analytics Dashboard

Access your analytics dashboard at `/analytics` route (hidden from navigation). The dashboard shows:

- Real-time visitor count
- 24-hour page views
- Average time on page
- Top performing pages
- Daily visitor trends

## Data Privacy

The analytics system:
- Uses anonymous visitor IDs (stored in localStorage)
- Doesn't collect personal information
- Respects user privacy
- Can be easily disabled by users

## Development

### Debug Mode

In development, analytics debug mode is enabled. You'll see console logs like:
```
[SiteAnalytics] Initializing SiteAnalytics {apiEndpoint: "http://localhost:3001", debug: true, autoTrack: false}
[SiteAnalytics] Session initialized {visitorId: "...", sessionId: "..."}
[SiteAnalytics] Tracking page view {page_url: "...", visitor_id: "...", ...}
```

### Testing

To test the analytics:
1. Start your personal website: `npm run dev`
2. Start the analytics backend: `cd backend && npm run dev`
3. Navigate through your website
4. Check the analytics dashboard at `/analytics`
5. Monitor console logs for tracking events

## Production Deployment

**Current Status (August 6, 2025 - 14:52 UTC):**
✅ Analytics backend deployed to Netlify Functions  
✅ Production configuration updated  
✅ Analytics dashboard accessible at `/analytics`  
✅ CORS properly configured for production domains  
✅ **NEW: Webhook integration system fully operational**
✅ **NEW: Real-time event streaming to external services**

**Deployment Details:**
- **Frontend:** https://kumarsite.netlify.app
- **Analytics Backend:** https://siteanalyticsak.netlify.app
- **Analytics Dashboard:** https://kumarsite.netlify.app/analytics

The analytics system is fully operational in production.

## Troubleshooting

### Analytics not working?
- Check if the backend is running on the correct port
- Verify the `apiEndpoint` in the config
- Check browser console for errors
- Ensure the analytics script is loaded in `index.html`

### Dashboard not loading data?
- Verify the backend API endpoints are working
- Check network requests in browser dev tools
- Ensure CORS is properly configured on the backend

### Events not tracking?
- Make sure you're using the `useAnalytics` hook
- Check if the hook is properly initialized
- Verify the tracking methods are called correctly 