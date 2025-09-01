import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DevastatedByYoungGirlsDemise = () => {
  const navigate = useNavigate();
  const _articleRef = useRef(null);

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
        Devastated by the Young Girl's Sudden Demise
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
        <span>
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <span className="mx-2">•</span>
        <span>5 min read</span>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-md sm:text-lg text-gray-600 mt-4 mb-8">
          A heartbreaking reflection on the sudden loss of a young life to
          dengue-related complications
        </p>

        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Rest in Peace
          </h2>
          <p className="text-gray-600">In loving memory of Harpreet Kaur</p>
          <p className="text-sm text-orange-600 mt-2">
            Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          The Unbearable Weight of Loss
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Sometimes life delivers blows that leave us speechless, breathless,
          and questioning everything we thought we knew. The sudden demise of a
          young girl due to dengue-related complications is one such moment that
          has left me devastated and searching for words that don't seem to
          exist.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          It's not just the loss itself that's unbearable—it's the cruel irony
          of a disease that we've been fighting for decades, the knowledge that
          this could have been prevented, and the stark reminder of how fragile
          life truly is, especially for the young and innocent. we all know
          monsoon and dengue are dangerous together.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">The Tragedy</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Harpreet Kaur - youngest daughter of Manjit Singh was feeling uneasy
          for the last month but not diagnosed and treated properly. Even
          biochemistry tests wasn't done as I learnt.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Dengue: The Silent Killer
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Dengue fever, transmitted by the Aedes mosquito, has become a global
          health crisis, particularly in tropical and subtropical regions. What
          starts as a seemingly manageable fever can rapidly escalate into
          severe dengue hemorrhagic fever or dengue shock syndrome, leading to
          organ failure and death.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          The tragedy lies not just in the medical complexity of the disease,
          but in the fact that we have the knowledge and resources to prevent
          it. Yet, year after year, we continue to lose precious lives to this
          preventable illness.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Essential Blood Tests for Dengue Detection
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The intention behind my post is for you all youngsters to be
          expeditious and use science to take care of yourselves.
        </p>

        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Test Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                What It Detects
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Best Time to Test
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                Reliability
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                NS1 Antigen
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                Dengue virus protein/antigen
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                1–5 days after onset
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <a
                  href="https://www.apollohospitals.com/diagnostics-investigations/dengue-ns1-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  High reliability
                </a>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                RT-PCR
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                Dengue viral RNA/genome
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                1–7 days after onset
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <a
                  href="https://medlineplus.gov/lab-tests/dengue-fever-test/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Gold standard
                </a>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                IgM/IgG
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                Antibodies made by body
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">After 5 days</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <a
                  href="https://medlineplus.gov/lab-tests/dengue-fever-test/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Good for later detection
                </a>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                Biochemistry
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                Indirect markers (AST, ALT, CK, LDH)
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">Any time</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <a
                  href="https://www.ijmedicine.com/index.php/ijam/article/view/3346"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Important for monitoring
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>Take Action:</strong> If you are in any city during heavy
          rains and have these symptoms, it's best to visit a healthcare
          provider for dengue testing right away.
        </p>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Key Takeaways</h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-4">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>
                <strong>
                  Biochemistry tests cannot directly "catch" dengue
                </strong>{' '}
                but can indicate severity or complications.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>
                <strong>
                  Get a dengue NS1 or RT-PCR test within the first 5 days
                </strong>{' '}
                of symptoms.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>
                <strong>
                  Early testing is critical, especially during heavy monsoons
                </strong>{' '}
                with symptoms like stomach pain and uneasiness—do not delay if
                you are worried.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>
                <strong>Consult a doctor immediately</strong> for proper
                diagnosis and monitoring, as dengue can progress rapidly.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">•</span>
              <span>
                <strong>
                  If you are in any city during heavy rains and have these
                  symptoms,
                </strong>{' '}
                it's best to visit a healthcare provider for dengue testing
                right away.
              </span>
            </li>
          </ul>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          Remember: Your health and the health of your loved ones should never
          be taken lightly. When in doubt, get tested. It's better to be safe
          than sorry. This applies to me a lot we well as I am a known
          procrastinator wrt these type of stuff
        </p>

        <div className="border-t border-gray-200 pt-8 mt-12">
          <p className="text-sm text-gray-500 text-center">Sat Sri Akal</p>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-gray-400">
          <p className="text-sm text-gray-700 italic">
            <strong>P.S.:</strong> Especially after reading 2 books this week on
            Philosophy, taking notes and sharing with you all, this news is
            making me to retrospect, think deeper, to seek more clarity on what
            life is?
          </p>
        </div>

              </div>
    </motion.div>
  );
};

export default DevastatedByYoungGirlsDemise;
