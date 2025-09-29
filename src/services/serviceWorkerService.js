/**
 * Service Worker Service
 * Handles service worker registration, updates, and communication
 */

class ServiceWorkerService {
  constructor() {
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator;
    this.updateAvailable = false;
  }

  /**
   * Check if service workers are supported
   */
  isServiceWorkerSupported() {
    return this.isSupported;
  }

  /**
   * Register service worker
   */
  async register() {
    if (!this.isSupported) {
      throw new Error('Service workers are not supported in this browser');
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', this.registration);

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.updateAvailable = true;
            this.notifyUpdateAvailable();
          }
        });
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Unregister service worker
   */
  async unregister() {
    if (!this.registration) {
      return false;
    }

    try {
      const result = await this.registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    } catch (error) {
      console.error('Failed to unregister Service Worker:', error);
      throw error;
    }
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates() {
    if (!this.registration) {
      return false;
    }

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting() {
    if (!this.registration || !this.registration.waiting) {
      return false;
    }

    try {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      return true;
    } catch (error) {
      console.error('Failed to skip waiting:', error);
      return false;
    }
  }

  /**
   * Get service worker version
   */
  async getVersion() {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve(null);
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Notify user about available update
   */
  notifyUpdateAvailable() {
    // Dispatch custom event for UI to handle
    const event = new CustomEvent('sw-update-available', {
      detail: { registration: this.registration }
    });
    window.dispatchEvent(event);
  }

  /**
   * Get cache information
   */
  async getCacheInfo() {
    if (!this.isSupported) {
      return null;
    }

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheInfo[cacheName] = {
          size: keys.length,
          keys: keys.map(request => request.url)
        };
      }

      return cacheInfo;
    } catch (error) {
      console.error('Failed to get cache info:', error);
      return null;
    }
  }

  /**
   * Clear all caches
   */
  async clearAllCaches() {
    if (!this.isSupported) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear caches:', error);
      return false;
    }
  }

  /**
   * Initialize service worker service
   */
  async initialize() {
    if (!this.isSupported) {
      console.warn('Service workers not supported');
      return false;
    }

    try {
      await this.register();
      return true;
    } catch (error) {
      console.error('Failed to initialize service worker:', error);
      return false;
    }
  }

  /**
   * Handle offline/online status
   */
  handleConnectionStatus() {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      document.body.classList.toggle('offline', !isOnline);
      
      // Dispatch custom event
      const event = new CustomEvent('connection-status-change', {
        detail: { isOnline }
      });
      window.dispatchEvent(event);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Initial check
  }
}

// Create singleton instance
const serviceWorkerService = new ServiceWorkerService();

export default serviceWorkerService;
