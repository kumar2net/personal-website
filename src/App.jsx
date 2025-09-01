import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Logo from './components/Logo';
import ScrollToTop from './components/ScrollToTop';
import About from './pages/About';
import Album from './pages/Album';
import Blog from './pages/Blog';
import Books from './pages/Books';
import AgenticFeatureInABrowser from './pages/blog/2025-08-23-agentic-feature-in-a-browser';
import AcronymSoup from './pages/blog/acronym-soup';
import AcronymSoupRevisited2025 from './pages/blog/acronym-soup-revisited-2025';
import AndrejKarpathyYcAiStartupSchool from './pages/blog/andrej-karpathy-yc-ai-startup-school';
import ApplyingRobinsonMethod from './pages/blog/applying-robinson-method';
import Autophagy from './pages/blog/autophagy';
import BuildingMcpServerWithCursor from './pages/blog/building-mcp-server-with-cursor';
import CompellingIndiaStory from './pages/blog/Compelling-india-story';
import DevastatedByYoungGirlsDemise from './pages/blog/devastated-by-young-girls-demise';
import DrugSuggestionApp from './pages/blog/drug-suggestion-app';
import ExperienceUsingApiInAiCodeEditor from './pages/blog/experience-using-api-in-ai-code-editor';
import FAQBuddingDentist from './pages/blog/faq-budding-dentist';
import FeynmanTechnique from './pages/blog/feynman-technique';
import GlobalEconomicConcerns from './pages/blog/global-economic-concerns-2025';
import Habit from './pages/blog/habit';
import IndiaUSATradeGap from './pages/blog/india-usa-trade-gap-2025';
import JoyOfWriting from './pages/blog/joy-of-writing';
import LongWeekendMusings2025 from './pages/blog/long-weekend-musings-2025';
import MemoryEvolution from './pages/blog/memory-evolution';
import MicrosoftMaiDxIndia from './pages/blog/microsoft-mai-dx-india';
import MyExperienceWithWindsurfPost from './pages/blog/my-experience-with-windsurf';
import MyFascinationWithShortcuts from './pages/blog/my-fascination-with-shortcuts';
import MyRandomThoughtsThisWeek from './pages/blog/my-random-thoughts-this-week';
import NammuSoilAnalysisResearch from './pages/blog/nammu-soil-analysis-research';
import NepalAnnapurnaCircuit from './pages/blog/nepal-annapurna-circuit';
import PostDynamic from './pages/blog/PostDynamic';
import PortfolioWebsite from './pages/blog/portfolio-website';
import PriceParity from './pages/blog/price-parity';
import SoberingWeekAugust2025 from './pages/blog/sobering-week-august-2025';
import SpineImplantDashboard from './pages/blog/spine-implant-dashboard';
import StartedToKindleAgain from './pages/blog/started-to-kindle-again';
import TheGreatPivot from './pages/blog/the-great-pivot';
import Top9FamousRules from './pages/blog/top-9-famous-rules';
import ApplyingCornellMethodMd from './pages/books/applying-cornell-method';
import Atheism from './pages/books/atheism';
import BookDynamic from './pages/books/BookDynamic';
import PDFExtractorPage from './pages/books/pdf-extractor';
import TheBrainStoryContent from './pages/books/the-brain-story-content';
import Contact from './pages/Contact';
import DossierPage from './pages/Dossier';
import FlashcardSetPage from './pages/FlashcardSetPage';
import Learning from './pages/Learning';
import MusicPage from './pages/Music';
import Projects from './pages/Projects';
import Shortcuts from './pages/Shortcuts';
import Trends from './pages/Trends';
import UtilitiesDashboard from './pages/UtilitiesDashboard';
import VocabAdditions from './pages/VocabAdditions';
import NaruviWaterIssues from './pages/naruvi';

// Admin CMS removed

function useGaPageViews() {
  const location = useLocation();

  // Track GA4 page_view on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
        page_referrer: document.referrer || 'direct',
      });

      // Also track custom event for better analytics
      window.gtag('event', 'page_view_custom', {
        event_category: 'engagement',
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
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: 'navigation',
        event_label: eventName,
        ...parameters,
      });
    }
  };

  useGaPageViews();

  // Handle app loading and error states
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Error boundary for mobile browsers
  useEffect(() => {
    const handleError = (error) => {
      console.error('App error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
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
                  onClick={() => trackClick('nav_about')}
                >
                  About
                </Link>
                <Link
                  to="/projects"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick('nav_projects')}
                >
                  Projects
                </Link>
                <Link
                  to="/books"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick('nav_books')}
                >
                  Books
                </Link>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick('nav_blog')}
                >
                  Blog
                </Link>

                <Link
                  to="/learning"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick('nav_learning')}
                >
                  Learning
                </Link>
                <Link
                  to="/music"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick('nav_music')}
                >
                  Music
                </Link>
                <Link
                  to="/album"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick('nav_album')}
                >
                  Album
                </Link>
                <a
                  href="https://deepdivedl.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick('nav_deepdive')}
                >
                  DeepDive
                </a>

                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => trackClick('nav_contact')}
                >
                  Contact
                </Link>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  trackClick('mobile_menu_toggle', {
                    isOpen: !isMobileMenuOpen,
                  });
                }}
                className="md:hidden"
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
                      trackClick('nav_about_mobile');
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    About
                  </Link>
                  <Link
                    to="/projects"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick('nav_projects_mobile');
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/books"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick('nav_books_mobile');
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Books
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick('nav_blog_mobile');
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Blog
                  </Link>

                  <Link
                    to="/learning"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick('nav_learning_mobile');
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Learning
                  </Link>
                  <Link
                    to="/music"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick('nav_music_mobile');
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    Music
                  </Link>
                  <Link
                    to="/album"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick('nav_album_mobile');
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
                      trackClick('nav_deepdive_mobile');
                    }}
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                  >
                    DeepDive
                  </a>

                  <Link
                    to="/contact"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      trackClick('nav_contact_mobile');
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
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      About Me
                    </Link>
                    <Link
                      to="/projects"
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      My Projects
                    </Link>
                    <Link
                      to="/books"
                      className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Books
                    </Link>
                    <Link
                      to="/blog"
                      className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      Blog
                    </Link>

                    <Link
                      to="/learning"
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Learning Hub
                    </Link>
                    <Link
                      to="/music"
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Music
                    </Link>
                    <Link
                      to="/album"
                      className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
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
                      "You must have chaos within you to give birth to a dancing
                      star."
                    </blockquote>
                    <p className="mt-4 text-gray-600 italic text-right">
                      — Friedrich Nietzsche
                    </p>
                  </motion.div>
                </motion.div>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/album" element={<Album />} />
            <Route path="/books" element={<Books />} />
            <Route
              path="/books/applying-cornell-method"
              element={<ApplyingCornellMethodMd />}
            />
            <Route
              path="/books/the-brain-story-content"
              element={<TheBrainStoryContent />}
            />
            <Route path="/books/pdf-extractor" element={<PDFExtractorPage />} />
            <Route path="/books/atheism" element={<Atheism />} />
            <Route path="/books/:slug" element={<BookDynamic />} />
            <Route path="/learning/:setId" element={<FlashcardSetPage />} />
            <Route path="/learning/shortcuts" element={<Shortcuts />} />
            <Route
              path="/learning/vocab-additions"
              element={<VocabAdditions />}
            />
            <Route
              path="/blog/spine-implant-dashboard"
              element={<SpineImplantDashboard />}
            />
            <Route
              path="/blog/building-mcp-server-with-cursor"
              element={<BuildingMcpServerWithCursor />}
            />
            <Route
              path="/blog/drug-suggestion-app"
              element={<DrugSuggestionApp />}
            />
            <Route
              path="/blog/portfolio-website"
              element={<PortfolioWebsite />}
            />
            <Route
              path="/blog/my-experience-with-windsurf"
              element={<MyExperienceWithWindsurfPost />}
            />
            <Route
              path="/blog/experience-using-api-in-ai-code-editor"
              element={<ExperienceUsingApiInAiCodeEditor />}
            />
            <Route path="/blog/acronym-soup" element={<AcronymSoup />} />
            <Route
              path="/blog/andrej-karpathy-yc-ai-startup-school"
              element={<AndrejKarpathyYcAiStartupSchool />}
            />
            <Route
              path="/blog/my-fascination-with-shortcuts"
              element={<MyFascinationWithShortcuts />}
            />
            <Route
              path="/blog/compelling-india-story"
              element={<CompellingIndiaStory />}
            />
            <Route
              path="/blog/microsoft-mai-dx-india"
              element={<MicrosoftMaiDxIndia />}
            />
            <Route
              path="/blog/acronym-soup-revisited-2025"
              element={<AcronymSoupRevisited2025 />}
            />
            <Route path="/blog/price-parity" element={<PriceParity />} />
            <Route
              path="/blog/started-to-kindle-again"
              element={<StartedToKindleAgain />}
            />
            <Route path="/blog/autophagy" element={<Autophagy />} />
            <Route
              path="/blog/feynman-technique"
              element={<FeynmanTechnique />}
            />
            <Route
              path="/blog/applying-robinson-method"
              element={<ApplyingRobinsonMethod />}
            />
            <Route
              path="/blog/memory-evolution"
              element={<MemoryEvolution />}
            />
            <Route
              path="/blog/nepal-annapurna-circuit"
              element={<NepalAnnapurnaCircuit />}
            />
            <Route
              path="/blog/my-random-thoughts-this-week"
              element={<MyRandomThoughtsThisWeek />}
            />
            <Route
              path="/blog/nammu-soil-analysis-research"
              element={<NammuSoilAnalysisResearch />}
            />
            <Route
              path="/blog/india-usa-trade-gap-2025"
              element={<IndiaUSATradeGap />}
            />
            <Route
              path="/blog/top-9-famous-rules"
              element={<Top9FamousRules />}
            />
            <Route path="/blog/the-great-pivot" element={<TheGreatPivot />} />
            <Route
              path="/blog/long-weekend-musings-2025"
              element={<LongWeekendMusings2025 />}
            />
            <Route
              path="/blog/faq-budding-dentist"
              element={<FAQBuddingDentist />}
            />
            <Route
              path="/blog/devastated-by-young-girls-demise"
              element={<DevastatedByYoungGirlsDemise />}
            />
            <Route
              path="/blog/global-economic-concerns-2025"
              element={<GlobalEconomicConcerns />}
            />
            <Route
              path="/blog/2025-08-23-agentic-feature-in-a-browser"
              element={<AgenticFeatureInABrowser />}
            />
            <Route path="/blog/joy-of-writing" element={<JoyOfWriting />} />
            <Route path="/blog/habit" element={<Habit />} />
            <Route
              path="/blog/sobering-week-august-2025"
              element={<SoberingWeekAugust2025 />}
            />
            <Route path="/dossier" element={<DossierPage />} />
            <Route path="/utilities" element={<UtilitiesDashboard />} />
            <Route path="/naruvi" element={<NaruviWaterIssues />} />
            {/* Admin route removed */}
            <Route path="/blog/:slug" element={<PostDynamic />} />
            <Route path="/contact" element={<Contact />} />
            {/* Admin route is handled by static files, not React Router */}
          </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                {' '}
                2025 My Portfolio. All rights reserved.
              </p>
              {/* <p className="text-gray-600">© 2025 My Portfolio. All rights reserved.</p> */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  LinkedIn
                </a>
                <a
                  href="https://x.com/kumar2net"
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
