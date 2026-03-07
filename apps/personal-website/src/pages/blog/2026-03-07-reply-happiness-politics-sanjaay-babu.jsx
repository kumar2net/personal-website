import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-03-07-reply-happiness-politics-sanjaay-babu",
  title: "Reply: Happiness, Politics, and the Indian State (Sanjaay Babu)",
  description:
    "A reply to Sanjaay Babu's 'Happiness and Politics': if government should help citizens flourish, the Indian state at ground level is too often organized as the opposite of that ideal.",
  excerpt:
    "A reply to Sanjaay Babu's 'Happiness and Politics': if government should help citizens flourish, the Indian state at ground level is too often organized as the opposite of that ideal.",
  tags: ["Reply", "India", "Governance", "Happiness", "Policy", "State Capacity"],
  datePublished: "2026-03-07",
  dateModified: "2026-03-07",
  image: "/media/blogwordcloud.png",
  readingTime: "~4 min",
};

const title = "Reply: Happiness, Politics, and the Indian State (Sanjaay Babu)";

const sourceUrl = "https://www.sanjaaybabu.com/writing/happiness-1";

const tags = ["Reply", "India", "Governance", "Happiness", "Policy", "State Capacity"];

const agreementPoints = [
  "Politics should not stop at mere order. A decent state should widen the conditions for trust, dignity, and human flourishing.",
  "Citizenship cannot be only a bundle of rights. A republic needs some idea of mutual obligation and shared purpose.",
  "Public life becomes thin when government speaks only in the language of administration, GDP, and law-and-order.",
];

const groundLevelFailures = [
  "At street level, many Indians do not meet a caring republic. They meet queues, clerks, duplicate paperwork, brittle portals, missing records, and discretionary power.",
  "Too much of welfare delivery is built around suspicion. The citizen must repeatedly prove identity, eligibility, residence, and need, while exclusion is treated as an acceptable side effect.",
  "Too many public services are optimized for announcement value from the top and compliance from below. That is why the school, PHC, ration shop, police station, or municipal counter can feel extractive rather than enabling.",
  "That is the antithesis of a happiness-oriented politics. People do not flourish when ordinary contact with the state produces delay, humiliation, fear, and time loss.",
];

const practicalMoves = [
  "Make dignity a real policy metric. Track queue time, grievance-resolution time, learning outcomes, primary-care wait time, women's safety, walkability, and cleanliness alongside growth numbers.",
  "Shift from application-heavy welfare to entitlement delivery. If the state already has the data, the burden should move from citizen proof to state coordination.",
  "Professionalize the frontline. More teachers, nurses, caseworkers, and municipal staff matter more than another slogan. Capacity is not a side issue; it is the state.",
  "Create real local forums such as ward sabhas, gram sabhas, and citizen assemblies that feed into budgets and service priorities, not just ceremonial consultation.",
  "Reduce arbitrary discretion with simple service guarantees: one interface, clear deadlines, automatic escalation, and compensation when the state fails its own standard.",
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
            “Can we build societies that are not just functional and stable, but also thriving and happy?”
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "var(--mui-palette-text-secondary)" }}>
            — Sanjaay Babu, “Happiness and Politics”
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          I think that is the right question. The problem is that the Indian state, in its
          ordinary ground-level form, too often behaves like the opposite of that aspiration.
          It speaks the language of civilization and development from the top, but the citizen
          still meets paperwork, friction, opacity, and petty humiliation from below.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What I agree with
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          Sanjaay is right to push politics beyond bare stability.
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
          Where the Indian state becomes the antithesis
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The deepest contradiction is not philosophical. It is administrative.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {groundLevelFailures.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          A republic cannot seriously talk about well-being while making public life exhausting.
          If the day-to-day experience of the state is confusion and fatigue, then the state is
          not creating flourishing. It is consuming it.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What government should actually do
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The answer is not more rhetoric about civilization, culture, or national greatness. It is better statecraft.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {practicalMoves.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            A happiness-oriented state is not a bigger speech. It is a lower-friction daily life.
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          India does not need a philosopher-king. It needs a citizen-facing state that leaves
          people with more certainty, more dignity, and more trust after each interaction. That
          is the practical version of aspirational politics.
        </Typography>
      </Box>
    </Box>
  );
}
