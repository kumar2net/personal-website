import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ContentBadge from '../components/ContentBadge';
import SEO from '../components/SEO';
import SemanticSearch from '../components/SemanticSearch';
import { addLastModifiedIfMissing } from '../utils/contentDates';

const blogPosts = [
  {
    title: 'The OpenAI Ecosystem Explained: A Complete Guide to Products, Features, and Competition',
    date: 'October 23, 2025',
    lastModified: 'October 23, 2025',
    excerpt:
      'A comprehensive deep dive into OpenAI\'s complete product ecosystem, exploring how each service works, their competitive landscape, user adoption, and how developers can leverage these tools to build the next generation of AI-powered applications.',
    tags: ['Artificial Intelligence', 'OpenAI', 'Large Language Models', 'Machine Learning', 'Technology', 'Innovation'],
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    link: '/blog/openai-ecosystem-explained',
  },
  {
    title: 'Bitcoin and Disintermediation: Reimagining the Future of Finance',
    date: 'October 23, 2025',
    lastModified: 'October 23, 2025',
    excerpt:
      'Exploring how Bitcoin challenges traditional financial intermediaries and paves the way for a new era of peer-to-peer value transfer without trusted third parties.',
    tags: ['Bitcoin', 'Finance', 'Cryptocurrency', 'Blockchain', 'Decentralization', 'Economics'],
    image:
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80',
    link: '/blog/bitcoin-disintermediation',
  },
  {
    title: 'Rise from Fire',
    date: 'October 22, 2025',
    lastModified: 'October 22, 2025',
    excerpt:
      'A deeply inspiring Malayalam song exploring the path of spiritual liberation, duty, and the journey of the soul from fire to absolute freedom.',
    tags: ['Malayalam Music', 'Philosophy', 'Spiritual Journey', 'Liberation', 'Sanskrit Wisdom', 'Karma'],
    image:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    link: '/blog/2025-10-22-rise-from-fire',
  },
  {
    title: 'The Educator of Highest Calibre',
    date: 'October 22, 2025',
    lastModified: 'October 22, 2025',
    excerpt:
      "Impressed by Andrej Karpathy's marathon chat with Dwarkesh Patel, an AWS US-East-1 outage flashback, and my first dogfooding post to stay relevant with the kids.",
    tags: ['Podcast', 'LLMs', 'Reinforcement Learning', 'AWS Outage', 'DNS', 'Family Conversations'],
    image:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
    link: '/blog/2025-10-22-the-educator-of-highest-calibre',
  },
  {
    title: 'Fortnight That Went By - September 2025',
    date: 'September 27, 2025',
    lastModified: 'September 27, 2025',
    excerpt:
      'Reflections on Jevons paradox, AI in education, homelessness in San Francisco, and Golu celebrations - a fortnight of learning and observations.',
    tags: ['Jevons Paradox', 'AI Education', 'Renewable Energy', 'Social Issues', 'Tamil Culture', 'Personal Reflections'],
    image: '/media/Marapachi_dolls_1.jpg',
    link: '/blog/fortnight-that-went-by-september-2025',
  },
  {
    title: 'Starting Up Your Own Company',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    lastModified: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    excerpt:
      'Understanding the difference between startups and small businesses, the venture capital ecosystem, and how to leverage India\'s startup ecosystem for exponential growth.',
    tags: ['Entrepreneurship', 'Startups', 'Venture Capital', 'Business', 'Innovation', 'India Startup Ecosystem'],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
    link: '/blog/expanding-startups',
    author: 'Natarajan. S',
    authorBio: 'Mentor in Residence, IISc Bangalore',
  },
  {
    title: 'Latest Happenings',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    lastModified: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    excerpt:
      'A quick visual guide to WebAuthn passkeys: client challenge signing and server public-key verification.',
    tags: ['Security', 'WebAuthn', 'Passkeys', 'Authentication'],
    image: '/media/chitra_onestroke1.jpg',
    imageCredit: "Chitra's recent Onestroke artistry",
    link: '/blog/Latest_Happenings',
  },
  {
    title: 'Search Explained: How Semantic Search Transforms Content Discovery',
    date: 'September 06, 2025',
    excerpt:
      'Discover how semantic search goes beyond keyword matching to understand meaning, context, and intent - transforming how we find relevant content online.',
    tags: ['Technology', 'AI', 'Search', 'Machine Learning', 'Web Development', 'User Experience'],
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    link: '/blog/semantic-search-explained',
  },
  {
    title: 'Common Sense is a Rare Commodity',
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    lastModified: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    excerpt:
      'With all this rhetoric about tariffs from both sides—the great country and ours—where are we heading to? Unnecessary tension and so much management time wasted. Political rhetoric at the expense of common sense.',
    tags: [
      'Trade Relations',
      'International Politics',
      'Economic Policy',
      'Global Governance',
      'Common Sense',
      'Social Commentary',
    ],
    image: '/media/tandtTagcloud.png',
    link: '/blog/common-sense-rare-commodity',
  },
  {
    title: 'A Sobering Week: Reflections on Loss, Life, and Learning',
    date: 'August 2025',
    lastModified: 'August 2025',
    excerpt:
      'When life reminds us of its fragility, we find ourselves reflecting on what truly matters. Personal reflections on loss, family, education, and the importance of staying curious and persistent.',
    tags: [
      'Personal Reflection',
      'Family',
      'Education',
      'Loss',
      'Life Lessons',
      'Resilience',
    ],
    image: '/media/RamStripesStars.jpeg',
    link: '/blog/sobering-week-august-2025',
  },
  {
    title: 'Habit',
    date: 'August 29, 2025',
    lastModified: 'August 29, 2025',
    excerpt:
      'A comprehensive daily routine focused on early rising, continuous learning, creation, mindfulness, honest communication, healthy eating, providing technical feedback, and mentoring family youngsters. The philosophy emphasizes authenticity over politeness.',
    tags: [
      'Habits',
      'Productivity',
      'Technology',
      'Philosophy',
      'Zen',
      'Feedback',
    ],
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    link: '/blog/habit',
  },
  {
    title: 'Boy with Music in His Veins',
    date: 'August 29, 2025',
    lastModified: 'August 29, 2025',
    excerpt:
      "Meet Dharun, my good friend Senthil's son, a 15-year-old music fanatic and passionate pianist whose love for music began at the tender age of four. His journey from a curious toddler to a Grade 7 Trinity pianist is nothing short of extraordinary.",
    tags: ['Music', 'Piano', 'Composition', 'Trinity', 'Yamaha', 'Logic Pro'],
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    link: '/blog/boy-with-music-in-veins',
  },
  {
    title:
      'Friction in India with Government Services — TNPDCL Energy Meter Reading',
    date: 'August 27, 2025',
    lastModified: 'August 27, 2025',
    excerpt:
      'Manual readings cause stress and billing errors. A cellular-only AMR/AMI plan with CAPEX/OPEX, ROI, and a phased rollout tailored for TNPDCL.',
    tags: ['Utilities', 'Smart Metering', 'TNPDCL', 'AMI', 'Cellular'],
    image:
      'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80',
    link: '/blog/tnpdcl-automated-meter-reading',
  },
  {
    title: 'joy of writing',
    date: 'August 26, 2025',
    lastModified: 'August 26, 2025',
    excerpt:
      'Why I love writing: organizing thoughts without interruption, and a thought on the next big thing—natural spoken language interfaces replacing screens.',
    tags: ['Writing', 'AI', 'Natural Language', 'UX'],
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    link: '/blog/joy-of-writing',
  },
  {
    title: 'agentic feature in a browser',
    date: 'August 23, 2025',
    lastModified: 'August 23, 2025',
    excerpt:
      'Tell us about the last thing you got excited about. I like the agentic features Perplexity has got in their new Comet web browser. I tried out few tasks and it did work well. This along with their perplexity.ai/ finance page for India stock market news, earnings, other metrics is brilliant.',
    tags: [
      'Technology',
      'AI',
      'Browser',
      'Perplexity',
      'Agentic Features',
      'Finance',
    ],
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    link: '/blog/2025-08-23-agentic-feature-in-a-browser',
  },
  {
    title: '🌍 Global Economic Concerns: A 2025 Pew Research Perspective',
    date: 'August 25, 2025',
    lastModified: 'August 25, 2025',
    excerpt:
      'The 2025 Pew Research Center survey reveals fascinating insights into how different nations perceive global economic threats and their economic outlooks. Analysis of economic concerns across India, Singapore, USA, Canada, and the UK.',
    tags: [
      'Global Economy',
      'Economic Survey',
      'Economic Inequality',
      'International Relations',
      'Economic Outlook',
      'Pew Research',
    ],
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/blog/global-economic-concerns-2025',
  },
  {
    title: "Devastated by the Young Girl's Sudden Demise",
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    lastModified: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    excerpt:
      'A heartbreaking reflection on the sudden loss of a young life to dengue-related complications. A call to action for better healthcare and prevention.',
    tags: [
      'Healthcare',
      'Dengue',
      'Public Health',
      'Tragedy',
      'Prevention',
      'Social Impact',
    ],
    image:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzgiIGZpbGw9IiNGRkY3RDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRkY5NjAwIj4KPHBhdGggZD0iTTEyIDJMMiA3djEwYzAgNS41NSAzLjg0IDkuNzQgOSAxMSA1LjE2LTEuMjYgOS01LjQ1IDktMTFWN2wtMTAtNXoiLz4KPHBhdGggZD0iTTEyIDZjLTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNC0xLjc5LTQtNC00eiIvPgo8cGF0aCBkPSJNMTIgMTZjLTMuMzEgMC02LTIuNjktNi02czIuNjktNiA2LTYgNiAyLjY5IDYgNi0yLjY5IDYtNiA2eiIvPgo8L3N2Zz4KPC9zdmc+',
    link: '/blog/devastated-by-young-girls-demise',
  },
  {
    title: 'FAQ with our budding dentist',
    date: 'August 22, 2025',
    lastModified: 'August 22, 2025',
    excerpt:
      'An insightful conversation about dentistry. Common questions we want answered and help us improve our oral health.',
    tags: ['Dentistry', 'Healthcare', 'Education', 'Audio Interview'],
    image:
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/blog/faq-budding-dentist',
  },
  {
    title: 'What to Write This Week?',
    date: 'August 16, 2025',
    lastModified: 'August 16, 2025',
    excerpt:
      "A long weekend in India brings reflections on trade, AI quirks, family adventures, and the simple joys of life. From Tirupur's textile industry to ChatGPT's confusion with Indian epics.",
    tags: [
      'Personal',
      'Trade Policy',
      'AI & Technology',
      'Travel',
      'India',
      'Family',
    ],
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    link: '/blog/long-weekend-musings-2025',
  },
  {
    title: "🚀 The Great Pivot — What's Behind All This T&T Hullabaloo!",
    date: 'August 14, 2025',
    lastModified: 'August 14, 2025',
    excerpt:
      "When the US decides to pivot towards manufacturing glory, it's not a nostalgic trip back to old-school factories — it's a calculated move in the global economic game. And here's the kicker: one manufacturing job can spark 10 other jobs.",
    tags: [
      'Manufacturing',
      'US Economy',
      'Tariffs',
      'Global Trade',
      'Economic Policy',
      'Job Creation',
      'Supply Chain',
    ],
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/blog/the-great-pivot',
  },
  {
    title: 'Top 10 Famous Rules (with Examples)',
    date: 'August 9, 2025',
    excerpt:
      'Ten timeless rules like Rule of 72, Pareto Principle (with effort tip), and Benford’s Law—each explained with simple, real-world examples.',
    tags: [
      'Mental Models',
      'Decision Making',
      'Productivity',
      'Economics',
      'Statistics',
    ],
    image:
      'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=800&q=80',
    link: '/blog/top-9-famous-rules',
  },
  {
    title: 'India-USA Trade Relations: A $212.3B Partnership Under Pressure',
    date: 'August 7, 2025',
    lastModified: 'August 8, 2025',
    excerpt:
      'From record-breaking trade volumes to escalating tariffs: The complex dynamics of India-US economic relations in 2025. Cornell notes analysis of the $212.3B trade relationship and recent 50% tariff escalations.',
    tags: [
      'Trade Relations',
      'India Economy',
      'US Tariffs',
      'International Trade',
      'Economic Policy',
    ],
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    link: '/blog/india-usa-trade-gap-2025',
  },
  {
    title: 'revolutionizing soil analysis: laser vs traditional methods',
    date: 'August 03, 2025',
    excerpt:
      'A groundbreaking Florida study comparing traditional sieve methods with laser diffraction technology reveals surprising insights about soil composition analysis. 75 samples, 5x faster results, and new accuracy standards.',
    tags: [
      'Agriculture',
      'Research',
      'Soil Science',
      'Technology',
      'Environmental',
      'Construction',
      'Scientific Method',
    ],
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/blog/nammu-soil-analysis-research',
  },
  {
    title: 'my random thoughts this week',
    date: 'August 03, 2025',
    excerpt:
      'From surgical robots to satellite internet - a week of fascinating tech developments that caught my attention. Da Vinci Xi robot specifics, T&T policy impacts, and the power vs environment dilemma.',
    tags: [
      'Technology',
      'Healthcare',
      'Robotics',
      'Trade Policy',
      'Renewable Energy',
      'India Economy',
      'News Analysis',
    ],
    image:
      '/.netlify/functions/image-proxy?url=https%3A%2F%2Fpicsum.photos%2F800%2F400%3Frandom%3Dtech',
    link: '/blog/my-random-thoughts-this-week',
  },
  {
    title: 'Nepal Journeys: An Annapurna Circuit Adventure',
    date: 'July 27, 2025',
    excerpt:
      'Our incredible journey through Nepal centered on the Annapurna Circuit trail, a challenging yet rewarding trek spanning approximately 120km from Phedi to Tatopani.',
    tags: [
      'Adventure',
      'Trekking',
      'Nepal',
      'Annapurna',
      'Travel',
      'Mountains',
    ],
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    link: '/blog/nepal-annapurna-circuit',
  },
  {
    title: 'Memory Evolution: From Human Moments to AI Memories',
    date: 'July 26, 2025',
    excerpt:
      'Reflecting on how personal memories and AI memory systems are evolving side by side, from emotional moments to digital recollections. Includes a real AI-generated video memory.',
    tags: [
      'AI Memory',
      'Technology Evolution',
      'Human Memory',
      'Nostalgia',
      'Personal Reflection',
    ],
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    link: '/blog/memory-evolution',
  },
  {
    title:
      'Applying the Robinson Method: A Guide to Using Active Reading and Mastering Lifelong Learning',
    date: 'July 26, 2025',
    excerpt:
      "Notes from Andréia Ramos' book on the SQ3R method - an active reading technique developed by Francis P. Robinson in 1946 for enhanced comprehension and retention.",
    tags: [
      'Learning',
      'SQ3R Method',
      'Active Reading',
      'Study Techniques',
      'Education',
    ],
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    link: '/blog/applying-robinson-method',
  },
  {
    title: 'Feynman Techniques: Learning Like Richard Feynman',
    date: 'July 19, 2025',
    excerpt:
      "How the Nobel Prize-winning physicist's simple approach to learning can transform your understanding of any subject. The Feynman Technique explained.",
    tags: ['Learning', 'Feynman Technique', 'Education', 'Physics', 'Teaching'],
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    link: '/blog/feynman-technique',
  },
  {
    title: 'Ekadasi morphs into IF and now Autophagy!',
    date: 'July 19, 2025',
    excerpt:
      'How ancient fasting traditions align with modern science on cellular health and metabolic wellness. From Ekadasi to intermittent fasting to autophagy.',
    tags: [
      'Fasting',
      'Autophagy',
      'Intermittent Fasting',
      'Ekadasi',
      'Health',
      'Wellness',
    ],
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    link: '/blog/autophagy',
  },
  {
    title: 'Started to Kindle Again',
    date: 'July 11, 2025',
    excerpt:
      'Returning to focused reading and discovering the power of dopamine detox. A personal journey back to deep reading and sustained attention.',
    tags: ['Kindle', 'Dopamine Detox', 'Digital Wellness', 'Focus', 'Reading'],
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    link: '/blog/started-to-kindle-again',
  },
  {
    title: 'Price/cost of essentials in places our folks live now',
    date: 'July 9, 2025',
    excerpt:
      'Compare cost of living, taxes, and healthcare across major global cities with a compact master view.',
    tags: ['Cost of Living', 'Taxes', 'Healthcare', 'Global Cities'],
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    link: '/blog/price-parity',
  },
  {
    title: 'Acronym Soup Revisited: From FANG to the Magnificent 7',
    date: 'July 5, 2025',
    excerpt:
      "From FANG to Magnificent 7: how tech's power list evolved and what it means for investors and everyday users.",
    tags: ['Tech Trends', 'Magnificent 7', 'FAANG', 'MAAMA'],
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    link: '/blog/acronym-soup-revisited-2025',
  },
  {
    title:
      "Hope this gets implemented sooner in India: Microsoft's MAI-DxO Revolution",
    date: 'July 4, 2025',
    excerpt:
      "Microsoft's MAI-DxO achieves 85.5% diagnostic accuracy compared to 20% for human doctors, while reducing costs by 20%. Here's why India needs this breakthrough technology now.",
    tags: [
      'Microsoft AI',
      'MAI-DxO',
      'Medical AI',
      'Healthcare India',
      'Diagnostic AI',
      'Human-in-Loop',
    ],
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    link: '/blog/microsoft-mai-dx-india',
  },
  {
    title:
      'Very Compelling India Story: How Millennials Are Powering the SIP Revolution',
    date: 'June 28, 2025',
    excerpt:
      "A look at how India's millennials are driving record SIP inflows, with the latest numbers and a visual chart of the growth.",
    tags: ['Personal Finance', 'SIP', 'Millennials', 'India Growth'],
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    link: '/blog/compelling-india-story',
  },
  {
    title: 'My Fascination with Shortcuts: The Art of Keyboard Navigation',
    date: 'June 27, 2025',
    excerpt:
      "Why keyboard shortcuts feel like a superpower and how they've become second nature to me. Plus, interactive flashcards to master them yourself!",
    tags: ['Productivity', 'Vim', 'macOS', 'Browser', 'Keyboard Shortcuts'],
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    link: '/blog/my-fascination-with-shortcuts',
  },
  {
    title: 'Building a NewsAPI MCP Server with Cursor',
    date: 'June 21, 2025',
    excerpt:
      'A practical guide to creating an MCP server for news aggregation and integrating it with Cursor IDE for enhanced development workflows.',
    tags: ['MCP', 'Cursor IDE', 'NewsAPI', 'Node.js', 'Netlify'],
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    link: '/blog/building-mcp-server-with-cursor',
  },
  {
    title:
      "Andrej Karpathy's Y Combinator AI Startup School: The Electricity Analogy",
    date: 'June 20, 2025',
    excerpt:
      'How Andrej Karpathy\'s revolutionary "LLMs are like electricity" analogy is reshaping our understanding of AI\'s role in the modern world.',
    tags: [
      'AI',
      'Andrej Karpathy',
      'Y Combinator',
      'LLMs',
      'Electricity Analogy',
    ],
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    link: '/blog/andrej-karpathy-yc-ai-startup-school',
  },
  {
    title:
      'My Experience with the stock market API: Building a Mutual Fund Performance Tracker',
    date: 'June 18, 2025',
    excerpt:
      'A dive into integrating LLMs and specialized APIs for personal finance. How I built a unified mutual fund tracker using GPT-4o and indianapi.in.',
    tags: [
      'API',
      'LLM',
      'Mutual Funds',
      'Personal Finance',
      'Data Integration',
      'GPT-4o',
    ],
    image:
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    link: '/blog/experience-using-api-in-ai-code-editor',
  },
  {
    title: 'My Experience with Windsurf',
    date: 'June 17, 2025',
    excerpt:
      'A detailed account of my experience using Windsurf, the AI coding assistant, for my web development projects.',
    tags: ['AI Coding', 'Windsurf', 'Developer Tools', 'Productivity'],
    image:
      '/.netlify/functions/image-proxy?url=https%3A%2F%2Fpicsum.photos%2F800%2F400%3Frandom%3D5',
    link: '/blog/my-experience-with-windsurf',
  },
  {
    title: 'Building My Personal Portfolio Website',
    date: 'June 16, 2025',
    excerpt:
      'A detailed look at building my portfolio website with React, Tailwind CSS, and modern web technologies.',
    tags: ['React', 'Web Development', 'Portfolio', 'Frontend'],
    image:
      '/.netlify/functions/image-proxy?url=https%3A%2F%2Fpicsum.photos%2F800%2F400%3Frandom%3D4',
    link: '/blog/portfolio-website',
  },
  {
    title: 'Building a Spine Implant Market Analytics Dashboard',
    date: 'June 15, 2025',
    excerpt:
      'A deep dive into creating a comprehensive analytics dashboard for the spine implant market in India using React and Next.js.',
    tags: ['React', 'Next.js', 'Data Visualization', 'Medical Analytics'],
    image:
      '/.netlify/functions/image-proxy?url=https%3A%2F%2Fpicsum.photos%2F800%2F400%3Frandom%3D1',
    link: '/blog/spine-implant-dashboard',
  },
  {
    title: 'Smart Drug Suggestion App: Architecture and Implementation',
    date: 'June 14, 2025',
    excerpt:
      'Exploring the architecture and key features of a modern drug suggestion application built with React and TypeScript.',
    tags: ['React', 'TypeScript', 'AI', 'Pharmaceutical'],
    image:
      '/.netlify/functions/image-proxy?url=https%3A%2F%2Fpicsum.photos%2F800%2F400%3Frandom%3D2',
    link: '/blog/drug-suggestion-app',
  },
  /* {
    title: 'Optimizing React Applications for Performance',
    date: 'March 30, 2025',
    excerpt: 'Best practices and techniques for optimizing React applications to deliver better performance and user experience.',
    tags: ['React', 'Performance', 'Optimization'],
    image: '/.netlify/functions/image-proxy?url=https%3A%2F%2Fpicsum.photos%2F800%2F400%3Frandom%3D3',
    link: '/blog/react-performance'
  } */
];

const Blog = () => {
  // Ensure all posts have lastModified dates
  const processedPosts = blogPosts.map(addLastModifiedIfMissing);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <SEO
        title="Blog"
        description="Latest posts on technology, learning, notes, and personal writing."
        canonicalPath="/blog"
        type="website"
      />
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <SemanticSearch />
      <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {processedPosts.map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                loading="lazy"
                decoding="async"
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                style={
                  post.title ===
                  'A Sobering Week: Reflections on Loss, Life, and Learning'
                    ? {
                        objectPosition: 'center 30%',
                      }
                    : {}
                }
              />
              <ContentBadge
                publishDate={post.date}
                lastModified={post.lastModified}
              />
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                {post.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">
                <Link to={post.link}>{post.title}</Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="mt-3">
                <Link
                  to={post.link}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  aria-label={`Read more: ${post.title}`}
                >
                  Read more
                </Link>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {post.date}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Load More
        </button>
      </div>
    </motion.div>
  );
};

export default Blog;
