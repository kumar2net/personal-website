import { alpha } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SEO from "../../components/SEO";
import BrainVsAiVisualization from "../../components/science/BrainVsAiVisualization";

export default function BrainVsAiPrimerPage() {
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
    boxShadow: `0 28px 70px ${alpha(onSurface, 0.09)}`,
  };

  return (
    <>
      <SEO
        title="Brain Vs AI Neural Network Primer"
        description="WebGPU visualization comparing neurons + synapses with transformer-style neural nets powering LLMs."
        canonicalPath="/science/brain-vs-ai"
        type="website"
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack gap={4}>
          <Stack gap={1}>
            <Typography
              variant="headlineSmall"
              sx={{
                color: onSurface,
                letterSpacing: 0.2,
              }}
            >
              Brain Vs AI Neural Network Primer
            </Typography>
            <Typography variant="bodyLarge" sx={{ color: onSurface }}>
              For Gen Z and millennial nerds who want to see how spiking neurons map to
              attention heads. Drag, orbit, and watch the hand-off from biology to
              transformer math.
            </Typography>
          </Stack>

          <BrainVsAiVisualization />

          <Divider sx={{ borderColor: outlineVariant, opacity: 0.9 }} />

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                How Your Cortex Talks
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Neurons are tiny decision units. They collect chemical signals across
                thousands of synapses, fire once the voltage crosses a threshold, then
                send spikes down axons. The 3D cloud on the left shows densely linked
                neurons and the glow of synchronized firing — a vibe check for working
                memory and sensory fusion.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: secondaryContainer }}>
                How Neural Nets Echo That
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                On the right, nodes sit in stacked layers. Inputs → hidden layers →
                outputs. Transformers remix this with self-attention: every token
                looks at every other token, weighting the relationships. The crisscross
                lines pulse to show how context is shared, kind of like how multiple
                brain regions coordinate when you remember a lyric or smell.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.4 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                LLM Reality Check
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Large language models are stacks of these layers, trained on trillions
                of tokens. They do not think or feel — they predict the next token by
                compressing patterns. Like your cortex, they thrive on rich signals and
                choke on low-quality inputs. Difference: your neurons rewire with
                experience; an LLM stays frozen until retrained or fine-tuned.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
