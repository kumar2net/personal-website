import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Home, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BrowserShortcuts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Browser keyboard shortcuts flashcards for Safari and Chrome
  const flashcards = [
    { front: "⌘ + T", back: "Open new tab (Safari & Chrome)" },
    { front: "⌘ + W", back: "Close current tab (Safari & Chrome)" },
    { front: "⌘ + R", back: "Reload/refresh current page (Safari & Chrome)" },
    { front: "⌘ + L", back: "Focus address bar to type URL (Safari & Chrome)" },
    { front: "⌘ + D", back: "Bookmark current page (Safari & Chrome)" },
    { front: "⌘ + Shift + T", back: "Reopen recently closed tab (Safari & Chrome)" },
    { front: "⌘ + [", back: "Go back to previous page (Safari & Chrome)" },
    { front: "⌘ + ]", back: "Go forward to next page (Safari & Chrome)" },
    { front: "⌘ + 1-9", back: "Switch to tab by number (Safari & Chrome)" },
    { front: "⌘ + Shift + N", back: "Open incognito/private browsing window (Safari & Chrome)" },
    { front: "⌘ + F", back: "Find text on current page (Safari & Chrome)" },
    { front: "⌘ + +", back: "Zoom in on page (Safari & Chrome)" },
    { front: "⌘ + -", back: "Zoom out on page (Safari & Chrome)" },
    { front: "⌘ + 0", back: "Reset zoom to default size (Safari & Chrome)" },
    { front: "⌘ + Shift + Delete", back: "Clear browsing data (Chrome) / Clear history (Safari)" }
  ];

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1 && !animating) {
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
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleFlip();
    }
    if (e.key === 'r' || e.key === 'R') handleReset();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, flashcards.length, flipped, animating]);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

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
          <Globe className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browser Keyboard Shortcuts</h1>
            <p className="text-gray-600">Master Safari & Chrome shortcuts for faster browsing</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Card {currentIndex + 1} of {flashcards.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center mb-8" style={{ perspective: '1000px' }}>
        <div
          className={`relative w-full max-w-2xl h-96 transition-all duration-700 transform-style-preserve-3d cursor-pointer ${
            flipped ? 'rotate-x-180' : ''
          } ${animating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
          onClick={handleFlip}
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
            className="absolute inset-0 bg-green-50 rounded-3xl shadow-xl flex items-center justify-center p-8 rotate-x-180 backface-hidden border border-green-100"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)'
            }}
          >
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-green-600 mb-4">
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
            {currentIndex + 1} / {flashcards.length}
          </div>
          <div className="text-sm text-gray-500">
            Use ← → keys to navigate
          </div>
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className={`flex items-center px-6 py-3 rounded-full transition-all ${
            currentIndex === flashcards.length - 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
          }`}
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </button>
      </div>

      {/* Browser Info */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Browser Compatibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-medium text-blue-700">Safari</div>
            <div className="text-gray-600">All shortcuts work in Safari</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🟡</div>
            <div className="font-medium text-green-700">Chrome</div>
            <div className="text-gray-600">All shortcuts work in Chrome</div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Keyboard Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-center">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">←</kbd>
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">→</kbd>
            Navigate cards
          </div>
          <div className="flex items-center justify-center">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">↑</kbd>
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">↓</kbd>
            Flip card
          </div>
          <div className="flex items-center justify-center">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300 mr-2">R</kbd>
            Reset to start
          </div>
        </div>
      </div>

      {/* Completion Message */}
      {currentIndex === flashcards.length - 1 && flipped && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center"
        >
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Excellent!</h3>
          <p className="text-green-700 mb-4">
            You've mastered all {flashcards.length} browser shortcuts! Your web browsing is about to get much faster! 🚀
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

export default BrowserShortcuts; 