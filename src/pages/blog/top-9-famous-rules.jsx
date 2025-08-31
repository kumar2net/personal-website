import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'


import DisqusComments from '../../components/DisqusComments';const Top9FamousRules = () => {
  const navigate = useNavigate()
  const publishedDate = 'August 9, 2025'
  const readingTime = '3 min read'

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
      <h1 className="text-4xl font-bold mb-2">Top 10 Famous Rules (with Examples)</h1>

      {/* Meta: date + read time */}
      <div className="flex items-center gap-3 text-gray-600 mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{publishedDate}</span>
        </div>
        <span className="text-gray-400">•</span>
        <span>{readingTime}</span>
      </div>

      {/* Badges (shields) */}
      <div className="flex flex-wrap gap-2 mb-4">
        <img src="https://img.shields.io/badge/Mental%20Models-1F2937?style=for-the-badge&labelColor=111827&color=1F2937" alt="Mental Models" />
        <img src="https://img.shields.io/badge/Decision%20Making-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Decision Making" />
        <img src="https://img.shields.io/badge/Productivity-065F46?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Productivity" />
        <img src="https://img.shields.io/badge/Statistics-9333EA?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Statistics" />
        <img src="https://img.shields.io/badge/Economics-DC2626?style=for-the-badge&labelColor=1F2937&logoColor=white" alt="Economics" />
      </div>

      {/* Hero image */}
      <div className="mb-8">
        <img
          src="https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=1600&q=80"
          alt="Notebook with rules and ideas"
          className="w-full h-64 object-cover rounded-lg shadow"
        />
        <p className="mt-2 text-xs text-gray-500">
          Photo by <a className="underline" href="https://unsplash.com/" target="_blank" rel="noreferrer">Unsplash</a>
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['Mental Models', 'Decision Making', 'Productivity', 'Economics', 'Statistics'].map((tag) => (
          <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{tag}</span>
        ))}
      </div>

      {/* Content (from docs/Top9Rules.md + last-minute addition) */}
      <div className="space-y-8 prose prose-lg max-w-none">
        <p>I am a great fan of these and wanted to share these with you.</p>

        <section>
          <h2>1. Rule of 72</h2>
          <ul>
            <li>What it is: Estimates how long it takes for an investment to double, given a fixed annual percentage rate, by dividing 72 by the rate.</li>
            <li>Example: At 6% annual interest, it takes 12 years for your money to double (72 ÷ 6 = 12).</li>
            <li>Einstein's Quote: “Compound interest is the eighth wonder of the world. He who understands it, earns it ... he who doesn’t ... pays it.”</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>2. Pareto Principle (80/20 Rule)</h2>
          <ul>
            <li>What it is: 80% of effects come from 20% of causes.</li>
            <li>Example: In business, 80% of sales come from 20% of customers.</li>
            <li>Effort tip (tackling important tasks): Identify the top 20% high-impact tasks and dedicate early deep-work blocks to them; batch/defer the low-impact 80%.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>3. Murphy’s Law</h2>
          <ul>
            <li>What it is: Anything that can go wrong, will go wrong.</li>
            <li>Example: If you’re running late, you’ll likely hit every red light.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>4. Parkinson’s Law</h2>
          <ul>
            <li>What it is: Work expands to fill the time available for its completion.</li>
            <li>Example: Give yourself a week to do a one-hour task, and you’ll take a week to finish it.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>5. Occam’s Razor</h2>
          <ul>
            <li>What it is: The simplest solution is most likely to be correct.</li>
            <li>Example: If your car won’t start, check if you’re out of fuel before assuming a major fault.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>6. Peter Principle</h2>
          <ul>
            <li>What it is: People rise to their level of incompetence.</li>
            <li>Example: An excellent engineer promoted to manager may not excel in a management role.</li>
            <li>Steve Jobs: “Be a yardstick of quality. Some people aren’t used to an environment where excellence is expected.”</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>7. Law of Diminishing Returns</h2>
          <ul>
            <li>What it is: Adding more of one factor of production soon yields lower per-unit returns.</li>
            <li>Example: Studying extra hours might help at first but gives less benefit the longer you go without rest.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>8. Law of Large Numbers</h2>
          <ul>
            <li>What it is: As a sample size grows, its mean gets closer to the average of the whole population.</li>
            <li>Example: Flipping a coin many times will result in about 50% heads and 50% tails.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>9. Benford’s Law</h2>
          <ul>
            <li>What it is: In many sets of real-life data, the leading digit is likely to be small.</li>
            <li>Example: In accounting, the number 1 appears as the leading digit about 30% of the time.</li>
            <li>Philosophical lens: Nature often reveals order within apparent randomness; our intuition expects uniformity, but reality is uneven—use this as a humility check, not a rigid rule.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>10. Rule of 100 (100 − Age)</h2>
          <ul>
            <li>What it is: A simple rule of thumb for asset allocation: target equity percentage ≈ 100 minus your age; the rest in Government bonds/cash/Gold ETFs.</li>
            <li>Example: If you are 30 years old, equities ≈ 70% and bonds/cash/Gold ETFs ≈ 30%.</li>
            <li>Note: This is a last-minute addition to round out the list with a practical personal finance rule.</li>
          </ul>
        </section>

        <p><em>PS: The 10th rule (Rule of 100) was a last-minute addition based on my personal experience and an important lesson I learned. Too late for me to rebalance my portfolio, but I am sharing this with you. Since many of you starting your work life now, this is a good rule to follow.</em></p>
      </div>
    </motion.div>
  )
}

export default Top9FamousRules


