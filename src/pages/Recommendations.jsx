import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInteractionTracking } from '../hooks/useInteractionTracking';
import GraphVisualization from '../components/GraphVisualization';
import { 
  getSystemStatus, 
  getTrendingPosts, 
  getRecommendations 
} from '../utils/recommendationService';

const Recommendations = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postRecommendations, setPostRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const { trackClick, trackView } = useInteractionTracking();

  // Fetch system status (using local service)
  const fetchSystemStatus = useCallback(() => {
    try {
      const status = getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  }, []);

  // Fetch trending posts (using local service)
  const fetchTrendingPosts = useCallback(() => {
    try {
      const trending = getTrendingPosts(10);
      setTrendingPosts(trending);
      
      // Track views for trending posts
      trending.forEach(post => {
        trackView(post.id, 'recommendations-page');
      });
    } catch (error) {
      console.error('Failed to fetch trending posts:', error);
      setTrendingPosts([]);
    }
  }, [trackView]);

  // Fetch recommendations for a specific post (using local service)
  const fetchPostRecommendations = useCallback((postId) => {
    setLoading(true);
    try {
      // Simulate async behavior for better UX
      setTimeout(() => {
        const recs = getRecommendations(postId, 5);
        setPostRecommendations(recs);
        
        // Track views for recommendations
        recs.forEach(rec => {
          trackView(rec.id, postId);
        });
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setPostRecommendations([]);
      setLoading(false);
    }
  }, [trackView]);

  // Initial data fetch
  useEffect(() => {
    setLoading(true);
    fetchSystemStatus();
    fetchTrendingPosts();
    setLoading(false);
  }, [fetchSystemStatus, fetchTrendingPosts]);

  // Handle post selection
  const handlePostSelect = (post) => {
    setSelectedPost(post);
    setActiveTab('personalized');
    fetchPostRecommendations(post.id);
  };

  // Handle recommendation click
  const handleRecommendationClick = (recId, sourceId) => {
    trackClick(recId, sourceId || 'recommendations-page');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🧠 AI-Powered Recommendations
              </h1>
              <p className="mt-2 text-gray-600">
                Discover content tailored to your interests with Neural Graph Intelligence
              </p>
            </div>
            <Link
              to="/blog"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Blog
            </Link>
          </div>

          {/* System Status */}
          {systemStatus && (
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <span className={`px-2 py-1 rounded-full ${
                systemStatus.initialized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {systemStatus.initialized ? '✅ System Active' : '⏳ Initializing'}
              </span>
              {systemStatus.num_posts && (
                <span className="text-gray-600">
                  📊 {systemStatus.num_posts} posts analyzed
                </span>
              )}
              {systemStatus.num_edges && (
                <span className="text-gray-600">
                  🔗 {systemStatus.num_edges} connections
                </span>
              )}
              {systemStatus.ga4_enabled && (
                <span className="text-blue-600">
                  📈 GA4 Enhanced
                </span>
              )}
              {systemStatus.realtime_learning && (
                <span className="text-purple-600">
                  🔄 Real-time Learning
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === 'trending'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔥 Trending Topics
          </button>
          <button
            onClick={() => setActiveTab('personalized')}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === 'personalized'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎯 Personalized For You
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === 'graph'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🌐 Content Graph
          </button>
        </div>

        {/* Loading State */}
        {loading && activeTab !== 'graph' && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing content patterns...</p>
            </div>
          </div>
        )}

        {/* Trending Topics Tab */}
        {activeTab === 'trending' && !loading && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trendingPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
                  >
                    {/* Trend Indicator */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-semibold">
                      🔥 #{index + 1} Trending
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>

                      {/* Centrality Score */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.min((post.centrality_score / 2500) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {post.centrality_score?.toFixed(0)}
                        </span>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Link
                          to={post.url}
                          onClick={() => handleRecommendationClick(post.id, 'trending')}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Read Post
                        </Link>
                        <button
                          onClick={() => handlePostSelect(post)}
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          Get Similar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {trendingPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No trending posts available at the moment.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Personalized Recommendations Tab */}
        {activeTab === 'personalized' && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {!selectedPost ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Get Personalized Recommendations
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Select a post from the trending topics or choose one below to get AI-powered content suggestions tailored to your interests.
                    </p>
                    
                    {/* Quick Select */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 mb-2">Quick select:</p>
                      {trendingPosts.slice(0, 3).map(post => (
                        <button
                          key={post.id}
                          onClick={() => handlePostSelect(post)}
                          className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span className="text-sm font-medium">{post.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Selected Post Header */}
                  <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Recommendations based on:</p>
                        <h3 className="text-xl font-semibold text-gray-900">{selectedPost.title}</h3>
                        {selectedPost.tags && selectedPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedPost.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPost(null);
                          setPostRecommendations([]);
                        }}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Recommendations Grid */}
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {postRecommendations.map((rec, index) => (
                        <motion.div
                          key={rec.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-gray-900 flex-1">
                              {rec.title}
                            </h4>
                            <div className="ml-3 text-right">
                              <div className="text-xs text-gray-500">Match</div>
                              <div className="text-lg font-bold text-blue-600">
                                {((rec.score || rec.final_score || 0) * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>

                          {rec.excerpt && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {rec.excerpt}
                            </p>
                          )}

                          {/* Enhanced Metrics (if available) */}
                          {rec.engagement_score !== undefined && (
                            <div className="flex items-center space-x-4 mb-3 text-xs">
                              <span className="text-gray-500">
                                Engagement: <span className="font-semibold text-gray-700">{rec.engagement_score.toFixed(0)}</span>
                              </span>
                              {rec.is_trending && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                  Trending
                                </span>
                              )}
                            </div>
                          )}

                          {/* Tags */}
                          {rec.tags && rec.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {rec.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <Link
                            to={rec.url}
                            onClick={() => handleRecommendationClick(rec.id, selectedPost.id)}
                            className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Read This Post →
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {postRecommendations.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <p className="text-gray-500">No recommendations found for this post.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Graph Visualization Tab */}
        {activeTab === 'graph' && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <GraphVisualization currentPostId={selectedPost?.id} />
              
              <div className="mt-6 bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Understanding the Content Graph
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-gray-900">Blog Posts</p>
                      <p className="text-gray-600">Individual content pieces</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-gray-900">Tags</p>
                      <p className="text-gray-600">Topic categories</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1 h-4 bg-blue-300"></div>
                    <div>
                      <p className="font-medium text-gray-900">Connections</p>
                      <p className="text-gray-600">Semantic relationships</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Neural Intelligence
            </h3>
            <p className="text-sm text-gray-600">
              Graph Neural Networks analyze content relationships to find hidden connections between topics.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Real-time Learning
            </h3>
            <p className="text-sm text-gray-600">
              The system continuously learns from user interactions to improve recommendations over time.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Personalized Discovery
            </h3>
            <p className="text-sm text-gray-600">
              Get content suggestions tailored to your interests based on semantic similarity and behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
