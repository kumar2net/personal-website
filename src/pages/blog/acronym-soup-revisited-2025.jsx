import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AcronymSoupRevisited2025 = () => {
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
      <h1 className="text-4xl font-bold mb-2">Acronym Soup Revisited (2025)</h1>
      <h2 className="text-2xl text-gray-700 mb-6">
        From FANG to the Magnificent 7
      </h2>

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
        <span>July 5, 2025</span>
      </div>

      <div className="space-y-8 prose prose-lg max-w-none">
        <div>
          {/* Company badges */}
          <div className="flex flex-wrap gap-3">
            <img
              src="https://img.shields.io/badge/Apple-000000?style=for-the-badge&logo=apple&logoColor=white"
              alt="Apple"
            />
            <img
              src="https://img.shields.io/badge/Microsoft-0078D7?style=for-the-badge&logo=microsoft&logoColor=white"
              alt="Microsoft"
            />
            <img
              src="https://img.shields.io/badge/Alphabet-4285F4?style=for-the-badge&logo=google&logoColor=white"
              alt="Alphabet"
            />
            <img
              src="https://img.shields.io/badge/Amazon-FF9900?style=for-the-badge&logo=amazon&logoColor=black"
              alt="Amazon"
            />
            <img
              src="https://img.shields.io/badge/Meta-1877F2?style=for-the-badge&logo=meta&logoColor=white"
              alt="Meta"
            />
            <img
              src="https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white"
              alt="Nvidia"
            />
            <img
              src="https://img.shields.io/badge/Tesla-CC0000?style=for-the-badge&logo=tesla&logoColor=white"
              alt="Tesla"
            />
          </div>

          {/* Intro */}
          <p>
            <strong>FANG</strong> became <strong>FAANG</strong>, then{' '}
            <strong>MAAMA</strong>. By mid-2025 the Street talks about the
            <em>"Magnificent 7"</em>: Apple, Microsoft, Alphabet, Amazon, Meta,
            Nvidia and Tesla—today's power cluster for tech, markets and policy.
          </p>

          {/* Why the list changed */}
          <h3>Why the List Changed</h3>
          <ul>
            <li>AI, cloud and autonomy rewired business models.</li>
            <li>
              Nvidia & Tesla's multi-trillion-dollar leaps forced expansion.
            </li>
            <li>Acronyms give investors a shortcut to complex shifts.</li>
          </ul>

          {/* What each brings */}
          <h3>What Each Brings (one-liner snapshot)</h3>
          <ul>
            <li>Apple — Spatial computing & wearables.</li>
            <li>Microsoft — Copilot-everywhere, Azure AI.</li>
            <li>Alphabet — Gemini Ultra, Waymo driver-out fleets.</li>
            <li>
              Amazon — Bedrock + Trainium-2 = default enterprise AI stack.
            </li>
            <li>Meta — Llama 3, smart-glasses social layer.</li>
            <li>
              Nvidia — GPUs powering AI &amp; Blackwell chips + Omniverse
              digital twins.
            </li>
            <li>Tesla — Dojo 2, EVs as rolling robots.</li>
          </ul>

          {/* Energy red flag */}
          <h3>Energy Red Flag</h3>
          <p>
            Every LLM prompt drinks ≈ 0.1–0.3 Wh; volumes are doubling. On that
            curve we'll need mid-country-sized power plants within five
            years—just as Google delays its carbon-neutral pledge. Floating
            solar (China) may starve river ecosystems; India's 28 °C AC cap
            shows how quickly comfort gets regulated when grids strain. The
            test: mint clean terawatt-hours without frying the planet.
          </p>

          {/* Takeaways */}
          <h3>Common-Person Takeaways</h3>
          <ol className="list-decimal pl-6">
            <li>
              Higher Bills – AI's energy tab flows into subscriptions, gadgets,
              utilities.
            </li>
            <li>
              Platform Lock-In – Daily life runs inside seven walled gardens;
              know your exit routes.
            </li>
            <li>
              Carbon Math – Every AI interaction consumes energy; small choices
              compound into significant environmental impact.
            </li>
            <li>
              Lifestyle Rules – Governments will implement energy-saving
              regulations like India's 28 °C AC mandate.
            </li>
            <li>
              Skills – Prompt craft and data literacy are becoming basic
              employability.
            </li>
          </ol>

          {/* Wrap up */}
          <h3>Wrap-Up</h3>
          <p>
            From four letters to seven, acronym creep mirrors the concentration
            of tech power. Watch who joins—or drops off—the list next;
            tomorrow's soup will be seasoned by breakthroughs we can scarcely
            imagine today.
          </p>
        </div>
      </div>

      {/* Blog interactions */}
    </motion.div>
  );
};

export default AcronymSoupRevisited2025;
