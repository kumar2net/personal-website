import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaExternalLinkAlt, FaImages, FaPlay, FaVideo } from 'react-icons/fa';

const Album = () => {
  const albumUrl = 'https://photos.app.goo.gl/FFPhBFVeacvZm1dc6';
  const [isMobile] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  });

  const handleAlbumClick = () => {
    if (isMobile) {
      // For mobile devices, try multiple approaches
      try {
        // First, try to open in the same tab (better for Google Photos app)
        window.location.href = albumUrl;
      } catch (_error) {
        console.log('Same tab failed, trying new tab...');
        try {
          // Fallback to new tab
          window.open(albumUrl, '_blank', 'noopener,noreferrer');
        } catch (_fallbackError) {
          console.log('New tab failed, trying direct navigation...');
          // Final fallback - direct navigation
          window.location.assign(albumUrl);
        }
      }
    } else {
      // For desktop, use new tab
      window.open(albumUrl, '_blank', 'noopener,noreferrer');
    }
  };

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
            "You know what I liked? The minimalist one from Luanda. The deco's
            by all you are fantastic & colourful. The extempore sketch by
            househelp shows her spontaneity and affection."
          </p>
          <p className="text-sm text-gray-500 italic mb-3">
            — Personal observations
          </p>
          <div className="border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">BGM:</span> Composed by Dharun
            </p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          What's Inside:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FaVideo className="w-4 h-4 mr-2 text-red-500" />
            <span>Personal video memories</span>
          </div>
          <div className="flex items-center">
            <FaImages className="w-4 h-4 mr-2 text-blue-500" />
            <span>Photo collections</span>
          </div>
          <div className="flex items-center">
            <FaPlay className="w-4 h-4 mr-2 text-green-500" />
            <span>Playable video content</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 mr-2 text-purple-500">🎵</span>
            <span>Background music by Dharun</span>
          </div>
        </div>
      </motion.div>

      {/* Album Link */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          {/* Enhanced visual with video indicators */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FaImages className="w-8 h-8 text-white" />
            {/* Video play button overlay */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <FaPlay className="w-3 h-3 text-white ml-0.5" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Photo & Video Album
          </h2>
          <p className="text-gray-600 mb-3">
            Explore the complete collection of photos and videos
          </p>

          {/* Content indicators */}
          <div className="flex items-center justify-center space-x-6 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <FaImages className="w-4 h-4 mr-1 text-blue-500" />
              <span>Photos</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaVideo className="w-4 h-4 mr-1 text-red-500" />
              <span>Videos</span>
            </div>
          </div>

          {isMobile && (
            <p className="text-sm text-blue-600 mt-2">
              📱 Tap to open in Google Photos app or browser
            </p>
          )}
        </div>

        <button
          onClick={handleAlbumClick}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer relative overflow-hidden group"
        >
          <FaPlay className="mr-2 text-red-200" />
          <span>Watch Videos & View Photos</span>
          <FaExternalLinkAlt className="ml-2 text-sm opacity-75" />

          {/* Subtle video indicator */}
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full opacity-75"></div>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Album;
