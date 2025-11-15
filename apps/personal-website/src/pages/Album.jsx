import { motion } from "framer-motion";
import { useState } from "react";
import { FaExternalLinkAlt, FaImages, FaPlay, FaVideo } from "react-icons/fa";

const albums = [
  {
    title: "Family Highlights",
    description:
      "Some new images from S boy, some interesting clippings etc...",
    url: "https://photos.app.goo.gl/ej2zF3go6NVt7Pgv6",
  },
  {
    title: "Ragas Dental Camp Diaries",
    description:
      "Snapshots from the budding dentist’s internship week – queues of patients in Puducherry, Thiruvanmiyur’s Nagarpura clinic, and the team in full PPE. A lighthearted look at serious service.",
    url: "https://photos.google.com/album/AF1QipMca59QS3tW1s8Ss0oyteTvGIzENgeNt6s0M1lF",
  },
];

const Album = () => {
  const [isMobile] = useState(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  });

  const handleAlbumClick = (albumUrl) => {
    if (isMobile) {
      // For mobile devices, try multiple approaches
      try {
        // First, try to open in the same tab (better for Google Photos app)
        window.location.href = albumUrl;
      } catch (error) {
        console.log("Same tab failed, trying new tab...", error);
        try {
          // Fallback to new tab
          window.open(albumUrl, "_blank", "noopener,noreferrer");
        } catch (fallbackError) {
          console.log("New tab failed, trying direct navigation...", fallbackError);
          // Final fallback - direct navigation
          window.location.assign(albumUrl);
        }
      }
    } else {
      // For desktop, use new tab
      window.open(albumUrl, "_blank", "noopener,noreferrer");
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
        <p className="text-xl text-gray-600 mb-6">Captured Moments</p>
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 text-left max-w-3xl mx-auto dark:bg-slate-900/70 dark:border-blue-400/70">
          <p className="text-gray-800 dark:text-gray-100">
            A rolling gallery—from Duke-boy’s DC visit and Mylapore Bhavan
            pitstops to on-ground shots from our budding dentist’s internship
            camps. Tap through to wander the latest frames straight from the
            phone roll.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {albums.map((album, index) => (
          <motion.div
            key={album.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="bg-white rounded-xl shadow-lg p-8 text-center flex flex-col"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{album.title}</h2>
              <p className="text-gray-600 mb-3">{album.description}</p>

              {isMobile && (
                <p className="text-sm text-blue-600 mt-2">
                  📱 Tap to open in Google Photos app or browser
                </p>
              )}
            </div>

            <button
              onClick={() => handleAlbumClick(album.url)}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
            >
              <FaImages className="mr-2" />
              <span>Open Google Photos</span>
              <FaExternalLinkAlt className="ml-2 text-sm opacity-75" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Album;
