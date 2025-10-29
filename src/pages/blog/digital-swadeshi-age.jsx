import { motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const MotionDiv = motion.div;

const DigitalSwadeshiAge = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/blog")}
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
        Digital Swadeshi Age: How India Could Outlast a U.S. Tech Blockade
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
        <span>Date: October 29, 2025</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          Digital Sovereignty
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          India
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          Cloud Infra
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          AI Ecosystem
        </span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Trade Policy
        </span>
        <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
          Resilience
        </span>
      </div>

      <div ref={articleRef} className="space-y-10 prose prose-lg max-w-none">
        <p className="text-lg text-gray-700">
          Imagine Washington cutting India off from the U.S. tech stack: no AWS,
          no GitHub, no App Store, no Stripe payouts, and no GPT APIs to call on
          demand. The first instinct is panic—productivity could crater by
          30–40% within weeks. Yet the past decade of building indigenous
          digital infrastructure hints at a different arc: short-term chaos,
          followed by a determined sprint toward a sovereign stack.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            What Collapses on Day Zero
          </h2>
          <p>
            A blanket blockade would hit every layer of India’s digital economy.
            The table below summarizes which layers fail first and who feels the
            most pain.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">
                    Digital Layer
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Instant Fallout
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Who Hurts Most
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Cloud (AWS, Azure, Google Cloud)
                  </td>
                  <td className="border border-gray-300 p-3">
                    Startups and data centers lose hosting, storage, and managed
                    services overnight.
                  </td>
                  <td className="border border-gray-300 p-3">
                    SaaS, fintech, and large-scale e-commerce operations.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    APIs & Developer Tools (GitHub, npm, Firebase, OpenAI)
                  </td>
                  <td className="border border-gray-300 p-3">
                    CI/CD pipelines fail, repos become inaccessible, and AI
                    assistants go silent.
                  </td>
                  <td className="border border-gray-300 p-3">
                    Full-stack developers and product engineering teams.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    App Stores (Google Play, Apple App Store)
                  </td>
                  <td className="border border-gray-300 p-3">
                    Distribution and updates to 90% of India’s mobile base halt.
                  </td>
                  <td className="border border-gray-300 p-3">
                    SMEs, D2C brands, and everyday mobile users.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Payments (Visa, Mastercard, Stripe)
                  </td>
                  <td className="border border-gray-300 p-3">
                    Cross-border transactions freeze and freelancers lose payout
                    rails.
                  </td>
                  <td className="border border-gray-300 p-3">
                    Exporters, SaaS founders, and global gig workers.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    AI Models & LLM APIs
                  </td>
                  <td className="border border-gray-300 p-3">
                    Copilot, GPT, and Gemini access vanishes for analytics,
                    customer care, and code-gen workflows.
                  </td>
                  <td className="border border-gray-300 p-3">
                    AI-native startups and data science teams.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <figure className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <img
            src="/media/ChatGPT%20Image%20Oct%2029,%202025,%2003_48_07%20PM.png"
            alt="Concept art showing India navigating a digital blockade"
            loading="lazy"
            decoding="async"
            className="w-full rounded-md shadow-sm"
          />
          <figcaption className="text-sm text-gray-500 mt-3">
            The first shock is brutal: cloud, payments, and developer tools go
            dark in a single move.
          </figcaption>
        </figure>

        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            The Domestic Stack India Already Built
          </h2>
          <p>
            The blockade exposes dependencies, but it also forces attention on
            the “Swadeshi” stack that already exists. Piece by piece, a local
            alternative can replace the U.S. layer.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">
                    Domain
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Indian / Neutral Substitute
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Cloud Infrastructure
                  </td>
                  <td className="border border-gray-300 p-3">
                    JioCloud, NxtGen, and Tata NeuCloud for compute and storage.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Code & Collaboration
                  </td>
                  <td className="border border-gray-300 p-3">
                    Zoho WorkDrive, GitLab (EU), and GitBucket for repo hosting
                    and DevOps.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Payments
                  </td>
                  <td className="border border-gray-300 p-3">
                    UPI, RuPay, ONDC, and NPCI rails for domestic and regional
                    commerce.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    AI & Language Models
                  </td>
                  <td className="border border-gray-300 p-3">
                    Sarvam AI, Krutrim, BharatGPT, and CoRover’s assistants.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    App Distribution
                  </td>
                  <td className="border border-gray-300 p-3">
                    Indus Appstore and Samsung’s marketplace as immediate
                    fallback options.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Operating Systems & Productivity
                  </td>
                  <td className="border border-gray-300 p-3">
                    BharOS, Zoho’s SaaS stack, TCS Ignio, and Karya AI for the
                    workplace layer.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            Timeline: Shock, Recovery, Rebuild
          </h2>
          <p>
            India’s roadmap looks like a forced regression followed by a sprint
            back to modernity—this time on sovereign rails.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">
                    Phase
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Duration
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Key Dynamics
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Shock
                  </td>
                  <td className="border border-gray-300 p-3">0–6 months</td>
                  <td className="border border-gray-300 p-3">
                    Startups shutter, VPN usage spikes, and teams scramble for
                    workarounds.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Recovery
                  </td>
                  <td className="border border-gray-300 p-3">6–18 months</td>
                  <td className="border border-gray-300 p-3">
                    Jio, Zoho, and other domestic players scale replacements;
                    local AI accelerators take shape.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Rebuild
                  </td>
                  <td className="border border-gray-300 p-3">18–36 months</td>
                  <td className="border border-gray-300 p-3">
                    Homegrown tools mature, Swadeshi app stores gain share, and
                    India builds for export on its own stack.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <figure className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <img
            src="/media/ChatGPT%20Image%20Oct%2029,%202025,%2003_48_14%20PM.png"
            alt="Timeline illustration showing three phases of recovery"
            loading="lazy"
            decoding="async"
            className="w-full rounded-md shadow-sm"
          />
          <figcaption className="text-sm text-gray-500 mt-3">
            Stone Age for six months, Bronze Age in a year, and a Digital
            Swadeshi Age within three: the sprint is brutal but achievable.
          </figcaption>
        </figure>

        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            Strategic Takeaways
          </h2>
          <ul className="space-y-3 list-disc pl-6">
            <li>
              Convenience gives way to control: losing Western tooling forces
              India to own core infrastructure.
            </li>
            <li>
              U.S. influence wanes as Indian firms embrace self-hosted and
              regional alternatives.
            </li>
            <li>
              New power centers emerge—local AI models, payments rails, cloud
              providers, and open-source collectives.
            </li>
            <li>
              By 2030, India can credibly operate as a fully self-reliant
              digital republic with export-ready platforms.
            </li>
          </ul>
        </section>

        <figure className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <img
            src="/media/ChatGPT%20Image%20Oct%2029,%202025,%2003_48_45%20PM.png"
            alt="Poster-style visualization of the Digital Swadeshi Age"
            loading="lazy"
            decoding="async"
            className="w-full rounded-md shadow-sm"
          />
          <figcaption className="text-sm text-gray-500 mt-3">
            The renaissance moment: a sovereign stack built by India, for India,
            with enough momentum to serve the world.
          </figcaption>
        </figure>

        <section>
          <h2 className="text-2xl font-bold text-gray-800">Final Reflection</h2>
          <p>
            The next digital revolution for India might not be driven by the
            newest AI breakthrough but by asserting ownership over every layer
            that matters. A U.S. blockade would be painful, but it could also be
            the catalyst that ushers in a Digital Swadeshi renaissance—one where
            India writes its own playbook and ships it to the world.
          </p>
        </section>
      </div>
    </MotionDiv>
  );
};

export default DigitalSwadeshiAge;
