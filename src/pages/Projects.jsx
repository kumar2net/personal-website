import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Spine Implant Market Analytics Dashboard',
    description: 'A comprehensive React-based dashboard for analyzing and visualizing the spine implant market in India. This application provides detailed market insights, trends, and analytics for healthcare professionals and market analysts.',
    tech: ['React', 'Recharts', 'Next.js', 'Tailwind CSS'],
    image: 'https://via.placeholder.com/800x600',
    link: 'https://kumarai.netlify.app',
    features: [
      'Interactive market analytics with yearly, quarterly, and monthly views',
      'Comprehensive market overview including total market size, growth rate, and procedure volume',
      'Advanced data visualization with market share analysis and procedure volume trends',
      'Healthcare provider analytics with surgeon directories and hospital performance metrics',
      'Real-time data integration from multiple sources including market research reports and healthcare registries'
    ],
    highlights: [
      'Built with modern React architecture using Next.js for optimal performance',
      'Integrated Recharts for sophisticated data visualization',
      'Automated deployment pipeline with Netlify',
      'Responsive design that works across all devices',
      'Real-time data processing and validation system'
    ],
    category: 'Medical Analytics',
    impact: 'Providing healthcare professionals with actionable insights into the spine implant market, enabling better decision-making and strategic planning'
  },
  {
    title: 'Smart Drug Suggestion App',
    description: 'A modern, intelligent drug suggestion application that helps users find, compare, and manage medications effectively. Built with React and featuring advanced AI-powered suggestions.',
    tech: ['React', 'TypeScript', 'Material-UI', 'Firebase'],
    image: 'https://via.placeholder.com/800x600',
    link: 'https://kumarai.netlify.app/',
    features: [
      'Real-time drug search with intelligent suggestions based on user history',
      'Comprehensive drug profiles with detailed information including side effects and alternatives',
      'Smart drug interaction checker',
      'Medication reminder system with proactive notifications',
      'Price comparison and alert system',
      'Favorite drugs management and organization'
    ],
    highlights: [
      'Agent-based context system for personalized recommendations',
      'Advanced search algorithms with category and price filtering',
      'Interactive drug cards with smooth animations',
      'Proactive notification system for reminders and price changes',
      'Mobile-first responsive design',
      'AI-powered suggestion engine that learns from user behavior'
    ],
    category: 'Pharmaceutical Management',
    impact: 'Empowering patients and healthcare providers with accurate, personalized medication information and management tools'
  }
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
                <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Project <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <p className="text-gray-600 mb-6">{project.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Impact</h3>
                <p className="text-gray-600">{project.impact}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Technical Highlights</h3>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-start">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
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
      </div>
    </motion.div>
  )
}

export default Projects;
