import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import InspiredBy from "../../components/InspiredBy";

const SandelMarketMorality = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>
          What Money Can't Buy: Lessons from Michael Sandel on Market Morality -
          Kumar's Stories
        </title>
        <meta
          name="description"
          content="Exploring the moral limits of markets through Michael Sandel's teaching - from market society to incentives, examining where commerce ends and civic virtue begins."
        />
        <meta
          name="keywords"
          content="Michael Sandel, market morality, civic virtue, philosophy, ethics, market society, moral limits, Harvard, political philosophy"
        />
        <link
          rel="canonical"
          href="https://kumar.website/blog/2025-10-26-sandel-market-morality"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12"
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate("/blog")}
              className="px-4 py-2 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-600"
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

          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              💰 What Money Can't Buy
            </motion.h1>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 italic mb-4"
            >
              Lessons from Michael Sandel on Market Morality and Civic Virtue
            </motion.p>
            <div className="flex items-center justify-center text-gray-500 text-sm">
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
              <span>
                Published on{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
              Philosophy
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm">
              Ethics
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium shadow-sm">
              Political Science
            </span>
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium shadow-sm">
              Market Society
            </span>
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium shadow-sm">
              Civic Virtue
            </span>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium shadow-sm">
              Harvard
            </span>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-10 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500"
              >
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  What happens when market logic infiltrates every corner of
                  human life? When education, justice, and even intimacy become
                  commodities to be bought and sold? Harvard philosopher Michael
                  Sandel's profound work "What Money Can't Buy" challenges us to
                  examine the moral limits of markets and rediscover the meaning
                  of civic virtue.
                </p>
                <p className="text-gray-600 italic">
                  Through a discussion-based learning approach, I (Kumar.A)
                  explored Sandel's key concepts and their real-world
                  implications, particularly for societies like India where
                  poverty and prosperity create complex moral landscapes. What
                  follows are my personal observations and responses to the
                  teaching prompts.
                </p>
              </motion.div>

              {/* Module 1 - Market Society */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                    1
                  </span>
                  🏛️ From Market Economy to Market Society
                </h2>

                <div className="bg-gray-50 p-8 rounded-xl mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    The Critical Distinction
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                    <p className="text-blue-900 font-semibold text-sm mb-2">
                      Professor Sandel's Teaching Prompt:
                    </p>
                    <p className="text-blue-800 text-sm italic">
                      "What's the difference between a market economy and a
                      market society?"
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Sandel draws a crucial line between a{" "}
                    <strong>market economy</strong> — a tool for organizing
                    production and exchange — and a{" "}
                    <strong>market society</strong>, where market values
                    penetrate moral, civic, and human spheres.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-300">
                    <p className="text-blue-800 font-medium text-sm mb-2">
                      Kumar.A's Initial Response:
                    </p>
                    <p className="text-blue-700 text-sm italic">
                      "Market economy according to me is where goods and
                      services are sold and profit and loss are the benchmark.
                      Market society is the common man who consumes these goods
                      and services — rich, poor, or middle class."
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border-l-4 border-blue-400">
                    <p className="text-gray-500 text-sm mb-2">
                      Refined Understanding:
                    </p>
                    <p className="text-gray-700 italic">
                      "A market society is when market values shape social norms
                      — we start treating civic life, education, or friendship
                      in transactional terms."
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg mb-4 border-l-4 border-purple-500">
                  <p className="text-purple-900 font-semibold text-sm mb-2">
                    Professor Sandel's Teaching Prompt:
                  </p>
                  <p className="text-purple-800 text-sm italic">
                    "Can you give an example where something shouldn't be bought
                    or sold but has become commercialized?"
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-6 border-l-4 border-green-400">
                  <p className="text-green-800 font-medium text-sm mb-2">
                    Kumar.A's Moral Stance:
                  </p>
                  <p className="text-green-700 text-sm italic">
                    "Primary or basic education should never be sold. As is
                    basic food grains per month per person which is needed for
                    survival."
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">
                      ✅ What Should Remain Sacred
                    </h4>
                    <ul className="text-green-700 space-y-2">
                      <li>• Primary education for all</li>
                      <li>• Basic food security</li>
                      <li>• Healthcare access</li>
                      <li>• Justice and legal equality</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3">
                      ⚡ Where Markets Excel
                    </h4>
                    <ul className="text-orange-700 space-y-2">
                      <li>• Innovation and creativity</li>
                      <li>• Efficient resource allocation</li>
                      <li>• Economic growth</li>
                      <li>• Technological advancement</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg mb-4 border-l-4 border-indigo-500">
                  <p className="text-indigo-900 font-semibold text-sm mb-2">
                    Professor Sandel's Teaching Prompt:
                  </p>
                  <p className="text-indigo-800 text-sm italic">
                    "Does money always corrupt moral values, or can markets
                    promote virtue?"
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <p className="text-orange-800 font-medium text-sm mb-2">
                    Kumar.A's Market Defense:
                  </p>
                  <p className="text-orange-700 text-sm italic">
                    "I do not think money corrupts moral values. Internet is
                    what it is today because of freemium and ad-driven models.
                    Money attributed to capitalism promotes efficiency,
                    creativity, and innovation."
                  </p>
                </div>
              </motion.div>

              {/* Module 2 - Incentives vs Values */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                    2
                  </span>
                  ⚖️ The Incentives Paradox
                </h2>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    When Money Crowds Out Morality
                  </h3>
                  <div className="bg-teal-50 p-4 rounded-lg mb-4 border-l-4 border-teal-500">
                    <p className="text-teal-900 font-semibold text-sm mb-2">
                      Professor Sandel's Core Concept:
                    </p>
                    <p className="text-teal-800 text-sm italic">
                      "Incentives can sometimes crowd out intrinsic motivation.
                      The key is knowing when incentives serve virtue and when
                      they replace it."
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Sandel reveals how incentives can sometimes{" "}
                    <em>crowd out intrinsic motivation</em>. The challenge lies
                    in knowing when incentives serve virtue and when they
                    replace it entirely.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg mb-4 border-l-4 border-red-300">
                    <p className="text-red-800 font-medium text-sm mb-2">
                      Kumar.A's Observation:
                    </p>
                    <p className="text-red-700 text-sm italic">
                      "Yes, I think 'quid pro quo' is not correct and is an
                      extremely bad attitude that should be eradicated."
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg mb-4 border-l-4 border-amber-500">
                    <p className="text-amber-900 font-semibold text-sm mb-2">
                      Professor Sandel's Teaching Prompt:
                    </p>
                    <p className="text-amber-800 text-sm italic">
                      "A situation where offering money reduced willingness to
                      do the right thing:"
                    </p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg border-l-4 border-red-400 mb-4">
                    <p className="text-red-800 font-medium">
                      ⚠️ The "Quid Pro Quo" Problem: When transactional logic
                      replaces civic duty with self-interest
                    </p>
                  </div>
                </div>

                {/* Case Study */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3">🔍</span>
                    Case Study: Blood Donation in India
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-cyan-50 p-3 rounded-lg mb-3 border-l-4 border-cyan-500">
                        <p className="text-cyan-900 font-semibold text-xs mb-1">
                          Professor Sandel's Teaching Prompt:
                        </p>
                        <p className="text-cyan-800 text-xs italic">
                          "Can incentives promote virtue?"
                        </p>
                      </div>
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Kumar.A's Moral Argument
                      </h4>
                      <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
                        <p className="text-blue-700 text-xs italic">
                          "Incentivising blood donation or volunteering, if done
                          the right way, is not wrong morally. Especially in
                          India, where many are poor but demographically young,
                          a fit youngster can donate blood and volunteer to earn
                          some money. There is nothing wrong in this."
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        When rewards expand participation without erasing moral
                        intent, they strengthen civic engagement rather than
                        corrupt virtue.
                      </p>
                    </div>
                    <div>
                      <div className="bg-slate-50 p-3 rounded-lg mb-3 border-l-4 border-slate-500">
                        <p className="text-slate-900 font-semibold text-xs mb-1">
                          Professor Sandel's Teaching Prompt:
                        </p>
                        <p className="text-slate-800 text-xs italic">
                          "Guiding principle for using incentives in moral or
                          civic areas:"
                        </p>
                      </div>
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Kumar.A's Pragmatic Reality
                      </h4>
                      <div className="bg-gray-100 p-3 rounded-lg mb-3 border border-gray-300">
                        <p className="text-gray-800 text-xs italic font-medium">
                          "Morality and market — don't bring too much civic
                          sense into play when the poor are concerned. Bring up
                          their quality of life before taking high moral
                          grounds."
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        A reminder that survival precedes symbolism, and moral
                        discussions must consider material realities.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ethical Boundaries */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                    3
                  </span>
                  🚫 Drawing Moral Lines
                </h2>

                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                      🫀 Organ Sales: Kumar.A's Regulated Compassion
                    </h3>
                    <div className="bg-yellow-100 p-3 rounded-lg mb-3 border border-yellow-300">
                      <p className="text-yellow-800 text-xs italic">
                        "If proper governance is enforced, organ sales of a
                        brain-dead person or someone in a vegetative state are
                        justified. The family can earn money to sustain their
                        life."
                      </p>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Markets serving moral ends through regulation, consent,
                      and compassion for families facing difficult
                      circumstances.
                    </p>
                  </div>

                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-pink-800 mb-3">
                      👶 Surrogacy: Kumar.A's Dignity Through Choice
                    </h3>
                    <div className="bg-pink-100 p-3 rounded-lg mb-3 border border-pink-300">
                      <p className="text-pink-800 text-xs italic">
                        "Similarly, surrogacy is acceptable if done for genuine
                        health reasons, and the surrogate deserves fair
                        compensation."
                      </p>
                    </div>
                    <p className="text-pink-700 text-sm">
                      Empowering women economically while helping families —
                      provided exploitation is prevented through proper
                      safeguards and genuine need.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Key Insights */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                    💡
                  </span>
                  Key Insights: Ethical Pragmatism
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-3">🎯</div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Moral Clarity
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Recognizing what should never be commodified — education,
                      basic food, healthcare access.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-3">🌍</div>
                    <h4 className="font-semibold text-purple-800 mb-2">
                      Cultural Context
                    </h4>
                    <p className="text-purple-700 text-sm">
                      Understanding that moral discussions must consider
                      material realities and local conditions.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-3">⚖️</div>
                    <h4 className="font-semibold text-green-800 mb-2">
                      Balanced Approach
                    </h4>
                    <p className="text-green-700 text-sm">
                      Markets and morality can coexist through empathy, justice,
                      and proper governance.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Conclusion */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-3">🎭</span>
                  The Art of Moral Balance
                </h2>
                <div className="bg-emerald-50 p-4 rounded-lg mb-4 border-l-4 border-emerald-500">
                  <p className="text-emerald-900 font-semibold text-sm mb-2">
                    Professor Sandel's Central Question:
                  </p>
                  <p className="text-emerald-800 text-sm italic">
                    "Where should market logic end and civic virtue begin?"
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sandel's teachings remind us that the question isn't whether
                  markets are good or bad, but rather:
                  <em>
                    Where should market logic end and civic virtue begin?
                  </em>{" "}
                  The answer requires balancing moral idealism with practical
                  compassion.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  In societies marked by inequality, we must be especially
                  thoughtful about when incentives serve dignity and when they
                  exploit vulnerability. The goal isn't to eliminate markets,
                  but to ensure they serve human flourishing rather than
                  diminish it.
                </p>
                <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                  <p className="text-blue-800 font-medium text-center italic">
                    "Compassion over abstraction, empathy over ideology — this
                    is the path to ethical pragmatism."
                  </p>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <p>
                      📚 <strong>Course:</strong> Harvard's Michael Sandel
                      Teaching Track
                    </p>
                    <p>
                      📖 <strong>Focus:</strong> "What Money Can't Buy" -
                      Modules 1 & 2
                    </p>
                    <p>
                      👤 <strong>Participant:</strong> Kumar.A
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <strong>Discussion Format:</strong>
                    </p>
                    <p>Personal responses to teaching prompts</p>
                    <p>
                      <strong>Next Module:</strong>
                    </p>
                    <p>The Moral Limits of Markets</p>
                  </div>
                </div>
              </div>

              {/* Inspired By Section */}
              <InspiredBy
                person="Our Youngest Boy"
                description="A living example of 'Sharing is Caring' - whose generous spirit and natural inclination to share knowledge, toys, and kindness with everyone around him inspired this exploration of when markets serve virtue and when they might diminish our humanity's innate goodness. He is so lucky, fortunate and actually earned the right so to say - to interact with Prof. with the calibre of Michael Sandel."
                icon="💝"
                theme="green"
                className="mt-8"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SandelMarketMorality;
