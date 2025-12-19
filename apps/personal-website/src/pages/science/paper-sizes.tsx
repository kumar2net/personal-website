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
import PaperSizesVisualization from "../../components/science/PaperSizesVisualization";

export default function PaperSizesPage() {
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
        title="A-Series Paper Sizes – A4 to A0"
        description="WebGPU demo illustrating how A4 to A0 follow the sqrt(2) ratio."
        canonicalPath="/science/paper-sizes"
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
              A-Series Paper: A4 to A0
            </Typography>
            <Typography variant="bodyLarge" sx={{ color: onSurface }}>
              Imagine one sheet with area exactly 1 square meter. That is A0. Cut it
              in half and you get A1, cut again A2, and so on. The neat part is that
              every cut keeps the same shape, because the long side is always
              sqrt(2) times the short side. Next to it, the golden rectangle keeps
              a different promise: phi stays constant as you add squares. And a
              circle keeps its own vow: circumference equals pi times diameter.
            </Typography>
          </Stack>

          <PaperSizesVisualization />

          <Divider sx={{ borderColor: outlineVariant, opacity: 0.9 }} />

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                The one-square-meter trick
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                If I had a giant sheet and measured its area, I would want a rule
                that makes scaling easy. A0 is defined as 1 square meter. Each next
                size is exactly half the area, so A1 is 0.5 square meters, A2 is
                0.25, and so on. That is why the sizes march down in such a clean
                sequence.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: secondaryContainer }}>
                Why sqrt(2) keeps the shape
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Let the short side be 1 and the long side be r. When you cut the
                sheet in half, the new sheet has sides 1 / 2 and r. For it to look
                the same, r must equal 2 / r. Solve that and you get r = sqrt(2).
                That is the secret number hiding in every A-series page.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Scaling without surprises
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                That is why a copier can take an A4 sheet and scale it to A3 or A5
                without warping the margins. The aspect ratio is invariant, so every
                diagram, photo, or layout stays honest when you jump sizes.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: secondaryContainer }}>
                Golden ratio: growth by phi
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Start with a square, add another, and the rectangle grows by a factor
                of phi each time. This ratio does not preserve area; it preserves a
                feeling of balance. Architects, painters, and nature all reuse it
                because each step feels like the previous one, just scaled.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Pi: the circle's contract
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                The pi panel is a reminder that circles scale by a constant too. No
                matter how big the circle is, its circumference is pi times the
                diameter. Unroll that edge and you get a strip whose length is
                always pi times across.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Quick reference
              </Typography>
              <Typography
                variant="bodyLarge"
                sx={{ color: onSurface, whiteSpace: "pre-line" }}
              >
                A0: 841 x 1189 mm (1.0 square meter)
                {"\n"}A1: 594 x 841 mm
                {"\n"}A2: 420 x 594 mm
                {"\n"}A3: 297 x 420 mm
                {"\n"}A4: 210 x 297 mm
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
