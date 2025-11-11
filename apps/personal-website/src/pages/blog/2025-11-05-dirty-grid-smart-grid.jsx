import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const tags = [
  "Energy Transition",
  "India",
  "Grid Modernisation",
  "Storage",
  "Small Modular Reactors",
  "AI Infrastructure",
];

const gridPainPoints = [
  {
    label: "Coal Reliance",
    value: "73%",
    description: "Share of generation met by coal during evening peaks.",
  },
  {
    label: "AT&C Losses",
    value: "16.1%",
    description:
      "Fiscal Year 2024 aggregate technical and commercial (AT&C) losses across power distribution companies (DISCOMs).",
  },
  {
    label: "Curtailment",
    value: "≈2%",
    description:
      "Renewable energy stranded each year due to congestion and no storage.",
  },
];

const aiDemandSignals = [
  {
    title: "International Energy Agency (IEA) projection",
    stat: "8% of global electricity",
    detail:
      "Artificial intelligence (AI), data centres, and crypto could consume this share by 2030.",
  },
  {
    title: "India’s growth arc",
    stat: "7–9% demand compound annual growth rate (CAGR)",
    detail:
      "AI + 5G + cloud hyperscalers push consumption beyond historic trends.",
  },
  {
    title: "Peak stress",
    stat: "Evening spikes intensify",
    detail:
      "Without firm clean capacity, coal ramps harder to chase peak demand.",
  },
];

const storageOptions = [
  {
    name: "Battery Energy Storage System (BESS)",
    cost: "₹10.18 / kWh (2024 tender), pack cost US$55–80 / kWh",
    impact:
      "Shifts solar from noon to evening, trims curtailment, cushions feeders.",
    badge: "bg-amber-100 text-amber-800",
  },
  {
    name: "Pumped Hydro Energy Storage (PHES)",
    cost: "₹5–6 / kWh, site specific",
    impact: "Best for long-duration shifting where topography allows.",
    badge: "bg-sky-100 text-sky-800",
  },
];

const gefGains = [
  {
    scenario: "Moderate — Pilot BESS + basic time-of-day (ToD) tariffs",
    uplift: "+2 pp",
    gef: "84%",
  },
  {
    scenario: "Aggressive — BESS + ToD + demand response",
    uplift: "+4–5 pp",
    gef: "86–87%",
  },
  {
    scenario: "SMR replacements for ageing coal",
    uplift: "+2 pp",
    gef: "84%",
  },
  {
    scenario: "Storage + small modular reactors (SMRs) + digital grid stack",
    uplift: "+4–6 pp",
    gef: "86–88%",
  },
];

const smrBenefits = [
  {
    title: "Factory-built reliability",
    text: "Modular reactors under 300 MWₑ deliver 90% capacity factors with standardised QA.",
  },
  {
    title: "Coal-to-nuclear retrofits",
    text: "Reusing coal plant sites preserves transmission right-of-way and skilled labour.",
  },
  {
    title: "Firm partner for renewables",
    text: "Dispatchable baseload smooths solar and wind variability without diesel peakers.",
  },
];

const actionPlaybook = [
  {
    title: "Triangulate grid efficiency",
    points: [
      "Blend AT&C data, curtailment logs, and feeder-level telemetry into a grid efficiency factor (GEF) score.",
      "Expose GEF shifts in public dashboards to secure regulatory alignment.",
    ],
  },
  {
    title: "Deploy storage where it matters",
    points: [
      "Prioritise urban feeders with >18% losses and renewable curtailment above 3%.",
      "Structure contracts that pay for availability and round-trip efficiency.",
    ],
  },
  {
    title: "Prime SMR fast lanes",
    points: [
      "Lock regulatory guidelines for small modular reactor (SMR) builds under 300 MWₑ.",
      "Map coal retirements to candidate SMR sites with existing evacuation corridors.",
    ],
  },
  {
    title: "Digitise the distribution edge",
    points: [
      "Roll out advanced metering infrastructure (AMI), artificial intelligence (AI) load forecasting, and automated reclosers at feeder level.",
      "Use AI agents to reconcile bills, theft, and outage events inside 24 hours.",
    ],
  },
];

const references = [
  {
    label: "CEA Load Dispatch data 2024",
    href: "https://cea.nic.in/category/lppi/ld/",
  },
  {
    label: "IEA — Electricity 2024 report",
    href: "https://www.iea.org/reports/electricity-2024",
  },
  {
    label: "NTPC tender for standalone BESS — SECI",
    href: "https://www.seci.co.in/",
  },
  {
    label: "US DOE — Advanced SMR cost curves",
    href: "https://www.energy.gov/ne/advanced-small-modular-reactors-smrs",
  },
  {
    label: "IEA — Data centres & AI tracking",
    href: "https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks",
  },
];

function BarComparison() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Grid Efficiency Factor Snapshot (2024)
      </h3>
      <p className="mt-2 text-sm text-slate-600">
        Higher GEF means more generated electricity reaches end users.
      </p>
      <div className="mt-6 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
            <span>India</span>
            <span>82%</span>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-100">
            <div
              className="h-4 rounded-full bg-rose-500"
              style={{ width: "82%" }}
            />
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
            <span>USA</span>
            <span>95%</span>
          </div>
          <div className="h-4 w-full rounded-full bg-slate-100">
            <div
              className="h-4 rounded-full bg-emerald-500"
              style={{ width: "95%" }}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Source: IEA, EIA, and India’s AT&C + curtailment estimates for FY
        2023–24.
      </p>
    </div>
  );
}

export default function DirtyGridSmartGrid() {
  const MotionArticle = motion.article;
  const navigate = useNavigate();
  const publishedDate = new Date("2025-11-04T00:00:00Z");
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
        <button
          type="button"
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 transition hover:border-slate-300 dark:hover:border-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{formattedDate}</span>
          <span aria-hidden="true">•</span>
          <span>4 min read</span>
        </div>
      </div>

      <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 p-8 shadow-sm sm:p-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)] sm:block" />
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Smarter grid, cleaner peak
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            From Dirty Grid to Smart Grid: How Storage, SMRs &amp; AI Can Lift
            India&apos;s Efficiency
          </h1>
          <p className="text-lg text-slate-700">
            Nearly one-fifth of India’s generated electricity evaporates in
            losses or curtailment. Storage, small modular reactors, and
            AI-native grid automation can push the Grid Efficiency Factor into
            the high 80s while meeting the AI era’s power hunger without
            defaulting to coal.
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-900/5 px-3 py-1 text-sm font-medium text-slate-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        {gridPainPoints.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {item.value}
            </p>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <h2 className="text-2xl font-semibold text-emerald-900">
            AI Era: Power-Hungry by Design
          </h2>
          <p className="text-emerald-900">
            Hyperscale AI campuses are the new load centres. Left unmanaged,
            their round-the-clock workloads extend coal ramping windows and
            spike feeder stress. Planning has to align computing build-outs with
            clean, firm supply.
          </p>
          <div className="space-y-6">
            {aiDemandSignals.map((signal) => (
              <div
                key={signal.title}
                className="rounded-2xl border border-emerald-200 bg-white/70 p-5"
              >
                <p className="text-sm font-semibold text-emerald-700">
                  {signal.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-900">
                  {signal.stat}
                </p>
                <p className="mt-1 text-sm text-emerald-700">{signal.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <BarComparison />
      </section>

      <section className="mt-14 space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Storage: First Fix for the Grid
        </h2>
        <p className="text-slate-700">
          Storage shifts stranded solar into the evening peak, trims
          curtailment, and reduces thermal stress on congested corridors. Costs
          are already in a competitive range for distribution utilities if
          procured at scale.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {storageOptions.map((option) => (
            <div
              key={option.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${option.badge}`}
              >
                {option.name}
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-600">
                Levelised cost
              </p>
              <p className="text-base text-slate-900">{option.cost}</p>
              <p className="mt-4 text-sm font-semibold text-slate-600">
                System effect
              </p>
              <p className="text-base text-slate-900">{option.impact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-slate-900">
          Step-Change in Grid Efficiency Factor (GEF)
        </h2>
        <p className="mt-3 text-slate-700">
          Pairing storage with flexible tariffs and digital controls lifts
          India’s Grid Efficiency Factor well beyond the current ~82% benchmark.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Rollout Scenario</th>
                <th className="px-6 py-4 font-semibold">GEF Uplift</th>
                <th className="px-6 py-4 font-semibold">Resulting GEF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {gefGains.map((row) => (
                <tr key={row.scenario} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {row.scenario}
                  </td>
                  <td className="px-6 py-4">{row.uplift}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-700">
                    {row.gef}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-slate-200 bg-slate-900 px-8 py-10 text-slate-100">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Why Small Modular Reactors (SMRs)?
            </h2>
            <p className="mt-3 text-slate-200">
              India needs firm, clean baseload that can plug into existing
              transmission corridors. SMRs close the reliability gap created
              when coal retires, without shifting back to diesel or expensive
              gas peakers.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {smrBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm text-slate-200">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Builder&apos;s Playbook: Stack Storage, SMRs &amp; Digital Ops
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {actionPlaybook.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-emerald-200 bg-emerald-50 px-8 py-10">
        <h2 className="text-2xl font-semibold text-emerald-900">
          The Big Picture: Beating the Coal Reflex
        </h2>
        <p className="mt-4 text-emerald-900">
          Coal met India’s first industrial revolution. The second clean
          revolution demands modular nuclear, smart storage markets, and
          AI-driven grid controls. Each percentage point of GEF recovered
          prevents billions of kilowatt-hours from being wasted — keeping lights
          on, bills affordable, and climate pledges credible.
        </p>
      </section>

      <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Grid efficiency gap in one chart
        </h2>
        <p className="mt-4 text-slate-800">
          Comparable economies already deliver upwards of 94% grid efficiency.
          India’s current 82% baseline is the wedge storage, automation, and
          modular nuclear must close.
        </p>
        <figure className="mt-6 flex flex-col items-center">
          <img
            src="/media/grid-efficiency-factor.svg"
            alt="Horizontal bar chart comparing India’s grid efficiency factor at 82% versus the USA at 95%, Japan at 94%, and Denmark at 97%."
            className="w-full max-w-3xl rounded-2xl bg-slate-50 p-4 shadow-sm"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="mt-3 text-sm text-slate-600">
            Grid Efficiency Factor (GEF): India vs. global benchmarks, 2024
            estimates. Higher percentages mean more generated electricity
            reaches end users without losses.
          </figcaption>
        </figure>
      </section>

      <section className="mt-14 rounded-3xl border border-slate-900 bg-slate-900 px-8 py-10 text-slate-100">
        <h2 className="text-2xl font-semibold text-white">
          PS: Fuel stewardship and SMR materials
        </h2>
        <p className="mt-4 text-slate-200">
          Integrating small modular reactors into India’s grid also hinges on a
          credible story for fuel life-cycle management. The operating playbook
          mirrors contemporary pressurised water reactors: freshly discharged
          bundles cool in on-site spent-fuel pools for five to ten years before
          being sealed in dry casks that sit on fortified pads ready for
          centralised interim storage or future reprocessing. Design envelopes
          already anticipate Atomic Energy Regulatory Board oversight on cask
          integrity, digital safeguards, and real-time inventory telemetry to
          prevent diversion.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">
              Core materials in current SMRs
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>
                <span className="font-semibold text-white">
                  Light-water designs (NuScale, BWRX-300).
                </span>{" "}
                Use uranium dioxide pellets enriched below 4.95% in zirconium
                alloy cladding with stainless-steel pressure vessels sized for
                modular fabrication.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Sodium fast reactors (TerraPower Natrium).
                </span>{" "}
                Run high-assay low-enriched uranium (HALEU, 5–19.75%) metal fuel
                pins with ferritic-martensitic steels that tolerate high neutron
                flux and sodium coolant chemistry.
              </li>
              <li>
                <span className="font-semibold text-white">
                  High-temperature gas reactors (X-energy Xe-100).
                </span>{" "}
                Deploy tristructural-isotropic (TRISO) micro-fuel encased in
                graphite pebbles, giving inherent retention of fission products
                up to 1600&nbsp;°C.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">
              Spent fuel pathway
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>
                <span className="font-semibold text-white">Cooling:</span>{" "}
                On-site pools dissipate decay heat while water chemistry systems
                keep the assemblies subcritical.
              </li>
              <li>
                <span className="font-semibold text-white">Dry storage:</span>{" "}
                After cooling, welded canisters move to passive, air-cooled
                concrete overpacks designed for a hundred-year design life.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Reuse or recycle:
                </span>{" "}
                India’s fuel cycle strategy plans pyroprocessing and mixed-oxide
                options so high-assay low-enriched uranium (HALEU) and
                tristructural-isotropic (TRISO) residues can feed advanced
                burners, minimising ultimate geological disposal volumes.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-slate-900">
          References &amp; Further Reading
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {references.map((reference) => (
            <li key={reference.href}>
              <a
                href={reference.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
              >
                <span>↗</span>
                <span>{reference.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </MotionArticle>
  );
}
