import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import TldrSummary from '../../components/TldrSummary';
import AuthorBio from '../../components/AuthorBio';

const NammuSoilAnalysisResearch = () => {
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
        revolutionizing soil analysis: laser vs traditional methods
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
        <span>August 03, 2025</span>
        <span className="mx-2">•</span>
        <span>5 min read</span>
      </div>

      {/* Topic badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Agriculture
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Research
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          Soil Science
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          Technology
        </span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          Environmental
        </span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Construction
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          Scientific Method
        </span>
      </div>

      <AuthorBio author="Namritha . R" bio="Second year Masters student" />

      <div className="space-y-8">
        {/* <TldrSummary articleRef={articleRef} /> */}
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              A groundbreaking Florida study comparing traditional sieve methods
              with laser diffraction technology reveals surprising insights
              about soil composition analysis
            </p>
          </header>

          {/* Company/Tech badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <img
              src="https://img.shields.io/badge/Sieve_Hydrometer-Traditional_Method-8B5CF6?style=for-the-badge&logo=laboratory&logoColor=white"
              alt="Sieve Hydrometer Method"
            />
            <img
              src="https://img.shields.io/badge/Laser_Diffraction-Advanced_Tech-EF4444?style=for-the-badge&logo=laser&logoColor=white"
              alt="Laser Diffraction Method"
            />
            <img
              src="https://img.shields.io/badge/Florida-Research_Sites-10B981?style=for-the-badge&logo=location&logoColor=white"
              alt="Florida Research"
            />
            <img
              src="https://img.shields.io/badge/75_Samples-Comprehensive_Study-F59E0B?style=for-the-badge&logo=data&logoColor=white"
              alt="75 Samples Study"
            />
          </div>

          {/* Hero Image */}
          <div className="mb-10">
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
              alt="Soil analysis and agricultural research"
              className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/1200x400/059669/ffffff?text=Soil+Analysis+Research';
              }}
            />
            <p className="text-sm text-gray-500 text-center mt-2">
              Photo by{' '}
              <a
                href="https://unsplash.com/@vlisidis"
                className="underline hover:text-gray-700"
              >
                Vlad Tchompalov
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
            <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-6 border-b-2 border-green-200 pb-2">
              Research Goal
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The goal of this research study is to find the most efficient way
              to determine what soil is made up of. Specifically, how much sand,
              silt, and clay it has. This matters because different soil
              compositions dictate how water flows through the medium. The way
              this water flows can affect how plants grow and how stable the
              ground is. Findings may be used in applications such as building,
              farming, and retention pond creation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-6 border-b-2 border-green-200 pb-2">
              Two Methods of Soil Classification
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              There are two ways to classify soils: 1) the sieve hydrometer
              method (SHM) and 2) the laser diffraction method (LDM). With SHM
              you dry the soil and shake it through screens of different sizes.
              For particles that are smaller and fall through the smallest
              screen, you mix them with water and measure how fast these tiny
              bits settle. Brownian motion causes finer particles to jitter in
              the water, making them difficult to measure accurately. This
              method is also time consuming.
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              With LDM, a laser is shone through soil particles dispersed in
              water. Bigger particles scatter this light differently than the
              smaller particles. A computer is connected to the laser and sorts
              these particles into different size classes. This method is faster
              and better at finding these miniscule particles.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">
                🔬 Our Two Main Questions
              </h3>
              <div className="text-blue-700">
                <p className="mb-2">
                  1. Do these methods produce different soil classifications?
                </p>
                <p>
                  2. Is the laser method better at finding those smaller
                  particles?
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-6 border-b-2 border-green-200 pb-2">
              Methods
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Collected a total of 75 samples from 5 sites across Florida. Each
              of these sites had a different soil type and texture corresponding
              with its geographical area. Brought these soils to the lab and
              performed both SHM and LDM on each of the soils.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-6 border-b-2 border-green-200 pb-2">
              Findings
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The two methods did not always agree. LDM often found more fine
              stuff like silt so it classified the soil differently. LDM was
              also better at spotting the finer particles such as silt and clay
              and was way faster - LDM took 13 hours per soil while SHM took 74
              hours!
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-2 text-amber-800">
                ⚡ Speed Comparison
              </h3>
              <p className="text-amber-700">
                <strong>LDM:</strong> 13 hours per soil sample
                <br />
                <strong>SHM:</strong> 74 hours per soil sample
                <br />
                <em>LDM is way faster!</em>
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-6 border-b-2 border-green-200 pb-2">
              Implications
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              For soils with a large quantity of fine particles the laser method
              works better and faster. For sandy soils, either method works
              fine. Consistency of method is important because they might not
              always match - so stick with one.
            </p>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-2 text-indigo-800">
                🎯 Key Takeaway
              </h3>
              <p className="text-indigo-700">
                Consistency of method is important because they might not always
                match - so stick with one.
              </p>
            </div>
          </section>

          {/* Research Images and Data */}
          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-6 border-b-2 border-green-200 pb-2">
              Research Data & Visual Results
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-8 text-gray-700">
              The following charts and graphs illustrate our findings from the
              comparative analysis of both methods across all 75 soil samples.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-lg border">
                <img
                  src="/media/image2.png"
                  alt="Soil classification comparison between SHM and LDM methods"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-3 text-center italic">
                  Method comparison showing classification differences between
                  SHM and LDM
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-lg border">
                <img
                  src="/media/image3.png"
                  alt="Fine particle detection analysis"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-3 text-center italic">
                  LDM's superior detection of fine particles (silt and clay)
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-4 rounded-lg shadow-lg border">
                <img
                  src="/media/image4.png"
                  alt="Processing time comparison between methods"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-3 text-center italic">
                  Time efficiency analysis: LDM vs SHM processing speeds
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-lg border">
                <img
                  src="/media/image1.png"
                  alt="Geographical distribution of soil samples across Florida"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-3 text-center italic">
                  Florida sample sites showing geographical diversity in soil
                  types
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Agriculture
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Research
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Soil Science
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              Technology
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              Environmental
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              Construction
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              Scientific Method
            </span>
          </div>
        </div>
      </div>

      {/* Blog interactions */}
    </motion.div>
  );
};

export default NammuSoilAnalysisResearch;
