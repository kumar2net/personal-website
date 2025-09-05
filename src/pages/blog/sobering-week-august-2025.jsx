import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SoberingWeekAugust2025 = () => {
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

      <h1 className="text-4xl font-bold mb-6">
        A Sobering Week: Reflections on Loss, Life, and Learning
      </h1>

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
        <span>August 2025</span>
        <span className="mx-2">•</span>
        <span>6 min read</span>
      </div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              When life reminds us of its fragility, we find ourselves
              reflecting on what truly matters
            </p>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              The Weight of Loss
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              The news of Hanu's (that's how JK calls her) still rankling in my
              mind.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              She had to fly to India to be with the grieving family from
              Edinburgh where RJ has gone for a well deserved break. That they
              and AJ took a trip (West coast drive) is pretty good. The 3rd one
              went to Greece few weeks ago. All the 3 boys are grinding hard.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              A World in Flux
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              All these geopolitical happenings, tariff, AI impact on world -
              there is a lot happening. All I would recommend is keep 6 month
              expenses in emergency fund & play Bold. There is no other
              alternative.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              College Life Across the Ocean
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Our boy youngest took me on video chat and showed me around his
              dorm in Uni. So nice to hear from him- excited tones, the frills
              of college life in the great country. The Prof's encourage
              students with seminars, group discussions, asking them put the
              phone and other distractions far away. The networking
              opportunities the Uni's provide there are unparalled. I am sure he
              will leverage this to the fullest.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              "Even keeping the device on the table will distract you. Read the
              book for 5 hours etc..".They are taking them on a field trip to DC
              in a few weeks. So different from the Rote learning we do in India
            </p>
          </section>

          {/* Temple Vahanas Image */}
          <div className="mb-10">
            <img
              src="/media/templeVahanas.jpg"
              alt="Temple vahanas - traditional temple vehicles representing cultural heritage"
              className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-500 text-center mt-2">
              Temple vahanas from The Hindu clipping
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              The Education Crisis: India's Demographic Dividend as a Time Bomb
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Yesterday The Hindu editorial says 40 to 50% of Indian Engineering
              grads in the past decade are not placed in jobs! More and more
              youngsters are going to college but employers report difficulty in
              finding the right talent with skills. This really pains me.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              <a
                href="https://www.thehindu.com/opinion/lead/indias-demographic-dividend-as-a-time-bomb/article69985845.ece"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Read the full article here
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Website Improvements
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              I added few features- semantic search (what it is, ah.. it needs a
              separate post and will do this later), Like and Comment
              functionality to the blog posts. Please check it out and do give
              me feedback and your suggestions. I will be delighted
            </p>
          </section>

          <section className="mb-8">
            <p className="text-lg leading-relaxed mb-6">
              Stay Curious & Persistent
            </p>
          </section>
        </div>
      </div>

      {/* Blog interactions */}
    </motion.div>
  );
};

export default SoberingWeekAugust2025;
