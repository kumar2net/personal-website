import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TechTrendsDashboard = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lastUpdated, setLastUpdated] = useState('');
  const [cacheAge, setCacheAge] = useState(0);

  const categories = ['All', 'AI/ML', 'Web Dev', 'Mobile', 'DevOps', 'Programming', 'Technology'];

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchTechTrends();
  }, []);

  const fetchTechTrends = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Try local Netlify dev server first, then fallback to deployed function
      const localUrl = 'http://localhost:8888/.netlify/functions/tech-trends';
      const deployedUrl = 'https://kumarsite.netlify.app/.netlify/functions/tech-trends';
      
      let response;
      try {
        // Try local first
        response = await fetch(localUrl);
        if (!response.ok) {
          throw new Error(`Local server error: ${response.status}`);
        }
      } catch (localError) {
        console.log('Local Netlify dev server not available, trying deployed function...');
        // Fallback to deployed function
        response = await fetch(deployedUrl);
        if (!response.ok) {
          throw new Error(`Deployed function error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to fetch tech trends');
      }
      
      setTrends(data.trends || []);
      setLastUpdated(data.lastUpdated);
      setCacheAge(data.cacheAge || 0);
    } catch (err) {
      console.error('Error fetching tech trends:', err);
      setError('Failed to load tech trends. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrends = selectedCategory === 'All' 
    ? trends 
    : trends.filter(trend => trend.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      'AI/ML': 'bg-purple-100 text-purple-800',
      'Web Dev': 'bg-blue-100 text-blue-800',
      'Mobile': 'bg-green-100 text-green-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Programming': 'bg-indigo-100 text-indigo-800',
      'Technology': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Technology'];
  };

  const getRisingIcon = (rising) => {
    return rising ? '🚀' : '📊';
  };

  const formatEngagement = (engagement, source) => {
    if (source === 'GitHub') {
      return `${engagement.toLocaleString()} ⭐`;
    } else if (source === 'Hacker News') {
      return `${engagement.toLocaleString()} 💬`;
    } else if (source === 'Reddit') {
      return `${engagement.toLocaleString()} 🔥`;
    }
    return engagement.toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
            <h1 className="text-3xl font-bold text-gray-800">🚀 Rising Tech Trends</h1>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-red-500 rounded-full mr-3"></div>
            <h1 className="text-3xl font-bold text-gray-800">🚀 Rising Tech Trends</h1>
          </div>
          <div className="text-red-600 text-center py-8">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg">{error}</p>
            <button 
              onClick={fetchTechTrends}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🚀 Rising Tech Trends</h1>
            <p className="text-gray-600">
              Top 10 trending topics from Hacker News, GitHub, and Reddit
              {lastUpdated && (
                <span className="ml-2 text-sm">
                  • Last updated: {formatDate(new Date(lastUpdated))}
                  {cacheAge > 0 && ` (${cacheAge}h ago)`}
                </span>
              )}
            </p>
          </div>
          <button 
            onClick={fetchTechTrends}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Trends List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredTrends.length > 0 ? (
              filteredTrends.map((trend, index) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group"
                >
                  <a 
                    href={trend.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl font-bold text-gray-400 mr-3">
                            #{index + 1}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {getRisingIcon(trend.rising)} {trend.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {trend.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                              {trend.sourceIcon} {trend.source}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {formatEngagement(trend.engagement, trend.source)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(trend.category)}`}>
                              {trend.category}
                            </span>
                          </div>
                          
                          <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-lg">No trends found for "{selectedCategory}"</p>
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Trends
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Powered by Hacker News, GitHub, and Reddit</span>
            <span>Updated weekly • {filteredTrends.length} trends shown</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TechTrendsDashboard;
