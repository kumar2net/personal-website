import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BoyWithMusicInVeins = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Back button */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blog
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">Boy with Music in His Veins</h1>

      {/* Date */}
      <div className="flex items-center text-gray-600 mb-8">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>August 29, 2025</span>
      </div>

      {/* Shields.io badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <img
          src="https://img.shields.io/badge/Music-FF6B6B?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Music"
        />
        <img
          src="https://img.shields.io/badge/Piano-4ECDC4?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Piano"
        />
        <img
          src="https://img.shields.io/badge/Composition-45B7D1?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Composition"
        />
        <img
          src="https://img.shields.io/badge/Trinity-9B59B6?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Trinity"
        />
        <img
          src="https://img.shields.io/badge/Yamaha-E74C3C?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Yamaha"
        />
        <img
          src="https://img.shields.io/badge/Logic_Pro-000000?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Logic Pro"
        />
      </div>

      <div className="space-y-8 prose prose-lg max-w-none">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold">A Young Musician's Journey</h2>
          <p>
            Meet Dharun, my good friend Senthil's son, a 15-year-old music
            fanatic and passionate pianist whose love for music began at the
            tender age of four. When most children are learning to read and
            write, Dharun was already exploring the world of melodies and
            harmonies. His journey from a curious toddler to a Grade 7 Trinity
            pianist is nothing short of extraordinary.
          </p>

          {/* Audio Interview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Listen to Dharun's Story
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Hear Dharun discuss his musical journey, composition process, and
              passion for piano in this exclusive interview.
            </p>
            <audio controls className="w-full" preload="metadata">
              <source src="/media/AKDStalk.wav" type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <p className="text-xs text-gray-500 mt-2">
              Duration: ~3 minutes | Format: WAV | Interview about Dharun's
              musical journey
            </p>
          </div>

          {/* Dharun at the Piano */}
          <div className="mt-8 text-center">
            <img
              src="/media/Dharun_keys.jpg"
              alt="Dharun playing the piano"
              className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              style={{ maxHeight: '500px' }}
            />
            <p className="text-sm text-gray-600 mt-3 italic">
              Dharun at the piano - where his musical journey comes to life
            </p>
          </div>
        </section>

        {/* Early Beginnings */}
        <section>
          <h2 className="text-2xl font-bold">The Early Spark</h2>
          <p>
            Dharun's musical journey began on his first birthday when his father
            gifted him his first musical instrument. From that moment, music
            became more than just a hobby—it became his calling. By the age of
            four, he was already attending music classes, showing an innate
            understanding of rhythm and melody that would set the foundation for
            his future as a composer.
          </p>
        </section>

        {/* Current Status */}
        <section>
          <h2 className="text-2xl font-bold">Current Musical Pursuits</h2>
          <p>
            Currently in Class 10, Dharun has achieved remarkable milestones in
            his musical education. He has completed Trinity Grade 7 and is now
            working towards Grade 8. His focus areas include original
            composition and classical music, demonstrating a maturity in musical
            understanding that belies his young age.
          </p>
        </section>

        {/* Social Media and Online Presence */}
        <section>
          <h2 className="text-2xl font-bold">
            Follow Dharun's Musical Journey
          </h2>
          <p className="mb-4">
            Dharun shares his musical journey, compositions, and performances on
            social media. Follow him to stay updated with his latest creations
            and musical progress.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://www.instagram.com/dharunkeys?igsh=YzljYTk1ODg3Zg=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-8 h-8 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <div>
                <div className="font-semibold text-lg">@dharunkeys</div>
                <div className="text-sm opacity-90">Follow on Instagram</div>
              </div>
            </a>

            <a
              href="https://music.youtube.com/watch?v=DtD83M2LLe8&si=ZECV85r5e-ctBG_H"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-8 h-8 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <div>
                <div className="font-semibold text-lg">YouTube Music</div>
                <div className="text-sm opacity-90">Watch performances</div>
              </div>
            </a>
          </div>
        </section>

        {/* Instruments and Equipment */}
        <section>
          <h2 className="text-2xl font-bold">The Tools of His Trade</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Home Studio Setup</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Yamaha CLP-845</strong> - A premium 88-key home piano with
              pure wood construction, perfect for practice and composition
            </li>
            <li>
              <strong>Yamaha CK-88</strong> - 88-key stage piano for live
              performances and recording sessions
            </li>
            <li>
              <strong>Yamaha SX-700</strong> - 61-key arranger keyboard for
              creating backing tracks and arrangements
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Digital Audio Workstation
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Logic Pro</strong> - Professional Digital Audio
              Workstation (DAW) for recording, mixing, and mastering
            </li>
            <li>
              <strong>Mac Mini</strong> - Connected via MIDI for seamless
              integration with his instruments
            </li>
            <li>
              <strong>Export Workflow</strong> - Converts compositions to WAV
              format for distribution on YouTube and Instagram
            </li>
          </ul>
        </section>

        {/* Personal Reflection */}
        <section>
          <h2 className="text-2xl font-bold">A Different Way of Thinking</h2>
          <p>
            Dharun is thinking differently. His approach to music goes beyond
            traditional learning—he's creating his own path, combining classical
            training with modern technology in ways that many musicians his age
            haven't considered. He says all the notes are in his head and he can
            play them on the piano - muscle memory he says. How he develops
            himself from here and where his journey takes him is something I
            will be watching with great interest.
          </p>
          <blockquote className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 italic text-lg">
            "Choose a job you love, and you will never have to work a day in
            your life."
            <footer className="text-sm text-gray-600 mt-2">— Confucius</footer>
          </blockquote>
          <p className="mt-4">
            Dharun embodies this philosophy perfectly. At just 15, he has
            already found his passion and is living it every day. His dedication
            to music isn't work—it's pure joy and fulfillment. This is the kind
            of authentic passion that creates extraordinary artists and lasting
            legacies.
          </p>
        </section>
      </div>

      {/* Blog interactions */}
    </motion.div>
  );
};

export default BoyWithMusicInVeins;
