import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BisibeleBhathBangaloreToOslo = () => {
  const navigate = useNavigate();
  const publishedDate = new Date("2025-10-31T00:00:00Z");
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tags = [
    {
      label: "Food Economy",
      color: "F97316",
    },
    {
      label: "India Stories",
      color: "1D4ED8",
    },
    {
      label: "Consumer Brands",
      color: "059669",
    },
    {
      label: "Kumar Writes",
      color: "DC2626",
    },
  ];

  return (
    <motion.div
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

      <article className="space-y-10 prose prose-lg max-w-none">
        <header className="space-y-4 not-prose">
          <h1 className="text-4xl font-bold">
            Bisibele Bhath – Bangalore to Oslo
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center">
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
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>3 min read</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <img
                key={tag.label}
                loading="lazy"
                decoding="async"
                src={`https://img.shields.io/badge/${encodeURIComponent(tag.label)}-${tag.color}?style=for-the-badge&labelColor=1F2937&logoColor=white`}
                alt={tag.label}
              />
            ))}
          </div>
        </header>

        <section>
          <p className="text-lg leading-relaxed">
            Bisibele Bhath to the Baltic Breeze — that&rsquo;s the arc Orkla
            India has traced. From a steamy queue outside MTR Lalbagh to a
            super-stocked kitchen shelf in Oslo, this is a story about patience,
            long-term craft, and the quiet confidence of knowing you&rsquo;ve
            already won the trust of someone&rsquo;s grandmother.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            A Household Name in Your Kitchen
          </h2>
          <p className="text-lg leading-relaxed">
            I only ever managed that famous MTR Lalbagh queue once. By the time
            they slid a plate of steaming bisibele bhath my way, I&rsquo;d
            discovered a fundamental truth: my food patience tops out at five
            minutes. Odd, then, that the same moment deepened my admiration for
            people who&rsquo;ve invested generations in getting food perfect.
          </p>
          <p className="text-lg leading-relaxed">
            That tension—impatient diners, obsessive makers—is what Orkla India
            channels so well. Behind MTR Foods, Eastern Condiments, and Rasoi
            Magic lies a century of quiet dominance. The company isn&rsquo;t
            flashy. It doesn&rsquo;t hustle on your social feed. Yet its brands
            sit in cupboards from Bengaluru to Bahrain because they respect the
            emotional weight carried by a simple dabba of spice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            From Bengaluru to Norway and Back
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>
              <strong>1924</strong> — Maiya family opens Mavalli Tiffin Rooms
              (MTR) in Bengaluru. Precision cooking, zero shortcuts.
            </li>
            <li>
              <strong>1983</strong> — Eastern Condiments launches in Kerala,
              decoding every local masala nuance.
            </li>
            <li>
              <strong>1999</strong> — Rasoi Magic rolls out in Pune, promising
              restaurant-style gravies in minutes.
            </li>
            <li>
              <strong>2007</strong> — The Maiyas sell MTR&rsquo;s packaged foods
              arm to Norway&rsquo;s Orkla ASA for about US $80 million.
            </li>
            <li>
              <strong>2021–2023</strong> — Orkla merges MTR and Eastern to form
              Orkla India—a single platform ready for an IPO.
            </li>
          </ul>
          <p className="text-lg leading-relaxed mt-6">
            From a 1920s tiffin joint to a 21st-century FMCG engine, it&rsquo;s
            a case study in protecting heritage while partnering for scale.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            The Product Matrix
          </h2>
          <p className="text-lg leading-relaxed">
            What sits under Orkla India&rsquo;s hood looks less like a catalogue
            and more like a ritual system:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>
              <strong>Spices &amp; Masalas:</strong> Everyday staples—sambar,
              rasam, fish curry, biryani mixes—and single-origin powders that
              taste like someone hand-pounded them.
            </li>
            <li>
              <strong>Ready-to-Eat Meals:</strong> Paneer Butter Masala, Dal
              Makhani, Bisibele Bath. Heat, eat, no compromises.
            </li>
            <li>
              <strong>2-Minute Range:</strong> Poha, upma, khichdi—the
              microwaveable mirror to my five-minute impatience threshold.
            </li>
            <li>
              <strong>Breakfast Mixes:</strong> Idli, dosa, rava idli, rava
              dosa—precision measured into a pouch.
            </li>
            <li>
              <strong>Specialty Lines:</strong> Pickles, payasam mixes,
              vermicelli, and Gulf-friendly SKUs carrying Eastern&rsquo;s spice
              DNA.
            </li>
          </ul>
          <p className="text-lg leading-relaxed mt-6">
            Each pack trims the chore without flattening flavour, reminding you
            that shortcuts aren&rsquo;t the enemy; soulless shortcuts are.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            The Four Sambars of South India
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border-b font-semibold">Region</th>
                  <th className="px-4 py-3 border-b font-semibold">
                    Signature Traits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium">Tamil Nadu</td>
                  <td className="px-4 py-3">
                    Tamarind heavy, medium spice, coconut stays out.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Karnataka / Udupi</td>
                  <td className="px-4 py-3">
                    Sweet-tangy, coconut-forward, byadagi chilli, whisper of
                    jaggery.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">
                    Kerala (Varutharacha)
                  </td>
                  <td className="px-4 py-3">
                    Roasted coconut, thick, earthy, almost smoky.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Andhra / Telangana</td>
                  <td className="px-4 py-3">
                    Thin, fierce, chilli-forward, pappu-charu attitude.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-lg leading-relaxed mt-6">
            Automation doesn&rsquo;t deliver that nuance. Listening to
            grandmothers does.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why It Matters Now
          </h2>
          <p className="text-lg leading-relaxed">
            Orkla India is gearing up to go public. It&rsquo;s doing so not as a
            scrappy challenger but as a house that&rsquo;s already a habit.
            There&rsquo;s no viral growth hack here—just decades of being
            invited into breakfasts, festival spreads, and late-night suppers.
          </p>
          <blockquote className="border-l-4 border-gray-300 pl-4 italic">
            Regional mastery beats global playbooks every single time.
          </blockquote>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Visual Snapshot
          </h2>
          <img
            src="/media/MTR_products.png"
            alt="Orkla India product collage"
            className="w-full rounded-xl shadow-lg"
          />
          <p className="text-sm text-gray-500 mt-2">
            Optimised for mobile viewing—a reminder that the kitchen has gone
            omnichannel.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Takeaway
          </h2>
          <p className="text-lg leading-relaxed">
            The queue at MTR Lalbagh trained me in patience; the two-minute poha
            from the same lineage respects my impatience. Between those two
            points lives Orkla India—a brand family that proves fast can still
            be heritage, and convenience can honour craft.
          </p>
          <p className="text-lg leading-relaxed">
            Next time you grab that red MTR pack, remember: you&rsquo;re not
            buying fast food. You&rsquo;re buying fast tradition, bottled
            nostalgia, and a hundred years of somebody else&rsquo;s patience.
          </p>
        </section>
      </article>
    </motion.div>
  );
};

export default BisibeleBhathBangaloreToOslo;
