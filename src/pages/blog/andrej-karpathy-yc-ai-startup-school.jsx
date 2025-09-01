import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import GraphRecommendations from '../../components/GraphRecommendations';

const AndrejKarpathyYcAiStartupSchool = () => {
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
        Andrej Karpathy's Y Combinator AI Startup School: The Electricity
        Analogy
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
        <span>June 20, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          {/* Paragraph 1: Introduction */}
          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              In his compelling lecture at Y Combinator's AI Startup School,
              Andrej Karpathy delivered one of the most powerful analogies in AI
              discourse: <strong>"LLMs are like electricity."</strong> As the
              former Director of AI at Tesla and a key figure in the development
              of large language models, Karpathy's insights carry significant
              weight in the AI community. This simple yet profound comparison
              has fundamentally changed how we think about artificial
              intelligence and its potential impact on society, shifting our
              perspective from viewing AI as a collection of specific
              technologies to understanding it as a fundamental capability that
              will enhance every aspect of our digital lives.
            </p>
          </section>

          {/* Paragraph 2: Foundation Models Landscape with SVG */}
          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The foundation of this "AI electricity" lies in the four major
              foundational LLM models that power today's AI ecosystem. These
              models form the infrastructure layer that enables countless
              applications, much like how electrical power plants provide the
              foundation for all electrical devices.
            </p>
            {/* SVG Image of the 4 LLM Models */}
            <div className="my-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-center mb-6">
                The Foundation Models: AI's Power Grid
              </h3>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                {/* ChatGPT */}
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-lg">GPT</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    ChatGPT
                  </span>
                  <span className="text-xs text-gray-500">OpenAI</span>
                </div>
                {/* Gemini */}
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Gemini
                  </span>
                  <span className="text-xs text-gray-500">Google</span>
                </div>
                {/* Claude */}
                <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Claude
                  </span>
                  <span className="text-xs text-gray-500">Anthropic</span>
                </div>
                {/* Llama */}
                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Llama
                  </span>
                  <span className="text-xs text-gray-500">Meta</span>
                </div>
              </div>
            </div>
          </section>

          {/* Paragraph 3: Key Insights & Opportunities */}
          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Karpathy's analogy has profound implications for how entrepreneurs
              should approach AI opportunities. The most successful AI companies
              won't be those building the "electricity" (the LLMs themselves),
              but those building the "appliances" that use it. This shift in
              perspective opens up numerous strategic opportunities for startups
              and established companies alike.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">
                Key Insights for AI Entrepreneurs:
              </h3>
              <ul className="space-y-2 text-blue-700">
                <li>
                  • <strong>Focus on applications, not infrastructure:</strong>{' '}
                  Build tools that use existing LLMs rather than creating new
                  foundation models
                </li>
                <li>
                  • <strong>Vertical-specific solutions:</strong> Target
                  specific industries like healthcare, finance, or manufacturing
                  with tailored AI applications
                </li>
                <li>
                  • <strong>The interface layer is crucial:</strong> Create
                  intuitive ways for users to interact with AI capabilities
                </li>
                <li>
                  • <strong>Data quality over model sophistication:</strong>{' '}
                  Invest in clean, well-labeled training data
                </li>
                <li>
                  • <strong>Build for production from day one:</strong> Design
                  systems with scalability, reliability, and cost considerations
                  in mind
                </li>
              </ul>
            </div>
          </section>

          {/* Paragraph 4: The Dark Side - Hallucination & Gaslighting */}
          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              However, Karpathy didn't shy away from addressing the darker
              aspects of AI technology. He discussed two critical challenges
              that every AI entrepreneur must confront: hallucination and
              gaslighting. These issues represent significant barriers to
              widespread AI adoption and trust.
            </p>
            <div className="bg-red-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-red-800">
                The Dark Side of AI:
              </h3>
              <ul className="space-y-2 text-red-700">
                <li>
                  • <strong>Hallucination Problem:</strong> LLMs confidently
                  making up facts and information that sound plausible
                </li>
                <li>
                  • <strong>Gaslighting Behavior:</strong> AI presenting false
                  information as true, even when contradicted
                </li>
                <li>
                  • <strong>Impact on Trust:</strong> These issues undermine
                  confidence in AI systems and decision-making
                </li>
                <li>
                  • <strong>Mitigation Strategies:</strong> Fact-checking
                  systems, confidence scoring, and human oversight
                </li>
                <li>
                  • <strong>Karpathy's Perspective:</strong> These are
                  fundamental challenges that require ongoing research and
                  careful system design
                </li>
              </ul>
            </div>
          </section>

          {/* Paragraph 5: Future & Conclusion */}
          <section>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Looking toward the future, Karpathy's vision extends beyond
              current limitations to a world where AI becomes as ubiquitous and
              reliable as electricity. The transformation will be gradual but
              profound, requiring patience, strategic thinking, and a deep
              understanding of both AI's capabilities and its limitations.
            </p>
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-green-800">
                Emerging Trends & Future Outlook:
              </h3>
              <ul className="space-y-2 text-green-700">
                <li>
                  • <strong>Multimodal AI:</strong> Models that can process
                  text, images, audio, and video together
                </li>
                <li>
                  • <strong>Smaller, Efficient Models:</strong> AI that can run
                  on edge devices and consumer hardware
                </li>
                <li>
                  • <strong>Specialized Applications:</strong> AI systems
                  designed for specific domains and use cases
                </li>
                <li>
                  • <strong>Long-term Transformation:</strong> AI will take
                  decades to fully transform society, similar to electricity
                </li>
                <li>
                  • <strong>Entrepreneurial Approach:</strong> Focus on building
                  practical solutions that solve real problems
                </li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-yellow-800">
                Final Thought
              </h3>
              <p className="text-yellow-700">
                "Just as we don't think about electricity when we use our phones
                or computers, we won't think about AI when we use the
                applications it powers. The most successful companies will be
                those that make AI invisible and indispensable."
              </p>
            </div>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              AI
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Andrej Karpathy
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Y Combinator
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              LLMs
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Electricity Analogy
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              AI Infrastructure
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Entrepreneurship
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Hallucination
            </span>
          </div>
        </div>

        {/* Neural Graph Recommendations */}
        {/* <div className="mt-12">
          <GraphRecommendations 
            currentPostId="andrej-karpathy-yc-ai-startup-school" 
            maxRecommendations={5} 
          />
        </div> */}
      </div>

      {/* Blog interactions */}
          </motion.div>
  );
};

export default AndrejKarpathyYcAiStartupSchool;
