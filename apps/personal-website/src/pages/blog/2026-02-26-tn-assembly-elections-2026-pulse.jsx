import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export const metadata = {
  slug: "2026-02-26-tn-assembly-elections-2026-pulse",
  title: "TN Assembly Election 2026: 3-Way Fight, Vote Math, and the SOP War",
  description:
    "Deep dive into Tamil Nadu 2026 Assembly math: alliance equations, belt-level popularity, seat projections, and a breakdown of AIADMK’s welfare promises as the campaign enters full swing.",
  excerpt:
    "A no-nonsense, Gen Z-readable psephology take on Tamil Nadu 2026: where AIADMK, DMK, and TVK math is won in transfer votes, not slogans.",
  tags: ["Politics", "Tamil Nadu", "Elections", "Psephology", "Assembly 2026"],
  datePublished: "2026-02-26",
  dateModified: "2026-02-26",
  image: "/media/blogwordcloud.png",
  readingTime: "~8 min",
};

const bodyTextSx = {
  color: "var(--mui-palette-text-primary)",
  fontSize: "1.125rem",
  lineHeight: 1.8,
};

const labelSx = {
  color: "var(--mui-palette-text-primary)",
  fontWeight: 700,
};

const sectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const rows = {
  hardFloor: [
    "Tamil Nadu Assembly has 234 seats, with 118 required for majority.",
    "In 2021, DMK-led SPA won 159 seats (DMK 133 + allies 26), while AIADMK-led camps were 75.",
    "As of late-2025 reporting, the rough composition still clustered around DMK 133, AIADMK 60, Congress 17, PMK 3, others + vacancies.",
    "ECI had no final poll-date call in our late-February window, but nomination/symbol work had already started in the lead-up phase.",
  ],
  belts: [
    {
      belt: "North belt (Dharmapuri, Ranipettai, Ranipet corridor)",
      strongest: "PMK pocket + TVK pockets + BJP support in selected seats",
      why: "High swing pressure; PMK concentration gives this belt outsized seat volatility.",
    },
    {
      belt: "Coast + North-East metro ring (Chennai, Cuddalore, Tiruvallur, Chengalpattu)",
      strongest: "TVK growth pockets + local anti-incumbency pockets",
      why: "TVK list-readings repeatedly show high urban drift and margin pressure on both fronts.",
    },
    {
      belt: "Western/Kongu edge",
      strongest: "Left + VCK pockets, selective BJP pockets",
      why: "AIADMK conversion can improve if PMK/BJP transfers are clean and disciplined.",
    },
    {
      belt: "South belt (Madurai, Tenkasi, Thoothukudi, Nellai side)",
      strongest: "DMK base with AIADMK legacy pockets",
      why: "Candidate quality can dominate over alliance labels in this belt.",
    },
  ],
  sources: [
    {
      label: "TOI alliance math snapshot",
      url: "https://timesofindia.indiatimes.com/india/tamil-nadu-assembly-elections-2026-alliances-numbers-and-the-battle-for-234-seats/photostory/126486219.cms",
    },
    {
      label: "Indian Express: 2021 ally-by-ally performance",
      url: "https://www.indianexpress.com/article/political-pulse/in-dmk-vs-aiadmk-battle-for-tamil-nadu-data-shows-which-allies-hold-the-key-10526662/",
    },
    {
      label: "TOI first phase promises",
      url: "https://timesofindia.indiatimes.com/city/chennai/aiadmk-poll-promises-free-bus-travel-for-men-rs-2000-for-all-ration-cardholders-rs-25000-for-women-to-buy-two-wheelers/amp_articleshow/126620246.cms",
    },
    {
      label: "New Indian Express: second phase promises",
      url: "https://www.newindianexpress.com/states/tamil-nadu/2026/Feb/04/eps-rolls-out-five-more-populist-poll-promises-ahead-of-assembly-elections",
    },
    {
      label: "Economic Times: third phase promises",
      url: "https://m.economictimes.indiatimes.com/news/politics-and-nation/tamil-nadu-elections-aiadmk-unveils-third-phase-of-poll-promises/amp_articleshow/128745137.cms",
    },
    {
      label: "DMK manifesto outreach",
      url: "https://www.newindianexpress.com/states/tamil-nadu/2026/Jan/04/dmk-launches-public-outreach-platforms-for-2026-poll-manifesto",
    },
  ],
};

const barData = [
  { label: "High transfer pressure", pct: 85, text: "TVK + PMK + local independents" },
  { label: "Urban/metro noise", pct: 60, text: "AIADMK/BJP + anti-incumbent voters" },
  { label: "Alliance consolidation", pct: 75, text: "DMK + Congress/Left/VCK network" },
];

const seatInputs = [
  {
    label: "Internal TVK-access framing (Jan 2026 context)",
    dmk: "No direct one-to-one assembly transfer",
    aiadmk: "Heavy dependent on alliance coherence",
    tvk: "Can act as vote splitter + regional booster",
  },
  {
    label: "TVK sketch inputs (Dec 2025)",
    dmk: "105",
    aiadmk: "74",
    tvk: "56",
  },
  {
    label: "2021 coalition baseline memory",
    dmk: "Higher direct carry in base wards",
    aiadmk: "Critical transfer dependence",
    tvk: "High volatility in growth belts",
  },
];

const scenarios = [
  {
    label: "Scenario A — Continuity drag",
    detail: "DMK-led bloc 120–135 | AIADMK-led bloc 80–100 | Others 0–10",
  },
  {
    label: "Scenario B — TVK expands",
    detail: "DMK-led bloc 105–120 | AIADMK-led bloc 70–90 | TVK/Others 20–30",
  },
  {
    label: "Scenario C — Ward micro-targeting",
    detail: "Most battlegrounds tighten around 2–4 wards where transfer noise breaks.",
  },
];

const sops = {
  phase1: [
    "₹2,000/month to every ration card family (Kula Vilakku framing).",
    "Free city-bus travel for men + continuity of existing women transport support.",
    "₹25,000 scooter support for five lakh women.",
    "Amma Illam housing for roof-less households in rural + urban belts.",
    "Rural employment jump from 100 to 150 days.",
  ],
  phase2: [
    "Social pensions raised to ₹2,000.",
    "3 LPG cylinders/year for ration-card families.",
    "Student loan waiver for bank borrowers.",
    "₹10 lakh for Jallikattu deaths, ₹2 lakh for injuries.",
    "Interest-free minority women loans + co-op loan waiver for persons with disabilities.",
  ],
  phase3: [
    "One-time ₹10,000 support to every family.",
    "Student stipend: ₹2,000 for degree holders / ₹1,000 for +2 candidates in exchanges.",
    "Fishermen assistance uplift + ₹1,000 Pongal add-on.",
    "Free power for handloom/powerloom units and small trader debt waiver framing.",
  ],
};

const implications = [
  "The game is not “single promise hype”; it is alliance transfer quality. Overlaps with existing welfare architecture limit incremental swing.",
  "DMK’s campaign can argue continuity and execution, especially against high-overlap freebies.",
  "Multiple actors flagged fiscal stress; a budget-race narrative (not just freebies) can become important late in campaign.",
  "A TVK vote split can still be decisive if AIADMK cannot absorb anti-incumbent and anti-DMK anti-BJP spillover.",
];

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {metadata.tags.map((tag) => {
          const label = encodeURIComponent(tag.replace(/\s+/g, "_"));
          return (
            <Box
              key={tag}
              component="img"
              src={`https://img.shields.io/badge/${label}-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white`}
              alt={`${tag} badge`}
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
          sx={{ fontSize: { xs: "1.875rem", md: "2.5rem" }, fontWeight: 700, lineHeight: 1.2 }}
        >
          TN Assembly Election 2026: 3-Way Fight, Vote Math, and the SOP War
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          No cap: this election is not a simple DMK vs AIADMK brawl anymore. Tamil Nadu is looking like
          a live{" "}
          <Box component="span" sx={{ fontWeight: 700 }}>
            alliance-transfer puzzle
          </Box>
          {" "}
          where a tiny realignment in one belt can redraw lots of seats.
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--mui-palette-text-secondary)" }}>
          Last updated: 26 Feb 2026
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The hard floor: what is not opinion
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {rows.hardFloor.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Sources used (data trail)
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {rows.sources.map((item) => (
            <Typography key={item.url} component="li" variant="body1" sx={bodyTextSx}>
              <Link href={item.url} target="_blank" rel="noreferrer noopener">
                {item.label}
              </Link>
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Who is strongest where?
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={labelSx}>Belt / Block</TableCell>
                <TableCell sx={labelSx}>Who is strongest</TableCell>
                <TableCell sx={labelSx}>Why this matters</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.belts.map((row) => (
                <TableRow key={row.belt}>
                  <TableCell sx={bodyTextSx}>{row.belt}</TableCell>
                  <TableCell sx={bodyTextSx}>{row.strongest}</TableCell>
                  <TableCell sx={bodyTextSx}>{row.why}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Region chart from campaign signals
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {barData.map((item) => (
            <Box key={item.label}>
              <Typography variant="body1" sx={bodyTextSx}>
                {item.label}: {item.text}
              </Typography>
              <Box sx={{ width: "100%", mt: 1, height: 14, bgcolor: "grey.200", borderRadius: 999 }}>
                <Box
                  sx={{
                    width: `${item.pct}%`,
                    height: "100%",
                    bgcolor: "primary.main",
                    borderRadius: 999,
                    transition: "width 500ms ease",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Poll-and-data blend (not an official seat forecast)
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={labelSx}>Input</TableCell>
                <TableCell sx={labelSx}>DMK / SPA</TableCell>
                <TableCell sx={labelSx}>AIADMK / NDA</TableCell>
                <TableCell sx={labelSx}>TVK / Others</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seatInputs.map((item) => (
                <TableRow key={item.label}>
                  <TableCell sx={bodyTextSx}>{item.label}</TableCell>
                  <TableCell sx={bodyTextSx}>{item.dmk}</TableCell>
                  <TableCell sx={bodyTextSx}>{item.aiadmk}</TableCell>
                  <TableCell sx={bodyTextSx}>{item.tvk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            background: "var(--mui-palette-background-paper)",
            p: 2,
            borderRadius: 2,
            border: "1px solid var(--mui-palette-divider)",
            fontFamily: "monospace",
          }}
        >
          {scenarios.map((item) => (
            <Typography key={item.label} variant="body1" sx={{ ...bodyTextSx }}>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {item.label}
              </Box>
              {": "}
              {item.detail}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          All SOPs AIADMK promised (as publicly announced through late Feb 2026)
        </Typography>

        <Typography variant="h3" sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, fontWeight: 600 }}>
          Phase 1
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {sops.phase1.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>

        <Typography variant="h3" sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, fontWeight: 600, mt: 3 }}>
          Phase 2
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {sops.phase2.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>

        <Typography variant="h3" sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, fontWeight: 600, mt: 3 }}>
          Phase 3
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {sops.phase3.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What does this imply?
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          {implications.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section">
        <Typography variant="body1" sx={{ ...bodyTextSx, fontStyle: "italic" }}>
          If you’re expecting a simple “who has the biggest headline budget” read, this is the opposite.
          The real contest is who can stitch alliance transfers, turnout, and message discipline faster than
          everyone else can panic-respond to last-minute optics.
        </Typography>
      </Box>
    </Box>
  );
}
