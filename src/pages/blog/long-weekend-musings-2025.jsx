import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LongWeekendMusings2025 = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);

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

      <h1 className="text-4xl font-bold mb-6">What to Write This Week?</h1>

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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
          />
        </svg>
        <span>August 16, 2025</span>
        <span className="mx-2">•</span>
        <span>4 min read</span>
      </div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              A long weekend in India brings reflections on trade, AI quirks,
              family adventures, and the simple joys of life
            </p>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              1. This is a long weekend in India. Few things caught my
              attention.
            </h2>
          </section>

          {/* Hero Image */}
          <div className="mb-10">
            <img
              src={`/.netlify/functions/image-proxy?url=${encodeURIComponent('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')}`}
              alt="Mountain landscape representing adventure and reflection"
              className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = '/media/image4.png';
              }}
            />
            <p className="text-sm text-gray-500 text-center mt-2">
              Photo by{' '}
              <a
                href="https://unsplash.com/@davidmarcu"
                className="underline hover:text-gray-700"
              >
                David Marcu
              </a>{' '}
              on{' '}
              <a
                href="https://unsplash.com"
                className="underline hover:text-gray-700"
              >
                Unsplash
              </a>
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              2. The textile industry is asking PM through CM to continue
              negotiations with the great country and help reduce the steep
              tariff imposed. They dont want government subsidy to tide over
              this crisis. All they ask is market access. Such proud folks these
              businessmen of Tirupur are- who export denim jeans.
            </h2>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              3. This article in The Hindu was interesting and to the point.
              Especially i notice in these days of AI and LLMs - ChatGPT,
              Gemini- they come up with 'Ramayana' - long winding answers, for
              Mahabharata related querries- pun intended. They like to dump or
              should i say -spit volumonius amount of words when i ask a simple
              question. I have to prompt 'give me crisp reply', 'give me 3
              bullet points' etc... all the time
            </h2>

            {/* The Hindu Article Image */}
            <div className="my-8">
              <img
                src="/media/theHinduKJ.jpg"
                alt="The Hindu article about AI and technology"
                className="w-full max-w-2xl mx-auto rounded-lg"
              />
              <p className="text-sm text-gray-500 text-center mt-2">
                link to image in /public/media/theHinduKJ.jpg
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              4. Our boy youngest travelled the world - Nepal and 3 countries in
              Europe making full use of his gap year and his album link is as
              below. He has nicely explained in each image lots of uesful
              information. Hope you all read the info he keyed in his Nepal
              Adventures album. He just landed in Rayleigh, NC and will start
              his under grad studies in a week. I wish him well. All the
              rigorous NS training for 2 years, post his Level 2 exams have made
              him fit and strong physically.
            </h2>
            <div className="my-6 text-center">
              <a
                href="https://photos.app.goo.gl/4NCRhYzVN3rLg5ix9"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                📸 View Photo Album
              </a>
              <p className="text-sm text-gray-500 mt-2">Europe Adventures</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              5. The Arunachal Pradesh little girl singing national anthem and
              Pardesiya from Param sundari are in my /music playlist
            </h2>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              6. Added my new read in /books
            </h2>
          </section>
        </div>
      </div>

      {/* Blog interactions */}
          </motion.div>
  );
};

export default LongWeekendMusings2025;
