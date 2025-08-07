import { Link } from 'react-router-dom'
import { HiBookOpen } from 'react-icons/hi'

function Books() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Books</h1>
        <p className="text-gray-600 mt-2">Reading notes and handbooks</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/books/applying-cornell-method"
          aria-label="Read Applying the Cornell Method"
          className="group bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 sm:p-4 flex flex-col"
        >
          <div className="rounded-md h-40 sm:h-48 bg-gray-100 border flex items-center justify-center">
            <HiBookOpen className="w-16 h-16 text-gray-400" aria-hidden="true" />
            <span className="sr-only">Book cover placeholder</span>
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

