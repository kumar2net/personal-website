// Enhanced Service Worker with Push Notifications - Optimized for Performance
const CACHE_NAME = 'kumar-portfolio-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const VAPID_PUBLIC_KEY = 'BELKiWd8WXb2XDBaUZspzdYNeXxSZqL6gRqfgZCl9V1f6NsiBSgCyHU_1ML0GTxwtiE98bUY4HyIriItcGDo3Jg';

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  // Skip caching in development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('Development mode - skipping cache');
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll([
        '/',
        '/blog',
        '/projects',
        '/contact',
        '/notifications',
        '/manifest.json',
        '/icons/icon-192x192.svg',
        '/icons/icon-512x512.svg',
        '/offline.html'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches and enable navigation preload
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Enable navigation preload for faster page loads
      self.registration.navigationPreload?.enable().catch(() => {
        console.log('Navigation preload not supported');
      })
    ])
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests - network first
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/functions/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request).then(response => {
            if (response) {
              return response;
            }
            // Return offline response for API calls
            return new Response(
              JSON.stringify({ error: 'Offline', message: 'Please check your internet connection' }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }

  // Handle static assets - cache first
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(fetchResponse => {
          if (fetchResponse.ok) {
            const responseClone = fetchResponse.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        });
      })
    );
    return;
  }

  // Handle HTML pages - use navigation preload for optimal performance
  if (request.destination === 'document') {
    event.respondWith(
      (async () => {
        try {
          // Use preloaded response if available (navigation preload)
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            // Cache the preloaded response asynchronously (don't wait)
            if (preloadResponse.ok) {
              const responseClone = preloadResponse.clone();
              caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              }).catch(() => {}); // Silently fail cache writes
            }
            return preloadResponse;
          }
          
          // Fallback to fetch if preload not available
          const response = await fetch(request);
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            }).catch(() => {});
          }
          return response;
        } catch (error) {
          // Network failed, try cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page as last resort
          return caches.match('/offline.html');
        }
      })()
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Push notification event handling
self.addEventListener('push', event => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'Kumar\'s Stories',
    body: 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Post',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        title: pushData.title || notificationData.title,
        body: pushData.body || notificationData.body,
        icon: pushData.icon || notificationData.icon,
        data: {
          ...notificationData.data,
          url: pushData.url,
          ...pushData.data
        }
      };
    } catch (error) {
      console.error('Error parsing push data:', error);
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  const urlToOpen = notificationData.url || '/';
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  } else if (event.action === 'close') {
    // Just close the notification
    console.log('Notification closed by user');
  } else {
    // Default action - open the app or specific URL
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            if (urlToOpen !== '/') {
              client.navigate(urlToOpen);
            }
            return;
          }
        }
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', event => {
  console.log('Notification closed:', event);
  // Track notification dismissal for analytics
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  } else if (event.tag === 'comment-sync') {
    event.waitUntil(syncComments());
  }
});

// Sync contact form submissions
async function syncContactForm() {
  try {
    const formData = await getStoredFormData();
    if (formData) {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      
      if (response.ok) {
        await clearStoredFormData();
        console.log('Contact form synced successfully');
      }
    }
  } catch (error) {
    console.error('Failed to sync contact form:', error);
  }
}

// Sync comment submissions
async function syncComments() {
  try {
    const commentData = await getStoredCommentData();
    if (commentData) {
      const response = await fetch('/.netlify/functions/comment-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      
      if (response.ok) {
        await clearStoredCommentData();
        console.log('Comments synced successfully');
      }
    }
  } catch (error) {
    console.error('Failed to sync comments:', error);
  }
}

// Helper functions for background sync
async function getStoredFormData() {
  // Implementation for retrieving stored form data
  return null;
}

async function clearStoredFormData() {
  // Implementation for clearing stored form data
}

async function getStoredCommentData() {
  // Implementation for retrieving stored comment data
  return null;
}

async function clearStoredCommentData() {
  // Implementation for clearing stored comment data
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker loaded successfully');
