import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import TldrSummary from '../../components/TldrSummary';
// import GraphRecommendations from '../../components/GraphRecommendations';

const TheGreatPivot = () => {
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
        🚀 The Great Pivot — What's Behind All This T&T Hullabaloo! (குய்யோ
        மொய்யோ)
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>Date: August 14, 2025</span>
        <span className="mx-2">•</span>
        <span>5 min read</span>
      </div>

      {/* Badges (shields) */}
      <div className="flex flex-wrap gap-2 mb-4">
        <img
          src="https://img.shields.io/badge/Manufacturing-1F2937?style=for-the-badge&labelColor=111827&color=1F2937"
          alt="Manufacturing"
        />
        <img
          src="https://img.shields.io/badge/US%20Economy-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="US Economy"
        />
        <img
          src="https://img.shields.io/badge/Tariffs-DC2626?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Tariffs"
        />
        <img
          src="https://img.shields.io/badge/Global%20Trade-059669?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Global Trade"
        />
        <img
          src="https://img.shields.io/badge/Economic%20Policy-7C3AED?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Economic Policy"
        />
        <img
          src="https://img.shields.io/badge/Job%20Creation-0891B2?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Job Creation"
        />
        <img
          src="https://img.shields.io/badge/Supply%20Chain-D97706?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Supply Chain"
        />
      </div>

      {/* Hero Image */}
      <div className="mb-8">
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt="US Manufacturing and Industrial Growth"
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Photo by{' '}
          <a href="https://unsplash.com/@nasa" className="underline">
            NASA
          </a>{' '}
          on{' '}
          <a href="https://unsplash.com" className="underline">
            Unsplash
          </a>
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          'Manufacturing',
          'US Economy',
          'Tariffs',
          'Global Trade',
          'Economic Policy',
          'Job Creation',
          'Supply Chain',
        ].map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-8">
        {/* <TldrSummary articleRef={articleRef} /> */}
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-8 italic">
            When the US decides to pivot towards manufacturing glory (from
            getting stuff manufactured at the best place at an optimal cost,
            leveraging global supply chain at the sametime keeping the IP rights
            tightly in control), it's not a nostalgic trip back to old-school
            factories — it's a calculated move in the global economic game. And
            here's the kicker:{' '}
            <strong>one manufacturing job can spark 10 other jobs</strong> —
            from supply chains and transport to retail and app-based delivery.
            That's not just a job; it's a job multiplier.{' '}
            <em>
              (And yes, these moves fit perfectly with their voter base — blue
              collar! hahaha)
            </em>
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-800">
            🎯 The Intention Behind All the Tariff Hoopla
          </h2>
          <p className="text-gray-700 mb-6">
            The tariffs making headlines aren't just about flexing economic
            muscle. They're meant to:
          </p>
          <ul className="list-disc pl-6 mb-8 space-y-2 text-gray-700">
            <li>
              <strong>Make imports more expensive</strong>, nudging buyers
              toward American-made goods.
            </li>
            <li>
              <strong>Revive homegrown industries</strong> and cut foreign
              dependency.
            </li>
            <li>
              <strong>Strengthen supply chain security</strong>.
            </li>
            <li>
              <strong>Boost exports</strong> by accepting a{' '}
              <strong>slightly weaker dollar</strong>, making US products
              cheaper overseas and helping close the trade gap.
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-10 mb-6 text-gray-800">
            📊 2025 US Trade Deficit — Top Players
          </h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Rank
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Country
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    US Trade Deficit (2025)
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Key Drivers
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    1
                  </td>
                  <td className="border border-gray-300 p-3">🇨🇳 China</td>
                  <td className="border border-gray-300 p-3 font-semibold">
                    ~$270B
                  </td>
                  <td className="border border-gray-300 p-3">
                    Electronics, machinery, consumer goods
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    2
                  </td>
                  <td className="border border-gray-300 p-3">🇲🇽 Mexico</td>
                  <td className="border border-gray-300 p-3 font-semibold">
                    ~$157B
                  </td>
                  <td className="border border-gray-300 p-3">
                    Auto parts, integrated manufacturing
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    3
                  </td>
                  <td className="border border-gray-300 p-3">🇻🇳 Vietnam</td>
                  <td className="border border-gray-300 p-3 font-semibold">
                    ~$113B
                  </td>
                  <td className="border border-gray-300 p-3">
                    Electronics, apparel
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    —
                  </td>
                  <td className="border border-gray-300 p-3">🇮🇳 India</td>
                  <td className="border border-gray-300 p-3 font-semibold">
                    ~$41.5B
                  </td>
                  <td className="border border-gray-300 p-3">
                    Pharmaceuticals, textiles, gems
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-800">
            🇮🇳 Where India Fits In
          </h2>
          <p className="text-gray-700 mb-8">
            India isn't going for an overnight breakup with the dollar but is
            carefully growing rupee-based trade with BRICS partners. This trims
            dollar reliance without rattling global markets.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-800">
            💱 The Currency Shift
          </h2>
          <p className="text-gray-700 mb-8">
            As more countries trade in their own currencies, the global economy
            starts to sound less like a solo act from "King Dollar" and more
            like a playlist with multiple headliners.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-800">
            🤖 The Tech Advantage
          </h2>
          <p className="text-gray-700 mb-8">
            AI, robotics, and automation are turning factories into sleek,
            high-efficiency production hubs — cleaner, smarter, and more
            resilient than ever.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              💡 Bottom Line
            </h3>
            <p className="text-blue-900">
              The US manufacturing revival isn't about bringing back
              smoke-belching chimneys — it's about building a self-sustaining
              growth engine where jobs multiply, trade gaps narrow, and economic
              influence shifts. The pivot is real, and it's accelerating. 🚀
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
            <h3 className="text-xl font-bold mb-4 text-green-800">
              🦄 P.S. – The Accel VC Summit Insight
            </h3>
            <p className="text-green-900">
              The ultimate takeaway from the recent Accel VC summit is
              unmistakable: the 'smart money' is decisively moving from pure
              software to smart hardware. The consensus is that India's next
              unicorn herd 🦄 won't just be coded in apps but will be forged in
              our factories and R&D labs. This isn't just an industry shift;
              it's the dawn of the 'Invented in India' era.
            </p>
          </div>

          {/* Neural Graph Recommendations */}
          {/* <div className="mt-12">
            <GraphRecommendations 
              currentPostId="the-great-pivot" 
              maxRecommendations={5} 
            />
          </div> */}

          {/* <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">🔗 Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Manufacturing Revival</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Job Multiplier Effect</span>
              <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">Trade Policy</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Economic Strategy</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Global Trade Dynamics</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Blog interactions */}
          </motion.div>
  );
};

export default TheGreatPivot;
