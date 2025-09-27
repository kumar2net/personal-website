import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaExternalLinkAlt, FaImages, FaPlay, FaVideo } from 'react-icons/fa';

const Album = () => {
  const albumUrl = 'https://photos.app.goo.gl/DRSrd1SqpRgHRdfF6';
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
        <p className="text-xl text-gray-600 mb-6">BJ Phuket Vacation</p>
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 text-left max-w-3xl mx-auto">
          <p className="text-gray-800">
            Bro is inbetween jobs and took a brief vacation to Phuket. With boys away pursuing their career and education they now need to find peace with themselves. There is a saying "Sometimes you must loose the string to let the arrow fly."
          </p>
        </div>
      </div>

      {/* Simplified embed/CTA */}

      {/* Album Link */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Open Google Photos Album</h2>
          <p className="text-gray-600 mb-3">Opens in a new tab. You can add photos, view and share.</p>

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
          <FaImages className="mr-2" />
          <span>Open Google Photos</span>
          <FaExternalLinkAlt className="ml-2 text-sm opacity-75" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Album;
