import { motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const MotionDiv = motion.div;

const badgeStyles = {
  quantum: "bg-indigo-100 text-indigo-800",
  bitcoin: "bg-yellow-100 text-yellow-800",
  security: "bg-emerald-100 text-emerald-800",
  pqc: "bg-rose-100 text-rose-800",
  explainer: "bg-slate-100 text-slate-800",
};

const qubitCapabilityInfographic = "/media/Qbit_Realworld.png";

const quantumSecurityInfographic =
  "/media/ChatGPT%20Image%20Oct%2031%2C%202025%2C%2009_37_24%20AM.png";

const ladderIllustration = "/media/quantum-security-ladder.svg";

const qubitEvolutionIllustration = "/media/quantum-capability-bars.svg";

const QuantumComputingVsSecurity = () => {
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

      <header className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">
            Quantum Computing vs Banking & Bitcoin Security — Explained the
            Feynman Way
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg
              className="w-4 h-4"
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
            October 30, 2025 · 3 min read
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyles.quantum}`}
          >
            Quantum
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyles.bitcoin}`}
          >
            Bitcoin
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyles.security}`}
          >
            Security
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyles.pqc}`}
          >
            PQC
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${badgeStyles.explainer}`}
          >
            Explainer
          </span>
        </div>
      </header>

      <div ref={articleRef} className="mt-10 space-y-12">
        <blockquote className="border-l-4 border-blue-400 bg-blue-50 p-6 rounded-lg text-lg text-gray-700 italic">
          “If you can’t explain it simply, you don’t understand it well enough.”
          — in the spirit of Richard Feynman
        </blockquote>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-xl font-semibold text-emerald-900 mb-3">
              TL;DR
            </h2>
            <ul className="list-disc list-inside space-y-2 text-emerald-900">
              <li>
                Proof-of-work hashing (SHA-256) stays comfortable — Grover only
                gives a square-root speed-up.
              </li>
              <li>
                Signatures (ECDSA/RSA) are future targets once fault-tolerant
                quantum computers cross the million-qubit mark.
              </li>
              <li>
                Today’s quantum hardware is noisy, tiny, and short-lived — think
                10²–10³ physical qubits.
              </li>
              <li>
                Migration to post-quantum cryptography is the sensible hedge,
                well before any credible threat window.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">
              Why it matters
            </h3>
            <p className="text-indigo-900">
              Quantum processors are phenomenal for simulation and optimisation,
              but they don’t magically unlock every cryptographic lock. Knowing
              which primitives are safe — and planning upgrades early — keeps
              banking rails and Bitcoin humming.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Where the Risks Actually Sit
          </h2>
          <p className="text-lg text-gray-700">
            Apply Feynman’s plain-speak test: identify the maths, check what
            quantum algorithms do with it, and grade the timeline honestly.
          </p>

          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-4 py-3">Function</th>
                  <th className="px-4 py-3">Algorithm</th>
                  <th className="px-4 py-3">Quantum Effect</th>
                  <th className="px-4 py-3">Practical Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium">
                    Digital signatures (Bitcoin spends)
                  </td>
                  <td className="px-4 py-3">ECDSA (secp256k1)</td>
                  <td className="px-4 py-3">Shor solves discrete log</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
                    High once large QCs exist
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    Banking / TLS certificates
                  </td>
                  <td className="px-4 py-3">RSA-2048</td>
                  <td className="px-4 py-3">Shor factors big integers</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
                    High in the longer term
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium">
                    Proof-of-work mining
                  </td>
                  <td className="px-4 py-3">SHA-256</td>
                  <td className="px-4 py-3">Grover = quadratic speed-up</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    Low
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    Post-quantum replacements
                  </td>
                  <td className="px-4 py-3">
                    CRYSTALS-Dilithium, Falcon, SPHINCS+
                  </td>
                  <td className="px-4 py-3">
                    Built to resist known quantum attacks
                  </td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">
                    Active adoption
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <figure className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <img
              src={quantumSecurityInfographic}
              alt="Infographic mapping quantum computing progress against Bitcoin and banking security thresholds."
              className="w-full"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="px-4 py-3 text-sm text-gray-500">
              Signatures and RSA need long-term upgrades; hashing and
              post-quantum candidates remain resilient.
            </figcaption>
          </figure>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-800">
            Why Nothing Breaks Today
          </h2>
          <p className="text-lg text-gray-700">
            Quantum buzz often ignores the brutal engineering slog ahead. The
            hardware on lab benches is still in the NISQ era — noisy
            intermediate-scale quantum devices that can’t sustain long programs
            with error correction.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gray-400"></span>
              <div>
                <strong>Hardware reality.</strong> Most rigs sport at best a few
                hundred physical qubits that decohere quickly, making long
                computations infeasible.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gray-400"></span>
              <div>
                <strong>Scale required.</strong> Cracking RSA/ECDSA at internet
                scale demands millions of logical qubits with hours of reliable
                operation — hardware nobody has.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gray-400"></span>
              <div>
                <strong>Hash strength.</strong> Even with Grover, SHA-256 only
                loses the square root of its security margin. Going from 2²⁵⁶ to
                roughly 2¹²⁸ guesses is still astronomical.
              </div>
            </li>
          </ul>
          <div className="grid gap-6 md:grid-cols-2">
            <figure className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              <img
                src={qubitEvolutionIllustration}
                alt="Log-scale journey from today’s qubit counts to the thresholds that could endanger RSA and Bitcoin."
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="px-4 py-3 text-sm text-gray-500">
                Plotting qubit growth on a log scale shows how far current rigs
                are from fault-tolerant cryptographic attacks.
              </figcaption>
            </figure>
            <figure className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              <img
                src={qubitCapabilityInfographic}
                alt="Bar chart illustrating qubit count milestones versus real-world capabilities from 2025 to 2045."
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="px-4 py-3 text-sm text-gray-500">
                Even milestone chips remain proofs of concept; crypto-breaking
                qubit counts are still a theoretical ambition.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-800">
            Where Quantum Will Shine
          </h2>
          <p className="text-lg text-gray-700">
            Feynman suggested using quantum to mirror nature and untangle
            complex optimisation. That vision is playing out in early pilots
            today.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <h3 className="font-semibold text-purple-900 mb-2">
                Chemistry & Materials
              </h3>
              <p className="text-purple-900 text-sm">
                Simulating molecules, batteries, catalysts, and superconductors
                with far more fidelity than classical HPC.
              </p>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h3 className="font-semibold text-orange-900 mb-2">
                Optimisation
              </h3>
              <p className="text-orange-900 text-sm">
                Tackling logistics, supply chains, and complex scheduling with
                hybrid quantum heuristics.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Finance & ML</h3>
              <p className="text-blue-900 text-sm">
                Exploring quantum kernels, sampling, and portfolio construction
                where exponential state spaces show up naturally.
              </p>
            </div>
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
              <h3 className="font-semibold text-teal-900 mb-2">
                Climate & Energy
              </h3>
              <p className="text-teal-900 text-sm">
                Modelling carbon capture materials and power grid optimisation
                for a decarbonised future.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bottom Line</h2>
          <p className="text-lg text-gray-700">
            Banking apps and Bitcoin nodes are secure today. The quantum leap in
            the coming decade is more about scientific discovery than smashing
            wallets. Standards bodies are already rolling in post-quantum
            cryptography, so when hardware finally scales, we simply upgrade the
            maths and keep shipping blocks.
          </p>
        </section>

        <figure className="mt-10 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white max-w-2xl mx-auto">
          <img
            src={ladderIllustration}
            alt="Ladder showing qubit milestones vs cryptographic risk thresholds."
            className="w-full h-auto"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="px-4 py-3 text-sm text-gray-500">
            Ladder view: current quantum devices remain proof-of-concept;
            crypto-breaking scales are far away.
          </figcaption>
        </figure>
      </div>
    </MotionDiv>
  );
};

export default QuantumComputingVsSecurity;
