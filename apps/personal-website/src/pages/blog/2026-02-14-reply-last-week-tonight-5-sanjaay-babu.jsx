import { Box, Typography } from "@mui/material";

const title = "Reply: Last Week Tonight #5 (Sanjaay Babu)";

const sourceUrl = "https://www.sanjaaybabu.com/writing/last-week-tonight-5";

const tags = ["reply", "notes", "tech", "future"];

const positionStatement =
  "My take: this is exactly why AI data centers will move to space. Put heavy training clusters off-Earth, while keeping low-latency inference closer to users.";

const whyPlausible = [
  "For AI training clusters, space solves one bottleneck brutally well: heat rejection (radiators + vacuum physics), a core limiter for dense compute.",
  "If launch costs keep sliding and power gets solved (solar, nuclear, beamed power), large AI compute farms become a location problem, not a land problem.",
];

const watching = [
  "Power: where does the steady baseload come from?",
  "Maintenance: robotics + modular replacement needs to be boringly reliable.",
  "Latency: some workloads can live with it (batch training), others cannot (interactive inference).",
];

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-primary)",
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
        <Box
          sx={{
            borderLeft: "4px solid var(--mui-palette-primary-main)",
            pl: 2,
            py: 0.5,
            backgroundColor: "var(--mui-palette-action-hover)",
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" sx={bodyTextSx}>
            "Data centers have created a huge demand for energy; in fact, in parts of the US, this is creating a huge uproar, because high energy use by data centers have resulted in energy prices surging in rural parts of the US where most data centers have located."
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--mui-palette-text-secondary)", mt: 0.5 }}
          >
            - Sanjaay Babu
          </Typography>
        </Box>
        <Typography variant="body1" sx={bodyTextSx}>
          {positionStatement}
        </Typography>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 2,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Why This Makes AI Data Centers in Space Plausible
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {whyPlausible.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 2,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          What I&apos;m Watching
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {watching.map((item) => (
            <Typography key={item} component="li" variant="body1" sx={bodyTextSx}>
              {item}
            </Typography>
          ))}
        </Box>
      </Box>

    </Box>
  );
}
