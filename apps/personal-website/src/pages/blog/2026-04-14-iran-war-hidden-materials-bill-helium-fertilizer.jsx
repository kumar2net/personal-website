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

const title =
  "The Iran War's Hidden Materials Bill: Helium, Fertilizer, Plastics, and Oil";

const tags = [
  "Iran War",
  "Materials",
  "Helium",
  "Fertilizer",
  "Energy",
  "Supply Chains",
];

const materialRows = [
  {
    material: "Helium",
    exposure:
      "Qatar is a huge swing point. USGS put Qatar's 2025 helium production at 63 million cubic meters out of a 190 million cubic meter world total, roughly one-third.",
    downstream:
      "MRI scanners, semiconductor etching and cooling steps, aerospace, scientific instruments, and cryogenic systems.",
    signal:
      "C&EN and Axios both describe a one-third helium supply shock, with suppliers already rationing some customers.",
    read:
      "This is the cleanest example of a small material with a big shadow. You do not replace helium in the coldest cryogenic uses by shouting 'free market' at a cylinder.",
  },
  {
    material: "LNG and natural gas",
    exposure:
      "EIA says Qatar exported nearly 20% of global LNG supplies through Hormuz in 2025, and that March disruptions widened the Europe/Asia price spread versus Henry Hub.",
    downstream:
      "Power, heating, industrial heat, ammonia, methanol, petrochemicals, and state fiscal revenues across the Gulf.",
    signal:
      "EIA's April STEO says U.S. LNG terminals are near peak utilization, so the U.S. cannot simply flood the market overnight.",
    read:
      "Gas is no longer a local fuel story. Once LNG is the balancing mechanism, a Gulf bottleneck becomes an Asian and European price story.",
  },
  {
    material: "Crude oil and refined products",
    exposure:
      "EIA estimated 7.5 million barrels per day of collective crude shut-ins in March across Iraq, Saudi Arabia, Kuwait, the UAE, Qatar, and Bahrain, rising to 9.1 million barrels per day in April.",
    downstream:
      "Petrol, diesel, jet fuel, shipping fuel, LPG, naphtha, petroleum coke, and every transport chain that pretends energy is a footnote.",
    signal:
      "AP reported U.S. gasoline above $4.12 per gallon on April 13, while EIA forecast Brent peaking at $115 per barrel in 2Q26 under its April assumptions.",
    read:
      "Oil is the loud headline because everyone sees it at the pump. But oil is also a feedstock tree: refined products, plastics, synthetic graphite feedstock, and freight costs all move with it.",
  },
  {
    material: "Ammonia and urea",
    exposure:
      "The Fertilizer Institute says high-risk and at-risk countries accounted for nearly 30% of global ammonia exports in 2024, and nearly 49% of global urea exports.",
    downstream:
      "Nitrogen fertilizer, crop yields, food prices, animal feed, and farm working capital.",
    signal:
      "The same note flags U.S. domestic supply import exposure of roughly 10% for ammonia and 35% for urea.",
    read:
      "This is the food-inflation channel hiding inside the war headline. Less fertilizer or costlier fertilizer eventually tries to become costlier food.",
  },
  {
    material: "Phosphate fertilizers, sulfur, and sulfuric acid",
    exposure:
      "TFI ties more than one-fifth of global MAP, DAP, and TSP trade to exposed countries, and nearly 50% of global sulfur trade to countries exposed to Hormuz or regional disruption.",
    downstream:
      "Phosphate fertilizer, sulfuric acid, and mineral processing chains for copper, nickel, and cobalt.",
    signal:
      "CRS notes that sulfuric acid from the region matters for critical-mineral leaching, especially in parts of Africa.",
    read:
      "Sulfur sounds boring until it is missing. Then it becomes agriculture, battery metals, and industrial chemistry.",
  },
  {
    material: "Naphtha, methanol, and petrochemical feedstocks",
    exposure:
      "C&EN says Asian petrochemical plants rely on the Middle East for 70-80% of their naphtha feedstock, much of it moving through Hormuz.",
    downstream:
      "Ethylene, propylene, methanol-to-olefins, resins, coatings, packaging, polyester, and synthetic fibers.",
    signal:
      "C&EN reported force majeure notices and production cutbacks across Asian chemical producers after the strait shutdown.",
    read:
      "This is where the war enters paint, plastic packaging, textiles, and chemical plant restart schedules.",
  },
  {
    material: "Aluminum",
    exposure:
      "AP and WEF both list aluminum as a material exposed to regional shipping disruption; WEF cites Middle East production at around 9% of global primary aluminum.",
    downstream:
      "Construction, transport, power cables, solar frames, consumer goods, and aircraft parts.",
    signal:
      "The risk is not only finished aluminum exports. Gulf smelters also need imported alumina and reliable energy.",
    read:
      "Aluminum is less fragile than helium, but it is heavy, power-hungry, and logistics-sensitive. That makes it a war-risk premium candidate.",
  },
  {
    material: "Semiconductor specialty inputs",
    exposure:
      "Reuters reported that South Korea was watching helium plus 14 other chip-supply-chain items tied to the Middle East, including bromine and some inspection equipment.",
    downstream:
      "Memory chips, advanced logic chips, fab maintenance, AI data-center hardware, phones, laptops, and autos.",
    signal:
      "Major chipmakers said inventories and supplier diversification reduced immediate risk, which is exactly why this belongs on the watchlist rather than the panic list.",
    read:
      "The semiconductor story is not one magic mineral. It is a pile of boring inputs that become existential only when the logistics map breaks.",
  },
];

const watchList = [
  "Duration matters more than drama. A one-week outage and a two-month outage are not the same commodity event.",
  "Helium has less room for bluffing than oil. It is time-sensitive in liquid form, has limited substitutes, and depends on a small number of plants and specialized containers.",
  "Fertilizer pressure reaches consumers slowly. The farm input shock shows up through planting decisions, crop yields, food imports, and subsidy math.",
  "Petrochemicals lag the headline. Plants carry inventory, but force majeure notices and restart delays are how a shipping shock becomes a manufacturing shock.",
  "Aluminum and semiconductor inputs are watchlist items. The issue is not global disappearance tomorrow; it is higher risk premium, longer routing, and narrower buffers.",
];

const indiaAngle = [
  "For India, the immediate visible channel is still crude, LPG, diesel, and imported LNG. That hits inflation, the current account, and political nerves.",
  "The quieter channel is fertilizer. India cannot treat nitrogen and phosphate inputs as a distant American farmer problem; it is a food-price and subsidy problem here too.",
  "The third channel is manufactured goods. Plastics, packaging, synthetic fibers, aluminum, and chip inputs do not announce themselves as war goods, but they sit inside daily industrial life.",
];

const sources = [
  {
    label: "AP: How a US blockade near the Strait of Hormuz could work",
    url: "https://apnews.com/article/iran-war-strait-of-hormuz-blockade-trump-bf6a057faebfc11eb0c76510a4fc20b1",
  },
  {
    label: "EIA: Hormuz closure and production outages in the April 2026 STEO",
    url: "https://www.eia.gov/pressroom/releases/press586.php",
  },
  {
    label: "EIA: April 2026 STEO natural gas and LNG exports",
    url: "https://www.eia.gov/outlooks/steo/report/natgas.php?intent_instrument=sso",
  },
  {
    label: "USGS: Mineral Commodity Summaries 2026 - Helium and Rare Gases",
    url: "https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-helium.pdf",
  },
  {
    label: "C&EN: Iran war threatens global helium supply",
    url: "https://cen.acs.org/business/specialty-chemicals/Iran-war-threatens-global-helium/104/web/2026/03",
  },
  {
    label: "Axios: Iran war deflates critical helium production supplies",
    url: "https://www.axios.com/2026/04/07/iran-war-qatar-helium-production",
  },
  {
    label: "The Fertilizer Institute: Fertilizer and the Middle East Conflict",
    url: "https://www.tfi.org/wp-content/uploads/2026/03/Fertilizer-and-the-Middle-East-Conflict-2.pdf",
  },
  {
    label: "C&EN: Strait of Hormuz closure hits Asia's chemical industry",
    url: "https://cen.acs.org/business/petrochemicals/Strait-Hormuz-closure-hits-Asias/104/web/2026/03",
  },
  {
    label: "CRS: Iran Conflict and the Strait of Hormuz - Impacts on Oil, Gas, and Other Commodities",
    url: "https://s3.documentcloud.org/documents/27877929/crs-on-strait-of-hormuz.pdf?t=1773423495437",
  },
  {
    label: "Reuters via Finance & Commerce: Iran war may disrupt semiconductor materials",
    url: "https://finance-commerce.com/2026/03/iran-war-semiconductor-materials-supply-chip-industry/",
  },
  {
    label: "World Economic Forum: Nine commodities affected by the Hormuz crisis",
    url: "https://www.weforum.org/stories/2026/04/beyond-oil-lng-commodities-impacted-closure-hormuz-strait/",
  },
];

export const metadata = {
  slug: "2026-04-14-iran-war-hidden-materials-bill-helium-fertilizer",
  title:
    "The Iran War's Hidden Materials Bill: Helium, Fertilizer, Plastics, and Oil",
  description:
    "A dated supply-chain map of materials exposed by the Iran war and Hormuz disruption: helium, LNG, oil products, fertilizer inputs, sulfur, naphtha, methanol, aluminum, and semiconductor watch items.",
  excerpt:
    "A dated supply-chain map of materials exposed by the Iran war and Hormuz disruption: helium, LNG, oil products, fertilizer inputs, sulfur, naphtha, methanol, aluminum, and semiconductor watch items.",
  tags: [
    "Iran War",
    "Materials",
    "Helium",
    "Fertilizer",
    "Energy",
    "Supply Chains",
  ],
  datePublished: "2026-04-14",
  dateModified: "2026-04-14",
  image: "/media/blogwordcloud.png",
  readingTime: "~8 min",
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
  fontSize: "0.96rem",
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
            As of April 14, 2026, this is not just an oil story. Oil is the
            headline because everyone understands the petrol pump. The more useful
            map is the materials map.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          The Iran war and the Strait of Hormuz disruption have exposed a basic
          lesson: a chokepoint does not carry only one commodity. It carries the
          invisible ingredients of hospitals, chip fabs, farms, plastic packaging,
          paint, construction, batteries, shipping, and food bills.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          So the right question is not "what is Iran exporting?" The better
          question is: what materials from the Gulf region, and what materials
          routed through Hormuz, become fragile when the waterway stops behaving
          like a normal trade lane?
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}
        >
          The materials ledger
        </Typography>
        <Typography variant="body1" sx={mutedTextSx}>
          This table separates the headline material from the downstream thing that
          actually hits life and industry.
        </Typography>
        <TableContainer
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(148, 163, 184, 0.25)",
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Material</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Why exposed</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Where it shows up</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Current signal</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>My read</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materialRows.map((row) => (
                <TableRow key={row.material}>
                  <TableCell sx={{ ...tableCellSx, fontWeight: 700 }}>
                    {row.material}
                  </TableCell>
                  <TableCell sx={tableCellSx}>{row.exposure}</TableCell>
                  <TableCell sx={tableCellSx}>{row.downstream}</TableCell>
                  <TableCell sx={tableCellSx}>{row.signal}</TableCell>
                  <TableCell sx={tableCellSx}>{row.read}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}
        >
          The important distinction
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Do not put every row in the same panic bucket. Oil and refined products
          are immediate price shocks. Helium is a small-market bottleneck with
          ugly substitution problems. Fertilizer is a food-production risk that
          moves through seasons. Petrochemicals are a manufacturing and inventory
          story. Aluminum and specialty chip inputs are watchlist items unless the
          disruption persists or physical damage deepens.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            The war premium is not one price. It is a stack: fuel, freight,
            insurance, inventory, substitute sourcing, plant downtime, and finally
            the consumer price that arrives after everyone has explained why it was
            unavoidable.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}
        >
          What to watch next
        </Typography>
        <Box
          component="ul"
          sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.35 }}
        >
          {watchList.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}
        >
          The India angle
        </Typography>
        <Box
          component="ul"
          sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.35 }}
        >
          {indiaAngle.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          In other words, this is not a separate foreign policy file sitting far
          away from the household ledger. If it lasts, it can walk from Hormuz to
          the farm, the factory, the hospital, and the petrol pump.
        </Typography>
      </Box>

      <Box component="section" sx={sectionSx}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700 }}
        >
          Sources and dates
        </Typography>
        <Typography variant="body1" sx={mutedTextSx}>
          I am anchoring this post to dated sources because war, commodity prices,
          and shipping restrictions age quickly.
        </Typography>
        <Box
          component="ul"
          sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.2 }}
        >
          {sources.map((source) => (
            <Typography key={source.url} component="li" variant="body1" sx={bodyTextSx}>
              <Link
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                underline="hover"
              >
                {source.label}
              </Link>
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
