import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BlogInteractions from '../../components/BlogInteractions';

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
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">Boy with Music in His Veins</h1>

      {/* Date */}
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>August 29, 2025</span>
      </div>

      {/* Shields.io badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <img src="https://img.shields.io/badge/Music-FF6B6B?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Music" />
        <img src="https://img.shields.io/badge/Piano-4ECDC4?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Piano" />
        <img src="https://img.shields.io/badge/Composition-45B7D1?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Composition" />
        <img src="https://img.shields.io/badge/Trinity-9B59B6?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Trinity" />
        <img src="https://img.shields.io/badge/Yamaha-E74C3C?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Yamaha" />
        <img src="https://img.shields.io/badge/Logic_Pro-000000?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Logic Pro" />
      </div>

      <div className="space-y-8 prose prose-lg max-w-none">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold">A Young Musician's Journey</h2>
          <p>
            Meet Dharun, my good friend Senthil's son, a 15-year-old music fanatic and passionate pianist whose love for music began at the tender age of four. 
            When most children are learning to read and write, Dharun was already exploring the world of melodies and harmonies. 
            His journey from a curious toddler to a Grade 7 Trinity pianist is nothing short of extraordinary.
          </p>
          
          {/* Audio Interview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Listen to Dharun's Story</h3>
            <p className="text-sm text-gray-600 mb-4">
              Hear Dharun discuss his musical journey, composition process, and passion for piano in this exclusive interview.
            </p>
            <audio 
              controls 
              className="w-full"
              preload="metadata"
            >
              <source src="/media/AKDStalk.wav" type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <p className="text-xs text-gray-500 mt-2">
              Duration: ~3 minutes | Format: WAV | Interview about Dharun's musical journey
            </p>
          </div>
        </section>

        {/* Early Beginnings */}
        <section>
          <h2 className="text-2xl font-bold">The Early Spark</h2>
          <p>
            Dharun's musical journey began on his first birthday when his father gifted him his first musical instrument. 
            From that moment, music became more than just a hobby—it became his calling. By the age of four, he was already 
            attending music classes, showing an innate understanding of rhythm and melody that would set the foundation for 
            his future as a composer.
          </p>
        </section>

        {/* Current Status */}
        <section>
          <h2 className="text-2xl font-bold">Current Musical Pursuits</h2>
          <p>
            Currently in Class 10, Dharun has achieved remarkable milestones in his musical education. He has completed 
            Trinity Grade 7 and is now working towards Grade 8. His focus areas include original composition and classical music, 
            demonstrating a maturity in musical understanding that belies his young age.
          </p>
        </section>

        {/* Instruments and Equipment */}
        <section>
          <h2 className="text-2xl font-bold">The Tools of His Trade</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Home Studio Setup</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Yamaha CLP-845</strong> - A premium 88-key home piano with pure wood construction, perfect for practice and composition</li>
            <li><strong>Yamaha CK-88</strong> - 88-key stage piano for live performances and recording sessions</li>
            <li><strong>Yamaha SX-700</strong> - 61-key arranger keyboard for creating backing tracks and arrangements</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Digital Audio Workstation</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Logic Pro</strong> - Professional Digital Audio Workstation (DAW) for recording, mixing, and mastering</li>
            <li><strong>Mac Mini</strong> - Connected via MIDI for seamless integration with his instruments</li>
            <li><strong>Export Workflow</strong> - Converts compositions to WAV format for distribution on YouTube and Instagram</li>
          </ul>
        </section>

        {/* Personal Reflection */}
        <section>
          <h2 className="text-2xl font-bold">A Different Way of Thinking</h2>
          <p>
            Dharun is thinking differently. His approach to music goes beyond traditional learning—he's creating his own path, 
            combining classical training with modern technology in ways that many musicians his age haven't considered. He says all the notes are in his head and he can play them on the piano - muscle memory he says.
            How he develops himself from here and where his journey takes him is something I will be watching with great interest.
          </p>
          <blockquote className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 italic text-lg">
            "Choose a job you love, and you will never have to work a day in your life."
            <footer className="text-sm text-gray-600 mt-2">— Confucius</footer>
          </blockquote>
          <p className="mt-4">
            Dharun embodies this philosophy perfectly. At just 15, he has already found his passion and is living it every day. 
            His dedication to music isn't work—it's pure joy and fulfillment. This is the kind of authentic passion that 
            creates extraordinary artists and lasting legacies.
          </p>
        </section>


      </div>

      {/* Blog interactions */}
      <BlogInteractions />
    </motion.div>
  );
};

export default BoyWithMusicInVeins;
