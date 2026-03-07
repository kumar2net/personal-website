import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLAYLIST_ID = "PLUTFXCgXawk_wv0Wo8XoNPdI-SxqTfQSH";
const PLAYLIST_SHARE_ID = "WfNRuoFY0s0sW-84";
const PLAYLIST_URL = `https://music.youtube.com/playlist?list=${PLAYLIST_ID}&si=${PLAYLIST_SHARE_ID}`;
const OUTPUT_PATH = path.resolve(__dirname, "../src/data/musicPlaylistSnapshot.json");

function decodeJsStringLiteral(value) {
  return Function(`return '${value}'`)();
}

function extractBrowsePayload(html) {
  const matches = [...html.matchAll(/initialData\.push\(\{path: '([^']+)', params: JSON\.parse\('([\s\S]*?)'\), data: '([\s\S]*?)'\}\);/g)];
  const browseMatch = matches.find((match) => match[1] === "\\/browse");

  if (!browseMatch) {
    throw new Error("Unable to locate playlist browse payload.");
  }

  return JSON.parse(decodeJsStringLiteral(browseMatch[3]));
}

function extractPlaylistTracks(payload) {
  const tracks = [];

  const walk = (node) => {
    if (!node || typeof node !== "object") {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    const item = node.musicResponsiveListItemRenderer;

    if (item) {
      const titleRuns =
        item.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ?? [];
      const artistRuns =
        item.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ?? [];
      const videoId =
        item.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer
          ?.playNavigationEndpoint?.watchEndpoint?.videoId ??
        item.navigationEndpoint?.watchEndpoint?.videoId ??
        null;

      const title = titleRuns.map((run) => run.text).join("").trim();
      const artists = artistRuns.map((run) => run.text).join("").trim().split(" · ")[0].trim();

      if (title && videoId) {
        tracks.push({
          title,
          artists,
          videoId,
          url: `https://music.youtube.com/watch?v=${videoId}&list=${PLAYLIST_ID}`,
        });
      }
    }

    Object.values(node).forEach(walk);
  };

  walk(payload);

  return tracks;
}

async function fetchPlaylistHtml() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(PLAYLIST_URL, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "accept-language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Unexpected response ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function readExistingSnapshot() {
  try {
    const raw = await readFile(OUTPUT_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeSnapshot(snapshot) {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  const next = `${JSON.stringify(snapshot, null, 2)}\n`;
  const current = await readFile(OUTPUT_PATH, "utf8").catch(() => null);

  if (current === next) {
    console.log("🎵 Music playlist snapshot already up to date.");
    return;
  }

  await writeFile(OUTPUT_PATH, next, "utf8");
  console.log("🎵 Music playlist snapshot refreshed.");
}

async function main() {
  try {
    const html = await fetchPlaylistHtml();
    const payload = extractBrowsePayload(html);
    const tracks = extractPlaylistTracks(payload);

    if (tracks.length < 3) {
      throw new Error(`Expected at least 3 tracks, found ${tracks.length}.`);
    }

    const snapshot = {
      playlistId: PLAYLIST_ID,
      playlistShareId: PLAYLIST_SHARE_ID,
      sourceUrl: PLAYLIST_URL,
      trackCount: tracks.length,
      tracks,
    };

    await writeSnapshot(snapshot);

    const latestSpins = tracks.slice(-3).map((track) => track.title);
    console.log(`🎧 Latest spins tail: ${latestSpins.join(" | ")}`);
  } catch (error) {
    const existingSnapshot = await readExistingSnapshot();

    if (existingSnapshot?.tracks?.length >= 3) {
      console.warn(`⚠️ Music playlist refresh failed, keeping existing snapshot: ${error.message}`);
      return;
    }

    console.error(`❌ Music playlist refresh failed: ${error.message}`);
    process.exitCode = 1;
  }
}

await main();
