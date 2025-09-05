export function trackEvent(eventName, parameters = {}, options = {}) {
  const { category = 'engagement', label = eventName } = options;
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      event_category: category,
      event_label: label,
      ...parameters,
    });
  }
}

export function trackOutboundLink(url, context = {}) {
  trackEvent('outbound_click', { url, ...context }, {
    category: 'outbound',
    label: 'outbound_click',
  });
}

