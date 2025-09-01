import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FAQBuddingDentist = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
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

      <h1 className="text-4xl font-bold mb-6">FAQ with our budding dentist</h1>

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
        <span>August 22, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              An insightful conversation about dentistry, good practises for
              oral health. Let us hear from the horse's mouth. She is in her
              final year of BDS - currently doing her internship.
            </p>
          </header>

          {/* Audio Player Section */}
          <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              Listen to the Full Interview
            </h2>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <audio controls className="w-full h-12" preload="metadata">
                <source src="/media/AKSVtalk.wav" type="audio/wav" />
                Your browser does not support the audio element.
              </audio>

              <div className="mt-4 text-sm text-gray-600">
                <p>Format: WAV Audio</p>
                <p>File: AKSVtalk.wav</p>
              </div>
            </div>
          </section>

          {/* Dental Health Tips Section */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Key Dental Health Tips from Our Expert
            </h2>

            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  🦷 Jaw Health Assessment
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong>Self-check technique:</strong> Press with index finger
                  2mm from the tragus (glenoid fossa, temporomandibular joint)
                  and open mouth slowly. You should feel a slight depression
                  when pressed.
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                <h3 className="text-xl font-semibold text-red-800 mb-4">
                  ⚠️ Oral Health Risks to Watch
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Squamous cell carcinoma:</strong> Serious oral
                    cancer risk
                  </li>
                  <li>
                    <strong>Oral submucous fibrosis (OSMF):</strong> Can be
                    caused by sharp teeth
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  🦿 Dental Implants Information
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Zirconia cap:</strong> Preferred material for crowns
                  </li>
                  <li>
                    <strong>Titanium screws:</strong> Standard material for
                    implant stability
                  </li>
                  <li>
                    <strong>Recommended brands:</strong> 3M, Noble Bio
                    (international quality)
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">
                  🧴 Oral Care Products
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Toothpaste:</strong> Sensodyne-type for sensitive
                    teeth
                  </li>
                  <li>
                    <strong>Water floss:</strong> OraCure recommended for
                    effective cleaning
                  </li>
                  <li>
                    <strong>Toothbrush:</strong> Medium bristle strength
                    suggested
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  📅 Maintenance Schedule
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>De-scaling:</strong> At least once a year
                    professionally
                  </li>
                  <li>
                    <strong>Brushing priority:</strong> Night brushing more
                    important than morning
                  </li>
                  <li>
                    <strong>Tongue cleaning:</strong> Daily practice essential
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
                <h3 className="text-xl font-semibold text-orange-800 mb-4">
                  💧 Post-Meal Care
                </h3>
                <p className="text-gray-700 mb-3">
                  <strong>Important:</strong> Rinse mouth after food. Contrary
                  to some advice, this is recommended. Dont listen to folks who
                  say that by rinsing digestive fluids will be washed away.
                </p>
              </div>

              <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-400">
                <h3 className="text-xl font-semibold text-pink-800 mb-4">
                  🚫 What to Avoid
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Soft drinks:</strong> Avoid regular consumption of
                    beverages
                  </li>
                  <li>
                    <strong>Sugary drinks:</strong> Limit intake for better oral
                    health
                  </li>
                </ul>
              </div>

              <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-400">
                <h3 className="text-xl font-semibold text-teal-800 mb-4">
                  ✅ What's Good for Dental Health
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Calcium sources:</strong> Milk, paneer (cottage
                    cheese)
                  </li>
                  <li>
                    <strong>Vitamin D:</strong> Sunlight exposure for better
                    absorption
                  </li>
                  <li>
                    <strong>Nuts:</strong> Rich in minerals beneficial for teeth
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Photo Album Section */}
          <section className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Photo Gallery
            </h2>

            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">
                Explore the beautiful places and interesting insights from
                Vichu's Kerala Trip
              </p>

              <a
                href="https://photos.app.goo.gl/cEew1e4hN1oH7shz8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Vichu's Kerala Trip Album
              </a>

              <p className="text-sm text-gray-600 mt-3">
                Click to explore the photo collection with detailed descriptions
                and insights about these beautiful Kerala pilgrimage locations
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Blog interactions */}
          </motion.div>
  );
};

export default FAQBuddingDentist;
