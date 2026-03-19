import { alpha } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import SEO from "../../components/SEO";
import NetworkingPacketFlowVisualization from "../../components/science/NetworkingPacketFlowVisualization";

const explainers = [
  {
    title: "Path, in plain English",
    tone: "primary",
    body:
      "Your request starts on the client, crosses the Wi-Fi hop, hits the router for LAN-to-ISP hand-off, asks DNS where the destination lives, and then exits to the wider internet. That whole chain can feel instant or annoying depending on where jitter and drops pile up.",
  },
  {
    title: "What the sliders simulate",
    tone: "secondary",
    body:
      "Packet rate acts like demand. Loss creates red failure bursts at node boundaries. Latency jitter keeps travel times uneven, which is why a link can show “good speed” in a test and still feel flaky during calls, gaming, or page loads.",
  },
  {
    title: "Why 5 GHz often feels faster",
    tone: "primary",
    body:
      "5 GHz usually offers more spectrum and less neighbor interference than crowded 2.4 GHz, so the first wireless hop is cleaner. The tradeoff is range. Move far from the access point and the signal can weaken enough that the old 2.4 GHz band starts winning again.",
  },
  {
    title: "Where this can go next",
    tone: "secondary",
    body:
      "This is a clean GPU playground. The next layer could add traceroute-style hops, a perf HUD, QoS queues, or a compute pass that advances packets fully on the GPU instead of the CPU.",
  },
];

const measurementSnapshots = [
  {
    host: "nixi.in",
    badge: "ICMP blocked here",
    detailFormat: "mono",
    pingSummary: "10 probes, 512-byte payload, 100% packet loss",
    latencySummary: "No ICMP echo reply from this network",
    tracerouteSummary:
      "Traceroute reached 103.249.97.70 at hop 8 in 27.4 ms, then the remaining hops stopped replying.",
    detail:
      "192.168.0.1 (2.9 ms) → 10.202.0.1 (4.2 ms) → broadband.actcorp.in (5.0 ms) → VSNL Chennai (4.7 ms) → VSNL Mumbai (22.9 ms) → 103.249.97.70 (27.4 ms) → hops 9-16: *",
  },
  {
    host: "cloudflare.com",
    badge: "Corrected hostname",
    detailFormat: "mono",
    pingSummary: "10 probes, 512-byte payload, 0% packet loss",
    latencySummary: "min 20.728 ms, avg 23.346 ms, max 25.162 ms, stddev 1.942 ms",
    tracerouteSummary:
      "Traceroute resolved the first advertised address, 104.16.132.229, and completed in 7 hops.",
    detail:
      "192.168.0.1 (2.8 ms) → 10.202.0.1 (4.3 ms) → broadband.actcorp.in (5.1 ms) → ACT edge (23.2 ms) → 103.16.203.73 (21.7 ms) → 162.158.52.19 (25.3 ms) → 104.16.132.229 (20.9 ms)",
  },
  {
    host: "nyc.speedtest.clouvider.net",
    badge: "USA east coast",
    detailFormat: "plain",
    pingSummary: "10 probes, 512-byte payload, 0% packet loss",
    latencySummary: "min 221.348 ms, avg 262.894 ms, max 332.397 ms, stddev 43.128 ms",
    tracerouteSummary:
      "Representative New York City endpoint used as an east-coast baseline from this network.",
    detail: "Resolved to 194.33.45.192.",
  },
  {
    host: "la.speedtest.clouvider.net",
    badge: "USA west coast",
    detailFormat: "plain",
    pingSummary: "10 probes, 512-byte payload, 0% packet loss",
    latencySummary: "min 249.632 ms, avg 272.867 ms, max 328.493 ms, stddev 29.816 ms",
    tracerouteSummary:
      "Representative Los Angeles endpoint used as a west-coast baseline from this network.",
    detail: "Resolved to 77.247.126.223.",
  },
];

export default function NetworkingPage() {
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
        title="Networking Packet Flow – Client to Internet"
        description="Interactive WebGPU packet-flow demo with WebGL2 fallback showing client, Wi-Fi AP, router, DNS, and internet hops."
        canonicalPath="/science/networking"
        type="website"
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack gap={4}>
          <Stack gap={1.25}>
            <Typography
              variant="headlineSmall"
              sx={{
                color: onSurface,
                letterSpacing: 0.2,
              }}
            >
              Networking Packet Flow
            </Typography>
            <Typography
              variant="bodyLarge"
              sx={{ color: alpha(onSurface, 0.84), maxWidth: 880 }}
            >
              A one-page network path visualizer for the trip most people never see:
              client to Wi-Fi, router, DNS, and upstream internet. It starts with
              WebGPU, falls back to WebGL2 when needed, and turns packet rate, loss,
              and jitter into something you can feel instead of just read about.
            </Typography>
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="WebGPU first"
                size="small"
                sx={{ bgcolor: alpha(primaryContainer, 0.12), color: onSurface }}
              />
              <Chip
                label="WebGL2 fallback"
                size="small"
                sx={{ bgcolor: alpha(secondaryContainer, 0.12), color: onSurface }}
              />
              <Chip
                label="Home Wi-Fi debugging"
                size="small"
                sx={{ bgcolor: alpha(primaryContainer, 0.12), color: onSurface }}
              />
              <Chip
                label="DNS path intuition"
                size="small"
                sx={{ bgcolor: alpha(secondaryContainer, 0.12), color: onSurface }}
              />
            </Stack>
          </Stack>

          <NetworkingPacketFlowVisualization />

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {measurementSnapshots.map((snapshot) => (
              <Card key={snapshot.host} sx={{ ...cardSx, height: "100%" }}>
                <CardContent sx={{ display: "grid", gap: 1.35 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ flexWrap: "wrap", gap: 1 }}
                  >
                    <Typography variant="titleMedium" sx={{ color: primaryContainer }}>
                      {snapshot.host}
                    </Typography>
                    <Chip
                      size="small"
                      label={snapshot.badge}
                      sx={{
                        bgcolor: alpha(secondaryContainer, 0.14),
                        color: onSurface,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Typography variant="bodyMedium" sx={{ color: alpha(onSurface, 0.86) }}>
                    Measured on March 19, 2026 from this environment. Ping used 10 ICMP
                    probes with a 512-byte payload; traceroute used 512-byte probes.
                  </Typography>
                  <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                    {snapshot.pingSummary}
                  </Typography>
                  <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                    {snapshot.latencySummary}
                  </Typography>
                  <Typography
                    variant="bodyMedium"
                    sx={{ color: alpha(onSurface, 0.88) }}
                  >
                    {snapshot.tracerouteSummary}
                  </Typography>
                  <Typography
                    variant="bodySmall"
                    sx={{
                      color: alpha(onSurface, 0.72),
                      fontFamily:
                        snapshot.detailFormat === "mono"
                          ? "ui-monospace, SFMono-Regular, Menlo, monospace"
                          : "inherit",
                      lineHeight: 1.65,
                    }}
                  >
                    {snapshot.detail}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Divider sx={{ borderColor: outlineVariant, opacity: 0.9 }} />

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {explainers.map((item) => (
              <Card key={item.title} sx={{ ...cardSx, height: "100%" }}>
                <CardContent sx={{ display: "grid", gap: 1.4 }}>
                  <Typography
                    variant="titleMedium"
                    sx={{
                      color:
                        item.tone === "primary"
                          ? primaryContainer
                          : secondaryContainer,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="bodyLarge" sx={{ color: onSurface }}>
                    {item.body}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
    </>
  );
}
