import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BlogSentimentSummary from "../components/BlogSentimentSummary";

const projects = [
  {
    title: "AI-Powered Blog Content Recommender",
    description: (
      <div>
        <p className="mb-4">
          This Python script analyzes Google Analytics 4 (GA4) data from
          BigQuery to recommend new blog topics. It uses machine learning to
          identify content themes, analyze user behavior, and generate three
          types of recommendations: content-based, trending, and personalized.
        </p>
        <h4 className="font-semibold text-lg mb-2">How it Works:</h4>
        <p className="mb-4">
          The system fetches page view data, processes the blog titles using
          TF-IDF to understand their content, and then applies K-Means
          clustering to group similar posts into themes. By analyzing user
          interaction data, it also identifies trending topics and individual
          user preferences to provide tailored suggestions.
        </p>
        <h4 className="font-semibold text-lg mb-2">Data Flow Diagram:</h4>
        <div className="flex justify-center my-4">
          <svg
            width="100%"
            viewBox="0 0 600 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fontFamily="sans-serif" fontSize="14" fontWeight="bold">
              {/* Nodes */}
              <rect
                x="10"
                y="50"
                width="120"
                height="50"
                rx="10"
                fill="#e0f2fe"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <text x="70" y="75" textAnchor="middle" fill="#0369a1">
                GA4 BigQuery
              </text>

              <rect
                x="170"
                y="50"
                width="120"
                height="50"
                rx="10"
                fill="#f1f5f9"
                stroke="#64748b"
                strokeWidth="2"
              />
              <text x="230" y="75" textAnchor="middle" fill="#334155">
                Python Script
              </text>

              <rect
                x="330"
                y="10"
                width="120"
                height="50"
                rx="10"
                fill="#dcfce7"
                stroke="#16a34a"
                strokeWidth="2"
              />
              <text x="390" y="35" textAnchor="middle" fill="#15803d">
                TF-IDF & KMeans
              </text>

              <rect
                x="330"
                y="90"
                width="120"
                height="50"
                rx="10"
                fill="#dcfce7"
                stroke="#16a34a"
                strokeWidth="2"
              />
              <text x="390" y="115" textAnchor="middle" fill="#15803d">
                User Analysis
              </text>

              <rect
                x="490"
                y="50"
                width="100"
                height="50"
                rx="10"
                fill="#fef9c3"
                stroke="#eab308"
                strokeWidth="2"
              />
              <text x="540" y="75" textAnchor="middle" fill="#b45309">
                Topics
              </text>

              {/* Arrows */}
              <path
                d="M130 75 L160 75"
                stroke="#64748b"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <path
                d="M290 65 L320 45"
                stroke="#16a34a"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <path
                d="M290 85 L320 105"
                stroke="#16a34a"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <path
                d="M450 45 L480 65"
                stroke="#eab308"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
              <path
                d="M450 105 L480 85"
                stroke="#eab308"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            </g>
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
            </defs>
          </svg>
        </div>
        <h4 className="font-semibold text-lg mb-2">
          Machine Learning Models Used:
        </h4>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>TF-IDF (Term Frequency-Inverse Document Frequency):</strong>{" "}
            Converts text from blog titles into numerical vectors, allowing the
            machine to understand content similarity.
          </li>
          <li>
            <strong>K-Means Clustering:</strong> An unsupervised algorithm that
            groups the vectorized titles into clusters based on their content,
            revealing underlying themes.
          </li>
        </ul>
        <h4 className="font-semibold text-lg mb-2">Code Snippet:</h4>
        <div className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          <pre>
            <code>
              {`# Vectorize existing content titles for similarity analysis
self.content_vectors = self.content_vectorizer.fit_transform(unique_topics)

# Use K-means clustering to find content themes
n_clusters = min(3, len(self.blog_topics))
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
cluster_labels = kmeans.fit_predict(self.content_vectors)`}
            </code>
          </pre>
        </div>

        <h4 className="font-semibold text-lg mt-6 mb-2">
          Live Output from the Recommender:
        </h4>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="mb-4">
            <h5 className="font-bold text-md mb-2">🔥 Most Popular Topics</h5>
            <ul className="list-disc list-inside text-slate-700">
              <li>My Stories: 347 interactions</li>
              <li>Blog | Kumar's Personal Website: 244 interactions</li>
              <li>My Stories | Kumar's Personal Website: 89 interactions</li>
              <li>
                My Reminiscences - Kumar's Personal Website: 57 interactions
              </li>
              <li>Books | Kumar's Personal Website: 39 interactions</li>
            </ul>
          </div>

          <div className="mb-4">
            <h5 className="font-bold text-md mb-2">
              💡 Content-Based Recommendations
            </h5>
            <ul className="list-disc list-inside text-slate-700">
              <li>AI Ethics and Responsible Development</li>
              <li>API Development with FastAPI</li>
              <li>Building Scalable Machine Learning Pipelines</li>
              <li>Understanding Large Language Models</li>
              <li>Modern JavaScript Frameworks Comparison</li>
            </ul>
          </div>

          <div className="mb-4">
            <h5 className="font-bold text-md mb-2">
              🔥 Trending Recommendations
            </h5>
            <ul className="list-disc list-inside text-slate-700">
              <li>Advanced Guide to My Stories</li>
              <li>Advanced Guide to Blog | Kumar's Personal Website</li>
              <li>Advanced Guide to My Stories | Kumar's Personal Website</li>
              <li>Generative AI for Content Creation</li>
              <li>Kubernetes for Beginners</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-md mb-2">
              👤 Personalized Recommendations for User 822094028.1761481696
            </h5>
            <ul className="list-disc list-inside text-slate-700">
              <li>API Development with FastAPI</li>
              <li>Deep Learning with TensorFlow 2024</li>
              <li>Prompt Engineering for Better AI Results</li>
              <li>Web Performance Optimization</li>
              <li>Progressive Web Apps Development</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    tech: ["Python", "BigQuery", "Pandas", "Scikit-learn", "Plotly"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    link: "/projects/ai-recommender-code",
    features: [
      "Connects to Google BigQuery to fetch GA4 data.",
      "Analyzes page view events from the last 21 days.",
      "Uses TF-IDF to vectorize blog post titles.",
      "Applies K-Means clustering to identify content themes.",
      "Generates content-based, trending, and personalized topic recommendations.",
      "Creates a word cloud visualization of popular topics.",
    ],
    highlights: [
      "Classic machine learning, not deep learning, is used for efficiency.",
      "TF-IDF for feature extraction from text data.",
      "K-Means for unsupervised content clustering.",
      "Direct integration with Google Cloud Platform services.",
      "Combines content analysis with user behavior for better recommendations.",
    ],
    category: "Machine Learning",
    impact:
      "Provides data-driven insights for content strategy by automatically generating relevant and engaging blog topic ideas based on real user data.",
  },
  {
    title: "Kumar News - News Aggregation Platform",
    description: (
      <div>
        <p className="mb-4">
          Kumar News is a comprehensive aggregation platform that surfaces
          real-time stories from across technology, business, sports,
          entertainment, and more. It builds on a NewsAPI integration to keep
          readers informed with fresh, relevant updates.
        </p>
        <p>
          Users can explore category-specific feeds, scan headlines quickly, and
          dive into full articles with a clean, responsive interface designed
          for desktop and mobile alike.
        </p>
      </div>
    ),
    tech: ["React", "Netlify", "Tailwind CSS", "NewsAPI"],
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    link: "/news",
    features: [
      "Real-time news aggregation from multiple sources via NewsAPI",
      "News categorization by topics (technology, business, sports, etc.)",
      "Responsive design optimized for all devices",
      "Fast loading times with optimized performance",
      "Clean, intuitive user interface for easy navigation",
      "Regular updates with latest news from around the world",
    ],
    highlights: [
      "Built with React for dynamic user experience",
      "Integrated with NewsAPI for comprehensive news coverage",
      "Deployed on Netlify for reliable hosting and fast CDN",
      "Mobile-first responsive design approach",
      "Optimized for search engines and accessibility",
      "Real-time data processing and content management",
    ],
    category: "News Aggregation",
    impact:
      "Keeps readers informed with timely, relevant stories across key categories through a single destination.",
  },
  {
    title: "MedicineChk App",
    description:
      "The MedicineChk App leverages AI to check interactions between drugs. That used to be my biggest mental block - all these medicines I am being prescribed, are they tested together in a cat or rat, or am I the guinea pig! This app helps identify potential drug interactions using nC2 combinations to ensure safety.",
    tech: [
      "React",
      "Node.js",
      "Express",
      "Machine Learning",
      "Drug Interaction API",
    ],
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80",
    features: [
      "Drug interaction checking using nC2 combinations",
      "Real-time interaction warnings and severity levels",
      "Privacy-focused - runs locally for data protection",
      "Backend database updates with latest interaction data",
      "Family member testing and validation",
      "Personalized medicine safety recommendations",
    ],
    highlights: [
      "Built with React and Node.js for seamless user experience",
      "Machine learning models for intelligent interaction detection",
      "Privacy-first approach - runs on local machine only",
      "Regular API updates for current drug interaction data",
      "Real-world testing with family members for validation",
      "nC2 algorithm implementation for comprehensive checking",
    ],
    category: "Healthcare AI",
    impact:
      "Providing peace of mind by checking drug interactions before taking multiple medications, ensuring patient safety through comprehensive interaction analysis.",
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
              </div>
              <div className="text-gray-600 mb-6">{project.description}</div>
              {project.link && (
                <div className="mb-6">
                  {project.link.startsWith("http") ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View Project
                    </a>
                  ) : (
                    <Link
                      to={project.link}
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View Project
                    </Link>
                  )}
                </div>
              )}
              {/* Data Flow SVG for MedicineChk App */}
              {project.title === "MedicineChk App" && (
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
