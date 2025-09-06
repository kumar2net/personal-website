// Central SEO index for blog posts (JSX or MD)
// Add entries as needed; used to hydrate title/description/image/canonical

export const blogIndex = {
  'common-sense-rare-commodity': {
    title: 'Common Sense is a Rare Commodity',
    description:
      'With all this rhetoric about tariffs from both sides—the great country and ours—where are we heading to? Unnecessary tension and so much management time wasted. Political rhetoric at the expense of common sense.',
    image: '/media/tandtTagcloud.png',
    tags: ['Trade Relations', 'International Politics', 'Economic Policy', 'Global Governance', 'Common Sense', 'Social Commentary'],
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
  },
  'sobering-week-august-2025': {
    title: 'A Sobering Week: Reflections on Loss, Life, and Learning',
    description:
      'Reflections on loss, family, education, and staying curious; thoughts on fragility and meaning.',
    image: '/media/RamStripesStars.jpeg',
    tags: ['Personal Reflection', 'Family', 'Education', 'Life Lessons'],
    datePublished: '2025-08-29',
    dateModified: '2025-08-29',
  },
  habit: {
    title: 'Habit',
    description:
      'A daily routine focused on learning, creating, mindfulness, honesty, and mentoring.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    tags: ['Habits', 'Productivity', 'Philosophy'],
    datePublished: '2025-08-29',
    dateModified: '2025-08-29',
  },
  'joy-of-writing': {
    title: 'Joy of Writing',
    description:
      'Why writing helps me organize thoughts and a note on voice-first UIs replacing screens.',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    tags: ['Writing', 'AI', 'UX'],
    datePublished: '2025-08-26',
    dateModified: '2025-08-26',
  },
  '2025-08-23-agentic-feature-in-a-browser': {
    title: 'Agentic feature in a browser',
    description:
      'Trying agentic features in Perplexity’s Comet browser and finance pages; quick impressions.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    tags: ['Technology', 'AI', 'Browser'],
    datePublished: '2025-08-23',
  },
  'global-economic-concerns-2025': {
    title: 'Global Economic Concerns: A 2025 Pew Research Perspective',
    description:
      'Cross-country concerns and outlooks from Pew Research 2025; analysis and highlights.',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    tags: ['Global Economy', 'Survey'],
    datePublished: '2025-08-25',
  },
  'semantic-search-explained': {
    title: 'Search Explained: How Semantic Search Transforms Content Discovery',
    description:
      'Discover how semantic search goes beyond keyword matching to understand meaning, context, and intent - transforming how we find relevant content online.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['Technology', 'AI', 'Search', 'Machine Learning', 'Web Development', 'User Experience'],
    datePublished: '2025-09-06',
    dateModified: '2025-09-06',
  },
};

export function getBlogSeo(slug) {
  return blogIndex[slug];
}
