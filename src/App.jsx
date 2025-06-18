import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { HiMenu } from 'react-icons/hi'
import { motion } from 'framer-motion'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import SpineImplantDashboard from './pages/blog/spine-implant-dashboard'
import DrugSuggestionApp from './pages/blog/drug-suggestion-app'
import PortfolioWebsite from './pages/blog/portfolio-website'
import MyExperienceWithWindsurfPost from './pages/blog/my-experience-with-windsurf'
import ExperienceUsingApiInAiCodeEditor from './pages/blog/experience-using-api-in-ai-code-editor';
import AcronymSoup from './pages/blog/acronym-soup';


function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div>
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800">Portfolio</span>
              </Link>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                About
              </Link>
              <Link 
                to="/projects" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Projects
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Contact
              </Link>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                >
                  About
                </Link>
                <Link 
                  to="/projects" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800"
                >
                  Projects
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
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
              <div className="flex gap-4">
                <Link to="/about" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  About Me
                </Link>
                <Link to="/projects" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                  My Projects
                </Link>
                <Link to="/blog" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                  Blog
                </Link>
              </div>
            </motion.div>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/spine-implant-dashboard" element={<SpineImplantDashboard />} />
          <Route path="/blog/drug-suggestion-app" element={<DrugSuggestionApp />} />
          <Route path="/blog/portfolio-website" element={<PortfolioWebsite />} />
          <Route path="/blog/my-experience-with-windsurf" element={<MyExperienceWithWindsurfPost />} />
<Route path="/blog/experience-using-api-in-ai-code-editor" element={<ExperienceUsingApiInAiCodeEditor />} />
          <Route path="/blog/acronym-soup" element={<AcronymSoup />} />
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
              <a href="#" className="text-gray-600 hover:text-gray-800">GitHub</a>
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
