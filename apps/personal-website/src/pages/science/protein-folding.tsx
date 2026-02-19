import { alpha } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import SEO from "../../components/SEO";
import ProteinFoldingVisualization from "../../components/science/ProteinFoldingVisualization";

type MedicationScheduleRow = {
  drug: string;
  dose: string;
  morning: string;
  afternoon: string;
  night: string;
  pattern: string;
};

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

  const medicationSchedule: MedicationScheduleRow[] = [
    {
      drug: "Eptus",
      dose: "25 mg (1/2 tablet)",
      morning: "1/2",
      afternoon: "0",
      night: "0",
      pattern: "1/2-0-0",
    },
    {
      drug: "Losar",
      dose: "25 mg",
      morning: "1",
      afternoon: "0",
      night: "0",
      pattern: "1-0-0",
    },
    {
      drug: "Dytor",
      dose: "5 mg",
      morning: "1",
      afternoon: "0",
      night: "0",
      pattern: "1-0-0",
    },
    {
      drug: "Cilobid",
      dose: "50 mg",
      morning: "1",
      afternoon: "0",
      night: "1",
      pattern: "1-0-1",
    },
    {
      drug: "Eccosprin",
      dose: "75 mg",
      morning: "0",
      afternoon: "0",
      night: "1",
      pattern: "0-0-1",
    },
    {
      drug: "Starglim M2",
      dose: "1 tablet",
      morning: "1",
      afternoon: "0",
      night: "0",
      pattern: "1-0-0",
    },
  ];

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
                check and ensures muscles actually import sugar after meals. My
                diabetic medicine now includes Starglim M2 in the morning. As a
                glimepiride + metformin combination, it supports insulin release and
                insulin sensitivity, making each unit of correctly folded insulin
                more effective and less likely to drive swings.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Holistic Link: Protein Folding and My Drugs
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Protein folding is the base layer behind my treatment plan, not just
                insulin itself. Starglim M2 (glimepiride + metformin) works best when
                insulin and downstream signaling proteins are folded and functioning
                well. My cardiac medicines then support the environment where that
                signaling stays effective: Eptus and Losar stabilize pressure and
                remodeling stress, Dytor helps fluid balance, Cilobid supports blood
                flow, and Eccosprin lowers thrombotic risk. Holistically, this links
                molecular quality (folded proteins), glucose handling, and circulation
                into one connected system.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                My Medication Schedule
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Updated after my cardiology review:
                {"\n"}- Eptus 25 mg: 1/2 tablet in the morning.
                {"\n"}- Losar 25 mg: 1 tablet in the morning.
                {"\n"}- Dytor: reduced dose to 5 mg.
                {"\n"}- Cilobid 50 mg: morning and night.
                {"\n"}- Eccosprin 75 mg: night only.
                {"\n"}- Starglim M2: 1 tablet in the morning.
                {"\n"}For educational purposes -- not medical advice.
              </Typography>
              <TableContainer
                sx={{
                  border: `1px solid ${alpha(outlineVariant, 0.85)}`,
                  borderRadius: 2,
                  overflowX: "auto",
                }}
              >
                <Table size="small" aria-label="medication schedule">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Drug
                      </TableCell>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Dose
                      </TableCell>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Morning
                      </TableCell>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Afternoon
                      </TableCell>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Night
                      </TableCell>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Pattern
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicationSchedule.map((medication) => (
                      <TableRow key={medication.drug}>
                        <TableCell>{medication.drug}</TableCell>
                        <TableCell>{medication.dose}</TableCell>
                        <TableCell>{medication.morning}</TableCell>
                        <TableCell>{medication.afternoon}</TableCell>
                        <TableCell>{medication.night}</TableCell>
                        <TableCell>{medication.pattern}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
