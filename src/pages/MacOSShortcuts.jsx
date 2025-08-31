import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Command,
  Home,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const MacOSShortcuts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const cardRef = useRef(null);

  // macOS keyboard shortcuts flashcards
  const flashcards = [
    { front: '⌘ + C', back: 'Copy selected item to clipboard' },
    { front: '⌘ + V', back: 'Paste item from clipboard' },
    { front: '⌘ + X', back: 'Cut selected item and copy to clipboard' },
    { front: '⌘ + Z', back: 'Undo last action' },
    { front: '⌘ + A', back: 'Select all items' },
    { front: '⌘ + F', back: 'Find items in document or open Find window' },
    { front: '⌘ + S', back: 'Save current document' },
    { front: '⌘ + Tab', back: 'Switch between open applications' },
    { front: '⌘ + Space', back: 'Open Spotlight search' },
    { front: '⌘ + W', back: 'Close current window' },
  ];
  const reversedFlashcards = flashcards.slice().reverse();

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (currentIndex < reversedFlashcards.length - 1 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex(currentIndex + 1);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setFlipped(false);
        setCurrentIndex(currentIndex - 1);
        setTimeout(() => setAnimating(false), 50);
      }, 150);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setFlipped(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    }
    if (e.key === 'ArrowRight') {
      handleNext();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleFlip();
    }
    if (e.key === 'r' || e.key === 'R') {
      handleReset();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Scroll to card on mobile when card changes
  useEffect(() => {
    if (cardRef.current && window.innerWidth < 768) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const currentCard = reversedFlashcards[currentIndex];
  const progress = ((currentIndex + 1) / reversedFlashcards.length) * 100;

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
            <Home className="h-5 w-5 mr-2" />
            Back to Learning Hub
          </Link>
          <button
            onClick={handleReset}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </button>
        </div>

        <div className="flex items-center mb-4">
          <Command className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              macOS Keyboard Shortcuts
            </h1>
            <p className="text-gray-600">
              Master essential productivity shortcuts
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Card {currentIndex + 1} of {reversedFlashcards.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="flex justify-center mb-8"
        style={{ perspective: '1000px' }}
      >
        <div
          ref={cardRef}
          tabIndex={0}
          role="button"
          aria-pressed={flipped}
          className={`relative w-full max-w-2xl h-96 transition-all duration-700 transform-style-preserve-3d cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            flipped ? 'rotate-x-180' : ''
          } ${animating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
          onClick={(_e) => {
            handleFlip();
            cardRef.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFlip();
            }
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden border border-gray-100"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center flex-1 flex items-center justify-center">
              <h2 className="text-6xl font-mono font-bold text-gray-800 tracking-wider">
                {currentCard.front}
              </h2>
            </div>
            <p className="text-gray-500 mt-auto text-center">
              Click card or use ↑↓ arrows to reveal answer
            </p>
          </div>

          {/* Back of card */}
          <div
            className="absolute inset-0 bg-blue-50 rounded-3xl shadow-xl flex items-center justify-center p-8 rotate-x-180 backface-hidden border border-blue-100"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-blue-600 mb-4">
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
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
          }`}
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </button>

        <div className="text-center px-6">
          <div className="text-2xl font-bold text-gray-900">
            {currentIndex + 1} / {reversedFlashcards.length}
          </div>
          <div className="text-sm text-gray-500">Use ← → keys to navigate</div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === reversedFlashcards.length - 1}
          className={`flex items-center px-6 py-3 rounded-full transition-all ${
            currentIndex === reversedFlashcards.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
          }`}
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Keyboard Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-center">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">
              ←
            </kbd>
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">
              →
            </kbd>
            Navigate cards
          </div>
          <div className="flex items-center justify-center">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">
              ↑
            </kbd>
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">
              ↓
            </kbd>
            Flip card
          </div>
          <div className="flex items-center justify-center">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">
              R
            </kbd>
            Reset to start
          </div>
        </div>
      </div>

      {/* Completion Message */}
      {currentIndex === reversedFlashcards.length - 1 && flipped && (
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
            You've completed all {reversedFlashcards.length} macOS keyboard
            shortcuts. You're now ready to boost your productivity!
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

// CSS for 3D flip animation
const style = document.createElement('style');
style.textContent = `
  .rotate-x-180 {
    transform: rotateX(180deg);
  }
  .backface-hidden {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
`;
if (!document.head.querySelector('style[data-flashcard-styles]')) {
  style.setAttribute('data-flashcard-styles', 'true');
  document.head.appendChild(style);
}

export default MacOSShortcuts;
