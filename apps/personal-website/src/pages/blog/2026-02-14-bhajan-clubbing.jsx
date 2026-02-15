import { Box, Typography } from "@mui/material";

const title = "Bhajan Clubbing";

const publishedDate = "February 14, 2026";

const videoUrl = "https://youtu.be/nVx-6ICOEf0?si=2MTyIK3rCCvJu1br";
const videoTitle =
  "Agam - Ashutosh Shashank Shekhar | Shiv Stuti at Kashi - Banaras - Varanasi | Maha Shiv Ratri 2026";
const singerName = "Agam Aggarwal";
const singerImageUrl = "https://i.ytimg.com/vi/nVx-6ICOEf0/hqdefault.jpg";

const reflection =
  "It keeps the spiritual center of a bhajan intact, but the sonic framing is modern and kinetic, so I do not just listen, I physically feel pulled into it. The contrast between devotion and pulse makes it hit me in a way that feels both rooted and new at the same time.";

const indiaContextPoints = [
  "Identity blend: many of us grew up with bhajans at home, but we now consume global beat-driven music all day, so this fusion feels natural.",
  "Short-video fit: the hook lands fast, which works perfectly for reels and quick shares across Instagram and YouTube Shorts.",
  "Low-friction familiarity: the devotional core feels emotionally safe and culturally familiar even when the arrangement is club-style.",
  "Collective energy: in college events, friend groups, and festival spaces, this format gives both dance energy and a sense of rootedness.",
];

const sivasriNotes = [
  "When Sivasri Skandaprasad walks onto stage to pick up the சப்பளாக்கட்டை (chapplakattai), the energy in the room changes immediately.",
  "She locks the rhythm, then sit tight and she will enter into trace mode — it becomes harder to stand still than to move with it.",
  "Listen for 'Thondi Sariya' in the /music playlist right after this post to stay in that momentum.",
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
        <Box
          component="a"
          href={videoUrl}
          target="_blank"
          rel="noreferrer noopener"
          sx={{
            textDecoration: "none",
            color: "inherit",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid var(--mui-palette-divider)",
            backgroundColor: "var(--mui-palette-background-paper)",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
            transition: "transform 180ms ease, box-shadow 180ms ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.16)",
            },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={singerImageUrl}
              alt={`${singerName} performance visual`}
              loading="lazy"
              decoding="async"
              sx={{
                width: "100%",
                aspectRatio: "16 / 9",
                objectFit: "cover",
                display: "block",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                background:
                  "linear-gradient(to top, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.2) 45%, rgba(15,23,42,0.05) 100%)",
                p: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  letterSpacing: 0.3,
                }}
              >
                ▶ Watch on YouTube
              </Typography>
            </Box>
          </Box>
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "var(--mui-palette-text-primary)", fontWeight: 700 }}
            >
              {videoTitle}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--mui-palette-text-secondary)" }}
            >
              Singer: {singerName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "var(--mui-palette-text-secondary)" }}
            >
              Click to open the full video
            </Typography>
          </Box>
        </Box>

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

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          Live scene: Sivasri Skandaprasad
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {sivasriNotes.map((point) => (
            <Typography key={point} component="li" variant="body1" sx={bodyTextSx}>
              {point}
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
