import { Box, Typography } from "@mui/material";

export const metadata = {
  slug: "2026-03-17-reply-cortisol-ashwagandha-sanjaay-babu",
  title: "Reply: Cortisol, Ashwagandha, and a More Careful Frame (Sanjaay Babu)",
  description:
    "A calm reply to Sanjaay Babu's cortisol essay: ashwagandha is not well described as pure quack, but it also should not be presented as a routine cortisol tool given small heterogeneous trials and a real liver-injury signal.",
  excerpt:
    "A calm reply to Sanjaay Babu's cortisol essay: ashwagandha is not well described as pure quack, but it also should not be presented as a routine cortisol tool given small heterogeneous trials and a real liver-injury signal.",
  tags: ["Reply", "Health", "Cortisol", "Ashwagandha", "Evidence", "Liver Safety"],
  datePublished: "2026-03-17",
  dateModified: "2026-03-17",
  image: "/media/blogwordcloud.png",
  readingTime: "~4 min",
};

const title = "Reply: Cortisol, Ashwagandha, and a More Careful Frame (Sanjaay Babu)";

const sourceUrl = "https://www.sanjaaybabu.com/writing/cortisol";

const tags = ["Reply", "Health", "Cortisol", "Ashwagandha", "Evidence", "Liver Safety"];

const agreementPoints = [
  "The post is strongest when it stays with low-risk interventions: light, exercise timing, food timing, and breathing.",
  "The broader idea is sensible too. Cortisol rhythm matters, and the goal should be energetic mornings and calmer evenings rather than vague stress talk.",
  "Where I would slow down is the jump from that framework to a supplement recommendation for a general audience.",
];

const cautionPoints = [
  "TheLiverDoc put the concern plainly in a public reply: 'What is much better documented, is that Ashwagandha can harm the liver.' The tone is sharp, but the underlying concern is not imaginary.",
  "The canonical source behind that warning is the 2023 Indian case series coauthored by Cyriac Abby Philips, which concluded that ashwagandha-related liver injury can lead to acute-on-chronic liver failure with high mortality in patients who already have chronic liver disease.",
  "That does not prove that every consumer is at major risk. It does mean a broad public protocol should not present ashwagandha as a casual evening fix without emphasizing the safety caveat.",
];

const balancedView = [
  "I do not think the cleanest evidence-based position is 'pure quack.' NCCIH says some ashwagandha preparations may be effective for stress and insomnia, which is more modest than online hype but not zero evidence.",
  "At the same time, the studies are small, the formulations vary, and certainty is still limited. A 2025 meta-analysis found significantly lower cortisol but no clear improvement in perceived stress.",
  "So the problem is not that ashwagandha has no biological effect. The problem is that the online framing often runs far ahead of what the evidence can actually support.",
];

const practicalFrame = [
  "For a general reader, I would keep the protocol centered on light exposure, exercise, sleep timing, and breathing practices. Those are the parts with the best risk-reward profile.",
  "If ashwagandha is mentioned at all, I would present it as optional, short-term, formulation-dependent, and inappropriate for some people, especially those with liver disease, pregnancy, thyroid issues, autoimmune disease, or significant medication overlap.",
  "In other words: not pure quack, not a cleanly proven cortisol hack, and not something I would normalize casually in an evening checklist.",
];

const sources = [
  {
    label: "Sanjaay Babu: 7 cortisol tips and protocols to have energetic days and restful nights",
    url: "https://www.sanjaaybabu.com/writing/cortisol",
  },
  {
    label: "TheLiverDoc public post snapshot on ashwagandha",
    url: "https://mobile.twstalker.com/theliverdoc",
  },
  {
    label: "Philips et al. (2023), Ashwagandha-induced liver injury: a case series from India and literature review",
    url: "https://pubmed.ncbi.nlm.nih.gov/37756041/",
  },
  {
    label: "NCCIH: Ashwagandha - usefulness and safety",
    url: "https://www.nccih.nih.gov/health/ashwagandha",
  },
  {
    label: "2025 meta-analysis: significant cortisol reduction but no clear effect on perceived stress",
    url: "https://pubmed.ncbi.nlm.nih.gov/40746175/",
  },
  {
    label: "TGA safety advisory on Withania somnifera (ashwagandha)",
    url: "https://www.tga.gov.au/safety/about-market-actions/product-alert-market-actions/medicines-containing-withania-somnifera-withania-ashwagandha",
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
            "Ashwagandha: Shown to reduce cortisol levels by 11-29%."
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "var(--mui-palette-text-secondary)" }}>
            - Sanjaay Babu, "7 cortisol tips and protocols to have energetic days and restful nights"
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          I liked the practical spirit of this essay, especially the emphasis on light,
          exercise, food timing, and breathing. Those are the parts with the cleanest
          risk-reward profile. The one place I would soften is the recommendation of
          ashwagandha as an evening cortisol tool.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Where I agree
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The broader cortisol framework is useful. My push is narrow, not total.
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
          Why I would treat ashwagandha more carefully
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          The strongest caution is not a vibe-war between systems of medicine. It is a safety signal.
        </Typography>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            "What is much better documented, is that Ashwagandha can harm the liver."
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "var(--mui-palette-text-secondary)" }}>
            - Cyriac Abby Philips (TheLiverDoc), public post snapshot
          </Typography>
        </Box>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {cautionPoints.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Box sx={calloutSx}>
          <Typography variant="body1" sx={bodyTextSx}>
            The paper&apos;s key line is that ashwagandha-related injury can "lead to the syndrome of acute-on-chronic liver failure with high mortality."
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: "var(--mui-palette-text-secondary)" }}>
            - Philips et al., Hepatology Communications (2023)
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          The evidence is mixed, not empty
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          That distinction matters. Overstatement in either direction makes the discussion worse.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {balancedView.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          How I would frame it instead
        </Typography>
        <Typography variant="body1" sx={sectionIntroSx}>
          For a general-audience post, caution should sit inside the recommendation itself.
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {practicalFrame.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          So my disagreement here is modest but important: ashwagandha may deserve a footnote,
          not a default place in the protocol.
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 600 }}>
          Sources
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
