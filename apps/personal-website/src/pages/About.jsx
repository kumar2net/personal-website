import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

const principles = [
  "Truth before style.",
  "Utility before performance.",
  "Clarity is respect.",
  "User agency is non-negotiable.",
  "Privacy is a feature, not a footnote.",
  "Durable systems beat trend theater.",
  "Local language and local context matter.",
];

const operatingPosture = [
  "If facts can change, verify and include dates.",
  "If context is missing, state assumptions and proceed.",
  "Ask one unblock question only when needed.",
  "Recommend a path instead of hiding behind options.",
  "Never claim work was done unless it was done.",
];

const agentMap = [
  {
    title: "website agent",
    text: "Ships the Vite/React app, handles routes, and serves final pages plus sitemap artifacts.",
  },
  {
    title: "api agent",
    text: "Handles AGI, semantic search, TTS, translation, and engagement endpoints with idempotent safety.",
  },
  {
    title: "workflows agent",
    text: "Guards quality with CI checks for determinism, idempotency, canary behavior, and token budgets.",
  },
];

const writingContract = [
  "Start with a hook that earns attention.",
  "Keep sentences short and direct.",
  "Use active voice, concrete nouns, and precise verbs.",
  "Cut filler words and empty phrasing.",
  "One main point per post.",
  "End on a line that lands.",
];

const focusNow = [
  "AI and LLM workflows that stay readable and maintainable.",
  "Practical explainers with copy-paste value.",
  "Personal knowledge systems that reduce noise.",
  "Human-speed tech with privacy by default.",
  "Resilience over hype.",
];

const About = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{ maxWidth: 1000, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}
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
            Build clear systems and honest writing that help people decide, act, and stay human.
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(226, 232, 240, 0.86)", maxWidth: 760 }}>
            I work in four modes: engineer, teacher, writer, and systems thinker. My roots are telecom IP/MPLS and
            wireless systems. My current ground is AI/LLMs, React/Vite, and practical explainers.
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {[
              "Truth before style",
              "Utility before performance",
              "Clarity is respect",
              "Privacy by default",
            ].map((pill) => (
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
                What I optimize for
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Clear thinking, useful artifacts, and maintainable systems that another engineer can run tomorrow.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tone: direct, grounded, warm, never sugary.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Output standard: specific, testable, reversible.
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
                Current focus
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
                Agent Model
              </Typography>
              {agentMap.map((agent) => (
                <Box key={agent.title}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {agent.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agent.text}
                  </Typography>
                </Box>
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
                Writing Skill
              </Typography>
              <Typography variant="body2" color="text.secondary">
                I write to make one useful point. Not to perform. Not to decorate.
              </Typography>
              {writingContract.map((rule) => (
                <Typography key={rule} variant="body2" color="text.secondary">
                  {rule}
                </Typography>
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
