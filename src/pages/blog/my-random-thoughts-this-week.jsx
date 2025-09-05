import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import TldrSummary from '../../components/TldrSummary';

const MyRandomThoughtsThisWeek = () => {
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

      <h1 className="text-4xl font-bold mb-6">my random thoughts this week</h1>

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
        <span>August 03, 2025</span>
        <span className="mx-2">•</span>
        <span>3 min read</span>
      </div>

      {/* Topic badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Technology
        </span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Healthcare
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          Robotics
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Trade Policy
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          Renewable Energy
        </span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          India Economy
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          News Analysis
        </span>
      </div>

      <div className="space-y-8">
        {/* <TldrSummary articleRef={articleRef} /> */}
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              From surgical robots to trade policy shifts - a week of
              fascinating developments that caught my attention
            </p>
          </header>

          {/* Company/Tech badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <img
              src="https://img.shields.io/badge/Da_Vinci_Xi-Surgical_Robot-FF6B6B?style=for-the-badge&logo=medical&logoColor=white"
              alt="Da Vinci Xi Surgical Robot"
            />
            <img
              src="https://img.shields.io/badge/T%26T-Trump_Tariff-4ECDC4?style=for-the-badge&logo=politics&logoColor=white"
              alt="T&T - Trump & Tariff"
            />
            <img
              src="https://img.shields.io/badge/Tamil_Nadu-Power-45B7D1?style=for-the-badge&logo=energy&logoColor=white"
              alt="Tamil Nadu Power"
            />
            <img
              src="https://img.shields.io/badge/India-Economy-FF9F43?style=for-the-badge&logo=rupee&logoColor=white"
              alt="India Economy"
            />
          </div>

          {/* Hero Image */}
          <div className="mb-10">
            <img
              src={`/.netlify/functions/image-proxy?url=${encodeURIComponent('https://picsum.photos/1200/400?random=tech')}`}
              alt="Technology and innovation concept"
              className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src = '/media/image4.png';
              }}
            />
            <p className="text-sm text-gray-500 text-center mt-2">
              Photo by{' '}
              <a
                href="https://picsum.photos"
                className="underline hover:text-gray-700"
              >
                Lorem Picsum
              </a>
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Da Vinci Xi Robot: The Million-Dollar Question
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Spotted an interesting hospital news item in local newspaper about
              their new Da Vinci Xi surgical robot. Naturally, I had to dig
              deeper into the specs and pricing. The Xi model specifically costs
              anywhere from $1.5 million to $2.5 million (₹12.5-20.8 crores)
              depending on the configuration!
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              But here's the kicker - that's just the upfront cost. Annual
              service fees can run up to $190,000 (₹1.6 crores), plus
              $600-$3,500 (₹50,000-₹2.9 lakhs) per surgical procedure for
              instruments and accessories. The Xi model features four robotic
              arms, 3D HD vision system, and EndoWrist instruments with 7
              degrees of freedom (meaning they can pitch, yaw, roll, and move in
              three dimensions - essentially replicating a human wrist but with
              superhuman precision) - far exceeding human hand dexterity.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">
                💡 Tech Insight
              </h3>
              <p className="text-blue-700">
                The Xi's precision is mind-blowing - surgeons can perform
                complex operations through 8mm incisions, with 3D HD
                visualization, laser guidance system, and EndoWrist instruments
                that rotate 540 degrees - far beyond human hand capabilities.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              T&T Headlines and the Real Story Behind the Numbers
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The political economy landscape has been dominated by T&T
              discussions lately - trade policy shifts and their ripple effects
              on global markets. But beyond the policy rhetoric lies a
              fascinating economic reality check for emerging economies like
              India.
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              When you break down India's per capita GDP and relate to per
              capita income, for a massive chunk of the population(roughly
              $2,500 annually or ₹2.1 lakhs)ie. 550 odd Rupees per day. Majorty
              of the population is poor. India need to navigate the T&T by
              bargaining with the great country and not to be at loggerheads
              with it. It's all about perspective and bargaining power on a
              macro scale. These things dont matter for the average person.
              Thats my 2 cents on this topic.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Power, Progress, and the Price We Pay
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              A Tamil newspaper cutting caught my attention as our newspaper boy
              delivered it instead of my usual newspaper - it was about the
              massive need for gigawatt power plants and the ecosystem damage
              from hydro projects. This hits close to home when you consider
              Tamil Nadu's ambitious renewable energy push.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-2 text-amber-800">
                ⚖️ The Dilemma
              </h3>
              <p className="text-amber-700">
                The Nilgiris already has 12 dams, yet new pumped storage
                projects are being planned. It's the classic development vs.
                environment trade-off - sustainable energy for mainland Tamil
                Nadu, environmental vulnerability for its mountains.
              </p>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The green energy threatening our greenest districts. As we race
              toward that $1 trillion economy goal (₹83 lakh crores) by 2030,
              we're forced to grapple with these complex trade-offs between
              progress and preservation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Young Minds, Fresh Perspectives
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              On a lighter note, having 2 youngsters contribute as a co-author
              on a recent project and their life experiences absolutely made my
              week. She did the project as a part of her UG research project.
              She travelled to Alaska for the EWRI conference and asked her to
              explain as Feymann would as i couldnt understand her slide deck
              she used in the conference. Her PG ones will be a lot more complex
              i assume.
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Speaking of evolution - I'm updating some project references from
              "drugReco" to "medicinechk" in the Projects section. I am using
              nC2 to check all combinations of medicines, getting some
              real-world testing with family interactions, and the backend
              database updates are showing promising results. I shared the
              output with couple of our fam and hoping they are happy with the
              results. I am using APIs to update the interactions checker on a
              regular basis as these evolve all the time. I am running the
              medicineChk app on my laptop only for privacy reasons. If you
              would like me run it for your specific medicines, please do send
              me the list of medicines, dosage. Would be happy to run the app
              for you and share the results one to one.
            </p>
          </section>

          <footer className="text-center mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-600 italic">
              Technology moves fast, but the human stories behind it move
              faster. Stay curious! 🚀 i am just trying to not have any hard
              views on anything and be as non-judgmental as possible. i think
              thats the secret to stress free life these days.
            </p>
          </footer>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Technology
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Healthcare
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Robotics
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Trade Policy
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Renewable Energy
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              India Economy
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              News Analysis
            </span>
          </div>
        </div>
      </div>

      {/* Blog interactions */}
    </motion.div>
  );
};

export default MyRandomThoughtsThisWeek;
