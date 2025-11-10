// Updated recommendation service with GA4 data integration
import semanticMapping from '../data/semantic-mapping.json';
import ga4Data from '../data/ga4-recommendations.json';

// Get system status with GA4 integration
export function getSystemStatus() {
  return {
    initialized: true,
    num_posts: semanticMapping.length,
    num_edges: semanticMapping.length * 10,
    ga4_enabled: true, // Now enabled!
    realtime_learning: false,
    features: ['graph_recommendations', 'trending_posts', 'similarity_scoring', 'ga4_analytics']
  };
}

// Get trending posts from real GA4 data
export function getTrendingPosts(limit = 10) {
  if (ga4Data && ga4Data.trending_posts) {
    // Use real GA4 trending data
    return ga4Data.trending_posts.slice(0, limit).map(post => ({
      id: post.id,
      title: post.title,
      url: post.url,
      centrality_score: post.engagement_score,
      tags: extractTags(post.title),
      views: post.views,
      unique_users: post.unique_users,
      avg_time: post.avg_time,
      trend_rank: post.trend_rank
    }));
  }
  
  // Fallback to keyword-based (shouldn't happen now)
  return originalGetTrendingPosts(limit);
}

// Get recommendations using GA4 user journey data
export function getRecommendations(postId, limit = 5) {
  // Check if we have GA4 recommendations for this post
  if (ga4Data && ga4Data.recommendations && ga4Data.recommendations[postId]) {
    const ga4Recs = ga4Data.recommendations[postId].slice(0, limit);
    
    return ga4Recs.map(rec => ({
      id: rec.url.replace('/blog/', '').replace('/', ''),
      title: rec.title,
      url: rec.url,
      score: rec.score,
      engagement_score: rec.engagement_score,
      is_trending: rec.views > 200,
      tags: extractTags(rec.title),
      ga4_reason: rec.reason,
      users_also_viewed: rec.users_navigated
    }));
  }
  
  // Fallback to text-based similarity
  return originalGetRecommendations(postId, limit);
}

function extractTags(title) {
  const keywords = ['ai', 'india', 'usa', 'trade', 'startup', 'api', 'technology'];
  const titleLower = title.toLowerCase();
  return keywords.filter(k => titleLower.includes(k)).slice(0, 3);
}

// Keep original functions as fallback
const originalGetTrendingPosts = function(limit = 10) {
  const items = Array.isArray(semanticMapping) ? semanticMapping.slice(0, limit) : [];
  return items.map((post, index) => {
    const title = post?.title || `Post ${index + 1}`;
    const slug = post?.slug || title.toLowerCase().replace(/\s+/g, '-');
    const url = post?.url || `/blog/${slug}`;
    return {
      id: post?.id || slug,
      title,
      url,
      centrality_score: 0,
      tags: extractTags(title),
    };
  });
};

const originalGetRecommendations = function(postId, limit = 5) {
  const items = Array.isArray(semanticMapping) ? semanticMapping : [];
  const recs = items.filter(p => (p?.id || p?.slug) !== postId).slice(0, limit);
  return recs.map((post, index) => {
    const title = post?.title || `Post ${index + 1}`;
    const slug = post?.slug || title.toLowerCase().replace(/\s+/g, '-');
    const url = post?.url || `/blog/${slug}`;
    return {
      id: post?.id || slug,
      title,
      url,
      score: 0,
      tags: extractTags(title),
    };
  });
};
