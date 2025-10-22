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
        {/* Recent Music Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl border-l-4 border-purple-500"
        >
          <div className="flex items-center mb-6">
            <MusicIcon className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">The music I enjoyed listening recently</h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-6">
              A curated selection of tracks that have been on repeat lately, featuring a beautiful mix of Bollywood hits, Tamil classics, and spiritual melodies.
            </p>

            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <img
                src="/media/music_snapshot.png"
                alt="Recent music playlist snapshot showing tracks: Rise from Fire - Janaki Version, Never Enough (Nils Hoffmann Remix), ABOUT YOU, Tell Me (feat. Hero Baldwin)"
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-center text-gray-400 py-8">
                <MusicIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p className="text-lg font-medium mb-2">Recent Music Playlist</p>
                <p className="text-sm">Loading playlist image...</p>
                <div className="mt-4 text-left text-sm space-y-1">
                  <p>• Rise from Fire (Janaki Version) — Sarath Santosh, Ghibran</p>
                  <p>• Never Enough (Nils Hoffmann Remix) — TWO LANES</p>
                  <p>• ABOUT YOU — AVAION</p>
                  <p>• Tell Me (feat. Hero Baldwin) — Tinlicker & Helsloot</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Quick notes on each track:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>
                  <span className="font-medium">Rise from Fire — Janaki Version</span>: stirring South Indian vocal over epic, uplifting orchestration.
                </li>
                <li>
                  <span className="font-medium">Never Enough (Nils Hoffmann Remix)</span>: polished melodic house; airy pads with a clean, satisfying drop.
                </li>
                <li>
                  <span className="font-medium">ABOUT YOU</span>: moody deep house from AVAION with emotive hooks and warm bass.
                </li>
                <li>
                  <span className="font-medium">Tell Me (feat. Hero Baldwin)</span>: progressive, melodic techno; shimmering synths and a soaring chorus.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Kumar Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-xl border-l-4 border-red-500"
        >
          <div className="flex items-center mb-6">
            <MusicIcon className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Kumar Playlist</h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-6">
              My complete curated playlist featuring a diverse collection of tracks from Bollywood hits to Tamil classics and spiritual melodies.
            </p>

            <a
              href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8yPaOn2iiq1hH24OEeRVNu&si=bb_bAFMsmnMXfRWr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-medium"
            >
              <Play className="h-5 w-5 mr-3" />
              Listen to Kumar Playlist
              <ExternalLink className="h-4 w-4 ml-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MusicPage;
