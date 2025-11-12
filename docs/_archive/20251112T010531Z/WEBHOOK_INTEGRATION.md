# Webhook Integration Documentation

**Last Updated:** August 10, 2025

Note: Primary website analytics now use Google Analytics 4 (GA4). The webhook system described here is optional and can be used for custom integrations independent of GA4.

## Overview

The webhook integration system allows your personal website to send real-time analytics events to external services via webhooks. This enables you to:

- Send analytics data to third-party services
- Trigger notifications based on analytics events
- Integrate with monitoring and alerting systems
- Build custom analytics workflows

## Architecture

```
Personal Website → External Analytics Backend → Webhook System → External Services
     ↓                    ↓                ↓              ↓
  Page Views         Process Data    Route Events    Slack/Email/etc.
  User Events        Store Metrics   Retry Logic    Custom APIs
  Interactions       Generate IDs    Signatures     Monitoring Tools
```

## Setup

### 1. Backend Requirements

Ensure your analytics backend is running:
```bash
cd /Users/kumar/siteanalytics/backend
npm run dev
```

If you choose to run your own backend, it should be running on `http://localhost:3001` in development and your chosen production URL.

### 2. Webhook Endpoints

The webhook system provides the following endpoints:

- **POST** `/api/webhooks/analytics` - Receive analytics events
- **POST** `/api/webhooks/notifications` - Receive system notifications
- **GET** `/api/webhooks/health` - Check webhook system health
- **POST** `/api/webhooks/register` - Register a new webhook
- **GET** `/api/webhooks/list` - List all registered webhooks
- **DELETE** `/api/webhooks/unregister/:id` - Unregister a webhook

## Event Types

### Analytics Events

| Event Type | Description | Data Structure |
|------------|-------------|----------------|
| `page_view` | User visits a page | Page URL, title, referrer, user agent, etc. |
| `event` | Custom user interaction | Event name, data, page context |
| `session_start` | New user session | Session ID, visitor ID, timestamp |
| `high_traffic` | Unusual traffic spike | Traffic metrics, threshold exceeded |
| `error_rate` | High error rate detected | Error count, rate percentage |
| `new_visitor` | First-time visitor | Visitor ID, source, timestamp |

### Example Event Payload

```json
{
  "event_type": "page_view",
  "data": {
    "page_url": "https://kumar2net.com/about",
    "page_title": "About Me",
    "visitor_id": "visitor_1234567890_abc123",
    "session_id": "session_1234567890_def456",
    "user_agent": "Mozilla/5.0...",
    "screen_width": 1920,
    "screen_height": 1080,
    "language": "en-US",
    "timezone": "America/New_York",
    "timestamp": "2025-08-06T14:30:00.000Z"
  },
  "source": "personal-website",
  "timestamp": "2025-08-06T14:30:00.000Z"
}
```

## Webhook Registration

### Register a Webhook

```bash
curl -X POST http://localhost:3001/api/webhooks/register \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-webhook-endpoint.com/webhook",
    "events": ["page_view", "event", "session_start"],
    "secret": "your-webhook-secret",
    "description": "My webhook for analytics events"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "webhook-uuid-123",
    "url": "https://your-webhook-endpoint.com/webhook",
    "events": ["page_view", "event", "session_start"],
    "status": "active"
  }
}
```

## Security

### Webhook Signatures

When a secret is provided during registration, the webhook system will include a signature header:

```
X-Webhook-Signature: sha256=abc123def456...
```

To verify the signature:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}
```

## Testing

### 1. Start the Test Webhook Receiver

```bash
cd /Users/kumar/kumarai/personal-website
node scripts/webhook-receiver.js
```

This starts a test server on `http://localhost:3002`

### 2. Register the Test Webhook

```bash
curl -X POST http://localhost:3001/api/webhooks/register \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:3002/webhook",
    "events": ["page_view", "event", "session_start"],
    "description": "Test webhook receiver"
  }'
```

### 3. Test the Integration

1. Visit your personal website
2. Navigate between pages
3. Check the webhook receiver console for incoming events

## Integration Examples

### Slack Integration

```javascript
// Register webhook for Slack
const slackWebhook = {
  url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
  events: ["high_traffic", "new_visitor"],
  description: "Slack notifications for important events"
};

await webhookService.registerWebhook(slackWebhook);
```

### Email Notifications

```javascript
// Register webhook for email service
const emailWebhook = {
  url: "https://your-email-service.com/webhook",
  events: ["error_rate", "high_traffic"],
  secret: "email-service-secret",
  description: "Email alerts for critical events"
};

await webhookService.registerWebhook(emailWebhook);
```

### Custom Analytics Dashboard

```javascript
// Register webhook for custom dashboard
const dashboardWebhook = {
  url: "https://your-dashboard.com/api/analytics",
  events: ["page_view", "event"],
  description: "Real-time dashboard updates"
};

await webhookService.registerWebhook(dashboardWebhook);
```

## Monitoring

### Health Check

```bash
curl http://localhost:3001/api/webhooks/health
```

Response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-08-06T14:30:00.000Z",
  "details": {
    "total_webhooks": 3,
    "active_webhooks": 2,
    "failed_webhooks": 1,
    "notification_queue_size": 0
  }
}
```

### List Webhooks

```bash
curl http://localhost:3001/api/webhooks/list
```

### Webhook Statistics

The system tracks:
- Total webhooks registered
- Active vs failed webhooks
- Last triggered timestamp
- Failure count
- Event type subscriptions

## Error Handling

### Retry Logic

The webhook system includes automatic retry logic:
- **Max Retries**: 3 attempts
- **Backoff Strategy**: Exponential backoff (1s, 2s, 4s)
- **Failure Threshold**: 5 consecutive failures marks webhook as failed

### Failed Webhooks

Webhooks that fail repeatedly are marked as "failed" and will not receive new events until manually reactivated.

## Best Practices

### 1. Webhook Endpoint Design

- Return HTTP 200 quickly (process asynchronously if needed)
- Implement idempotency to handle duplicate events
- Use webhook signatures for security
- Log all incoming webhooks for debugging

### 2. Error Handling

- Always return a proper HTTP response
- Implement retry logic for transient failures
- Monitor webhook delivery rates
- Set up alerts for webhook failures

### 3. Performance

- Process webhooks asynchronously when possible
- Use connection pooling for HTTP requests
- Implement rate limiting if needed
- Monitor webhook queue size

### 4. Security

- Use HTTPS for all webhook URLs
- Implement signature verification
- Validate webhook payloads
- Use secrets for sensitive webhooks

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook registration status
2. Verify webhook URL is accessible
3. Check webhook endpoint returns 200
4. Review webhook logs for errors

### High Failure Rate

1. Check webhook endpoint availability
2. Verify signature verification logic
3. Review payload size limits
4. Check network connectivity

### Missing Events

1. Verify event types are subscribed
2. Check webhook status (active/failed)
3. Review analytics system logs
4. Test webhook endpoint manually

## API Reference

### Webhook Registration

**POST** `/api/webhooks/register`

Request Body:
```json
{
  "url": "string (required)",
  "events": ["string"] (required),
  "secret": "string (optional)",
  "description": "string (optional)"
}
```

### Webhook Management

**GET** `/api/webhooks/list` - List all webhooks
**DELETE** `/api/webhooks/unregister/:id` - Remove webhook
**GET** `/api/webhooks/health` - System health status

### Analytics Events

**POST** `/api/webhooks/analytics`

Request Body:
```json
{
  "event_type": "string (required)",
  "data": "object (required)",
  "source": "string (optional)"
}
```

## Deployment Notes

- Netlify deploys from GitHub. Ensure Site settings → Build & deploy → Branch to deploy matches your active branch (recommend: `main`).
- Live site: https://kumar2net.com
- GA4 is the primary analytics platform for the site.

## Support

For issues or questions:
1. Check the webhook health endpoint
2. Review webhook receiver logs
3. Test webhook endpoints manually
4. Check analytics system logs

The webhook integration is designed to be robust and reliable, with comprehensive error handling and monitoring capabilities. 
Last updated: 2025-08-11
