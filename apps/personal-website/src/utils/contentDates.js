// Utility functions for managing content dates and badges

/**
 * Calculate days since a given date
 * @param {string} dateString - Date string in format "Month DD, YYYY"
 * @returns {number} Days since the date
 */
export const getDaysSince = (dateString) => {
  const now = new Date();
  const targetDate = new Date(dateString);
  return Math.floor((now - targetDate) / (1000 * 60 * 60 * 24));
};

/**
 * Check if content should show NEW badge
 * @param {string} publishDate - Publication date
 * @returns {boolean} Whether to show NEW badge
 */
export const shouldShowNewBadge = (publishDate) => {
  return getDaysSince(publishDate) <= 7;
};

/**
 * Check if content should show UPDATED badge
 * @param {string} publishDate - Publication date
 * @param {string} lastModified - Last modification date
 * @returns {boolean} Whether to show UPDATED badge
 */
export const shouldShowUpdatedBadge = (publishDate, lastModified) => {
  if (!lastModified) {
    return false;
  }

  const daysSincePublish = getDaysSince(publishDate);
  const daysSinceModified = getDaysSince(lastModified);

  // Show updated badge if:
  // 1. Content is older than 7 days (not new)
  // 2. Modified within last 30 days
  // 3. Last modified date is different from publish date
  return (
    daysSincePublish > 7 &&
    daysSinceModified <= 30 &&
    publishDate !== lastModified
  );
};

/**
 * Get current system date in the format used by the app
 * @returns {string} Current date in "Month DD, YYYY" format
 */
export const getCurrentDate = () => {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return now.toLocaleDateString('en-US', options);
};

/**
 * Auto-generate lastModified date for content that doesn't have it
 * @param {Object} content - Content object with date property
 * @returns {Object} Content object with lastModified added if missing
 */
export const addLastModifiedIfMissing = (content) => {
  return {
    ...content,
    lastModified: content.lastModified || content.date,
  };
};
