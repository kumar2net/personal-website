// Remove blobs for now - we'll use simple caching
// import { Blobs } from '@netlify/blobs';

// Cache duration: 1 week (in seconds)
const CACHE_DURATION = 7 * 24 * 60 * 60;

export default async function handler(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers,
    });
  }

  try {
    // For MVP, fetch fresh data every time
    // TODO: Add proper caching later
    const trends = await fetchAllTechTrends();

    return new Response(JSON.stringify({
      trends,
      lastUpdated: new Date().toISOString(),
      cacheAge: 0,
      source: 'fresh'
    }), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Error fetching tech trends:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch tech trends',
      message: error.message
    }), {
      status: 500,
      headers,
    });
  }
}

async function fetchAllTechTrends() {
  const [hnTrends, githubTrends, redditTrends] = await Promise.all([
    fetchHackerNewsTrends(),
    fetchGitHubTrends(),
    fetchRedditTechTrends()
  ]);

  // Combine and rank all trends
  const allTrends = [...hnTrends, ...githubTrends, ...redditTrends];
  
  // Remove duplicates and rank by engagement
  const uniqueTrends = removeDuplicates(allTrends);
  const rankedTrends = rankTrends(uniqueTrends);
  
  // Return top 10
  return rankedTrends.slice(0, 10);
}

async function fetchHackerNewsTrends() {
  try {
    // Fetch top stories from Hacker News
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = await response.json();
    
    // Get top 20 stories
    const topStoryIds = storyIds.slice(0, 20);
    const storyPromises = topStoryIds.map(id => 
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
    );
    
    const stories = await Promise.all(storyPromises);
    
    return stories
      .filter(story => story && story.title && story.score > 100) // Filter by engagement
      .map(story => ({
        id: `hn-${story.id}`,
        title: story.title,
        description: `Hacker News top story with ${story.score} points`,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        source: 'Hacker News',
        sourceIcon: '💬',
        engagement: story.score,
        category: categorizeTechTrend(story.title),
        timestamp: story.time * 1000,
        rising: story.score > 200 // High engagement = rising
      }));
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}

async function fetchGitHubTrends() {
  try {
    // Fetch trending repositories from GitHub
    const response = await fetch('https://api.github.com/search/repositories?q=created:>2025-08-01&sort=stars&order=desc&per_page=20');
    const data = await response.json();
    
    return data.items
      .filter(repo => repo.stargazers_count > 50) // Filter by stars
      .map(repo => ({
        id: `gh-${repo.id}`,
        title: repo.full_name,
        description: repo.description || 'Popular GitHub repository',
        url: repo.html_url,
        source: 'GitHub',
        sourceIcon: '⭐',
        engagement: repo.stargazers_count,
        category: categorizeTechTrend(repo.description || repo.name),
        timestamp: new Date(repo.created_at).getTime(),
        rising: repo.stargazers_count > 100 // High stars = rising
      }));
  } catch (error) {
    console.error('Error fetching GitHub trends:', error);
    return [];
  }
}

async function fetchRedditTechTrends() {
  try {
    // Fetch top posts from r/technology
    const response = await fetch('https://www.reddit.com/r/technology/top.json?t=week&limit=20');
    const data = await response.json();
    
    return data.data.children
      .filter(post => post.data.score > 100) // Filter by upvotes
      .map(post => ({
        id: `reddit-${post.data.id}`,
        title: post.data.title,
        description: `Reddit post with ${post.data.score} upvotes`,
        url: post.data.url,
        source: 'Reddit',
        sourceIcon: '🔥',
        engagement: post.data.score,
        category: categorizeTechTrend(post.data.title),
        timestamp: post.data.created_utc * 1000,
        rising: post.data.score > 500 // High upvotes = rising
      }));
  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    return [];
  }
}

function categorizeTechTrend(title) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('ai') || titleLower.includes('machine learning') || titleLower.includes('neural') || titleLower.includes('gpt') || titleLower.includes('llm')) {
    return 'AI/ML';
  }
  if (titleLower.includes('react') || titleLower.includes('vue') || titleLower.includes('angular') || titleLower.includes('javascript') || titleLower.includes('typescript')) {
    return 'Web Dev';
  }
  if (titleLower.includes('ios') || titleLower.includes('android') || titleLower.includes('mobile') || titleLower.includes('app')) {
    return 'Mobile';
  }
  if (titleLower.includes('docker') || titleLower.includes('kubernetes') || titleLower.includes('aws') || titleLower.includes('cloud') || titleLower.includes('devops')) {
    return 'DevOps';
  }
  if (titleLower.includes('python') || titleLower.includes('java') || titleLower.includes('go') || titleLower.includes('rust')) {
    return 'Programming';
  }
  
  return 'Technology';
}

function removeDuplicates(trends) {
  const seen = new Set();
  return trends.filter(trend => {
    const key = trend.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function rankTrends(trends) {
  return trends
    .sort((a, b) => {
      // Primary sort: engagement score
      if (b.engagement !== a.engagement) {
        return b.engagement - a.engagement;
      }
      // Secondary sort: recency
      return b.timestamp - a.timestamp;
    });
}
