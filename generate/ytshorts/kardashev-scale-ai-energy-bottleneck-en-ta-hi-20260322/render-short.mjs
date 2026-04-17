#!/usr/bin/env node
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const execFileAsync = promisify(execFile);

const ROOT = '/Users/kumara/personal-website';
const PROJECT = 'kardashev-scale-ai-energy-bottleneck-en-ta-hi-20260322';
const OUT_DIR = path.join(ROOT, 'generate/ytshorts', PROJECT);
const FRAMES_DIR = path.join(OUT_DIR, 'frames');
const SEGMENTS_DIR = path.join(OUT_DIR, 'segments');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SOURCE_URL =
  'https://www.kumar2net.com/blog/2026-03-22-kardashev-scale-ai-energy-bottleneck';
const SOURCE_FILE =
  'apps/personal-website/src/pages/blog/2026-03-22-kardashev-scale-ai-energy-bottleneck.jsx';
const TEMPLATE_URL = 'https://chatgpt.com/s/t_69dd929dc3a881918dfb8e6e908c7a2d';
const HERO_IMAGE = path.join(
  ROOT,
  'generate/2026-03-22-kardashev-scale-ai-energy-bottleneck-hero.png',
);
const HERO_URL = pathToFileURL(HERO_IMAGE).href;

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const MODEL = process.env.BLOG_TTS_MODEL || 'gpt-4o-mini-tts';
const KEEP_INTERMEDIATES = process.env.KEEP_SHORT_INTERMEDIATES === '1';

const LANGUAGES = {
  en: {
    code: 'en',
    label: 'English',
    htmlLang: 'en',
    captionClass: 'en',
    voice:
      process.env.BLOG_TTS_EN_VOICE ||
      process.env.BLOG_TTS_VOICE ||
      'alloy',
    title: "AI's Real Bottleneck: The Power Plug",
    description:
      "AI does not scale on code alone. This Short turns Kumar's Kardashev-scale explainer into a 60-second power story: Type 0.73 sounds close to Type I, but the logarithmic climb means roughly 500 to 600 times more usable power.\n\nSource:\n" +
      SOURCE_URL +
      '\n\n#AI #Energy #KardashevScale #DataCenters #Shorts\n',
    pinnedComment:
      'What should get fixed first for AI scale: generation, transmission, cooling, or compute efficiency?',
    tags: [
      'AI energy bottleneck',
      'Kardashev scale explained',
      'AI infrastructure',
      'data center electricity',
      'Type 1 civilization',
      'energy grid',
      'Feynman explanation',
      'AI and power',
      'English Short',
      'YouTube Shorts',
      'shorts',
    ],
  },
  ta: {
    code: 'ta',
    label: 'Tamil',
    htmlLang: 'ta',
    captionClass: 'ta',
    voice:
      process.env.BLOG_TTS_TA_VOICE ||
      process.env.BLOG_TTS_VOICE ||
      'sage',
    title: 'AI bottleneck? Power Plug தான்',
    description:
      'AI code மட்டும் scale ஆகாது. Kumar-ன் Kardashev scale explainer-இல் இருந்து 60-second Tamil Short: Type 0.73 close போல தோன்றும், ஆனால் Type I-க்கு போக roughly 500 முதல் 600 மடங்கு usable power தேவை.\n\nSource:\n' +
      SOURCE_URL +
      '\n\n#AI #Energy #KardashevScale #Tamil #Shorts\n',
    pinnedComment:
      'AI scale ஆக first fix எது: generation, transmission, cooling, இல்ல compute efficiency?',
    tags: [
      'AI energy bottleneck Tamil',
      'Kardashev scale Tamil',
      'AI infrastructure Tamil',
      'data center electricity',
      'Type 1 civilization',
      'energy grid Tamil',
      'AI and power Tamil',
      'Tamil Short',
      'Tamil captions',
      'YouTube Shorts',
      'shorts',
    ],
  },
  hi: {
    code: 'hi',
    label: 'Hindi',
    htmlLang: 'hi',
    captionClass: 'hi',
    voice:
      process.env.BLOG_TTS_HI_VOICE ||
      process.env.BLOG_TTS_VOICE ||
      'sage',
    title: 'AI ka bottleneck: Power Plug',
    description:
      "AI sirf code se scale nahi hota. Kumar ke Kardashev-scale explainer se 60-second Hindi Short: Type 0.73 close lagta hai, lekin Type I tak pahunchne ke liye roughly 500 se 600 guna zyada usable power chahiye.\n\nSource:\n" +
      SOURCE_URL +
      '\n\n#AI #Energy #KardashevScale #Hindi #Shorts\n',
    pinnedComment:
      'AI scale ke liye pehle kya fix hona chahiye: generation, transmission, cooling, ya compute efficiency?',
    tags: [
      'AI energy bottleneck Hindi',
      'Kardashev scale Hindi',
      'AI infrastructure Hindi',
      'data center electricity',
      'Type 1 civilization',
      'energy grid Hindi',
      'AI and power Hindi',
      'Hindi Short',
      'Hindi captions',
      'YouTube Shorts',
      'shorts',
    ],
  },
};

const SEGMENTS = [
  {
    slug: '01-hook',
    duration: 5.8,
    kicker: 'OPENING LOOP',
    title: 'Bigger Power Plug',
    stat: 'AI needs watts',
    issue: 'The model headline hides the electricity bill.',
    accent: '#0F766E',
    lines: {
      en: 'AI is not waiting only for smarter code. It is waiting for a bigger power plug.',
      ta: 'AIக்கு புத்திசாலி code மட்டும் போதாது. பெரிய power plug வேண்டும்.',
      hi: 'AI को सिर्फ smarter code नहीं चाहिए. उसे बड़ा power plug चाहिए.',
    },
  },
  {
    slug: '02-power-meter',
    duration: 4.8,
    kicker: 'KEY IDEA',
    title: 'Kardashev Scale',
    stat: 'Power meter',
    issue: 'Strip out the sci-fi mood. Follow the watts.',
    accent: '#B45309',
    lines: {
      en: "The Kardashev scale is a civilization's power meter.",
      ta: 'Kardashev scaleன்னா civilization-ன் power meter.',
      hi: 'Kardashev scale civilization का power meter है.',
    },
  },
  {
    slug: '03-type-073',
    duration: 4.6,
    kicker: 'WHERE WE ARE',
    title: 'Humanity Today',
    stat: 'Type 0.73',
    issue: 'That number looks near Type I only on paper.',
    accent: '#2563EB',
    lines: {
      en: 'Today humanity sits around Type 0.73.',
      ta: 'இன்று மனிதகம் சுமார் Type 0.73-ல் இருக்கிறது.',
      hi: 'आज humanity लगभग Type 0.73 पर है.',
    },
  },
  {
    slug: '04-log-scale',
    duration: 5,
    kicker: 'THE TRICK',
    title: 'Log Scale',
    stat: 'Looks close. Is not.',
    issue: 'Do not stare at the decimal. Follow the multiplier.',
    accent: '#7C3AED',
    lines: {
      en: 'Type I sounds close, until you remember the scale is logarithmic.',
      ta: 'Type I நெருக்கமா தோன்றும்; ஆனால் scale logarithmic.',
      hi: 'Type I पास लगता है, पर scale logarithmic है.',
    },
  },
  {
    slug: '05-multiplier',
    duration: 5.7,
    kicker: 'THE CLIFF',
    title: '0.73 to 1.0',
    stat: '500-600x',
    issue: 'Not more enthusiasm. More usable power.',
    accent: '#DC2626',
    lines: {
      en: 'That tiny jump means roughly 500 to 600 times more usable power.',
      ta: 'அந்த சின்ன jump-க்கு 500 முதல் 600 மடங்கு usable power தேவை.',
      hi: 'यह छोटा jump करीब 500 से 600 गुना usable power मांगता है.',
    },
  },
  {
    slug: '06-grid-story',
    duration: 5,
    kicker: 'PAYOFF',
    title: 'Not Just Models',
    stat: 'Grid story',
    issue: 'AI scale becomes infrastructure scale.',
    accent: '#059669',
    lines: {
      en: 'So AI stops being only a model story. It becomes a grid story.',
      ta: 'அதனால் AI model story மட்டும் இல்லை; அது grid story.',
      hi: 'इसलिए AI सिर्फ model story नहीं; grid story बन जाता है.',
    },
  },
  {
    slug: '07-electric-chain',
    duration: 5.2,
    kicker: 'TINY EXAMPLE',
    title: 'The Chain',
    stat: 'Train. Infer. Cool.',
    issue: 'Every prompt touches a physical supply chain.',
    accent: '#CA8A04',
    lines: {
      en: 'Training, inference, cooling, backup: all of it needs electricity.',
      ta: 'Training, inference, cooling, backup எல்லாம் electricity சாப்பிடும்.',
      hi: 'Training, inference, cooling, backup: सब electricity खाते हैं.',
    },
  },
  {
    slug: '08-iea-2024',
    duration: 5.2,
    kicker: 'NUMBER CHECK',
    title: 'Data Centers',
    stat: '415 TWh',
    issue: 'The 2024 electricity footprint was already country-sized.',
    accent: '#0891B2',
    lines: {
      en: 'IEA puts data centers at about 415 TWh in 2024.',
      ta: 'IEA கணக்கில் 2024 data centres சுமார் 415 TWh பயன்படுத்தின.',
      hi: 'IEA के हिसाब से 2024 में data centres ने करीब 415 TWh इस्तेमाल किया.',
    },
  },
  {
    slug: '09-iea-2030',
    duration: 5,
    kicker: 'BASE CASE',
    title: '2030 Outlook',
    stat: '945 TWh',
    issue: 'Demand can double before infrastructure catches its breath.',
    accent: '#DB2777',
    lines: {
      en: 'Its base case points to roughly 945 TWh by 2030.',
      ta: '2030 base case? சுமார் 945 TWh.',
      hi: '2030 base case? करीब 945 TWh.',
    },
  },
  {
    slug: '10-speed-mismatch',
    duration: 5.4,
    kicker: 'THE BOTTLENECK',
    title: 'Months vs Years',
    stat: 'Compute moves faster',
    issue: 'Substations, transmission, and firm power move slower.',
    accent: '#EA580C',
    lines: {
      en: 'Data centers can rise in months. Substations and firm power do not.',
      ta: 'Data centres மாதங்களில் எழும்; substations அப்படி இல்லை.',
      hi: 'Data centres महीनों में उठते हैं; substations नहीं.',
    },
  },
  {
    slug: '11-bitcoin-caveat',
    duration: 5,
    kicker: 'SIDE CHARACTER',
    title: 'Bitcoin Caveat',
    stat: 'Flexible demand',
    issue: 'Useful in the right grid design. Not magic.',
    accent: '#9333EA',
    lines: {
      en: "Bitcoin's useful grid case is flexible demand, not magic.",
      ta: 'Bitcoin-ன் நியாயமான grid case flexible demand; magic இல்லை.',
      hi: 'Bitcoin का useful grid case flexible demand है, magic नहीं.',
    },
  },
  {
    slug: '12-close',
    duration: 6,
    kicker: 'TAKEAWAY',
    title: 'Software on Screen',
    stat: 'Hardware underneath',
    issue: 'Turbines, transformers, copper, cooling.',
    accent: '#15803D',
    lines: {
      en: 'The future may look like software; underneath it is turbines, transformers, copper, and cooling.',
      ta: 'Future screen-ல் software போல இருக்கும்; கீழே turbines, transformers, copper, cooling.',
      hi: 'Future screen पर software लगेगा; नीचे turbines, transformers, copper और cooling होंगे.',
    },
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

function totalDuration() {
  return SEGMENTS.reduce((sum, segment) => sum + segment.duration, 0);
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

function captionFont(lang) {
  if (lang.code === 'ta') {
    return '"Tamil Sangam MN", "Noto Sans Tamil", "Arial Unicode MS", sans-serif';
  }
  if (lang.code === 'hi') {
    return '"Kohinoor Devanagari", "Noto Sans Devanagari", "Arial Unicode MS", sans-serif';
  }
  return 'Inter, Avenir Next, Helvetica Neue, Arial, sans-serif';
}

function buildHtml(segment, index, total, lang) {
  const progress = ((index + 1) / total) * 100;
  const scene = String(index + 1).padStart(2, '0');
  const totalScenes = String(total).padStart(2, '0');
  const caption = segment.lines[lang.code];

  return `<!doctype html>
<html lang="${lang.htmlLang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --accent: ${segment.accent};
        --ink: #111827;
        --paper: #f8fafc;
        --paper-2: #e8eef5;
        --muted: #4b5563;
        --line: #111827;
        --white: #ffffff;
      }

      * { box-sizing: border-box; }

      html,
      body {
        margin: 0;
        width: 100%;
        height: 100%;
        color: var(--ink);
        overflow: hidden;
        background: #0f172a;
      }

      body {
        font-family: Inter, Avenir Next, Helvetica Neue, Arial, sans-serif;
      }

      .frame {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 58px;
        background:
          linear-gradient(180deg, rgba(8, 13, 22, 0.12), rgba(8, 13, 22, 0.76)),
          url("${HERO_URL}");
        background-position: center;
        background-size: cover;
      }

      .frame::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(248, 250, 252, 0.10) 1px, transparent 1px),
          linear-gradient(180deg, rgba(248, 250, 252, 0.10) 1px, transparent 1px);
        background-size: 54px 54px;
        opacity: 0.35;
      }

      .masthead,
      .panel,
      .caption,
      .footer {
        position: relative;
        z-index: 1;
      }

      .masthead {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 4px solid var(--line);
        border-radius: 8px;
        background: var(--white);
        padding: 22px 26px;
        font-size: 27px;
        font-weight: 950;
        box-shadow: 10px 10px 0 var(--accent);
      }

      .masthead small {
        color: var(--muted);
        font-size: 22px;
        font-weight: 900;
      }

      .panel {
        margin-top: 54px;
        min-height: 920px;
        border: 5px solid var(--line);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.94);
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
        font-weight: 950;
      }

      .title {
        margin: 42px 0 0;
        max-width: 880px;
        font-size: 94px;
        line-height: 0.94;
        font-weight: 950;
        letter-spacing: 0;
      }

      .stat {
        margin-top: 40px;
        display: inline-flex;
        max-width: 900px;
        border: 5px solid var(--line);
        border-radius: 8px;
        background: var(--paper-2);
        color: var(--ink);
        padding: 26px 28px;
        font-size: 66px;
        line-height: 0.96;
        font-weight: 950;
      }

      .issue {
        margin: 42px 0 0;
        border-left: 14px solid var(--accent);
        padding: 8px 0 8px 28px;
        color: var(--muted);
        font-size: 37px;
        line-height: 1.22;
        font-weight: 850;
      }

      .caption {
        position: absolute;
        left: 58px;
        right: 58px;
        bottom: 160px;
        border: 5px solid var(--line);
        border-radius: 8px;
        background: #111827;
        padding: 30px 32px;
      }

      .caption p {
        margin: 0;
        color: var(--white);
        font-family: ${captionFont(lang)};
        font-size: ${lang.code === 'en' ? '51px' : '46px'};
        line-height: 1.15;
        font-weight: 950;
        letter-spacing: 0;
        overflow-wrap: anywhere;
      }

      .footer {
        position: absolute;
        left: 60px;
        right: 60px;
        bottom: 58px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 20px;
        color: var(--white);
        font-size: 25px;
        font-weight: 950;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.58);
      }

      .bar {
        height: 16px;
        border: 3px solid var(--white);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.35);
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
        <span>Kardashev x AI Energy</span>
        <small>${lang.label} ${scene}/${totalScenes}</small>
      </header>

      <section class="panel">
        <div class="kicker">${escapeHtml(segment.kicker)}</div>
        <h1 class="title">${escapeHtml(segment.title)}</h1>
        <div class="stat">${escapeHtml(segment.stat)}</div>
        <p class="issue">${escapeHtml(segment.issue)}</p>
      </section>

      <section class="caption" aria-label="${lang.label} captions">
        <p>${escapeHtml(caption)}</p>
      </section>

      <footer class="footer">
        <span>${escapeHtml(lang.label)}</span>
        <div class="bar"></div>
        <span>${escapeHtml(segment.slug.replace(/^[0-9]+-/, '').replaceAll('-', ' '))}</span>
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

    for (const lang of Object.values(LANGUAGES)) {
      for (let index = 0; index < SEGMENTS.length; index += 1) {
        const segment = SEGMENTS[index];
        await page.setContent(buildHtml(segment, index, SEGMENTS.length, lang), {
          waitUntil: 'load',
        });
        await page.evaluate(async () => {
          if (document.fonts?.ready) {
            await document.fonts.ready;
          }
        });
        await page.screenshot({
          path: path.join(FRAMES_DIR, `${lang.code}-${segment.slug}.png`),
          type: 'png',
        });
      }
    }
  } finally {
    await browser.close();
  }
}

async function renderSegmentVideo(segment, index, lang) {
  const framePath = path.join(FRAMES_DIR, `${lang.code}-${segment.slug}.png`);
  const outputPath = path.join(SEGMENTS_DIR, `${lang.code}-${segment.slug}.mp4`);
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

async function synthesizeSegment(apiKey, segment, lang, destination) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      voice: lang.voice,
      response_format: 'mp3',
      input: segment.lines[lang.code],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `TTS failed for ${lang.code}/${segment.slug}: ${response.status} ${detail}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, buffer);
}

async function buildNarration(apiKey, tempDir, lang) {
  const fittedSegments = [];

  for (let index = 0; index < SEGMENTS.length; index += 1) {
    const segment = SEGMENTS[index];
    const sourcePath = path.join(tempDir, `${lang.code}-${segment.slug}.mp3`);
    const fittedPath = path.join(tempDir, `${lang.code}-${segment.slug}.wav`);
    await synthesizeSegment(apiKey, segment, lang, sourcePath);
    const actualDuration = await probeDuration(sourcePath);
    const rate = actualDuration / segment.duration;
    const audioFilter = `${atempoChain(rate)},volume=1.9`;

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

  const narrationPath = path.join(OUT_DIR, `voiceover-${lang.code}.wav`);
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

async function stitchVideo(lang, destination) {
  const listPath = path.join(OUT_DIR, `concat-list-${lang.code}.txt`);
  const contents =
    SEGMENTS.map((segment) => {
      const segmentPath = path.join(
        SEGMENTS_DIR,
        `${lang.code}-${segment.slug}.mp4`,
      );
      return `file '${segmentPath}'`;
    }).join('\n') + '\n';
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

async function writeCaptions(lang) {
  let cursor = 0;
  const srtEntries = [];
  const vttEntries = [];

  SEGMENTS.forEach((segment, index) => {
    const start = cursor;
    const end = cursor + segment.duration;
    cursor = end;
    const text = segment.lines[lang.code];

    srtEntries.push(
      `${index + 1}\n${toTimestamp(start)} --> ${toTimestamp(end)}\n${text}`,
    );
    vttEntries.push(
      `${toTimestamp(start, '.')} --> ${toTimestamp(end, '.')}\n${text}`,
    );
  });

  const srtPath = path.join(OUT_DIR, `final-${lang.code}.srt`);
  const vttPath = path.join(OUT_DIR, `final-${lang.code}.vtt`);
  await writeFile(srtPath, `${srtEntries.join('\n\n')}\n`, 'utf8');
  await writeFile(vttPath, `WEBVTT\n\n${vttEntries.join('\n\n')}\n`, 'utf8');
  return { srtPath, vttPath };
}

async function writePackageText() {
  const voiceoverFiles = [];

  for (const lang of Object.values(LANGUAGES)) {
    const voiceoverText = SEGMENTS.map((segment, index) => {
      return `${index + 1}. ${segment.lines[lang.code]}`;
    }).join('\n\n');

    await writeFile(path.join(OUT_DIR, `title-${lang.code}.txt`), `${lang.title}\n`, 'utf8');
    await writeFile(
      path.join(OUT_DIR, `description-${lang.code}.txt`),
      lang.description,
      'utf8',
    );
    await writeFile(
      path.join(OUT_DIR, `tags-${lang.code}.txt`),
      `${lang.tags.join(',')}\n`,
      'utf8',
    );
    await writeFile(
      path.join(OUT_DIR, `pinned-comment-${lang.code}.txt`),
      `${lang.pinnedComment}\n`,
      'utf8',
    );
    await writeFile(
      path.join(OUT_DIR, `voiceover-${lang.code}.txt`),
      `${voiceoverText}\n`,
      'utf8',
    );
    await writeCaptions(lang);
    voiceoverFiles.push(`voiceover-${lang.code}.txt`);
  }

  const packageMarkdown = `# YouTube Shorts Upload Package

Source: ${SOURCE_URL}
Template: ${TEMPLATE_URL}

## Variants
- English: \`final-en.mp4\`, \`final-en.srt\`, \`title-en.txt\`, \`description-en.txt\`
- Tamil: \`final-ta.mp4\`, \`final-ta.srt\`, \`title-ta.txt\`, \`description-ta.txt\`
- Hindi: \`final-hi.mp4\`, \`final-hi.srt\`, \`title-hi.txt\`, \`description-hi.txt\`

## Upload Steps
1. Upload the chosen \`final-*.mp4\` as a Short.
2. Paste the matching \`title-*.txt\`.
3. Paste the matching \`description-*.txt\`.
4. Add tags from the matching \`tags-*.txt\`.
5. Upload captions using the matching \`final-*.srt\`.
6. Use the matching \`thumbnail-*.jpg\` if custom Shorts thumbnails are enabled.
7. Post the matching \`pinned-comment-*.txt\` as the first pinned comment.

## Script Shape
- Hook: AI needs a bigger power plug.
- Key idea: the Kardashev scale is a power meter.
- Tiny example: training, inference, cooling, and grid infrastructure.
- Takeaway: software on screen still depends on turbines, transformers, copper, and cooling.
`;

  await writeFile(path.join(OUT_DIR, 'upload-package.md'), packageMarkdown, 'utf8');

  const metadata = {
    project: PROJECT,
    sourceUrl: SOURCE_URL,
    sourceFile: SOURCE_FILE,
    templateUrl: TEMPLATE_URL,
    heroImage: HERO_IMAGE,
    model: MODEL,
    languages: Object.values(LANGUAGES).map((lang) => ({
      code: lang.code,
      label: lang.label,
      voice: lang.voice,
      title: lang.title,
    })),
    fps: FPS,
    size: `${WIDTH}x${HEIGHT}`,
    totalDurationSeconds: totalDuration(),
    generatedAt: new Date().toISOString(),
    storySpine: {
      hook: 'AI needs a bigger power plug, not only smarter code',
      keyIdea: 'Kardashev scale as a civilization power meter',
      example: 'data centers, training, inference, cooling, substations, and firm power',
      takeaway: 'AI becomes a grid story before it becomes a Type I civilization story',
    },
    files: {
      scripts: voiceoverFiles,
    },
  };

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
      template: TEMPLATE_URL,
    },
    format: {
      aspect_ratio: '9:16',
      size: `${WIDTH}x${HEIGHT}`,
      duration_seconds: totalDuration(),
      fps: FPS,
    },
    outputs: Object.fromEntries(
      Object.values(LANGUAGES).map((lang) => [
        lang.code,
        {
          final_video: `final-${lang.code}.mp4`,
          captions: [`final-${lang.code}.srt`, `final-${lang.code}.vtt`],
          thumbnail: `thumbnail-${lang.code}.jpg`,
          voiceover_audio: `voiceover-${lang.code}.wav`,
          voiceover_script: `voiceover-${lang.code}.txt`,
          title: `title-${lang.code}.txt`,
          description: `description-${lang.code}.txt`,
          tags: `tags-${lang.code}.txt`,
          pinned_comment: `pinned-comment-${lang.code}.txt`,
        },
      ]),
    ),
    notes: {
      format: 'three single-language Shorts from the shared multilingual-audio template',
      source_handling:
        'keeps the Type 0.73 to Type I multiplier, IEA 2024 and 2030 data-center figures, grid bottleneck, and Bitcoin caveat separate',
      model: MODEL,
    },
  };

  await writeFile(
    path.join(OUT_DIR, 'upload-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

async function extractThumbnail(lang, finalPath) {
  await run('ffmpeg', [
    '-y',
    '-ss',
    '0.900',
    '-i',
    finalPath,
    '-vframes',
    '1',
    '-q:v',
    '2',
    path.join(OUT_DIR, `thumbnail-${lang.code}.jpg`),
  ]);
}

async function cleanupIntermediates() {
  if (KEEP_INTERMEDIATES) {
    return;
  }

  await rm(FRAMES_DIR, { recursive: true, force: true });
  await rm(SEGMENTS_DIR, { recursive: true, force: true });
  await rm(path.join(OUT_DIR, 'concat-list-en.txt'), { force: true });
  await rm(path.join(OUT_DIR, 'concat-list-ta.txt'), { force: true });
  await rm(path.join(OUT_DIR, 'concat-list-hi.txt'), { force: true });
  await rm(path.join(OUT_DIR, 'video-base-en.mp4'), { force: true });
  await rm(path.join(OUT_DIR, 'video-base-ta.mp4'), { force: true });
  await rm(path.join(OUT_DIR, 'video-base-hi.mp4'), { force: true });
}

async function main() {
  const apiKey = ensureApiKey();
  await ensureCommand('ffmpeg');
  await ensureCommand('ffprobe');

  await mkdir(OUT_DIR, { recursive: true });
  await rm(FRAMES_DIR, { recursive: true, force: true });
  await rm(SEGMENTS_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir(SEGMENTS_DIR, { recursive: true });
  await writePackageText();
  await renderFrames();

  for (const lang of Object.values(LANGUAGES)) {
    for (let index = 0; index < SEGMENTS.length; index += 1) {
      await renderSegmentVideo(SEGMENTS[index], index, lang);
    }
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), `${PROJECT}-`));
  try {
    for (const lang of Object.values(LANGUAGES)) {
      const narrationPath = await buildNarration(apiKey, tempDir, lang);
      const baseVideoPath = path.join(OUT_DIR, `video-base-${lang.code}.mp4`);
      await stitchVideo(lang, baseVideoPath);

      const finalPath = path.join(OUT_DIR, `final-${lang.code}.mp4`);
      await run('ffmpeg', [
        '-y',
        '-i',
        baseVideoPath,
        '-i',
        narrationPath,
        '-c:v',
        'copy',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-movflags',
        '+faststart',
        '-shortest',
        finalPath,
      ]);
      await extractThumbnail(lang, finalPath);
    }
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
