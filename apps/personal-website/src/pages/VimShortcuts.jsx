import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const VimShortcuts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const cardRef = useRef(null);

  // Essential Vim keyboard shortcuts flashcards
  const flashcards = [
    { front: "h j k l", back: "Basic navigation: left, down, up, right" },
    { front: "i", back: "Enter Insert mode (insert before cursor)" },
    { front: "a", back: "Enter Insert mode (insert after cursor)" },
    { front: "o", back: "Open new line below and enter Insert mode" },
    { front: "Esc", back: "Exit Insert mode, return to Normal mode" },
    { front: ":w", back: "Save (write) the current file" },
    { front: ":q", back: "Quit Vim (fails if unsaved changes)" },
    { front: ":wq", back: "Save and quit Vim" },
    { front: ":q!", back: "Quit without saving (force quit)" },
    { front: "x", back: "Delete character under cursor" },
    { front: "dd", back: "Delete (cut) entire current line" },
    { front: "yy", back: "Yank (copy) entire current line" },
    { front: "p", back: "Paste after cursor/current line" },
    { front: "u", back: "Undo last action" },
    { front: "Ctrl + r", back: "Redo (opposite of undo)" },
    { front: "/search", back: "Search for 'search' text in file" },
    { front: "n", back: "Go to next search result" },
    { front: "N", back: "Go to previous search result" },
    { front: "gg", back: "Go to beginning of file" },
    { front: "G", back: "Go to end of file" },
    { front: "0", back: "Go to beginning of current line" },
    { front: "$", back: "Go to end of current line" },
    { front: "w", back: "Jump forward to start of next word" },
    { front: "b", back: "Jump backward to start of previous word" },
    { front: "v", back: "Enter Visual mode (character selection)" },
  ];
  const reversedFlashcards = flashcards.slice().reverse();
  const totalCards = reversedFlashcards.length;

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (animating || currentIndex >= totalCards - 1) {
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setFlipped(false);
      setCurrentIndex((prev) => Math.min(prev + 1, totalCards - 1));
      setTimeout(() => setAnimating(false), 50);
    }, 150);
  }, [animating, currentIndex, totalCards]);

  const handlePrevious = useCallback(() => {
    if (animating || currentIndex <= 0) {
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setFlipped(false);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      setTimeout(() => setAnimating(false), 50);
    }, 150);
  }, [animating, currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setFlipped(false);
    setAnimating(false);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      }
      if (e.key === "ArrowRight") {
        handleNext();
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        handleFlip();
      }
      if (e.key === "r" || e.key === "R") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleFlip, handleNext, handlePrevious, handleReset]);

  // Scroll to card on mobile when card changes
  useEffect(() => {
    if (cardRef.current && window.innerWidth < 768) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <Terminal className="h-8 w-8 text-purple-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vim Keyboard Shortcuts
            </h1>
            <p className="text-gray-600">
              Master essential Vim commands for efficient text editing
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
        style={{ perspective: "1000px" }}
      >
        <div
          ref={cardRef}
          tabIndex={0}
          role="button"
          aria-pressed={flipped}
          className={`relative w-full max-w-2xl h-96 transition-all duration-700 transform-style-preserve-3d cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${
            flipped ? "rotate-x-180" : ""
          } ${animating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
          onClick={() => {
            handleFlip();
            cardRef.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleFlip();
            }
          }}
        >
          {/* Front of card */}
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden border border-gray-100">
            <div className="text-center flex-1 flex items-center justify-center">
              <h2 className="text-5xl font-mono font-bold text-gray-800 tracking-wider bg-gray-100 px-6 py-3 rounded-lg">
                {currentCard.front}
              </h2>
            </div>
            <p className="text-gray-500 mt-auto text-center">
              Click card or use ↑↓ arrows to reveal answer
            </p>
          </div>

          {/* Back of card */}
          <div
            className="absolute inset-0 bg-purple-50 rounded-3xl shadow-xl flex items-center justify-center p-8 rotate-x-180 backface-hidden border border-purple-100"
            style={{
              transform: "rotateX(180deg)",
            }}
          >
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-purple-600 mb-4 bg-white px-4 py-2 rounded-lg inline-block">
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
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg"
          }`}
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </button>
      </div>

      {/* Vim Modes Info */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
          Vim Modes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium text-purple-700">Normal Mode</div>
            <div className="text-gray-600">Navigation & commands</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">✏️</div>
            <div className="font-medium text-indigo-700">Insert Mode</div>
            <div className="text-gray-600">Text editing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-pink-700">Visual Mode</div>
            <div className="text-gray-600">Text selection</div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Study Controls
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
          className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6 text-center"
        >
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            Vim Master!
          </h3>
          <p className="text-purple-700 mb-4">
            You've learned {reversedFlashcards.length} essential Vim shortcuts!
            You're now ready to edit text like a pro! Remember: practice makes
            perfect in Vim! 💜
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Study Again
            </button>
            <Link
              to="/learning"
              className="px-4 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
            >
              More Flashcards
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VimShortcuts;
