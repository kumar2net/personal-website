import {
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const badges = [
  "Geopolitics",
  "Shipping",
  "Oil",
  "Hormuz",
  "Red Sea",
  "Insurance",
  "Cricket",
];

const valueBars = [
  {
    label: "Hormuz (2024 oil flow)",
    value: 511,
    width: 100,
    color: "linear-gradient(90deg, #0f766e, #14b8a6)",
  },
  {
    label: "Suez Canal + SUMED pipeline (2023 oil flow)",
    value: 225,
    width: 44,
    color: "linear-gradient(90deg, #1d4ed8, #60a5fa)",
  },
  {
    label: "Bab el-Mandeb normal (2023)",
    value: 220,
    width: 43,
    color: "linear-gradient(90deg, #6d28d9, #a78bfa)",
  },
  {
    label: "Bab el-Mandeb disrupted run-rate (2024 Jan-Aug)",
    value: 102,
    width: 20,
    color: "linear-gradient(90deg, #b91c1c, #f87171)",
  },
];

const routeRows = [
  {
    route: "Strait of Hormuz",
    flow:
      "20.0 million barrels/day of petroleum liquids in 2024; roughly flat in Q1 2025.",
    value: "~$511B/year",
    disruption:
      "The single biggest oil chokepoint. The U.S. Energy Information Administration (EIA) also says about 20% of global liquefied natural gas (LNG) trade passed through it in 2024.",
    why:
      "If risk spikes here, the price shock is immediate because Saudi and UAE bypass pipelines still cover only part of the lost volume.",
  },
  {
    route: "Suez Canal + Suez-Mediterranean (SUMED)",
    flow: "8.8 million barrels/day in 2023 in the U.S. Energy Information Administration (EIA) chokepoint table.",
    value: "~$225B/year",
    disruption:
      "The United Nations Conference on Trade and Development (UNCTAD) says that by mid-May 2025 Suez transits were down 55% and cargo tonnage was down 70% versus 2023.",
    why:
      "This is the corridor that turns Middle East and Red Sea disruption into a Europe-bound freight problem.",
  },
  {
    route: "Bab el-Mandeb",
    flow:
      "8.6 million barrels/day in 2023, but only about 4.0 million barrels/day in the first eight months of 2024.",
    value: "~$220B normal / ~$102B disrupted run-rate",
    disruption:
      "EIA says tanker traffic through the chokepoint fell by more than half during the Red Sea crisis.",
    why:
      "It is the south gate of the Red Sea. When it turns unsafe, Suez traffic and schedules unravel with it.",
  },
];

const insuranceRows = [
  {
    cover: "Hull and machinery",
    peace: "Standard physical-damage cover for the vessel.",
    war:
      "War-risk cover is repriced separately for listed areas; in stressed periods it can be cancelled or requoted on short notice.",
    commercial:
      "The shipowner sees an immediate per-transit cash hit before the vessel even sails.",
  },
  {
    cover: "Cargo",
    peace: "Protects the goods being transported.",
    war:
      "War and strikes coverage may need separate endorsement, higher premium, or tighter exclusions.",
    commercial:
      "Shippers either pay more, accept narrower cover, or reroute and eat delay costs.",
  },
  {
    cover: "Protection and indemnity (P&I) / liability",
    peace: "Third-party liabilities such as collision, crew, and pollution exposure.",
    war:
      "Terms tighten around high-risk ports and sea lanes, especially where conflict creates sanction or attack exposure.",
    commercial:
      "Charter-party negotiations get harder, and some calls become commercially unattractive.",
  },
  {
    cover: "Time, fuel, and delay",
    peace: "Normal sailing economics and scheduling.",
    war:
      "Cape reroutes, convoy waiting, security steps, and port bunching push up the total landed cost even if insurance still exists.",
    commercial:
      "The customer eventually pays through higher delivered prices, not just higher insurance invoices.",
  },
];

const bypassRows = [
  {
    option: "Cape of Good Hope reroute",
    canBypass: "Partly, for Europe- and Atlantic-bound sea cargo",
    pros:
      "Avoids the Red Sea, Bab el-Mandeb, and Suez Canal entirely. Uses existing ocean shipping without waiting for new infrastructure.",
    cons:
      "Longer sailing time, higher fuel burn, tighter vessel availability, more working-capital lockup, and higher end-to-end freight cost.",
    verdict:
      "Operationally real, but slower and more expensive. This is a detour, not a free bypass.",
  },
  {
    option: "Saudi and UAE overland pipelines",
    canBypass: "Partly, for some Gulf oil exports",
    pros:
      "Lets some crude move to the Red Sea or Gulf of Oman without transiting the Strait of Hormuz.",
    cons:
      "Capacity is far below Hormuz throughput and applies mainly to crude, not the full mix of petroleum products, LNG, or container cargo.",
    verdict:
      "Useful shock absorber, not a full substitute.",
  },
  {
    option: "Non-Middle-East sourcing",
    canBypass: "Sometimes, depending on commodity and destination",
    pros:
      "Buyers can diversify toward Atlantic Basin oil, other LNG suppliers, or different manufacturing origins.",
    cons:
      "Contracting, refining compatibility, shipping availability, and price dislocation all limit how fast this can happen.",
    verdict:
      "Works over time, not overnight.",
  },
  {
    option: "Complete bypass of Middle East-origin cargo",
    canBypass: "No",
    pros:
      "None at current scale for Gulf-origin LNG and much of Gulf-origin oil.",
    cons:
      "You cannot 'reroute away' from geography when the commodity is produced inside the Gulf and export infrastructure still converges on a few outlets.",
    verdict:
      "This is the hard limit.",
  },
];

const solutions = [
  "Keep navigation open with a predictable security umbrella. Commercial shipping can price risk, but it cannot price chaos.",
  "Use bypass pipes and storage where possible. EIA pegs Saudi Arabia's East-West pipeline at 5 million barrels/day and the UAE's Abu Dhabi Crude Oil Pipeline at 1.8 million barrels/day, useful but still far below Hormuz throughput.",
  "Accept route diversification when the premium math demands it. A longer Cape route can be cheaper than sailing through a corridor that suddenly carries war-risk surcharge, delay, and cancellation risk.",
  "Build public-private war-risk backstops. Insurance markets need a floor under them in conflict zones; otherwise trade seizes up faster than diplomacy moves.",
];

const sources = [
  {
    label: "EIA: Strait of Hormuz remained a critical oil chokepoint in 2024",
    url: "https://www.eia.gov/todayinenergy/detail.php?id=65584",
  },
  {
    label: "EIA: World Oil Transit Chokepoints",
    url: "https://www.eia.gov/international/content/analysis/special_topics/World_Oil_Transit_Chokepoints/wotc.pdf",
  },
  {
    label: "EIA: Fewer tankers transit the Red Sea in 2024, while Cape traffic grows",
    url: "https://www.eia.gov/todayinenergy/detail.php?id=63624",
  },
  {
    label: "UNCTAD: Review of Maritime Transport 2025",
    url: "https://unctad.org/publication/review-maritime-transport-2025",
  },
  {
    label: "Gard: 72 hours cancellation notice for certain trading areas",
    url: "https://www.gard.no/web/updates/content/38763765/72-hours-cancellation-notice-for-certain-trading-areas",
  },
  {
    label: "ICC: India face England in the Men's T20 World Cup semi-final",
    url: "https://www.icc-cricket.com/tournaments/mens-t20-world-cup-2026/news/live-india-face-familiar-foes-england-in-semi-finals",
  },
  {
    label: "ICC: India beat England to lift the U19 World Cup",
    url: "https://www.icc-cricket.com/news/dominant-india-beat-england-to-lift-the-u19-world-cup",
  },
];

export const metadata = {
  slug: "2026-03-07-impact-of-straits-for-trade-commerce",
  title: "Straits, War Risk, and the Price of Passage",
  description:
    "A practical look at Hormuz, Bab el-Mandeb, and Suez: the oil value concentrated in each corridor, what war does to cargo and hull insurance, and why the real solution is layered resilience.",
  excerpt:
    "A practical look at Hormuz, Bab el-Mandeb, and Suez: the oil value concentrated in each corridor, what war does to cargo and hull insurance, and why the real solution is layered resilience.",
  tags: ["Geopolitics", "Shipping", "Oil", "Hormuz", "Red Sea", "Insurance", "Cricket"],
  datePublished: "2026-03-07",
  dateModified: "2026-03-07",
  image: "/generate/2026-03-07-impact-of-straits-for-trade-commerce-hero.png",
  readingTime: "~8 min",
};

const bodyTextSx = {
  color: "var(--mui-palette-text-primary)",
  fontSize: "1.08rem",
  lineHeight: 1.8,
};

const mutedTextSx = {
  color: "var(--mui-palette-text-secondary)",
};

const sectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

function Bubble({ children }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        fontWeight: 700,
        fontSize: "1rem",
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {badges.map((badge) => {
          const label = encodeURIComponent(badge.replace(/\s+/g, "_"));
          return (
            <Box
              key={badge}
              component="img"
              src={`https://img.shields.io/badge/${label}-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white`}
              alt={`${badge} badge`}
              loading="lazy"
              decoding="async"
              sx={{ height: 28, width: "auto" }}
            />
          );
        })}
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" }, fontWeight: 700, lineHeight: 1.15 }}
        >
          Straits, War Risk, and the Price of Passage
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Every time tensions jump in West Asia, people talk about maps. What matters in practice is invoices.
          A few narrow waterways do outsized work for global commerce. When one of them becomes risky, the pain
          lands in freight, insurance, fuel, working capital, and eventually retail prices.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          My back-of-the-envelope USD figures below are directional, not official trade statistics. I annualized
          U.S. Energy Information Administration (EIA) oil-flow data using a flat $70 per barrel assumption. That
          means the table captures oil value only; it excludes liquefied natural gas (LNG), containers, dry bulk,
          and general cargo. Even with that conservative frame, the scale is large enough to explain why these
          corridors matter so much.
        </Typography>
        <Box
          component="img"
          src="/generate/2026-03-07-impact-of-straits-for-trade-commerce-hero.png"
          alt="Maritime hero image for Middle East shipping chokepoints"
          loading="lazy"
          decoding="async"
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: 3,
            aspectRatio: "1 / 1",
            objectFit: "cover",
            mt: 1,
          }}
        />
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ display: "flex", gap: 1.5, alignItems: "center", fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 700 }}
        >
          <Bubble>1</Bubble>
          Atlas view: the Middle East cargo map in one glance
        </Typography>
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 32%), linear-gradient(180deg, rgba(15,23,42,0.04), rgba(15,23,42,0.01))",
            border: "1px solid rgba(148, 163, 184, 0.22)",
            display: "grid",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.8fr 1fr 0.9fr 0.9fr" },
              gap: 1.5,
              alignItems: "stretch",
            }}
          >
            <AtlasCard
              title="Persian Gulf"
              subtitle="Origin basin"
              lines={[
                "Saudi Arabia, UAE, Iraq, Kuwait, Qatar, Iran",
                "Heavy concentration of oil and LNG export capacity",
              ]}
              tone="teal"
            />
            <AtlasCard
              title="Strait of Hormuz"
              subtitle="Primary outlet"
              lines={["~20 million barrels/day in 2024", "The decisive energy chokepoint"]}
              tone="red"
            />
            <AtlasCard
              title="Arabian Sea / Indian Ocean"
              subtitle="Open-water routing"
              lines={[
                "Eastbound Asia flows continue here",
                "Westbound cargo chooses Red Sea or Cape",
              ]}
              tone="blue"
            />
            <AtlasCard
              title="Bab el-Mandeb"
              subtitle="South gate of the Red Sea"
              lines={["Red Sea risk filter", "Traffic shock spreads north to Suez"]}
              tone="amber"
            />
            <AtlasCard
              title="Suez Canal + SUMED"
              subtitle="Fast lane to Europe"
              lines={["Shortest route to the Mediterranean", "Disruption here sends ships around Africa"]}
              tone="violet"
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            <RouteStrip
              title="Standard route"
              steps={["Persian Gulf", "Hormuz", "Arabian Sea", "Bab el-Mandeb", "Red Sea", "Suez / SUMED", "Europe"]}
              accent="linear-gradient(90deg, #0f766e, #3b82f6, #8b5cf6)"
            />
            <RouteStrip
              title="Bypass route"
              steps={["Persian Gulf", "Hormuz or pipeline outlet", "Arabian Sea", "Cape of Good Hope", "Atlantic / Europe"]}
              accent="linear-gradient(90deg, #92400e, #ef4444, #1d4ed8)"
            />
          </Box>

          <Typography variant="body2" sx={mutedTextSx}>
            This is a schematic atlas, not a geographic map. It is designed to show dependency: Hormuz is the first
            lock, Bab el-Mandeb is the Red Sea filter, and Suez plus the Suez-Mediterranean (SUMED) pipeline is the
            speed route into Europe.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ display: "flex", gap: 1.5, alignItems: "center", fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 700 }}
        >
          <Bubble>2</Bubble>
          The chart: rough annual oil value concentrated in each corridor
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {valueBars.map((item) => (
            <Box key={item.label} sx={{ display: "grid", gap: 0.75 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                <Typography sx={{ fontWeight: 700, color: "var(--mui-palette-text-primary)" }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "var(--mui-palette-text-primary)" }}>
                  ${item.value}B
                </Typography>
              </Box>
              <Box sx={{ height: 16, borderRadius: 999, bgcolor: "rgba(148, 163, 184, 0.18)", overflow: "hidden" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${item.width}%`,
                    background: item.color,
                    borderRadius: 999,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={mutedTextSx}>
          Read the last bar carefully: Bab el-Mandeb is the clearest picture of wartime distortion. The route did
          not become unimportant; it became expensive and dangerous enough that traffic moved elsewhere.
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ display: "flex", gap: 1.5, alignItems: "center", fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 700 }}
        >
          <Bubble>3</Bubble>
          The table: where the pressure really sits
        </Typography>
        <TableContainer sx={{ borderRadius: 3, border: "1px solid rgba(148, 163, 184, 0.2)" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Latest flow reference</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Oil value</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>What conflict changes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routeRows.map((row) => (
                <TableRow key={row.route} sx={{ verticalAlign: "top" }}>
                  <TableCell sx={{ fontWeight: 700 }}>{row.route}</TableCell>
                  <TableCell>{row.flow}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "grid", gap: 1 }}>
                      <Typography variant="body2" sx={{ color: "var(--mui-palette-text-primary)" }}>
                        {row.disruption}
                      </Typography>
                      <Typography variant="body2" sx={mutedTextSx}>
                        {row.why}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ display: "flex", gap: 1.5, alignItems: "center", fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 700 }}
        >
          <Bubble>4</Bubble>
          What war actually does to cargo, hull, and shipping bills
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The public discussion usually stops at "oil prices go up." That is incomplete. The shipping market gets
          hit in layers. Underwriters re-mark a zone as high risk. Owners pay additional war premium or re-open
          coverage discussions. Cargo owners face war-and-strikes clauses. Protection and indemnity (P&I) and
          charter terms tighten. Then the route itself stretches because vessels re-route, queue, or wait for a
          safer window.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          UNCTAD's 2025 review says Red Sea disruption more than doubled freight rates over pre-crisis levels, while
          Gard's March 1, 2026 notice is a reminder that war cover can change faster than most cargo plans do. In
          other words: war risk is not a single premium; it is a chain reaction.
        </Typography>
        <TableContainer sx={{ borderRadius: 3, border: "1px solid rgba(148, 163, 184, 0.2)" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Layer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>In normal times</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>In conflict</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Commercial result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {insuranceRows.map((row) => (
                <TableRow key={row.cover} sx={{ verticalAlign: "top" }}>
                  <TableCell sx={{ fontWeight: 700 }}>{row.cover}</TableCell>
                  <TableCell>{row.peace}</TableCell>
                  <TableCell>{row.war}</TableCell>
                  <TableCell>{row.commercial}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ display: "flex", gap: 1.5, alignItems: "center", fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 700 }}
        >
          <Bubble>5</Bubble>
          Can the Middle East be bypassed completely?
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Not completely. That is the key answer. If the problem is the Red Sea, then yes, ships can sail around the
          Cape of Good Hope. If the problem is the Strait of Hormuz, only part of Gulf crude can escape through
          pipelines. If the cargo itself originates inside the Gulf, geography still wins.
        </Typography>
        <TableContainer sx={{ borderRadius: 3, border: "1px solid rgba(148, 163, 184, 0.2)" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Bypass option</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Can it bypass?</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Pros</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cons</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Bottom line</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bypassRows.map((row) => (
                <TableRow key={row.option} sx={{ verticalAlign: "top" }}>
                  <TableCell sx={{ fontWeight: 700 }}>{row.option}</TableCell>
                  <TableCell>{row.canBypass}</TableCell>
                  <TableCell>{row.pros}</TableCell>
                  <TableCell>{row.cons}</TableCell>
                  <TableCell>{row.verdict}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <DecisionCard
            title="What can be bypassed"
            tone="green"
            points={[
              "Red Sea transit can be bypassed by routing around southern Africa.",
              "Some Gulf crude can bypass Hormuz via Saudi and UAE pipelines.",
              "Sourcing can diversify over time when buyers accept higher costs or different grades.",
            ]}
          />
          <DecisionCard
            title="What cannot be bypassed"
            tone="red"
            points={[
              "Most Hormuz-scale Gulf energy cannot be displaced instantly.",
              "Qatar-linked LNG dependence is especially hard to reroute physically.",
              "Containers may reroute, but time, fuel, insurance, and inventory costs still rise sharply.",
            ]}
          />
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ display: "flex", gap: 1.5, alignItems: "center", fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 700 }}
        >
          <Bubble>6</Bubble>
          So what is the solution?
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          There is no silver bullet. A chokepoint is, by definition, hard to replace. The right answer is layered
          resilience: security, alternate routes, storage, and financial backstops together. The reason this matters
          is simple: commerce can tolerate cost, but it struggles with unpredictability.
        </Typography>
        <Box component="ol" sx={{ m: 0, pl: 3, display: "grid", gap: 1.5 }}>
          {solutions.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>
        <Typography variant="body2" sx={mutedTextSx}>
          My own takeaway: if Hormuz ever faces a serious closure scare, the world would discover very quickly that
          rerouting is a relief valve, not a substitute. The spare capacity outside the strait is meaningful, but not
          remotely enough to make the problem disappear.
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ display: "flex", gap: 1.5, alignItems: "center", fontSize: { xs: "1.5rem", md: "1.9rem" }, fontWeight: 700 }}
        >
          <Bubble>7</Bubble>
          One unrelated but honest cricket note
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          The hint file also carried a different kind of instinct, and I want to preserve it. After India's March 5,
          2026 International Cricket Council (ICC) Men's Twenty20 (T20) World Cup semi-final against England, the
          easy temptation is to freeze the winning template. I lean the other way. A month after Vaibhav
          Sooryavanshi's Under-19 (U19) World Cup fireworks, I would rather bring him into the wider T20 setup early
          than admire him from distance.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Not because every teenager must be rushed into the senior XI, but because great systems hedge the future
          before they are forced to. Shipping lanes and cricket pipelines teach the same lesson: concentration risk is
          comfortable until the day it is not.
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, fontWeight: 700 }}>
          Sources and assumptions
        </Typography>
        <Typography variant="body2" sx={mutedTextSx}>
          Sources below informed the current-fact sections. The USD estimates in the chart/table are my inference from
          those sources, not a quoted statistic.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "grid", gap: 1 }}>
          {sources.map((source) => (
            <Typography key={source.url} component="li" variant="body2" sx={bodyTextSx}>
              <Link href={source.url} target="_blank" rel="noreferrer" underline="hover">
                {source.label}
              </Link>
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function AtlasCard({ title, subtitle, lines, tone }) {
  const tones = {
    teal: {
      border: "rgba(20, 184, 166, 0.35)",
      bg: "rgba(20, 184, 166, 0.08)",
    },
    red: {
      border: "rgba(239, 68, 68, 0.35)",
      bg: "rgba(239, 68, 68, 0.08)",
    },
    blue: {
      border: "rgba(59, 130, 246, 0.35)",
      bg: "rgba(59, 130, 246, 0.08)",
    },
    amber: {
      border: "rgba(245, 158, 11, 0.35)",
      bg: "rgba(245, 158, 11, 0.08)",
    },
    violet: {
      border: "rgba(139, 92, 246, 0.35)",
      bg: "rgba(139, 92, 246, 0.08)",
    },
  };
  const palette = tones[tone] || tones.blue;

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        border: `1px solid ${palette.border}`,
        bgcolor: palette.bg,
        display: "grid",
        gap: 0.75,
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "var(--mui-palette-text-primary)" }}>{title}</Typography>
      <Typography variant="caption" sx={{ color: "var(--mui-palette-text-secondary)", fontWeight: 700 }}>
        {subtitle}
      </Typography>
      {lines.map((line) => (
        <Typography key={line} variant="body2" sx={{ color: "var(--mui-palette-text-primary)" }}>
          {line}
        </Typography>
      ))}
    </Box>
  );
}

function RouteStrip({ title, steps, accent }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        border: "1px solid rgba(148, 163, 184, 0.2)",
        bgcolor: "rgba(15, 23, 42, 0.02)",
        display: "grid",
        gap: 1,
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "var(--mui-palette-text-primary)" }}>{title}</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center" }}>
        {steps.map((step, index) => (
          <Box key={step} sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
            <Box
              sx={{
                px: 1.1,
                py: 0.6,
                borderRadius: 999,
                background: accent,
                color: "white",
                fontSize: "0.78rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {step}
            </Box>
            {index < steps.length - 1 && (
              <Typography sx={{ color: "var(--mui-palette-text-secondary)", fontWeight: 700 }}>
                →
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function DecisionCard({ title, points, tone }) {
  const palette =
    tone === "green"
      ? { border: "rgba(34, 197, 94, 0.35)", bg: "rgba(34, 197, 94, 0.08)" }
      : { border: "rgba(239, 68, 68, 0.35)", bg: "rgba(239, 68, 68, 0.08)" };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2.5,
        border: `1px solid ${palette.border}`,
        bgcolor: palette.bg,
        display: "grid",
        gap: 1,
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "var(--mui-palette-text-primary)" }}>{title}</Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.5, display: "grid", gap: 0.75 }}>
        {points.map((point) => (
          <Typography key={point} component="li" variant="body2" sx={{ color: "var(--mui-palette-text-primary)" }}>
            {point}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
