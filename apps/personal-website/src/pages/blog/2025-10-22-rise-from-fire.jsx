import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RiseFromFire = () => {
  const navigate = useNavigate();
  const publishedDate = new Date('2025-10-22T00:00:00Z');
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
      <h1 className="text-4xl font-bold mb-3">Rise from Fire</h1>

      {/* Date */}
      <div className="flex items-center text-gray-600 mb-6">
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
        <span>{formattedDate}</span>
      </div>

      {/* Shields.io badges */}
      <div className="flex flex-wrap gap-3 mb-8">
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Malayalam_Music-DC2626?style=for-the-badge&labelColor=111827&color=DC2626"
          alt="Malayalam Music"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Philosophy-7C3AED?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Philosophy"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Spiritual_Liberation-F97316?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Spiritual Liberation"
        />
        <img
          loading="lazy"
          decoding="async"
          src="https://img.shields.io/badge/Sanskrit_Wisdom-059669?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Sanskrit Wisdom"
        />
      </div>

      <div className="space-y-10 prose prose-lg max-w-none">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            A Song That Inspires
          </h2>
          <p className="text-lg leading-relaxed">
            This Malayalam song really inspired me and I think the link didn&apos;t come off properly in my recent WordPress blog.
          </p>
          
          <div className="my-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
            <p className="text-red-900 font-medium mb-3">
              🎵 Listen to the song:
            </p>
            <a 
              href="https://music.youtube.com/watch?v=SR3rAYJ3hjE&si=3ahhYDrF5m965cvI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 underline font-medium break-all"
            >
              Rise from Fire - YouTube Music
            </a>
          </div>

          <p className="leading-relaxed text-gray-700 italic">
            I literally lost count of how many times I had listened to this song and wanted to share the meaning with you all.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Meaning Behind the Verses</h2>
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-l-4 border-purple-500 rounded-xl p-8 shadow-md">
            <p className="leading-relaxed text-gray-800 mb-4">
              The song immediately establishes that there is a <strong>destined and unwavering path</strong> (Niyatham margam) marked by the occurrence of a fierce, intense moment (Pathitham theevram). This path is constantly narrated as a single, unchanging doctrine (Eka matham).
            </p>
            <p className="leading-relaxed text-gray-800 mb-4">
              The text asserts that the <strong>blazing or purification</strong> (Jwalanam poorvam) and the complete, intense struggle (Madhanam poornam) have already taken place, leaving an essence like a sacred tradition (Smruthivat saaram) within the history of an entire era (Yuga charitham).
            </p>
            <p className="leading-relaxed text-gray-800 mb-4">
              The struggle to uphold this path requires that a <em>thousand sins must be performed or faced</em> (Karaneeyam sahasram paapam), demanding mental restraint and suffering according to the rules of life (Manarodham vidhivat thaapam).
            </p>
            <p className="leading-relaxed text-gray-800">
              The purpose is to speak the truth that is distant and deeply rooted (Vadaneeyam vidhuram roodam) on a path known as that of this earthly world (ihalokaakhyam).
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Universal Law</h2>
          <p className="leading-relaxed">
            Navigating this life, afflicted by the mix of happiness and sorrow, makes the story extremely harsh, even though the universal law is made in many diverse forms (Niyamam bahuvidha roopakrutham).
          </p>
          
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 my-6 shadow-sm">
            <p className="mb-4 text-amber-900 leading-relaxed">
              The ultimate victory comes from recognizing that <strong>the Earth is righteous</strong> and that <strong>Truth must be in action/duty</strong> (Sathyam cha karmanye).
            </p>
            <blockquote className="text-amber-900 font-semibold italic border-l-2 border-amber-400 pl-4">
              &ldquo;This duty must be performed only with the mind and pure intention (Manasenaiva tat kuryaath), by which one may achieve absolute liberation (Kaivalyam cha vaset).&rdquo;
            </blockquote>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Liberation of the Soul</h2>
          <p className="leading-relaxed">
            The individual soul (Jeevathma), when united with the Self, discipline, and strategy, and having conquered the senses (jithendriya), is definitively <strong>liberated from all bondage</strong> (Bandho bandhaat pramuchyaathe).
          </p>
          
          <div className="bg-gradient-to-r from-sky-50 to-cyan-50 border-l-4 border-sky-500 rounded-xl p-6 shadow-sm mt-4">
            <p className="font-medium text-sky-900 leading-relaxed">
              🔥 The journey from fire to liberation — a powerful metaphor for the human struggle toward enlightenment and freedom from all worldly attachments.
            </p>
          </div>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">
              #MalayalamMusic
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
              #Philosophy
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors">
              #SpiritualJourney
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
              #Liberation
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
              #SanskritWisdom
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors">
              #Karma
            </span>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default RiseFromFire;

