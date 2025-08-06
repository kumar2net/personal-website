import analyticsConfig from '../config/analytics';

class WebhookService {
  constructor() {
    this.apiUrl = analyticsConfig.apiUrl;
    this.webhookUrl = `${this.apiUrl.replace('/api', '')}/api/webhooks`;
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

  // Send page view event
  async sendPageView(pageData) {
    return this.sendAnalyticsEvent('page_view', pageData);
  }

  // Send custom event
  async sendCustomEvent(eventName, eventData) {
    return this.sendAnalyticsEvent('event', {
      event_name: eventName,
      event_data: eventData
    });
  }

  // Send session start event
  async sendSessionStart(sessionData) {
    return this.sendAnalyticsEvent('session_start', sessionData);
  }

  // Register a webhook for notifications
  async registerWebhook(webhookData) {
    try {
      const response = await fetch(`${this.webhookUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (analyticsConfig.debug) {
        console.log('[Webhook] Registration successful:', result);
      }

      return result;
    } catch (error) {
      console.error('[Webhook] Registration failed:', error);
      throw error;
    }
  }

  // List registered webhooks
  async listWebhooks() {
    try {
      const response = await fetch(`${this.webhookUrl}/list`, {
        method: 'GET',
        headers: {
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data.webhooks;
    } catch (error) {
      console.error('[Webhook] Failed to list webhooks:', error);
      throw error;
    }
  }

  // Unregister a webhook
  async unregisterWebhook(webhookId) {
    try {
      const response = await fetch(`${this.webhookUrl}/unregister/${webhookId}`, {
        method: 'DELETE',
        headers: {
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (analyticsConfig.debug) {
        console.log('[Webhook] Unregistration successful:', result);
      }

      return result;
    } catch (error) {
      console.error('[Webhook] Unregistration failed:', error);
      throw error;
    }
  }

  // Check webhook health
  async checkHealth() {
    try {
      const response = await fetch(`${this.webhookUrl}/health`, {
        method: 'GET',
        headers: {
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('[Webhook] Health check failed:', error);
      throw error;
    }
  }
}

export default new WebhookService(); 