// Recommendation service that works without backend API
import semanticMapping from '../data/semantic-mapping.json';
// Note: semantic-embeddings.json is empty, so we'll use text-based similarity

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

// Calculate text-based similarity between two posts
function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  // Convert to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  // Create word frequency maps
  const freq1 = {};
  const freq2 = {};
  
  words1.forEach(word => {
    freq1[word] = (freq1[word] || 0) + 1;
  });
  
  words2.forEach(word => {
    freq2[word] = (freq2[word] || 0) + 1;
  });
  
  // Calculate Jaccard similarity
  const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  let intersection = 0;
  
  allWords.forEach(word => {
    if (freq1[word] && freq2[word]) {
      intersection += Math.min(freq1[word], freq2[word]);
    }
  });
  
  const union = words1.length + words2.length - intersection;
  return union > 0 ? intersection / union : 0;
}

// Get recommendations for a specific post
export function getRecommendations(postId, limit = 5) {
  // Find the current post
  const currentPost = semanticMapping.find(
    p => p.id === postId || p.slug === postId || p.title === postId
  );
  
  if (!currentPost) {
    console.warn('Post not found:', postId);
    return [];
  }
  
  const currentContent = (currentPost.title + ' ' + currentPost.excerpt).toLowerCase();
  
  // Calculate similarities with all other posts using text-based similarity
  const similarities = semanticMapping.map((otherPost) => {
    // Skip the same post
    if (otherPost.id === currentPost.id) return null;
    
    const otherContent = (otherPost.title + ' ' + otherPost.excerpt).toLowerCase();
    
    // Calculate text similarity
    const textSimilarity = calculateTextSimilarity(currentContent, otherContent);
    
    // Boost similarity for shared keywords
    const keywords = ['ai', 'api', 'india', 'usa', 'trade', 'startup', 'analysis', 'research', 'technology', 'healthcare', 'react', 'python', 'data'];
    let keywordBoost = 0;
    
    keywords.forEach(keyword => {
      if (currentContent.includes(keyword) && otherContent.includes(keyword)) {
        keywordBoost += 0.1;
      }
    });
    
    // Extract tags for the other post
    const tags = [];
    keywords.forEach(keyword => {
      if (otherContent.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    const finalScore = Math.min(textSimilarity + keywordBoost, 1.0);
    
    return {
      id: otherPost.id || otherPost.slug,
      title: otherPost.title || 'Untitled',
      url: otherPost.url || `/blog/${otherPost.id}`,
      excerpt: otherPost.excerpt || '',
      score: finalScore,
      tags: tags.slice(0, 3),
      // Add some mock enhanced metrics
      engagement_score: 50 + Math.random() * 50,
      is_trending: Math.random() > 0.7
    };
  }).filter(item => item !== null && item.score > 0);
  
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