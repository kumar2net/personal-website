import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'


import DisqusComments from '../../components/DisqusComments';const DrugSuggestionAppPost = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-6">Building a Smart Drug Suggestion Application</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>May 20, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Introduction</h2>
          <p>
            The Smart Drug Suggestion App is a modern, AI-powered application designed to help healthcare professionals and patients make informed decisions about medication. This article explores the architecture, features, and technical implementation of this innovative healthcare solution.
          </p>

          <h2>Technical Stack</h2>
          <h3>Core Technologies</h3>
          <ul className="list-disc list-inside">
            <li>React v18.x</li>
            <li>TypeScript</li>
            <li>Material-UI</li>
            <li>Firebase</li>
            <li>OpenAI API</li>
          </ul>

          <h3>Architecture</h3>
          <p>
            The application follows a robust microservices architecture:
          </p>
          <ul className="list-disc list-inside">
            <li>Frontend - React + TypeScript</li>
            <li>Backend - Firebase Cloud Functions</li>
            <li>AI Layer - OpenAI Integration</li>
            <li>Storage - Firebase Firestore</li>
          </ul>

          <h2>Key Features</h2>
          <h3>Medication Search</h3>
          <ul className="list-disc list-inside">
            <li>Intelligent drug search with autocomplete</li>
            <li>Comprehensive drug database</li>
            <li>Real-time drug interactions</li>
            <li>Price comparison</li>
          </ul>

          <h3>AI-Powered Suggestions</h3>
          <p>
            Leveraging OpenAI for sophisticated drug suggestions:
          </p>
          <ul className="list-disc list-inside">
            <li>Context-aware drug recommendations</li>
            <li>Personalized dosage suggestions</li>
            <li>Side effect prediction</li>
            <li>Drug interaction analysis</li>
          </ul>

          <h3>Prescription Management</h3>
          <ul className="list-disc list-inside">
            <li>Secure prescription storage</li>
            <li>Medication schedule tracking</li>
            <li>Refill reminders</li>
            <li>Prescription history</li>
          </ul>

          <h2>Technical Implementation</h2>
          <h3>Data Integration</h3>
          <p>
            The app integrates multiple data sources:
          </p>
          <ul className="list-disc list-inside">
            <li>Drug databases</li>
            <li>Pharmacy networks</li>
            <li>Healthcare provider APIs</li>
            <li>Insurance provider data</li>
          </ul>

          <h3>Security Features</h3>
          <p>
            Key security measures include:
          </p>
          <ul className="list-disc list-inside">
            <li>End-to-end encryption</li>
            <li>Multi-factor authentication</li>
            <li>Role-based access control</li>
            <li>Compliance with HIPAA</li>
          </ul>

          <h2>Deployment</h2>
          <h3>Infrastructure</h3>
          <ul className="list-disc list-inside">
            <li>Firebase Hosting</li>
            <li>Cloud Functions</li>
            <li>Real-time database</li>
            <li>Automatic scaling</li>
          </ul>

          <h2>Future Enhancements</h2>
          <ul className="list-disc list-inside">
            <li>Mobile app integration</li>
            <li>Advanced AI capabilities</li>
            <li>Telemedicine features</li>
            <li>Health analytics</li>
          </ul>

          <h2>Conclusion</h2>
          <p>
            The Smart Drug Suggestion App represents a significant advancement in healthcare technology. By combining modern web development practices with AI capabilities, it provides a powerful tool for both healthcare professionals and patients to make informed medication decisions.
          </p>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              React
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              TypeScript
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              AI
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Healthcare
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DrugSuggestionAppPost
