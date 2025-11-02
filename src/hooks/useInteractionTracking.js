import { useCallback } from 'react';

/**
 * Hook for tracking user interactions with the GNN recommender system
 */
export const useInteractionTracking = () => {
  const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://your-gnn-backend.vercel.app'; // Update for production (Vercel)

  const trackInteraction = useCallback(async (postId, action, context = {}) => {
    try {
      // Get user ID from localStorage or generate anonymous ID
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('user_id', userId);
      }

      const interaction = {
        user_id: userId,
        post_id: postId,
        action: action,
        context: context
      };

      // Send interaction to backend
      const response = await fetch(`${API_BASE_URL}/interaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interaction)
      });

      if (!response.ok) {
        console.error('Failed to track interaction:', response.statusText);
      }

      return response.ok;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return false;
    }
  }, []);

  const trackView = useCallback((postId, sourcePost = null) => {
    const context = sourcePost ? { source_post: sourcePost } : {};
    return trackInteraction(postId, 'view', context);
  }, [trackInteraction]);

  const trackClick = useCallback((postId, sourcePost = null) => {
    const context = sourcePost ? { source_post: sourcePost } : {};
    return trackInteraction(postId, 'click', context);
  }, [trackInteraction]);

  const trackLike = useCallback((postId, relatedPosts = []) => {
    const context = relatedPosts.length > 0 ? { related_posts: relatedPosts } : {};
    return trackInteraction(postId, 'like', context);
  }, [trackInteraction]);

  const trackShare = useCallback((postId, platform = null) => {
    const context = platform ? { platform: platform } : {};
    return trackInteraction(postId, 'share', context);
  }, [trackInteraction]);

  const trackSkip = useCallback((postId, sourcePost = null) => {
    const context = sourcePost ? { source_post: sourcePost } : {};
    return trackInteraction(postId, 'skip', context);
  }, [trackInteraction]);

  const trackSearchClick = useCallback((postId, searchQuery) => {
    return trackInteraction(postId, 'search_click', { search_query: searchQuery });
  }, [trackInteraction]);

  return {
    trackView,
    trackClick,
    trackLike,
    trackShare,
    trackSkip,
    trackSearchClick,
    trackInteraction
  };
};
