import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import BlogSentimentSummary from "../components/BlogSentimentSummary";
import { appleMiniHomeAutomationBom } from "../data/appleMiniHomeAutomationBom";
import homeAutomationDesignRaw from "../../../../docs/HOME_AUTOMATION_APPLE_MINI_OPENCLAW.md?raw";

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
    title: "Kumar Newssearch",
    description: (
      <div>
        <p className="mb-4">
          Kumar Newssearch focuses on one job: helping me track the niches I
          care about. I can enter the topics I am following as a comma-separated
          list, and the app instantly fetches the latest headlines for each
          interest.
        </p>
        <p>
          Because the search list persists locally, I can close the tab and come
          back later to pick up exactly where I left off. No feeds to wade
          through—just the stories tied to the topics I told it to watch.
        </p>
      </div>
    ),
    tech: ["React", "Vercel", "Tailwind CSS", "NewsAPI"],
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    link: "https://news.kumar2net.com",
    features: [
      "Newssearch experience driven by comma-separated topic input",
      "Persists saved interests locally so they are ready on return visits",
      "Instantly fetches fresh headlines for the topics I am tracking",
      "Responsive Tailwind CSS layout that keeps the search front and center",
      "Deployed on Vercel for fast, globally cached responses",
      "Single-page focus that keeps the interface minimal and distraction-free",
    ],
    highlights: [
      "React hooks parse and normalize comma-separated topics before querying",
      "Browser storage keeps the topic list synchronized across sessions",
      "Migrated from Netlify to Vercel for better DX and edge performance",
      "Lightweight integration with NewsAPI powers the search results",
      "Tailwind CSS utilities keep the UI consistent on any screen",
      "Lean client-side architecture keeps load times snappy",
    ],
    category: "News Aggregation",
    impact:
      "Provides a personalized news starting point by remembering my topic list and surfacing the latest coverage on demand.",
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

const homeAutomationDesignMarkdown = homeAutomationDesignRaw
  .split("\n")
  .filter((line) => {
    const trimmed = line.trim();
    if (trimmed === "# Apple Mini Home Automation Design") {
      return false;
    }
    if (trimmed === "## Network Diagram" || trimmed === "## Schematic Diagram") {
      return false;
    }
    if (trimmed.startsWith("![Apple mini home automation")) {
      return false;
    }
    return true;
  })
  .join("\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const futureProjects = [
  {
    title: "Apple Mini Home Automation Control Plane",
    summary:
      "A planned Wi-Fi-first whole-home automation system built around a Mac mini running kumclaw and Home Assistant, with OpenAI voice APIs handling speech input, tool calling, and spoken confirmations for lights, BLDC fans, AC units, sensors, and room-level scenes.",
    goals: [
      "Voice-first control using OpenAI Realtime/audio APIs rather than Siri or vendor voice assistants.",
      "Local orchestration on the Mac mini for routines, schedules, and natural-language control.",
      "Safe support for BLDC fan control, split AC automation, and manual wall-switch fallback.",
      "Wi-Fi-only relays, sensors, and room controllers, with IR kept only for legacy AC paths that still need a remote bridge.",
    ],
    stack: [
      "Mac mini",
      "kumclaw",
      "Home Assistant",
      "OpenAI Realtime API",
      "gpt-realtime",
      "gpt-4o-transcribe",
      "gpt-4o-mini-tts",
      "Wi-Fi router",
      "Wi-Fi relays",
      "Wi-Fi sensors",
      "IR bridge",
    ],
    diagrams: [
      {
        title: "Network and control topology",
        src: "/media/generated/home-automation-apple-mini-network.svg",
        alt: "Network diagram for a Wi-Fi-first Mac mini home automation system with OpenAI voice APIs, kumclaw, Home Assistant, and room-level smart devices.",
      },
      {
        title: "Power and wiring schematic",
        src: "/media/generated/home-automation-apple-mini-schematic.svg",
        alt: "Schematic diagram for home automation wiring with lighting relays, BLDC fan controller, AC control, and safety protection devices.",
      },
    ],
    bom: appleMiniHomeAutomationBom,
    notesMarkdown: homeAutomationDesignMarkdown,
  },
];

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatBomCost = (value, fallback) =>
  typeof value === "number" ? inrFormatter.format(value) : fallback;

const getBomScopeClasses = (scope) => {
  if (scope === "Core") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (scope === "Optional") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (scope === "Software") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }
  return "border-slate-200 bg-slate-100 text-slate-700";
};

const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="flex flex-col gap-8">
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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-first space-y-6"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Future Projects
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Planned systems I want to build next
              </h2>
            </div>
          </div>

          {futureProjects.map((project) => (
            <div
              key={project.title}
              className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-amber-50 shadow-lg dark:border-emerald-900/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
            >
              <div className="p-8">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-slate-700">
                      {project.summary}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-emerald-800/60 dark:bg-slate-900/85">
                    Concept stage
                    <div className="mt-1 font-semibold text-emerald-700">
                      Wi-Fi device plan and wiring outline complete
                    </div>
                  </div>
                </div>

                <div className="mb-8 grid gap-4">
                  {project.diagrams.map((diagram) => (
                    <figure
                      key={diagram.src}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                        <figcaption className="text-sm font-semibold text-slate-700">
                          {diagram.title}
                        </figcaption>
                      </div>
                      <img
                        src={diagram.src}
                        alt={diagram.alt}
                        loading="lazy"
                        className="h-full w-full bg-[#f7f5ef] object-contain dark:bg-slate-950"
                      />
                    </figure>
                  ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-slate-900">
                      What this system is meant to do
                    </h4>
                    <ul className="space-y-3">
                      {project.goals.map((goal) => (
                        <li key={goal} className="flex items-start">
                          <svg
                            className="mt-1 mr-3 h-4 w-4 shrink-0 text-emerald-600"
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
                          <span className="text-slate-700">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-slate-900">
                      Planned stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-slate-900 dark:text-emerald-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      The design keeps manual overrides, isolates mains switching
                      from low-voltage control, routes speech through OpenAI
                      APIs on the Mac mini backend, keeps room endpoints on
                      Wi-Fi, and avoids unsafe generic relay control for BLDC
                      fans and split AC compressor paths.
                    </p>
                  </div>
                </div>

                {project.bom ? (
                  <div className="mt-8 rounded-2xl border border-slate-200 bg-white/90 p-6 dark:border-slate-700 dark:bg-slate-900/85">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                          Planning spreadsheet
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-slate-900">
                          Reference bill of materials
                        </h4>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                          {project.bom.referenceSetup}
                        </p>
                      </div>
                      <a
                        href={project.bom.csvDownloadHref}
                        download={project.bom.csvDownloadName}
                        className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                      >
                        Download CSV
                      </a>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          Core hardware
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {formatBomCost(
                            project.bom.coreHardwareSubtotalInr,
                            "Included",
                          )}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Control plane, Wi-Fi relays, Wi-Fi sensors, and AC IR
                          bridges.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                          Expanded budget
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {formatBomCost(
                            project.bom.expandedHardwareSubtotalInr,
                            "Included",
                          )}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Adds the optional BLDC fan replacement path.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                          Pricing checked
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-900">
                          {project.bom.pricingCheckedAt}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          India planning prices, rounded for procurement drift.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                          Excluded
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-900">
                          Labor and rewiring
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Electrician time, switchboard changes, and panel
                          protection upgrades sit outside this subtotal.
                        </p>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-2 text-sm leading-6 text-slate-600">
                      {project.bom.assumptions.map((assumption) => (
                        <li key={assumption} className="flex items-start">
                          <svg
                            className="mt-1 mr-3 h-4 w-4 shrink-0 text-emerald-600"
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
                          <span>{assumption}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                      <table className="min-w-[960px] w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-950/60">
                          <tr>
                            <th className="px-4 py-3 font-semibold text-slate-700">
                              Scope
                            </th>
                            <th className="px-4 py-3 font-semibold text-slate-700">
                              Material
                            </th>
                            <th className="px-4 py-3 font-semibold text-slate-700">
                              Qty
                            </th>
                            <th className="px-4 py-3 font-semibold text-slate-700">
                              Approx unit
                            </th>
                            <th className="px-4 py-3 font-semibold text-slate-700">
                              Approx line
                            </th>
                            <th className="px-4 py-3 font-semibold text-slate-700">
                              Function
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900/70">
                          {project.bom.rows.map((row) => (
                            <tr key={`${row.scope}-${row.item}`}>
                              <td className="px-4 py-4 align-top">
                                <span
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBomScopeClasses(row.scope)}`}
                                >
                                  {row.scope}
                                </span>
                              </td>
                              <td className="px-4 py-4 align-top">
                                <div className="font-semibold text-slate-900">
                                  {row.item}
                                </div>
                                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                                  {row.category}
                                </div>
                                <div className="mt-2 text-sm leading-6 text-slate-500">
                                  {row.price_basis}
                                </div>
                              </td>
                              <td className="px-4 py-4 align-top font-medium text-slate-700">
                                {row.qty}
                              </td>
                              <td className="px-4 py-4 align-top font-medium text-slate-700">
                                {formatBomCost(
                                  row.approx_unit_cost_inr,
                                  "Usage-based",
                                )}
                              </td>
                              <td className="px-4 py-4 align-top font-medium text-slate-900">
                                {formatBomCost(
                                  row.approx_line_cost_inr,
                                  "Variable monthly",
                                )}
                              </td>
                              <td className="px-4 py-4 align-top">
                                <div className="text-slate-700">
                                  {row.function}
                                </div>
                                <div className="mt-2 text-sm leading-6 text-slate-500">
                                  {row.notes}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      The core subtotal is a hardware planning budget. OpenAI
                      voice usage stays variable, and the optional fan row is
                      only for the safer replacement path when existing BLDC
                      fans cannot be integrated cleanly.
                    </p>
                  </div>
                ) : null}

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-700 dark:bg-slate-900/85">
                  <h4 className="mb-4 text-lg font-semibold text-slate-900">
                    Design note
                  </h4>
                  <div className="text-sm leading-7 text-slate-700 [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:mb-3 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_strong]:font-semibold [&_a]:font-semibold [&_a]:text-emerald-700 [&_a:hover]:text-emerald-800 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.95em] dark:[&_a]:text-emerald-300 dark:[&_a:hover]:text-emerald-200 dark:[&_code]:bg-slate-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.notesMarkdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.section>
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
