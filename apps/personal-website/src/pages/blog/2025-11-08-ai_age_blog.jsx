import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const heroImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80";

const publishedDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function BlogPost() {
  return (
    <div
      className="max-w-3xl mx-auto p-6 space-y-8"
      data-tldr-text="This post explores the intersection of AI, energy, and society. It covers Tesla's humanoid robots, China's dominance in rare earth minerals, India's grid efficiency challenges, and Kerala's success in eradicating extreme poverty. It also touches on the health effects of caffeine and the shifting sentiments of youth in the US and India."
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge>AI</Badge>
        <Badge>Policy</Badge>
        <Badge>Climate</Badge>
        <Badge>Society</Badge>
        <Badge>Global Trends</Badge>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-md mt-4 bg-gray-100">
        <img
          src={heroImage}
          alt="AI Age Blog Banner"
          className="w-full h-64 object-cover"
          loading="lazy"
        />
      </div>

      <h1 className="text-3xl font-bold mt-6">When Machines Learn Balance and Humans Seek It</h1>
      <p className="text-gray-500">
        by Kumar A | {publishedDate} |{" "}
        <a href="https://kumar2net.com" className="text-blue-600 hover:underline">
          kumar2net.com
        </a>
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-6">The Week That Felt Like a Lifetime</h2>
        <p>
          Some weeks feel like marathons. This one felt like a relay between the future and the present — from Tesla’s humanoids to China’s magnet chokehold, from India’s energy paradox to Kerala rewriting its poverty story, and finally a BBC reminder that caffeine isn’t just about staying awake, but managing headaches smartly.
        </p>
        <p className="mt-2">Different stories, same thread: <strong>innovation, awareness, and adaptation</strong> are the new survival skills.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">🤖 Tesla Optimus v2 — The Humanoid Shift</h2>
        <ul className="list-disc ml-6">
          <li>28 degrees of freedom give it near-human grace.</li>
          <li>A bill of materials ≈ $20K hints at a sub-$10K future.</li>
          <li>Its neural-network proprioception lets it sense balance — a mechanical form of self-awareness.</li>
        </ul>
        <p className="mt-2">This isn’t science fiction anymore. It’s the blueprint of how machines will extend human capability, not just mimic it.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">🌍 China’s Rare-Earth Grip — The Quiet Power Play</h2>
        <p>
          The world doesn’t run on oil anymore — it runs on <strong>magnets</strong>. China refines over 70% of global rare-earths, controlling the core ingredients of EV motors, turbines, and robotics.
          The next industrial race isn’t for more mines — it’s for <strong>magnet-free innovation</strong>: ferrite composites, superconducting coils, and switched-reluctance drives. Whoever cracks that owns the next decade.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">⚡ The Dirty Grid Problem — Climate’s Hidden Enemy</h2>
        <p>
          India’s Grid Efficiency Factor (GEF) still hovers around 40%. Over half our electricity vanishes as losses — a silent carbon leak. Add the explosion of AI data centers, and we’re staring at an energy paradox: we want clean power, but the pipes are leaky.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>Storage</strong> — pumped hydro, lithium-iron-phosphate, sodium-ion.</li>
          <li><strong>Decentralization</strong> — rooftop solar, wind co-ops, and SMRs (Small Modular Reactors) for base-load stability.</li>
        </ul>
        <p className="mt-2">That’s why I’m building <code>kumar2net.com/convert</code> and <code>/travel</code> — tools to let users measure their carbon footprint. You can’t improve what you don’t quantify.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">🌴 Kerala’s Bold Claim — Eradicating Extreme Poverty</h2>
        <blockquote className="border-l-4 border-green-500 pl-4 italic">
          Kerala has eradicated extreme poverty, per NITI Aayog’s SDG India Index 2023-24.
        </blockquote>
        <p className="mt-2">
          With less than 0.5% of its population living in deprivation (per the Multidimensional Poverty Index), Kerala topped Goal 1 – No Poverty.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Universal literacy → digital literacy → employability.</li>
          <li>Kudumbashree networks powered local self-governance.</li>
          <li>Social protection reached the bottom rung.</li>
        </ul>
        <p className="mt-2">It’s data-driven empathy in action — governance that works because it measures and adapts.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">☕ BBC Health Insight — How Caffeine Can Help With Headaches</h2>
        <p>
          According to a <a href="https://www.bbc.com/news/articles/cgr44j201rzo" className="text-blue-600 hover:underline">BBC Health report</a>, caffeine is both a <strong>medicine and a menace</strong>:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>Relief:</strong> Caffeine causes vasoconstriction, narrowing brain vessels and easing headache pressure.</li>
          <li><strong>Boost:</strong> Paired with painkillers like aspirin or ibuprofen, it can make relief ≈ 40% more effective.</li>
          <li><strong>Catch:</strong> Overuse breeds dependency and withdrawal headaches; for migraine-prone people, it can trigger attacks.</li>
          <li><strong>Smart use:</strong> Stay consistent, don’t quit suddenly, hydrate, and keep doses moderate (~100–150 mg).</li>
        </ul>
        <p className="mt-2">The takeaway: know your dose, know your triggers. Caffeine can heal or hurt — just like technology itself.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">🌐 Youth On The Move — America vs India</h2>
        <p>
          A fresh survey by the American Psychological Association (via <a href="https://studyfinds.org/young-americans-want-out-of-usa/" className="text-blue-600 hover:underline">StudyFinds</a>, Nov 6 2025) reveals a deep undercurrent of disillusionment among young Americans:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>63% of young adults (18–34) and 53% of parents have considered leaving the U.S. because of “the state of the nation.”</li>
          <li>75% are more stressed about the country’s future than before.</li>
          <li>Half of adults report loneliness; 69% needed more emotional support than they received.</li>
          <li>AI anxiety has nearly doubled among students (78%, up from 45%).</li>
        </ul>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Country</th>
                <th className="border px-3 py-2">Segment</th>
                <th className="border px-3 py-2">% Considering Leaving</th>
                <th className="border px-3 py-2">Source</th>
                <th className="border px-3 py-2">Context</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">United States</td>
                <td className="border px-3 py-2">Ages 18–34</td>
                <td className="border px-3 py-2">63%</td>
                <td className="border px-3 py-2">APA / StudyFinds (2025)</td>
                <td className="border px-3 py-2">Stress, loneliness, political division</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">India</td>
                <td className="border px-3 py-2">Ages 18–49</td>
                <td className="border px-3 py-2">45%</td>
                <td className="border px-3 py-2">Varthana (2020)</td>
                <td className="border px-3 py-2">Work or education abroad</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">India</td>
                <td className="border px-3 py-2">Professionals</td>
                <td className="border px-3 py-2">54%</td>
                <td className="border px-3 py-2">BCG (2023)</td>
                <td className="border px-3 py-2">Willingness to work abroad</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">India</td>
                <td className="border px-3 py-2">Ultra-rich</td>
                <td className="border px-3 py-2">22%</td>
                <td className="border px-3 py-2">Henley Wealth Report (2025)</td>
                <td className="border px-3 py-2">Permanent relocation intent</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">The contrast is stark: young Americans feel trapped by division, while young Indians are motivated by mobility and opportunity. One side seeks escape from stress; the other seeks exposure to growth. Different reasons, same restlessness.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6">🧭 The Bigger Picture</h2>
        <p>
          This week tied it all together: robots learning balance, grids learning efficiency, a state proving poverty isn’t inevitable, and a global youth deciding where they belong in an age of uncertainty.
        </p>
        <p className="mt-2">
          Progress today isn’t just about invention — it’s about <strong>intentional living</strong>: understanding the systems that shape us, from AI and energy to migration and mental health.
        </p>
      </section>

      <Card className="mt-8">
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold">⚡ TL;DR</h3>
          <ul className="list-disc ml-6">
            <li>Tesla’s humanoids are crossing into affordability.</li>
            <li>China’s rare-earth dominance defines the next industrial race.</li>
            <li>India’s grid reform is the real climate frontier.</li>
            <li>Kerala shows poverty eradication is possible with data.</li>
            <li>BBC links caffeine and headache science to everyday well-being.</li>
            <li>Nearly two-thirds of young Americans want out — while Indians still chase the world for opportunity.</li>
            <li>Awareness, not acceleration, is the new superpower.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
