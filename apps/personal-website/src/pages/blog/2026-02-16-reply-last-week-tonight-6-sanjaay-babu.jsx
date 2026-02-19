import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-02-16-reply-last-week-tonight-6-sanjaay-babu",
  title: "Reply: Last Week Tonight #6 (Sanjaay Babu)",
  description:
    "A reply to Sanjaay’s latest post, with a practical take on AI-led work transitions, compensation policy, and why mother-tongue education is still the strongest foundation for inclusive learning.",
  excerpt:
    "A reply to Sanjaay’s latest post, with a practical take on AI-led work transitions, compensation policy, and why mother-tongue education is still the strongest foundation for inclusive learning.",
  tags: ["reply", "ai", "future of work", "policy", "language", "india"],
  datePublished: "2026-02-16",
  dateModified: "2026-02-16",
  image:
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80",
  readingTime: "~4 min",
};

const title = "Reply: Last Week Tonight #6 (Sanjaay Babu)";

const sourceUrl = "https://www.sanjaaybabu.com/writing/last-week-tonight-6";

const tags = ["reply", "ai", "future of work", "policy", "language", "india"];

const topic1Points = [
  "Use AI to amplify human judgment, not erase it. If AI takes over repetitive tasks, we should call that a shift toward higher-trust roles like design, mentoring, negotiation, care, and oversight.",
  "The compensation question is a social design challenge, not an ideological one-day war. Capitalism and socialism are both asking the right thing: who deserves the gains when output grows without matching payroll growth?",
  "A universal floor is still useful, but it should be part of a bigger stack: wage support, retraining guarantees, and ownership-sharing from high-productivity systems.",
];

const compensationLevers = [
  "AI productivity levy: a small share of rents from frontier compute, frontier-model APIs, and high-margin automation profits.",
  "Compute and data-infrastructure dividends: taxing energy-demanding capacity and high-value data extraction where network effects and public data are involved.",
  "Insurance-style transition design: automatic wage-loss cushions, reskilling stipends, and a time-limited top-up for displaced workers.",
  "Public-value condition: tax incentives should reward firms that prove worker-upskilling and local job creation, not just cost-cutting.",
];

const topic3Takeaways = [
  "Language is not just communication; it is identity, confidence, and access.",
  "Mother-tongue-based learning should remain the foundation, because it lowers cognitive load and preserves dignity.",
  "Global languages should be added as a bridge, not a replacement.",
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

      <Box component="section">
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
        <Typography variant="body1" sx={{ ...bodyTextSx, mt: 1.5 }}>
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
      </Box>

      <Box component="section">
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          What I’m responding to from your post
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography component="li" variant="body1" sx={bodyTextSx}>
            “Let’s say AI becomes highly capable in a few years. What happens to
            work, and how do we compensate people under different economic
            systems?”
          </Typography>
          <Typography component="li" variant="body1" sx={bodyTextSx}>
            “If we choose universal basic income, where will the funds come from?
            One idea is taxing AI more heavily.”
          </Typography>
          <Typography component="li" variant="body1" sx={bodyTextSx}>
            “Mother-tongue education remains best:
            தாய் மொழியில் கற்பது சால சிறந்தது.”
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Topic 1 — AI, Work, and Compensation
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            “This week I wondered whether AI data-center energy demand will rise sharply as model training scales, and what push/pull factors might force a structural change in AI infrastructure.”
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "var(--mui-palette-text-secondary)" }}>
            — Sanjaay Babu
          </Typography>
        </Box>
        <Typography variant="body1" sx={sectionIntroSx}>
          Short answer: if AI scales fast, work won’t vanish; the composition of work will change. The big shift is from repetitive task execution to judgment-rich, human-relational, and governance-heavy roles.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, mt: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {topic1Points.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Typography variant="h3" sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, fontWeight: 600, mt: 1 }}>
          Where UBI money can come from (without breaking the state)
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          This has to be narrow and practical. Here is a workable fiscal stack:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, mt: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {compensationLevers.map((lever) => (
            <Typography key={lever} component="li" variant="body1" sx={bodyTextSx}>
              {lever}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Topic 3 — Language and Learning
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            “What role does language have in decolonization? This week, in my class on development in Africa, we had a guest speaker on language debates in Africa. At the point of decolonization, African writers had to wrestle with the question: what language should we write in?”
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "var(--mui-palette-text-secondary)" }}>
            — from your language section
          </Typography>
        </Box>
        <Typography variant="body1" sx={sectionIntroSx}>
          I agree strongly. Foundational schooling is most effective when ideas land first in the language of thought, not the language of trade.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, mt: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {topic3Takeaways.map((takeaway) => (
            <Typography key={takeaway} component="li" variant="body1" sx={bodyTextSx}>
              {takeaway}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          In short: keep mother tongue as the cognitive base, add global languages as the export bridge, and design education to expand both confidence and future mobility.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            A small language note from this week:
            I learned “Forza” from Jannik Sinner and “Vamos” from Rafa Nadal.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
