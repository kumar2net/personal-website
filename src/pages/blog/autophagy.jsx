import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Autophagy = () => {
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
      
      <h1 className="text-4xl font-bold mb-6">Ekadasi morphs into IF and now Autophagy!</h1>
      
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
              How ancient fasting traditions align with modern science on cellular health and metabolic wellness
            </p>
          </header>

          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              It's amusing how fasting—popularized first as Ekadasi in our cultural traditions, then as "intermittent fasting" (IF) in the wellness world—is now the subject of scientific fascination for its role in autophagy, our cells' natural cleanup system. Honestly, I think our ancestors just <em>knew</em>—they practiced fasting for clarity, discipline, and well-being, long before anyone measured blood glucose or published a paper on metabolic switches.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Wisdom Before Words: From Ekadasi to IF
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              In Indian culture, fasting—especially on Ekadasi—wasn't just about abstaining from food. It was a rhythm, a discipline, a reset. There was no talk of "autophagy," no biomarkers, just generations of people trusting that pausing food was somehow good for their bodies and minds. Now, science is putting numbers and names to what tradition has always felt: regular fasting is foundational for cellular repair, metabolic health, and resilience.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The 13-Hour Fast: A Practical, Modern Option
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              A 13-hour fasting window—say, from 7 PM to 11 AM—is a simple, sustainable way to dip into the benefits. This is "time-restricted eating" (TRE) in its gentlest, most doable form. Here's what it offers:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Metabolic Reset:</strong> Improves insulin sensitivity, nudges your body to use stored fat, and helps regulate blood sugar.</li>
              <li><strong>Cellular Cleanup (Autophagy):</strong> After 10–12 hours without food, your cells start recycling damaged parts, supporting overall health.</li>
              <li><strong>Better Sleep & Energy:</strong> Eating early supports restful sleep, and stable energy in the morning follows.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Ekadasi, IF, and Cellular Health: The Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Practice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Key Effects</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Autophagy Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ekadasi Fasting</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Twice a month</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Deep spiritual/mental reset, discipline, cellular repair</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Strong</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">13-hour IF</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Daily/Regular</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Gentle metabolic tune-up, energy, sustainable habit</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Moderate</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Classic IF (16:8)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Daily/Weekly</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Weight management, deeper cellular cleanup</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Well-documented</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              The Real Curious Case: What About Diabetes and Medications?
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Since I am taking diabetic medications, I am carefully trying to use this technique and tweaking it to my way of life. This is where the intersection of traditional wisdom and modern medicine becomes particularly important—finding a balance that honors both the benefits of fasting and the necessity of proper medical management.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Takeaway
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Fasting—whether you call it Ekadasi, intermittent, or just a mindful pause between dinner and brunch—shows that cultural tradition and science are both pointing toward the same truth: periodic rest from food is renewing. I'm genuinely exploring how to blend both worlds—embracing ancient rhythms while respecting modern medicine—so I can find a practice that's safe, sustainable, and supportive for both mind and body. Sometimes, the best way forward is to pause, reflect, and trust what's always worked—with a little help from science and some sensible precautions.
            </p>
          </section>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Fasting
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Autophagy
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Intermittent Fasting
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Ekadasi
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Health
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Wellness
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Diabetes
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Traditional Medicine
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Autophagy; 