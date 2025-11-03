/**
 * Utility functions for blog post management and ID extraction
 */

/**
 * Extract post ID from a blog post URL path
 * @param {string} pathname - The URL pathname (e.g., '/blog/my-post-title')
 * @returns {string} - The post ID/slug
 */
export const extractPostIdFromPath = (pathname) => {
  if (!pathname) {
    return null;
  }

  // Remove leading/trailing slashes and split by '/'
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/');

  // For blog posts, expect format: blog/post-slug or just post-slug
  if (parts.length >= 2 && parts[0] === 'blog') {
    return parts[1];
  } else if (parts.length === 1 && parts[0] !== 'blog') {
    // Direct post access
    return parts[0];
  }

  return null;
};

/**
 * Get current post ID from window location
 * @returns {string|null} - Current post ID or null
 */
export const getCurrentPostId = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return extractPostIdFromPath(window.location.pathname);
};

/**
 * Check if current page is a blog post
 * @param {string} pathname - Optional pathname, defaults to current location
 * @returns {boolean} - True if on a blog post page
 */
export const isBlogPostPage = (pathname) => {
  const path =
    pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const postId = extractPostIdFromPath(path);
  return postId !== null && !['blog', ''].includes(postId);
};

/**
 * Known blog post IDs from your existing blog structure
 * This helps map between different post identification methods
 */
export const KNOWN_POST_MAPPINGS = {
  // URL slug -> semantic mapping ID
  'the-great-pivot': 'the-great-pivot',
  'top-9-famous-rules': 'top-9-famous-rules',
  'india-usa-trade-gap-2025': 'india-usa-trade-gap-2025',
  'nammu-soil-analysis-research': 'nammu-soil-analysis-research',
  'my-random-thoughts-this-week': 'my-random-thoughts-this-week',
  'nepal-annapurna-circuit': 'nepal-annapurna-circuit',
  'memory-evolution': 'memory-evolution',
  'microsoft-mai-dx-india': 'microsoft-mai-dx-india',
  'my-experience-with-windsurf': 'my-experience-with-windsurf',
  'my-fascination-with-shortcuts': 'my-fascination-with-shortcuts',
  'portfolio-website': 'portfolio-website',
  'spine-implant-dashboard': 'spine-implant-dashboard',
  'started-to-kindle-again': 'started-to-kindle-again',
  'compelling-india-story': 'compelling-india-story',
  'acronym-soup-revisited-2025': 'acronym-soup-revisited-2025',
  'acronym-soup': 'acronym-soup',
  'andrej-karpathy-yc-ai-startup-school':
    'andrej-karpathy-yc-ai-startup-school',
  'applying-robinson-method': 'applying-robinson-method',
  autophagy: 'autophagy',
  'building-mcp-server-with-cursor': 'building-mcp-server-with-cursor',
  'drug-suggestion-app': 'drug-suggestion-app',
  'experience-using-api-in-ai-code-editor':
    'experience-using-api-in-ai-code-editor',
  'feynman-technique': 'feynman-technique',
  'price-parity': 'price-parity',
};

/**
 * Normalize post ID for use with the recommendation system
 * @param {string} rawPostId - Raw post ID from URL
 * @returns {string} - Normalized post ID for the recommendation system
 */
export const normalizePostId = (rawPostId) => {
  if (!rawPostId) {
    return null;
  }

  const trimmed = rawPostId.trim();
  if (!trimmed) {
    return null;
  }

  const lowerCaseSlug = trimmed.toLowerCase();

  // Check if we have a known mapping (support both exact + lower-case lookups)
  if (KNOWN_POST_MAPPINGS[trimmed]) {
    return KNOWN_POST_MAPPINGS[trimmed];
  }
  if (KNOWN_POST_MAPPINGS[lowerCaseSlug]) {
    return KNOWN_POST_MAPPINGS[lowerCaseSlug];
  }

  // Default: use the lower-case slug so casing differences normalize consistently
  return lowerCaseSlug;
};

/**
 * Get current post ID for recommendations (non-hook version)
 * Use this in components to get the current post ID
 * @returns {string|null} - Normalized post ID for recommendations
 */
export const getCurrentNormalizedPostId = () => {
  const rawId = getCurrentPostId();
  return normalizePostId(rawId);
};
