// File: src/pages/blog/2025-11-03-AIClimateBlindspot.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const tags = ["AI", "Climate", "Hyperscalers", "Sustainability"];

const statHighlights = [
  {
    value: "70 – 150 TWh",
    label: "AI electricity draw in 2025 (≈ Netherlands)",
  },
  {
    value: "31 – 67 Mt CO₂",
    label: "Annual emissions from AI workloads today",
  },
  {
    value: "40+ TWh",
    label: "Projected AI power demand from Indian hubs alone",
  },
];

const energyTable = [
  {
    project: "OpenAI + Oracle “Stargate” (U.S.)",
    capacity: "10 GW",
    energy: "≈ 87 TWh",
    co2: "≈ 39 Mt",
  },
  {
    project: "Stargate-UAE Phase 1",
    capacity: "0.2 GW",
    energy: "≈ 1.7 TWh",
    co2: "≈ 0.8 Mt",
  },
  {
    project: "OpenAI UK (AI Growth Zone)",
    capacity: "0.1 – 0.5 GW",
    energy: "0.9 – 4.4 TWh",
    co2: "0.4 – 2.0 Mt",
  },
  {
    project: "OpenAI India",
    capacity: "1 GW",
    energy: "≈ 8.8 TWh",
    co2: "≈ 3.9 Mt",
  },
  {
    project: "Reliance Jio – Jamnagar (Gujarat)",
    capacity: "3 GW",
    energy: "≈ 26 TWh",
    co2: "≈ 12 Mt",
  },
  {
    project: "Google + Adani – Visakhapatnam (Andhra Pradesh)",
    capacity: "1 GW",
    energy: "≈ 8.8 TWh",
    co2: "≈ 3.9 Mt",
  },
];

const builderActions = [
  {
    title: "Audit carbon ROI",
    description:
      "Go beyond accuracy charts. Track runtime, energy, and dollar cost per unit of user value delivered.",
  },
  {
    title: "Train on greener grids",
    description:
      "Prefer Nordic, Quebec, or on-site renewables for training runs. Time-slice workloads to match clean-energy availability.",
  },
  {
    title: "Design for reuse",
    description:
      "Cache, distill, and prune pipelines. Every unnecessary inference compounds into gigawatt-hours at scale.",
  },
  {
    title: "Publish energy telemetry",
    description:
      "If you can show loss curves in your dashboards, you can expose power draw and CO₂ intensity too.",
  },
  {
    title: "Prioritise welfare-first AI",
    description:
      "Shift capital from vanity content engines to models advancing health, agriculture, and public services.",
  },
];

const references = [
  {
    label: "OpenAI & Oracle Stargate Project – Business Insider",
    href: "https://www.businessinsider.com/openai-stargate-project-data-center-power-gigawatt-chatgpt-ai-2025-10",
  },
  {
    label: "Fortune India – Reliance’s 3 GW Jamnagar Data Centre",
    href: "https://www.fortuneindia.com/technology/reliance-reportedly-building-the-worlds-largest-data-centre-in-jamnagar/120122",
  },
  {
    label: "NDTV – Google + Adani Visakhapatnam AI Hub",
    href: "https://www.ndtv.com/india-news/andhra-google-ai-hub-adani-group-to-partner-for-indias-largest-data-centre-9451837",
  },
  {
    label: "MIT News – Generative AI’s Environmental Impact",
    href: "https://news.mit.edu/2025/explained-generative-ai-environmental-impact-0117",
  },
  {
    label:
      "Goldman Sachs – AI to Drive 165% Increase in Data-Centre Power Demand",
    href: "https://www.goldmansachs.com/insights/articles/ai-to-drive-165-increase-in-data-center-power-demand-by-2030",
  },
];

export default function AIClimateBlindspot() {
  const navigate = useNavigate();
  const publishedDate = new Date("2025-11-03T00:00:00Z");
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl px-4 py-10 text-slate-900 sm:px-6 lg:px-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:text-slate-900"
          type="button"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to posts
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-900">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18" />
          </svg>
          <span>{formattedDate}</span>
        </div>
      </div>

      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white">
        <div className="absolute -left-24 -top-16 h-56 w-56 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 hidden h-48 w-48 rounded-full bg-emerald-200/20 blur-3xl sm:block" />
        <div className="relative space-y-6 px-6 py-12 sm:px-10 lg:px-14">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50">
            Special Report
          </span>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            ⚡ AI’s Climate Blind Spot: When Progress Turns into Power Hunger
          </h1>
          <p className="max-w-2xl text-base text-emerald-100 sm:text-lg">
            Bill Gates’ climate optimism skips a key truth: hyperscaler AI is
            quietly building a fossil-age reboot, devouring gigawatts to feed
            synthetic content. This is the energy binge no regulation has caught
            up with.
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative border-t border-white/5 bg-black/20">
          <img
            src="/media/AIClimateparadox.png"
            alt="Gigawatt-scale data centre campus illustrated with power flows"
            className="h-64 w-full object-cover object-center sm:h-80 lg:h-96"
            loading="lazy"
            decoding="async"
          />
        </div>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statHighlights.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              {stat.label}
            </p>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section
        className="mt-12 space-y-6 text-slate-900"
        style={{ color: "#0f172a" }}
      >
        <p className="text-lg leading-relaxed" style={{ color: "#0f172a" }}>
          Bill Gates’ essay{" "}
          <a
            href="https://www.gatesnotes.com/three-tough-truths-about-climate"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-emerald-600 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-500"
          >
            <em>Three Tough Truths About Climate</em>
          </a>{" "}
          makes a strong case for innovation, realistic targets, and
          welfare-centric spending. Yet the biggest delta between rhetoric and
          reality sits in our server racks. Artificial intelligence is scaling
          into an energy hunger that rivals heavy industry, but its appetite is
          barely accounted for in policy, reporting, or corporate conscience.
        </p>
        <p className="text-lg leading-relaxed" style={{ color: "#0f172a" }}>
          While policy chatter orbits methane, green steel, and solar grids, AI
          hyperscalers are constructing a parallel fossil-age reboot — campuses
          of GPUs humming 24×7, fed by coal-heavy grids and water-intensive
          cooling. This is not a forecast. It is already live in Phoenix, in
          London, in Gujarat.
        </p>
      </section>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-10">
        <h2 className="text-2xl font-semibold text-slate-900">
          🌍 The Hidden Giant: Energy Behind the “Magic”
        </h2>
        <p className="mt-4 text-slate-800">
          AI workloads already draw power on the scale of nations. With
          hyperscaler campuses breaking ground across the world, the growth
          curve is set to go vertical.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-900">
            <thead className="bg-white">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="whitespace-nowrap px-4 py-3">
                  Project / Region
                </th>
                <th className="whitespace-nowrap px-4 py-3">Capacity</th>
                <th className="whitespace-nowrap px-4 py-3">
                  Est. Annual Energy
                </th>
                <th className="whitespace-nowrap px-4 py-3">
                  CO₂ Impact (global avg grid)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {energyTable.map((row) => (
                <tr
                  key={row.project}
                  className="border-b border-slate-100 last:border-none"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.project}
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    {row.capacity}
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    {row.energy}
                  </td>
                  <td className="px-4 py-3 text-slate-800">
                    {row.co2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="mt-12 space-y-6 text-slate-900"
        style={{ color: "#0f172a" }}
      >
        <h2 className="text-2xl font-semibold text-slate-900">
          ⚙️ The Hyperscaler Rush: India Joins the Gigawatt Club
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "#0f172a" }}>
          India’s emergence as an AI compute zone is no longer aspirational.
          Between Jamnagar’s 3 GW mega campus, Visakhapatnam’s coastal corridor,
          and OpenAI’s 1 GW footprint, the subcontinent will soon supply over 40
          TWh annually to data centres alone. That is ten times Chennai’s yearly
          consumption redirected into synthetic media, ad optimisation, and
          speculative “AI GDP.” Hyperscalers are not just buying land; they are
          purchasing the future direction of national grids.
        </p>
        <p className="text-lg leading-relaxed" style={{ color: "#0f172a" }}>
          This is innovation wearing the mask of inevitability. Jobs will
          emerge, yes. So will pressure on transmission infrastructure, water
          tables, and renewable targets. With no emissions guardrails, AI’s
          kilowatt binge risks erasing hard-won climate gains elsewhere.
        </p>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-3xl border border-orange-200 bg-orange-50 p-8 text-orange-950 shadow-sm"
          style={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-semibold" style={{ color: "#7c2d12" }}>
            💣 The Dirty Secret
          </h2>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: "#7c2d12" }}
          >
            Every viral meme, AI avatar, or synthetic explainer consumes
            megawatt-hours upstream. A single ChatGPT query averages 0.3 Wh, an
            image generation 10–30 Wh, and cooling towers evaporate millions of
            litres daily.
          </p>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: "#7c2d12" }}
          >
            At scale, AI’s promise of “clean innovation” becomes climate
            opportunism: carbon-heavy power dressed in sleek UI.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            ⚖️ The Moral Math
          </h2>
          <blockquote className="mt-4 border-l-4 border-emerald-500 pl-4 text-lg font-medium text-slate-800">
            Does generating another synthetic video justify burning another
            kilowatt-hour?
          </blockquote>
          <p className="mt-4 text-slate-700">
            A gigawatt-hour shifted from inference could electrify rural
            hospitals, schools, or cold chains. Yet most AI emissions hide in
            Scope 3 reports — the corporate equivalent of “don’t ask, don’t
            tell” for carbon.
          </p>
        </div>
      </section>

      <section className="mt-12 space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          🔧 The Builder’s Responsibility
        </h2>
        <p className="text-slate-800">
          Developers are not spectators here. We architect the data pipelines,
          schedule the workloads, and decide when good enough is good enough.
          These five shifts move AI from indulgence to impact:
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {builderActions.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mt-12 space-y-6 text-slate-900"
        style={{ color: "#0f172a" }}
      >
        <h2 className="text-2xl font-semibold text-slate-900">
          🔥 The Nerve That Needs Hitting
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "#0f172a" }}>
          When OpenAI’s Stargate or Jio’s AI City flip the switch, the headline
          cannot stop at “world’s largest compute cluster.” We must ask who pays
          the energy bill and who benefits from the output. AI’s carbon
          footprint is a moral exam for the builder class. Failing it will turn
          every sustainability pledge into a PR brochure printed in soot.
        </p>
        <p className="text-lg leading-relaxed" style={{ color: "#0f172a" }}>
          We are not saving the planet if we overheat it with GPUs. The next era
          of AI must prove its carbon ROI, or risk becoming the coal plant of
          the digital age.
        </p>
      </section>

      <figure className="mt-12 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <img
          src="/media/ai-climate-hyperscalers.png"
          alt="World map of AI hyperscaler build-outs across India, UK, UAE, and the United States"
          className="w-full rounded-2xl object-cover"
          loading="lazy"
          decoding="async"
        />
        <figcaption className="mt-3 text-center text-sm text-slate-500">
          Global hyperscaler capacity build-outs, 2025. Each campus represents a
          nation-scale electricity appetite.
        </figcaption>
      </figure>

      <section
        className="mt-12 space-y-6 text-slate-900"
        style={{ color: "#0f172a" }}
      >
        <h2 className="text-2xl font-semibold text-slate-900">
          🧠 TL;DR
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "#0f172a" }}>
          Generative AI is brilliant — and ravenous. Data centres powering
          today’s models already sip electricity at nation scale, emitting tens
          of millions of tonnes of CO₂ every year. As hyperscalers expand across
          India, the UK, and the UAE, the line between “AI innovation” and
          “energy colonisation” blurs. Without builder-led guardrails, AI risks
          becoming the coal plant of the digital age.
        </p>
      </section>

      <footer className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-base font-semibold uppercase tracking-wide text-slate-500">
          References & Further Reading
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          {references.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 underline transition hover:text-emerald-500"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-400">
          © 2025 Kumar A — AI Enthusiast, Builder, Thinker.
        </p>
      </footer>
    </motion.article>
  );
}
