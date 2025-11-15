import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const heroImage = "/media/generated/openai-cop30-tn-tracker.png";
const waterMemeImage = "/media/generated/openai-water-shortage-meme.png";

const tags = [
  "Tamil Nadu",
  "Climate Tracker",
  "COP30",
  "Data Centres",
  "Policy",
];

const publishedDate = "November 15, 2025";

const dataCentreRace = [
  {
    state: "Telangana",
    headline: "AWS Hyderabad AI Region",
    detail:
      "Fresh ₹60,000 crore plan (on top of the earlier $1 billion) announced at Davos to expand hyperscale capacity and AI-ready campuses around Hyderabad.",
    impact:
      "Pushes Hyderabad toward the largest cloud region footprint in South Asia and locks dedicated corridors for AI training loads.",
  },
  {
    state: "Tamil Nadu",
    headline: "Equinix CN1 + Sify Siruseri",
    detail:
      "Equinix brought a $69 million first phase (800 racks now, 4,250 on build‑out) online, while Sify’s Siruseri park is scaling toward 130 MW with liquid-cooled AI halls.",
    impact:
      "Keeps Chennai in the 200 MW-plus league and leverages subsea cable landings for low-latency AI training clusters.",
  },
  {
    state: "Maharashtra",
    headline: "Blackstone–Panchshil Navi Mumbai",
    detail:
      "₹20,000 crore commitment for a 500 MW, 14-building hyperscale campus that will run on up to 65 % renewable energy.",
    impact:
      "Signals a pivot from traditional colocation hubs toward multi-gigawatt estates tuned to AI inference workloads.",
  },
  {
    state: "West Bengal",
    headline: "CtrlS Bengal Silicon Valley",
    detail:
      "First Rated‑4 data centre in Kolkata, part of a ₹2,200 crore plan to push beyond 60 MW in four phases for eastern India workloads.",
    impact:
      "Gives government and BFSI workloads a disaster-recovery option that is not tied to the west coast.",
  },
  {
    state: "Andhra Pradesh",
    headline: "Reliance 1 GW AI Park (Announced)",
    detail:
      "State leadership confirmed Reliance will anchor a gigawatt-scale AI data centre ecosystem with integrated renewables and green hydrogen.",
    impact:
      "If executed, it will dwarf current builds and set expectations for firm clean power contracting.",
  },
];

const dpdpHighlights = [
  {
    title: "Scope & reach",
    detail:
      "Applies to any digital personal data collected in India (or digitised later) plus offshore processing meant to offer goods or services here.",
  },
  {
    title: "Consent plus legitimate use",
    detail:
      "Explicit consent is the default. Limited exemptions cover state services, emergencies, and voluntary data provided by the user.",
  },
  {
    title: "Fiduciary duties",
    detail:
      "Keep data accurate, secure, and delete it once the stated purpose ends. Significant data fiduciaries will face audits and risk impact assessments.",
  },
  {
    title: "Individual rights",
    detail:
      "Right to obtain a data summary, demand correction or erasure, nominate a representative, and escalate grievances to the Data Protection Board.",
  },
  {
    title: "Mind the carve-outs",
    detail:
      "Central government can exempt agencies on broad grounds (security, public order). The law is silent on data portability and right to be forgotten, so vigilance moves to citizens and courts.",
  },
];

const memePrompt =
  "Generate an illustration of a Tamil Nadu climate analyst in front of the official Climate Tracker dashboard, balancing a Belém suitcase in one hand and a water-flow meter in the other. Neon greens + Amazon sky hues, optimistic reportage vibe.";

export default function BlogPost() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden shadow-lg">
        <img
          src={heroImage}
          alt="AI-generated collage of Tamil Nadu’s climate dashboard, Belém skyline, and solar farms"
          className="w-full h-72 object-cover"
          loading="lazy"
        />
        <p className="text-xs text-right pr-4 py-2 text-gray-500">
          Image generated with OpenAI Images API (prompt: “Tamil Nadu climate
          tracker meets COP30 prep”)
        </p>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          Weekend Field Notes: Tamil Nadu’s Tracker, Belém Logistics, Data Hubs & DPDP Reality
        </h1>
        <p className="text-gray-500">
          by Kumar A | {publishedDate} |{" "}
          <a
            href="https://kumar2net.com"
            className="text-blue-600 hover:underline"
          >
            kumar2net.com
          </a>
        </p>
      </header>

      <section className="space-y-4">
        <p>
          This week’s hit list came straight from{" "}
          <a
            href="https://tnclimatetracker.tn.gov.in/"
            className="text-blue-600 hover:underline"
          >
            tnclimatetracker.tn.gov.in
          </a>{" "}
          and your DM prompts: check whether our flagship dashboard is more than
          a launch-day ribbon, keep tabs on COP30 housing rumors, celebrate a
          budding dentist’s field camp, compare state-level data-centre grabs,
          stress-test AI water use, and revisit India’s Digital Personal Data
          Protection rules. Settle in for a five-minute read.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          1. Tamil Nadu’s tracker is finally must-see television
        </h2>
        <p>
          The “GHG Emissions” header now flashes the 2019 tally of{" "}
          <strong>184 MtCO₂e</strong>, along with a per-capita number of{" "}
          <strong>2.43 tCO₂e</strong> and an average annual growth rate of{" "}
          <strong>4.52 %</strong> from 2005–19. One glance at the sectoral pie
          makes clear why the energy mission still drives every conversation.
          Scroll down and you hit the proud declaration: “Home to the largest
          number of Ramsar sites in India – 20 and counting,” each plotted across
          100 priority wetlands.
        </p>
        <p>
          For anyone who needs the refresher: a Ramsar site is a wetland that
          earns international importance status under{" "}
          <span className="italic">The Convention on Wetlands</span>, an
          intergovernmental treaty UNESCO steered in 1971 (enforced in 1975).
          Designation comes with obligations—protect rare or unique wetlands,
          sustain biodiversity, and prioritise waterfowl habitat. Tamil Nadu
          leading the national count matters because those sites are now
          explicitly tied to tracker data, missions, and budgets.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          2. “But will they keep it updated?” — three practical guardrails
        </h2>
        <p>
          Skeptics keep asking whether the tracker will turn stale. My checklist
          for keeping it honest:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Publish the raw feeds.</strong> Every indicator—from Ramsar
            health to rooftop approvals—should ship with CSV and API access so
            colleges and MSMEs can run their own audits.
          </li>
          <li>
            <strong>Tie KPIs to tracker IDs.</strong> The portal already assigns
            project IDs. Let every mission dashboard show a green/yellow/red
            state against quarterly targets, and keep a log of manual edits.
          </li>
          <li>
            <strong>Embed citizen eyes.</strong> A “Report an anomaly” button,
            backed by district climate cells, ensures lake encroachment photos or
            rainfall disputes flow straight into the dataset.
          </li>
        </ul>
        <p>
          Dashboards earn trust when people see churn, not just a glossy
          screenshot from March 2024.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          3. Field note: the budding dentist on camp duty
        </h2>
        <p>
          Our favourite dentist-in-training spent the week with Ragas Dental
          College’s mobile teams, splitting time between the Tamil Nadu
          government camp in Puducherry and the{" "}
          <span className="italic">Nagarpura Aaramba Sugadara Nilaiyam</span>{" "}
          (<span className="italic">நகர்ப்புற ஆரம்ப சுகாதார நிலையம்</span>) in
          Thiruvanmiyur. Watching her patch up patients alongside public health
          nurses is the reminder I needed: climate dashboards matter only when
          they feed frontline missions, whether that is a wetlands brigade or a
          health outreach crew.
        </p>
        <p>Click the Album menu for the images.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          4. Belém rumours vs. the planning reality
        </h2>
        <p>
          The viral line about activists renting cat shelters for $100 a night
          during COP30 still hasn’t surfaced in a reputable outlet. What we do
          know: UN memos and Reuters dispatches note that 45,000 delegates are
          vying for roughly 18,000 conventional beds in Belém, forcing Brazil to
          convert cruise ships, churches, and love motels into temporary lodging.
          Latvia’s climate minister has already floated dialing in remotely after
          seeing quotes hitting $500 per person per night.
        </p>
        <p>
          Lesson for Tamil Nadu (and every other delegation): pre‑book dorms,
          hostels, and even cultural centres now. The same scarcity will bite us
          when we host adaptation summits in Chennai unless we build a verified
          inventory of civic venues ahead of time.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          5. India’s data-centre race is officially a spreadsheet sport
        </h2>
        <p>
          Here’s the shortlist of announcements everyone in policy WhatsApp
          groups is benchmarking:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold text-gray-600">State</th>
                <th className="p-3 font-semibold text-gray-600">Project</th>
                <th className="p-3 font-semibold text-gray-600">Highlights</th>
                <th className="p-3 font-semibold text-gray-600">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {dataCentreRace.map((item) => (
                <tr key={item.state} className="border-t border-gray-100">
                  <td className="p-3">{item.state}</td>
                  <td className="p-3 font-medium">{item.headline}</td>
                  <td className="p-3 text-gray-600">{item.detail}</td>
                  <td className="p-3 text-gray-600">{item.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The pattern is obvious: capital is flowing to whichever state can
          guarantee land, clean power, and streamlined permits. Tamil Nadu’s edge
          lies in matching investment headlines with the renewable-storage stack
          already mapped inside the tracker.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          6. The water math behind AI infrastructure
        </h2>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={waterMemeImage}
            alt="Meme illustration of residents waiting with plastic pots while an AI data centre siphons water"
            className="w-full h-72 object-cover"
            loading="lazy"
          />
          <p className="text-xs text-right pr-4 py-2 text-gray-500">
            Light-hearted OpenAI image imagining “water for AI first?” queues in
            Tamil Nadu.
          </p>
        </div>
        <p>
          Analytics India Magazine recently pegged Bengaluru’s daily water
          deficit at <strong>500 million litres</strong>, while its 16 operational
          data centres (205.64 MW IT load) already consume{" "}
          <strong>1.4 crore litres</strong> per day—roughly what 41,900 households
          need. Cooling alone averages about <strong>26 million litres per MW</strong>{" "}
          each year once you factor in evaporation and make-up water.
        </p>
        <p>
          Transpose those numbers to Chennai or Hyderabad—both on track to double
          capacity within 24 months—and we’re staring at a summer flashpoint
          unless greywater contracts, STP upgrades, and seasonal caps are built
          into every permit.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          7. Enforcing the greywater promise
        </h2>
        <p>
          Every glossy MoU now mentions “treated wastewater for cooling,” but
          compliance rarely survives beyond the press release. Three ideas worth
          pushing:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Live transparency.</strong> Mandate public dashboards that
            show monthly make-up water draw, split by fresh vs. recycled sources,
            tied to pollution control consents.
          </li>
          <li>
            <strong>Link incentives to reuse.</strong> Industrial tariff rebates
            or open-access approvals should hinge on verifiable greywater usage,
            not just installed plumbing.
          </li>
          <li>
            <strong>Create citizen juries.</strong> Farmers, RWAs, STP operators,
            and ward councillors should have a fast lane to flag tanker anomalies
            for surprise inspections.
          </li>
        </ol>
        <p>
          The tracker already tracks wetlands; it can easily host a “water for AI”
          accountability tile if departments agree to stream the data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          8. DPDP Act: the rights, the duties, the caveats
        </h2>
        <p>
          The Digital Personal Data Protection Act has cleared Parliament; rules
          and the Data Protection Board notification will arrive in early 2025.
          Here are the talking points I’m carrying:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {dpdpHighlights.map((item) => (
            <Card key={item.title}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p>
          Translation: we finally get a rights-and-duties framework for personal
          data, but the broad exemptions handed to the Centre mean citizens—and
          state governments—must stay vigilant.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          9. Packing list before the Belém flight
        </h2>
        <p>
          My mental checklist for Tamil Nadu’s COP30 delegation:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Tracker-backed briefs on wetlands, Ramsar management, and coastal
            drainage ready for the Loss & Damage pitch.
          </li>
          <li>
            A concise note on our data-centre policy: investment numbers,
            renewable commitments, and water-reuse enforcement.
          </li>
          <li>
            Stories from camps and field missions (like the dentist) to remind
            negotiators that adaptation is already underway at home.
          </li>
        </ul>
      </section>

      <p className="text-sm text-gray-700">
        <strong>PS:</strong> The Hindu’s “Faith” column on Vishnu Sahasranama,
        which I make it a point to read daily, reminds us that nama (the divine
        name) outweighs even the Nami (bearer). Hanuman crossed the ocean by
        chanting Rama Nama while Lord Rama had to build a bridge—proof that
        repeating the Sahasranama is the gentlest guide to righteousness, like a
        mother leading her child. The clipping is in the Interesting Images
        album for your reading.
      </p>

    </div>
  );
}
