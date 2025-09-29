/**
 * Push Notification Service
 * Handles push notification subscription, permission requests, and management
 */

class PushNotificationService {
  constructor() {
    this.vapidPublicKey = 'BELKiWd8WXb2XDBaUZspzdYNeXxSZqL6gRqfgZCl9V1f6NsiBSgCyHU_1ML0GTxwtiE98bUY4HyIriItcGDo3Jg';
    this.subscription = null;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Check if push notifications are supported
   */
  isPushNotificationSupported() {
    return this.isSupported;
  }

  /**
   * Check current notification permission status
   */
  getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notification permission has been denied. Please enable it in your browser settings.');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe() {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported in this browser');
    }

    try {
      // Request permission first
      await this.requestPermission();

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push manager
      this.subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);
      
      console.log('Push subscription successful:', this.subscription);
      return this.subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe() {
    if (!this.subscription) {
      return false;
    }

    try {
      const result = await this.subscription.unsubscribe();
      if (result) {
        await this.removeSubscriptionFromServer(this.subscription);
        this.subscription = null;
        console.log('Successfully unsubscribed from push notifications');
      }
      return result;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw error;
    }
  }

  /**
   * Get current subscription
   */
  async getSubscription() {
    if (!this.isSupported) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      this.subscription = await registration.pushManager.getSubscription();
      return this.subscription;
    } catch (error) {
      console.error('Failed to get push subscription:', error);
      return null;
    }
  }

  /**
   * Check if user is currently subscribed
   */
  async isSubscribed() {
    const subscription = await this.getSubscription();
    return subscription !== null;
  }

  /**
   * Send subscription to server for storage
   */
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/.netlify/functions/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save subscription: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Subscription saved to server:', result);
      return result;
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
      throw error;
    }
  }

  /**
   * Remove subscription from server
   */
  async removeSubscriptionFromServer(subscription) {
    try {
      const response = await fetch('/.netlify/functions/push-subscription', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription })
      });

      if (!response.ok) {
        console.warn('Failed to remove subscription from server:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Send test notification (for development/testing)
   */
  async sendTestNotification() {
    try {
      const response = await fetch('/.netlify/functions/send-push-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test notification from Kumar\'s Portfolio',
          url: '/',
          icon: '/icons/icon-192x192.png'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send test notification: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Test notification sent:', result);
      return result;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }

  /**
   * Get subscription statistics
   */
  async getSubscriptionStats() {
    try {
      const response = await fetch('/.netlify/functions/push-subscription-stats');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get subscription stats:', error);
    }
    return null;
  }

  /**
   * Initialize push notification service
   */
  async initialize() {
    if (!this.isSupported) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      // Check if already subscribed
      const isSubscribed = await this.isSubscribed();
      if (isSubscribed) {
        console.log('Already subscribed to push notifications');
        return true;
      }

      // Check permission status
      const permission = this.getPermissionStatus();
      if (permission === 'denied') {
        console.warn('Notification permission denied');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize push notification service:', error);
      return false;
    }
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService;
