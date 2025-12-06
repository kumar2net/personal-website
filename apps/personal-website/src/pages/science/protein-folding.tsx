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
import ProteinFoldingVisualization from "../../components/science/ProteinFoldingVisualization";

export default function ProteinFoldingPage() {
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
    boxShadow: `0 28px 70px ${alpha(onSurface, 0.09)}`,
  };

  return (
    <>
      <SEO
        title="Protein Folding – Insulin & Heart Medication Insights"
        description="Interactive WebGPU visual of insulin folding with cardiometabolic explanations."
        canonicalPath="/science/protein-folding"
        type="website"
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack gap={4}>
          <Typography
            variant="headlineSmall"
            sx={{
              color: onSurface,
              letterSpacing: 0.2,
            }}
          >
            Insulin Protein Folding
          </Typography>

          <ProteinFoldingVisualization />

          <Divider sx={{ borderColor: outlineVariant, opacity: 0.9 }} />

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Insulin Protein Folding
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Insulin is built from two peptide chains: the A-chain and the B-chain.
                They are linked by two inter-chain disulfide bridges and one internal
                bridge in the A-chain. As proinsulin moves through the ER and Golgi,
                chaperones guide the chains to fold, pair cysteines, and pack into a
                compact shape. Proper folding creates a stable hormone that can be
                stored in beta-cell granules, secreted when glucose rises, and bind
                its receptor to activate glucose uptake and glycogen storage.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Diabetes Context for Me
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                When folding or secretion falters, insulin potency drops and glucose
                spikes climb faster. Misfolded insulin can overwhelm ER quality
                control, stress beta cells, and blunt the insulin signal, making it
                harder to keep blood glucose steady. Consistent, well-folded insulin
                is why dosing and timing matter: it keeps hepatic glucose output in
                check and ensures muscles actually import sugar after meals.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                My Heart Medications
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                - Bisolong 2.5 mg (bisoprolol): beta-1 blocker that slows heart rate,
                lowers myocardial oxygen demand, and eases workload--helpful for low
                LVEF while keeping perfusion steady so insulin can circulate.
                {"\n"}- Ecosprin 75 mg: antiplatelet therapy that keeps coronary flow
                smooth, reducing clot risk while metabolic tissues stay well
                perfused for insulin delivery.
                {"\n"}- Dytor 10 mg: loop diuretic that moves excess fluid, easing
                preload and improving oxygen delivery; dehydration risk means glucose
                checks and hydration stay important alongside insulin action.
                {"\n"}For educational purposes -- not medical advice.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
