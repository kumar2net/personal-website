import { Box, Typography, Stack, Paper } from "@mui/material";
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
          src="https://img.shields.io/badge/X_wrapped-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="X wrapped badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/accountability-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="accountability badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/AI_ethics-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="AI ethics badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/minimalism-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="minimalism badge"
          loading="lazy"
          decoding="async"
          sx={{ height: 28, width: "auto" }}
        />
        <Box
          component="img"
          src="https://img.shields.io/badge/Tamil_voice-2563EB?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Tamil voice badge"
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
          Your 2025 X Wrapped, @kumar2net! 🎉
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary" }}
        >
          What a year on X, Kumar! As an AI enthusiast, minimalist warrior, and no-nonsense fighter for accountability, you've kept things real in 2025. Here's your personalized recap (based on your activity up to mid-December):
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          📊 By the Numbers
        </Typography>
        <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            **Posts this year**: Around 80+ (mostly replies and threads – you're all about engaging!).
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            **Top engagement month**: Early December – your threads on corporate grievances lit up the timeline.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            **Most active topics**: AI tools & ethics (30%+ of posts), customer service battles (banks, insurers, telecom – 40%+), health/minimalism vibes, and sustainable tech critiques.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            **Likes received**: Modest but meaningful – your candid takes resonate with those who feel the same frustrations.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
            **Your style**: Direct, tagged the big players (@narendramodi, @ICICILombard, @Airtel_Presence, @OpenAI folks), and mixed English with Tamil flair.
          </Typography>
        </Stack>
      </Paper>

      <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          🔥 Top Themes of 2025
        </Typography>
        <Stack spacing={2}>
          <Paper
            elevation={1}
            sx={{
              p: { xs: 2.25, md: 2.75 },
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              1. **Fighting the System** 💪
            </Typography>
            <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                You went hard on corporate accountability – especially health insurance delays (shoutout to your multi-post threads tagging PMO, Finance Minister, and IRDAI). Highlights:
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Epic escalation against @ICICILombard for claim delays: "Why are you putting us patients to such hardship?"
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Airtel spam calls & Amazon bill notifications: Calling out privacy/security lapses loud and clear.
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Bank/FD/maturity headaches: Demanding real-time dashboards and CEO-level fixes.
              </Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: { xs: 2.25, md: 2.75 },
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              2. **AI Enthusiast Mode** 🤖
            </Typography>
            <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                True to your bio, you championed practical, ethical AI:
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Big love for Codex CLI + Vim: "Got rid of IDEs – just Codex CLI and Vim." (Multiple shouts, including fixing Vercel issues).
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Feedback to OpenAI: Praised iterative dev but roasted Tamil TTS pronunciation.
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Sustainable AI advocate: "Do NOT spend compute on frivolous stuff... use it for drug discovery."
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Inspired by "Thinking Machines" doc – even asked AI about protein folding for your meds.
              </Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: { xs: 2.25, md: 2.75 },
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.2rem", md: "1.35rem" },
                fontWeight: 700,
                mb: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              3. **Other Gems** 🌟
            </Typography>
            <Stack spacing={1.25} component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Health & minimalism: Critiqued influencers, praised rituals for gut health.
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Random wins: Congrats to Praggnanandhaa in Tamil ("தூள் கிளப்புங்க ப்ராக்"), well-said to Shashi Tharoor on English in India.
              </Typography>
              <Typography component="li" variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
                Blog plugs: Sharing your thoughts on walking the talk with AI.
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          bgcolor: isDark ? "rgba(144, 202, 249, 0.08)" : "rgba(37, 99, 235, 0.08)",
          border: (theme) => `1px dashed ${theme.palette.primary.main}`,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          🏆 Your Most "You" Post of 2025
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.0625rem", lineHeight: 1.8, mb: 1 }}
        >
          Your latest one sums up the fighter spirit:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.0625rem",
            lineHeight: 1.8,
            mb: 1,
            fontStyle: "italic",
          }}
        >
          "How is the amazon app notification saying my Airtel post paid bill due amount and date @Airtel_Presence What kind of security is this?"
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          (Classic Kumar: Spotting the issue, tagging for accountability, zero chill.)
        </Typography>
      </Paper>

      <Paper
        elevation={1}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.375rem", md: "1.75rem" },
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          🎯 2025 Vibe Check
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.primary", mb: 1.5 }}
        >
          You posted with purpose – calling out BS in tech, finance, and daily life while geeking out on sustainable AI. Low on fluff, high on impact. If X had a "Most Relentless Advocate" award, you'd win it.
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}
        >
          Keep fighting back in 2026! What's your biggest goal for next year – better TTS in Tamil, faster claim settlements, or AGI for good? 🚀
        </Typography>
      </Paper>
    </Box>
  );
}
