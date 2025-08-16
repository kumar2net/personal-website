import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiDownload, HiZoomIn, HiZoomOut, HiViewBoards } from 'react-icons/hi'

function TheBrainStory() {
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5))
  const handleResetZoom = () => setScale(1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/books"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <HiArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Books</span>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">The Brain: The Story of You</h1>
            </div>
            
            {/* Mobile Controls */}
            {isMobile && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Zoom out"
                >
                  <HiZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Zoom in"
                >
                  <HiZoomIn className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Book Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="The Brain: The Story of You book cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">David Eagleman</p>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Book</h2>
              <p className="text-gray-700 leading-relaxed">
                One of the best books I have read in a while. Observing all the advances in AI and listening to gyan from my kin on neurology brain implants, wanted to dig deeper. As they say these days - learn from First Principles
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <img src="https://img.shields.io/badge/Neuroscience-Brain%20Science-purple" alt="Neuroscience badge" />
                <img src="https://img.shields.io/badge/AI%20%26%20Technology-Neural%20Implants-orange" alt="AI Technology badge" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Controls */}
          {!isMobile && (
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Zoom:</span>
                <button
                  onClick={handleZoomOut}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Zoom out"
                >
                  <HiZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Zoom in"
                >
                  <HiZoomIn className="w-4 h-4" />
                </button>
              </div>
              
              <a
                href="https://kumarsite.netlify.app/docs/The_Brain_The_Story.pdf"
                download
                className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <HiDownload className="w-4 h-4 mr-1" />
                Download PDF
              </a>
            </div>
          )}

          {/* PDF Viewer */}
          <div className="relative w-full" style={{ height: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 200px)' }}>
            <iframe
              src={`https://kumarsite.netlify.app/docs/The_Brain_The_Story.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=${scale * 100}`}
              className="w-full h-full border-0"
              title="The Brain: The Story of You PDF"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: `${100 / scale}%`,
                height: `${100 / scale}%`
              }}
            />
          </div>
        </div>

        {/* Mobile Download Button */}
        {isMobile && (
          <div className="mt-4 text-center">
            <a
              href="https://kumarsite.netlify.app/docs/The_Brain_The_Story.pdf"
              download
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <HiDownload className="w-4 h-4 mr-2" />
              Download for Better Reading
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default TheBrainStory
