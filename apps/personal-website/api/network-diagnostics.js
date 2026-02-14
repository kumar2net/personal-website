import os from "node:os";
import fs from "node:fs/promises";
import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import net from "node:net";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_TARGET = "google.com";
const DEFAULT_DOMAIN = "kumar2net.com";
const MAX_BUFFER_BYTES = 1024 * 1024;
const TCPDUMP_PACKET_LIMIT = 180;
const TCPDUMP_TIMEOUT_MS = 7000;
const HOSTNAME_PATTERN =
  /^(?=.{1,253}$)(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;

const DIG_TYPES = ["A", "AAAA", "NS", "MX", "TXT", "CAA"];
const WELL_KNOWN_PORTS = {
  53: "dns",
  67: "dhcp-server",
  68: "dhcp-client",
  80: "http",
  123: "ntp",
  137: "netbios-ns",
  138: "netbios-dgm",
  139: "netbios-ssn",
  443: "https",
  445: "smb",
  5353: "mdns",
  1900: "ssdp",
  3478: "stun",
};

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

function getQueryParam(req, key, fallbackValue) {
  if (req?.query && key in req.query) {
    const value = req.query[key];
    return Array.isArray(value) ? value[0] : value;
  }

  try {
    const parsed = new URL(req.url, "http://localhost");
    const value = parsed.searchParams.get(key);
    return value ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function normalizeHostname(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return fallback;
  }
  if (HOSTNAME_PATTERN.test(normalized)) {
    return normalized;
  }
  return fallback;
}

function clipText(value, maxLines = 80) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  return value
    .split(/\r?\n/)
    .slice(0, maxLines)
    .join("\n");
}

function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== "string") {
    return null;
  }
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function mean(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stddev(values) {
  if (!Array.isArray(values) || values.length <= 1) {
    return null;
  }
  const avg = mean(values);
  if (avg == null) {
    return null;
  }
  const variance =
    values.reduce((sum, value) => {
      const diff = value - avg;
      return sum + diff * diff;
    }, 0) / values.length;
  return Math.sqrt(variance);
}

function summarizeSamples(samples) {
  if (!Array.isArray(samples) || samples.length === 0) {
    return {
      minMs: null,
      avgMs: null,
      maxMs: null,
      jitterMs: null,
    };
  }
  const numeric = samples.filter((value) => Number.isFinite(value));
  if (numeric.length === 0) {
    return {
      minMs: null,
      avgMs: null,
      maxMs: null,
      jitterMs: null,
    };
  }
  return {
    minMs: Number(Math.min(...numeric).toFixed(3)),
    avgMs: Number(mean(numeric).toFixed(3)),
    maxMs: Number(Math.max(...numeric).toFixed(3)),
    jitterMs: Number((stddev(numeric) ?? 0).toFixed(3)),
  };
}

async function runCommand(command, args = [], timeoutMs = 8000) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      timeout: timeoutMs,
      maxBuffer: MAX_BUFFER_BYTES,
    });
    return {
      ok: true,
      command,
      args,
      stdout: (stdout || "").toString().trim(),
      stderr: (stderr || "").toString().trim(),
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      command,
      args,
      stdout: (error?.stdout || "").toString().trim(),
      stderr: (error?.stderr || "").toString().trim(),
      error: error?.message || "Command failed",
      code: error?.code ?? null,
    };
  }
}

function normalizeSpairportValue(value) {
  if (typeof value !== "string") {
    return value ?? null;
  }
  return value
    .replace(/^spairport_(security_mode_|status_|network_type_)/, "")
    .replace(/_/g, " ")
    .trim();
}

function parseSignalNoisePair(value) {
  if (typeof value !== "string") {
    return { signalDbm: null, noiseDbm: null };
  }
  const match = value.match(/(-?\d+)\s*dBm\s*\/\s*(-?\d+)\s*dBm/i);
  if (!match) {
    return { signalDbm: null, noiseDbm: null };
  }
  return {
    signalDbm: Number(match[1]),
    noiseDbm: Number(match[2]),
  };
}

function inferBandFromChannel(channelLabel) {
  if (typeof channelLabel !== "string") {
    return null;
  }
  const normalized = channelLabel.toLowerCase();
  if (normalized.includes("2ghz")) {
    return "2.4 GHz";
  }
  if (normalized.includes("5ghz")) {
    return "5 GHz";
  }
  if (normalized.includes("6ghz")) {
    return "6 GHz";
  }
  return null;
}

function parseDarwinWifiProfilerOutput(stdout) {
  try {
    const parsed = JSON.parse(stdout);
    const entries = Array.isArray(parsed?.SPAirPortDataType)
      ? parsed.SPAirPortDataType
      : [];
    const interfaces = entries.flatMap((entry) =>
      Array.isArray(entry?.spairport_airport_interfaces)
        ? entry.spairport_airport_interfaces
        : [],
    );
    const connected =
      interfaces.find(
        (item) => item?.spairport_status_information === "spairport_status_connected",
      ) || interfaces[0];

    if (!connected) {
      return null;
    }

    const current = connected?.spairport_current_network_information || {};
    const signalNoise = parseSignalNoisePair(current?.spairport_signal_noise);
    const snrDb =
      signalNoise.signalDbm != null && signalNoise.noiseDbm != null
        ? Number((signalNoise.signalDbm - signalNoise.noiseDbm).toFixed(1))
        : null;

    const nearbyNetworks = Array.isArray(
      connected?.spairport_airport_other_local_wireless_networks,
    )
      ? connected.spairport_airport_other_local_wireless_networks.slice(0, 24).map((item) => ({
          ssid: item?._name || null,
          channel: item?.spairport_network_channel || null,
          band: inferBandFromChannel(item?.spairport_network_channel || ""),
          phyMode: item?.spairport_network_phymode || null,
          security: normalizeSpairportValue(item?.spairport_security_mode),
          signalNoise: item?.spairport_signal_noise || null,
        }))
      : [];

    return {
      source: "system_profiler",
      interface: connected?._name || null,
      status: normalizeSpairportValue(connected?.spairport_status_information),
      ssid: current?._name || null,
      channel: current?.spairport_network_channel || null,
      band: inferBandFromChannel(current?.spairport_network_channel || ""),
      countryCode: current?.spairport_network_country_code || null,
      phyMode: current?.spairport_network_phymode || null,
      security: normalizeSpairportValue(current?.spairport_security_mode),
      mcsIndex: toNumber(current?.spairport_network_mcs),
      txRateMbps: toNumber(current?.spairport_network_rate),
      rssiDbm: signalNoise.signalDbm,
      noiseDbm: signalNoise.noiseDbm,
      snrDb,
      nearbyNetworks,
    };
  } catch {
    return null;
  }
}

function splitNmcliFields(row) {
  const fields = [];
  let current = "";
  let escaped = false;

  for (const char of row) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === ":") {
      fields.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  fields.push(current);
  return fields;
}

function parseLinuxNmcliOutput(stdout) {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  const active = lines.find((line) => line.startsWith("*:"));
  if (!active) {
    return null;
  }

  const [inUse, ssid, bssid, channel, frequency, rate, signal, security] =
    splitNmcliFields(active);
  const frequencyMhz = toNumber(frequency);
  const band =
    frequencyMhz == null
      ? null
      : frequencyMhz < 3000
        ? "2.4 GHz"
        : frequencyMhz < 5900
          ? "5 GHz"
          : "6 GHz";

  return {
    source: "nmcli",
    inUse: inUse === "*",
    ssid: ssid || null,
    bssid: bssid || null,
    channel: channel || null,
    frequencyMhz,
    txRateMbps: toNumber(rate),
    signalPct: toNumber(signal),
    security: security || null,
    band,
  };
}

async function collectWifiSnapshot() {
  if (process.platform === "darwin") {
    const profiler = await runCommand(
      "system_profiler",
      ["SPAirPortDataType", "-json"],
      12000,
    );
    if (profiler.ok && profiler.stdout) {
      const parsed = parseDarwinWifiProfilerOutput(profiler.stdout);
      if (parsed) {
        return {
          available: true,
          ...parsed,
          rawPreview: clipText(profiler.stdout, 40),
        };
      }
    }
    return {
      available: false,
      source: "system_profiler",
      error: profiler.error || "Unable to parse Wi-Fi telemetry",
    };
  }

  const nmcli = await runCommand(
    "nmcli",
    ["-t", "-f", "IN-USE,SSID,BSSID,CHAN,FREQ,RATE,SIGNAL,SECURITY", "dev", "wifi"],
    5000,
  );
  if (nmcli.ok && nmcli.stdout) {
    const parsed = parseLinuxNmcliOutput(nmcli.stdout);
    if (parsed) {
      return {
        available: true,
        ...parsed,
      };
    }
  }

  return {
    available: false,
    source: "none",
    error: "Wi-Fi adapter telemetry is unavailable on this runtime.",
  };
}

function parseDnsResolversFromScutil(stdout) {
  const resolvers = new Set();
  const matches = stdout.matchAll(/nameserver\[\d+\]\s*:\s*([^\s]+)/g);
  for (const match of matches) {
    if (match?.[1]) {
      resolvers.add(match[1]);
    }
  }
  return Array.from(resolvers);
}

function parseResolvConfResolvers(content) {
  if (typeof content !== "string") {
    return [];
  }
  const resolvers = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*nameserver\s+([^\s#]+)/i);
    if (match?.[1]) {
      resolvers.push(match[1]);
    }
  }
  return resolvers;
}

async function collectDnsResolvers() {
  const allResolvers = new Set(dns.getServers());
  const sources = [];

  if (process.platform === "darwin") {
    const scutil = await runCommand("scutil", ["--dns"], 5000);
    if (scutil.ok) {
      parseDnsResolversFromScutil(scutil.stdout).forEach((server) =>
        allResolvers.add(server),
      );
      sources.push("scutil");
    }
  }

  try {
    const resolvConf = await fs.readFile("/etc/resolv.conf", "utf8");
    parseResolvConfResolvers(resolvConf).forEach((server) => allResolvers.add(server));
    sources.push("/etc/resolv.conf");
  } catch {
    // Ignore environments without resolv.conf.
  }

  return {
    servers: Array.from(allResolvers),
    sources,
  };
}

function collectNetworkInterfaces() {
  const raw = os.networkInterfaces();
  return Object.entries(raw).flatMap(([name, entries]) =>
    (entries || []).map((item) => ({
      name,
      family: item?.family || null,
      address: item?.address || null,
      cidr: item?.cidr || null,
      netmask: item?.netmask || null,
      mac: item?.mac || null,
      internal: Boolean(item?.internal),
      scopeid: item?.scopeid ?? null,
    })),
  );
}

function parseArpOutput(stdout) {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  const entries = [];

  for (const line of lines) {
    const match = line.match(
      /^([^\s]+)\s+\(([^)]+)\)\s+at\s+([^\s]+)\s+on\s+([^\s]+)(?:\s+ifscope)?(?:\s+([^\[]+))?/i,
    );
    if (!match) {
      continue;
    }
    const hostRaw = match[1];
    const ip = match[2];
    const macRaw = match[3];
    const iface = match[4];
    const stateMatch = line.match(/\[([^\]]+)\]/);
    entries.push({
      host: hostRaw === "?" ? null : hostRaw,
      ip,
      mac: macRaw === "(incomplete)" ? null : macRaw,
      interface: iface,
      state: stateMatch?.[1] || null,
      band: "unknown",
    });
  }

  return entries;
}

function parseIpNeighOutput(stdout) {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  const entries = [];
  for (const line of lines) {
    const match = line.match(
      /^([0-9a-fA-F:.]+)\s+dev\s+([^\s]+)(?:\s+lladdr\s+([^\s]+))?\s+([A-Z_]+)$/i,
    );
    if (!match) {
      continue;
    }
    entries.push({
      host: null,
      ip: match[1],
      mac: match[3] || null,
      interface: match[2],
      state: match[4],
      band: "unknown",
    });
  }
  return entries;
}

async function collectNeighbors() {
  const strategies =
    process.platform === "darwin"
      ? [{ command: "arp", args: ["-an"], parser: parseArpOutput }]
      : [
          { command: "arp", args: ["-an"], parser: parseArpOutput },
          { command: "ip", args: ["neigh"], parser: parseIpNeighOutput },
        ];

  for (const strategy of strategies) {
    const result = await runCommand(strategy.command, strategy.args, 6000);
    if (!result.ok && !result.stdout) {
      continue;
    }
    const parsed = strategy.parser(result.stdout || "");
    return {
      source: strategy.command,
      entries: parsed.slice(0, 256),
      rawPreview: clipText(result.stdout, 40),
      error: result.ok ? null : result.error,
      note:
        "Per-device Wi-Fi band is not exposed by ARP; router/AP telemetry is required for per-station band mapping.",
    };
  }

  return {
    source: "none",
    entries: [],
    note:
      "Neighbor table is unavailable in this runtime. Run locally to inspect ARP neighbors.",
  };
}

function normalizeMac(value) {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return /^[0-9a-f]{2}(?::[0-9a-f]{2}){5}$/.test(normalized)
    ? normalized
    : null;
}

function isIpv4Address(value) {
  return typeof value === "string" && /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
}

function parseEndpointToken(token) {
  const cleaned = String(token || "").trim().replace(/[,\s]+$/g, "");
  if (!cleaned) {
    return { address: null, port: null };
  }

  const ipv4WithPort = cleaned.match(/^(\d{1,3}(?:\.\d{1,3}){3})\.(\d+)$/);
  if (ipv4WithPort) {
    return {
      address: ipv4WithPort[1],
      port: Number(ipv4WithPort[2]),
    };
  }

  if (cleaned.includes(":")) {
    const ipv6WithPort = cleaned.match(/^(.*)\.(\d+)$/);
    if (ipv6WithPort && ipv6WithPort[1].includes(":")) {
      return {
        address: ipv6WithPort[1],
        port: Number(ipv6WithPort[2]),
      };
    }
    return { address: cleaned, port: null };
  }

  const hostWithPort = cleaned.match(/^(.*)\.(\d+)$/);
  if (hostWithPort) {
    return {
      address: hostWithPort[1],
      port: Number(hostWithPort[2]),
    };
  }

  return { address: cleaned, port: null };
}

function detectL4Protocol(payload, srcPort, dstPort) {
  if (srcPort === 5353 || dstPort === 5353) {
    return "mdns";
  }
  if (srcPort === 53 || dstPort === 53) {
    return "dns";
  }
  if (srcPort === 67 || dstPort === 67 || srcPort === 68 || dstPort === 68) {
    return "dhcp";
  }
  if (/ICMP6?|echo request|echo reply/i.test(payload)) {
    return "icmp";
  }
  if (/Flags \[[^\]]*S[^\]]*\]/i.test(payload)) {
    return "tcp-syn";
  }
  if (/Flags \[/i.test(payload)) {
    return "tcp";
  }
  if (/UDP/i.test(payload)) {
    return "udp";
  }
  return "ip";
}

function extractDnsQueries(payload) {
  const tokens = [];
  const matches = payload.matchAll(
    /\b(?:\(QM\)\s+)?(?:A|AAAA|PTR|SRV|TXT|MX|CAA)\?\s+([A-Za-z0-9._:-]+)/g,
  );
  for (const match of matches) {
    if (match?.[1]) {
      tokens.push(match[1].replace(/\.$/, ""));
    }
  }
  return tokens;
}

function incrementCounter(map, key, incrementBy = 1) {
  map.set(key, (map.get(key) || 0) + incrementBy);
}

function mapToSortedList(map, limit = 8, formatter = (key, count) => ({ key, count })) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => formatter(key, count));
}

function inferDeviceRole(device) {
  const ports = new Set(device.topDstPorts.map((entry) => entry.port));
  if (ports.has(53)) {
    return "dns-active";
  }
  if (ports.has(67) || ports.has(68)) {
    return "dhcp-active";
  }
  if (ports.has(5353)) {
    return "service-discovery-active";
  }
  if (ports.has(443) && device.packets > 20) {
    return "web-heavy-client";
  }
  return "generic-host";
}

function parseTcpdumpCapture(stdout, neighbors) {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  const protocolCounts = new Map();
  const serviceCounts = new Map();
  const deviceMap = new Map();
  const conversationMap = new Map();

  const neighborByIp = new Map();
  const neighborByMac = new Map();
  for (const entry of neighbors?.entries || []) {
    if (entry?.ip) {
      neighborByIp.set(entry.ip, entry);
    }
    const normalizedMac = normalizeMac(entry?.mac);
    if (normalizedMac) {
      neighborByMac.set(normalizedMac, entry);
    }
  }

  const ensureDevice = (ip, mac) => {
    const normalizedMac = normalizeMac(mac);
    const key = ip || normalizedMac;
    if (!key) {
      return null;
    }
    if (!deviceMap.has(key)) {
      deviceMap.set(key, {
        key,
        ip: isIpv4Address(ip) ? ip : ip || null,
        mac: normalizedMac,
        packets: 0,
        bytes: 0,
        ingressPackets: 0,
        egressPackets: 0,
        protocolCounter: new Map(),
        dstPortCounter: new Map(),
        dnsQueries: new Set(),
        peers: new Set(),
      });
    }
    return deviceMap.get(key);
  };

  let packetCount = 0;

  for (const line of lines) {
    const match = line.match(
      /^\s*([0-9.]+)\s+([0-9a-f]{2}(?::[0-9a-f]{2}){5})\s*>\s*([0-9a-f]{2}(?::[0-9a-f]{2}){5}),\s+ethertype\s+([^,]+),\s+length\s+(\d+):\s*(.+)$/i,
    );
    if (!match) {
      continue;
    }

    const srcMac = normalizeMac(match[2]);
    const dstMac = normalizeMac(match[3]);
    const etherType = match[4].toLowerCase();
    const length = Number(match[5]) || 0;
    const payload = match[6];

    let srcAddress = null;
    let srcPort = null;
    let dstAddress = null;
    let dstPort = null;
    let protocol = "other";
    let dnsQueries = [];

    if (payload.startsWith("ARP,")) {
      protocol = "arp";
      const arpRequest = payload.match(
        /^ARP,\s+Request who-has\s+([0-9.]+)\s+tell\s+([0-9.]+)/i,
      );
      const arpReply = payload.match(/^ARP,\s+Reply\s+([0-9.]+)\s+is-at\s+([0-9a-f:]+)/i);
      if (arpRequest) {
        srcAddress = arpRequest[2];
        dstAddress = arpRequest[1];
      } else if (arpReply) {
        srcAddress = arpReply[1];
      }
    } else {
      const ipMatch = payload.match(/^(IP6?)\s+(.+?)\s+>\s+(.+?):\s*(.*)$/);
      if (ipMatch) {
        const src = parseEndpointToken(ipMatch[2]);
        const dst = parseEndpointToken(ipMatch[3]);
        srcAddress = src.address;
        dstAddress = dst.address;
        srcPort = src.port;
        dstPort = dst.port;
        protocol = detectL4Protocol(ipMatch[4], srcPort, dstPort);
        dnsQueries = extractDnsQueries(ipMatch[4]);
      } else if (etherType.includes("ip")) {
        protocol = "ip";
      }
    }

    packetCount += 1;
    incrementCounter(protocolCounts, protocol);
    if (dstPort != null) {
      incrementCounter(serviceCounts, dstPort);
    }

    const srcDevice = ensureDevice(srcAddress, srcMac);
    const dstDevice = ensureDevice(dstAddress, dstMac);

    if (srcDevice) {
      srcDevice.packets += 1;
      srcDevice.bytes += length;
      srcDevice.egressPackets += 1;
      incrementCounter(srcDevice.protocolCounter, protocol);
      if (dstPort != null) {
        incrementCounter(srcDevice.dstPortCounter, dstPort);
      }
      dnsQueries.forEach((query) => srcDevice.dnsQueries.add(query));
      if (dstAddress || dstMac) {
        srcDevice.peers.add(dstAddress || dstMac);
      }
    }

    if (dstDevice) {
      dstDevice.packets += 1;
      dstDevice.bytes += length;
      dstDevice.ingressPackets += 1;
      incrementCounter(dstDevice.protocolCounter, protocol);
      if (srcAddress || srcMac) {
        dstDevice.peers.add(srcAddress || srcMac);
      }
    }

    if (srcDevice && dstDevice) {
      const conversationKey = `${srcDevice.key}->${dstDevice.key}|${protocol}`;
      if (!conversationMap.has(conversationKey)) {
        conversationMap.set(conversationKey, {
          src: srcDevice.key,
          dst: dstDevice.key,
          protocol,
          packets: 0,
          bytes: 0,
        });
      }
      const conversation = conversationMap.get(conversationKey);
      conversation.packets += 1;
      conversation.bytes += length;
    }
  }

  const devices = Array.from(deviceMap.values())
    .map((device) => {
      const neighbor =
        (device.ip && neighborByIp.get(device.ip)) ||
        (device.mac && neighborByMac.get(device.mac)) ||
        null;
      const topDstPorts = mapToSortedList(
        device.dstPortCounter,
        8,
        (port, count) => ({
          port: Number(port),
          count,
          service: WELL_KNOWN_PORTS[Number(port)] || "unknown",
        }),
      );
      const topProtocols = mapToSortedList(
        device.protocolCounter,
        6,
        (protocolName, count) => ({ protocol: protocolName, count }),
      );
      const dnsQueries = Array.from(device.dnsQueries).slice(0, 10);
      return {
        key: device.key,
        ip: device.ip || neighbor?.ip || null,
        mac: device.mac || normalizeMac(neighbor?.mac),
        host: neighbor?.host || null,
        interface: neighbor?.interface || null,
        band: neighbor?.band || "unknown",
        state: neighbor?.state || null,
        packets: device.packets,
        bytes: device.bytes,
        peerCount: device.peers.size,
        ingressPackets: device.ingressPackets,
        egressPackets: device.egressPackets,
        topProtocols,
        topDstPorts,
        dnsQueries,
        role: inferDeviceRole({ topDstPorts, packets: device.packets }),
      };
    })
    .sort((a, b) => b.packets - a.packets);

  const conversations = Array.from(conversationMap.values())
    .sort((a, b) => b.packets - a.packets)
    .slice(0, 25);

  return {
    packetCount,
    devices: devices.slice(0, 40),
    topProtocols: mapToSortedList(
      protocolCounts,
      10,
      (protocolName, count) => ({ protocol: protocolName, count }),
    ),
    topServices: mapToSortedList(serviceCounts, 10, (port, count) => ({
      port: Number(port),
      count,
      service: WELL_KNOWN_PORTS[Number(port)] || "unknown",
    })),
    conversations,
    silentNeighbors: (neighbors?.entries || []).filter((entry) => {
      if (!entry?.ip && !entry?.mac) {
        return false;
      }
      const normalizedMac = normalizeMac(entry.mac);
      return !devices.some(
        (device) =>
          (entry.ip && device.ip === entry.ip) ||
          (normalizedMac && normalizeMac(device.mac) === normalizedMac),
      );
    }).length,
  };
}

async function detectPrimaryInterface() {
  if (process.platform === "darwin") {
    const route = await runCommand("route", ["-n", "get", "default"], 4000);
    if (route.ok || route.stdout) {
      const match = route.stdout.match(/interface:\s+([^\s]+)/i);
      if (match?.[1]) {
        return match[1];
      }
    }
  }

  if (process.platform === "linux") {
    const route = await runCommand("ip", ["route", "show", "default"], 4000);
    if (route.ok || route.stdout) {
      const match = route.stdout.match(/\bdev\s+([^\s]+)/i);
      if (match?.[1]) {
        return match[1];
      }
    }
  }

  const interfaces = os.networkInterfaces();
  for (const [name, entries] of Object.entries(interfaces)) {
    if (
      (entries || []).some(
        (entry) => entry?.family === "IPv4" && !entry?.internal && entry?.address,
      )
    ) {
      return name;
    }
  }

  return null;
}

async function collectTcpdumpTelemetry({ wifi, neighbors }) {
  const preferredInterface = wifi?.interface || (neighbors?.entries?.[0]?.interface ?? null);
  const captureInterface = preferredInterface || (await detectPrimaryInterface());

  if (!captureInterface) {
    return {
      available: false,
      source: "tcpdump",
      error: "Unable to determine a capture interface.",
      permissionRequired: false,
      note:
        "No active capture interface was discovered. Ensure a network interface is connected.",
    };
  }

  const filterExpression = "arp or ip or ip6";
  const tcpdump = await runCommand(
    "tcpdump",
    [
      "-i",
      captureInterface,
      "-nn",
      "-e",
      "-l",
      "-tt",
      "-c",
      String(TCPDUMP_PACKET_LIMIT),
      filterExpression,
    ],
    TCPDUMP_TIMEOUT_MS,
  );

  const combinedError = [tcpdump.error, tcpdump.stderr].filter(Boolean).join(" | ");
  const permissionRequired = /permission denied|cannot open bpf|operation not permitted/i.test(
    combinedError,
  );
  const parsed = parseTcpdumpCapture(tcpdump.stdout || "", neighbors);

  if (permissionRequired) {
    return {
      available: false,
      source: "tcpdump",
      interface: captureInterface,
      command: `tcpdump -i ${captureInterface} -nn -e -l -tt -c ${TCPDUMP_PACKET_LIMIT} '${filterExpression}'`,
      error: combinedError || "tcpdump capture permission denied",
      permissionRequired: true,
      note:
        "Grant packet-capture permissions (or run with elevated privileges) to enable per-device traffic details.",
      rawPreview: clipText(tcpdump.stderr || tcpdump.stdout, 20),
    };
  }

  if (parsed.packetCount === 0) {
    return {
      available: false,
      source: "tcpdump",
      interface: captureInterface,
      command: `tcpdump -i ${captureInterface} -nn -e -l -tt -c ${TCPDUMP_PACKET_LIMIT} '${filterExpression}'`,
      error: tcpdump.ok ? null : combinedError || "No packets captured within capture window.",
      permissionRequired: false,
      note:
        "No packets matched the capture window. Re-run diagnostics while devices generate traffic.",
      rawPreview: clipText(tcpdump.stdout || tcpdump.stderr, 20),
    };
  }

  return {
    available: true,
    source: "tcpdump",
    interface: captureInterface,
    command: `tcpdump -i ${captureInterface} -nn -e -l -tt -c ${TCPDUMP_PACKET_LIMIT} '${filterExpression}'`,
    captureLimit: TCPDUMP_PACKET_LIMIT,
    captureTimeoutMs: TCPDUMP_TIMEOUT_MS,
    partialCapture: !tcpdump.ok,
    error: tcpdump.ok ? null : combinedError || null,
    permissionRequired: false,
    ...parsed,
    rawPreview: clipText(tcpdump.stdout || "", 60),
  };
}

function parsePingOutput(stdout) {
  const sampleMatches = stdout.matchAll(/time[=<]([0-9.]+)\s*ms/gi);
  const samplesMs = Array.from(sampleMatches)
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value));
  const packetLossMatch = stdout.match(/([0-9.]+)%\s*packet loss/i);
  const packetLossPct = packetLossMatch ? Number(packetLossMatch[1]) : null;
  const summary = summarizeSamples(samplesMs);
  return {
    samplesMs,
    packetLossPct,
    ...summary,
  };
}

async function tcpProbe(host, port = 443, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const started = Date.now();
    const socket = new net.Socket();
    let settled = false;

    const finalize = (payload) => {
      if (settled) {
        return;
      }
      settled = true;
      socket.destroy();
      resolve(payload);
    };

    socket.setTimeout(timeoutMs);

    socket.once("connect", () => {
      const duration = Date.now() - started;
      finalize({ ok: true, ms: duration });
    });

    socket.once("timeout", () => {
      finalize({ ok: false, error: "timeout" });
    });

    socket.once("error", (error) => {
      finalize({ ok: false, error: error?.message || "socket error" });
    });

    socket.connect(port, host);
  });
}

async function measureTcpConnectLatency(targetHost, attempts = 5) {
  const runs = [];
  for (let index = 0; index < attempts; index += 1) {
    // Keep probes serial to avoid queueing effects in local NAT/firewall.
    // eslint-disable-next-line no-await-in-loop
    const probe = await tcpProbe(targetHost, 443);
    runs.push({
      seq: index + 1,
      ok: probe.ok,
      ms: probe.ok ? probe.ms : null,
      error: probe.ok ? null : probe.error,
    });
  }
  const samplesMs = runs.filter((item) => item.ok).map((item) => item.ms);
  const packetLossPct = Number(
    (((attempts - samplesMs.length) / attempts) * 100).toFixed(2),
  );
  return {
    method: "tcp-connect:443",
    samplesMs,
    packetLossPct,
    runs,
    ...summarizeSamples(samplesMs),
  };
}

async function collectLatency(targetHost) {
  const ping = await runCommand("ping", ["-c", "5", targetHost], 12000);
  if (ping.ok && ping.stdout) {
    const parsed = parsePingOutput(ping.stdout);
    return {
      available: true,
      method: "icmp-ping",
      target: targetHost,
      command: `ping -c 5 ${targetHost}`,
      ...parsed,
      rawOutput: clipText(ping.stdout, 40),
    };
  }

  const tcpFallback = await measureTcpConnectLatency(targetHost, 5);
  return {
    available: true,
    target: targetHost,
    fallbackFrom: "icmp-ping",
    pingError: ping.error || "ICMP ping unavailable on this runtime",
    ...tcpFallback,
  };
}

function parseTracerouteOutput(stdout) {
  const lines = stdout.split(/\r?\n/).filter(Boolean);
  const hops = [];

  for (const line of lines) {
    const hopMatch = line.match(/^\s*(\d+)\s+(.+)$/);
    if (!hopMatch) {
      continue;
    }
    const hop = Number(hopMatch[1]);
    const rest = hopMatch[2];
    const samples = Array.from(rest.matchAll(/([0-9]+(?:\.[0-9]+)?)\s*ms/gi))
      .map((match) => Number(match[1]))
      .filter((value) => Number.isFinite(value));
    const hostIpMatch = rest.match(/^([^\s(]+)\s+\(([\da-fA-F:.]+)\)/);
    let host = null;
    let ip = null;
    if (hostIpMatch) {
      host = hostIpMatch[1];
      ip = hostIpMatch[2];
    } else {
      const ipMatch = rest.match(/^([\da-fA-F:.]+)\s+/);
      if (ipMatch) {
        host = ipMatch[1];
        ip = ipMatch[1];
      }
    }

    hops.push({
      hop,
      host,
      ip,
      samplesMs: samples,
      avgRttMs:
        samples.length > 0 ? Number(mean(samples).toFixed(3)) : null,
      timedOut: samples.length === 0 && rest.includes("*"),
    });
  }

  return hops;
}

async function collectTraceroute(targetHost) {
  const strategies =
    process.platform === "win32"
      ? [{ command: "tracert", args: ["-d", "-h", "12", "-w", "1000", targetHost] }]
      : [{ command: "traceroute", args: ["-m", "12", "-q", "1", "-w", "1", targetHost] }];

  for (const strategy of strategies) {
    const run = await runCommand(strategy.command, strategy.args, 20000);
    if (!run.ok && !run.stdout) {
      continue;
    }

    const hops = parseTracerouteOutput(run.stdout || "");
    return {
      available: hops.length > 0,
      source: strategy.command,
      command: `${strategy.command} ${strategy.args.join(" ")}`,
      hops,
      rawOutput: clipText(run.stdout, 80),
      error: run.ok ? null : run.error,
    };
  }

  return {
    available: false,
    source: "none",
    hops: [],
    error: "Traceroute binary not available in this runtime.",
  };
}

function mapResolvedRecords(type, values) {
  if (!Array.isArray(values)) {
    return [];
  }
  if (type === "MX") {
    return values.map((item) => `${item.priority} ${item.exchange}`);
  }
  if (type === "TXT") {
    return values.map((item) =>
      Array.isArray(item) ? item.join("") : String(item),
    );
  }
  if (type === "CAA") {
    return values.map((item) => {
      if (!item || typeof item !== "object") {
        return String(item);
      }
      if (item.issue) {
        return `issue "${item.issue}"`;
      }
      if (item.issuewild) {
        return `issuewild "${item.issuewild}"`;
      }
      if (item.iodef) {
        return `iodef "${item.iodef}"`;
      }
      return JSON.stringify(item);
    });
  }
  if (type === "SOA") {
    return values.map(
      (item) =>
        `${item.nsname} hostmaster=${item.hostmaster} serial=${item.serial}`,
    );
  }
  return values.map((value) => String(value));
}

async function timedResolve(type, resolver) {
  const started = Date.now();
  try {
    const records = await resolver();
    return {
      type,
      ok: true,
      queryMs: Date.now() - started,
      records: mapResolvedRecords(type, Array.isArray(records) ? records : [records]),
      error: null,
    };
  } catch (error) {
    return {
      type,
      ok: false,
      queryMs: Date.now() - started,
      records: [],
      error: error?.code || error?.message || "lookup failed",
    };
  }
}

function parseDigAnswerLines(stdout) {
  const answers = [];
  const lines = stdout.split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith(";")) {
      continue;
    }
    const match = line.match(/^(\S+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(.+)$/);
    if (!match) {
      continue;
    }
    answers.push({
      name: match[1],
      ttl: Number(match[2]),
      cls: match[3],
      type: match[4],
      data: match[5],
    });
  }
  return answers;
}

async function runDigLookup(domain, type) {
  const result = await runCommand(
    "dig",
    [domain, type, "+time=2", "+tries=1", "+noall", "+answer", "+stats"],
    8000,
  );
  if (!result.ok && !result.stdout) {
    return {
      type,
      ok: false,
      queryMs: null,
      answers: [],
      error: result.error || "dig failed",
    };
  }
  const answers = parseDigAnswerLines(result.stdout || "");
  const queryMatch = (result.stdout || "").match(/Query time:\s+(\d+)\s+msec/i);
  return {
    type,
    ok: answers.length > 0 || result.ok,
    queryMs: queryMatch ? Number(queryMatch[1]) : null,
    answers,
    error: result.ok ? null : result.error,
    rawPreview: clipText(result.stdout, 20),
  };
}

async function collectDomainDns(domain) {
  const resolvers = {
    A: () => dnsPromises.resolve4(domain),
    AAAA: () => dnsPromises.resolve6(domain),
    NS: () => dnsPromises.resolveNs(domain),
    MX: () => dnsPromises.resolveMx(domain),
    TXT: () => dnsPromises.resolveTxt(domain),
    CAA:
      typeof dnsPromises.resolveCaa === "function"
        ? () => dnsPromises.resolveCaa(domain)
        : async () => {
            throw Object.assign(new Error("resolveCaa unsupported"), {
              code: "UNSUPPORTED",
            });
          },
    SOA: () => dnsPromises.resolveSoa(domain),
  };

  const nodeResolutions = await Promise.all(
    Object.entries(resolvers).map(([type, resolver]) => timedResolve(type, resolver)),
  );

  const nodeMap = Object.fromEntries(
    nodeResolutions.map((item) => [item.type, item.records]),
  );
  const nodeTimings = Object.fromEntries(
    nodeResolutions.map((item) => [item.type, item.queryMs]),
  );
  const nodeErrors = Object.fromEntries(
    nodeResolutions
      .filter((item) => !item.ok)
      .map((item) => [item.type, item.error || "lookup failed"]),
  );

  const digChecks = await Promise.all(DIG_TYPES.map((type) => runDigLookup(domain, type)));
  const digAvailable = digChecks.some((entry) => entry.ok || entry.answers.length > 0);

  const digMap = Object.fromEntries(
    digChecks.map((entry) => [entry.type, entry.answers.map((answer) => answer.data)]),
  );
  const digTimings = Object.fromEntries(
    digChecks.map((entry) => [entry.type, entry.queryMs]),
  );
  const digErrors = Object.fromEntries(
    digChecks
      .filter((entry) => !entry.ok && entry.error)
      .map((entry) => [entry.type, entry.error]),
  );

  const mergedRecords = {};
  Object.keys(resolvers).forEach((type) => {
    if (type in digMap && Array.isArray(digMap[type]) && digMap[type].length > 0) {
      mergedRecords[type] = digMap[type];
      return;
    }
    mergedRecords[type] = nodeMap[type] || [];
  });

  return {
    domain,
    records: mergedRecords,
    nodeDns: {
      timingsMs: nodeTimings,
      errors: nodeErrors,
    },
    dig: {
      available: digAvailable,
      timingsMs: digTimings,
      errors: digErrors,
      rawByType: Object.fromEntries(
        digChecks.map((entry) => [entry.type, entry.rawPreview || ""]),
      ),
    },
  };
}

function evaluateRecommendations({
  wifi,
  latency,
  traceroute,
  domainDns,
  dnsResolvers,
  neighbors,
  tcpdump,
}) {
  const recommendations = [];

  const add = (severity, title, detail, recommendation) => {
    recommendations.push({ severity, title, detail, recommendation });
  };

  if (latency?.packetLossPct != null && latency.packetLossPct >= 1.5) {
    add(
      "high",
      "Packet loss detected",
      `Measured packet loss is ${latency.packetLossPct}% to ${latency.target}.`,
      "Inspect WAN error counters, check Wi-Fi interference, and validate ISP last-mile quality.",
    );
  }

  if (latency?.avgMs != null && latency.avgMs >= 80) {
    add(
      "medium",
      "High round-trip latency",
      `Average RTT is ${latency.avgMs} ms to ${latency.target}.`,
      "Prefer wired uplink for latency-sensitive traffic and test alternate upstream DNS/ISP paths.",
    );
  }

  if (latency?.jitterMs != null && latency.jitterMs >= 15) {
    add(
      "medium",
      "Elevated jitter",
      `Latency jitter is ${latency.jitterMs} ms, which can affect real-time apps.`,
      "Enable SQM/Smart Queue Management on the router and reduce bufferbloat during peak usage.",
    );
  }

  if (wifi?.available && wifi?.snrDb != null && wifi.snrDb < 20) {
    add(
      "high",
      "Low Wi-Fi SNR",
      `Signal-to-noise ratio is ${wifi.snrDb} dB (${wifi.rssiDbm} / ${wifi.noiseDbm} dBm).`,
      "Reposition AP/client, reduce channel overlap, and prefer 5 GHz or 6 GHz where possible.",
    );
  }

  if (wifi?.available && wifi?.band === "2.4 GHz") {
    add(
      "info",
      "Client currently on 2.4 GHz",
      "2.4 GHz gives range but lower throughput and more interference in dense environments.",
      "For high-throughput or low-latency workloads, pin the device to 5 GHz/6 GHz SSID.",
    );
  }

  const timeoutHops = traceroute?.hops?.filter((hop) => hop.timedOut).length || 0;
  if (timeoutHops >= 2) {
    add(
      "medium",
      "Traceroute includes multiple timeout hops",
      `${timeoutHops} hop(s) did not return probe responses.`,
      "Some core routers rate-limit ICMP. If user traffic is affected, correlate with continuous latency and packet-loss probes.",
    );
  }

  const nsCount = domainDns?.records?.NS?.length || 0;
  if (nsCount > 0 && nsCount < 2) {
    add(
      "medium",
      "DNS authority redundancy is low",
      `Only ${nsCount} NS record(s) were observed for ${domainDns.domain}.`,
      "Use at least two authoritative nameservers across independent zones/providers.",
    );
  }

  const hasAaaa = (domainDns?.records?.AAAA?.length || 0) > 0;
  if (!hasAaaa) {
    add(
      "info",
      "No IPv6 AAAA records",
      `${domainDns?.domain || DEFAULT_DOMAIN} does not currently expose AAAA records.`,
      "Add IPv6 service endpoints if your hosting/CDN supports dual-stack delivery.",
    );
  }

  const hasCaa = (domainDns?.records?.CAA?.length || 0) > 0;
  if (!hasCaa) {
    add(
      "info",
      "CAA policy not detected",
      "No CAA records were observed in the DNS response set.",
      "Publish CAA records to constrain certificate issuance to approved CAs.",
    );
  }

  if ((dnsResolvers?.servers?.length || 0) <= 1) {
    add(
      "info",
      "Single upstream DNS resolver",
      "Resolver diversity appears limited to one upstream entry.",
      "Configure at least two resolvers to improve resilience during resolver outages.",
    );
  }

  if ((neighbors?.entries?.length || 0) >= 40) {
    add(
      "medium",
      "Large L2 broadcast domain",
      `${neighbors.entries.length} neighbors were observed in ARP/NDP tables.`,
      "Consider VLAN segmentation to reduce broadcast/multicast load and improve fault isolation.",
    );
  }

  if (tcpdump?.permissionRequired) {
    add(
      "info",
      "tcpdump capture permission missing",
      "Packet capture requires elevated privileges on this runtime.",
      "Run diagnostics with packet-capture permissions to generate per-device traffic fingerprints.",
    );
  }

  if (tcpdump?.available && (tcpdump?.silentNeighbors || 0) > 0) {
    add(
      "info",
      "Some neighbors were silent during capture",
      `${tcpdump.silentNeighbors} known neighbor(s) had no observed packets in the capture window.`,
      "Increase capture window or trigger traffic from idle devices to improve inventory completeness.",
    );
  }

  if (recommendations.length === 0) {
    add(
      "info",
      "No major bottleneck detected",
      "Current telemetry does not indicate a clear performance bottleneck.",
      "Keep periodic baselines and alert on packet loss, jitter spikes, and resolver timeout growth.",
    );
  }

  return recommendations;
}

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed. Use GET.",
    });
  }

  const targetHost = normalizeHostname(
    getQueryParam(req, "target", DEFAULT_TARGET),
    DEFAULT_TARGET,
  );
  const domain = normalizeHostname(
    getQueryParam(req, "domain", DEFAULT_DOMAIN),
    DEFAULT_DOMAIN,
  );

  const startedAt = Date.now();

  const [wifi, dnsResolvers, neighbors, latency, traceroute, domainDns] =
    await Promise.all([
      collectWifiSnapshot(),
      collectDnsResolvers(),
      collectNeighbors(),
      collectLatency(targetHost),
      collectTraceroute(targetHost),
      collectDomainDns(domain),
    ]);
  const tcpdump = await collectTcpdumpTelemetry({ wifi, neighbors });

  const payload = {
    generatedAt: new Date().toISOString(),
    tookMs: Date.now() - startedAt,
    targetHost,
    domain,
    runtime: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      hostname: os.hostname(),
      uptimeSeconds: Math.floor(os.uptime()),
    },
    networkInterfaces: collectNetworkInterfaces(),
    wifi,
    dnsResolvers,
    neighbors,
    tcpdump,
    latency,
    traceroute,
    domainDns,
    recommendations: evaluateRecommendations({
      wifi,
      latency,
      traceroute,
      domainDns,
      dnsResolvers,
      neighbors,
      tcpdump,
    }),
    limitations: [
      "Per-station Wi-Fi band for every connected device requires router/AP telemetry; host ARP tables cannot provide this.",
      "Mobile 5G radio details are not available server-side; browser client hints are required for transport-level inference.",
      "tcpdump-based device traffic details require packet-capture permissions on the host runtime.",
    ],
  };

  return res.status(200).json(payload);
}
