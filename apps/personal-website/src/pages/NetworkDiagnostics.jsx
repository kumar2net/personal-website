import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import RefreshIcon from "@mui/icons-material/Refresh";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import WifiIcon from "@mui/icons-material/Wifi";
import RouteIcon from "@mui/icons-material/Route";
import DnsIcon from "@mui/icons-material/Dns";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";

const DEFAULT_ENDPOINTS = ["/api/network-diagnostics"];
const DEFAULT_VERCEL_PORT = import.meta.env.VITE_VERCEL_DEV_PORT || "3000";
const HTTP_PROBES = [
  { label: "google_generate_204", url: "https://www.google.com/generate_204" },
  { label: "cloudflare_trace", url: "https://www.cloudflare.com/cdn-cgi/trace" },
];
const MOBILE_CARRIER_HINTS = [
  /verizon/i,
  /t[- ]?mobile/i,
  /at&t|att mobility/i,
  /vodafone|vi india|idea cellular/i,
  /airtel|bharti/i,
  /jio|reliance jio/i,
  /telefonica|movistar/i,
  /orange/i,
  /telstra/i,
  /singtel|starhub|m1/i,
  /china mobile|china telecom|china unicom/i,
];

function formatMs(value) {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return `${Number(value).toFixed(2)} ms`;
}

function formatDbm(value) {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  return `${value} dBm`;
}

function formatDateTime(value) {
  if (!value) {
    return "—";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
}

function formatBytes(value) {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }
  const bytes = Number(value);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

function severityToColor(severity) {
  if (severity === "high") return "error";
  if (severity === "medium") return "warning";
  return "info";
}

function valueOrDash(value) {
  if (value == null || value === "") {
    return "—";
  }
  return String(value);
}

function computeAverage(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) {
    return null;
  }
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

async function fetchWithTimeout(input, init = {}, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function resolveDiagnosticsEndpoints() {
  const endpoints = [];
  const customEndpoint = import.meta.env.VITE_NETWORK_DIAGNOSTICS_ENDPOINT;
  const useVercelDev = import.meta.env.VITE_USE_VERCEL_DEV === "true";
  const isBrowser = typeof window !== "undefined";

  if (customEndpoint) {
    endpoints.push(customEndpoint);
  }

  if (isBrowser) {
    const { hostname, port, origin } = window.location;
    const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
    const isVitePort = port === "5173" || port === "5174";

    if (origin) {
      endpoints.push(`${origin}/api/network-diagnostics`);
    }

    if (useVercelDev && isLocalHost && isVitePort) {
      endpoints.push(
        `http://localhost:${DEFAULT_VERCEL_PORT}/api/network-diagnostics`,
      );
    }
  }

  endpoints.push(...DEFAULT_ENDPOINTS);
  return Array.from(new Set(endpoints.filter(Boolean)));
}

async function readDiagnosticsPayload(response) {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!rawText) {
    return {
      payload: null,
      contentType,
      isHtml: false,
    };
  }

  try {
    const parsed = JSON.parse(rawText);
    return {
      payload: parsed,
      contentType,
      isHtml: false,
    };
  } catch {
    return {
      payload: null,
      contentType,
      isHtml: rawText.trim().startsWith("<!DOCTYPE html") || rawText.trim().startsWith("<html"),
    };
  }
}

async function measureHttpProbe(url, attempts = 3) {
  const samplesMs = [];
  for (let index = 0; index < attempts; index += 1) {
    const started = performance.now();
    try {
      await fetchWithTimeout(
        url,
        {
          mode: "no-cors",
          cache: "no-store",
        },
        4500,
      );
      samplesMs.push(performance.now() - started);
    } catch {
      // Keep trying other runs.
    }
  }
  const avgMs = computeAverage(samplesMs);
  return {
    samplesMs: samplesMs.map((value) => Number(value.toFixed(2))),
    avgMs: avgMs == null ? null : Number(avgMs.toFixed(2)),
  };
}

async function getPublicIpAddress() {
  try {
    const response = await fetchWithTimeout("https://api64.ipify.org?format=json", {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    return payload?.ip || null;
  } catch {
    return null;
  }
}

async function readUserAgentData() {
  if (typeof navigator === "undefined" || !navigator.userAgentData) {
    return null;
  }
  const uaData = navigator.userAgentData;
  const base = {
    mobile: uaData.mobile ?? null,
    platform: uaData.platform || null,
    brands: Array.isArray(uaData.brands)
      ? uaData.brands.map((entry) => `${entry.brand} ${entry.version}`)
      : [],
  };

  if (typeof uaData.getHighEntropyValues !== "function") {
    return base;
  }

  try {
    const highEntropy = await uaData.getHighEntropyValues([
      "architecture",
      "bitness",
      "model",
      "platformVersion",
      "fullVersionList",
    ]);
    return {
      ...base,
      architecture: highEntropy.architecture || null,
      bitness: highEntropy.bitness || null,
      model: highEntropy.model || null,
      platformVersion: highEntropy.platformVersion || null,
      fullVersionList: Array.isArray(highEntropy.fullVersionList)
        ? highEntropy.fullVersionList.map((entry) => `${entry.brand} ${entry.version}`)
        : [],
    };
  } catch {
    return base;
  }
}

async function getIpNetworkIntel() {
  const probes = [
    {
      url: "https://ipapi.co/json/",
      parser: (payload) => ({
        ip: payload?.ip || null,
        version: payload?.version || null,
        asn: payload?.asn || null,
        org: payload?.org || null,
        isp: payload?.org || null,
        network: payload?.network || null,
        city: payload?.city || null,
        region: payload?.region || null,
        country: payload?.country_name || payload?.country || null,
      }),
    },
    {
      url: "https://ipwho.is/",
      parser: (payload) => ({
        ip: payload?.ip || null,
        version: payload?.type || null,
        asn: payload?.connection?.asn || null,
        org: payload?.connection?.org || null,
        isp: payload?.connection?.isp || null,
        network: payload?.connection?.domain || null,
        city: payload?.city || null,
        region: payload?.region || null,
        country: payload?.country || null,
      }),
    },
  ];

  for (const probe of probes) {
    try {
      const response = await fetchWithTimeout(
        probe.url,
        { cache: "no-store" },
        3200,
      );
      if (!response.ok) {
        continue;
      }
      const payload = await response.json();
      return probe.parser(payload);
    } catch {
      // Try next provider.
    }
  }
  return null;
}

function isLikelyMobileCarrierName(text) {
  if (!text || typeof text !== "string") {
    return false;
  }
  return MOBILE_CARRIER_HINTS.some((pattern) => pattern.test(text));
}

function inferAccessProfile({ connection, carrierOrg, isMobileDevice }) {
  const signals = [];
  const carrierLikelyMobile = isLikelyMobileCarrierName(carrierOrg);

  let accessPath = "unknown";
  if (connection?.type === "wifi") {
    accessPath = "wifi";
    signals.push("browser-reported wifi");
  } else if (connection?.type === "ethernet") {
    accessPath = "ethernet";
    signals.push("browser-reported ethernet");
  } else if (connection?.type === "cellular") {
    accessPath = "cellular";
    signals.push("browser-reported cellular");
  } else if (carrierLikelyMobile && isMobileDevice) {
    accessPath = "cellular-likely";
    signals.push("mobile-carrier ASN/ORG hint");
  } else if (isMobileDevice) {
    accessPath = "mobile-device-unknown-link";
    signals.push("mobile device without link-type API");
  }

  let generation = "unknown";
  let confidence = "low";

  if (accessPath === "wifi" || accessPath === "ethernet") {
    generation = "not-cellular";
    confidence = "high";
  } else if (accessPath.startsWith("cellular")) {
    const effectiveType = connection?.effectiveType || null;
    const downlink = connection?.downlinkMbps ?? null;
    const rtt = connection?.rttMs ?? null;

    if (effectiveType && effectiveType !== "4g") {
      generation = `${effectiveType}-class`;
      confidence = "medium";
      signals.push(`effectiveType=${effectiveType}`);
    } else if (effectiveType === "4g") {
      if ((downlink || 0) >= 120 && (rtt || 0) <= 30) {
        generation = "5g-likely";
        confidence = "high";
        signals.push("high throughput and low RTT");
      } else if ((downlink || 0) >= 40 && (rtt || 0) <= 60) {
        generation = "5g-possible-nsa";
        confidence = "medium";
        signals.push("4g effectiveType with strong throughput");
      } else {
        generation = "4g";
        confidence = "medium";
        signals.push("4g effectiveType observed");
      }
    } else if (carrierLikelyMobile) {
      generation = "cellular-unknown-generation";
      confidence = "low";
      signals.push("carrier detected but Network Information API limited");
    }
  }

  return {
    accessPath,
    generation,
    confidence,
    carrierLikelyMobile,
    signals,
  };
}

async function discoverLocalCandidateAddress(timeoutMs = 2200) {
  if (typeof window === "undefined" || typeof RTCPeerConnection === "undefined") {
    return null;
  }

  return new Promise((resolve) => {
    let peer;
    try {
      peer = new RTCPeerConnection({ iceServers: [] });
    } catch {
      resolve(null);
      return;
    }
    let settled = false;
    const candidateList = [];
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        peer.close();
        resolve(candidateList[0] || null);
      }
    }, timeoutMs);

    const finalize = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      peer.close();
      resolve(value);
    };

    try {
      peer.createDataChannel("net-probe");
    } catch {
      finalize(null);
      return;
    }

    peer.onicecandidate = (event) => {
      const candidate = event?.candidate?.candidate;
      if (!candidate) {
        return;
      }
      const match = candidate.match(
        /candidate:\S+\s+\d+\s+\S+\s+\d+\s+([0-9a-fA-F:.]+)\s+\d+\s+typ\s+(\S+)/,
      );
      if (!match) {
        return;
      }
      const address = match[1];
      const candidateType = match[2];
      candidateList.push({ address, candidateType });
      if (candidateType === "host") {
        finalize({ address, candidateType });
      }
    };

    peer
      .createOffer()
      .then((offer) => peer.setLocalDescription(offer))
      .catch(() => finalize(null));
  });
}

function inferMobileGeneration(connection) {
  if (!connection) {
    return "unknown";
  }
  if (connection.type !== "cellular") {
    return "not-cellular";
  }
  if (connection.effectiveType !== "4g") {
    return `sub-4g (${connection.effectiveType || "n/a"})`;
  }
  if ((connection.downlink || 0) >= 100 && (connection.rtt || 0) <= 35) {
    return "5g-likely";
  }
  if ((connection.downlink || 0) >= 30) {
    return "4g-or-5g-ambiguous";
  }
  return "4g-congested-or-weaker";
}

async function collectClientSnapshot() {
  const navConnection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  const connection = navConnection
    ? {
        type: navConnection.type || null,
        effectiveType: navConnection.effectiveType || null,
        downlinkMbps:
          typeof navConnection.downlink === "number" ? navConnection.downlink : null,
        downlinkMaxMbps:
          typeof navConnection.downlinkMax === "number" ? navConnection.downlinkMax : null,
        rttMs: typeof navConnection.rtt === "number" ? navConnection.rtt : null,
        saveData: Boolean(navConnection.saveData),
      }
    : null;

  const userAgentData = await readUserAgentData();
  const ua = navigator.userAgent || "";
  const isMobileDevice =
    Boolean(userAgentData?.mobile) ||
    /android|iphone|ipad|ipod|mobile/i.test(ua);

  const [publicIp, ipNetworkIntel, localCandidate, httpLatencyChecks] = await Promise.all([
    getPublicIpAddress(),
    getIpNetworkIntel(),
    discoverLocalCandidateAddress(),
    Promise.all(
      HTTP_PROBES.map(async (probe) => ({
        label: probe.label,
        ...(await measureHttpProbe(probe.url)),
      })),
    ),
  ]);

  const accessProfile = inferAccessProfile({
    connection,
    carrierOrg: ipNetworkIntel?.org || ipNetworkIntel?.isp,
    isMobileDevice,
  });

  return {
    collectedAt: new Date().toISOString(),
    userAgent: ua,
    userAgentMobile: userAgentData?.mobile ?? null,
    userAgentData,
    isMobileDevice,
    online: navigator.onLine,
    platform: navigator.platform || null,
    language: navigator.language || null,
    connection,
    mobileInference: inferMobileGeneration(connection),
    accessProfile,
    publicIp: ipNetworkIntel?.ip || publicIp,
    ipNetworkIntel,
    localCandidate,
    httpLatencyChecks,
  };
}

function buildClientRecommendations(clientSnapshot) {
  if (!clientSnapshot) {
    return [];
  }

  const recommendations = [];
  const add = (severity, title, detail, recommendation) => {
    recommendations.push({
      severity,
      title,
      detail,
      recommendation,
      source: "client",
    });
  };

  const connection = clientSnapshot.connection;
  if (connection?.rttMs != null && connection.rttMs > 120) {
    add(
      "medium",
      "Browser-reported RTT is elevated",
      `The Network Information API reports ~${connection.rttMs} ms RTT.`,
      "Switch to a less congested access point or test wired transport if low latency is required.",
    );
  }

  if (connection?.saveData) {
    add(
      "info",
      "Data Saver is enabled",
      "The client browser signals reduced-data preference.",
      "Disable data saver for high-bitrate streaming workloads if bandwidth is available.",
    );
  }

  if (
    clientSnapshot?.accessProfile?.accessPath?.startsWith("cellular") &&
    clientSnapshot?.accessProfile?.generation !== "5g-likely"
  ) {
    add(
      "info",
      "Cellular link may not be in high-capacity 5G mode",
      `Inference result: ${clientSnapshot.accessProfile.generation} (${clientSnapshot.accessProfile.confidence} confidence).`,
      "Check radio mode/APN and verify NR (5G) lock status in handset diagnostics.",
    );
  }

  if (!connection && clientSnapshot?.isMobileDevice) {
    add(
      "info",
      "Mobile browser hides network radio metrics",
      "This browser does not expose Network Information API fields (type/effectiveType/downlink/rtt).",
      "Use Chrome on Android for richer 5G datapoints, or cross-check with carrier diagnostics apps.",
    );
  }

  const probeAverages = clientSnapshot.httpLatencyChecks
    .map((check) => check.avgMs)
    .filter((value) => Number.isFinite(value));
  const avgProbe = computeAverage(probeAverages);
  if (avgProbe != null && avgProbe > 250) {
    add(
      "medium",
      "High browser-level HTTP RTT",
      `Average synthetic HTTP RTT is ${avgProbe.toFixed(1)} ms.`,
      "Inspect DNS/TLS handshake latency and check if the access link is under load.",
    );
  }

  return recommendations;
}

function MetricTile({ label, value, helper }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <Typography variant="overline" sx={{ letterSpacing: 1.3, color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
        {value}
      </Typography>
      {helper ? (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {helper}
        </Typography>
      ) : null}
    </Paper>
  );
}

function sectionPaperStyles() {
  return {
    p: { xs: 2.5, md: 3 },
    borderRadius: 4,
    border: "1px solid",
    borderColor: "divider",
    background:
      "linear-gradient(155deg, rgba(14,165,233,0.08), rgba(16,185,129,0.05) 44%, rgba(248,250,252,0) 86%)",
  };
}

export default function NetworkDiagnostics() {
  const [serverDiagnostics, setServerDiagnostics] = useState(null);
  const [clientSnapshot, setClientSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRunAt, setLastRunAt] = useState(null);
  const endpointCandidates = useMemo(() => resolveDiagnosticsEndpoints(), []);

  const runDiagnostics = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const clientSnapshotPromise = collectClientSnapshot();
      let payload = null;
      let lastError =
        "Diagnostics endpoint returned an invalid response. Try `vercel dev` or enable the local API middleware.";

      for (const endpoint of endpointCandidates) {
        let response;
        try {
          response = await fetch(`${endpoint}?target=google.com&domain=kumar2net.com`, {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
          });
        } catch (requestError) {
          lastError =
            requestError?.message ||
            `Failed to reach diagnostics endpoint at ${endpoint}.`;
          continue;
        }

        const parsed = await readDiagnosticsPayload(response);
        const isObjectPayload =
          parsed.payload && typeof parsed.payload === "object" && !Array.isArray(parsed.payload);

        if (response.ok && isObjectPayload) {
          payload = parsed.payload;
          break;
        }

        if (isObjectPayload && parsed.payload.error) {
          lastError = String(parsed.payload.error);
          continue;
        }

        if (parsed.isHtml) {
          lastError = `Received HTML instead of JSON from ${endpoint}.`;
          continue;
        }

        lastError = `Invalid diagnostics response from ${endpoint} (HTTP ${response.status}).`;
      }

      if (!payload) {
        throw new Error(lastError);
      }

      const clientData = await clientSnapshotPromise;

      setClientSnapshot(clientData);
      setServerDiagnostics(payload);
      setLastRunAt(new Date().toISOString());
    } catch (diagnosticError) {
      setError(diagnosticError?.message || "Failed to run diagnostics.");
    } finally {
      setIsLoading(false);
    }
  }, [endpointCandidates]);

  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  const metrics = useMemo(() => {
    if (!serverDiagnostics) {
      return [];
    }
    const latency = serverDiagnostics.latency || {};
    const traceroute = serverDiagnostics.traceroute || {};
    const dnsRecords = serverDiagnostics.domainDns?.records || {};
    const neighbors = serverDiagnostics.neighbors?.entries || [];
    const tcpdumpDevices = serverDiagnostics.tcpdump?.devices || [];
    return [
      {
        label: "Avg RTT",
        value: formatMs(latency.avgMs),
        helper: latency.method || "n/a",
      },
      {
        label: "Packet Loss",
        value:
          latency.packetLossPct == null
            ? "—"
            : `${Number(latency.packetLossPct).toFixed(2)}%`,
        helper: latency.target || "google.com",
      },
      {
        label: "Traceroute Hops",
        value: traceroute.hops?.length ?? 0,
        helper: traceroute.available ? traceroute.source : "unavailable",
      },
      {
        label: "DNS A Records",
        value: dnsRecords.A?.length ?? 0,
        helper: serverDiagnostics.domain || "domain",
      },
      {
        label: "Neighbors",
        value: neighbors.length,
        helper: serverDiagnostics.neighbors?.source || "arp",
      },
      {
        label: "Resolvers",
        value: serverDiagnostics.dnsResolvers?.servers?.length ?? 0,
        helper: "upstream DNS",
      },
      {
        label: "Observed Devices",
        value: tcpdumpDevices.length,
        helper: serverDiagnostics.tcpdump?.available
          ? `tcpdump@${serverDiagnostics.tcpdump?.interface || "iface"}`
          : "tcpdump unavailable",
      },
    ];
  }, [serverDiagnostics]);

  const allRecommendations = useMemo(() => {
    const serverRecs = Array.isArray(serverDiagnostics?.recommendations)
      ? serverDiagnostics.recommendations.map((entry) => ({ ...entry, source: "server" }))
      : [];
    const clientRecs = buildClientRecommendations(clientSnapshot);
    return [...serverRecs, ...clientRecs];
  }, [serverDiagnostics, clientSnapshot]);

  const wifi = serverDiagnostics?.wifi;
  const latency = serverDiagnostics?.latency;
  const traceroute = serverDiagnostics?.traceroute;
  const neighbors = serverDiagnostics?.neighbors?.entries || [];
  const dnsResolvers = serverDiagnostics?.dnsResolvers?.servers || [];
  const domainDns = serverDiagnostics?.domainDns;
  const tcpdump = serverDiagnostics?.tcpdump;

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          ...sectionPaperStyles(),
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.15,
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <Stack sx={{ position: "relative", zIndex: 1 }} spacing={1.5}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Network Deep Diagnostics
            </Typography>
            <Chip
              icon={<NetworkCheckIcon />}
              label={serverDiagnostics ? `Run time ${serverDiagnostics.tookMs} ms` : "Initializing"}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Endpoint targets are fixed to `google.com` for latency/traceroute and `kumar2net.com`
            for DNS (`dig`-style records). The report combines host telemetry and browser-side link
            hints.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
              onClick={runDiagnostics}
              disabled={isLoading}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999 }}
            >
              {isLoading ? "Running probes..." : "Run Full Scan"}
            </Button>
            <Chip
              label={`Last run: ${formatDateTime(lastRunAt || serverDiagnostics?.generatedAt)}`}
              variant="outlined"
              size="small"
            />
          </Stack>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {!serverDiagnostics && isLoading ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack spacing={1.2} alignItems="center">
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Probing network stack...
            </Typography>
          </Stack>
        </Paper>
      ) : null}

      {serverDiagnostics ? (
        <>
          <Grid container spacing={1.5}>
            {metrics.map((metric) => (
              <Grid key={metric.label} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                <MetricTile label={metric.label} value={metric.value} helper={metric.helper} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={sectionPaperStyles()}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WifiIcon fontSize="small" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Wireless Adapter Snapshot
                    </Typography>
                  </Stack>
                  <Divider />
                  {wifi?.available ? (
                    <Grid container spacing={1}>
                      {[
                        ["Interface", wifi.interface],
                        ["SSID", wifi.ssid],
                        ["Band", wifi.band],
                        ["Channel", wifi.channel],
                        ["PHY Mode", wifi.phyMode],
                        ["Security", wifi.security],
                        ["Tx Rate", wifi.txRateMbps == null ? "—" : `${wifi.txRateMbps} Mbps`],
                        ["RSSI", formatDbm(wifi.rssiDbm)],
                        ["Noise", formatDbm(wifi.noiseDbm)],
                        ["SNR", wifi.snrDb == null ? "—" : `${wifi.snrDb} dB`],
                      ].map((row) => (
                        <Grid key={row[0]} size={{ xs: 6, md: 4 }}>
                          <Typography variant="caption" color="text.secondary">
                            {row[0]}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {valueOrDash(row[1])}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Alert severity="warning">
                      Wi-Fi adapter telemetry is unavailable in this runtime. {wifi?.error || ""}
                    </Alert>
                  )}
                  {Array.isArray(wifi?.nearbyNetworks) && wifi.nearbyNetworks.length > 0 ? (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Nearby SSIDs (sample)
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>SSID</TableCell>
                              <TableCell>Band</TableCell>
                              <TableCell>Channel</TableCell>
                              <TableCell>Security</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {wifi.nearbyNetworks.slice(0, 8).map((net, index) => (
                              <TableRow key={`${net.ssid || "ssid"}-${index}`}>
                                <TableCell>{valueOrDash(net.ssid)}</TableCell>
                                <TableCell>{valueOrDash(net.band)}</TableCell>
                                <TableCell>{valueOrDash(net.channel)}</TableCell>
                                <TableCell>{valueOrDash(net.security)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  ) : null}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={sectionPaperStyles()}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NetworkCheckIcon fontSize="small" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Client Transport & Mobile 5G Inference
                    </Typography>
                  </Stack>
                  <Divider />
                  {clientSnapshot ? (
                    <>
                      <Grid container spacing={1}>
                        {[
                          ["Device Class", clientSnapshot.isMobileDevice ? "mobile" : "desktop"],
                          ["Online", clientSnapshot.online ? "yes" : "no"],
                          ["Public IP", clientSnapshot.publicIp],
                          ["IP Version", clientSnapshot.ipNetworkIntel?.version],
                          ["Carrier / ISP", clientSnapshot.ipNetworkIntel?.org || clientSnapshot.ipNetworkIntel?.isp],
                          ["ASN", clientSnapshot.ipNetworkIntel?.asn],
                          ["Network Prefix", clientSnapshot.ipNetworkIntel?.network],
                          [
                            "Geo",
                            [clientSnapshot.ipNetworkIntel?.city, clientSnapshot.ipNetworkIntel?.country]
                              .filter(Boolean)
                              .join(", "),
                          ],
                          [
                            "Local Candidate",
                            clientSnapshot.localCandidate
                              ? `${clientSnapshot.localCandidate.address} (${clientSnapshot.localCandidate.candidateType})`
                              : "unavailable",
                          ],
                          ["Network API", clientSnapshot.connection ? "supported" : "not exposed"],
                          ["Connection Type", clientSnapshot.connection?.type],
                          ["Access Path", clientSnapshot.accessProfile?.accessPath],
                          ["Effective Type", clientSnapshot.connection?.effectiveType],
                          ["Generation", clientSnapshot.accessProfile?.generation],
                          ["Confidence", clientSnapshot.accessProfile?.confidence],
                          [
                            "Downlink",
                            clientSnapshot.connection?.downlinkMbps == null
                              ? "—"
                              : `${clientSnapshot.connection.downlinkMbps} Mbps`,
                          ],
                          [
                            "Downlink Max",
                            clientSnapshot.connection?.downlinkMaxMbps == null
                              ? "—"
                              : `${clientSnapshot.connection.downlinkMaxMbps} Mbps`,
                          ],
                          ["RTT", formatMs(clientSnapshot.connection?.rttMs)],
                          ["Data Saver", clientSnapshot.connection?.saveData ? "on" : "off"],
                          ["5G Inference", clientSnapshot.mobileInference],
                        ].map((row) => (
                          <Grid key={row[0]} size={{ xs: 6, md: 4 }}>
                            <Typography variant="caption" color="text.secondary">
                              {row[0]}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {valueOrDash(row[1])}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography variant="subtitle2">Access Inference Signals</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={0.8}>
                        {(clientSnapshot.accessProfile?.signals || []).length ? (
                          clientSnapshot.accessProfile.signals.map((signal) => (
                            <Chip
                              key={`signal-${signal}`}
                              size="small"
                              variant="outlined"
                              label={signal}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No strong cellular/Wi-Fi inference signals were exposed by this client.
                          </Typography>
                        )}
                      </Stack>

                      <Typography variant="subtitle2">HTTP RTT Probes (browser-side)</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Probe</TableCell>
                              <TableCell>Samples</TableCell>
                              <TableCell>Avg</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {clientSnapshot.httpLatencyChecks.map((probe) => (
                              <TableRow key={probe.label}>
                                <TableCell>{probe.label}</TableCell>
                                <TableCell>
                                  {probe.samplesMs.length
                                    ? probe.samplesMs.map((item) => `${item}ms`).join(", ")
                                    : "—"}
                                </TableCell>
                                <TableCell>{formatMs(probe.avgMs)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ) : (
                    <Alert severity="warning">
                      Browser telemetry not captured yet. Re-run diagnostics.
                    </Alert>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={sectionPaperStyles()}>
                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DnsIcon fontSize="small" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Resolver Stack & DNS Query Surface
                    </Typography>
                  </Stack>
                  <Divider />
                  <Typography variant="body2" color="text.secondary">
                    Upstream resolvers discovered from runtime:{" "}
                    <strong>{dnsResolvers.length || 0}</strong>
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {dnsResolvers.length ? (
                      dnsResolvers.map((server) => (
                        <Chip key={server} label={server} variant="outlined" size="small" />
                      ))
                    ) : (
                      <Typography variant="body2">No resolver addresses exposed.</Typography>
                    )}
                  </Stack>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    `dig` on {serverDiagnostics.domain}
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Records</TableCell>
                          <TableCell>Query Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {["A", "AAAA", "NS", "MX", "TXT", "CAA", "SOA"].map((type) => {
                          const records = domainDns?.records?.[type] || [];
                          const digMs = domainDns?.dig?.timingsMs?.[type];
                          const nodeMs = domainDns?.nodeDns?.timingsMs?.[type];
                          return (
                            <TableRow key={type}>
                              <TableCell>{type}</TableCell>
                              <TableCell>
                                {records.length ? records.join(" | ") : "—"}
                              </TableCell>
                              <TableCell>{formatMs(digMs ?? nodeMs)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper elevation={0} sx={sectionPaperStyles()}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DeviceHubIcon fontSize="small" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      L2 Neighbors (ARP) and Band Visibility
                    </Typography>
                  </Stack>
                  <Divider />
                  <Typography variant="body2" color="text.secondary">
                    {serverDiagnostics.neighbors?.note}
                  </Typography>
                  <TableContainer sx={{ maxHeight: 280 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Host</TableCell>
                          <TableCell>IP</TableCell>
                          <TableCell>MAC</TableCell>
                          <TableCell>Interface</TableCell>
                          <TableCell>State</TableCell>
                          <TableCell>Band</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {neighbors.length ? (
                          neighbors.map((entry, index) => (
                            <TableRow key={`${entry.ip}-${index}`}>
                              <TableCell>{valueOrDash(entry.host)}</TableCell>
                              <TableCell>{valueOrDash(entry.ip)}</TableCell>
                              <TableCell>{valueOrDash(entry.mac)}</TableCell>
                              <TableCell>{valueOrDash(entry.interface)}</TableCell>
                              <TableCell>{valueOrDash(entry.state)}</TableCell>
                              <TableCell>{valueOrDash(entry.band)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Typography variant="body2" color="text.secondary">
                                No neighbor entries were reported by this runtime.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={sectionPaperStyles()}>
                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DeviceHubIcon fontSize="small" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      tcpdump Capture Summary
                    </Typography>
                  </Stack>
                  <Divider />
                  {tcpdump?.available ? (
                    <>
                      <Grid container spacing={1}>
                        {[
                          ["Interface", tcpdump.interface],
                          ["Packets", tcpdump.packetCount],
                          ["Devices", tcpdump.devices?.length || 0],
                          ["Conversations", tcpdump.conversations?.length || 0],
                          [
                            "Silent Neighbors",
                            tcpdump.silentNeighbors == null ? "—" : tcpdump.silentNeighbors,
                          ],
                          [
                            "Capture Type",
                            tcpdump.partialCapture ? "partial (timeout/limit)" : "complete",
                          ],
                        ].map((row) => (
                          <Grid key={row[0]} size={{ xs: 6 }}>
                            <Typography variant="caption" color="text.secondary">
                              {row[0]}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {valueOrDash(row[1])}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography variant="subtitle2">Top Protocol Mix</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={0.8}>
                        {(tcpdump.topProtocols || []).map((item) => (
                          <Chip
                            key={`proto-${item.protocol}`}
                            size="small"
                            variant="outlined"
                            label={`${item.protocol}:${item.count}`}
                          />
                        ))}
                      </Stack>
                      <Typography variant="subtitle2">Top Destination Ports</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={0.8}>
                        {(tcpdump.topServices || []).map((item) => (
                          <Chip
                            key={`svc-${item.port}`}
                            size="small"
                            variant="outlined"
                            label={`${item.port}/${item.service}:${item.count}`}
                          />
                        ))}
                      </Stack>
                    </>
                  ) : (
                    <Alert severity={tcpdump?.permissionRequired ? "info" : "warning"}>
                      {tcpdump?.note || "tcpdump telemetry unavailable."}
                      {tcpdump?.error ? ` ${tcpdump.error}` : ""}
                    </Alert>
                  )}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={sectionPaperStyles()}>
                <Stack spacing={1.2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    tcpdump Device Traffic Report
                  </Typography>
                  <Divider />
                  {tcpdump?.available ? (
                    <TableContainer sx={{ maxHeight: 340 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>IP</TableCell>
                            <TableCell>MAC</TableCell>
                            <TableCell>Host</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Packets</TableCell>
                            <TableCell>Bytes</TableCell>
                            <TableCell>Top Ports</TableCell>
                            <TableCell>DNS Queries</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(tcpdump.devices || []).length ? (
                            tcpdump.devices.map((device) => (
                              <TableRow key={device.key}>
                                <TableCell>{valueOrDash(device.ip)}</TableCell>
                                <TableCell>{valueOrDash(device.mac)}</TableCell>
                                <TableCell>{valueOrDash(device.host)}</TableCell>
                                <TableCell>{valueOrDash(device.role)}</TableCell>
                                <TableCell>{valueOrDash(device.packets)}</TableCell>
                                <TableCell>{formatBytes(device.bytes)}</TableCell>
                                <TableCell>
                                  {(device.topDstPorts || []).length
                                    ? device.topDstPorts
                                        .map((port) => `${port.port}/${port.service}(${port.count})`)
                                        .join(", ")
                                    : "—"}
                                </TableCell>
                                <TableCell>
                                  {(device.dnsQueries || []).length
                                    ? device.dnsQueries.join(", ")
                                    : "—"}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8}>
                                <Typography variant="body2" color="text.secondary">
                                  No device traffic entries were parsed from tcpdump output.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity={tcpdump?.permissionRequired ? "info" : "warning"}>
                      tcpdump device report unavailable. {tcpdump?.error || tcpdump?.note || ""}
                    </Alert>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={sectionPaperStyles()}>
                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NetworkCheckIcon fontSize="small" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Latency to google.com
                    </Typography>
                  </Stack>
                  <Divider />
                  <Grid container spacing={1}>
                    {[
                      ["Method", latency?.method || "—"],
                      ["Min", formatMs(latency?.minMs)],
                      ["Avg", formatMs(latency?.avgMs)],
                      ["Max", formatMs(latency?.maxMs)],
                      ["Jitter", formatMs(latency?.jitterMs)],
                      [
                        "Packet Loss",
                        latency?.packetLossPct == null
                          ? "—"
                          : `${Number(latency.packetLossPct).toFixed(2)}%`,
                      ],
                    ].map((row) => (
                      <Grid key={row[0]} size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">
                          {row[0]}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {valueOrDash(row[1])}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                  <Typography variant="subtitle2">Probe Samples</Typography>
                  <Stack spacing={0.5}>
                    {(latency?.samplesMs || []).length ? (
                      latency.samplesMs.map((sample, index) => (
                        <Typography
                          key={`latency-sample-${index + 1}`}
                          variant="body2"
                          sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                        >
                          #{index + 1}: {formatMs(sample)}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No per-sample latency available.
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper elevation={0} sx={sectionPaperStyles()}>
                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <RouteIcon fontSize="small" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Traceroute to google.com
                    </Typography>
                  </Stack>
                  <Divider />
                  {traceroute?.available ? (
                    <TableContainer sx={{ maxHeight: 300 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Hop</TableCell>
                            <TableCell>Host</TableCell>
                            <TableCell>IP</TableCell>
                            <TableCell>RTT (avg)</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {traceroute.hops.map((hop) => (
                            <TableRow key={`hop-${hop.hop}`}>
                              <TableCell>{hop.hop}</TableCell>
                              <TableCell>{valueOrDash(hop.host)}</TableCell>
                              <TableCell>{valueOrDash(hop.ip)}</TableCell>
                              <TableCell>{formatMs(hop.avgRttMs)}</TableCell>
                              <TableCell>{hop.timedOut ? "timeout" : "ok"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="warning">
                      Traceroute is unavailable in this runtime. {traceroute?.error || ""}
                    </Alert>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={0} sx={sectionPaperStyles()}>
            <Stack spacing={1.2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Optimization Recommendations
              </Typography>
              <Divider />
              <Stack spacing={1}>
                {allRecommendations.map((recommendation, index) => (
                  <Paper
                    key={`${recommendation.title}-${index}`}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Chip
                        size="small"
                        label={recommendation.severity}
                        color={severityToColor(recommendation.severity)}
                      />
                      <Chip size="small" variant="outlined" label={recommendation.source} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {recommendation.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {recommendation.detail}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      {recommendation.recommendation}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={sectionPaperStyles()}>
            <Stack spacing={1.2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Raw Command Previews
              </Typography>
              <Divider />
              <Stack spacing={1}>
                {[
                  {
                    label: "Latency Raw",
                    value: serverDiagnostics?.latency?.rawOutput || "No raw output",
                  },
                  {
                    label: "Traceroute Raw",
                    value: serverDiagnostics?.traceroute?.rawOutput || "No raw output",
                  },
                  {
                    label: "Neighbor Table Raw",
                    value: serverDiagnostics?.neighbors?.rawPreview || "No raw output",
                  },
                  {
                    label: "tcpdump Raw",
                    value: serverDiagnostics?.tcpdump?.rawPreview || "No raw output",
                  },
                  {
                    label: "dig A Raw",
                    value: serverDiagnostics?.domainDns?.dig?.rawByType?.A || "No raw output",
                  },
                ].map((item) => (
                  <Box component="details" key={item.label} open={item.label === "Latency Raw"}>
                    <Box
                      component="summary"
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        mb: 0.6,
                      }}
                    >
                      {item.label}
                    </Box>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        p: 1.2,
                        overflowX: "auto",
                        borderRadius: 2,
                        backgroundColor: "rgba(15, 23, 42, 0.08)",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                        fontSize: "0.74rem",
                      }}
                    >
                      {item.value}
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Limitation: per-device Wi-Fi band for all connected clients requires router/AP
                station telemetry and is not derivable from browser + ARP alone.
              </Typography>
            </Stack>
          </Paper>
        </>
      ) : null}
    </Box>
  );
}
