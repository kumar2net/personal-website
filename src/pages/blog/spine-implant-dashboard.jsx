import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const SpineImplantDashboardPost = () => {
  const _location = useLocation();
  const navigate = useNavigate();

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
          <svg
            className="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blog
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-6">
        Building a Spine Implant Market Analytics Dashboard
      </h1>
      <div className="flex items-center text-gray-600 mb-8">
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
        <span>May 20, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Introduction</h2>
          <p>
            The Spine Implant Market Analytics Dashboard is a powerful
            React-based application that provides deep insights into the spine
            implant market in India. This article explores the architecture,
            features, and technical implementation of this sophisticated
            analytics platform.
          </p>

          <h2>Technical Stack</h2>
          <h3>Core Technologies</h3>
          <ul className="list-disc list-inside">
            <li>React v18.x</li>
            <li>Next.js v14.x</li>
            <li>Recharts v2.x</li>
            <li>Tailwind CSS</li>
          </ul>

          <h3>Architecture</h3>
          <p>The dashboard follows a modern micro-frontend architecture:</p>
          <ul className="list-disc list-inside">
            <li>Data Layer - REST API integration and data processing</li>
            <li>Visualization Layer - Interactive charts and graphs</li>
            <li>UI Layer - Responsive components and layouts</li>
            <li>Analytics Layer - Market trend analysis</li>
          </ul>

          <h2>Key Features</h2>
          <h3>Market Analytics</h3>
          <ul className="list-disc list-inside">
            <li>Yearly, quarterly, and monthly views</li>
            <li>Market size and growth rate analysis</li>
            <li>Procedure volume tracking</li>
            <li>Market share visualization</li>
          </ul>

          <h3>Data Visualization</h3>
          <p>Leveraging Recharts for sophisticated visualizations:</p>
          <ul className="list-disc list-inside">
            <li>Interactive line charts</li>
            <li>Stacked bar charts</li>
            <li>Pie charts for market share</li>
            <li>Heatmaps for regional analysis</li>
          </ul>

          <h3>Healthcare Provider Analytics</h3>
          <ul className="list-disc list-inside">
            <li>Surgeon performance metrics</li>
            <li>Hospital procedure volume analysis</li>
            <li>Provider market share</li>
            <li>Procedure success rates</li>
          </ul>

          <h2>Technical Implementation</h2>
          <h3>Data Integration</h3>
          <p>The dashboard integrates data from multiple sources:</p>
          <ul className="list-disc list-inside">
            <li>Market research reports</li>
            <li>Healthcare registry data</li>
            <li>Hospital performance metrics</li>
            <li>Procedure volume statistics</li>
          </ul>

          <h3>Performance Optimization</h3>
          <p>Key performance optimizations include:</p>
          <ul className="list-disc list-inside">
            <li>Lazy loading of components</li>
            <li>Data caching strategies</li>
            <li>Code splitting</li>
            <li>Optimized chart rendering</li>
          </ul>

          <h2>Deployment</h2>
          <h3>Infrastructure</h3>
          <ul className="list-disc list-inside">
            <li>Netlify for hosting</li>
            <li>Automated deployment pipeline</li>
            <li>CI/CD integration</li>
            <li>Performance monitoring</li>
          </ul>

          <h2>Future Enhancements</h2>
          <ul className="list-disc list-inside">
            <li>Real-time data updates</li>
            <li>AI-powered predictions</li>
            <li>Mobile app integration</li>
            <li>Advanced analytics features</li>
          </ul>

          <h2>Conclusion</h2>
          <p>
            The Spine Implant Market Analytics Dashboard represents a
            cutting-edge solution for healthcare market analysis. Its
            combination of modern web technologies and sophisticated data
            visualization makes it an invaluable tool for healthcare
            professionals and market analysts in the spine implant industry.
          </p>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              React
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Next.js
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Data Visualization
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Medical Analytics
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpineImplantDashboardPost;
