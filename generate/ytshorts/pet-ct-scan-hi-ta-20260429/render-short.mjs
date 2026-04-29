#!/usr/bin/env node
import path from 'node:path';
import os from 'node:os';
import { readFileSync } from 'node:fs';
import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const execFileAsync = promisify(execFile);

const ROOT = '/Users/kumara/personal-website';
const PROJECT = 'pet-ct-scan-hi-ta-20260429';
const OUT_DIR = path.join(ROOT, 'generate/ytshorts', PROJECT);
const FRAMES_DIR = path.join(OUT_DIR, 'frames');
const SEGMENTS_DIR = path.join(OUT_DIR, 'segments');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SOURCE_URL = 'https://www.kumar2net.com/blog/2026-04-29-pet-ct-scan-experience-explained';
const SOURCE_FILE =
  'apps/personal-website/src/pages/blog/2026-04-29-pet-ct-scan-experience-explained.jsx';
const PET_CT_MACHINE_IMAGE = path.join(
  ROOT,
  'apps/personal-website/public/generate/2026-04-29-pet-ct-machine.png',
);
const PET_CT_MACHINE_DATA_URL = `data:image/png;base64,${readFileSync(
  PET_CT_MACHINE_IMAGE,
).toString('base64')}`;

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const MODEL = process.env.BLOG_TTS_MODEL || 'gpt-4o-mini-tts';
const VOICE =
  process.env.BLOG_TTS_HI_TA_VOICE ||
  process.env.BLOG_TTS_TA_VOICE ||
  process.env.BLOG_TTS_VOICE ||
  'sage';
const KEEP_INTERMEDIATES = process.env.KEEP_SHORT_INTERMEDIATES === '1';

const SEGMENTS = [
  {
    slug: '01-hook',
    duration: 2.6,
    speakLang: 'hi',
    kicker: 'FEYNMAN MODE',
    title: 'Sugar with a bell',
    stat: 'That is PET',
    issue: 'Imagine a sugar molecule carrying a tiny signal.',
    accent: '#E11D48',
    hi: 'सोचिए sugar के साथ छोटी bell लगी है.',
    ta: 'Sugar-க்கு ஒரு சின்ன bell வைத்தது போல.',
  },
  {
    slug: '02-two-tests',
    duration: 3.0,
    speakLang: 'ta',
    kicker: 'FIRST IDEA',
    title: 'Hungry cells',
    stat: 'They eat more sugar',
    issue: 'Active cells take up more glucose-like tracer.',
    accent: '#0F766E',
    hi: 'Active cells sugar ज़्यादा लेते हैं.',
    ta: 'Active cells sugar-ஐ அதிகம் எடுத்துக்கொள்ளும்.',
  },
  {
    slug: '03-tracer',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'THE INJECTION',
    title: 'Tracer',
    stat: 'Fake sugar clue',
    issue: 'Fluorine-18 fluorodeoxyglucose follows glucose behavior.',
    accent: '#DC2626',
    hi: 'FDG glucose जैसा clue है.',
    ta: 'FDG glucose மாதிரி clue.',
  },
  {
    slug: '04-fasting',
    duration: 3.2,
    speakLang: 'ta',
    kicker: 'WHY FAST?',
    title: 'Quiet background',
    stat: 'Less noise',
    issue: 'Food makes the sugar-signal messy.',
    accent: '#2563EB',
    hi: 'Fasting से background साफ रहता है.',
    ta: 'Fasting-னால் background clean ஆகும்.',
  },
  {
    slug: '05-wait',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'WHY WAIT?',
    title: 'Let it travel',
    stat: '~1 hour',
    issue: 'The tracer needs time to reach different tissues.',
    accent: '#7C3AED',
    hi: 'Bell को body में घूमने का time चाहिए.',
    ta: 'Bell உடம்பில் சுற்ற time தேவை.',
  },
  {
    slug: '06-ct-pass',
    duration: 3.2,
    speakLang: 'ta',
    kicker: 'MAP LAYER',
    title: 'CT',
    stat: 'Where is it?',
    issue: 'Computed tomography draws the body map.',
    accent: '#059669',
    hi: 'CT पूछता है: चीज़ कहाँ है?',
    ta: 'CT கேட்கும்: அது எங்கே?',
  },
  {
    slug: '07-pet-pass',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'ACTIVITY LAYER',
    title: 'PET',
    stat: 'What is active?',
    issue: 'PET listens for the tracer signal.',
    accent: '#0891B2',
    hi: 'PET पूछता है: activity कहाँ है?',
    ta: 'PET கேட்கும்: activity எங்கே?',
  },
  {
    slug: '08-table-motion',
    duration: 3.0,
    speakLang: 'ta',
    kicker: 'MOVING TABLE',
    title: 'Shelf by shelf',
    stat: 'Body sections',
    issue: 'The scanner reads one section, then the next.',
    accent: '#CA8A04',
    hi: 'Machine shelf by shelf पढ़ती है.',
    ta: 'Machine section by section படிக்கும்.',
  },
  {
    slug: '09-output',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'THE OUTPUT',
    title: 'Overlay',
    stat: 'Map + signal',
    issue: 'The report overlays active spots on the body map.',
    accent: '#DB2777',
    hi: 'Report में map के ऊपर signal आता है.',
    ta: 'Report-ல் map மேல signal வரும்.',
  },
  {
    slug: '10-suv',
    duration: 3.0,
    speakLang: 'ta',
    kicker: 'THE NUMBER',
    title: 'SUV',
    stat: 'Not final truth',
    issue: 'Standardized uptake value is a clue, not the whole story.',
    accent: '#16A34A',
    hi: 'SUV clue है, final answer नहीं.',
    ta: 'SUV clue தான், final answer இல்லை.',
  },
  {
    slug: '11-mri',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'COMPARE',
    title: 'MRI',
    stat: 'Shape detail',
    issue: 'Magnetic resonance imaging is like a very detailed soft-tissue photograph.',
    accent: '#EA580C',
    hi: 'MRI shape और soft tissue detail दिखाता है.',
    ta: 'MRI shape, soft tissue detail காட்டும்.',
  },
  {
    slug: '12-eeg-ultrasound',
    duration: 3.2,
    speakLang: 'ta',
    kicker: 'MORE TESTS',
    title: 'EEG + ultrasound',
    stat: 'Different questions',
    issue: 'EEG reads brain electricity. Ultrasound uses sound waves.',
    accent: '#4F46E5',
    hi: 'EEG electricity. Ultrasound echo.',
    ta: 'EEG electricity. Ultrasound echo.',
  },
  {
    slug: '13-fever',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'FOR FEVER',
    title: 'Hidden fire',
    stat: 'Find the focus',
    issue: 'For unexplained fever, doctors look for a hidden active area.',
    accent: '#0D9488',
    hi: 'Goal है body में hidden fire ढूँढना.',
    ta: 'Goal hidden fire கண்டுபிடிப்பது.',
  },
  {
    slug: '14-doctor-question',
    duration: 3.2,
    speakLang: 'ta',
    kicker: 'ASK DOCTOR',
    title: 'Proof?',
    stat: 'Culture? Biopsy?',
    issue: 'A bright spot often needs confirmation.',
    accent: '#9333EA',
    hi: 'Hot spot मिला तो proof कैसे?',
    ta: 'Hot spot இருந்தால் proof எப்படி?',
  },
  {
    slug: '15-close',
    duration: 3.0,
    speakLang: 'hi',
    kicker: 'PAYOFF',
    title: 'Feynman version',
    stat: 'Map + hunger',
    issue: 'CT gives the map. PET shows which places are hungry.',
    accent: '#B91C1C',
    hi: 'CT map है. PET hunger signal.',
    ta: 'CT map. PET hunger signal.',
  },
];

function ensureApiKey() {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for voiceover generation.');
  }
  return apiKey;
}

async function commandExists(command) {
  try {
    await execFileAsync('which', [command]);
    return true;
  } catch {
    return false;
  }
}

async function ensureCommand(command) {
  if (!(await commandExists(command))) {
    throw new Error(`${command} is required to render the short.`);
  }
}

async function fileExists(filePath) {
  try {
    await access(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function run(command, args, options = {}) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  return { stdout, stderr };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function toTimestamp(seconds, separator = ',') {
  const safe = Math.max(0, seconds);
  const totalMs = Math.round(safe * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}:${String(secs).padStart(2, '0')}${separator}${String(ms).padStart(3, '0')}`;
}

function atempoChain(targetRate) {
  const filters = [];
  let rate = targetRate;

  while (rate > 2) {
    filters.push('atempo=2');
    rate /= 2;
  }
  while (rate < 0.5) {
    filters.push('atempo=0.5');
    rate /= 0.5;
  }

  filters.push(`atempo=${rate.toFixed(5)}`);
  return filters.join(',');
}

function spokenLine(segment) {
  return segment.speakLang === 'ta' ? segment.ta : segment.hi;
}

function totalDuration() {
  return SEGMENTS.reduce((sum, segment) => sum + segment.duration, 0);
}

async function probeDuration(filePath) {
  const { stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    filePath,
  ]);
  const value = Number.parseFloat(stdout.trim());
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Unable to determine duration for ${filePath}`);
  }
  return value;
}

function buildHtml(segment, index, total) {
  const progress = ((index + 1) / total) * 100;
  const scene = String(index + 1).padStart(2, '0');
  const totalScenes = String(total).padStart(2, '0');
  const machineImageUrl = PET_CT_MACHINE_DATA_URL;
  const showMachineImage = index < 2;

  return `<!doctype html>
<html lang="hi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --accent: ${segment.accent};
        --ink: #111827;
        --paper: #f7f9fb;
        --paper-2: #e8eef5;
        --line: #111827;
        --muted: #4b5563;
        --white: #ffffff;
      }

      * { box-sizing: border-box; }

      html,
      body {
        margin: 0;
        width: 100%;
        height: 100%;
        background: var(--paper);
        color: var(--ink);
        overflow: hidden;
      }

      body {
        font-family: Inter, Avenir Next, Helvetica Neue, Arial, sans-serif;
      }

      .frame {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 60px;
        background:
          radial-gradient(circle at 18% 12%, rgba(37, 99, 235, 0.18), transparent 26%),
          linear-gradient(90deg, rgba(17, 24, 39, 0.06) 1px, transparent 1px),
          linear-gradient(180deg, rgba(17, 24, 39, 0.06) 1px, transparent 1px),
          var(--paper);
        background-size: 54px 54px;
      }

      .masthead {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 4px solid var(--line);
        border-radius: 8px;
        background: var(--white);
        padding: 24px 28px;
        font-size: 28px;
        font-weight: 900;
      }

      .masthead small {
        color: var(--muted);
        font-size: 22px;
        font-weight: 800;
      }

      .receipt {
        position: absolute;
        inset: 178px 58px auto 58px;
        min-height: 930px;
        border: 5px solid var(--line);
        border-radius: 8px;
        background: var(--white);
        box-shadow: 18px 18px 0 var(--accent);
        padding: 44px;
      }

      .kicker {
        display: inline-flex;
        border: 4px solid var(--line);
        border-radius: 8px;
        padding: 12px 16px;
        background: var(--accent);
        color: var(--white);
        font-size: 28px;
        font-weight: 900;
      }

      .title {
        margin: 36px 0 0;
        max-width: 850px;
        font-size: 104px;
        line-height: 0.94;
        font-weight: 950;
        letter-spacing: 0;
      }

      .stat {
        margin-top: 36px;
        display: inline-flex;
        max-width: 890px;
        border: 5px solid var(--line);
        border-radius: 8px;
        background: var(--paper-2);
        color: var(--ink);
        padding: 26px 28px;
        font-size: 70px;
        line-height: 0.96;
        font-weight: 950;
      }

      .issue {
        margin: 36px 0 0;
        border-left: 14px solid var(--accent);
        padding: 8px 0 8px 28px;
        color: var(--muted);
        font-size: 36px;
        line-height: 1.25;
        font-weight: 800;
      }

      .machine-photo {
        position: absolute;
        left: 44px;
        right: 44px;
        bottom: 34px;
        height: 250px;
        border: 5px solid var(--line);
        border-radius: 8px;
        overflow: hidden;
        background: var(--paper-2);
      }

      .machine-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 52%;
        display: block;
      }

      .stamp {
        position: absolute;
        right: 42px;
        top: 44px;
        transform: rotate(6deg);
        border: 5px solid var(--accent);
        border-radius: 8px;
        color: var(--accent);
        padding: 16px 18px;
        font-size: 34px;
        font-weight: 950;
      }

      .caption {
        position: absolute;
        left: 58px;
        right: 58px;
        bottom: 154px;
        border: 5px solid var(--line);
        border-radius: 8px;
        background: #111827;
        padding: 30px 32px;
      }

      .caption p {
        margin: 0;
        color: var(--white);
        font-weight: 900;
        letter-spacing: 0;
      }

      .caption .hi {
        font-family: "Kohinoor Devanagari", "Noto Sans Devanagari", "Arial Unicode MS", sans-serif;
        font-size: 54px;
        line-height: 1.12;
      }

      .caption .ta {
        margin-top: 18px;
        font-family: "Tamil Sangam MN", "Noto Sans Tamil", "Arial Unicode MS", sans-serif;
        font-size: 50px;
        line-height: 1.16;
        color: #d9fff2;
      }

      .footer {
        position: absolute;
        left: 60px;
        right: 60px;
        bottom: 58px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 22px;
        color: var(--ink);
        font-size: 26px;
        font-weight: 900;
      }

      .bar {
        height: 16px;
        border: 3px solid var(--line);
        border-radius: 8px;
        background: var(--white);
        overflow: hidden;
      }

      .bar::after {
        content: "";
        display: block;
        height: 100%;
        width: ${progress.toFixed(2)}%;
        background: var(--accent);
      }
    </style>
  </head>
  <body>
    <main class="frame">
      <header class="masthead">
        <span>PET-CT Scan Explainer</span>
        <small>${scene}/${totalScenes}</small>
      </header>

      <section class="receipt">
        <div class="stamp">SCAN LOG</div>
        <div class="kicker">${escapeHtml(segment.kicker)}</div>
        <h1 class="title">${escapeHtml(segment.title)}</h1>
        <div class="stat">${escapeHtml(segment.stat)}</div>
        ${showMachineImage ? '' : `<p class="issue">${escapeHtml(segment.issue)}</p>`}
        ${
          showMachineImage
            ? `<div class="machine-photo"><img src="${escapeHtml(machineImageUrl)}" alt="AI-generated PET-CT scanner" /></div>`
            : ''
        }
      </section>

      <section class="caption" aria-label="Hindi and Tamil captions">
        <p class="hi">${escapeHtml(segment.hi)}</p>
        <p class="ta">${escapeHtml(segment.ta)}</p>
      </section>

      <footer class="footer">
        <span>Hindi + Tamil</span>
        <div class="bar"></div>
        <span>medical explainer</span>
      </footer>
    </main>
  </body>
</html>`;
}

async function renderFrames() {
  const launchOptions = { headless: true };
  if (await fileExists(CHROME_PATH)) {
    launchOptions.executablePath = CHROME_PATH;
  }

  const browser = await chromium.launch(launchOptions);

  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });

    for (let index = 0; index < SEGMENTS.length; index += 1) {
      const segment = SEGMENTS[index];
      await page.setContent(buildHtml(segment, index, SEGMENTS.length), {
        waitUntil: 'load',
      });
      await page.evaluate(async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      });
      await page.screenshot({
        path: path.join(FRAMES_DIR, `${segment.slug}.png`),
        type: 'png',
      });
    }
  } finally {
    await browser.close();
  }
}

async function renderSegmentVideo(segment, index) {
  const framePath = path.join(FRAMES_DIR, `${segment.slug}.png`);
  const outputPath = path.join(SEGMENTS_DIR, `${segment.slug}.mp4`);
  const frames = Math.max(1, Math.round(segment.duration * FPS));
  const zoomExpr =
    index % 2 === 0
      ? `1+0.018*on/${frames}`
      : `1.018-0.012*on/${frames}`;

  await run('ffmpeg', [
    '-y',
    '-loop',
    '1',
    '-framerate',
    String(FPS),
    '-i',
    framePath,
    '-t',
    segment.duration.toFixed(3),
    '-vf',
    `scale=${WIDTH}:${HEIGHT},zoompan=z='${zoomExpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${WIDTH}x${HEIGHT}:fps=${FPS},format=yuv420p`,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-r',
    String(FPS),
    outputPath,
  ]);
  return outputPath;
}

async function synthesizeSegment(apiKey, segment, destination) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      response_format: 'mp3',
      input: spokenLine(segment),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`TTS failed for ${segment.slug}: ${response.status} ${detail}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, buffer);
}

async function buildNarration(apiKey, tempDir) {
  const fittedSegments = [];

  for (let index = 0; index < SEGMENTS.length; index += 1) {
    const segment = SEGMENTS[index];
    const sourcePath = path.join(tempDir, `${segment.slug}.mp3`);
    const fittedPath = path.join(tempDir, `${segment.slug}.wav`);
    await synthesizeSegment(apiKey, segment, sourcePath);
    const actualDuration = await probeDuration(sourcePath);
    const rate = actualDuration / segment.duration;
    const audioFilter = `${atempoChain(rate)},volume=1.95`;

    await run('ffmpeg', [
      '-y',
      '-i',
      sourcePath,
      '-filter:a',
      audioFilter,
      '-ar',
      '48000',
      '-ac',
      '1',
      '-t',
      segment.duration.toFixed(3),
      fittedPath,
    ]);

    fittedSegments.push({
      path: fittedPath,
      startMs: Math.round(
        SEGMENTS.slice(0, index).reduce((sum, item) => sum + item.duration, 0) *
          1000,
      ),
    });
  }

  const narrationPath = path.join(OUT_DIR, 'voiceover.wav');
  const filterParts = [];
  const mixInputs = [];
  const ffmpegArgs = ['-y'];

  fittedSegments.forEach((segment, index) => {
    ffmpegArgs.push('-i', segment.path);
    filterParts.push(
      `[${index}:a]adelay=${segment.startMs}|${segment.startMs}[a${index}]`,
    );
    mixInputs.push(`[a${index}]`);
  });

  filterParts.push(
    `${mixInputs.join('')}amix=inputs=${mixInputs.length}:duration=longest:normalize=0[aout]`,
  );
  ffmpegArgs.push(
    '-filter_complex',
    filterParts.join(';'),
    '-map',
    '[aout]',
    '-ar',
    '48000',
    '-ac',
    '1',
    narrationPath,
  );

  await run('ffmpeg', ffmpegArgs);
  return narrationPath;
}

async function stitchVideo(destination) {
  const listPath = path.join(OUT_DIR, 'concat-list.txt');
  const contents =
    SEGMENTS.map((segment) => `file '${path.join(SEGMENTS_DIR, `${segment.slug}.mp4`)}'`).join(
      '\n',
    ) + '\n';
  await writeFile(listPath, contents, 'utf8');

  await run('ffmpeg', [
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    listPath,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-r',
    String(FPS),
    '-an',
    destination,
  ]);
}

async function writeCaptions() {
  let cursor = 0;
  const srtEntries = [];
  const vttEntries = [];

  SEGMENTS.forEach((segment, index) => {
    const start = cursor;
    const end = cursor + segment.duration;
    cursor = end;
    const text = `${segment.hi}\n${segment.ta}`;

    srtEntries.push(
      `${index + 1}\n${toTimestamp(start)} --> ${toTimestamp(end)}\n${text}`,
    );
    vttEntries.push(
      `${toTimestamp(start, '.')} --> ${toTimestamp(end, '.')}\n${text}`,
    );
  });

  const srtPath = path.join(OUT_DIR, 'final.srt');
  const vttPath = path.join(OUT_DIR, 'final.vtt');
  await writeFile(srtPath, `${srtEntries.join('\n\n')}\n`, 'utf8');
  await writeFile(vttPath, `WEBVTT\n\n${vttEntries.join('\n\n')}\n`, 'utf8');
  return { srtPath, vttPath };
}

async function writeMetadata() {
  const title = 'PET-CT Scan, Feynman Style: Sugar with a Bell';
  const description = `Positron emission tomography-computed tomography (PET-CT), explained the Feynman way: imagine sugar carrying a tiny bell.\n\nHindi + Tamil explainer from Kumar's PET-CT scan post: fluorine-18 fluorodeoxyglucose (F-18 FDG), fasting, waiting, why the table moves, what the fused report means, and how PET-CT differs from magnetic resonance imaging (MRI), electroencephalography (EEG), and ultrasound.\n\nThis is educational, not medical advice. For fever, infection, or scan findings, discuss the report with your treating doctor.\n\nSource post:\n${SOURCE_URL}\n\n#PETCT #FeynmanTechnique #MedicalExplainer #Hindi #Tamil #Health #Shorts\n`;
  const tags = [
    'PET CT scan explained',
    'PET CT Feynman style',
    'Feynman technique',
    'PET-CT scan',
    'positron emission tomography',
    'computed tomography',
    'FDG PET scan',
    'F-18 FDG',
    'medical scan explained',
    'nuclear medicine',
    'fever of unknown origin',
    'infection specialist',
    'MRI vs PET CT',
    'EEG vs PET CT',
    'ultrasound vs PET CT',
    'health explainer',
    'Hindi Tamil short',
    'Hindi captions',
    'Tamil captions',
    'YouTube Shorts',
    'shorts',
  ];
  const pinnedComment =
    'Feynman-style version: CT is the map. PET is the hunger signal. अब कौन सा scan समझना है?';
  const voiceoverText = SEGMENTS.map((segment, index) => {
    const spoken = segment.speakLang === 'ta' ? 'TA' : 'HI';
    return `${index + 1}. [${spoken}] ${spokenLine(segment)}\n   HI: ${segment.hi}\n   TA: ${segment.ta}`;
  }).join('\n\n');
  const metadata = {
    project: PROJECT,
    sourceUrl: SOURCE_URL,
    sourceFile: SOURCE_FILE,
    title,
    description,
    tags,
    pinnedComment,
    model: MODEL,
    voice: VOICE,
    languages: ['hi', 'ta'],
    fps: FPS,
    size: `${WIDTH}x${HEIGHT}`,
    totalDurationSeconds: totalDuration(),
    generatedAt: new Date().toISOString(),
    storySpine: {
      hook: '0-2.6s: sugar with a tiny bell',
      context: 'active cells take up more glucose-like tracer',
      proof: 'CT is the body map; PET is the activity signal; moving table reads the body in sections',
      payoff: 'CT gives the map, PET shows which places are hungry',
      cta: 'ask which scan should be explained next',
    },
  };

  await writeFile(path.join(OUT_DIR, 'title.txt'), `${title}\n`, 'utf8');
  await writeFile(path.join(OUT_DIR, 'description.txt'), description, 'utf8');
  await writeFile(path.join(OUT_DIR, 'tags.txt'), `${tags.join(',')}\n`, 'utf8');
  await writeFile(
    path.join(OUT_DIR, 'pinned-comment.txt'),
    `${pinnedComment}\n`,
    'utf8',
  );
  await writeFile(path.join(OUT_DIR, 'voiceover.txt'), `${voiceoverText}\n`, 'utf8');
  await writeFile(
    path.join(OUT_DIR, 'manifest.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8',
  );
}

async function writeUploadManifest() {
  const manifest = {
    project: PROJECT,
    created_at: new Date().toISOString(),
    source: {
      url: SOURCE_URL,
      file: SOURCE_FILE,
    },
    format: {
      aspect_ratio: '9:16',
      size: `${WIDTH}x${HEIGHT}`,
      duration_seconds: totalDuration(),
      fps: FPS,
    },
    outputs: {
      final_video: 'final.mp4',
      captions: ['final.srt', 'final.vtt'],
      thumbnail: 'thumbnail.jpg',
      voiceover_audio: 'voiceover.wav',
      title: 'title.txt',
      description: 'description.txt',
      tags: 'tags.txt',
      pinned_comment: 'pinned-comment.txt',
    },
    notes: {
      format: 'bilingual Hindi + Tamil medical explainer',
      narration: 'alternates Hindi and Tamil; captions include both languages on every segment',
      source_handling:
        'uses a Feynman-style analogy while staying educational and avoiding diagnosis or treatment advice',
      model: MODEL,
      voice: VOICE,
    },
  };

  await writeFile(
    path.join(OUT_DIR, 'upload-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

async function extractThumbnail(finalPath) {
  await run('ffmpeg', [
    '-y',
    '-ss',
    '0.800',
    '-i',
    finalPath,
    '-vframes',
    '1',
    '-q:v',
    '2',
    path.join(OUT_DIR, 'thumbnail.jpg'),
  ]);
}

async function cleanupIntermediates() {
  if (KEEP_INTERMEDIATES) {
    return;
  }

  await rm(FRAMES_DIR, { recursive: true, force: true });
  await rm(SEGMENTS_DIR, { recursive: true, force: true });
  await rm(path.join(OUT_DIR, 'video-base.mp4'), { force: true });
  await rm(path.join(OUT_DIR, 'concat-list.txt'), { force: true });
}

async function main() {
  const apiKey = ensureApiKey();
  await ensureCommand('ffmpeg');
  await ensureCommand('ffprobe');

  await rm(FRAMES_DIR, { recursive: true, force: true });
  await rm(SEGMENTS_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir(SEGMENTS_DIR, { recursive: true });
  await writeMetadata();
  await renderFrames();

  for (let index = 0; index < SEGMENTS.length; index += 1) {
    await renderSegmentVideo(SEGMENTS[index], index);
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), `${PROJECT}-`));
  try {
    const narrationPath = await buildNarration(apiKey, tempDir);
    const baseVideoPath = path.join(OUT_DIR, 'video-base.mp4');
    await stitchVideo(baseVideoPath);
    await writeCaptions();

    const finalPath = path.join(OUT_DIR, 'final.mp4');
    await run('ffmpeg', [
      '-y',
      '-i',
      baseVideoPath,
      '-i',
      narrationPath,
      '-c:v',
      'copy',
      '-af',
      'loudnorm=I=-16:TP=-1.5:LRA=11',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-movflags',
      '+faststart',
      '-shortest',
      finalPath,
    ]);
    await extractThumbnail(finalPath);
    await writeUploadManifest();
    await cleanupIntermediates();
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
