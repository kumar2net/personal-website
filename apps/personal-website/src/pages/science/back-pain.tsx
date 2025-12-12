import { alpha } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SEO from "../../components/SEO";

const PRIMARY_VIDEO_SRC = "/media/generated/back-pain-sora-12s.mp4";
const FALLBACK_VIDEO_SRC = "/media/generated/back-pain-sora.mp4";
const PART2_VIDEO_SRC = "/media/generated/back-pain-sora-12s-part2.mp4";

const microvideoSteps = [
  {
    title: "Reset in neutral (supine)",
    detail: "Lie on your back, knees bent. Breathe slow and let muscles unclench.",
  },
  {
    title: "Knee rocks (pain-free arc)",
    detail: "Rock both knees side-to-side within comfort for 20–30 seconds.",
  },
  {
    title: "Pelvic tilts",
    detail: "Gently tilt pelvis to flatten then release lumbar curve. 8–10 reps.",
  },
  {
    title: "Supported hip hinge",
    detail: "From standing, hinge with hands on a countertop, keep spine neutral.",
  },
  {
    title: "Sit/stand strategy",
    detail: "Brace exhale, nose over toes to stand; to sit, hinge and reach hips back.",
  },
];

const moves = [
  {
    title: "Pelvic tilts (floor)",
    detail:
      "On your back with knees bent, exhale and gently flatten your low back, inhale to release. 1–2 sets of 8–10.",
  },
  {
    title: "Supine knee rocks",
    detail:
      "Feet wide, rock knees side to side in a pain-free range to let paraspinals relax. 2 x 30–45 seconds.",
  },
  {
    title: "90/90 breathing reset",
    detail:
      "Feet on a chair, knees/hips at 90°, breathe in through nose 4s, out 6s, feel ribs wrap down. 2–3 minutes.",
  },
  {
    title: "Prone press-up (gentle)",
    detail:
      "Lie face-down, hands near shoulders, press up partway while hips stay down. Stop before pain. 6–8 light reps.",
  },
  {
    title: "Countertop hip hinge",
    detail:
      "Hands on a counter, soften knees, hinge so hips go back while spine stays long. 2 x 8 smooth reps.",
  },
  {
    title: "Supported split-stance hold",
    detail:
      "One foot forward, slight bend, hands on counter, feel weight through front heel. 2 x 20–30 seconds each side.",
  },
];

const cautions = [
  "Stop if pain shoots down a leg, numbness/tingling appears, or weakness worsens.",
  "If you have fever, bowel/bladder changes, or recent trauma, seek urgent medical care.",
  "Move in a pain-free or “slight discomfort that eases” range—never into sharp pain.",
];

export default function BackPainPlanPage() {
  const theme = useTheme();
  const paletteVars = (theme.vars?.palette ?? {}) as Record<string, string | undefined>;

  const surfaceContainer =
    paletteVars.surfaceContainer ?? theme.palette.background.paper;
  const primaryContainer =
    paletteVars.primaryContainer ?? theme.palette.primary.main;
  const onSurface = paletteVars.onSurface ?? theme.palette.text.primary;
  const outlineVariant = paletteVars.outlineVariant ?? theme.palette.divider;

  const cardSx = {
    backgroundColor: surfaceContainer,
    color: onSurface,
    border: `1px solid ${alpha(outlineVariant, 0.85)}`,
    borderRadius: 3,
    boxShadow: `0 24px 60px ${alpha(onSurface, 0.08)}`,
  };

  return (
    <>
      <SEO
        title="Back Pain Relief – Paraspinal Calm-Down Plan"
        description="Annotated, voiceover-friendly plan to reduce paraspinal spasm: micro-movements, sit/stand technique, and safety guardrails."
        canonicalPath="/science/back-pain"
        type="website"
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack gap={4}>
          <Stack gap={1}>
            <Typography
              variant="headlineSmall"
              sx={{ color: onSurface, letterSpacing: 0.2 }}
            >
              Back Pain Relief — Paraspinal Calm-Down Plan
            </Typography>
            <Typography
              variant="bodyLarge"
              sx={{ color: alpha(onSurface, 0.85), maxWidth: 780 }}
            >
              Gentle, gravity-friendly moves you can do without flaring your
              paraspinal muscles. Think of this as an annotated script you could
              turn into a voice-over video: start on the floor, breathe, then add
              light hinges. Stop if symptoms travel down a leg, numbness shows up,
              or pain spikes.
            </Typography>
          </Stack>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.25 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Guided Video (Sora, ~4s)
              </Typography>
              <Typography variant="bodyMedium" sx={{ color: alpha(onSurface, 0.8) }}>
                Short visual of the key sequence. Use the captions below for a longer
                voiceover if you record your own 12-second guide.
              </Typography>
              <Box
                component="video"
                controls
                playsInline
                preload="metadata"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  border: `1px solid ${alpha(outlineVariant, 0.8)}`,
                  backgroundColor: alpha(onSurface, 0.04),
                }}
              >
                <source src={PRIMARY_VIDEO_SRC} type="video/mp4" />
                <source src={FALLBACK_VIDEO_SRC} type="video/mp4" />
                Your browser does not support the video tag.
              </Box>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.25 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Guided Video – Part 2 (Sora, ~4s)
              </Typography>
              <Typography variant="bodyMedium" sx={{ color: alpha(onSurface, 0.8) }}>
                Continuation: countertop hinge, supported split-stance, and sit/stand
                strategy. Use this after the first clip for a daily flow.
              </Typography>
              <Box
                component="video"
                controls
                playsInline
                preload="metadata"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  border: `1px solid ${alpha(outlineVariant, 0.8)}`,
                  backgroundColor: alpha(onSurface, 0.04),
                }}
              >
                <source src={PART2_VIDEO_SRC} type="video/mp4" />
                Your browser does not support the video tag.
              </Box>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Video/Voiceover Script (use these captions)
              </Typography>
              <Grid container spacing={2}>
                {microvideoSteps.map((step) => (
                  <Grid item xs={12} sm={6} key={step.title}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px dashed ${alpha(outlineVariant, 0.8)}`,
                        background: alpha(primaryContainer, 0.06),
                      }}
                    >
                      <Typography
                        variant="bodyLarge"
                        sx={{ color: primaryContainer, fontWeight: 700 }}
                      >
                        {step.title}
                      </Typography>
                      <Typography variant="bodyMedium" sx={{ color: onSurface }}>
                        {step.detail}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Low-Gravity Exercises
              </Typography>
              <Stack gap={1.25}>
                {moves.map((item) => (
                  <Box
                    key={item.title}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(outlineVariant, 0.8)}`,
                      background: alpha(onSurface, 0.02),
                    }}
                  >
                    <Typography variant="bodyLarge" sx={{ color: onSurface, fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="bodyMedium" sx={{ color: alpha(onSurface, 0.9) }}>
                      {item.detail}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.2 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Sit/Stand Technique (protect the frozen muscle)
              </Typography>
              <List dense disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon fontSize="small" htmlColor={primaryContainer} />
                  </ListItemIcon>
                  <ListItemText
                    primary="To stand: scoot forward, feet under knees, exhale/brace, nose over toes, drive through heels."
                    primaryTypographyProps={{ variant: "bodyMedium", sx: { color: onSurface } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon fontSize="small" htmlColor={primaryContainer} />
                  </ListItemIcon>
                  <ListItemText
                    primary="To sit: keep spine tall, hinge back with hips, reach for the seat with control—no plopping."
                    primaryTypographyProps={{ variant: "bodyMedium", sx: { color: onSurface } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon fontSize="small" htmlColor={primaryContainer} />
                  </ListItemIcon>
                  <ListItemText
                    primary="During the day: micro-move every 45–60 minutes (hip circles, gentle cat/camel standing)."
                    primaryTypographyProps={{ variant: "bodyMedium", sx: { color: onSurface } }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.25 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                When to Pause and Call a Clinician
              </Typography>
              <Divider sx={{ borderColor: outlineVariant, opacity: 0.9 }} />
              <List dense disablePadding>
                {cautions.map((text) => (
                  <ListItem key={text} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <WarningAmberIcon fontSize="small" htmlColor={primaryContainer} />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{ variant: "bodyMedium", sx: { color: onSurface } }}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="bodySmall" sx={{ color: alpha(onSurface, 0.75) }}>
                This is educational guidance, not medical advice. If you are unsure, get a
                licensed clinician or physical therapist to evaluate your spine and hips.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
