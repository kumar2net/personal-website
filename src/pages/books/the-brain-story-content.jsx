import { Link } from 'react-router-dom'
import { HiArrowLeft, HiDownload, HiExternalLink } from 'react-icons/hi'
import BookCover from '../../components/BookCover'

function TheBrainStoryContent() {
  const handleReadBook = () => {
    // Open PDF in default PDF reader
    window.open('/The_Brain_The_Story.pdf', '_blank')
  }

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
              href="/The_Brain_The_Story.pdf"
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Read Book Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiExternalLink className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Read?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Click the button below to open "The Brain: The Story of You" in your default PDF reader for the best reading experience.
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleReadBook}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <HiExternalLink className="w-6 h-6 mr-3" />
                  Click to Read
                </button>
                
                <p className="text-sm text-gray-500">
                  Opens in your default PDF reader application
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Native PDF Reader
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Full Features
                </span>
              </div>
              <span>📖 Zoom, search, bookmarks, and more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Options */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Download Option */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <HiDownload className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Download & Read Offline</h3>
                <p className="text-gray-600 mb-4">
                  Download the PDF to read offline or transfer to your preferred device.
                </p>
                <a
                  href="/The_Brain_The_Story.pdf"
                  download
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <HiDownload className="w-4 h-4 mr-2" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>

          {/* Browser Reading Option */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Read in Browser</h3>
                <p className="text-gray-600 mb-4">
                  Open the PDF directly in your web browser for quick access.
                </p>
                <a
                  href="/The_Brain_The_Story.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <HiExternalLink className="w-4 h-4 mr-2" />
                  Open in Browser
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
