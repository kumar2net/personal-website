import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Habit = () => {
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
      <h1 className="text-4xl font-bold mb-2">Habit</h1>

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

      {/* Canonical Reference */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <p className="text-sm text-gray-700">
          <strong>Original Post:</strong> This content was originally published
          on{' '}
          <a
            href="https://kumar2net.wordpress.com/2025/08/29/habit/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Kumar's mind voice
          </a>
        </p>
      </div>

      {/* Shields.io badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <img
          src="https://img.shields.io/badge/Habits-FF6B6B?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Habits"
        />
        <img
          src="https://img.shields.io/badge/Productivity-4ECDC4?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Productivity"
        />
        <img
          src="https://img.shields.io/badge/Technology-45B7D1?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Technology"
        />
        <img
          src="https://img.shields.io/badge/Philosophy-9B59B6?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Philosophy"
        />
        <img
          src="https://img.shields.io/badge/Zen-E74C3C?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Zen"
        />
        <img
          src="https://img.shields.io/badge/Feedback-000000?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Feedback"
        />
      </div>

      <div className="space-y-8 prose prose-lg max-w-none">
        {/* TL;DR Section */}
        <section>
          <h2 className="text-2xl font-bold">TL;DR</h2>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-lg font-medium text-gray-800">
              A comprehensive daily routine focused on early rising, continuous
              learning, creation, mindfulness, honest communication, healthy
              eating, providing technical feedback, and mentoring family
              youngsters. The philosophy emphasizes authenticity over politeness
              and encourages bold decision-making through continuous curiosity
              and learning.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold">
            What Daily Habit Improves Your Quality of Life?
          </h2>
          <p>
            This question prompted me to reflect on the daily practices that
            truly enhance my quality of life. What follows is not just a list of
            habits, but a philosophy of living that prioritizes authenticity,
            continuous learning, and meaningful contribution.
          </p>
        </section>

        {/* Core Habits */}
        <section>
          <h2 className="text-2xl font-bold">The Daily Routine</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Morning Foundation
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Wake up by 4:30 AM</strong> - Early rising provides quiet
              hours for focused work and reflection
            </li>
            <li>
              <strong>
                Read latest technology developments & current affairs
              </strong>{' '}
              - Stay informed about business and technological advancements
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Creation and Mindfulness
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Create something</strong> - Whether it's a Python script
              or data analysis chart to derive insights
            </li>
            <li>
              <strong>Be mindful</strong> - Practice presence and awareness
              throughout the day
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Communication Philosophy
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Be direct, even at the cost of being brutal</strong> -
              Value honesty, effectiveness, and justice above politeness
            </li>
            <li>
              <strong>Eat healthy foods</strong> - Fuel the body and mind with
              proper nutrition
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Service and Mentorship
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Give effective feedback</strong> - Especially on digital
              services (banking, ecommerce, government utilities, dev tools)
            </li>
            <li>
              <strong>Check on family youngsters</strong> - Provide a sounding
              board for their ideas and encourage bold decision-making
            </li>
          </ul>
        </section>

        {/* Technical Feedback Section */}
        <section>
          <h2 className="text-2xl font-bold">The Art of Technical Feedback</h2>
          <p>
            Having technical understanding allows me to grasp the root causes of
            issues and communicate effectively with helpdesk teams. This isn't
            just about complaining—it's about contributing to product
            improvement through informed, constructive feedback.
          </p>
          <p>
            When I encounter bugs or usability issues, I can provide traces and
            technical context that help development teams understand and resolve
            problems more efficiently. This creates a feedback loop that
            benefits everyone.
          </p>
        </section>

        {/* Mentorship Philosophy */}
        <section>
          <h2 className="text-2xl font-bold">Mentoring Through Curiosity</h2>
          <p>
            My role with family youngsters isn't to make decisions for them, but
            to help them drill down into their ideas and extract insights they
            can use to make their own informed choices. The goal is to encourage
            bold bets while maintaining continuous learning and curiosity.
          </p>
          <p>
            This approach respects their autonomy while providing the analytical
            framework they need to navigate complex decisions. It's about
            building confidence through competence rather than dependency.
          </p>
        </section>

        {/* Philosophy Section */}
        <section>
          <h2 className="text-2xl font-bold">The Philosophy of Authenticity</h2>
          <p>
            The habit of being direct, even when it might seem brutal, stems
            from a deep commitment to authenticity. In a world that often
            prioritizes politeness over truth, choosing honesty and
            effectiveness becomes a radical act.
          </p>
          <blockquote className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 italic text-lg">
            "Of all that is written I love only what a man has written with his
            blood…Whoever writes in blood and aphorisms does not want to be read
            but to be learned by heart."
            <footer className="text-sm text-gray-600 mt-2">
              — Friedrich Nietzsche
            </footer>
          </blockquote>
          <p className="mt-4">
            This Nietzsche quote captures the essence of authentic
            communication—writing and speaking from the depths of experience
            rather than surface-level politeness. It's about creating content
            and conversations that resonate on a deeper level.
          </p>
        </section>

        {/* Donald Image */}
        <section className="text-center">
          <img
            src="/media/donald_nanobanana.png"
            alt="Donald with nanobanana"
            className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            style={{ maxHeight: '400px' }}
          />
        </section>

        {/* Conclusion */}
        <section>
          <h2 className="text-2xl font-bold">Going 🍌s (Pun Intended)</h2>
        </section>
      </div>

      {/* Blog interactions */}
    </motion.div>
  );
};

export default Habit;
