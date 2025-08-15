import { motion } from 'framer-motion';
import { Music as MusicIcon, Play, ExternalLink, Heart, Users, Target } from 'lucide-react';

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
        {/* Viral Music Moment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.03 }}
          className="bg-gradient-to-r from-pink-50 to-rose-50 p-8 rounded-xl border-l-4 border-pink-500"
        >
          <div className="flex items-center mb-6">
            <Heart className="h-8 w-8 text-pink-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Viral Music Moments</h2>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-3">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <p className="text-gray-700 mb-4">
              Viral in India and what lovely, cute expression by this little girl
            </p>
            <a
              href="https://youtube.com/shorts/URI83iIoCzo?si=Ao65hUr2qugCVvsv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch on YouTube
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </motion.div>

        {/* Bhajan Gang Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-xl border-l-4 border-amber-500"
        >
          <div className="flex items-center mb-6">
            <MusicIcon className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">I am impressed with this Bhajan Gang - Nandagovindam.</h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              Refreshing to see a band of young performers impressing both grey‑haired listeners and the youth—judging by the
              smiles and energy the roaming camera captures in the crowd.
            </p>
            <a
              href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8UERmtu-FIu2wbWDBl-Vb1&si=V5tumXX1Hmx-mIEx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              <Play className="h-5 w-5 mr-2" />
              Open on YouTube Music
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </motion.div>
        {/* Quote Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border-l-4 border-gray-400"
        >
          <blockquote className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug text-center">
            “Without music, life would be a mistake.”
          </blockquote>
          <p className="mt-4 text-right text-gray-600 italic">— Friedrich Nietzsche</p>
        </motion.div>

        {/* Panchakshari Mantra Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.07 }}
          className="bg-gradient-to-r from-indigo-50 to-violet-50 p-8 rounded-xl border-l-4 border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Na-Ma-Si-Va-Ya: Panchakshari Mantra</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              Na-Ma-Si-Va-Ya. This sequence—known as the <strong>Panchakshari mantra</strong>—and the rotating syllables in
              this rendition is a goosebump experience. These five syllables denote the five elements of nature
              <span className="italic"> (earth, water, fire, air, space)</span>.
            </p>
            <a
              href="https://music.youtube.com/watch?v=qD6OKmzg_AA&si=9xTwsDN50UF8Lv6Z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Play className="h-5 w-5 mr-2" />
              Play this Na-Ma-Si-Va-Ya track
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </motion.div>

        {/* Featured Playlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-xl border-l-4 border-red-500"
        >
          <div className="flex items-center mb-6">
            <MusicIcon className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Featured Playlist</h2>
          </div>
          
                      <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">My YouTube Music Collection</h3>
              <p className="text-gray-600 mb-6">
                A carefully curated collection of tracks that resonate with my musical taste and journey.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Updated:</strong> August 2025
                </p>
              </div>
            
            <a 
              href="https://music.youtube.com/playlist?list=PLUTFXCgXawk8yPaOn2iiq1hH24OEeRVNu&si=Wxt3p7_meOmIYilq"
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

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border-l-4 border-blue-500"
        >
          <div className="flex items-center mb-6">
            <Heart className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">The Story Behind the Music</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Jack Collier & The Introduction</h3>
              <p className="text-gray-600 mb-4">
                One of our boys introduced me to Jack Collier and this track particularly, and I thank him for this discovery. 
                It's amazing how music can connect people and open up new worlds of sound.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">A Rock Somewhere with Anoushka Shankar</h3>
              <p className="text-gray-600 mb-4">
                Featuring the incredible <strong>Anoushka Shankar</strong> on Sitar and <strong>Varijashree</strong> 
                (what a unique and beautiful name!). The fusion of classical Indian music with contemporary sounds creates 
                something truly magical.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Hesham's Magic</h3>
              <p className="text-gray-600 mb-4">
                Of course, I love listening to <strong>Hesham</strong>. His music has a way of touching the soul and 
                creating moments of pure connection.
              </p>
            </div>
          </div>
        </motion.div>

        {/* YouTube Music vs Spotify */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border-l-4 border-purple-500"
        >
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Why YouTube Music & Not Spotify?</h2>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              Hahaha! I like to see what the algorithm's impression of me is - this used to be referred to as 
              <strong> 'Behavioral Targeting'</strong>. This is very early internet days, 20 odd years ago itself.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-4">
              <p className="text-gray-700">
                <strong>Fun Fact:</strong> Sometimes the ads you see are more interesting than the Live Cricket these days. 
                These folks are very creative guys, and I also get the pulse of India through their targeted content.
              </p>
            </div>
            
            <p className="text-gray-600">
              YouTube Music's algorithm has become quite sophisticated at understanding my musical preferences, 
              and I find myself discovering new artists and tracks that I wouldn't have found otherwise. 
              It's fascinating to see how technology has evolved from simple behavioral targeting to complex 
              recommendation systems.
            </p>
          </div>
        </motion.div>



        {/* Music Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-xl border-l-4 border-green-500"
        >
          <div className="flex items-center mb-6">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Musical Influences</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Classical Fusion</h3>
              <p className="text-gray-600">
                The blend of traditional Indian classical music with contemporary sounds, 
                featuring artists like Anoushka Shankar and Varijashree.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Contemporary Artists</h3>
              <p className="text-gray-600">
                Modern musicians like Jack Collier and Hesham who bring fresh perspectives 
                to the musical landscape.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MusicPage; 