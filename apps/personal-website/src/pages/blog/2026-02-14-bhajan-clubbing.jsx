import { Box, Typography } from "@mui/material";

const title = "Bhajan Clubbing";

const publishedDate = "February 14, 2026";

const videoUrl = "https://youtu.be/nVx-6ICOEf0?si=2MTyIK3rCCvJu1br";

const reflection =
  "It keeps the spiritual center of a bhajan intact, but the sonic framing is modern and kinetic, so I do not just listen, I physically feel pulled into it. The contrast between devotion and pulse makes it hit me in a way that feels both rooted and new at the same time.";

const indiaContextPoints = [
  "Identity blend: many of us grew up with bhajans at home, but we now consume global beat-driven music all day, so this fusion feels natural.",
  "Short-video fit: the hook lands fast, which works perfectly for reels and quick shares across Instagram and YouTube Shorts.",
  "Low-friction familiarity: the devotional core feels emotionally safe and culturally familiar even when the arrangement is club-style.",
  "Collective energy: in college events, friend groups, and festival spaces, this format gives both dance energy and a sense of rootedness.",
];

const bodyTextSx = {
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "var(--mui-palette-text-primary)",
};

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
        <Typography
          variant="body2"
          sx={{ color: "var(--mui-palette-text-secondary)" }}
        >
          {publishedDate}
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          Reference:{" "}
          <Box
            component="a"
            href={videoUrl}
            target="_blank"
            rel="noreferrer noopener"
            sx={{ color: "inherit" }}
          >
            {videoUrl}
          </Box>
        </Typography>
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Why this feels so different to me
        </Typography>
        <Typography variant="body1" sx={bodyTextSx}>
          {reflection}
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
          Why Gen Z and millennials in India connect with this
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {indiaContextPoints.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
