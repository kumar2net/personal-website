import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const heroImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

const publishedDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function BlogPost() {
  return (
    <div
      className="max-w-3xl mx-auto p-6 space-y-8"
      data-tldr-text="This week's ruminations cover the practical use of AI and data tools by friends and family, an explainer on rare earth minerals and their role in clean energy, and key health insights from Happiest Health. It also includes updates on the unit converter tool and a curated music playlist."
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge>AI</Badge>
        <Badge>Health</Badge>
        <Badge>Rare Earths</Badge>
        <Badge>Culture</Badge>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-md mt-4 bg-gray-100">
        <img
          src={heroImage}
          alt="Notebook, coffee and skyline photo representing weekly reflections"
          className="w-full h-64 object-cover"
          loading="lazy"
        />
      </div>

      <h1 className="text-3xl font-bold mt-6">My Ruminations: Magnets, Microbes, and Mindful Living</h1>
      <p className="text-gray-500">
        by Kumar A | {publishedDate} |{" "}
        <a href="https://kumar2net.com" className="text-blue-600 hover:underline">
          kumar2net.com
        </a>
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-6">No Melon Billionaire Talk, Please</h2>
        <p>
          The headlines want us to obsess over trillion-dollar pay packages, but I am far more interested in
          conversations that happen around our dining table. This week&apos;s joy came from hearing how friends and
          family bend technology to their will: a microbiology expert now runs AI-powered test automation pipelines, and uses
          R language for clinical trials, and an environmental sciences post-grad paints MATLAB-born charts that could hang in a
          gallery. That is the real innovation economy — curiosity plus scrappy tooling.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">Rare Earths, Explained Without the Hype</h2>
        <p>
          Everyone is suddenly talking about rare earth minerals, so I dug in. When people say “rare earths” they
          usually mean the 17 lanthanides, with yttrium and scandium often riding shotgun. Their magic lies in magnetic,
          luminescent, and electrochemical superpowers — the invisible glue holding much of modern hardware together.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">Light Rare Earth Elements</h3>
              <p className="text-sm text-gray-600 mt-1">
                Lanthanum, cerium, praseodymium, neodymium — the crew we lean on for catalysts and magnets.
              </p>
              <ul className="list-disc ml-5 mt-3 text-sm">
                <li>Nd/Pr enable high-torque permanent magnets.</li>
                <li>Essential for EV motors, headphones, robotics.</li>
                <li>Their supply crunch defines battery and motor pricing.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">Heavy Rare Earth Elements</h3>
              <p className="text-sm text-gray-600 mt-1">
                Dysprosium, terbium, lutetium, yttrium and friends that keep magnets honest at high temperatures.
              </p>
              <ul className="list-disc ml-5 mt-3 text-sm">
                <li>Protect EV motors from heat fade.</li>
                <li>Critical for aerospace, defence, offshore wind turbines.</li>
                <li>Often refined in China, creating geopolitical leverage.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <p className="mt-4">
          Rare earths rarely travel alone. Lithium, cobalt, nickel, graphite and silicon are fellow travellers in every
          conversation about batteries, clean grids, or high-density electronics. One offshore wind turbine can quietly
          swallow four tons of rare-earth-laced magnets. Behind every delightful gadget or AI data centre sits an
          unsung materials engineer juggling these supply chains.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">Building the <code>/convert</code> Utility</h2>
        <p>
          I sneaked in an update to <code>kumar2net.com/convert</code> this week. The idea is simple: help people hop
          between metric and imperial systems without second-guessing the fine print. America may love inches, miles,
          ounces, and gallons, but even those are not monolithic. A US liquid gallon clocks in at 3.785 litres, while the
          UK imperial gallon stretches to 4.546 litres — a 20% delta that can wreck a brewing recipe or an EV battery
          logistics plan. The converter now nudges you with context so you know which regional definition you are working
          with before you hit “calculate.”
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">Where the Minerals Matter Most</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Permanent Magnets:</strong> NdFeB magnets spin EV motors, turbines, HDDs, robots and drone gimbals.
          </li>
          <li>
            <strong>High-Heat Performance:</strong> Dysprosium and terbium make sure those magnets survive desert test
            tracks and fighter-jet bays.
          </li>
          <li>
            <strong>Consumer Electronics:</strong> LEDs, displays, sensors and camera modules all borrow luminescent
            phosphors from the rare-earth palette.
          </li>
          <li>
            <strong>Defence &amp; Space:</strong> Radars, stealth composites, guided systems — the playbook depends on
            tightly specced magnetic and optical properties.
          </li>
          <li>
            <strong>Clean Energy:</strong> From battery anodes to grid-scale storage, the energy transition is a
            materials transition first.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">Happiest Health, Distilled</h2>
        <p>
          The November issue of Happiest Health reads like a wellness ops manual for young Indians who love technology
          but want balance. I pulled out the bits that felt actionable.
        </p>
        <div className="space-y-5 mt-4">
          <div>
            <h3 className="text-lg font-semibold">Ask AI, Trust Doctors</h3>
            <p>
              AI can now flag tumours, grade diabetic eye scans, and detect cancers early. Use it as a map, not a manual.
              Generative tools draft, doctors decide.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">India&apos;s Digital Health Leap</h3>
            <p>
              ABDM wants every citizen to own a portable health record. Tools like Qure.ai already spot 15–20% more TB
              cases by reading X-rays faster. Demand privacy policies before you hand over biometrics to an app.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">AI on the Mind</h3>
            <p>
              Chatbots are becoming confidants for Gen Z. Helpful, yes, but they cannot sense a stifled sob. If the bot
              knows more about your feelings than your best friend, shut the laptop and call someone.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Vaccines &amp; Immunity</h3>
            <p>
              Pediatricians warn of an “immunity gap” post-pandemic. Flu, typhoid (TCV) and HPV boosters are the
              low-hanging fruit. Prevention is still cheaper than any AI-generated cure plan.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Leg Day, Every Day</h3>
            <p>
              Squats, lunges, wall sits, calf raises, single-leg stands — five moves, ten minutes. Desk bodies need
              stability, not guilt purchased via weekend gym binges.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Protein Over Pretence</h3>
            <p>
              ICMR data says young Indians still get 62% calories from carbs, only 12% from protein. Add dal, eggs and
              ragi before you add supplements or fancy granolas.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Reset the Grimy Defaults</h3>
            <p>
              Retire that year-old gym tee. Fabric fatigue breeds dermatitis faster than ageing. Replace, rewash, renew —
              for clothes and habits alike.
            </p>
          </div>
        </div>
        <p className="mt-4">
          The editors urge us to share the issue with family. If you decode the hint — “Be H-ppy” — just press Shift+2
          and you will get the missing symbol. Drop me a WhatsApp if the clue still dodges you.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">Music and Memory Lane</h2>
        <p>
          For a sonic palette cleanser, tune into Lydian Nadhaswaram&apos;s Thirukkural collaborations with some of the
          finest vocalists — I tucked the playlist under <code>/music</code>. And if you need a visual breather, the
          latest album drop features the Golden Gate Bridge standing tall against an autumn haze. Sometimes curation is
          the best creation.
        </p>
      </section>

      <Card className="mt-8" style={{ display: 'block', background: 'white', visibility: 'visible', opacity: 1 }}>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-lg text-gray-900">🔎 TL;DR</h3>
          <ul className="list-disc ml-6 text-gray-900">
            <li>Real-life friends using AI + R + MATLAB beat billionaire gossip any day.</li>
            <li>Rare earths (LREEs + HREEs) are the silent backbone of EVs, wind, defence and electronics.</li>
            <li>
              <code>/convert</code> now flags US-vs-UK imperial nuances (think 3.785 L vs 4.546 L gallons) so mixed-unit math
              stays honest.
            </li>
            <li>Happiest Health reminds us to pair AI optimism with doctor-led judgment and disciplined routines.</li>
            <li>Protein deficits, vaccine gaps and skipped leg days need more attention than new wearables.</li>
            <li>Culture break: Thirukkural set to music and a Golden Gate photo set keep the mood grounded.</li>
          </ul>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 italic">
        PS: I bumped into the word “rumination” while flipping through The Hindu and figured sprinkling it here might
        make me sound a tad more intelligent (and cool). Mission accomplished? Also, if you are game to read the 100-page
        Happiest Health PDF, ping me on WhatsApp — I will send over the link with the password.
      </p>
    </div>
  );
}
