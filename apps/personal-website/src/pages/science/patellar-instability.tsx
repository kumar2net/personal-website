import { alpha } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SEO from "../../components/SEO";

const INFOGRAPHIC_SRC = "/media/generated/kneecap-instability-infographic.svg";

const quickTake = [
  "Recurrent lateral patellar instability usually starts with one true dislocation, then becomes a repeat problem when the medial restraints stay stretched or torn.",
  "The classic setup is a planted-foot pivot with early knee flexion, valgus collapse, and internal rotation during fast directional change.",
  "The durable fix is anatomy-specific planning. Imaging and alignment metrics decide whether reconstruction alone is enough or whether bone realignment also matters.",
];

const mechanismTriggers = [
  "Planted-foot pivot with knee valgus and internal rotation during fast direction changes.",
  "The patella is most vulnerable in early knee flexion, before it is fully seated in the trochlear groove.",
  "After the first dislocation, the MPFL can remain stretched or torn and lose restraint.",
];

const recurrenceFactors = [
  "Trochlear dysplasia: shallow groove gives less bony containment.",
  "Patella alta: high-riding kneecap delays stable engagement in the groove.",
  "Elevated TT-TG distance or lateral pull bias: increases outward tracking force.",
  "Generalized laxity, valgus alignment, or rotational malalignment can compound risk.",
];

const definitiveFixSteps = [
  "MPFL reconstruction is the core stabilizing surgery for recurrent lateral patellar instability.",
  "Add tibial tubercle osteotomy when alignment and tracking metrics are unfavorable.",
  "Trochleoplasty is reserved for selected severe trochlear dysplasia in skeletally mature patients.",
  "Pre-op MRI (and often CT) guides anatomy-specific planning and checks cartilage injury.",
];

const urgentWarnings = [
  "Locked knee, inability to fully extend, or large immediate swelling.",
  "Persistent instability after a second event, especially in pivoting sport.",
  "Suspected osteochondral fragment or recurrent giving-way episodes.",
];

export default function PatellarInstabilityPage() {
  const theme = useTheme();
  const paletteVars = (theme.vars?.palette ?? {}) as Record<string, string | undefined>;

  const surfaceContainer =
    paletteVars.surfaceContainer ?? theme.palette.background.paper;
  const primaryContainer =
    paletteVars.primaryContainer ?? theme.palette.primary.main;
  const secondaryContainer =
    paletteVars.secondaryContainer ?? theme.palette.secondary.main;
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
        title="Recurrent Kneecap Dislocation – Anatomy and Permanent Fix"
        description="Annotated infographic and anatomy note on recurrent lateral patellar instability and definitive correction."
        canonicalPath="/science/patellar-instability"
        type="article"
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack gap={4}>
          <Stack gap={1.2}>
            <Typography
              variant="headlineSmall"
              sx={{ color: onSurface, letterSpacing: 0.2 }}
            >
              Recurrent Kneecap Dislocation: Why It Returns and What Fixes It
            </Typography>
            <Typography variant="bodyLarge" sx={{ color: alpha(onSurface, 0.85) }}>
              This note explains recurrent lateral patellar instability in a squash
              athlete context: the mechanism, anatomic predisposition, and the
              definitive correction pathway after repeat episodes.
            </Typography>
          </Stack>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Chip
                  size="small"
                  label="Annotated infographic"
                  sx={{
                    width: "fit-content",
                    backgroundColor: alpha(primaryContainer, 0.14),
                    color: primaryContainer,
                    fontWeight: 700,
                  }}
                />
                <Chip
                  size="small"
                  label="Clinical anatomy note"
                  sx={{
                    width: "fit-content",
                    backgroundColor: alpha(secondaryContainer, 0.12),
                    color: secondaryContainer,
                    fontWeight: 700,
                  }}
                />
              </Stack>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Quick Orientation
              </Typography>
              <Stack gap={1.1}>
                {quickTake.map((item) => (
                  <Typography key={item} variant="bodyMedium" sx={{ color: alpha(onSurface, 0.84) }}>
                    • {item}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Annotated Infographic
              </Typography>
              <Box
                component="img"
                src={INFOGRAPHIC_SRC}
                alt="Infographic showing mechanism, recurrence factors, and permanent surgical correction for recurrent kneecap dislocation."
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  border: `1px solid ${alpha(outlineVariant, 0.8)}`,
                }}
              />
            </CardContent>
          </Card>

          <Divider sx={{ borderColor: outlineVariant, opacity: 0.9 }} />

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Anatomy: Why Recurrence Happens
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(outlineVariant, 0.75)}`,
                      backgroundColor: alpha(primaryContainer, 0.05),
                    }}
                  >
                    <Typography
                      variant="bodyLarge"
                      sx={{ color: primaryContainer, fontWeight: 700, mb: 1 }}
                    >
                      Trigger Mechanics
                    </Typography>
                    <Stack gap={1}>
                      {mechanismTriggers.map((item) => (
                        <Typography key={item} variant="bodyMedium" sx={{ color: onSurface }}>
                          • {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(outlineVariant, 0.75)}`,
                      backgroundColor: alpha(secondaryContainer, 0.05),
                    }}
                  >
                    <Typography
                      variant="bodyLarge"
                      sx={{ color: secondaryContainer, fontWeight: 700, mb: 1 }}
                    >
                      Predisposing Anatomy
                    </Typography>
                    <Stack gap={1}>
                      {recurrenceFactors.map((item) => (
                        <Typography key={item} variant="bodyMedium" sx={{ color: onSurface }}>
                          • {item}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Definitive Correction Pathway
              </Typography>
              <Stack gap={1.1}>
                {definitiveFixSteps.map((item) => (
                  <Typography key={item} variant="bodyMedium" sx={{ color: onSurface }}>
                    • {item}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.25 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Red Flags That Warrant Review
              </Typography>
              <Stack gap={1}>
                {urgentWarnings.map((item) => (
                  <Typography key={item} variant="bodyMedium" sx={{ color: onSurface }}>
                    • {item}
                  </Typography>
                ))}
              </Stack>
              <Typography variant="bodySmall" sx={{ color: alpha(onSurface, 0.74) }}>
                Educational note only. For acute injury, recurrent episodes, or a decision
                about surgery, get sports-orthopedic evaluation and imaging.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
