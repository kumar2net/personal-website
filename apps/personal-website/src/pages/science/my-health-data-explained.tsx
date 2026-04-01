import { alpha } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Chip,
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

type SnapshotCard = {
  label: string;
  value: string;
  detail: string;
};

type MechanismCard = {
  title: string;
  body: string;
};

type MedicationScheduleRow = {
  drug: string;
  dose: string;
  timing: string;
  morning: string;
  afternoon: string;
  night: string;
  pattern: string;
  role: string;
  proteinLink: string;
};

const snapshotCards: SnapshotCard[] = [
  {
    label: "Molecular focus",
    value: "Insulin quality control",
    detail:
      "Protein folding decides whether insulin is stable enough to store, release, and signal properly.",
  },
  {
    label: "Confirmed diabetes therapy",
    value: "Starglim M2 each morning",
    detail:
      "Current notes confirm a morning glimepiride + metformin combination supporting insulin output and insulin sensitivity.",
  },
  {
    label: "Confirmed companion medicines",
    value: "Four cardiometabolic supports",
    detail:
      "The current schedule also includes Losar, Dytor, Cilobid, and Eccosprin for pressure, fluid, flow, and clot-risk support.",
  },
  {
    label: "Current clinical burden",
    value: "Foot ulcer + LVEF 26%",
    detail:
      "Reported issues include a diabetic foot ulcer and breathing difficulty with shortness of breath in the setting of a low LVEF of 26%. Past history also includes necrotizing fasciitis.",
  },
];

const mechanismCards: MechanismCard[] = [
  {
    title: "Step 1: Fold the hormone correctly",
    body:
      "Insulin starts as proinsulin. Inside the ER and Golgi, the chains must fold into the right 3D shape and form the correct disulfide bridges before beta cells can package the hormone safely.",
  },
  {
    title: "Step 2: Release usable insulin on demand",
    body:
      "If folding or packaging goes wrong, less effective insulin reaches circulation. Glucose rises faster, beta cells work harder, and the whole control loop becomes less efficient.",
  },
  {
    title: "Step 3: Support the metabolic response",
    body:
      "Starglim M2 helps from two angles: glimepiride supports insulin release, while metformin improves sensitivity and reduces excess hepatic glucose output.",
  },
  {
    title: "Step 4: Protect the downstream environment",
    body:
      "The rest of the plan supports circulation, pressure, and fluid balance so insulin signaling has a more stable physiologic environment to act in.",
  },
];

const medicationSchedule: MedicationScheduleRow[] = [
  {
    drug: "Losar",
    dose: "25 mg",
    timing: "Morning",
    morning: "1",
    afternoon: "0",
    night: "0",
    pattern: "1-0-0",
    role: "Supports blood-pressure control and vascular stability.",
    proteinLink:
      "Insulin signaling works better when vascular tone and tissue perfusion are not being disrupted by uncontrolled pressure.",
  },
  {
    drug: "Dytor",
    dose: "10 mg",
    timing: "Morning",
    morning: "1",
    afternoon: "0",
    night: "0",
    pattern: "1-0-0",
    role: "Manages fluid balance.",
    proteinLink:
      "Less congestion means less systemic strain around the metabolic work insulin has to coordinate.",
  },
  {
    drug: "Cilobid",
    dose: "50 mg",
    timing: "Morning and night",
    morning: "1",
    afternoon: "0",
    night: "1",
    pattern: "1-0-1",
    role: "Supports circulation and blood flow.",
    proteinLink:
      "Better flow helps glucose and oxygen delivery reach the tissues where insulin signaling has to land.",
  },
  {
    drug: "Eccosprin",
    dose: "75 mg",
    timing: "Night",
    morning: "0",
    afternoon: "0",
    night: "1",
    pattern: "0-0-1",
    role: "Reduces thrombotic risk.",
    proteinLink:
      "Keeps the vascular side of the cardiometabolic system safer while glucose control is being managed upstream.",
  },
  {
    drug: "Starglim M2",
    dose: "1 tablet",
    timing: "Morning",
    morning: "1",
    afternoon: "0",
    night: "0",
    pattern: "1-0-0",
    role: "Combines glimepiride + metformin for glucose control.",
    proteinLink:
      "Directly amplifies the value of correctly folded insulin by supporting release and improving how tissues respond to it.",
  },
];

export default function MyHealthDataExplainedPage() {
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
        title="My Health Data Explained"
        description="Interactive WebGPU visual of insulin folding with medication, symptom, and cardiometabolic context."
        canonicalPath="/science/my-health-data-explained"
        type="website"
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack gap={4}>
          <Stack gap={1.25}>
            <Typography
              variant="headlineSmall"
              sx={{
                color: onSurface,
                letterSpacing: 0.2,
              }}
            >
              My Health Data Explained
            </Typography>
            <Typography
              variant="bodyLarge"
              sx={{ color: alpha(onSurface, 0.84), maxWidth: 820 }}
            >
              A molecule-first view of the confirmed cardiometabolic notes currently
              on this site. The page now ties together insulin folding, the active
              glucose-lowering medicine, the companion medicines that help keep the
              broader physiology stable, and the symptom burden shaping daily
              function.
            </Typography>
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="Protein biology"
                size="small"
                sx={{ bgcolor: alpha(primaryContainer, 0.12), color: onSurface }}
              />
              <Chip
                label="Diabetes context"
                size="small"
                sx={{ bgcolor: alpha(primaryContainer, 0.12), color: onSurface }}
              />
              <Chip
                label="Cardiometabolic support"
                size="small"
                sx={{ bgcolor: alpha(primaryContainer, 0.12), color: onSurface }}
              />
            </Stack>
          </Stack>

          <ProteinFoldingVisualization />

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
            }}
          >
            {snapshotCards.map((card) => (
              <Card key={card.label} sx={{ ...cardSx, height: "100%" }}>
                <CardContent sx={{ display: "grid", gap: 1 }}>
                  <Typography
                    variant="labelLarge"
                    sx={{ color: alpha(onSurface, 0.72), textTransform: "uppercase" }}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    variant="titleMedium"
                    sx={{ color: primaryContainer, fontWeight: 700 }}
                  >
                    {card.value}
                  </Typography>
                  <Typography variant="bodyMedium" sx={{ color: alpha(onSurface, 0.88) }}>
                    {card.detail}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Divider sx={{ borderColor: outlineVariant, opacity: 0.9 }} />

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                What Protein Folding Changes
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
                Why It Matters for Glucose Control
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                When folding or secretion falters, insulin potency drops and glucose
                spikes climb faster. Misfolded insulin can overwhelm ER quality
                control, stress beta cells, and blunt the insulin signal, making it
                harder to keep blood glucose steady. Consistent, well-folded insulin
                is why dosing and timing matter: it keeps hepatic glucose output in
                check and ensures muscles actually import sugar after meals. The
                confirmed diabetes medicine here is Starglim M2 in the morning. As a
                glimepiride + metformin combination, it supports insulin release and
                insulin sensitivity, making each unit of correctly folded insulin more
                effective and less likely to drive swings.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Treatment Protocol, Plainly Explained
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Think of the plan as a repair crew working on the same house from
                different directions at once: Starglim M2 helps bring blood sugar down
                so tissues are not bathing in excess glucose, Losar lowers pressure in
                the circulation, Dytor removes extra fluid so the heart and lungs are
                not pushing against congestion when LVEF is 26%, and Cilobid with
                Eccosprin help blood keep moving and reduce clot-related risk. The aim
                is not to treat the foot, the heart, and the sugar problem as separate
                stories, but to reduce strain everywhere at once so breathing is easier,
                wound healing has a better chance, and circulation to vulnerable tissue
                is less compromised. The history matters too: a past episode of
                necrotizing fasciitis means serious soft-tissue damage and infection are
                part of the real background, which is why wound surveillance and early
                escalation matter in the overall picture.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Mechanistic Map: Molecule to Medication Plan
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                }}
              >
                {mechanismCards.map((card) => (
                  <Box
                    key={card.title}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(outlineVariant, 0.85)}`,
                      backgroundColor: alpha(onSurface, 0.02),
                    }}
                  >
                    <Typography
                      variant="bodyLarge"
                      sx={{ color: primaryContainer, fontWeight: 700, mb: 0.75 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="bodyMedium" sx={{ color: alpha(onSurface, 0.9) }}>
                      {card.body}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Current Medication Schedule
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                Updated after the latest cardiology review reflected in the site notes.
                This is educational context only, not medical advice.
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
                        Timing
                      </TableCell>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Pattern
                      </TableCell>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Main role
                      </TableCell>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Why it belongs on this page
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicationSchedule.map((medication) => (
                      <TableRow key={medication.drug}>
                        <TableCell>{medication.drug}</TableCell>
                        <TableCell>{medication.dose}</TableCell>
                        <TableCell>{medication.timing}</TableCell>
                        <TableCell>{medication.pattern}</TableCell>
                        <TableCell>{medication.role}</TableCell>
                        <TableCell>{medication.proteinLink}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ display: "grid", gap: 1.5 }}>
              <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                Dose Matrix and Data Coverage
              </Typography>
              <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                This version reflects the medical facts already confirmed inside the
                repository: the insulin-folding explanation, the current medication
                schedule, and the cardiometabolic rationale linking them. Formal lab
                panels, imaging findings, consultation summaries, and trend charts can
                be layered into the same structure once the underlying reports are
                accessible.
              </Typography>
              <TableContainer
                sx={{
                  border: `1px solid ${alpha(outlineVariant, 0.85)}`,
                  borderRadius: 2,
                  overflowX: "auto",
                }}
              >
                <Table size="small" aria-label="schedule matrix">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: onSurface, fontWeight: 700 }}>
                        Drug
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicationSchedule.map((medication) => (
                      <TableRow key={`${medication.drug}-matrix`}>
                        <TableCell>{medication.drug}</TableCell>
                        <TableCell>{medication.morning}</TableCell>
                        <TableCell>{medication.afternoon}</TableCell>
                        <TableCell>{medication.night}</TableCell>
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
