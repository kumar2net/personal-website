import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MyFascinationWithShortcuts = () => {
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

      <h1 className="text-4xl font-bold mb-6">
        My Fascination with Shortcuts: The Art of Keyboard Navigation
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
        <span>June 27, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              Why keyboard shortcuts feel like a superpower and how they've
              become second nature to me
            </p>
          </header>

          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              There's something magical about the moment when your fingers dance
              across the keyboard, executing complex operations without ever
              touching the mouse. For me, keyboard shortcuts aren't just a
              convenience—they're a way of life. And before you roll your eyes
              and mutter "okay, boomer," hear me out. This isn't about nostalgia
              for the command-line era; it's about efficiency, flow, and the
              pure joy of seamless interaction with technology.
            </p>

            <div className="my-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-center mb-6 text-indigo-800">
                The Speed of Thought
              </h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-4">
                  <svg
                    className="w-12 h-12 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-700">
                  When muscle memory takes over, productivity becomes effortless
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              It's Not About Being Old-School
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Yes, GUIs are the standard now, and for good reason. They've
              democratized computing, making technology accessible to billions
              of people who would otherwise be locked out by cryptic command
              lines. But here's the thing: mastering shortcuts doesn't make you
              a dinosaur—it makes you a power user.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Reality Check:</strong> Modern interfaces are
                    designed with both mouse and keyboard users in mind. The
                    best applications seamlessly support both interaction
                    methods.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Think about it: when you're in the zone, coding or writing, the
              last thing you want is to break your flow by reaching for the
              mouse. Every context switch is a micro-interruption that pulls you
              out of that precious state of deep focus. Shortcuts keep you in
              the flow state longer.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Beauty of Muscle Memory
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              There's something deeply satisfying about the moment when a
              shortcut becomes second nature. Your fingers know exactly where to
              go without conscious thought. It's like learning to touch-type all
              over again— initially awkward, then transformative.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  The Benefits
                </h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Faster task completion</li>
                  <li>• Maintained focus and flow</li>
                  <li>• Reduced physical strain</li>
                  <li>• Impressive to colleagues 😉</li>
                  <li>• Works even in minimal environments</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  The Investment
                </h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Initial learning curve</li>
                  <li>• Temporary slowdown while adapting</li>
                  <li>• Need for consistent practice</li>
                  <li>• Application-specific shortcuts</li>
                  <li>• Platform differences to remember</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              A Delicious Irony
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Having said all that about my love affair with keyboard shortcuts,
              I have to confess something that might make you chuckle: I'm
              absolutely fascinated by Apple's M4 MacBook trackpad! The
              click-to-tap functionality, the smooth two-finger scrolling, and
              especially the three-finger text selection gesture—they're
              genuinely delightful to use.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h3a1 1 0 011 1v2h4a1 1 0 011 1v3H3V5a1 1 0 011-1h3zM3 9h18v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold mb-2 text-amber-800">
                    Plot Twist!
                  </h3>
                  <p className="text-amber-700">
                    Here I am, preaching the gospel of keyboard shortcuts, and
                    I'm simultaneously marveling at how intuitive and elegant
                    modern trackpad gestures have become. The irony isn't lost
                    on me!
                  </p>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Haha, how times have changed! Perhaps the future isn't about
              choosing between keyboard and trackpad—it's about seamlessly
              blending both input methods to create the most fluid, efficient
              workflow possible. Apple's engineers have clearly put as much
              thought into perfecting trackpad interactions as I've put into
              memorizing keyboard shortcuts.
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Maybe the real lesson here is that the best tools—whether they're
              keyboard shortcuts or trackpad gestures— are the ones that fade
              into the background and let us focus on what we're actually trying
              to accomplish. Whether I'm using ⌘+C or a three-finger swipe, the
              magic happens when the interface gets out of the way.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  Ready to Master Some Shortcuts?
                </h3>
                <p className="text-blue-700 mb-4">
                  While I may be torn between keyboards and trackpads, my
                  <a
                    href="/learning"
                    className="text-blue-800 hover:text-blue-900 underline font-medium"
                  >
                    {' '}
                    Learning Hub
                  </a>
                  is still the best place to master those essential keyboard
                  shortcuts!
                </p>
                <a
                  href="/learning"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Explore Learning Hub
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <footer className="text-center mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-600 italic">
              Happy shortcutting! May your workflows be efficient and your
              context switches minimal. 🚀
            </p>
          </footer>
        </div>
      </div>

      {/* Blog interactions */}
          </motion.div>
  );
};

export default MyFascinationWithShortcuts;
