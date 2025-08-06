import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { flashcardSets } from '../shared/flashcard-data';

const Learning = () => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Icons.BookOpen className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive flashcards to master new skills and concepts. Learn at your own pace with spaced repetition.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{flashcardSets.length}</div>
          <div className="text-gray-600">Flashcard Sets</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {flashcardSets.reduce((total, set) => total + set.cardCount, 0)}
          </div>
          <div className="text-gray-600">Total Cards</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {flashcardSets.length > 0 ? Math.ceil(flashcardSets.reduce((total, set) => total + parseInt(set.estimatedTime), 0) / flashcardSets.length) : 0} min
          </div>
          <div className="text-gray-600">Avg. Study Time</div>
        </div>
      </motion.div>

      {/* Flashcard Sets Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {flashcardSets.map((set, index) => {
          const IconComponent = Icons[set.icon] || Icons.BookOpen;
          return (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link to={`/learning/${set.id}`} className="block p-6">
                <div className="flex items-center mb-4">
                  <div className={`${set.color} p-3 rounded-lg mr-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{set.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(set.difficulty)}`}>
                        {set.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{set.category}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{set.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Icons.BookOpen className="h-4 w-4 mr-1" />
                    <span>{set.cardCount} cards</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-4 w-4 mr-1">⏱️</span>
                    <span>{set.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">Start Learning →</span>
                    <div className="flex items-center">
                      <Icons.Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1">New</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Coming Soon Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">More Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            I'm continuously adding new flashcard sets covering various topics including programming concepts, 
            language learning, science, and more. Check back regularly for new content!
          </p>
          <div className="text-sm text-gray-500">
            Suggestions for new flashcard topics? <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline">Let me know!</Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Learning; 