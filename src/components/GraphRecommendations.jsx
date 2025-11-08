import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInteractionTracking } from '../hooks/useInteractionTracking';
import { GNN_API_BASE_URL } from '../utils/gnnApi';

const GraphRecommendations = ({ currentPostId, maxRecommendations = 5 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemStatus, setSystemStatus] = useState({ initialized: false });
  
  // Initialize interaction tracking
  const { trackClick, trackView } = useInteractionTracking();

  // Check system status on mount
  const checkSystemStatus = useCallback(async () => {
    try {
      const response = await fetch(`${GNN_API_BASE_URL}/status`);
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
      }
    } catch (error) {
      console.error('Failed to check system status:', error);
    }
  }, []);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${GNN_API_BASE_URL}/recommendations/${encodeURIComponent(currentPostId)}?num_recommendations=${maxRecommendations}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations || []);
        // Track that recommendations were viewed
        data.recommendations.forEach(rec => {
          trackView(rec.id, currentPostId);
        });
      } else {
        setError(data.message || 'Failed to get recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [currentPostId, maxRecommendations, trackView]);

  useEffect(() => {
    checkSystemStatus();
  }, [checkSystemStatus]);

  // Fetch recommendations when currentPostId changes
  useEffect(() => {
    if (currentPostId && systemStatus.initialized) {
      fetchRecommendations();
    }
  }, [currentPostId, systemStatus.initialized, fetchRecommendations]);

  const hasValidRecommendations = useMemo(() => {
    return recommendations && recommendations.length > 0;
  }, [recommendations]);

  // Don't render if system is not initialized or if there's a critical error
  if (!systemStatus.initialized) {
    if (systemStatus.error) {
      return null; // Silently fail - don't show error to users
    }
    return (
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">
            Neural Graph Recommender initializing...
          </span>
        </div>
      </div>
    );
  }

  // Don't show anything if no current post ID
  if (!currentPostId) {
    return null;
  }

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">
              🧠 Neural Graph Recommendations
            </h3>
          </div>
          {systemStatus.num_posts && (
            <span className="text-xs text-gray-500">
              From {systemStatus.num_posts} posts • {systemStatus.num_edges}{' '}
              connections
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">
                Analyzing graph connections...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500">
              Unable to load recommendations at the moment
            </p>
          </div>
        )}

        {/* Recommendations */}
        {hasValidRecommendations && !loading && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Based on content similarity and graph neural network analysis:
            </p>

            <AnimatePresence>
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    to={rec.url}
                    onClick={() => trackClick(rec.id, currentPostId)}
                    className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {rec.title}
                        </h4>
                        {rec.excerpt && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {rec.excerpt}
                          </p>
                        )}

                        {/* Tags */}
                        {rec.tags && rec.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {rec.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {rec.tags.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                +{rec.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Similarity Score */}
                      <div className="ml-3 text-right">
                        <div className="text-xs text-gray-500">Similarity</div>
                        <div className="text-sm font-medium text-blue-600">
                          {Math.round(rec.score * 100)}%
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* No recommendations */}
        {!hasValidRecommendations && !loading && !error && (
          <div className="py-6 text-center">
            <div className="text-gray-400 mb-2">🔍</div>
            <p className="text-sm text-gray-600">
              No similar posts found in the graph network
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Powered by Graph Neural Networks • Real-time content analysis
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default GraphRecommendations;
