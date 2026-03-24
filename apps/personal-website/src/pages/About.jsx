import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 16px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const principles = [
  "Ground truth before slideware.",
  "Utility before theater.",
  "Clarity is respect.",
  "User agency is non-negotiable.",
  "Privacy is a feature, not a footnote.",
  "Durable systems beat trend cycles.",
  "Local language and local context matter.",
];

const operatingPosture = [
  "If facts can change, verify and include dates.",
  "If a system hurts ordinary people, say it plainly.",
  "Prefer plain language over borrowed jargon.",
  "Use AI to remove toil, not thinking.",
  "Ship work another engineer can still maintain tomorrow.",
];

const recentWork = [
  "Building an AI-first personal publishing stack across blog posts, explainers, reusable skills, and YouTube shorts.",
  "Writing plain-language pieces on AI, energy, trade chokepoints, India Stack, and the infrastructure beneath digital life.",
  "Experimenting with lightweight React/Vite workflows that keep publishing fast, readable, and maintainable.",
  "Turning rough notes into compact, useful outputs instead of one-off content sludge.",
  "Keeping the work grounded in Indian, Tamil, and real-user contexts rather than imported hype.",
];

const xCauses = [
  {
    title: "Consumer rights in essential services",
    text: "I keep pushing for better grievance redressal in banking, insurance, telecom, and other systems people cannot simply walk away from.",
  },
  {
    title: "Patient dignity and health-care empathy",
    text: "I speak about humane communication, less paperwork harassment, and faster claim settlement for people already carrying health stress.",
  },
  {
    title: "Citizen-first digital public infrastructure",
    text: "On UPI, Aadhaar, and the AI layers being proposed on top, I care about fewer failures, clear consent, auditability, and outcomes that improve life on the ground.",
  },
  {
    title: "Real accountability over launch-day hype",
    text: "I want dashboards, enforcement, and measurable service quality instead of glossy announcements that do not change the lived experience.",
  },
];

const focusNow = [
  "AI and LLM workflows that stay readable and maintainable.",
  "Short-form publishing tied to real source material.",
  "Public-interest explainers with ground-level relevance.",
  "Personal systems that reduce noise and friction.",
  "Human-speed tech with privacy and accountability by default.",
];

const About = () => {
  return (
    <Box
      sx={{
        animation: `${fadeUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both`,
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        },
        maxWidth: 1000,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          backgroundImage:
            "linear-gradient(135deg, rgba(14, 165, 233, 0.12), transparent 42%), linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.9))",
          color: "#e2e8f0",
        }}
      >
        <Stack spacing={2.5}>
          <Typography variant="overline" sx={{ letterSpacing: 2.2, color: "rgba(226, 232, 240, 0.74)" }}>
            ABOUT / KUMAR A.
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1.8rem", md: "2.45rem" },
              lineHeight: 1.12,
              fontWeight: 650,
              maxWidth: 860,
            }}
          >
            Build useful AI systems, plain-language explainers, and public-interest writing that stay close to real people.
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(226, 232, 240, 0.86)", maxWidth: 760 }}>
            My roots are telecom IP/MPLS and wireless systems. Lately I have been spending more time on AI/LLMs,
            React/Vite, short-form publishing, and explainers that connect large systems to everyday life in India.
            I work where engineering, writing, and civic frustration meet.
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {["AI workflows", "Short-form publishing", "Citizen outcomes", "Ground-level reality"].map((pill) => (
              <Chip
                key={pill}
                label={pill}
                size="small"
                sx={{
                  color: "#e2e8f0",
                  borderColor: "rgba(226, 232, 240, 0.28)",
                  backgroundColor: "rgba(148, 163, 184, 0.16)",
                }}
                variant="outlined"
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}
          >
            <Stack spacing={1.25}>
              <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: "text.secondary" }}>
                Identity
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                What drives the work
              </Typography>
              <Typography variant="body2" color="text.secondary">
                I care about work that is clear, useful, and still understandable after the hype cycle moves on.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The bar is simple: does it reduce confusion, friction, or avoidable suffering for someone real?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tone: direct, grounded, warm enough to be human, never sugary.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}
          >
            <Stack spacing={1.25}>
              <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: "text.secondary" }}>
                Direction
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                What I am doing of late
              </Typography>
              {focusNow.map((item) => (
                <Typography key={item} variant="body2" color="text.secondary">
                  {item}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Stack spacing={1.4}>
          <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: "text.secondary" }}>
            Principles
          </Typography>
          {principles.map((item, index) => (
            <Typography key={item} variant="body2" color="text.secondary">
              {index + 1}. {item}
            </Typography>
          ))}
        </Stack>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}
          >
            <Stack spacing={1.3}>
              <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: "text.secondary" }}>
                Recent Work
              </Typography>
              {recentWork.map((item) => (
                <Typography key={item} variant="body2" color="text.secondary">
                  {item}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}
          >
            <Stack spacing={1.3}>
              <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: "text.secondary" }}>
                On X
              </Typography>
              <Typography variant="body2" color="text.secondary">
                I do not use X only to share links. I also use it to keep pressure on the everyday failures that wear
                people down.
              </Typography>
              {xCauses.map((item) => (
                <Box key={item.title}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Stack spacing={1.25}>
          <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: "text.secondary" }}>
            Operating Posture
          </Typography>
          {operatingPosture.map((item) => (
            <Typography key={item} variant="body2" color="text.secondary">
              {item}
            </Typography>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default About;
