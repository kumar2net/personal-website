import { Link } from 'react-router-dom'
import BookCover from '../components/BookCover'

function Books() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Books</h1>
        <p className="text-gray-600 mt-2">Reading notes and handbooks</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/books/the-brain-story-content"
          aria-label="Read The Brain: The Story of You"
          className="group bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 sm:p-4 flex flex-col"
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-blue-100 border overflow-hidden relative">
            <BookCover
              bookId="the-brain-story"
              title="The Brain: The Story of You"
              author="David Eagleman"
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold group-hover:underline">The Brain: The Story of You</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img src="https://img.shields.io/badge/Neuroscience-Brain%20Science-purple" alt="Neuroscience badge" />
              <img src="https://img.shields.io/badge/AI%20%26%20Technology-Neural%20Implants-orange" alt="AI Technology badge" />
            </div>
            <p className="text-gray-600 mt-3 text-sm sm:text-base">One of the best books I have read in a while. Observing all the advances in AI and listening to gyan from my kin on neurology brain implants, wanted to dig deeper. As they say these days - learn from First Principles</p>
            <div className="mt-4">
              <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Read PDF</span>
            </div>
          </div>
        </Link>

        <Link
          to="/books/applying-cornell-method"
          aria-label="Read Applying the Cornell Method"
          className="group bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 sm:p-4 flex flex-col"
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-green-100 to-blue-100 border overflow-hidden relative">
            <BookCover
              bookId="cornell-method"
              title="Applying the Cornell Method"
              author="Study Method Guide"
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold group-hover:underline">Applying the Cornell Method</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img src="https://img.shields.io/badge/Note--Taking-Cornell%20Method-blue" alt="Cornell Method badge" />
              <img src="https://img.shields.io/badge/Study%20Skills-Productivity-green" alt="Study skills badge" />
            </div>
            <p className="text-gray-600 mt-3 text-sm sm:text-base">Verbatim content embedded from the original document.</p>
            <div className="mt-4">
              <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Read more</span>
            </div>
          </div>
        </Link>
      </section>
    </div>
  )
}

export default Books

