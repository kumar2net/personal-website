import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-03-07-reply-african-underdevelopment-sanjaay-babu",
  title: "Reply: What Explains African Economic Underdevelopment? (Sanjaay Babu)",
  description:
    "A direct reply to Sanjaay Babu's essay: colonialism is a strong diagnosis, but the more useful question is what breaks dependence now through capacity, industry, and bargaining power.",
  excerpt:
    "A direct reply to Sanjaay Babu's essay: colonialism is a strong diagnosis, but the more useful question is what breaks dependence now through capacity, industry, and bargaining power.",
  tags: ["Reply", "Africa", "Colonialism", "Development", "Institutions", "Policy"],
  datePublished: "2026-03-07",
  dateModified: "2026-03-07",
  image: "/media/blogwordcloud.png",
  readingTime: "~4 min",
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
    </Box>
  );
}
