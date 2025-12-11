import { alpha } from "@mui/material/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SEO from "../../components/SEO";

export default function ScienceIndex() {
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
        title="Science"
        description="Science explorations across biology, metabolism, and cardiology."
        canonicalPath="/science"
        type="website"
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack gap={3.5}>
          <Typography variant="headlineSmall" sx={{ color: onSurface }}>
            Science Notes
          </Typography>

          <Card sx={cardSx}>
            <CardActionArea
              component={RouterLink}
              to="/science/brain-vs-ai"
              sx={{ height: "100%" }}
            >
              <CardContent sx={{ display: "grid", gap: 1.25 }}>
                <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                  Brain Vs AI Neural Network Primer
                </Typography>
                <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                  WebGPU visualization of neurons, synapses, and how transformer layers
                  borrow those ideas to power LLMs.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card sx={cardSx}>
            <CardActionArea
              component={RouterLink}
              to="/science/protein-folding"
              sx={{ height: "100%" }}
            >
              <CardContent sx={{ display: "grid", gap: 1.25 }}>
                <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                  Insulin Protein Folding & Heart Meds
                </Typography>
                <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                  WebGPU visualization of insulin A/B chains with context on my low
                  LVEF medications and how they shape cardiometabolic pathways.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
