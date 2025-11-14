import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ItIsAlreadyNovember = () => {
  const navigate = useNavigate();
  const publishedDate = new Date("2025-11-01T00:00:00Z");
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tags = [
    { label: "Climate Policy", color: "0EA5E9" },
    { label: "Aviation", color: "F97316" },
    { label: "India Stories", color: "1D4ED8" },
    { label: "Personal Log", color: "DC2626" },
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
          <h1 className="text-4xl font-bold">It Is Already November</h1>
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
              <span>4 min read</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <img
                key={tag.label}
                loading="lazy"
                decoding="async"
                src={`https://img.shields.io/badge/${encodeURIComponent(
                  tag.label,
                )}-${tag.color}?style=for-the-badge&labelColor=1F2937&logoColor=white`}
                alt={tag.label}
              />
            ))}
          </div>
        </header>

        <section>
          <p className="text-lg leading-relaxed">
            The first day of November arrived with{" "}
            <a
              href="https://www.thehindu.com/opinion/editorial/chinese-check-on-the-detente-in-the-us-china-trade-war/article70226269.ece"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              an editorial in The Hindu - Chinese check on the detente in the
              US-China trade war
            </a>{" "}
            that felt like a quiet alarm. It nudged me to look up from the
            day-to-day scroll and examine the policies steering our present,
            especially the ones that sound perfectly aspirational until you
            follow the trail of consequences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            The Policy Paradox in the Skies
          </h2>
          <p className="text-lg leading-relaxed">
            UDAN&mdash;Ude Desh ka Aam Nagrik&mdash;is a genuine people&apos;s
            story. Affordable regional flights have opened the skies to
            passengers who once saw air travel as an indulgence reserved for
            someone else. Yet the very policy that democratises mobility also
            fuels an uncomfortable climate ledger.
          </p>
          <p className="text-lg leading-relaxed">
            Short-haul hops are the least carbon-efficient journeys we can take,
            and UDAN is almost entirely short-haul by design. The achievements
            are staggering, but so is the footprint.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-left text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2">
                    Milestone
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Scale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    Routes brought online
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    625 across 90 airports, 15 heliports, and 2 water aerodromes
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    Flights operated
                  </td>
                  <td className="border border-gray-200 px-4 py-2">300,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    Passengers served
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    14.9 million
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    Viability Gap Funding disbursed
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    ₹4,023 crore
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-lg leading-relaxed">
            Using cBalance emission factors tuned for India, the carbon
            arithmetic is blunt.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-left text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Mode</th>
                  <th className="border border-gray-200 px-4 py-2">
                    CO2e per passenger-km
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    500 km trip (kg CO2e per passenger)
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Relative impact
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Air</td>
                  <td className="border border-gray-200 px-4 py-2">0.285 kg</td>
                  <td className="border border-gray-200 px-4 py-2">142.5</td>
                  <td className="border border-gray-200 px-4 py-2">High</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">AC bus</td>
                  <td className="border border-gray-200 px-4 py-2">0.070 kg</td>
                  <td className="border border-gray-200 px-4 py-2">35.0</td>
                  <td className="border border-gray-200 px-4 py-2">Medium</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">
                    Train (AC)
                  </td>
                  <td className="border border-gray-200 px-4 py-2">0.030 kg</td>
                  <td className="border border-gray-200 px-4 py-2">15.0</td>
                  <td className="border border-gray-200 px-4 py-2">Low</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-lg leading-relaxed">
            A conservative back-of-the-envelope calculation&mdash;eighty
            passengers per flight, 400 km average leg&mdash;puts UDAN&apos;s
            cumulative emissions near 2.7 million tonnes of CO2. That mirrors
            the yearly footprint of roughly 250,000 Indians. Set that against
            the ₹4,023 crore already disbursed in subsidies and the public purse
            is effectively spending around ₹14,700 for each tonne of CO2
            emitted.
          </p>
          <p className="text-lg leading-relaxed">
            Why does the conflict persist?
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
            <li>
              <strong>Developmental equity:</strong> Tier-2 and tier-3 cities
              deserve faster connections to growth corridors, and UDAN delivers
              that.
            </li>
            <li>
              <strong>Infrastructure gaps:</strong> Rail and bus alternatives
              are still patchy or painfully slow in many of these destinations.
            </li>
            <li>
              <strong>Policy silos:</strong> Aviation expansion and climate
              action report to different ministries, so trade-offs rarely sit on
              the same table.
            </li>
            <li>
              <strong>Behavioural incentives:</strong> Subsidised tickets nudge
              travellers toward flights even when cleaner modes exist.
            </li>
          </ul>
          <p className="text-lg leading-relaxed">
            Somewhere between those points sits the November dilemma: the policy
            is simultaneously inclusive and carbon-intensive.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Reclaiming My Digital Home
          </h2>
          <p className="text-lg leading-relaxed">
            Netlify paused my site this week; freemium realities catch up
            eventually. So I bought my own domain, redeployed everything, and
            recorded a quick screen capture to remember the moment.
          </p>
          <div className="not-prose">
            <a
              href="https://www.loom.com/share/1ac97d75d4d347bb9afb287ebd25b8a6"
              target="_blank"
              rel="noreferrer"
              className="group relative block w-full overflow-hidden rounded-xl border border-blue-500 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-blue-400/20 to-blue-500/40 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex flex-col items-center gap-3 px-6 py-6 text-center md:flex-row md:text-left">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-md md:h-16 md:w-16">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8"
                    aria-hidden="true"
                  >
                    <path d="M4.5 5.653c0-.856.917-1.4 1.667-.976l12.487 7.097a1.125 1.125 0 010 1.952L6.167 20.823c-.75.424-1.667-.12-1.667-.976V5.653z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Watch the walkthrough
                  </p>
                  <p className="text-xl font-bold text-gray-900 md:text-2xl">
                    Two-minute tour of the new domain setup
                  </p>
                  <p className="mt-2 text-base text-gray-600">
                    Loom video: how the site was rebuilt, the news sub-domain,
                    and what&apos;s next.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-blue-600 md:mt-0">
                  Play video
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </span>
              </div>
            </a>
          </div>
          <p className="text-lg leading-relaxed">
            The rebuild nudged me to polish the news sub-domain,
            <a
              href="https://kumar2net.com/news"
              className="ml-1 text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              kumar2net.com/news
            </a>
            , which now surfaces only the topics I care about and remembers the
            selection across the session. Owning the domain feels like a small
            but necessary step to keep this space resilient when platforms
            tighten quotas without warning.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Little Joys on the Site
          </h2>
          <p className="text-lg leading-relaxed">
            Wander over to <code>/album</code> for the latest photo drops and to{" "}
            <code>/music</code> to catch &quot;Cheenikallu,&quot; the track that
            has been looping through these autumn evenings. &quot;Bison&quot;
            still feels special, our local Kabaddi legend immortalised. Growing
            up in Tirunelveli, we played until our knees were raw against beach
            sand because that is how long you stay on the mat when real
            competition shows up.
          </p>
          <p className="text-lg leading-relaxed">
            November is already here, but there is still time to celebrate the
            things that keep us grounded while we wrestle with the
            contradictions above us.
          </p>
        </section>
      </article>
    </motion.div>
  );
};

export default ItIsAlreadyNovember;
