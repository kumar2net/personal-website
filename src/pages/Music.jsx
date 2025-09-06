import { motion } from 'framer-motion';
import { ExternalLink, Music as MusicIcon, Play } from 'lucide-react';

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
        <p className="text-xl text-gray-600">
          My curated playlist and musical journey
        </p>
      </div>

      <div className="space-y-8">
        {/* Latest Additions to KUMAR_2005 Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-xl border-l-4 border-red-500"
        >
          <div className="flex items-center mb-6">
            <MusicIcon className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Latest Additions</h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Newest Tracks in KUMAR_2005
            </h3>
            <p className="text-gray-600 mb-6">
              The 2 newest additions to my playlist. They will appear at the fag end of the playlist
            </p>

            <div className="space-y-6">
              {/* Track 1 - Janaab-e-Aali */}
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-lg text-gray-800">
                  Janaab-e-Aali
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  A beautiful collaboration featuring Sachet Parampara, Saaj Bhatt & Pritam. 
                  This track brings together exceptional vocal talent with Pritam's signature musical style.
                </p>
                <a
                  href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8yPaOn2iiq1hH24OEeRVNu&si=Wxt3p7_meOmIYilq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Find in KUMAR_2005 Playlist
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </div>

              {/* Track 2 - Jo Zindagi Tha Meri */}
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-lg text-gray-800">
                  Jo Zindagi Tha Meri
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  A soulful composition by Shaan & Daboo Malik. This track captures the essence 
                  of life's journey with beautiful melodies and heartfelt lyrics.
                </p>
                <a
                  href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8yPaOn2iiq1hH24OEeRVNu&si=Wxt3p7_meOmIYilq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Find in KUMAR_2005 Playlist
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MusicPage;
