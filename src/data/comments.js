/**
 * Comment Data Utilities
 * 
 * This module provides utilities for loading and managing comment data
 * from both build-time generated files and runtime API calls.
 */

import commentsData from './comments.json';

/**
 * Loads comments for a specific post from build-time data
 * @param {string} postSlug - The blog post slug
 * @returns {Array} Array of comments for the post
 */
export function getCommentsForPost(postSlug) {
  if (!commentsData || !commentsData.comments) {
    return [];
  }
  
  return commentsData.comments[postSlug] || [];
}

/**
 * Gets all comments data with metadata
 * @returns {Object} Complete comments data object
 */
export function getAllCommentsData() {
  return commentsData || {
    generatedAt: null,
    totalComments: 0,
    postsWithComments: 0,
    comments: {},
    metadata: {}
  };
}

/**
 * Gets comment statistics
 * @returns {Object} Comment statistics
 */
export function getCommentStats() {
  const data = getAllCommentsData();
  
  return {
    totalComments: data.totalComments || 0,
    postsWithComments: data.postsWithComments || 0,
    generatedAt: data.generatedAt,
    lastBuildTime: data.metadata?.buildTime
  };
}

/**
 * Checks if comments data is available and recent
 * @param {number} maxAge - Maximum age in milliseconds (default: 1 hour)
 * @returns {boolean} True if data is available and recent
 */
export function isCommentsDataRecent(maxAge = 3600000) {
  const data = getAllCommentsData();
  
  if (!data.generatedAt) {
    return false;
  }
  
  const generatedTime = new Date(data.generatedAt).getTime();
  const now = Date.now();
  
  return (now - generatedTime) < maxAge;
}

/**
 * Gets comments for multiple posts
 * @param {Array<string>} postSlugs - Array of blog post slugs
 * @returns {Object} Object with postSlug as key and comments array as value
 */
export function getCommentsForPosts(postSlugs) {
  const result = {};
  
  postSlugs.forEach(slug => {
    result[slug] = getCommentsForPost(slug);
  });
  
  return result;
}

/**
 * Searches comments across all posts
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Array} Array of matching comments with postSlug
 */
export function searchComments(query, options = {}) {
  const { caseSensitive = false, limit = 50 } = options;
  const searchQuery = caseSensitive ? query : query.toLowerCase();
  const results = [];
  
  const data = getAllCommentsData();
  
  Object.entries(data.comments || {}).forEach(([postSlug, comments]) => {
    comments.forEach(comment => {
      const searchText = caseSensitive 
        ? `${comment.name} ${comment.comment}`
        : `${comment.name} ${comment.comment}`.toLowerCase();
      
      if (searchText.includes(searchQuery)) {
        results.push({
          ...comment,
          postSlug
        });
      }
    });
  });
  
  // Sort by timestamp (newest first) and limit results
  return results
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

/**
 * Gets the most recent comments across all posts
 * @param {number} limit - Maximum number of comments to return
 * @returns {Array} Array of recent comments with postSlug
 */
export function getRecentComments(limit = 10) {
  const results = [];
  
  const data = getAllCommentsData();
  
  Object.entries(data.comments || {}).forEach(([postSlug, comments]) => {
    comments.forEach(comment => {
      results.push({
        ...comment,
        postSlug
      });
    });
  });
  
  // Sort by timestamp (newest first) and limit results
  return results
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

export default {
  getCommentsForPost,
  getAllCommentsData,
  getCommentStats,
  isCommentsDataRecent,
  getCommentsForPosts,
  searchComments,
  getRecentComments
};
