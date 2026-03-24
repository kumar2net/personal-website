let analyticsModulePromise;

function loadAnalyticsModule() {
  if (!analyticsModulePromise) {
    analyticsModulePromise = import("./analytics");
  }
  return analyticsModulePromise;
}

export async function warmAnalytics() {
  try {
    const analytics = await loadAnalyticsModule();
    return analytics.ensureAnalyticsReady();
  } catch {
    return false;
  }
}

export async function trackPageView(payload) {
  try {
    const analytics = await loadAnalyticsModule();
    return analytics.trackPageView(payload);
  } catch {
    return false;
  }
}

export async function trackCtaClick(payload) {
  try {
    const analytics = await loadAnalyticsModule();
    return analytics.trackCtaClick(payload);
  } catch {
    return false;
  }
}
