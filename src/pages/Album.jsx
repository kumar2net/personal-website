import { motion } from 'framer-motion'
import { FaExternalLinkAlt } from 'react-icons/fa'

const Album = () => {
  const albumUrl = "https://photos.app.goo.gl/FFPhBFVeacvZm1dc6"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Photo Album</h1>
        <p className="text-xl text-gray-600 mb-6">
          A collection of memories and moments captured through the lens
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200">
          <p className="text-gray-700 mb-4">
            "You know what I liked? The minimalist one from Luanda. The deco's by all you are fantastic & colourful. 
            The extempore sketch by househelp shows her spontaneity and affection."
          </p>
          <p className="text-sm text-gray-500 italic mb-3">— Personal observations</p>
          <div className="border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">BGM:</span> Composed by Dharun
            </p>
          </div>
        </div>
      </div>

      {/* Album Link */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Google Photos Album</h2>
          <p className="text-gray-600">Explore the complete collection of photos and memories</p>
        </div>
        
        <a
          href={albumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <FaExternalLinkAlt className="mr-2" />
          View Album
        </a>
      </motion.div>
    </motion.div>
  )
}

export default Album
