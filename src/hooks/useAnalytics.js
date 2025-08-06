import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsConfig, { generateVisitorId, generateSessionId } from '../config/analytics';
import webhookService from '../services/webhookService';

// Initialize analytics when the hook is first used
let analyticsInitialized = false;

const initializeAnalytics = () => {
  if (analyticsInitialized || typeof window === 'undefined') return;
  
  // Only initialize if analytics is enabled and apiUrl is available
  if (window.SiteAnalytics && analyticsConfig.enabled && analyticsConfig.apiUrl) {
    window.SiteAnalytics.init({
      apiUrl: analyticsConfig.apiUrl,
      debug: analyticsConfig.debug,
      autoTrack: false // We'll handle tracking manually for React Router
    });
    analyticsInitialized = true;
  }
};

export const useAnalytics = () => {
  const location = useLocation();

  // Initialize analytics on first use
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Track page views when location changes
  useEffect(() => {
    if (window.SiteAnalytics && analyticsInitialized) {
      // Add a small delay to ensure the page has rendered
      const timer = setTimeout(() => {
        const pageData = {
          page_title: document.title,
          route: location.pathname,
          page_url: window.location.href,
          referrer: document.referrer || '',
          user_agent: navigator.userAgent,
          screen_width: screen.width,
          screen_height: screen.height,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          visitor_id: generateVisitorId(),
          session_id: generateSessionId(),
          timestamp: new Date().toISOString()
        };

        // Track with traditional analytics
        window.SiteAnalytics.track(pageData);

        // Also send to webhook system
        webhookService.sendPageView(pageData).catch(error => {
          if (analyticsConfig.debug) {
            console.warn('[Webhook] Failed to send page view:', error);
          }
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Track custom events
  const trackEvent = useCallback((eventName, eventData = {}) => {
    if (window.SiteAnalytics && analyticsInitialized) {
      const eventPayload = {
        ...eventData,
        route: location.pathname,
        page_title: document.title,
        visitor_id: generateVisitorId(),
        session_id: generateSessionId(),
        timestamp: new Date().toISOString()
      };

      // Track with traditional analytics
      window.SiteAnalytics.trackEvent(eventName, eventPayload);

      // Also send to webhook system
      webhookService.sendCustomEvent(eventName, eventPayload).catch(error => {
        if (analyticsConfig.debug) {
          console.warn('[Webhook] Failed to send custom event:', error);
        }
      });
    }
  }, [location]);

  // Track button clicks
  const trackClick = useCallback((buttonName, additionalData = {}) => {
    trackEvent('click', {
      element_type: 'button',
      element_name: buttonName,
      ...additionalData
    });
  }, [trackEvent]);

  // Track form submissions
  const trackFormSubmit = useCallback((formName, additionalData = {}) => {
    trackEvent('form_submit', {
      form_name: formName,
      ...additionalData
    });
  }, [trackEvent]);

  // Track external link clicks
  const trackExternalLink = useCallback((url, linkText, additionalData = {}) => {
    trackEvent('external_link_click', {
      link_url: url,
      link_text: linkText,
      ...additionalData
    });
  }, [trackEvent]);

  // Track social media interactions
  const trackSocialInteraction = useCallback((platform, action, additionalData = {}) => {
    trackEvent('social_interaction', {
      platform,
      action,
      ...additionalData
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackExternalLink,
    trackSocialInteraction
  };
}; 