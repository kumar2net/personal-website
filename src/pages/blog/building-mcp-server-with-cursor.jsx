import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BuildingMcpServerWithCursor = () => {
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
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-6">Building a NewsAPI MCP Server with Cursor</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>June 21, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              A practical guide to creating an MCP server for news aggregation and integrating it with Cursor IDE.
            </p>
          </header>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              What is MCP and Why It Matters
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              The Model Context Protocol (MCP) is a standardized way for AI assistants to access external tools and data. 
              Instead of switching between applications, you can now fetch news, analyze data, or interact with APIs 
              directly within your IDE through AI commands.
            </p>
          </section>

          {/* Architecture Diagram */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              System Architecture
            </h2>
            <div className="my-8 p-6 bg-gray-50 rounded-lg">
              <svg width="100%" height="300" viewBox="0 0 800 300" className="w-full">
                <rect width="800" height="300" fill="#f8fafc" rx="8"/>
                
                {/* Cursor IDE */}
                <rect x="50" y="50" width="150" height="80" fill="#3b82f6" rx="8"/>
                <text x="125" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Cursor IDE</text>
                <text x="125" y="90" textAnchor="middle" fill="white" fontSize="10">(MCP Client)</text>
                
                {/* MCP Server */}
                <rect x="300" y="50" width="150" height="80" fill="#f59e0b" rx="8"/>
                <text x="375" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">NewsAPI MCP</text>
                <text x="375" y="90" textAnchor="middle" fill="white" fontSize="10">Server</text>
                
                {/* NewsAPI */}
                <rect x="550" y="50" width="150" height="80" fill="#ef4444" rx="8"/>
                <text x="625" y="75" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">NewsAPI</text>
                <text x="625" y="90" textAnchor="middle" fill="white" fontSize="10">External Service</text>
                
                {/* Web Interface */}
                <rect x="50" y="180" width="150" height="80" fill="#8b5cf6" rx="8"/>
                <text x="125" y="205" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Web Interface</text>
                <text x="125" y="220" textAnchor="middle" fill="white" fontSize="10">Testing & Demo</text>
                
                {/* Arrows */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
                  </marker>
                </defs>
                
                <line x1="200" y1="90" x2="300" y2="90" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="90" x2="550" y2="90" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="200" y1="220" x2="450" y2="90" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              </svg>
            </div>
          </section>

          {/* Implementation */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Implementation Steps
            </h2>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3">1. MCP Server Setup</h3>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Created a Node.js server implementing the MCP specification with three main tools:
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-4 pl-4">
              <li><code>get_top_headlines</code> - Fetch breaking news by country/category</li>
              <li><code>search_news</code> - Search articles with advanced filters</li>
              <li><code>get_sources</code> - Get available news sources</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">2. Cursor Integration</h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <pre className="text-sm overflow-x-auto"><code>{`// cursor-mcp-config.json
{
  "mcpServers": {
    "newsapi": {
      "command": "node",
      "args": ["src/server.js"],
      "env": {
        "NEWS_API_KEY": "your_api_key_here"
      }
    }
  }
}`}</code></pre>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">3. Web Interface</h3>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Built a responsive web interface using vanilla HTML/CSS/JavaScript for testing and demonstration. 
              Features mobile-first design with tabbed interface for different functionalities.
            </p>
          </section>

          {/* Deployment */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Deployment to Netlify
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              Deployed the web interface to Netlify using serverless functions to mirror the MCP server functionality. 
              This provides a public demo while keeping the MCP server secure for local development.
            </p>
            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-4 pl-4">
              <li>Netlify Functions for API endpoints</li>
              <li>Environment variable management</li>
              <li>Automatic deployments from Git</li>
              <li>Mobile-responsive design</li>
            </ul>
          </section>

          {/* Key Benefits */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Key Benefits and Use Cases
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-4 pl-4">
              <li><strong>Seamless Integration:</strong> Access news data without leaving your IDE</li>
              <li><strong>AI-Powered Queries:</strong> Natural language requests for news information</li>
              <li><strong>Real-time Data:</strong> Live news updates through NewsAPI</li>
              <li><strong>Extensible Architecture:</strong> Easy to add more tools and data sources</li>
              <li><strong>Secure Implementation:</strong> API keys managed through environment variables</li>
            </ul>
          </section>

          {/* Challenges */}
          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Challenges and Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-800 mb-2">Challenges</h4>
                <ul className="text-sm text-red-700">
                  <li>• MCP protocol complexity</li>
                  <li>• Environment variable management</li>
                  <li>• Mobile responsiveness</li>
                  <li>• Error handling</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Solutions</h4>
                <ul className="text-sm text-green-700">
                  <li>• Comprehensive documentation study</li>
                  <li>• Multi-environment configuration</li>
                  <li>• Mobile-first CSS approach</li>
                  <li>• Graceful error handling</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">
              Conclusion
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              This project demonstrates the power of MCP in modern development workflows. By creating a custom MCP server, 
              I was able to seamlessly integrate external news data into my development environment, enhancing productivity 
              and providing real-time information access.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              The MCP ecosystem represents the future of AI-assisted development, where external services and data sources 
              become natural extensions of your IDE. This opens up endless possibilities for building more intelligent, 
              context-aware development environments.
            </p>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              MCP
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Cursor IDE
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              NewsAPI
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Node.js
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Netlify
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BuildingMcpServerWithCursor;
