import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogComments from '../../components/BlogComments';

const SemanticSearchExplained = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);

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
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
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
        Search Explained: How Semantic Search Transforms Content Discovery
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
          />
        </svg>
        <span>September 06, 2025</span>
        <span className="mx-2">•</span>
        <span>8 min read</span>
      </div>

      {/* Topic badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Technology
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          AI
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Search
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          Machine Learning
        </span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          Web Development
        </span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          User Experience
        </span>
      </div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              Discover how semantic search goes beyond keyword matching to understand meaning, 
              context, and intent - transforming how we find relevant content online
            </p>
          </header>

          {/* Technology badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <img
              loading="lazy"
              decoding="async"
              src="https://img.shields.io/badge/Google_Gemini-AI_Embeddings-4285F4?style=for-the-badge&logo=google&logoColor=white"
              alt="Google Gemini AI"
            />
            <img
              loading="lazy"
              decoding="async"
              src="https://img.shields.io/badge/Vertex_AI-Vector_Search-FF6B6B?style=for-the-badge&logo=google-cloud&logoColor=white"
              alt="Vertex AI Vector Search"
            />
            <img
              loading="lazy"
              decoding="async"
              src="https://img.shields.io/badge/Netlify-Functions-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"
              alt="Netlify Functions"
            />
            <img
              loading="lazy"
              decoding="async"
              src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white"
              alt="React Frontend"
            />
          </div>

          {/* Hero Image */}
          <div className="mb-10">
            <img
              loading="lazy"
              decoding="async"
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
              alt="Data visualization and search analytics"
              className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/1200x400/1E40AF/ffffff?text=Semantic+Search+Technology';
              }}
            />
            <p className="text-sm text-gray-500 text-center mt-2">
              Photo by{' '}
              <a
                href="https://unsplash.com/@lukechesser"
                className="underline hover:text-gray-700"
              >
                Luke Chesser
              </a>{' '}
              on{' '}
              <a
                href="https://unsplash.com"
                className="underline hover:text-gray-700"
              >
                Unsplash
              </a>
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              What is Semantic Search?
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Traditional search engines rely on keyword matching - they look for exact words or phrases 
              in your query within the content. Semantic search, however, understands the <strong>meaning</strong> 
              and <strong>context</strong> behind your search terms, even when the exact words don't appear in the content.
            </p>
            
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Think of it this way: if you search for "where to invest" using traditional search, it would only 
              find content that contains those exact words. But semantic search understands that you're looking 
              for information about investment strategies, financial planning, market analysis, portfolio management, 
              or economic opportunities - even if the content uses different terminology.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">
                🧠 The Key Difference
              </h3>
              <div className="text-blue-700">
                <p className="mb-2">
                  <strong>Traditional Search:</strong> "Show me content with these exact words"
                </p>
                <p>
                  <strong>Semantic Search:</strong> "Show me content that means the same thing"
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              How Our Semantic Search Works
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Our implementation uses a sophisticated pipeline powered by Google's AI technology:
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  1. Content Indexing
                </h3>
                <p className="text-gray-700 mb-3">
                  All blog posts are processed and converted into numerical vectors (embeddings) using 
                  Google's Gemini <code className="bg-gray-100 px-2 py-1 rounded">text-embedding-004</code> model. 
                  These 768-dimensional vectors capture the semantic meaning of the content.
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                  Blog Post → Text Processing → 768-dimensional Vector
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  2. Query Processing
                </h3>
                <p className="text-gray-700 mb-3">
                  When you enter a search query, it's also converted into the same type of vector using 
                  the same AI model. This ensures your query and the content are in the same "semantic space."
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                  "where to invest" → AI Processing → 768-dimensional Vector
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  3. Similarity Matching
                </h3>
                <p className="text-gray-700 mb-3">
                  The system calculates cosine similarity between your query vector and all content vectors. 
                  Higher similarity scores indicate more semantically related content, regardless of exact word matches.
                </p>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                  Vector Comparison → Cosine Similarity → Ranked Results
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Real Examples: Where to Invest
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Let's see how semantic search handles the query "where to invest" on our site. 
              Even though this exact phrase might not appear in our content, the system understands 
              the semantic relationship and finds relevant posts about financial topics.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-3 text-green-800">
                🔍 Search Query: "where to invest"
              </h3>
              <div className="text-green-700">
                <p className="mb-2">
                  <strong>What the AI understands:</strong> You're looking for information about investment strategies, 
                  financial planning, market analysis, economic opportunities, or portfolio management.
                </p>
                <p>
                  <strong>Expected Results:</strong> Posts about global economic concerns, trade relations, 
                  market analysis, or financial topics would rank highly because they discuss economic factors 
                  and investment-relevant information - even though they don't contain the exact phrase "where to invest."
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The semantic search would likely return posts about economic topics because they discuss:
            </p>

            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6 space-y-2">
              <li>Global economic trends and market conditions</li>
              <li>Trade relations and international commerce</li>
              <li>Economic policy and financial implications</li>
              <li>Market analysis and investment opportunities</li>
              <li>Financial planning and economic forecasting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Another Example: Quality of Life
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Let's explore how semantic search handles a more abstract concept like "quality of life." 
              This query demonstrates the power of understanding context and meaning beyond literal word matches.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">
                🔍 Search Query: "quality of life"
              </h3>
              <div className="text-purple-700">
                <p className="mb-2">
                  <strong>What the AI understands:</strong> You're interested in well-being, life satisfaction, 
                  health, happiness, lifestyle improvements, or factors that affect human flourishing.
                </p>
                <p>
                  <strong>Potential Matches:</strong> Posts about health, wellness, productivity, personal development, 
                  economic factors, technology impact, or lifestyle choices - even if they don't explicitly mention "quality of life."
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Semantic search would find relevant content by understanding concepts like:
            </p>

            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6 space-y-2">
              <li>Health and wellness topics</li>
              <li>Productivity and efficiency improvements</li>
              <li>Economic and social factors</li>
              <li>Technology's impact on daily life</li>
              <li>Personal development and growth</li>
              <li>Environmental and sustainability factors</li>
            </ul>
          </section>


          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Benefits of Semantic Search
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-green-600">
                  ✅ For Users
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Find relevant content even with different terminology</li>
                  <li>• Discover related topics you might not have considered</li>
                  <li>• Get more accurate and comprehensive results</li>
                  <li>• Save time by finding what you actually need</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  ✅ For Content Creators
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Content gets discovered through meaning, not just keywords</li>
                  <li>• Better content engagement and user satisfaction</li>
                  <li>• Reduced bounce rates from irrelevant results</li>
                  <li>• More organic content discovery</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Try It Yourself
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Experience the power of semantic search on our blog! Try these example queries to see how 
              it understands meaning beyond exact word matches:
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                🧪 Test Queries
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">Finance & Economics:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• "where to invest"</li>
                    <li>• "market analysis"</li>
                    <li>• "economic trends"</li>
                    <li>• "financial planning"</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Technology & Development:</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• "quality of life"</li>
                    <li>• "productivity tools"</li>
                    <li>• "web development"</li>
                    <li>• "AI applications"</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Notice how the search results include content that's semantically related to your query, 
              even when the exact words don't appear in the titles or content. This is the power of 
              understanding meaning, not just matching text.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Future of Search
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Semantic search represents a fundamental shift in how we discover and interact with information. 
              As AI technology continues to advance, we can expect even more sophisticated understanding of 
              context, intent, and meaning.
            </p>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-2 text-indigo-800">
                🚀 What's Next?
              </h3>
              <p className="text-indigo-700">
                Future enhancements might include multi-modal search (combining text, images, and audio), 
                personalized results based on user behavior, and even more nuanced understanding of 
                complex queries and conversational search.
              </p>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The implementation on this site demonstrates how modern web applications can leverage 
              cutting-edge AI technology to provide better user experiences. By understanding meaning 
              rather than just matching keywords, semantic search opens up new possibilities for 
              content discovery and knowledge exploration.
            </p>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Technology
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              AI
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Search
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              Machine Learning
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              Web Development
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              User Experience
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <BlogComments
        postSlug="semantic-search-explained"
        postTitle="Search Explained: How Semantic Search Transforms Content Discovery"
      />
    </motion.div>
  );
};

export default SemanticSearchExplained;
