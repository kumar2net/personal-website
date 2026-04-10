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

const title = "The Middle East Fiasco: A Cost Scorecard for All This Strategic Genius";

const tags = ["Geopolitics", "Middle East", "War", "Shipping", "Economics", "Policy"];

const scorecardRows = [
  {
    bucket: "Gaza and the West Bank",
    figure: "$53 billion in recovery needs, including about $30 billion in physical damage and $19 billion in economic losses",
    window: "World Bank, UN, and EU assessment released February 18, 2025, covering October 2023 through October 2024",
    why:
      "This was already a nation-scale rebuilding bill before later damage was even counted. The same assessment says prices in Gaza had soared over 300% in a year and food prices were up 450%.",
  },
  {
    bucket: "Lebanon",
    figure: "$11 billion in recovery needs and a $14 billion economic cost, with $6.8 billion in damage and $7.2 billion in losses",
    window: "World Bank assessment released March 7, 2025, covering October 8, 2023 through December 20, 2024",
    why:
      "Lebanon's economy, which was already fragile, was pushed into a deeper hole. The World Bank says the conflict drove a 7.1% GDP contraction in 2024.",
  },
  {
    bucket: "Israel's public bill",
    figure:
      "About NIS 142 billion (about $46.0 billion) in conflict expenses through the end of 2024; Bank of Israel forecast around NIS 250 billion (about $81.0 billion) for 2023-2025",
    window: "State Comptroller report published November 2025, citing Finance Ministry and Bank of Israel data",
    why:
      "War does not only burn fuel and missiles. It also burns fiscal room, debt capacity, and future budget choices.",
  },
  {
    bucket: "Egypt and the Suez Canal",
    figure: "$3.991 billion in 2024 revenue versus $10.25 billion in 2023, with ship traffic down 50%",
    window: "Full-year 2024 results reported by AP on April 16, 2025, citing the Suez Canal Authority",
    why:
      "That is roughly a $6.26 billion annual revenue hole for one of Egypt's biggest foreign-currency lifelines.",
  },
  {
    bucket: "Global shipping and trade",
    figure: "Suez weekly transits down 42%; container ship transits down 67%; Shanghai-Europe spot freight rates up 256%",
    window: "UNCTAD press release dated January 26, 2024",
    why:
      "This is how a regional conflict invoices the rest of the planet: detours, insurance premiums, delay, fuel burn, and later consumer inflation.",
  },
  {
    bucket: "The U.S. taxpayer tab",
    figure: "$9.65 to $12.07 billion in U.S. military activity in the wider Middle East through September 2025, plus $21.7 billion in military aid to Israel",
    window: "Brown University's Costs of War project, published October 7, 2025",
    why:
      "That puts the two-year U.S. total at about $31.35 to $33.77 billion, and that is still only one country's ledger.",
  },
];

const consequences = [
  "The World Bank says Gaza's recovery bill includes funding to deal with 41 to 47 million tons of rubble and debris. So yes, one output of modern statecraft is apparently industrial-scale debris management.",
  "Egypt gets to lose a big chunk of Suez income while the rest of the world gets a lecture on how rerouting trade and raising freight costs is somehow a sign of strategic control.",
  "Shipping lines pay more for distance, insurance, and delay. Consumers later pay more for goods. Politicians then act surprised that inflation has once again arrived by mystical means.",
  "Israel absorbs a vast fiscal hit, Lebanon sinks deeper, Gaza's rebuilding bill compounds, and the United States writes larger checks. Everybody calls this security. Nobody can explain why everybody is poorer and less secure afterward.",
];

const sources = [
  {
    label: "World Bank, UN, EU: Gaza and West Bank Interim Rapid Damage and Needs Assessment",
    url: "https://www.worldbank.org/en/news/press-release/2025/02/18/new-report-assesses-damages-losses-and-needs-in-gaza-and-the-west-bank",
  },
  {
    label: "World Bank: Lebanon's Recovery and Reconstruction Needs Estimated at US$11 Billion",
    url: "https://www.worldbank.org/en/news/press-release/2025/03/07/lebanon-s-recovery-and-reconstruction-needs-estimated-at-us-11-billion",
  },
  {
    label: "State Comptroller of Israel: Swords of Iron War - Financial and Budgetary Aspects",
    url: "https://library.mevaker.gov.il/sites/DigitalLibrary/Documents/2025/2025-Financial-and-Budgetary/2025-Financial-and-Budgetary-001-EN.pdf",
  },
  {
    label: "Bank of Israel: Representative exchange rates",
    url: "https://www.boi.org.il/en/economic-roles/financial-markets/exchange-rates/",
  },
  {
    label: "AP: Egypt's revenue from the Suez Canal plunged sharply in 2024",
    url: "https://apnews.com/article/suez-canal-egypt-gaza-houthis-israel-5a5fe98a74f64144f7aab9ceca9d87d3",
  },
  {
    label: "UNCTAD: Escalating disruptions to global trade due to tensions affecting key trade routes",
    url: "https://unctad.org/press-material/unctad-raises-alarms-escalating-disruptions-global-trade-due-geopolitical-tensions",
  },
  {
    label: "Brown University Costs of War: Costs of United States Military Activities in the Wider Middle East Since October 7, 2023",
    url: "https://costsofwar.watson.brown.edu/paper/WiderMiddleEastCosts",
  },
];

export const metadata = {
  slug: "2026-04-10-middle-east-fiasco-cost-scorecard",
  title: "The Middle East Fiasco: A Cost Scorecard for All This Strategic Genius",
  description:
    "A satirical cost scorecard for the region's ongoing escalation: Gaza recovery needs, Lebanon losses, Israel's war bill, the Suez revenue collapse, shipping-rate spikes, and the wider taxpayer tab.",
  excerpt:
    "A satirical cost scorecard for the region's ongoing escalation: Gaza recovery needs, Lebanon losses, Israel's war bill, the Suez revenue collapse, shipping-rate spikes, and the wider taxpayer tab.",
  tags: ["Geopolitics", "Middle East", "War", "Shipping", "Economics", "Policy"],
  datePublished: "2026-04-10",
  dateModified: "2026-04-10",
  image: "/media/blogwordcloud.png",
  readingTime: "~6 min",
};

const bodyTextSx = {
  color: "var(--mui-palette-text-primary)",
  fontSize: "1.08rem",
  lineHeight: 1.8,
};

const mutedTextSx = {
  color: "var(--mui-palette-text-secondary)",
  fontSize: "1rem",
  lineHeight: 1.7,
};

const sectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const calloutSx = {
  borderLeft: "4px solid var(--mui-palette-primary-main)",
  pl: 2,
  py: 1.5,
  backgroundColor: "var(--mui-palette-action-hover)",
  borderRadius: 1,
};

const tableCellSx = {
  verticalAlign: "top",
  color: "var(--mui-palette-text-primary)",
  fontSize: "0.98rem",
  lineHeight: 1.65,
};

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {tags.map((tag) => {
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
          sx={{
            fontSize: { xs: "1.95rem", md: "2.7rem" },
            fontWeight: 700,
            lineHeight: 1.16,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          {title}
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            If the objective was to spend staggering sums of money in order to buy
            more rubble, more fear, more detours, and less certainty, this has been
            an outstanding success.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          The human bill is worse than the money bill, but the money bill is useful
          because spreadsheets are the one language war salesmen still pretend to
          respect. So let us keep score.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          This is not one neat grand total. Some numbers below are reconstruction
          needs, some are direct budget costs, some are lost revenues, and some are
          freight-price shock indicators. They do not all stack neatly, because war is
          messy, overlapping, and deeply allergic to tidy accounting. That does not
          make it cheap. It makes it harder to hide.
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}>
          The bill, so far
        </Typography>
        <Typography variant="body1" sx={mutedTextSx}>
          Different windows, different ledgers, same basic conclusion: everybody pays.
        </Typography>
        <TableContainer sx={{ borderRadius: 3, border: "1px solid rgba(148, 163, 184, 0.25)" }}>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Bucket</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Figure</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Window</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Why it matters</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scorecardRows.map((row) => (
                <TableRow key={row.bucket}>
                  <TableCell sx={tableCellSx}>{row.bucket}</TableCell>
                  <TableCell sx={tableCellSx}>{row.figure}</TableCell>
                  <TableCell sx={tableCellSx}>{row.window}</TableCell>
                  <TableCell sx={tableCellSx}>{row.why}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" sx={mutedTextSx}>
          USD equivalents for the shekel figures use the Bank of Israel representative
          exchange rate of NIS 3.087 per USD, published for April 9, 2026.
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}>
          Why I am not giving you one fake grand total
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Because that would be dishonest. The Gaza and Lebanon rebuilding numbers are
          recovery needs. Israel's figure is a fiscal-war-cost number. Suez is lost
          annual revenue. UNCTAD's figures are trade-disruption indicators. Brown's
          number is one country's direct military and aid outlay.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          If you want one clean, non-overlapping subtotal, start with the rebuilding
          bill alone: Gaza and the West Bank at $53 billion plus Lebanon at $11
          billion gives you roughly $64 billion in recovery needs. That subtotal still
          excludes Israel's own war budget, Egypt's lost canal income, the freight-rate
          shock, the insurance premium, and the broader taxpayer burden outside the
          region.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            The absence of one tidy master total is not proof of affordability. It is
            proof that the damage spills across budgets, borders, and balance sheets.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}>
          What all this strategic genius bought
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.35 }}>
          {consequences.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          The miracle sales pitch of every prolonged regional conflict is the same:
          spend more now, suffer more now, destabilize more now, and someday perhaps
          receive a premium-quality version of safety later. The invoice arrives much
          faster than that promised safety ever does.
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}>
          Sources and dates
        </Typography>
        <Typography variant="body1" sx={mutedTextSx}>
          I am intentionally anchoring the figures to dated sources so the post does
          not pretend these are timeless constants.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.2 }}>
          {sources.map((source) => (
            <Typography key={source.url} component="li" variant="body1" sx={bodyTextSx}>
              <Link href={source.url} target="_blank" rel="noreferrer noopener" underline="hover">
                {source.label}
              </Link>
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
