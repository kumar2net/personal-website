# Website Analytics Integration

This document explains how the website sends analytics events to an external analytics backend and how to view metrics on the external dashboard.

**Last Updated:** August 10, 2025

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
The analytics backend and dashboard are hosted externally at `https://siteanalyticsak.netlify.app`.

### 2. Configuration

Update the analytics configuration in `src/config/analytics.js`:

```javascript
// Production configuration (current)
production: {
  apiUrl: 'https://siteanalyticsak.netlify.app/api',
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

There is no in-site dashboard. Access the external dashboard at `https://siteanalyticsak.netlify.app/`.

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
[SiteAnalytics] Initializing SiteAnalytics {apiUrl: "http://localhost:3001/api", debug: true, autoTrack: false}
[SiteAnalytics] Session initialized {visitorId: "...", sessionId: "..."}
[SiteAnalytics] Tracking page view {page_url: "...", visitor_id: "...", ...}
```

### Testing

To test the analytics:
1. Start your personal website: `npm run dev`
2. Start the analytics backend: `cd backend && npm run dev`
3. Navigate through your website
4. Monitor console logs for tracking events
5. View metrics on the external dashboard at `https://siteanalyticsak.netlify.app/` (in production)

## Production Deployment

**Current Status:**
✅ External analytics backend and dashboard live  
✅ Production configuration updated to external API  
✅ POST-only tracking from personal site  
✅ CORS properly configured for production domains  
✅ Webhook integration system fully operational

**Deployment Details:**
- **Frontend:** https://kumarsite.netlify.app
- **Analytics Backend & Dashboard:** https://siteanalyticsak.netlify.app

The analytics system is fully operational in production with an external dashboard.

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