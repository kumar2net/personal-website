#!/usr/bin/env node
import path from 'node:path';
import os from 'node:os';
import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const execFileAsync = promisify(execFile);

const ROOT = '/Users/kumara/personal-website';
const PROJECT = 'middle-east-fiasco-cost-scorecard-hi-ta-20260410';
const OUT_DIR = path.join(ROOT, 'generate/ytshorts', PROJECT);
const FRAMES_DIR = path.join(OUT_DIR, 'frames');
const SEGMENTS_DIR = path.join(OUT_DIR, 'segments');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SOURCE_URL = 'https://www.kumar2net.com/blog/2026-04-10-middle-east-fiasco-cost-scorecard';
const SOURCE_FILE =
  'apps/personal-website/src/pages/blog/2026-04-10-middle-east-fiasco-cost-scorecard.jsx';

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
    duration: 2.8,
    speakLang: 'hi',
    kicker: 'OPENING LOOP',
    title: 'Strategy?',
    stat: 'Invoice',
    issue: 'Promised safety: delayed. Bill: punctual.',
    accent: '#E11D48',
    hi: 'रणनीति नहीं. बिल देखिए.',
    ta: 'Strategy இல்லை. Bill-ஐ பாருங்கள்.',
  },
  {
    slug: '02-human-cost',
    duration: 3.0,
    speakLang: 'ta',
    kicker: 'FIRST PRINCIPLE',
    title: 'Human bill first',
    stat: 'Worse than money',
    issue: 'The money scorecard is only the spreadsheet version of loss.',
    accent: '#0F766E',
    hi: 'मानव लागत सबसे भारी है.',
    ta: 'மனித விலையே மிகப் பெரியது.',
  },
  {
    slug: '03-gaza-west-bank',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'RECOVERY NEEDS',
    title: 'Gaza + West Bank',
    stat: '$53B',
    issue: 'Recovery needs through the first assessment window.',
    accent: '#DC2626',
    hi: 'Gaza और West Bank: $53B recovery.',
    ta: 'காசா + West Bank: $53B recovery.',
  },
  {
    slug: '04-lebanon',
    duration: 3.1,
    speakLang: 'ta',
    kicker: 'NEXT LEDGER',
    title: 'Lebanon',
    stat: '$11B',
    issue: 'Recovery needs, with a wider economic hit behind it.',
    accent: '#2563EB',
    hi: 'Lebanon को $11B rebuild चाहिए.',
    ta: 'Lebanon-க்கு $11B rebuild தேவை.',
  },
  {
    slug: '05-israel-public-bill',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'PUBLIC BILL',
    title: 'Israel',
    stat: '~$46B',
    issue: 'Conflict expenses through end-2024, before the larger forecast.',
    accent: '#7C3AED',
    hi: 'Israel का public bill? लगभग $46B.',
    ta: 'Israel public bill? சுமார் $46B.',
  },
  {
    slug: '06-israel-forecast',
    duration: 3.2,
    speakLang: 'ta',
    kicker: 'FORECAST MODE',
    title: '2023-2025',
    stat: '~$81B',
    issue: 'Budget yoga: stretch now, explain later.',
    accent: '#059669',
    hi: '2023-25 forecast: $81B. Budget योगासन.',
    ta: '2023-25 forecast: $81B. Budget யோகாசனம்.',
  },
  {
    slug: '07-suez-revenue',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'SUEZ CANAL',
    title: 'Revenue drop',
    stat: '$10.25B -> $3.99B',
    issue: 'One foreign-currency lifeline gets a very expensive detour.',
    accent: '#0891B2',
    hi: 'Suez revenue $10.25B से $3.99B.',
    ta: 'Suez வருமானம் $10.25B-இல் இருந்து $3.99B.',
  },
  {
    slug: '08-ship-traffic',
    duration: 3.0,
    speakLang: 'ta',
    kicker: 'TRAFFIC CHECK',
    title: 'Ships reroute',
    stat: '-50%',
    issue: 'Traffic down. Detour meter running.',
    accent: '#CA8A04',
    hi: 'Ship traffic आधा. Detour full rate.',
    ta: 'Ship traffic பாதி. Detour full rate.',
  },
  {
    slug: '09-container-freight',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'GLOBAL TRADE',
    title: 'Container shock',
    stat: '-67% / +256%',
    issue: 'Fewer container transits. Much louder freight bill.',
    accent: '#DB2777',
    hi: 'Container transits -67%. Freight +256%.',
    ta: 'Container transit -67%. Freight +256%.',
  },
  {
    slug: '10-inflation',
    duration: 3.0,
    speakLang: 'ta',
    kicker: 'LATER EFFECT',
    title: 'Inflation arrives',
    stat: 'Surprise?',
    issue: 'Fuel, insurance, delay, then the consumer bill.',
    accent: '#16A34A',
    hi: 'Inflation फिर surprise? सच में?',
    ta: 'Inflation மீண்டும் surprise-aa? Really?',
  },
  {
    slug: '11-us-tab',
    duration: 3.2,
    speakLang: 'hi',
    kicker: 'TAXPAYER TAB',
    title: 'U.S. ledger',
    stat: '~$31-34B',
    issue: 'Military activity plus aid, and still only one country.',
    accent: '#EA580C',
    hi: 'U.S. tab: करीब $31-34B.',
    ta: 'U.S. bill: கிட்டத்தட்ட $31-34B.',
  },
  {
    slug: '12-one-ledger',
    duration: 3.2,
    speakLang: 'ta',
    kicker: 'ACCOUNTING NOTE',
    title: 'One country only',
    stat: 'Not the whole bill',
    issue: 'This is why fake grand totals look clean and lie dirty.',
    accent: '#4F46E5',
    hi: 'और ये सिर्फ एक देश का ledger.',
    ta: 'அதுவும் ஒரு நாட்டின் ledger மட்டும்.',
  },
  {
    slug: '13-recovery-subtotal',
    duration: 3.1,
    speakLang: 'hi',
    kicker: 'CLEAN SUBTOTAL',
    title: 'Recovery alone',
    stat: '~$64B',
    issue: 'Gaza and West Bank plus Lebanon. Nothing else included.',
    accent: '#0D9488',
    hi: 'Clean subtotal? Recovery alone ~$64B.',
    ta: 'Clean subtotal? Recovery மட்டும் ~$64B.',
  },
  {
    slug: '14-spreadsheet-headache',
    duration: 3.2,
    speakLang: 'ta',
    kicker: 'NOT INCLUDED',
    title: 'Everything else',
    stat: 'Headache',
    issue: 'Budgets, trade, insurance, delay, and taxpayer tabs sit outside it.',
    accent: '#9333EA',
    hi: 'बाकी costs? Spreadsheet को भी headache.',
    ta: 'மீதமுள்ள costs? Spreadsheet-க்கே headache.',
  },
  {
    slug: '15-security-claim',
    duration: 3.0,
    speakLang: 'hi',
    kicker: 'PAYOFF',
    title: 'Security pitch',
    stat: 'Poorer + less secure',
    issue: 'If this was the premium plan, the cancellation policy is rude.',
    accent: '#B91C1C',
    hi: 'Security बोला, सब गरीब हुए.',
    ta: 'Security சொன்னோம், எல்லோரும் poorer.',
  },
  {
    slug: '16-close',
    duration: 3.2,
    speakLang: 'ta',
    kicker: 'CURIOSITY CTA',
    title: 'Invoice wins',
    stat: 'Now',
    issue: 'Safety later. Invoice now. Classic procurement comedy.',
    accent: '#15803D',
    hi: 'Safety बाद में. Invoice अभी. Classic.',
    ta: 'Safety later. Invoice இப்போதே. Classic.',
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
          linear-gradient(90deg, rgba(17, 24, 39, 0.07) 1px, transparent 1px),
          linear-gradient(180deg, rgba(17, 24, 39, 0.07) 1px, transparent 1px),
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
        <span>Middle East Cost Scorecard</span>
        <small>${scene}/${totalScenes}</small>
      </header>

      <section class="receipt">
        <div class="stamp">BILLABLE</div>
        <div class="kicker">${escapeHtml(segment.kicker)}</div>
        <h1 class="title">${escapeHtml(segment.title)}</h1>
        <div class="stat">${escapeHtml(segment.stat)}</div>
        <p class="issue">${escapeHtml(segment.issue)}</p>
      </section>

      <section class="caption" aria-label="Hindi and Tamil captions">
        <p class="hi">${escapeHtml(segment.hi)}</p>
        <p class="ta">${escapeHtml(segment.ta)}</p>
      </section>

      <footer class="footer">
        <span>Hindi + Tamil</span>
        <div class="bar"></div>
        <span>Invoice now</span>
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
  const title = 'Middle East War Costs: $64B+ Before the Extras';
  const description = `Promised safety later. Invoice now.\n\nHindi + Tamil cost-scorecard satire from Kumar's Middle East escalation post: $53B for Gaza and West Bank recovery needs, $11B for Lebanon recovery needs, Israel's public bill, the Suez revenue drop, shipping disruption, and the U.S. taxpayer tab.\n\nNot one fake grand total: $64B is recovery needs alone, before Israel's fiscal costs, Suez losses, freight shock, insurance, delays, and wider taxpayer bills.\n\nSource with dated references:\n${SOURCE_URL}\n\n#MiddleEast #WarCosts #Geopolitics #Hindi #Tamil #Shorts\n`;
  const tags = [
    'Middle East war costs',
    'Middle East cost scorecard',
    'war cost explained',
    'Gaza recovery needs',
    'West Bank recovery needs',
    'Lebanon recovery needs',
    'Israel war bill',
    'Suez Canal revenue',
    'Red Sea shipping',
    'shipping disruption',
    'freight rates',
    'US taxpayer tab',
    'geopolitics satire',
    'political satire',
    'Hindi Tamil short',
    'Hindi captions',
    'Tamil captions',
    'YouTube Shorts',
    'shorts',
  ];
  const pinnedComment =
    'Which ledger should come first: rebuilding costs, shipping shock, or taxpayer tabs?';
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
      hook: '0-2.8s: strategy versus invoice open loop',
      context: 'human cost first, then dated ledgers',
      proof: 'one number per scene across recovery, budget, shipping, and taxpayer tabs',
      payoff: 'promised safety later, invoice now',
      cta: 'ask where the cost scorecard should start',
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
      format: 'bilingual Hindi + Tamil cost-scorecard satire',
      narration: 'alternates Hindi and Tamil; captions include both languages on every segment',
      source_handling:
        'keeps recovery needs separate from budget costs, lost revenue, trade indicators, and taxpayer tabs',
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
