// Recommendation service that works without backend API
import semanticMapping from '../data/semantic-mapping.json';
import semanticEmbeddings from '../data/semantic-embeddings.json';

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Get system status
export function getSystemStatus() {
  return {
    initialized: true,
    num_posts: semanticMapping.length,
    num_edges: semanticMapping.length * 10, // Approximate
    ga4_enabled: false,
    realtime_learning: false,
    features: ['graph_recommendations', 'trending_posts', 'similarity_scoring']
  };
}

// Get trending posts based on various factors
export function getTrendingPosts(limit = 10) {
  // Create a scoring system for trending
  const postsWithScores = semanticMapping.map((post, index) => {
    // Factors for trending score:
    // 1. Title keywords (AI, India, Trade, etc.)
    // 2. Position in list (newer posts get slight boost)
    // 3. Topic relevance
    
    const title = post.title?.toLowerCase() || '';
    const excerpt = post.excerpt?.toLowerCase() || '';
    const content = title + ' ' + excerpt;
    
    let score = 1000; // Base score
    
    // Boost for trending keywords
    const trendingKeywords = ['ai', 'india', 'trade', 'usa', 'startup', 'api', 'analysis', 'research'];
    trendingKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        score += 200;
      }
    });
    
    // Boost for specific high-value posts
    if (title.includes('india') && title.includes('usa')) score += 500;
    if (title.includes('ai') || title.includes('artificial')) score += 300;
    if (title.includes('startup')) score += 250;
    
    // Position boost (newer posts)
    score += (semanticMapping.length - index) * 10;
    
    // Extract tags from content
    const tags = [];
    trendingKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    return {
      id: post.id || post.slug || `post-${index}`,
      title: post.title || 'Untitled',
      url: post.url || `/blog/${post.slug || post.id}`,
      excerpt: post.excerpt || '',
      centrality_score: score + Math.random() * 100, // Add some randomness
      tags: tags.slice(0, 3)
    };
  });
  
  // Sort by score and return top N
  return postsWithScores
    .sort((a, b) => b.centrality_score - a.centrality_score)
    .slice(0, limit);
}

// Get recommendations for a specific post
export function getRecommendations(postId, limit = 5) {
  // Find the post index
  const postIndex = semanticMapping.findIndex(
    p => p.id === postId || p.slug === postId || p.title === postId
  );
  
  if (postIndex === -1) {
    console.warn('Post not found:', postId);
    return [];
  }
  
  // Get the embedding for this post
  const postEmbedding = semanticEmbeddings[postIndex]?.vector;
  if (!postEmbedding) {
    console.warn('No embedding found for post:', postId);
    return [];
  }
  
  // Calculate similarities with all other posts
  const similarities = semanticMapping.map((otherPost, otherIndex) => {
    if (otherIndex === postIndex) return null; // Skip self
    
    const otherEmbedding = semanticEmbeddings[otherIndex]?.vector;
    if (!otherEmbedding) return null;
    
    const similarity = cosineSimilarity(postEmbedding, otherEmbedding);
    
    // Extract tags
    const content = (otherPost.title + ' ' + otherPost.excerpt).toLowerCase();
    const tags = [];
    const keywords = ['ai', 'api', 'india', 'usa', 'trade', 'startup', 'analysis', 'research', 'technology', 'healthcare', 'react'];
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    return {
      id: otherPost.id || otherPost.slug || `post-${otherIndex}`,
      title: otherPost.title || 'Untitled',
      url: otherPost.url || `/blog/${otherPost.slug || otherPost.id}`,
      excerpt: otherPost.excerpt || '',
      score: similarity,
      tags: tags.slice(0, 3),
      // Add some mock enhanced metrics
      engagement_score: Math.random() * 100,
      is_trending: Math.random() > 0.7
    };
  }).filter(item => item !== null);
  
  // Sort by similarity and return top N
  return similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Get all posts for quick selection
export function getAllPosts() {
  return semanticMapping.map((post, index) => ({
    id: post.id || post.slug || `post-${index}`,
    title: post.title || 'Untitled',
    url: post.url || `/blog/${post.slug || post.id}`,
    excerpt: post.excerpt || ''
  }));
}