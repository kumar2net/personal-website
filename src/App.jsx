import { useState, useEffect } from 'react'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import { HiMenu } from 'react-icons/hi'
import { motion } from 'framer-motion'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Learning from './pages/Learning'
import MacOSShortcuts from './pages/MacOSShortcuts'
import BrowserShortcuts from './pages/BrowserShortcuts'
import VimShortcuts from './pages/VimShortcuts'
import SpineImplantDashboard from './pages/blog/spine-implant-dashboard'
import DrugSuggestionApp from './pages/blog/drug-suggestion-app'
import PortfolioWebsite from './pages/blog/portfolio-website'
import MyExperienceWithWindsurfPost from './pages/blog/my-experience-with-windsurf'
import ExperienceUsingApiInAiCodeEditor from './pages/blog/experience-using-api-in-ai-code-editor';
import AcronymSoup from './pages/blog/acronym-soup';
import AndrejKarpathyYcAiStartupSchool from './pages/blog/andrej-karpathy-yc-ai-startup-school';
import BuildingMcpServerWithCursor from "./pages/blog/building-mcp-server-with-cursor";
import MyFascinationWithShortcuts from './pages/blog/my-fascination-with-shortcuts';
import MicrosoftMaiDxIndia from './pages/blog/microsoft-mai-dx-india';
import Logo from './components/Logo'
import ScrollToTop from './components/ScrollToTop'
import Shortcuts from './pages/Shortcuts'
import CompellingIndiaStory from './pages/blog/Compelling-india-story'
import AcronymSoupRevisited2025 from './pages/blog/acronym-soup-revisited-2025';
import PriceParity from './pages/blog/price-parity';
import StartedToKindleAgain from './pages/blog/started-to-kindle-again';
import Autophagy from './pages/blog/autophagy';
import FeynmanTechnique from './pages/blog/feynman-technique';
import ApplyingRobinsonMethod from './pages/blog/applying-robinson-method';
import VocabAdditions from './pages/VocabAdditions';
import FlashcardSetPage from './pages/FlashcardSetPage';
import MemoryEvolution from './pages/blog/memory-evolution';
import NepalAnnapurnaCircuit from './pages/blog/nepal-annapurna-circuit';
import MyRandomThoughtsThisWeek from './pages/blog/my-random-thoughts-this-week';
import NammuSoilAnalysisResearch from './pages/blog/nammu-soil-analysis-research';
import IndiaUSATradeGap from './pages/blog/india-usa-trade-gap-2025';
import MusicPage from './pages/Music';
import Books from './pages/Books';
import BookCornellMethod from './pages/BookCornellMethod';
import ApplyingCornellMethodMd from './pages/books/applying-cornell-method';
import TheBrainStory from './pages/books/the-brain-story';
import TheBrainStoryContent from './pages/books/the-brain-story-content';
import PDFExtractorPage from './pages/books/pdf-extractor';
import Top9FamousRules from './pages/blog/top-9-famous-rules';
import PostDynamic from './pages/blog/PostDynamic';
import TheGreatPivot from './pages/blog/the-great-pivot';
import LongWeekendMusings2025 from './pages/blog/long-weekend-musings-2025';
import Trends from './pages/Trends';
import DossierPage from './pages/Dossier';


function useGaPageViews() {
  const location = useLocation();
  
  // Track GA4 page_view on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title
      });
    }
  }, [location.pathname, location.search]);
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const trackClick = () => {}
  useGaPageViews()

  return (
    <div className="min-h-screen bg-gray-100">
      <ScrollToTop />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div>
              <Link to="/" className="flex items-center">
                <Logo className="h-[60px] w-[60px]" />
              </Link>
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
                to="/trends" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => trackClick('nav_trends')}
              >
                Trends
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
                trackClick('mobile_menu_toggle', { isOpen: !isMobileMenuOpen });
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
                  to="/trends" 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    trackClick('nav_trends_mobile');
                  }}
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                >
                  Trends
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
          <Route path="/" element={
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">Welcome to My Personal Website</h1>
              <p className="text-xl text-gray-600 mb-8">AI Enthusiast</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/about" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  About Me
                </Link>
                <Link to="/projects" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                  My Projects
                </Link>
                <Link to="/books" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Books
                </Link>
                <Link to="/blog" className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                  Blog
                </Link>
                <Link to="/trends" className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                  Trends
                </Link>
                <Link to="/learning" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Learning Hub
                </Link>
                <Link to="/music" className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Music
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
                  “The surest way to corrupt a youth is to instruct him to hold in higher esteem those who think alike than those who think differently.”
                </blockquote>
                <p className="mt-4 text-gray-600 italic text-right">— Friedrich Nietzsche</p>
              </motion.div>
            </motion.div>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/applying-cornell-method" element={<ApplyingCornellMethodMd />} />
          <Route path="/books/the-brain-story" element={<TheBrainStory />} />
          <Route path="/books/the-brain-story-content" element={<TheBrainStoryContent />} />
          <Route path="/books/pdf-extractor" element={<PDFExtractorPage />} />
          <Route path="/learning/:setId" element={<FlashcardSetPage />} />
          <Route path="/learning/shortcuts" element={<Shortcuts />} />
          <Route path="/learning/vocab-additions" element={<VocabAdditions />} />
          <Route path="/blog/spine-implant-dashboard" element={<SpineImplantDashboard />} />
          <Route path="/blog/building-mcp-server-with-cursor" element={<BuildingMcpServerWithCursor />} />
          <Route path="/blog/drug-suggestion-app" element={<DrugSuggestionApp />} />
          <Route path="/blog/portfolio-website" element={<PortfolioWebsite />} />
          <Route path="/blog/my-experience-with-windsurf" element={<MyExperienceWithWindsurfPost />} />
          <Route path="/blog/experience-using-api-in-ai-code-editor" element={<ExperienceUsingApiInAiCodeEditor />} />
          <Route path="/blog/acronym-soup" element={<AcronymSoup />} />
          <Route path="/blog/andrej-karpathy-yc-ai-startup-school" element={<AndrejKarpathyYcAiStartupSchool />} />
          <Route path="/blog/my-fascination-with-shortcuts" element={<MyFascinationWithShortcuts />} />
          <Route path="/blog/compelling-india-story" element={<CompellingIndiaStory />} />
          <Route path="/blog/microsoft-mai-dx-india" element={<MicrosoftMaiDxIndia />} />
          <Route path="/blog/acronym-soup-revisited-2025" element={<AcronymSoupRevisited2025 />} />
          <Route path="/blog/price-parity" element={<PriceParity />} />
          <Route path="/blog/started-to-kindle-again" element={<StartedToKindleAgain />} />
          <Route path="/blog/autophagy" element={<Autophagy />} />
          <Route path="/blog/feynman-technique" element={<FeynmanTechnique />} />
          <Route path="/blog/applying-robinson-method" element={<ApplyingRobinsonMethod />} />
          <Route path="/blog/memory-evolution" element={<MemoryEvolution />} />
          <Route path="/blog/nepal-annapurna-circuit" element={<NepalAnnapurnaCircuit />} />
          <Route path="/blog/my-random-thoughts-this-week" element={<MyRandomThoughtsThisWeek />} />
          <Route path="/blog/nammu-soil-analysis-research" element={<NammuSoilAnalysisResearch />} />
          <Route path="/blog/india-usa-trade-gap-2025" element={<IndiaUSATradeGap />} />
          <Route path="/blog/top-9-famous-rules" element={<Top9FamousRules />} />
          <Route path="/blog/the-great-pivot" element={<TheGreatPivot />} />
          <Route path="/blog/long-weekend-musings-2025" element={<LongWeekendMusings2025 />} />
          <Route path="/dossier" element={<DossierPage />} />
          <Route path="/blog/:slug" element={<PostDynamic />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600"> 2025 My Portfolio. All rights reserved.</p>
            {/* <p className="text-gray-600">© 2025 My Portfolio. All rights reserved.</p> */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-800">LinkedIn</a>
              <a href="https://x.com/kumar2net" className="text-gray-600 hover:text-gray-800" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
