/**
 * Website Analytics Tracker
 * Version: 1.0.0
 * 
 * Usage:
 * 1. Include this script in your website
 * 2. Initialize with: SiteAnalytics.init('YOUR_API_ENDPOINT')
 * 3. Track page views automatically or manually
 */

// Website Analytics Tracker
(function() {
  'use strict';

  // Configuration
  const config = {
    apiUrl: 'https://siteanalyticsak.netlify.app/api',
    fallbackApiUrl: 'http://localhost:3001/api', // Fallback for development
    debug: window.location.hostname === 'localhost', // Enable debug in development
    autoTrack: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxRetries: 3
  };

  // Generate unique visitor ID
  function generateVisitorId() {
    let visitorId = localStorage.getItem('analytics_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('analytics_visitor_id', visitorId);
    }
    return visitorId;
  }

  // Generate session ID
  function generateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    const lastActivity = sessionStorage.getItem('analytics_last_activity');
    const now = Date.now();

    // Create new session if none exists or session expired
    if (!sessionId || !lastActivity || (now - parseInt(lastActivity)) > config.sessionTimeout) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    sessionStorage.setItem('analytics_last_activity', now.toString());
    return sessionId;
  }

  // Get page information
  function getPageInfo() {
    return {
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent,
      screen_width: screen.width,
      screen_height: screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // Send data to analytics API with retry logic
  async function sendAnalyticsData(endpoint, data, retryCount = 0) {
    const urls = [config.apiUrl, config.fallbackApiUrl];
    
    for (let i = 0; i < urls.length; i++) {
      try {
        const url = urls[i] + endpoint;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          if (config.debug) {
            console.log('Analytics data sent successfully to:', url);
          }
          return await response.json();
        } else {
          const errorText = await response.text();
          if (config.debug) {
            console.error('Analytics request failed:', {
              status: response.status,
              statusText: response.statusText,
              url: url,
              data: data,
              error: errorText
            });
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
      } catch (error) {
        if (config.debug) {
          console.warn(`Failed to send analytics to ${urls[i]}:`, error.message);
        }
        
        // If this is the last URL and we haven't exceeded retries, try again
        if (i === urls.length - 1 && retryCount < config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return sendAnalyticsData(endpoint, data, retryCount + 1);
        }
      }
    }
    
    if (config.debug) {
      console.error('All analytics endpoints failed');
    }
  }

  // Track page visit
  function trackPageVisit(customData = {}) {
    const pageInfo = getPageInfo();
    
    // Validate required fields
    if (!pageInfo.page_url || !pageInfo.page_url.trim()) {
      if (config.debug) {
        console.warn('Analytics: page_url is missing or empty, skipping tracking');
      }
      return;
    }
    
    const data = {
      ...pageInfo,
      visitor_id: generateVisitorId(),
      session_id: generateSessionId(),
      timestamp: new Date().toISOString(),
      ...customData
    };

    sendAnalyticsData('/analytics/track', data);
  }

  // Track custom event
  function trackEvent(eventName, eventData = {}) {
    const pageInfo = getPageInfo();
    
    // Validate required fields
    if (!pageInfo.page_url || !pageInfo.page_url.trim()) {
      if (config.debug) {
        console.warn('Analytics: page_url is missing or empty, skipping event tracking');
      }
      return;
    }
    
    const data = {
      ...pageInfo,
      visitor_id: generateVisitorId(),
      session_id: generateSessionId(),
      timestamp: new Date().toISOString(),
      event_name: eventName,
      event_data: eventData
    };

    sendAnalyticsData('/analytics/track', data);
  }

  // Track time on page
  function trackTimeOnPage() {
    const startTime = performance.now();
    let hasTrackedExit = false;
    
    // Capture page info when the event listener is created, not when it fires
    const pageInfo = getPageInfo();
    const visitorId = generateVisitorId();
    const sessionId = generateSessionId();
    
    window.addEventListener('beforeunload', () => {
      if (!hasTrackedExit) {
        hasTrackedExit = true;
        
        // Validate required fields before sending
        if (!pageInfo.page_url || !pageInfo.page_url.trim()) {
          if (config.debug) {
            console.warn('Analytics: page_url is missing or empty, skipping page exit tracking');
          }
          return;
        }
        
        const timeOnPage = Math.round((performance.now() - startTime) / 1000);
        // Use sendBeacon for beforeunload events to ensure they're sent
        const data = {
          ...pageInfo,
          visitor_id: visitorId,
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          event_name: 'page_exit',
          event_data: { time_on_page: timeOnPage }
        };
        
        // Use sendBeacon for reliable delivery during page unload
        if (navigator.sendBeacon) {
          navigator.sendBeacon(config.apiUrl + '/analytics/track', JSON.stringify(data));
        } else {
          // Fallback to synchronous XMLHttpRequest
          const xhr = new XMLHttpRequest();
          xhr.open('POST', config.apiUrl + '/analytics/track', false);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(data));
        }
      }
    });
  }

  // Initialize analytics
  function init(options = {}) {
    // Merge options with config
    Object.assign(config, options);

    if (config.debug) {
      console.log('Analytics initialized with config:', config);
    }

    // Auto-track page visits
    if (config.autoTrack) {
      trackPageVisit();
      trackTimeOnPage();
    }

    // Track user interactions
    if (config.autoTrack) {
      // Track clicks on important elements
      document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
          const element = target.tagName === 'A' || target.tagName === 'BUTTON' ? target : target.closest('a, button');
          const text = element.textContent?.trim() || '';
          const href = element.href || '';
          
          if (text || href) {
            trackEvent('click', {
              element_type: element.tagName.toLowerCase(),
              element_text: text.substring(0, 50),
              element_href: href,
              element_id: element.id || '',
              element_class: element.className || ''
            });
          }
        }
      });

      // Track form submissions
      document.addEventListener('submit', (e) => {
        const form = e.target;
        trackEvent('form_submit', {
          form_id: form.id || '',
          form_action: form.action || '',
          form_method: form.method || 'GET'
        });
      });
    }
  }

  // Expose functions globally
  window.SiteAnalytics = {
    init,
    track: trackPageVisit,
    trackEvent,
    config
  };

  // Auto-initialize if script is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init());
  } else {
    init();
  }

})(); 