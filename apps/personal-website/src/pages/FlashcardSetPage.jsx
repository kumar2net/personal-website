import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { flashcardSets } from "../shared/flashcard-data";

const FlashcardSetPage = () => {
  const { setId } = useParams();
  const set = flashcardSets.find((s) => s.id === setId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  if (!set) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Flashcard Set Not Found</h2>
        <p className="mb-6">The set you are looking for does not exist.</p>
        <Link to="/learning" className="text-blue-600 hover:underline">
          Back to Learning Hub
        </Link>
      </div>
    );
  }

  const IconComponent = Icons[set.icon] || Icons.BookOpen;
  const currentCard = set.cards[currentIndex];
  const progress = ((currentIndex + 1) / set.cards.length) * 100;

  function handleFlip() {
    setFlipped((f) => !f);
  }
  function handleNext() {
    if (currentIndex < set.cards.length - 1 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex((i) => i + 1);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  }
  function handlePrevious() {
    if (currentIndex > 0 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex((i) => i - 1);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  }
  function handleReset() {
    setCurrentIndex(0);
    setFlipped(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/learning"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Icons.Home className="h-5 w-5 mr-2" />
            Back to Learning Hub
          </Link>
          <button
            onClick={handleReset}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Icons.RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </button>
        </div>
        <div className="flex items-center mb-4">
          <IconComponent className={`h-8 w-8 mr-3 ${set.color} text-white`} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{set.title}</h1>
            <p className="text-gray-600">{set.description}</p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`${set.color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Card {currentIndex + 1} of {set.cards.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>
      {/* Flashcard */}
      <div className="flex justify-center mb-8 flashcard-container">
        <div
          className={`relative w-full max-w-2xl h-96 cursor-pointer flashcard ${
            flipped ? "is-flipped" : ""
          } ${animating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border border-gray-100 flashcard-face">
            <div className="text-center flex-1 flex items-center justify-center">
              <h2 className="text-4xl font-mono font-bold text-gray-800 tracking-wider">
                {currentCard.front}
              </h2>
            </div>
            <p className="text-gray-500 mt-auto text-center">
              Click card or use ↑↓ arrows to reveal answer
            </p>
          </div>
          {/* Back of card */}
          <div className="absolute inset-0 bg-gray-50 rounded-3xl shadow-xl flex items-center justify-center p-8 border border-gray-100 flashcard-face flashcard-face-back">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold mb-4">
                {currentCard.front}
              </div>
              <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-6 mb-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center px-6 py-3 rounded-full transition-all ${
            currentIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
          }`}
        >
          <Icons.ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </button>
        <div className="text-center px-6">
          <div className="text-2xl font-bold text-gray-900">
            {currentIndex + 1} / {set.cards.length}
          </div>
          <div className="text-sm text-gray-500">Use ← → keys to navigate</div>
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex === set.cards.length - 1}
          className={`flex items-center px-6 py-3 rounded-full transition-all ${
            currentIndex === set.cards.length - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : `${set.color} text-white hover:opacity-90 shadow-md hover:shadow-lg`
          }`}
        >
          Next
          <Icons.ChevronRight className="h-5 w-5 ml-2" />
        </button>
      </div>
      {/* Completion Message */}
      {currentIndex === set.cards.length - 1 && flipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center"
        >
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Congratulations!
          </h3>
          <p className="text-green-700 mb-4">
            You've completed all {set.cards.length} cards in this set!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Study Again
            </button>
            <Link
              to="/learning"
              className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
            >
              More Flashcards
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlashcardSetPage;
