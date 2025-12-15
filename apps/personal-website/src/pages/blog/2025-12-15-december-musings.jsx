import { Box, Typography, Stack, Paper, Link } from "@mui/material";
import { useColorMode } from "../../providers/ColorModeProvider";

export default function BlogPost() {
  const { mode } = useColorMode();
  const isDark = mode === "dark";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          component="img"
          src="https://img.shields.io/badge/December_musings-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="December musings badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Margazhi_music-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Margazhi music badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/aviation-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="aviation badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/mental_models-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="mental models badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
      </Box>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.875rem", md: "2.5rem" },
            fontWeight: 700,
            lineHeight: 1.2,
            color: "text.primary",
          }}
        >
          Blog post topics hints: December musings
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
          }}
        >
          December and Marghazhi music season
        </Typography>
        <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            The Music academy is inviting AR Rahman to inaugurate this season and I seem accepting the fact that they need to cater to broader audiences - if they want the youngsters to attend.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Bands of Cooum is also being slated for performance - that&apos;s a huge surprise to me.
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
          }}
        >
          Janaki patti is spamming me
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.primary" }}
        >
          Janaki patti is spamming me these days -but I end up reading their newsletter, maybe I love the retro feel. I think the Gen Z in her family is taking this e-commerce initiative to next level with nifty mobile apps and shipping mixture, murukku, athirasam all over the world
        </Typography>
        <Box
          component="img"
          src="/media/SKC_JanakiPatti.png"
          alt="SKC Janaki Patti snacks shipping worldwide"
          loading="lazy"
          decoding="async"
          sx={{
            width: "100%",
            height: "auto",
            maxWidth: "100%",
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) => (isDark ? theme.shadows[8] : theme.shadows[3]),
          }}
        />
        <Stack spacing={1}>
          <Link
            href="https://drive.google.com/file/d/1Vb_ftOnDw8uUOEtZaXNOM318qarGv1Yu/view"
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{
              fontSize: "0.95rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              📮
            </Box>
            Open the SKC Janaki Patti newsletter (Google Drive)
          </Link>
        </Stack>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
          }}
        >
          On Indigo saga my 2 cents.
        </Typography>
        <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            I know this clear in my mind - you can choose only one of these 2 - Price or Quantity. So India wanted desperately a Low Cost Airline ( LCA) in they did that t well, common man could fly due to lower price points and they are at 65% market share - almost a monopoly. Their ontime record is fantastic and got us from Place A to B with no frills.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            The moot point is you need scaling to achieve efficiency and it&apos;s the government which is responsible for putting checks and balances in place. We know with the kind of corruption prevalent in our country - things just won&apos;t get monitored and rules/policies enforced. That&apos;s the root of the problem
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            But having another 10 more airlines is THE solution? How that can make viable business for everyone.
          </Typography>
        </Stack>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2.25,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
          }}
        >
          A clean, no-nonsense summary of PolymathInvestor&apos;s framework on &quot;how to understand anything&quot;
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.primary" }}
        >
          It&apos;s less about memorization and more about building mental leverage. Crisp take:
        </Typography>

        <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Start with the why: what problem exists and what breaks if it didn&apos;t?
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Reduce to primitives: inputs, processes, outputs, constraints, incentives.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Find the lever: the one variable experts obsess over that swings outcomes.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Think in models, not facts: incentives, feedback loops, trade-offs, second-order effects.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Teach it simply: if you can&apos;t explain it to a smart 12-year-old in 3–5 sentences, you don&apos;t own it yet.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Cut noise: ignore opinions/headlines; trust data, structure, incentives, and long-term dynamics.
          </Typography>
        </Stack>

        <Typography
          variant="body1"
          sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}
        >
          One-liner: Understand the problem → reduce to primitives → identify incentives → apply models → explain it back.
        </Typography>
      </Paper>
    </Box>
  );
}
