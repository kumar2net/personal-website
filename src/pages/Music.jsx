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
            <h3 className="text-xl font-semibold mb-4 text-gray-800">This Week's Melting Tracks</h3>
            <p className="text-gray-600 mb-6">
              These two tracks just melt me completely 
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400">
              <p className="text-sm text-gray-700 italic">
                <strong>All-time Favorite:</strong> Karthick Iyer of Indo Soul - touches the soul.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg mb-6 border-l-4 border-green-400">
              <p className="text-sm text-gray-700 italic">
                <strong>Master of Medley:</strong> Mahesh - from Nadhaswaram and Thavil to Geoshrd!
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-lg text-gray-800">Ab Na Jao Chod Kar</h4>
                <p className="text-sm text-gray-600 mb-2">A soul-stirring melody that touches the depths of emotion</p>
                
                <div className="bg-gray-50 p-4 rounded-lg my-3 italic text-sm text-gray-700 leading-relaxed">
                  <p className="mb-2">Abhi na jao chhod kar</p>
                  <p className="mb-2">Ke dil abhi bhara nahi</p>
                  <p className="mb-2">Abhi abhi to aayi ho, abhi abhi to</p>
                  <p className="mb-2">Abhi abhi to aayi ho, bahar banke chhayi ho</p>
                  <p className="mb-2">Hawa zara mehak to le, nazar zara behak to le</p>
                  <p className="mb-2">Yeh shaam dhal to le zara</p>
                  <p className="mb-2">Yeh dil sambhal to le zara</p>
                  <p className="mb-2">Main thodi deir jee to loon</p>
                  <p className="mb-2">Nashe ke ghoont pee to loon</p>
                  <p className="mb-2">Abhi to kuchh kaha nahi</p>
                  <p className="mb-2">Abhi to kuchh sun nahi</p>
                  <p>Abhi na jao chhod kar ke dil abhi bhara nahi</p>
                </div>
                
                <a
                  href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8yPaOn2iiq1hH24OEeRVNu&si=Wxt3p7_meOmIYilq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Find in KUMAR_2025 Playlist
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </div>
              
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-lg text-gray-800">Narumugaye</h4>
                <p className="text-sm text-gray-600 mb-2">A hauntingly beautiful composition that resonates deep within. Flute by Siva is just out of this world.</p>
                <a
                  href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8yPaOn2iiq1hH24OEeRVNu&si=Wxt3p7_meOmIYilq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Find in KUMAR_2025 Playlist
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