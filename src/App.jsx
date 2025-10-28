import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaTwitter, FaWordpress } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import SEO from "./components/SEO";
import { getBlogSeo } from "./data/blogIndex";
import Logo from "./components/Logo";
import ScrollToTop from "./components/ScrollToTop";
import WorldClock from "./components/WorldClock";
import React, { Suspense, lazy } from "react";

// Eagerly load critical components
import About from "./pages/About";

// Lazy load all other components
const Album = lazy(() => import("./pages/Album"));
const Blog = lazy(() => import("./pages/Blog"));
const Books = lazy(() => import("./pages/Books"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const Learning = lazy(() => import("./pages/Learning"));
const MusicPage = lazy(() => import("./pages/Music"));
const Elsewhere = lazy(() => import("./pages/Elsewhere"));
const TopicSuggestions = lazy(() => import("./pages/TopicSuggestions"));
const Trends = lazy(() => import("./pages/Trends"));

// Lazy load blog posts
const PostDynamic = lazy(() => import("./pages/blog/PostDynamic"));

// Lazy load book pages
const BookDynamic = lazy(() => import("./pages/books/BookDynamic"));
const ApplyingCornellMethodMd = lazy(
  () => import("./pages/books/applying-cornell-method"),
);
const Atheism = lazy(() => import("./pages/books/atheism"));
const HowToStopCaring = lazy(() => import("./pages/books/how-to-stop-caring"));
const PDFExtractorPage = lazy(() => import("./pages/books/pdf-extractor"));
const TheBrainStoryContent = lazy(
  () => import("./pages/books/the-brain-story-content"),
);
const TheLastDropOfWater = lazy(
  () => import("./pages/books/TheLastDropOfWater"),
);

// Lazy load other pages
const DossierPage = lazy(() => import("./pages/Dossier"));
const FlashcardSetPage = lazy(() => import("./pages/FlashcardSetPage"));
const Shortcuts = lazy(() => import("./pages/Shortcuts"));
const UtilitiesDashboard = lazy(() => import("./pages/UtilitiesDashboard"));
const Status = lazy(() => import("./pages/Status"));

const NaruviWaterIssues = lazy(() => import("./pages/naruvi"));
const MyReminiscences = lazy(() => import("./pages/blog/my-reminiscences"));

const AiRecommenderCode = lazy(
  () => import("./pages/projects/AiRecommenderCode"),
);

// Admin CMS removed

function useGaPageViews() {
  const location = useLocation();

  // Track GA4 page_view on route change
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
        page_referrer: document.referrer || "direct",
      });

      // Also track custom event for better analytics
      window.gtag("event", "page_view_custom", {
        event_category: "engagement",
        event_label: location.pathname,
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location.pathname, location.search]);
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const trackClick = (eventName, parameters = {}) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        event_category: "navigation",
        event_label: eventName,
        ...parameters,
      });
    }
  };

  useGaPageViews();

  // Handle app loading and error states
  useEffect(() => {
    // Remove artificial delay for faster loading
    setIsLoading(false);
  }, []);

  // Error boundary for mobile browsers
  useEffect(() => {
    const handleError = (error) => {
      console.error("App error:", error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            aria-label="Refresh the page to try again"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 mobile-fix">
        <SEO
          title="My Stories"
          description="AI enthusiast. Projects, blog, books, music, learning resources, and more."
          canonicalPath="/"
          image="/vite.svg"
          type="website"
        />
        <ScrollToTop />
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="relative group">
                <Link
                  to="/"
                  className="flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
                  title="Click to go to Home page"
                >
                  <Logo className="h-[60px] w-[60px]" />
                  {/* Mobile home indicator */}
                  <span className="md:hidden ml-2 text-sm text-gray-600 font-medium flex items-center">
                    <FaHome className="w-3 h-3 mr-1" />
                    Home
                  </span>
                </Link>

                {/* Tooltip for logo */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Click to go Home
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_about")}
                >
                  About
                </Link>
                <Link
                  to="/elsewhere"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_elsewhere")}
                >
                  Elsewhere
                </Link>
                {false && (
                  <Link
                    to="/topics"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => trackClick("nav_topics")}
                  >
                    Topics
                  </Link>
                )}
                <Link
                  to="/projects"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_projects")}
                >
                  Projects
                </Link>
                <Link
                  to="/books"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_books")}
                >
                  Books
                </Link>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_blog")}
                >
                  Blog
                </Link>

                <Link
                  to="/learning"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_learning")}
                >
                  Learning
                </Link>
                <Link
                  to="/music"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_music")}
                >
                  Music
                </Link>
                <Link
                  to="/album"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_album")}
                >
                  Album
                </Link>
                <a
                  href="https://deepdivedl.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_deepdive")}
                >
                  DeepDive
                </a>

                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick("nav_contact")}
                >
                  Contact
                </Link>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  trackClick("mobile_menu_toggle", {
                    isOpen: !isMobileMenuOpen,
                  });
                }}
                className="md:hidden"
                aria-label={
                  isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
                }
                aria-expanded={isMobileMenuOpen}
              >
                <HiMenu className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    to="/about"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_about_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    About
                  </Link>
                  <Link
                    to="/elsewhere"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_elsewhere_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Elsewhere
                  </Link>
                  <Link
                    to="/topics"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_topics_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Topics
                  </Link>
                  <Link
                    to="/projects"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_projects_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/books"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_books_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Books
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_blog_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Blog
                  </Link>

                  <Link
                    to="/learning"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_learning_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Learning
                  </Link>
                  <Link
                    to="/music"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_music_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Music
                  </Link>
                  <Link
                    to="/album"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_album_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Album
                  </Link>
                  <a
                    href="https://deepdivedl.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_deepdive_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    DeepDive
                  </a>

                  <Link
                    to="/contact"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick("nav_contact_mobile");
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Suspense
            fallback={
              <div className="py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <h1 className="text-4xl font-bold mb-4">
                      Welcome to My Personal Website
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">AI Enthusiast</p>

                    <div className="flex flex-wrap gap-4 justify-center">
                      <Link
                        to="/about"
                        className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        About Me
                      </Link>
                      <Link
                        to="/projects"
                        className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        My Projects
                      </Link>
                      <Link
                        to="/books"
                        className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                      >
                        Books
                      </Link>
                      <Link
                        to="/blog"
                        className="px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors"
                      >
                        Blog
                      </Link>

                      <Link
                        to="/learning"
                        className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                      >
                        Learning Hub
                      </Link>
                      <Link
                        to="/music"
                        className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                      >
                        Music
                      </Link>
                      <Link
                        to="/album"
                        className="px-6 py-3 bg-pink-700 text-white rounded-lg hover:bg-pink-800 transition-colors"
                      >
                        Album
                      </Link>
                    </div>

                    {/* Home quote */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className="mt-12 mx-auto max-w-3xl bg-gradient-to-r from-gray-50 to-gray-100 p-6 md:p-8 rounded-xl border-l-4 border-gray-400 text-left"
                    >
                      <blockquote className="text-xl md:text-2xl font-semibold text-gray-800 leading-snug">
                        "Aiyoo Sār Oru Malayāḷi āṇu"
                      </blockquote>
                      <p className="mt-4 text-gray-600 italic text-right">
                        — Sister talk
                      </p>
                    </motion.div>

                    {/* Elsewhere icons */}
                    <div className="mt-8 flex items-center justify-center gap-6">
                      <a
                        href="https://kumar2net.wordpress.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WordPress"
                        className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white shadow ring-1 ring-gray-200 hover:ring-blue-400 hover:shadow-md transition"
                        title="WordPress"
                      >
                        <FaWordpress className="h-6 w-6 text-gray-800" />
                      </a>
                      <a
                        href="https://twitter.com/kumar2net"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X (Twitter)"
                        className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white shadow ring-1 ring-gray-200 hover:ring-blue-400 hover:shadow-md transition"
                        title="X (Twitter)"
                      >
                        <FaTwitter className="h-6 w-6 text-gray-800" />
                      </a>
                    </div>
                    <WorldClock />
                  </motion.div>
                }
              />
              <Route
                path="/about"
                element={
                  <>
                    <SEO
                      title="About"
                      description="About Kumar and this website."
                      canonicalPath="/about"
                      type="website"
                    />
                    <About />
                  </>
                }
              />
              <Route
                path="/topics"
                element={
                  <>
                    <SEO
                      title="Topic Suggestions"
                      description="3–4 blog topic ideas from GA4 analytics."
                      canonicalPath="/topics"
                      type="website"
                    />
                    <TopicSuggestions />
                  </>
                }
              />
              <Route
                path="/projects"
                element={
                  <>
                    <SEO
                      title="Projects"
                      description="Selected projects and experiments."
                      canonicalPath="/projects"
                      type="website"
                    />
                    <Projects />
                  </>
                }
              />
              <Route
                path="/blog"
                element={
                  <>
                    <SEO
                      title="Blog"
                      description="Latest posts on technology, learning, and life."
                      canonicalPath="/blog"
                      type="website"
                    />
                    <Blog />
                  </>
                }
              />
              <Route
                path="/blog/my-reminiscences"
                element={
                  <>
                    <SEO
                      title="My Reminiscences"
                      description="Personal reflections on family, technology, and life changes over the years. From mobile services evolution to cryptocurrency battles, data science insights to cultural connections."
                      canonicalPath="/blog/my-reminiscences"
                      type="article"
                    />
                    <MyReminiscences />
                  </>
                }
              />
              <Route
                path="/reco"
                element={
                  <>
                    <SEO
                      title="AI Recommendations"
                      description="Get AI-powered content recommendations using Neural Graph Intelligence. Discover trending topics and personalized suggestions."
                      canonicalPath="/reco"
                      type="website"
                    />
                    <Recommendations />
                  </>
                }
              />
              <Route
                path="/trends"
                element={
                  <>
                    <SEO
                      title="Trends"
                      description="Trends and insights."
                      canonicalPath="/trends"
                      type="website"
                    />
                    <Trends />
                  </>
                }
              />
              <Route
                path="/learning"
                element={
                  <>
                    <SEO
                      title="Learning"
                      description="Learning hub: flashcards, notes, and more."
                      canonicalPath="/learning"
                      type="website"
                    />
                    <Learning />
                  </>
                }
              />
              <Route
                path="/music"
                element={
                  <>
                    <SEO
                      title="Music"
                      description="Favorite tracks and playlists."
                      canonicalPath="/music"
                      type="website"
                    />
                    <MusicPage />
                  </>
                }
              />
              <Route
                path="/album"
                element={
                  <>
                    <SEO
                      title="Album"
                      description="Travel albums and photos."
                      canonicalPath="/album"
                      type="website"
                    />
                    <Album />
                  </>
                }
              />
              <Route
                path="/elsewhere"
                element={
                  <>
                    <SEO
                      title="Elsewhere"
                      description="WordPress posts and X timeline."
                      canonicalPath="/elsewhere"
                      type="website"
                    />
                    <Elsewhere />
                  </>
                }
              />
              <Route
                path="/books"
                element={
                  <>
                    <SEO
                      title="Books"
                      description="Books I’m reading and notes."
                      canonicalPath="/books"
                      type="website"
                    />
                    <Books />
                  </>
                }
              />
              <Route
                path="/books/applying-cornell-method"
                element={<ApplyingCornellMethodMd />}
              />
              <Route
                path="/books/the-brain-story-content"
                element={<TheBrainStoryContent />}
              />
              <Route
                path="/books/pdf-extractor"
                element={<PDFExtractorPage />}
              />
              <Route
                path="/books/atheism"
                element={
                  <>
                    <SEO
                      title="Atheism"
                      description="Atheism book notes and excerpts."
                      canonicalPath="/books/atheism"
                      type="article"
                    />
                    <Atheism />
                  </>
                }
              />
              <Route
                path="/books/how-to-stop-caring"
                element={
                  <>
                    <SEO
                      title="How to STOP Caring What People Think of You!"
                      description="A concise guide to breaking free from others' opinions and living authentically. Russell Jamieson provides practical strategies for developing self-confidence."
                      canonicalPath="/books/how-to-stop-caring"
                      type="article"
                    />
                    <HowToStopCaring />
                  </>
                }
              />
              <Route
                path="/books/the-last-drop-of-water"
                element={
                  <>
                    <SEO
                      title="The Last Drop of Water, oh no - A True Story of Compassion"
                      description="A profound true story about compassion and reflection. When a dying darkling beetle crosses paths with Kumar.A on a Sunday morning in Coimbatore, a simple act of kindness becomes a meditation on mortality and empathy."
                      canonicalPath="/books/the-last-drop-of-water"
                      type="article"
                      image="/media/darkling-beetle.jpg"
                    />
                    <TheLastDropOfWater />
                  </>
                }
              />
              <Route path="/books/:slug" element={<BookDynamic />} />
              <Route path="/learning/:setId" element={<FlashcardSetPage />} />
              <Route
                path="/learning/shortcuts"
                element={
                  <>
                    <SEO
                      title="Shortcuts"
                      description="Keyboard shortcuts and practice."
                      canonicalPath="/learning/shortcuts"
                      type="website"
                    />
                    <Shortcuts />
                  </>
                }
              />

              {/* All blog posts now handled by PostDynamic */}
              <Route
                path="/dossier"
                element={
                  <>
                    <SEO
                      title="Dossier"
                      description="Weekly dossiers and research notes."
                      canonicalPath="/dossier"
                      type="website"
                    />
                    <DossierPage />
                  </>
                }
              />
              <Route
                path="/utilities"
                element={
                  <>
                    <SEO
                      title="Utilities"
                      description="Utilities dashboard and tools."
                      canonicalPath="/utilities"
                      type="website"
                    />
                    <UtilitiesDashboard />
                  </>
                }
              />
              <Route
                path="/naruvi"
                element={
                  <>
                    <SEO
                      title="Naruvi Water Issues"
                      description="Naruvi water issues dashboard and notes."
                      canonicalPath="/naruvi"
                      type="website"
                    />
                    <NaruviWaterIssues />
                  </>
                }
              />
              {/* Admin route removed */}
              <Route path="/blog/:slug" element={<PostDynamic />} />

              <Route
                path="/contact"
                element={
                  <>
                    <SEO
                      title="Contact"
                      description="Get in touch with Kumar."
                      canonicalPath="/contact"
                      type="website"
                    />
                    <Contact />
                  </>
                }
              />
              <Route
                path="/status"
                element={
                  <>
                    <SEO
                      title="Status"
                      description="Deployment status of the website."
                      canonicalPath="/status"
                      type="website"
                    />
                    <Status />
                  </>
                }
              />
              {/* Admin route is handled by static files, not React Router */}
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                {" "}
                2025 My Stories. All rights reserved.
              </p>
              {/* <p className="text-gray-600">© 2025 My Stories. All rights reserved.</p> */}
              <div className="flex space-x-4">
                <a
                  href="https://kumar2net.wordpress.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800"
                >
                  WordPress
                </a>
                <a
                  href="https://twitter.com/kumar2net"
                  className="text-gray-600 hover:text-gray-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
