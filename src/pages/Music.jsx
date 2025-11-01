import { motion } from "framer-motion";
import { ExternalLink, Music as MusicIcon, Play } from "lucide-react";

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
            <h2 className="text-2xl font-bold text-gray-800">
              The music I enjoyed listening recently
            </h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 text-white shadow-inner">
              <p className="text-sm uppercase tracking-widest text-purple-300 mb-2">
                On repeat
              </p>
              <h3 className="text-2xl font-bold mb-3">Cheenikallu</h3>
              <p className="text-gray-200 leading-relaxed mb-4">
                The groove and lyrical warmth of Cheenikallu have been the
                backdrop to most evenings this week. It is the kind of song that
                makes me feel good about kollywood music. Kabaddi Kabaddi
                Kabaddi rings in my ears.
              </p>
              <a
                href="https://music.youtube.com/search?q=cheenikallu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Play className="h-4 w-4 mr-2" />
                Find Cheenikallu on YT Music
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </div>

            <div>
              <p className="text-gray-700 font-semibold mb-2">
                Other tracks on the current loop
              </p>
              <ul className="text-gray-600 space-y-1">
                <li>• Janaab-e-Aali — Sachet Parampara, Saaj Bhatt & Pritam</li>
                <li>• Jo Zindagi Tha Meri — Shaan & Daboo Malik</li>
                <li>
                  • Anthichoppu Maayum — Ilaiyaraaja, M.G. Sreekumar & K.S.
                  Chithra
                </li>
                <li>• Chanakya — Rishab Rikhiram Sharma</li>
                <li>• Idhuvum Kadandhu Pogum — Sid Sriram</li>
                <li>• Krish Theme — Kiran Baral</li>
                <li>
                  • Sri Varalakshmi Namastubhyam — Purva Dhanashree Cotah &
                  Paavani Cotah
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
              My complete curated playlist featuring a diverse collection of
              tracks from Bollywood hits to Tamil classics and spiritual
              melodies.
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
