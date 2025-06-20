import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const blogPosts = [
  {
    title: "Andrej Karpathy's Y Combinator AI Startup School: The Electricity Analogy",
    date: 'June 20, 2025',
    excerpt: 'How Andrej Karpathy\'s revolutionary "LLMs are like electricity" analogy is reshaping our understanding of AI\'s role in the modern world.',
    tags: ['AI', 'Andrej Karpathy', 'Y Combinator', 'LLMs', 'Electricity Analogy'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    link: '/blog/andrej-karpathy-yc-ai-startup-school'
  },
  {
    title: 'Acronym Soup: The Evolution of Tech\'s Most Influential Companies',
    date: 'June 18, 2025',
    excerpt: 'From FANG to MAAMA: How tech\'s most influential companies shape our digital world. A look at the evolution of tech acronyms and the companies behind them.',
    tags: ['Tech', 'Business', 'FAANG', 'MAAMA', 'Technology Trends'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    link: '/blog/acronym-soup'
  },
  {
    title: 'My Experience with the stock market API: Building a Mutual Fund Performance Tracker',
    date: 'June 14, 2025',
    excerpt: 'A dive into integrating LLMs and specialized APIs for personal finance. How I built a unified mutual fund tracker using GPT-4o and indianapi.in.',
    tags: ['API', 'LLM', 'Mutual Funds', 'Personal Finance', 'Data Integration', 'GPT-4o'],
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    link: '/blog/experience-using-api-in-ai-code-editor'
  },
  {
    title: 'My Experience with Windsurf',
    date: 'June 04, 2025',
    excerpt: 'A detailed account of my experience using Windsurf, the AI coding assistant, for my web development projects.',
    tags: ['AI Coding', 'Windsurf', 'Developer Tools', 'Productivity'],
    image: 'https://picsum.photos/800/400?random=5',
    link: '/blog/my-experience-with-windsurf'
  },
  {
    title: 'Building My Personal Portfolio Website',
    date: 'June 3, 2025',
    excerpt: 'A detailed look at building my portfolio website with React, Tailwind CSS, and modern web technologies.',
    tags: ['React', 'Web Development', 'Portfolio', 'Frontend'],
    image: 'https://picsum.photos/800/400?random=4',
    link: '/blog/portfolio-website'
  },
  {
    title: 'Building a Spine Implant Market Analytics Dashboard',
    date: 'May 31, 2025',
    excerpt: 'A deep dive into creating a comprehensive analytics dashboard for the spine implant market in India using React and Next.js.',
    tags: ['React', 'Next.js', 'Data Visualization', 'Medical Analytics'],
    image: 'https://picsum.photos/800/400?random=1',
    link: '/blog/spine-implant-dashboard'
  },
  {
    title: 'Smart Drug Suggestion App: Architecture and Implementation',
    date: 'May 30, 2025',
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
