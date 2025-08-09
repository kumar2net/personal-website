import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CompellingIndiaStory from './blog/Compelling-india-story'

const blogPosts = [
  {
    title: 'Top 10 Famous Rules (with Examples)',
    date: 'August 9, 2025',
    excerpt: 'Ten timeless rules like Rule of 72, Pareto Principle (with effort tip), and Benford’s Law—each explained with simple, real-world examples.',
    tags: ['Mental Models', 'Decision Making', 'Productivity', 'Economics', 'Statistics'],
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=800&q=80',
    link: '/blog/top-9-famous-rules'
  },
  {
    title: 'India-USA Trade Relations: A $212.3B Partnership Under Pressure',
    date: 'August 7, 2025',
    excerpt: 'From record-breaking trade volumes to escalating tariffs: The complex dynamics of India-US economic relations in 2025. Cornell notes analysis of the $212.3B trade relationship and recent 50% tariff escalations.',
    tags: ['Trade Relations', 'India Economy', 'US Tariffs', 'International Trade', 'Economic Policy'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    link: '/blog/india-usa-trade-gap-2025'
  },
  {
    title: 'revolutionizing soil analysis: laser vs traditional methods',
    date: 'August 03, 2025',
    excerpt: 'A groundbreaking Florida study comparing traditional sieve methods with laser diffraction technology reveals surprising insights about soil composition analysis. 75 samples, 5x faster results, and new accuracy standards.',
    tags: ['Agriculture', 'Research', 'Soil Science', 'Technology', 'Environmental', 'Construction', 'Scientific Method'],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    link: '/blog/nammu-soil-analysis-research'
  },
  {
    title: 'my random thoughts this week',
    date: 'August 03, 2025',
    excerpt: 'From surgical robots to satellite internet - a week of fascinating tech developments that caught my attention. Da Vinci Xi robot specifics, T&T policy impacts, and the power vs environment dilemma.',
    tags: ['Technology', 'Healthcare', 'Robotics', 'Trade Policy', 'Renewable Energy', 'India Economy', 'News Analysis'],
    image: 'https://picsum.photos/800/400?random=tech',
    link: '/blog/my-random-thoughts-this-week'
  },
  {
    title: 'Nepal Journeys: An Annapurna Circuit Adventure',
    date: 'July 27, 2025',
    excerpt: 'Our incredible journey through Nepal centered on the Annapurna Circuit trail, a challenging yet rewarding trek spanning approximately 120km from Phedi to Tatopani.',
    tags: ['Adventure', 'Trekking', 'Nepal', 'Annapurna', 'Travel', 'Mountains'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    link: '/blog/nepal-annapurna-circuit'
  },
  {
    title: 'Memory Evolution: From Human Moments to AI Memories',
    date: 'July 26, 2025',
    excerpt: 'Reflecting on how personal memories and AI memory systems are evolving side by side, from emotional moments to digital recollections. Includes a real AI-generated video memory.',
    tags: ['AI Memory', 'Technology Evolution', 'Human Memory', 'Nostalgia', 'Personal Reflection'],
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    link: '/blog/memory-evolution'
  },
  {
    title: 'Applying the Robinson Method: A Guide to Using Active Reading and Mastering Lifelong Learning',
    date: 'July 26, 2025',
    excerpt: 'Notes from Andréia Ramos\' book on the SQ3R method - an active reading technique developed by Francis P. Robinson in 1946 for enhanced comprehension and retention.',
    tags: ['Learning', 'SQ3R Method', 'Active Reading', 'Study Techniques', 'Education'],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    link: '/blog/applying-robinson-method'
  },
  {
    title: 'Feynman Techniques: Learning Like Richard Feynman',
    date: 'July 19, 2025',
    excerpt: 'How the Nobel Prize-winning physicist\'s simple approach to learning can transform your understanding of any subject. The Feynman Technique explained.',
    tags: ['Learning', 'Feynman Technique', 'Education', 'Physics', 'Teaching'],
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    link: '/blog/feynman-technique'
  },
  {
    title: 'Ekadasi morphs into IF and now Autophagy!',
    date: 'July 19, 2025',
    excerpt: 'How ancient fasting traditions align with modern science on cellular health and metabolic wellness. From Ekadasi to intermittent fasting to autophagy.',
    tags: ['Fasting', 'Autophagy', 'Intermittent Fasting', 'Ekadasi', 'Health', 'Wellness'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    link: '/blog/autophagy'
  },
  {
    title: 'Started to Kindle Again',
    date: 'July 11, 2025',
    excerpt: 'Returning to focused reading and discovering the power of dopamine detox. A personal journey back to deep reading and sustained attention.',
    tags: ['Kindle', 'Dopamine Detox', 'Digital Wellness', 'Focus', 'Reading'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    link: '/blog/started-to-kindle-again'
  },
  {
    title: 'Price/cost of essentials in places our folks live now',
    date: 'July 9, 2025',
    excerpt: 'Compare cost of living, taxes, and healthcare across major global cities with a compact master view.',
    tags: ['Cost of Living', 'Taxes', 'Healthcare', 'Global Cities'],
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    link: '/blog/price-parity'
  },
  {
    title: 'Acronym Soup Revisited: From FANG to the Magnificent 7',
    date: 'July 5, 2025',
    excerpt: 'From FANG to Magnificent 7: how tech\'s power list evolved and what it means for investors and everyday users.',
    tags: ['Tech Trends', 'Magnificent 7', 'FAANG', 'MAAMA'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    link: '/blog/acronym-soup-revisited-2025'
  },
  {
    title: "Hope this gets implemented sooner in India: Microsoft's MAI-DxO Revolution",
    date: "July 4, 2025",
    excerpt: "Microsoft's MAI-DxO achieves 85.5% diagnostic accuracy compared to 20% for human doctors, while reducing costs by 20%. Here's why India needs this breakthrough technology now.",
    tags: ["Microsoft AI", "MAI-DxO", "Medical AI", "Healthcare India", "Diagnostic AI", "Human-in-Loop"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    link: "/blog/microsoft-mai-dx-india"
  },
  {
    title: "Very Compelling India Story: How Millennials Are Powering the SIP Revolution",
    date: "June 28, 2025",
    excerpt: "A look at how India's millennials are driving record SIP inflows, with the latest numbers and a visual chart of the growth.",
    tags: ["Personal Finance", "SIP", "Millennials", "India Growth"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    link: "/blog/compelling-india-story"
  },
  {
    title: "My Fascination with Shortcuts: The Art of Keyboard Navigation",
    date: "June 27, 2025",
    excerpt: "Why keyboard shortcuts feel like a superpower and how they've become second nature to me. Plus, interactive flashcards to master them yourself!",
    tags: ["Productivity", "Vim", "macOS", "Browser", "Keyboard Shortcuts"],
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    link: "/blog/my-fascination-with-shortcuts"
  },
  {
    title: "Building a NewsAPI MCP Server with Cursor",
    date: "June 21, 2025",
    excerpt: "A practical guide to creating an MCP server for news aggregation and integrating it with Cursor IDE for enhanced development workflows.",
    tags: ["MCP", "Cursor IDE", "NewsAPI", "Node.js", "Netlify"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    link: "/blog/building-mcp-server-with-cursor"
  },
  {
    title: "Andrej Karpathy's Y Combinator AI Startup School: The Electricity Analogy",
    date: 'June 20, 2025',
    excerpt: 'How Andrej Karpathy\'s revolutionary "LLMs are like electricity" analogy is reshaping our understanding of AI\'s role in the modern world.',
    tags: ['AI', 'Andrej Karpathy', 'Y Combinator', 'LLMs', 'Electricity Analogy'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    link: '/blog/andrej-karpathy-yc-ai-startup-school'
  },
  {
    title: 'My Experience with the stock market API: Building a Mutual Fund Performance Tracker',
    date: 'June 18, 2025',
    excerpt: 'A dive into integrating LLMs and specialized APIs for personal finance. How I built a unified mutual fund tracker using GPT-4o and indianapi.in.',
    tags: ['API', 'LLM', 'Mutual Funds', 'Personal Finance', 'Data Integration', 'GPT-4o'],
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    link: '/blog/experience-using-api-in-ai-code-editor'
  },
  {
    title: 'My Experience with Windsurf',
    date: 'June 17, 2025',
    excerpt: 'A detailed account of my experience using Windsurf, the AI coding assistant, for my web development projects.',
    tags: ['AI Coding', 'Windsurf', 'Developer Tools', 'Productivity'],
    image: 'https://picsum.photos/800/400?random=5',
    link: '/blog/my-experience-with-windsurf'
  },
  {
    title: 'Building My Personal Portfolio Website',
    date: 'June 16, 2025',
    excerpt: 'A detailed look at building my portfolio website with React, Tailwind CSS, and modern web technologies.',
    tags: ['React', 'Web Development', 'Portfolio', 'Frontend'],
    image: 'https://picsum.photos/800/400?random=4',
    link: '/blog/portfolio-website'
  },
  {
    title: 'Building a Spine Implant Market Analytics Dashboard',
    date: 'June 15, 2025',
    excerpt: 'A deep dive into creating a comprehensive analytics dashboard for the spine implant market in India using React and Next.js.',
    tags: ['React', 'Next.js', 'Data Visualization', 'Medical Analytics'],
    image: 'https://picsum.photos/800/400?random=1',
    link: '/blog/spine-implant-dashboard'
  },
  {
    title: 'Smart Drug Suggestion App: Architecture and Implementation',
    date: 'June 14, 2025',
    excerpt: 'Exploring the architecture and key features of a modern drug suggestion application built with React and TypeScript.',
    tags: ['React', 'TypeScript', 'AI', 'Pharmaceutical'],
    image: 'https://picsum.photos/800/400?random=2',
    link: '/blog/drug-suggestion-app'
  },
  /* {
    title: 'Optimizing React Applications for Performance',
    date: 'March 30, 2025',
    excerpt: 'Best practices and techniques for optimizing React applications to deliver better performance and user experience.',
    tags: ['React', 'Performance', 'Optimization'],
    image: 'https://picsum.photos/800/400?random=3',
    link: '/blog/react-performance'
  } */
]

const Blog = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-12">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
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
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
  )
}

export default Blog
