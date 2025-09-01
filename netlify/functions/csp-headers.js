exports.handler = async (event, context) => {
  // Get the response from the origin
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  // Comprehensive Content Security Policy
  const csp = [
    // Default source restrictions
    "default-src 'self'",
    
    // Script sources - allow necessary external scripts
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:",
    "script-src-elem 'self' 'unsafe-inline'",
    "script-src-attr 'unsafe-inline'",
    
    // Style sources
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // Font sources
    "font-src 'self' https://fonts.gstatic.com data:",
    
    // Image sources
    "img-src 'self' data: blob: https: http:",
    
    // Connect sources for API calls
    "connect-src 'self' https:// https://*. https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com",
    
    // Frame sources for Disqus and other embeds
    "frame-src 'self' https:// https://*. https://accounts.google.com https://www.google.com",
    "frame-ancestors 'self'",
    
    // Object sources
    "object-src 'none'",
    
    // Media sources
    "media-src 'self' https:",
    
    // Manifest sources
    "manifest-src 'self'",
    
    // Worker sources
    "worker-src 'self' blob:",
    
    // Form action
    "form-action 'self'",
    
    // Base URI
    "base-uri 'self'",
    
    // Upgrade insecure requests
    "upgrade-insecure-requests"
  ].join('; ');

  // Add CSP header
  headers['content-security-policy'] = [{
    key: 'Content-Security-Policy',
    value: csp
  }];

  // Add other security headers
  headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }];

  headers['x-frame-options'] = [{
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }];

  headers['x-xss-protection'] = [{
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }];

  headers['referrer-policy'] = [{
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }];

  headers['permissions-policy'] = [{
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }];

  return response;
};
