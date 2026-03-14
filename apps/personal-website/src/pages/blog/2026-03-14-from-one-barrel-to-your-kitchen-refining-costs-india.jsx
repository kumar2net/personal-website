import { Box, Typography } from "@mui/material";

const fxRateInrPerUsd = 86.6133;

const operatingCostUsd = {
  min: 2.5,
  max: 3.0,
};

const operatingCostInr = {
  min: operatingCostUsd.min * fxRateInrPerUsd,
  max: operatingCostUsd.max * fxRateInrPerUsd,
};

const slateRows = [
  {
    fuel: "LPG",
    share: "4.5%",
    allocatedMin: operatingCostInr.min * 0.045,
    allocatedMax: operatingCostInr.max * 0.045,
    whyItMatters:
      "Small in refinery output share, enormous in household visibility because this is the fuel people actually see in their kitchen.",
  },
  {
    fuel: "Petrol (MS)",
    share: "16.8%",
    allocatedMin: operatingCostInr.min * 0.168,
    allocatedMax: operatingCostInr.max * 0.168,
    whyItMatters:
      "This is the visible transport fuel for cars and two-wheelers, but its pump price is driven far more by crude and taxes than by refining opex.",
  },
  {
    fuel: "Diesel (HSD)",
    share: "41.2%",
    allocatedMin: operatingCostInr.min * 0.412,
    allocatedMax: operatingCostInr.max * 0.412,
    whyItMatters:
      "The largest product block in the Indian refinery slate. Trucks, buses, and generators make diesel the heavyweight of the barrel.",
  },
  {
    fuel: "ATF",
    share: "6.4%",
    allocatedMin: operatingCostInr.min * 0.064,
    allocatedMax: operatingCostInr.max * 0.064,
    whyItMatters:
      "Aviation fuel matters economically, but it is not a household retail fuel, so published airline rates are the relevant comparison, not a consumer price tag.",
  },
  {
    fuel: "Everything else",
    share: "31.1%",
    allocatedMin: operatingCostInr.min * 0.311,
    allocatedMax: operatingCostInr.max * 0.311,
    whyItMatters:
      "Naphtha, petcoke, bitumen, fuel oil, and other outputs are a reminder that the refinery is a system, not a petrol-only machine.",
  },
];

const currentDelhiRows = [
  {
    fuel: "Petrol",
    price: "Rs 94.77/litre",
    verifiedDate: "PPAC homepage: February 20, 2026; IOCL price buildup effective April 1, 2025",
    note:
      "Base price plus freight to dealer was Rs 55.08/litre. The rest was excise, dealer commission, and VAT.",
  },
  {
    fuel: "Diesel",
    price: "Rs 87.67/litre",
    verifiedDate: "PPAC homepage: February 20, 2026; IOCL price buildup effective April 1, 2025",
    note:
      "Base price plus freight to dealer was Rs 56.02/litre. Again, the gap to retail is mostly tax and channel layers, not refinery opex.",
  },
  {
    fuel: "Domestic LPG",
    price: "Rs 853 for a 14.2 kg cylinder in Delhi",
    verifiedDate: "Official Indane Delhi agency pages crawled March 2026",
    note:
      "This is the number households actually feel. It is the most politically salient fuel in the table, even though LPG is only one slice of the barrel.",
  },
  {
    fuel: "ATF",
    price: "No household retail price",
    verifiedDate: "Airline posted rates change monthly",
    note:
      "I am not mixing a stale airline posting into the current March 2026 Delhi consumer table. ATF should be compared against airline posted rates, not household end-user prices.",
  },
];

const priceBuildUpRows = [
  {
    fuel: "Petrol at Delhi",
    dealerPrice: "Rs 55.08/litre",
    excise: "Rs 19.90/litre",
    dealerCommission: "Rs 4.39/litre",
    vat: "Rs 15.40/litre",
    retail: "Rs 94.77/litre",
  },
  {
    fuel: "Diesel at Delhi",
    dealerPrice: "Rs 56.02/litre",
    excise: "Rs 15.80/litre",
    dealerCommission: "Rs 3.02/litre",
    vat: "Rs 12.83/litre",
    retail: "Rs 87.67/litre",
  },
];

const keyTakeaways = [
  "Refineries do not publish a neat product-by-product processing bill. They mostly report cost at the refinery or barrel-throughput level.",
  "The best public Indian benchmark I could verify for pure refining operating cost is still about USD 2.5 to 3 per barrel. That is operating cost, not crude cost, not working capital, and not taxes.",
  "Once you compare that small refining layer with actual Delhi end-user prices, the real price drivers become obvious: crude, freight, taxes, dealer margin, and policy.",
  "LPG feels emotionally central in India because it enters the home. But in refinery output terms, diesel is still the giant block in the product slate.",
];

export const metadata = {
  slug: "2026-03-14-from-one-barrel-to-your-kitchen-refining-costs-india",
  title: "From One Barrel to Your Kitchen: What Refining Really Costs in India",
  description:
    "An India-first explainer framed by the March 2026 Iran-linked LPG supply squeeze: what part of LPG, petrol, and diesel prices comes from refining, what part does not, and why the kitchen flame sits on top of a much larger energy system.",
  excerpt:
    "An India-first explainer framed by the March 2026 Iran-linked LPG supply squeeze: what part of LPG, petrol, and diesel prices comes from refining, what part does not, and why the kitchen flame sits on top of a much larger energy system.",
  tags: [
    "Energy",
    "India",
    "LPG",
    "Petrol",
    "Diesel",
    "Refining",
    "Oil",
    "Policy",
  ],
  datePublished: "2026-03-14",
  dateModified: "2026-03-14",
  image: "/media/generated/dosa-cone-roast-chutney-sambar.svg",
  readingTime: "~6 min",
};

function formatRange(min, max, suffix = "") {
  return `Rs ${min.toFixed(1)}-${max.toFixed(1)}${suffix}`;
}

function MetricCard({ eyebrow, value, body }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "var(--mui-palette-background-paper)",
        boxShadow: 1,
        display: "grid",
        gap: 1,
      }}
    >
      <Typography variant="overline" sx={{ letterSpacing: 1.2, color: "var(--mui-palette-text-secondary)" }}>
        {eyebrow}
      </Typography>
      <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" }, fontWeight: 800, m: 0 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: "var(--mui-palette-text-secondary)", lineHeight: 1.75 }}>
        {body}
      </Typography>
    </Box>
  );
}

function SlateCard({ fuel, share, allocatedMin, allocatedMax, whyItMatters }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "var(--mui-palette-background-paper)",
        boxShadow: 1,
        display: "grid",
        gap: 1.25,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h3" sx={{ fontSize: { xs: "1.15rem", md: "1.25rem" }, fontWeight: 800, m: 0 }}>
          {fuel}
        </Typography>
        <Box
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            bgcolor: "rgba(37,99,235,0.08)",
            color: "#2563eb",
            fontWeight: 700,
            fontSize: "0.88rem",
          }}
        >
          {share} of Indian output
        </Box>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        Notional refining opex allocation from one barrel: {formatRange(allocatedMin, allocatedMax)}
      </Typography>
      <Typography variant="body2" sx={{ color: "var(--mui-palette-text-secondary)", lineHeight: 1.75 }}>
        {whyItMatters}
      </Typography>
    </Box>
  );
}

function SourceList() {
  return (
    <Box component="ul" sx={{ display: "grid", gap: 1.25, pl: 3 }}>
      <li>
        <a href="https://ppac.gov.in/download.php?file=whatsnew%2F1737624003_Final_202412_Monthly_Report_WebVersion.pdf" target="_blank" rel="noreferrer">
          PPAC monthly report for December 2024 / April-December FY 2024-25
        </a>
        {" "}
        for India&apos;s product output shares.
      </li>
      <li>
        <a href="https://www.fipi.org.in/assets/pdf/taxation/Recommendations%20on%20the%20Terms%20of%20Reference%20of%20Expert%20Group%20on%20Pricing%20of%20petroleum%20products.pdf" target="_blank" rel="noreferrer">
          FIPI / McKinsey industry note on Indian petroleum-product pricing
        </a>
        {" "}
        for the explicit Indian benchmark of roughly USD 2.5 to 3 per barrel of operating cost and another USD 2.5 to 3 per barrel of working capital.
      </li>
      <li>
        <a href="https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2238525&reg=3&lang=2" target="_blank" rel="noreferrer">
          PIB briefing on the government&apos;s March 2026 response to the West Asia conflict
        </a>
        {" "}
        for the official figures on India&apos;s LPG import dependence, Hormuz exposure, and the March 8 direction to maximise LPG production.
      </li>
      <li>
        <a href="https://iocl.com/admin/img/UploadedFiles/PriceBuildup/Files/English/988e58a65f7d41b4b88be522a2ff6709.pdf" target="_blank" rel="noreferrer">
          IOCL Delhi petrol price buildup
        </a>
        {" "}
        and
        {" "}
        <a href="https://iocl.com/admin/img/UploadedFiles/PriceBuildup/Files/English/87aa569349ff42afb3260f2b704a2fe0.pdf" target="_blank" rel="noreferrer">
          IOCL Delhi diesel price buildup
        </a>
        {" "}
        for exact pump-price layers.
      </li>
      <li>
        <a href="https://ppac.gov.in" target="_blank" rel="noreferrer">
          PPAC home page
        </a>
        {" "}
        where the Important News strip showed Delhi petrol and diesel RSPs unchanged as of February 20, 2026.
      </li>
      <li>
        <a href="https://locator.iocl.com/indane/indane-joginder-enterprises-gas-agency-naraina-vihar-new-delhi-123225/Home" target="_blank" rel="noreferrer">
          Official Indane Delhi agency page
        </a>
        {" "}
        for the current Delhi domestic LPG cylinder price I could verify.
      </li>
      <li>
        <a href="https://iocl.com/aviation-fuel" target="_blank" rel="noreferrer">
          IOCL aviation fuel page
        </a>
        {" "}
        for the structure of ATF metro postings; I exclude it from the current consumer table because the crawler-accessible update I could verify was older than March 2026.
      </li>
    </Box>
  );
}

export default function BlogPost() {
  return (
    <article
      data-tldr-text="In March 2026, the Iran-linked West Asia conflict suddenly made India’s LPG chain feel personal. Official data shows India imports about 60 percent of its LPG and roughly 90 percent of those imports normally come through Hormuz, so the government pushed refineries to raise LPG output and protect households. The deeper lesson is that refining opex is only a thin slice of fuel prices; crude, freight, taxes, and policy do the heavier lifting."
    >
      <h1>From One Barrel to Your Kitchen: What Refining Really Costs in India</h1>

      <p>
        <em>Data checked against official sources available on March 14, 2026. Delhi is the reference market for end-user price examples.</em>
      </p>

      <p>
        People often ask a deceptively simple question: from one barrel of crude oil, what is the processing cost of LPG, petrol, diesel, and the other fuels that come out of a refinery?
      </p>

      <p>
        In March 2026, that question stopped being academic. The West Asia conflict involving Iran pushed India&apos;s LPG chain into public view. According to a{" "}
        <a href="https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2238525&reg=3&lang=2" target="_blank" rel="noreferrer">
          PIB briefing
        </a>
        , India imports about <strong>60%</strong> of its LPG consumption, and roughly <strong>90%</strong> of those imports normally come through the Strait of Hormuz. On <strong>March 8, 2026</strong>, the government directed refineries and petrochemical complexes to maximise LPG production by diverting propane and butane streams into the LPG pool. The same briefing said domestic LPG production rose by about <strong>25%</strong> and that household consumers were prioritised.
      </p>

      <p>
        That nuance matters. The official line is not “India ran out of household LPG.” The official line is: the conflict created a serious enough supply squeeze that the state had to actively protect the cooking-gas chain, while commercial and non-domestic users absorbed more of the pain.
      </p>

      <Box
        sx={{
          my: 4,
          p: 3,
          borderRadius: 3,
          bgcolor: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.22)",
          display: "grid",
          gap: 1.5,
        }}
      >
        <Typography variant="h3" sx={{ fontSize: { xs: "1.15rem", md: "1.25rem" }, fontWeight: 800, m: 0 }}>
          A dosa-tawa way to think about this
        </Typography>
        <Typography variant="body1" sx={{ m: 0 }}>
          Every dosa cook knows a beautiful piece of physics. Sprinkle a few drops of water on a very hot tawa, and they do not instantly vanish. They dance. They skid. That is the <strong>Leidenfrost effect</strong>: a vapor cushion forms under the droplet and makes it glide.
        </Typography>
        <Typography variant="body1" sx={{ m: 0 }}>
          The cook is reading an invisible heat system from one tiny visible signal. India&apos;s LPG story works the same way. The cylinder in the kitchen is the visible droplet. Underneath it sits the much larger invisible system: crude imports, refinery chemistry, shipping chokepoints, taxes, dealer margins, and government intervention.
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--mui-palette-text-secondary)", m: 0 }}>
          In other words: when the flame becomes uncertain, geopolitics suddenly enters the kitchen.
        </Typography>
      </Box>

      <Box sx={{ my: 4, display: "grid", gap: 1.25 }}>
        <Box
          component="img"
          src="/media/generated/dosa-cone-roast-chutney-sambar.svg"
          alt="Cone-shaped paper roast dosa served with coconut chutney, tomato chutney, and sambar"
          loading="lazy"
          decoding="async"
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: 2,
            bgcolor: "#fff8ec",
          }}
        />
        <Typography variant="caption" sx={{ color: "var(--mui-palette-text-secondary)" }}>
          A cone roast dosa is a visible kitchen object. The post&apos;s argument is that the invisible system beneath that object is much larger: crude, refineries, shipping routes, taxes, and policy.
        </Typography>
      </Box>

      <p>
        The clean answer is this: refineries do <strong>not</strong> publish a neat bill that says “this much for LPG, this much for petrol, this much for diesel.” A refinery is a shared system. Crude goes in. A slate of products comes out. Costs are largely reported at the refinery level or the barrel-throughput level.
      </p>

      <p>
        So the right way to explain the data is not to pretend that a refinery accountant hands us a perfect product-wise cost sheet. The right way is to show three layers, separately and clearly:
      </p>

      <ol>
        <li>what public Indian sources say about <strong>refining cost per barrel</strong>,</li>
        <li>how India&apos;s refinery output is split across fuels, and</li>
        <li>what households and motorists actually pay at the end of the chain.</li>
      </ol>

      <Box sx={{ my: 4, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
        <MetricCard
          eyebrow="Pure Refining Opex"
          value={`USD ${operatingCostUsd.min}-${operatingCostUsd.max}/bbl`}
          body="This is the public Indian benchmark I could verify for operating cost only. It is not the crude cost, not taxes, and not retail margin."
        />
        <MetricCard
          eyebrow="Illustrative INR Conversion"
          value={formatRange(operatingCostInr.min, operatingCostInr.max, "/barrel")}
          body={`Converted at Rs ${fxRateInrPerUsd.toFixed(4)} per US dollar. This is a transparent assumption for intuition, not a magic official retail formula.`}
        />
        <MetricCard
          eyebrow="What Changes Consumer Price"
          value="Crude + taxes + freight"
          body="Once you move from refinery gate to end-user price, the heavy hitters are crude cost, taxes, logistics, dealer margin, and policy."
        />
      </Box>

      <h2>The cleanest public benchmark: refining cost is small, but only one layer</h2>

      <p>
        The clearest Indian benchmark I could verify in the public domain comes from a
        {" "}
        <a href="https://www.fipi.org.in/assets/pdf/taxation/Recommendations%20on%20the%20Terms%20of%20Reference%20of%20Expert%20Group%20on%20Pricing%20of%20petroleum%20products.pdf" target="_blank" rel="noreferrer">
          FIPI / McKinsey industry analysis
        </a>
        . Its key line is worth remembering:
      </p>

      <blockquote>
        <p>Indian refiners need roughly USD 2.5 to 3 per barrel to cover operating cost, plus another USD 2.5 to 3 per barrel to cover working capital.</p>
      </blockquote>

      <p>
        For this post, I am using only the <strong>operating-cost</strong> part because your question was specifically about processing cost. That gives us an illustrative refinery operating-cost layer of roughly
        {" "}
        <strong>{formatRange(operatingCostInr.min, operatingCostInr.max, " per barrel")}</strong>
        .
      </p>

      <p>
        Notice what is <strong>not</strong> inside that number: the cost of crude itself, taxes, dealer commission, retail distribution, and the financing/capital burden that sits above day-to-day plant operations.
      </p>

      <h2>India&apos;s refinery output is not evenly split. Diesel still dominates the slate.</h2>

      <p>
        The
        {" "}
        <a href="https://ppac.gov.in/download.php?file=whatsnew%2F1737624003_Final_202412_Monthly_Report_WebVersion.pdf" target="_blank" rel="noreferrer">
          PPAC monthly report
        </a>
        {" "}
        gives a useful India-specific picture of the product slate during April-December FY 2024-25. Its product-share chart shows:
      </p>

      <ul>
        <li>LPG: 4.5%</li>
        <li>Motor spirit / petrol: 16.8%</li>
        <li>ATF: 6.4%</li>
        <li>High-speed diesel: 41.2%</li>
        <li>Everything else combined: 31.1%</li>
      </ul>

      <p>
        This matters because a barrel is not “petrol with a little LPG on the side.” In India&apos;s actual refining output, diesel is still the biggest block. LPG is smaller in output share, but far bigger in political and household salience because it is the fuel people experience in the kitchen.
      </p>

      <h2>A transparent, notional allocation of refining operating cost</h2>

      <p>
        Since there is no official current product-wise processing ledger, the honest thing to do is a
        {" "}
        <strong>notional allocation</strong>
        : spread the barrel&apos;s operating-cost layer across the product slate using the PPAC output shares above.
      </p>

      <p>
        This is not refinery internal cost accounting. It is a transparent explanatory device. That is exactly why it is useful.
      </p>

      <Box sx={{ my: 4, display: "grid", gap: 2 }}>
        {slateRows.map((row) => (
          <SlateCard key={row.fuel} {...row} />
        ))}
      </Box>

      <p>
        The right way to read this table is not “petrol costs exactly Rs 36 to Rs 44 to process.” The right reading is: if the full barrel carries only about Rs 216 to Rs 260 of operating cost, then the refining-opex slice inside each product is relatively small. The bigger forces sit elsewhere.
      </p>

      <h2>What people actually pay in Delhi</h2>

      <p>
        Once you move to the consumer end of the chain, the picture changes immediately. Here is the reference table I could verify from official sources:
      </p>

      <Box sx={{ display: "grid", gap: 2.25, my: 4 }}>
        {currentDelhiRows.map((row) => (
          <Box
            key={row.fuel}
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "var(--mui-palette-background-paper)",
              boxShadow: 1,
              display: "grid",
              gap: 0.8,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", alignItems: "baseline" }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.1rem", md: "1.2rem" }, fontWeight: 800, m: 0 }}>
                {row.fuel}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 800 }}>
                {row.price}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "var(--mui-palette-text-secondary)" }}>
              Verified against: {row.verifiedDate}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--mui-palette-text-secondary)", lineHeight: 1.75 }}>
              {row.note}
            </Typography>
          </Box>
        ))}
      </Box>

      <h2>Petrol and diesel prices reveal the real story</h2>

      <p>
        IndianOil&apos;s Delhi price-buildup PDFs are useful because they separate the refinery-gate side from the tax-and-retail side. They show, very plainly, that the jump from dealer price to end-user pump price is not explained by refining opex alone.
      </p>

      <Box sx={{ my: 4, display: "grid", gap: 2 }}>
        {priceBuildUpRows.map((row) => (
          <Box
            key={row.fuel}
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: "var(--mui-palette-background-paper)",
              boxShadow: 1,
              display: "grid",
              gap: 1.5,
            }}
          >
            <Typography variant="h3" sx={{ fontSize: { xs: "1.15rem", md: "1.25rem" }, fontWeight: 800, m: 0 }}>
              {row.fuel}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" }, gap: 1.25 }}>
              {[
                ["Dealer price ex-tax", row.dealerPrice],
                ["Excise duty", row.excise],
                ["Dealer commission", row.dealerCommission],
                ["VAT", row.vat],
                ["Retail price", row.retail],
              ].map(([label, value]) => (
                <Box key={label} sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(15,23,42,0.04)" }}>
                  <Typography variant="caption" sx={{ display: "block", color: "var(--mui-palette-text-secondary)", mb: 0.75 }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <p>
        This is the clarity most debates miss. The refinery&apos;s operating-cost layer is one thin slice. The big consumer-facing number is built by stacking several other layers on top of it.
      </p>

      <h2>Why LPG feels bigger than its output share</h2>

      <p>
        There is another India-specific twist. The same PPAC report that shows LPG as only 4.5% of domestic petroleum-product output also shows LPG as a large share of petroleum-product imports. In the April-December FY 2024-25 import basket, LPG accounted for
        {" "}
        <strong>40.7%</strong>
        {" "}
        of imported petroleum products by volume mix.
      </p>

      <p>
        That is why LPG matters disproportionately in India&apos;s public conversation. It is not the largest refinery output. But it is the most socially visible household fuel and an important import item. It is the fuel that makes the energy system feel personal.
      </p>

      <h2>What this barrel question really teaches</h2>

      <ul>
        {keyTakeaways.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <p>
        So if someone asks, “What is the processing cost of LPG from one barrel of crude?”, the best honest answer is:
      </p>

      <blockquote>
        <p>
          There is no single official product-wise processing bill. But the public Indian data says the full refining operating-cost layer is only about Rs 216 to Rs 260 per barrel, and once you compare that with actual Delhi retail prices, the dominant price drivers are clearly crude, taxes, freight, and distribution rather than refining opex.
        </p>
      </blockquote>

      <p>
        That is the sober version. It is less dramatic than social-media graphics, but much more useful.
      </p>

      <h2>Sources</h2>
      <SourceList />
    </article>
  );
}
