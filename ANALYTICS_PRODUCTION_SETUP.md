# Analytics Production Setup Guide

**Last Updated:** August 10, 2025

## Current Status

Production analytics now use the external backend at `https://siteanalyticsak.netlify.app/api`. The personal site only POSTs analytics data; the dashboard is external.

## Production Backend Setup

To enable analytics in production, follow these steps:

### 1. Deploy Analytics Backend

The analytics backend needs to be deployed to a production server. Options include:

- **Railway**: Easy deployment with PostgreSQL support
- **Render**: Free tier available with PostgreSQL
- **Heroku**: Paid service with PostgreSQL add-on
- **DigitalOcean**: VPS with manual PostgreSQL setup
- **AWS/GCP**: Cloud services with managed databases

### 2. Update Configuration

Set the production configuration in `src/config/analytics.js`:

```javascript
production: {
  apiUrl: 'https://siteanalyticsak.netlify.app/api',
  debug: false,
  autoTrack: true, // Enable auto-tracking
  enabled: true, // Enable analytics
  generateIds: true
}
```

### 3. Update Analytics Tracker

Update the analytics tracker in `public/analytics-tracker.js`:

```javascript
const config = {
  apiUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
  : 'https://siteanalyticsak.netlify.app/api',
  // ... other config
};
```

### 4. Environment Variables

Set up environment variables for the backend:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Server
PORT=3001
NODE_ENV=production

# CORS (if needed)
CORS_ORIGIN=https://kumarsite.netlify.app
```

### 5. Database Setup

Ensure the PostgreSQL database is set up with the required tables:

```sql
-- Run the database initialization script
-- Located in: /Users/kumar/siteanalytics/backend/src/database/init.sql
```

### 6. Deploy and Test

1. Deploy the backend to production
2. Test the health endpoint: `https://your-backend.com/api/health`
3. Update the frontend configuration
4. Deploy the frontend changes
5. Test analytics tracking in production

## Current Development Setup

In development, the analytics system works with:

- **Backend**: `http://localhost:3001/api`
- **Database**: Local PostgreSQL instance
- **Auto-tracking**: Enabled
- **Debug**: Enabled

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend allows requests from `https://kumarsite.netlify.app`
2. **Database Connection**: Verify DATABASE_URL is correct
3. **API Endpoints**: Test all endpoints return 200 status codes
4. **Environment Variables**: Ensure all required env vars are set

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