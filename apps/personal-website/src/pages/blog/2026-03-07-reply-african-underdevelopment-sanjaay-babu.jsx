import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-03-07-reply-african-underdevelopment-sanjaay-babu",
  title: "Reply: What Explains African Economic Underdevelopment? (Sanjaay Babu)",
  description:
    "A direct reply to Sanjaay Babu's essay: colonialism is a strong diagnosis, but the more useful question is what breaks dependence now through joint capacity, especially in pharmaceuticals and digital public infrastructure.",
  excerpt:
    "A direct reply to Sanjaay Babu's essay: colonialism is a strong diagnosis, but the more useful question is what breaks dependence now through joint capacity, especially in pharmaceuticals and digital public infrastructure.",
  tags: ["Reply", "Africa", "Colonialism", "Development", "Institutions", "Policy"],
  datePublished: "2026-03-07",
  dateModified: "2026-03-07",
  image: "/media/blogwordcloud.png",
  readingTime: "~6 min",
};

const title = "Reply: What Explains African Economic Underdevelopment? (Sanjaay Babu)";

const sourceUrl = "https://www.sanjaaybabu.com/writing/african-underdevelopment-colonialism";

const tags = ["Reply", "Africa", "Colonialism", "Development", "Institutions", "Policy"];

const agreementPoints = [
  "He is right to put extractive colonial design at the center. If an economy is built to ship out raw material and import finished goods, weak value addition is not an accident.",
  "He is also right that colonial rule damaged trust and institutional depth. Divide-and-rule politics does not disappear when the flag changes.",
  "The neo-colonial part matters too. Aid, debt, and outside policy pressure can preserve dependence even after formal empire ends.",
];

const sharperFrame = [
  "Colonialism is a strong root-cause argument. It is not a complete present-tense explanation. Africa is not one economy, and the continent should not be discussed as if it has one outcome.",
  "The harder question is persistence. Why do some states build more capacity than others after the same broad historical shock? That is where elite incentives, state discipline, infrastructure, and industrial policy enter.",
  "If colonialism explains everything, agency quietly disappears. That is analytically weak and politically dangerous.",
];

const practicalMoves = [
  "Move from diagnosis to sector choice. Pick a few areas where more of the value chain can stay local: pharmaceuticals, agro-processing, minerals refining, and light manufacturing.",
  "Protect learning for a period, but tie it to performance. Tariffs without power, ports, and execution only create expensive stagnation.",
  "Build regional markets, logistics, and payments so firms can scale before they are thrown into a global knife fight.",
  "Treat foreign capital as a negotiation, not salvation. Ask harder questions on local procurement, technology transfer, and who keeps the margin.",
];

const sectorCards = [
  {
    title: "1. Pharmaceuticals",
    why:
      "This is the cleanest fit. Africa needs reliable medicine access and stronger local production. India already knows how to make quality generics at scale.",
    metrics: [
      "Africa still imports 70%-100% of medicines and 99% of vaccines, based on the World Health Organization African regional framework published in 2024.",
      "India exported about $3.93 billion of pharmaceuticals to Africa in FY 2024-25, and Africa accounted for 12.91% of India's total pharma exports, according to Pharmexcil's 2025 handbook.",
      "Pharmexcil estimates Africa's generic-drug market at about $12 billion.",
    ],
    move:
      "The right move is not export dependence forever. It is joint ventures in formulation plants, quality labs, regulatory training, cold-chain systems, and hospital supply chains.",
    upside:
      "Even a 10% share of a $12 billion generic market implies about $1.2 billion in annual business. That $1.2 billion is scenario math, not a forecast.",
  },
  {
    title: "2. Digital Public Infrastructure and Fintech",
    why:
      "India has built interoperable public rails. Africa has built real last-mile adoption in digital payments. Put them together and the result can be larger than either side working alone.",
    metrics: [
      "As of February 6, 2026, India had signed Memoranda of Understanding on digital public infrastructure with 23 countries, including 6 in Africa: Sierra Leone, Tanzania, Kenya, Ethiopia, Gambia, and Lesotho.",
      "India's Unified Payments Interface (UPI) processed 1,867.7 crore transactions in April 2025, worth Rs 24.77 lakh crore, according to the Press Information Bureau.",
      "GSMA says Africa had about 1.1 billion registered mobile-money accounts, 286 million active 30-day accounts, and around $1.1 trillion in transaction value in 2024.",
    ],
    move:
      "The leverage point is cross-border retail payments, merchant acceptance, digital identity layers, and lower-cost compliance rails for small businesses and diaspora money.",
    upside:
      "If India-linked rails touch even 5% of Africa's current $1.1 trillion mobile-money flow, that is about $55 billion in annual payment volume. Again, that is scenario math, not a forecast.",
  },
];

const sources = [
  {
    label: "World Health Organization African Region: local production framework (2024)",
    url: "https://www.afro.who.int/sites/default/files/2024-08/AFR-RC74-6%20Framework%20for%20strengthening%20local%20production%20of%20medicines%20vaccines%20and%20other%20health%20technologies%20in%20the%20WHO%20African%20Region.pdf",
  },
  {
    label: "Pharmexcil Handbook FY 2024-25 / 2025 export data",
    url: "https://pharmexcil.com/uploadfile/Hand_Book_14_06_2025_final.pdf",
  },
  {
    label: "Pharmexcil Africa market note",
    url: "https://pharmexcil.com/circulars/viewcirculars/12124/5eee40e303a648e326c3aed83550c00c.html",
  },
  {
    label: "Press Information Bureau: DPI partnerships as of February 6, 2026",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224505",
  },
  {
    label: "Press Information Bureau: UPI April 2025 scale",
    url: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/jun/doc2025612568801.pdf",
  },
  {
    label: "GSMA State of the Industry Report 2025",
    url: "https://www.gsma.com/sotir/wp-content/uploads/2025/04/The-State-of-the-Industry-Report-2025_English.pdf",
  },
];

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-primary)",
};

const sectionIntroSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-secondary)",
};

const calloutSx = {
  borderLeft: "4px solid var(--mui-palette-primary-main)",
  pl: 2,
  py: 1.5,
  backgroundColor: "var(--mui-palette-action-hover)",
  borderRadius: 1,
};

const cardSx = {
  border: "1px solid var(--mui-palette-divider)",
  borderRadius: 2,
  p: { xs: 2, md: 3 },
  backgroundColor: "var(--mui-palette-background-paper)",
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

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.5rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          {title}
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Source:{" "}
          <Box
            component="a"
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            sx={{ color: "inherit" }}
          >
            {sourceUrl}
          </Box>
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            A good diagnosis is not yet a treatment plan.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          I think Sanjaay is broadly right. Colonialism did not simply hurt
          Africa once and vanish. It shaped trade patterns, state structure, and
          the very language of development. But once we say that, the next
          question has to be practical: what breaks the dependency loop now?
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What I agree with
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The core diagnosis holds. Three parts of his argument are especially strong.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {agreementPoints.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Where I would sharpen it
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          My only push is this: root cause is not the same as full explanation.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {sharperFrame.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What that means in practice
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The useful debate is no longer whether colonialism mattered. It did. The useful
          debate is how countries convert that history into a build agenda.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {practicalMoves.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          I liked his closing optimism on pharmaceuticals. That is the right
          instinct. Development becomes real when more capability, more margin,
          and more bargaining power stay closer to home.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            The real decolonization move is not rhetorical. It is industrial.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Two sectors India and Africa can build together
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          As of March 7, 2026, two sectors stand out above the rest: pharmaceuticals and
          digital public infrastructure. One builds health sovereignty. The other builds
          transaction sovereignty.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {sectorCards.map((sector) => (
            <Box key={sector.title} sx={cardSx}>
              <Typography
                variant="h3"
                sx={{ fontSize: { xs: "1.3rem", md: "1.55rem" }, fontWeight: 600, mb: 1.5 }}
              >
                {sector.title}
              </Typography>
              <Typography variant="body1" sx={bodyTextSx}>
                {sector.why}
              </Typography>
              <Box
                component="ul"
                sx={{ m: 0, pl: 3, pt: 2, display: "flex", flexDirection: "column", gap: 1.25 }}
              >
                {sector.metrics.map((metric) => (
                  <Typography key={metric} component="li" variant="body1" sx={bodyTextSx}>
                    {metric}
                  </Typography>
                ))}
              </Box>
              <Typography variant="body1" sx={{ ...bodyTextSx, mt: 2 }}>
                {sector.move}
              </Typography>
              <Box sx={{ ...calloutSx, mt: 2 }}>
                <Typography variant="body1" sx={bodyTextSx}>
                  {sector.upside}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The strategic point
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          India should not approach Africa with aid language. Africa should not approach India
          as another distant supplier. The serious frame is joint capacity. In pharma, that means
          moving from import dependence to co-production. In digital infrastructure, that means
          moving from fragmented payments to interoperable rails that small businesses can actually
          use.
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          If colonialism extracted value by separating raw capability from final value capture,
          then a modern answer has to do the opposite. Keep more capability local. Keep more
          margin local. Keep more bargaining power local.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Sources
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          Numbers above were verified on March 7, 2026 from the following official or primary
          sources.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {sources.map((source) => (
            <Typography key={source.url} component="li" variant="body1" sx={bodyTextSx}>
              <Box
                component="a"
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                sx={{ color: "inherit" }}
              >
                {source.label}
              </Box>
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
