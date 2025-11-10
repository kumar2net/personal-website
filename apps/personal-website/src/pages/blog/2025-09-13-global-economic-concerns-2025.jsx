import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogPostDates } from '../../utils/blogPostDates';

const { formattedPublishDate } = getBlogPostDates(import.meta.url);

const GlobalEconomicConcerns = () => {
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
        🌍 Global Economic Concerns: A 2025 Pew Research Perspective
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
        <span>Date: {formattedPublishDate}</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Global Economy
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Economic Survey
        </span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Economic Inequality
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          International Relations
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          Economic Outlook
        </span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          Pew Research
        </span>
      </div>

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-8 italic">
            The 2025 Pew Research Center survey reveals fascinating insights
            into how different nations perceive global economic threats and
            their economic outlooks. Here's what the data tells us about
            economic concerns across five major economies.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Country
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    % Viewing Global Economy as Major Threat
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Notable Additional Economic Concerns
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    General Economic Outlook/Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    India
                  </td>
                  <td className="border border-gray-300 p-3">
                    <strong>~70%</strong>
                  </td>
                  <td className="border border-gray-300 p-3">
                    High concern about economic inequality (81%), wealth gap
                  </td>
                  <td className="border border-gray-300 p-3">
                    75% optimistic about financial future despite concerns
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Singapore
                  </td>
                  <td className="border border-gray-300 p-3">
                    (Not separately detailed in summary)
                  </td>
                  <td className="border border-gray-300 p-3">
                    Likely moderate-to-high concern as high-income Asia-Pacific
                  </td>
                  <td className="border border-gray-300 p-3">
                    Generally more positive economic outlook compared to India
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    USA
                  </td>
                  <td className="border border-gray-300 p-3">
                    <strong>~65%</strong>
                  </td>
                  <td className="border border-gray-300 p-3">
                    Concern about misinformation, political influence by wealthy
                  </td>
                  <td className="border border-gray-300 p-3">
                    Growing concern since 2017, related to national economic
                    views
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Canada
                  </td>
                  <td className="border border-gray-300 p-3">
                    <strong>~65%</strong>
                  </td>
                  <td className="border border-gray-300 p-3">
                    Similar concerns as USA, slightly lower level
                  </td>
                  <td className="border border-gray-300 p-3">
                    Views shaped by national economic sentiment
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    UK
                  </td>
                  <td className="border border-gray-300 p-3">
                    <strong>~70%</strong>
                  </td>
                  <td className="border border-gray-300 p-3">
                    Rising concerns about misinformation and climate change
                  </td>
                  <td className="border border-gray-300 p-3">
                    Sharper increase in viewing economy as threat since 2017
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Key Insights from the Survey
          </h2>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                🇮🇳 India: Optimism Amidst Concerns
              </h3>
              <p className="text-gray-700">
                India stands out with the highest level of concern about the
                global economy at 70%, yet maintains remarkable optimism about
                personal financial futures. This paradox highlights the Indian
                population's ability to separate global economic threats from
                personal economic prospects. The high concern about economic
                inequality (81%) suggests a growing awareness of wealth
                distribution issues.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-800">
                🇺🇸🇨🇦 North American Perspective
              </h3>
              <p className="text-gray-700">
                Both the USA and Canada show similar concern levels at 65%,
                reflecting their interconnected economies and shared economic
                challenges. The focus on misinformation and political influence
                by wealthy individuals indicates a growing concern about the
                intersection of economics and democracy in these nations.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-purple-800">
                🇬🇧 UK: Sharp Increase in Concerns
              </h3>
              <p className="text-gray-700">
                The UK shows the most dramatic change, with a sharper increase
                in viewing the economy as a threat since 2017. This likely
                reflects the economic uncertainties surrounding Brexit and its
                aftermath, combined with global economic pressures.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-orange-800">
                🇸🇬 Singapore: The Asian Exception
              </h3>
              <p className="text-gray-700">
                While specific data for Singapore wasn't detailed in the
                summary, the note about a generally more positive economic
                outlook compared to India suggests that high-income Asia-Pacific
                nations may have different economic perspectives, possibly due
                to stronger economic fundamentals and policy frameworks.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800">
            Common Themes Across Nations
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Economic Inequality:</strong> A universal concern,
              particularly pronounced in India with 81% expressing worry about
              wealth gaps
            </li>
            <li>
              <strong>Information Quality:</strong> Misinformation emerges as a
              significant economic concern, especially in Western nations
            </li>
            <li>
              <strong>Political-Economic Nexus:</strong> Growing awareness of
              how political influence affects economic outcomes
            </li>
            <li>
              <strong>Climate Change:</strong> Particularly noted in the UK,
              showing the intersection of environmental and economic concerns
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800">
            Implications for Global Economic Policy
          </h2>

          <p className="text-gray-700 mb-4">
            The survey reveals that economic concerns are increasingly
            intertwined with social and political issues. The high levels of
            concern about inequality suggest that economic policies need to
            address not just growth, but also distribution. The focus on
            misinformation indicates that economic literacy and transparent
            communication are becoming crucial for economic stability.
          </p>

          <p className="text-gray-700 mb-4">
            The varying levels of optimism despite similar concerns suggest that
            national economic policies and local economic conditions play a
            significant role in shaping public sentiment, even when global
            economic threats are recognized.
          </p>

          <div className="bg-gray-100 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Methodology Note
            </h3>
            <p className="text-gray-600 text-sm">
              This analysis is based on the 2025 Pew Research Center survey on
              global economic concerns. The survey methodology and specific
              sample sizes were not detailed in the provided summary, but the
              data offers valuable insights into cross-national economic
              sentiment patterns.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalEconomicConcerns;
