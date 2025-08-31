import { motion } from 'framer-motion';
import BlogSentimentSummary from '../components/BlogSentimentSummary';

const projects = [
  {
    title: 'Kumar News - News Aggregation Platform',
    description:
      'A comprehensive news aggregation platform that provides real-time news from various categories including technology, business, sports, entertainment, and more. Built with NewsAPI integration to deliver fresh, relevant content to users.',
    tech: ['React', 'Node.js', 'NewsAPI', 'Tailwind CSS', 'Netlify'],
    image:
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    link: 'https://kumarnews.netlify.app',
    features: [
      'Real-time news aggregation from multiple sources via NewsAPI',
      'News categorization by topics (technology, business, sports, etc.)',
      'Responsive design optimized for all devices',
      'Fast loading times with optimized performance',
      'Clean, intuitive user interface for easy navigation',
      'Regular updates with latest news from around the world',
    ],
    highlights: [
      'Built with React for dynamic user experience',
      'Integrated with NewsAPI for comprehensive news coverage',
      'Deployed on Netlify for reliable hosting and fast CDN',
      'Mobile-first responsive design approach',
      'Optimized for search engines and accessibility',
      'Real-time data processing and content management',
    ],
    category: 'News Aggregation',
    impact:
      'Providing users with timely, relevant news from various categories to keep them informed about current events and developments worldwide',
  },
  {
    title: 'MedicineChk App',
    description:
      'The MedicineChk App leverages AI to check interactions between drugs. That used to be my biggest mental block - all these medicines I am being prescribed, are they tested together in a cat or rat, or am I the guinea pig! This app helps identify potential drug interactions using nC2 combinations to ensure safety.',
    tech: [
      'React',
      'Node.js',
      'Express',
      'Machine Learning',
      'Drug Interaction API',
    ],
    image:
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80',
    features: [
      'Drug interaction checking using nC2 combinations',
      'Real-time interaction warnings and severity levels',
      'Privacy-focused - runs locally for data protection',
      'Backend database updates with latest interaction data',
      'Family member testing and validation',
      'Personalized medicine safety recommendations',
    ],
    highlights: [
      'Built with React and Node.js for seamless user experience',
      'Machine learning models for intelligent interaction detection',
      'Privacy-first approach - runs on local machine only',
      'Regular API updates for current drug interaction data',
      'Real-world testing with family members for validation',
      'nC2 algorithm implementation for comprehensive checking',
    ],
    category: 'Healthcare AI',
    impact:
      'Providing peace of mind by checking drug interactions before taking multiple medications, ensuring patient safety through comprehensive interaction analysis.',
  },
];

const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {project.title}
                </h2>
                {project.title !== 'MedicineChk App' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    View Project{' '}
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
              <p className="text-gray-600 mb-6">{project.description}</p>
              {/* Data Flow SVG for MedicineChk App */}
              {project.title === 'MedicineChk App' && (
                <div className="flex justify-center mb-6">
                  <svg
                    width="340"
                    height="70"
                    viewBox="0 0 340 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fontFamily="sans-serif" fontSize="16" fontWeight="bold">
                      <rect
                        x="0"
                        y="10"
                        width="90"
                        height="40"
                        rx="10"
                        fill="#e0f2fe"
                        stroke="#0284c7"
                        strokeWidth="2"
                      />
                      <text
                        x="45"
                        y="35"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="#0369a1"
                      >
                        Client
                      </text>
                      <rect
                        x="125"
                        y="10"
                        width="90"
                        height="40"
                        rx="10"
                        fill="#f1f5f9"
                        stroke="#64748b"
                        strokeWidth="2"
                      />
                      <text
                        x="170"
                        y="35"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="#334155"
                      >
                        Server
                      </text>
                      <rect
                        x="250"
                        y="10"
                        width="90"
                        height="40"
                        rx="10"
                        fill="#fef9c3"
                        stroke="#eab308"
                        strokeWidth="2"
                      />
                      <text
                        x="295"
                        y="35"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="#b45309"
                      >
                        Database
                      </text>
                      {/* Simple thick lines */}
                      <line
                        x1="90"
                        y1="30"
                        x2="125"
                        y2="30"
                        stroke="#0284c7"
                        strokeWidth="6"
                      />
                      <line
                        x1="215"
                        y1="30"
                        x2="250"
                        y2="30"
                        stroke="#eab308"
                        strokeWidth="6"
                      />
                    </g>
                  </svg>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Impact</h3>
                <p className="text-gray-600">{project.impact}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Technical Highlights
                </h3>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-start">
                      <svg
                        className="w-4 h-4 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Blog Sentiment Analysis ML Use Case */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: projects.length * 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <BlogSentimentSummary />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Projects;
