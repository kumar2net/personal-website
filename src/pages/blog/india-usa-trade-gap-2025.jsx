import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import TldrSummary from '../../components/TldrSummary';

const IndiaUSATradeGap = () => {
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
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>
      
      <h1 className="text-4xl font-bold mb-6">📄 Cornell Notes: India--USA Trade Relations (2024--2025)</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Date: August 7, 2025</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Trade Relations</span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">India Economy</span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">US Tariffs</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">International Trade</span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Economic Policy</span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Bilateral Relations</span>
      </div>

      <div className="space-y-8">
        <TldrSummary articleRef={articleRef} />
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-8 italic">
            Seeing all the hullabaloo after yesterday's announcement by the great country, I set out to understand the numbers and this is what I discovered
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">Cues (Key Questions / Prompts)</th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">Notes (Details)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">What is the total bilateral trade between India & the U.S. (2024)?</td>
                  <td className="border border-gray-300 p-3"><strong>$212.3 billion</strong> (goods + services combined)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Breakdown of trade between U.S. and India (2024):</td>
                  <td className="border border-gray-300 p-3">
                    <strong>Goods:</strong><br/>
                    • U.S. exports: <strong>$41.5 billion</strong><br/>
                    • U.S. imports: <strong>$87.3 billion</strong><br/>
                    • <strong>Total Goods Trade:</strong> $128.9 billion<br/><br/>
                    <strong>Services:</strong><br/>
                    • U.S. exports: <strong>$41.8 billion</strong> (↑15.9%)<br/>
                    • U.S. imports: <strong>$41.6 billion</strong> (↑15.4%)<br/>
                    • <strong>Total Services Trade:</strong> $83.4 billion<br/><br/>
                    <strong>Grand Total Trade:</strong> $212.3 billion
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">What is the trade gap between India and the U.S.?</td>
                  <td className="border border-gray-300 p-3"><strong>$45.8 billion</strong> U.S. trade deficit in <strong>goods</strong> (2024)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">How are India's exports to the U.S. performing in 2025?</td>
                  <td className="border border-gray-300 p-3">Growing strongly; May 2025 exports were <strong>$8.83 billion</strong>, up <strong>16.9%</strong> YoY</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">Which Indian export sectors dominate trade with the U.S.?</td>
                  <td className="border border-gray-300 p-3">Electronics, gems & jewellery, pharmaceuticals, textiles, ready-made garments</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">What tariff policies have affected India-U.S. trade recently?</td>
                  <td className="border border-gray-300 p-3">
                    • August 6, 2025: U.S. imposed <strong>25% tariffs</strong> on <strong>$8.1 billion</strong> Indian goods<br/>
                    • August 7, 2025: U.S. doubled tariffs to <strong>50%</strong>, citing India's Russian oil purchases
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">What is the economic impact estimate of these tariffs on India?</td>
                  <td className="border border-gray-300 p-3">
                    • Exports projected to drop up to <strong>~50%</strong> in affected categories due to tariff hike<br/>
                    • Affected sectors: engineering goods, electronics, pharmaceuticals, garments, gems
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">Why did the U.S. escalate tariffs to 50%?</td>
                  <td className="border border-gray-300 p-3">Due to India continuing to import discounted Russian oil despite U.S. sanctions; U.S. views this as aiding Russia's war effort in Ukraine</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">How has India reacted to the tariff increase?</td>
                  <td className="border border-gray-300 p-3">Strongly condemned as "unfair, unjustified, and unreasonable"</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">What are the risks from this tariff escalation?</td>
                  <td className="border border-gray-300 p-3">Damage to India-U.S. trade relationship and strategic partnership; risk of export contraction; pressure on diplomatic ties</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">What percentage of India's exports are to the U.S.?</td>
                  <td className="border border-gray-300 p-3">U.S. accounts for <strong>~18%</strong> of India's exports in FY25</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">But what about other stuff - IP rights, defence, digital services (google, meta etc), higher education and other stuff the great country sells to India?</td>
                  <td className="border border-gray-300 p-3">Not covered in these notes - focuses primarily on goods and services trade data. The trade numbers don't include IP rights, defense sales, digital services revenue, or other economic benefits, so it's not really an apple-to-apple comparison of the full economic relationship.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mt-12 border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold mb-4 text-blue-800">📝 Summary:</h3>
            <p className="text-base text-gray-700 leading-relaxed font-medium">
              India--U.S. trade reached historic heights in 2024 with total trade of $212.3B. Goods trade shows a significant 
              U.S. trade deficit of $45.8B. Indian exports were growing strongly in 2025, but recent tariff escalations---first 
              25%, now doubled to 50%---have introduced a major disruption, primarily triggered by India's Russian oil imports.
            </p>
          </div>

          {/* Image at the bottom */}
          <div className="mt-12 text-center">
            <img 
              src="/media/India_usa_spat.jpg" 
              alt="India-USA Trade Relations" 
              className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            />
            <p className="text-sm text-gray-500 mt-2 italic">
              Appeared in The Hindu dated 7th August 2025
            </p>
          </div>

          {/* PS */}
          <p className="mt-8 italic text-gray-700">
            PS: As I infer from news of August 9, 2025, the BRICS (Brazil, Russia, India, China, South Africa) group is
            forming a more cohesive alliance to develop alternate solutions—potentially including an alternative to SWIFT
            (Society for Worldwide Interbank Financial Telecommunication — the global financial messaging network used by
            banks for cross-border payments)—, broader financial coordination, and cross-border trade settlement in their
            respective local currencies.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default IndiaUSATradeGap;
