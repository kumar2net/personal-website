import { Link } from 'react-router-dom'
import { HiArrowLeft, HiDownload } from 'react-icons/hi'
import BookCover from '../../components/BookCover'

function TheBrainStoryContent() {
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
            
            <a
              href="https://kumarsite.netlify.app/docs/The_Brain_The_Story.pdf"
              download
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <HiDownload className="w-4 h-4 mr-1" />
              Download PDF
            </a>
          </div>
        </div>
      </header>

      {/* Book Cover and Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden shadow-lg">
                <BookCover
                  bookId="the-brain-story"
                  title="The Brain: The Story of You"
                  author="David Eagleman"
                  className="w-full h-full"
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

      {/* PDF Embed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Read "The Brain: The Story of You"</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">PDF Reader</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="relative w-full" style={{ height: 'calc(100vh - 300px)' }}>
            <iframe
              src="https://kumarsite.netlify.app/docs/The_Brain_The_Story.pdf"
              className="w-full h-full border-0"
              title="The Brain: The Story of You PDF"
              loading="lazy"
            />
          </div>
          
          <div className="bg-gray-50 px-4 py-3 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>📖 Full PDF content with native reader controls</span>
              <span>🔍 Zoom, search, and navigate with your browser's PDF tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Download Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Mobile Users</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>For the best reading experience on mobile devices, consider downloading the PDF to use your device's native PDF reader app.</p>
              </div>
              <div className="mt-3">
                <a
                  href="https://kumarsite.netlify.app/docs/The_Brain_The_Story.pdf"
                  download
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <HiDownload className="w-4 h-4 mr-1" />
                  Download for Mobile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TheBrainStoryContent
