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
              tracks from Bollywood hits to Tamil Kurals and spiritual
              melodies. Dive in to explore the sounds that inspire and move me.
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-900/60 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Fresh spins
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The last two tracks I tucked into the playlist change the tempo and
            mood in the best way possible.
          </p>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-100 dark:border-slate-800 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-red-500 mb-1">
                Pointless — Lewis Capaldi
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                Piano-forward confessionals with Capaldi’s grainy vocals remind
                me why slow pop ballads still hit harder than EDM drops. It’s
                become my go-to cooldown after late-night writing sessions.
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 dark:border-slate-800 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-red-500 mb-1">
                7 Years — Lukas Graham
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                The coming-of-age anthem that keeps looping through my head.
                Its reflective verses are the perfect reset between upbeat
                Tamil hooks and synth drops.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900/80 border border-slate-200 dark:border-slate-800 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3">
              Growing with the playlist
            </p>
            <blockquote className="text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
              “Once, I was seven years old, my mama told me<br />
              Go make yourself some friends or you’ll be lonely.”<br />
              …<br />
              “Soon, I’ll be sixty years old, will I think the world is cold<br />
              Or will I have a lot of children who can warm me?”
            </blockquote>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
              Lukas Graham’s lyrics hit different lately—I’m closer to that
              sixty-year mark than the seven-year swagger, and the playlist is
              turning into a scrapbook of everyone warming the journey.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MusicPage;
