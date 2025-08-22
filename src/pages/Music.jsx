import { motion } from 'framer-motion';
import { Music as MusicIcon, Play, ExternalLink } from 'lucide-react';

const MusicPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Music</h1>
        <p className="text-xl text-gray-600">My curated playlist and musical journey</p>
      </div>

      <div className="space-y-8">
        {/* New YouTube Music Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-xl border-l-4 border-red-500"
        >
          <div className="flex items-center mb-6">
            <MusicIcon className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Latest Music</h2>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Jogiya</h3>
            <p className="text-gray-600 mb-6">
              A beautiful track
            </p>
            <a
              href="https://music.youtube.com/watch?v=7owsi-rTf2I&si=gdH2svbaI5BPn5Sp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Play className="h-5 w-5 mr-2" />
              Listen on YouTube Music
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </motion.div>

        {/* Featured Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border-l-4 border-blue-500"
        >
          <div className="flex items-center mb-6">
            <MusicIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">My Playlists</h2>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">YouTube Music Collection</h3>
            <p className="text-gray-600 mb-6">
              A carefully curated collection of tracks that resonate with my musical taste and journey. Jab tu Sajan is a lovely track too.
            </p>
            
            <a 
              href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8yPaOn2iiq1hH24OEeRVNu&si=Wxt3p7_meOmIYilq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4"
            >
              <Play className="h-5 w-5 mr-2" />
              Main Playlist
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>

            
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MusicPage; 