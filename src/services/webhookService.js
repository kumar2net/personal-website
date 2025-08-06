import analyticsConfig from '../config/analytics';

class WebhookService {
  constructor() {
    this.webhookUrl = analyticsConfig.apiUrl.replace('/api', '/api/webhooks');
  }

  // Send analytics event to webhook
  async sendAnalyticsEvent(eventType, data) {
    try {
      const payload = {
        event_type: eventType,
        data: {
          ...data,
          source: 'personal-website',
          timestamp: new Date().toISOString()
        },
        source: 'personal-website'
      };

      const response = await fetch(`${this.webhookUrl}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (analyticsConfig.debug) {
        console.log(`[Webhook] ${eventType} sent successfully:`, result);
      }

      return result;
    } catch (error) {
      console.error(`[Webhook] Failed to send ${eventType}:`, error);
      throw error;
    }
  }

  // Send page view to webhook
  async sendPageView(pageData) {
    return this.sendAnalyticsEvent('page_view', pageData);
  }

  // Send custom event to webhook
  async sendCustomEvent(eventName, eventData) {
    return this.sendAnalyticsEvent('event', {
      event_name: eventName,
      event_data: eventData
    });
  }

  // Send session start to webhook
  async sendSessionStart(sessionData) {
    return this.sendAnalyticsEvent('session_start', sessionData);
  }
}

export default new WebhookService(); 