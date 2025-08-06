import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FeynmanTechnique = () => {
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
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>
      
      <h1 className="text-4xl font-bold mb-6">Feynman Techniques: Learning Like Richard Feynman</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>July 19, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              How the Nobel Prize-winning physicist's simple approach to learning can transform your understanding of any subject
            </p>
          </header>

          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Lately, I've been reading about Richard Feynman on my Kindle Oasis, inspired by his stories and his refreshingly simple way of learning. The <strong>Feynman Technique</strong>—explaining any idea in plain language—is still my favorite tool for understanding anything, whether it's physics or everyday puzzles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Heart of Feynman's Method
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Feynman believed: <em>If you can't explain it to a child, you don't really understand it.</em> Each time you try, you uncover gaps fast—and that's how you actually learn.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Childhood Curiosity: Patterns, Questions, and 2x+7=15
            </h2>
            <ul className="list-disc pl-6 mb-6 space-y-4">
              <li className="text-base sm:text-lg leading-relaxed">
                Feynman's dad taught him by stacking tiles and spotting patterns, making discovery fun and hands-on.
              </li>
              <li className="text-base sm:text-lg leading-relaxed">
                As a child, Feynman also found and studied his aunt's old algebra book in the attic, learning to solve for unknowns—not just by memorizing school "rules," but by following the logic itself.
              </li>
              <li className="text-base sm:text-lg leading-relaxed">
                One vivid story: He saw his cousin struggling with <code>2x + 7 = 15</code> and simply knew the answer was 4—but his cousin insisted he had to solve it "by algebra," not "by arithmetic." Feynman was puzzled by the idea that there's only one "right" way to find the answer, since for him, solving for the unknown was the whole point—not the method.
              </li>
              <li className="text-base sm:text-lg leading-relaxed">
                This experience stuck with him: he realized that blindly following steps without understanding leads to confusion, not real learning. For Feynman, algebra was about curiosity and logic, not just memorizing procedures.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Early Library Adventures
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              When Feynman was still very young, he went to the library and took out <em>Calculus for the Practical Man</em>—pretending it was for his dad, but really, he was just that curious!
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              A Note About Space-Time
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Feynman often emphasized that space and time are woven together into what we now call "space-time." He explained that every event in the universe has both a location and a moment—and the two can't be separated if you want to understand how the universe really works.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Feynman Technique at a Glance
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
              <ol className="list-decimal pl-6 space-y-3">
                <li className="text-base sm:text-lg leading-relaxed">
                  <strong>Pick a concept</strong> you want to learn.
                </li>
                <li className="text-base sm:text-lg leading-relaxed">
                  <strong>Explain it simply</strong>—pretend you're teaching a six-year-old.
                </li>
                <li className="text-base sm:text-lg leading-relaxed">
                  <strong>Notice where you hesitate;</strong> revisit those points.
                </li>
                <li className="text-base sm:text-lg leading-relaxed">
                  <strong>Repeat until your explanation is smooth and simple.</strong>
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Why It Resonates
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              For Feynman, the joy was never in titles or awards—though he won a Nobel Prize for revolutionizing quantum electrodynamics, he always said the real prize was the thrill of discovery and sharing what he learned. Whether you're a student, a teacher, or just curious, his technique proves that true understanding is about breaking things down and plenty of honest, playful curiosity.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Oppenheimer Chapter: One Part of a Bigger Life
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              It's worth remembering: Feynman worked alongside Oppenheimer on the Manhattan Project, making the first nuclear bomb. But he soon moved on—choosing a life defined by teaching, learning, and making science joyful, not just historical.
            </p>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Learning
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Feynman Technique
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Education
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Physics
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Teaching
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Curiosity
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Richard Feynman
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Problem Solving
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeynmanTechnique; 