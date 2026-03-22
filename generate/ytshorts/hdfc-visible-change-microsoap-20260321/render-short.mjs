#!/usr/bin/env node
import path from 'node:path';
import os from 'node:os';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const execFileAsync = promisify(execFile);

const ROOT = '/Users/kumara/personal-website';
const OUT_DIR = path.join(
  ROOT,
  'generate/ytshorts/hdfc-visible-change-microsoap-20260321',
);
const FRAMES_DIR = path.join(OUT_DIR, 'frames');
const SEGMENTS_DIR = path.join(OUT_DIR, 'segments');
const CHROME_PATH =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const MODEL = process.env.BLOG_TTS_MODEL || 'gpt-4o-mini-tts';
const VOICE =
  process.env.BLOG_TTS_TA_VOICE ||
  process.env.BLOG_TTS_EN_VOICE ||
  process.env.BLOG_TTS_VOICE ||
  'sage';

const SEGMENTS = [
  {
    slug: '01-hook',
    duration: 5,
    kicker: 'BREAKING NEWS',
    title: 'Visible Change or Just Optics?',
    deck: 'A chairman exits. Customers still wait for proof.',
    issue: 'Headline is easy. Support is the real test.',
    accent: '#4FC3F7',
    en: 'Chairman exits. Will customers finally see change?',
    ta: 'தலைவர் வெளியேறினார். கஸ்டமருக்கு மாற்றம் வருமா?',
  },
  {
    slug: '02-phone',
    duration: 5,
    kicker: 'REAL TEST',
    title: 'Pick Up the Phone',
    deck: 'No speech can replace one useful call.',
    issue: 'Visible change starts with somebody answering and staying on the line.',
    accent: '#7CFF9B',
    en: 'Visible change is simple. Pick up the phone and help.',
    ta: 'காணக்கூடிய மாற்றம் சிம்பிள். போன் எடுத்து உதவுங்கள்.',
  },
  {
    slug: '03-card',
    duration: 5.5,
    kicker: 'PERSONAL FILE',
    title: 'Forced Reissue',
    deck: 'My card got changed before I even asked.',
    issue: 'The bank acted first. Explanation came last.',
    accent: '#FFB454',
    en: 'My card was forced into reissue. I never asked for it.',
    ta: 'என் கார்டை கட்டாயமாக ரீஇஷ்யூ செய்தார்கள். நான் கேட்கவே இல்லை.',
  },
  {
    slug: '04-emi',
    duration: 5.5,
    kicker: 'SURPRISE OFFER',
    title: 'EMI Instead of Help',
    deck: 'Support request went in. EMI pitch came out.',
    issue: 'I asked for help. The system pushed installments.',
    accent: '#FF7A66',
    en: 'I asked for help. EMI got pushed instead.',
    ta: 'நான் ஹெல்ப் கேட்டேன். EMI-யை திணித்தார்கள்.',
  },
  {
    slug: '05-policy',
    duration: 5.5,
    kicker: 'CROSS-SELL PRESSURE',
    title: 'Policy Pitch Too',
    deck: 'Support issue one side. Insurance and pension pitch on the other.',
    issue: 'In my experience, unwanted HDFC Life and pension policies keep getting pushed too.',
    accent: '#90A6FF',
    en: 'In my experience, they also keep pushing unwanted HDFC Life and pension policies.',
    ta: 'என் அனுபவத்தில், வேண்டாத HDFC Life மற்றும் pension policies-யும் திணிக்கிறார்கள்.',
  },
  {
    slug: '06-relay',
    duration: 5.5,
    kicker: 'DEPARTMENT DRAMA',
    title: 'Relay Race Support',
    deck: 'Branch to care. Care to card team. Card team back to branch.',
    issue: 'Everybody transfers. Nobody owns.',
    accent: '#D18CFF',
    en: 'Branch says customer care. Customer care says card team.',
    ta: 'பிராஞ்ச் கஸ்டமர் கேர் சொல்கிறது. கஸ்டமர் கேர் கார்டு டீம் சொல்கிறது.',
  },
  {
    slug: '07-planets',
    duration: 5.5,
    kicker: 'COORDINATION CHECK',
    title: 'Same Bank. Different Planets.',
    deck: 'Internal handoff feels like interplanetary travel.',
    issue: 'One logo outside. Three disconnected realities inside.',
    accent: '#68E1FD',
    en: 'Card team sends me back again. Same bank. Different planets.',
    ta: 'கார்டு டீம் மீண்டும் திருப்புகிறது. ஒரே வங்கி. வேறு வேறு கிரகங்கள்.',
  },
  {
    slug: '08-meaning',
    duration: 6,
    kicker: 'IF THIS MEANS ANYTHING',
    title: 'Departments Should Actually Talk',
    deck: 'Leadership change should reduce customer ping-pong.',
    issue: 'Real governance is internal coordination with one owner per problem.',
    accent: '#9EE06A',
    en: 'If this exit means anything, departments should talk to each other.',
    ta: 'இந்த வெளியேற்றத்துக்கு அர்த்தம் இருந்தால், டிபார்ட்மென்ட்ஸ் ஒருவருடன் ஒருவர் பேசணும்.',
  },
  {
    slug: '09-fix',
    duration: 6,
    kicker: 'NO MORE SHOW',
    title: 'Fix One Issue End to End',
    deck: 'No speeches. No optics. Just resolution.',
    issue: 'Listen, own the case, and close it without making the customer chase.',
    accent: '#FFCF5A',
    en: 'No speeches. No optics. Just solve one issue end to end.',
    ta: 'ஸ்பீச்சும் வேண்டாம். ஷோவும் வேண்டாம். ஒரு பிரச்சனையை முழுதாக தீர்க்குங்கள்.',
  },
  {
    slug: '10-outro',
    duration: 5,
    kicker: 'UNTIL THEN',
    title: 'Same Hold Music',
    deck: 'New chairman. Old pain. Same waiting music.',
    issue: 'Customers will believe change only when support changes first.',
    accent: '#F973B5',
    en: 'Until then, new chairman. Same hold music.',
    ta: 'அதுவரை, புதிய தலைவர். அதே ஹோல்ட் மியூசிக்.',
  },
];

function ensureApiKey() {
  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required.');
  }
  return apiKey;
}

async function run(command, args, options = {}) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    maxBuffer: 32 * 1024 * 1024,
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

function toTimestamp(seconds) {
  const safe = Math.max(0, seconds);
  const totalMs = Math.round(safe * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
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

function buildHtml(segment, index, total) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --accent: ${segment.accent};
        --ink: #07111c;
        --panel: rgba(7, 17, 28, 0.78);
        --panel-soft: rgba(14, 23, 38, 0.48);
        --line: rgba(255, 255, 255, 0.08);
        --white: #f8fafc;
        --muted: #d3dbe7;
        --muted2: #aeb8c7;
      }

      * { box-sizing: border-box; }

      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        background:
          radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 30%),
          radial-gradient(circle at 84% 18%, rgba(255, 122, 102, 0.22), transparent 28%),
          radial-gradient(circle at 78% 88%, rgba(255, 207, 90, 0.18), transparent 24%),
          linear-gradient(180deg, #091321 0%, #0b1320 48%, #120f1c 100%);
        color: var(--white);
        overflow: hidden;
      }

      body {
        font-family: "Arial", "Helvetica Neue", sans-serif;
      }

      .frame {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 74px;
      }

      .frame::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        background-size: 96px 96px;
        mask-image: linear-gradient(180deg, transparent 2%, rgba(0,0,0,0.9) 16%, rgba(0,0,0,0.96) 88%, transparent 100%);
      }

      .blob {
        position: absolute;
        border-radius: 999px;
        filter: blur(8px);
        opacity: 0.92;
      }

      .blob.one {
        width: 340px;
        height: 340px;
        top: -70px;
        right: -40px;
        background: color-mix(in srgb, var(--accent) 38%, transparent);
      }

      .blob.two {
        width: 260px;
        height: 260px;
        bottom: 260px;
        left: -60px;
        background: rgba(255, 122, 102, 0.18);
      }

      .ticker {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 22px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(9, 17, 29, 0.64);
        backdrop-filter: blur(16px);
        letter-spacing: 0.16em;
        text-transform: uppercase;
        font-size: 20px;
        font-weight: 700;
        color: var(--muted);
      }

      .ticker span:last-child {
        color: var(--white);
      }

      .hero {
        position: relative;
        margin-top: 110px;
        padding: 46px 44px 40px;
        border: 1px solid var(--line);
        border-radius: 44px;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)),
          rgba(8, 16, 26, 0.72);
        backdrop-filter: blur(18px);
      }

      .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 44px;
        padding: 1px;
        background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 68%, transparent), transparent 46%, rgba(255,255,255,0.16) 100%);
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      }

      .kicker {
        display: inline-flex;
        padding: 12px 18px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--accent) 22%, transparent);
        color: var(--white);
        font-size: 24px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        font-weight: 700;
      }

      .title {
        margin: 22px 0 18px;
        max-width: 840px;
        font-size: 102px;
        line-height: 0.92;
        font-weight: 800;
        letter-spacing: -0.05em;
      }

      .deck {
        margin: 0;
        max-width: 720px;
        font-size: 38px;
        line-height: 1.25;
        color: var(--muted);
      }

      .issue {
        position: relative;
        margin-top: 34px;
        max-width: 700px;
        padding-left: 28px;
        font-size: 29px;
        line-height: 1.34;
        color: var(--muted2);
      }

      .issue::before {
        content: "";
        position: absolute;
        left: 0;
        top: 2px;
        bottom: 2px;
        width: 8px;
        border-radius: 999px;
        background: var(--accent);
      }

      .score {
        position: absolute;
        top: 412px;
        right: 74px;
        width: 220px;
        border-radius: 34px;
        padding: 24px 20px;
        border: 1px solid var(--line);
        background: rgba(7, 17, 28, 0.72);
        text-align: center;
      }

      .score .label {
        font-size: 20px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--muted2);
      }

      .score .value {
        margin-top: 10px;
        font-size: 74px;
        line-height: 1;
        font-weight: 800;
        color: var(--accent);
      }

      .score .sub {
        margin-top: 10px;
        font-size: 22px;
        color: var(--muted);
      }

      .caption-card {
        position: absolute;
        left: 74px;
        right: 74px;
        bottom: 150px;
        padding: 34px 34px 30px;
        border-radius: 34px;
        border: 1px solid var(--line);
        background:
          linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
          rgba(7, 17, 28, 0.84);
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
      }

      .caption-en,
      .caption-ta {
        margin: 0;
        font-weight: 700;
      }

      .caption-en {
        font-size: 52px;
        line-height: 1.12;
        letter-spacing: -0.03em;
      }

      .caption-ta {
        margin-top: 18px;
        font-family: "Tamil Sangam MN", "Tamil MN", sans-serif;
        font-size: 48px;
        line-height: 1.18;
        color: #f4f7fb;
      }

      .footer {
        position: absolute;
        left: 74px;
        right: 74px;
        bottom: 58px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--muted2);
        font-size: 22px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .bar {
        position: absolute;
        left: 74px;
        right: 74px;
        bottom: 118px;
        height: 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }

      .bar::after {
        content: "";
        display: block;
        height: 100%;
        width: ${(Math.round(((index + 1) / total) * 1000) / 10).toFixed(1)}%;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--accent), rgba(255,255,255,0.92));
      }
    </style>
  </head>
  <body>
    <div class="frame">
      <div class="blob one"></div>
      <div class="blob two"></div>

      <div class="ticker">
        <span>Microsoap / Episode 1</span>
        <span>HDFC / Visible Change?</span>
      </div>

      <section class="hero">
        <div class="kicker">${escapeHtml(segment.kicker)}</div>
        <h1 class="title">${escapeHtml(segment.title)}</h1>
        <p class="deck">${escapeHtml(segment.deck)}</p>
        <p class="issue">${escapeHtml(segment.issue)}</p>
      </section>

      <aside class="score">
        <div class="label">Scene</div>
        <div class="value">${String(index + 1).padStart(2, '0')}</div>
        <div class="sub">${String(total).padStart(2, '0')} total</div>
      </aside>

      <div class="bar"></div>

      <section class="caption-card">
        <p class="caption-en">${escapeHtml(segment.en)}</p>
        <p class="caption-ta">${escapeHtml(segment.ta)}</p>
      </section>

      <div class="footer">
        <span>March 2026</span>
        <span>Customer support is the headline</span>
      </div>
    </div>
  </body>
</html>`;
}

async function renderFrames() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });

    for (let index = 0; index < SEGMENTS.length; index += 1) {
      const segment = SEGMENTS[index];
      const html = buildHtml(segment, index, SEGMENTS.length);
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      });
      const framePath = path.join(FRAMES_DIR, `${segment.slug}.png`);
      await page.screenshot({
        path: framePath,
        type: 'png',
      });
    }
  } finally {
    await browser.close();
  }
}

async function renderSegmentVideo(segment) {
  const framePath = path.join(FRAMES_DIR, `${segment.slug}.png`);
  const outputPath = path.join(SEGMENTS_DIR, `${segment.slug}.mp4`);
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
    'scale=1080:1920',
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
      input: `${segment.en} ${segment.ta}`,
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
    const audioFilter = `${atempoChain(rate)},volume=1.85`;

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
  const entries = SEGMENTS.map((segment, index) => {
    const start = cursor;
    const end = cursor + segment.duration;
    cursor = end;
    return `${index + 1}\n${toTimestamp(start)} --> ${toTimestamp(end)}\n${segment.en}\n${segment.ta}`;
  });

  const srtPath = path.join(OUT_DIR, 'final.srt');
  await writeFile(srtPath, `${entries.join('\n\n')}\n`, 'utf8');
  return srtPath;
}

async function writeMetadata() {
  const title = 'HDFC Chairman Exit, But Will Customer Support Change?';
  const description = `A bilingual English + Tamil microsoap on one question: will the HDFC chairman exit lead to visible customer support improvements, or is it just another show?\n\nThis satirical short is framed around my personal experience with forced card reissue, EMI pushing, unwanted HDFC Life and pension policy pitches, and poor coordination between departments.\n\n#HDFC #HDFCBank #CustomerSupport #Banking #Microsoap #Tamil #English #Shorts\n`;
  const tags = 'HDFC,HDFC Bank,HDFC chairman exit,HDFC customer support,HDFC Life,pension policy,banking complaints,forced card reissue,EMI push,sales pressure,customer service,English Tamil,bank satire,microsoap,shorts';
  const pinnedComment = 'If support had to improve in one place first, what should it be: phone pickup, issue ownership, or stopping forced cross-sell pitches?';
  const voiceoverText = SEGMENTS.map(
    (segment, index) =>
      `${index + 1}. ${segment.en}\n   ${segment.ta}`,
  ).join('\n\n');
  const metadata = {
    title,
    description,
    tags: tags.split(','),
    pinnedComment,
    model: MODEL,
    voice: VOICE,
    fps: FPS,
    size: `${WIDTH}x${HEIGHT}`,
    totalDurationSeconds: SEGMENTS.reduce((sum, segment) => sum + segment.duration, 0),
    generatedAt: new Date().toISOString(),
  };

  await writeFile(path.join(OUT_DIR, 'title.txt'), `${title}\n`, 'utf8');
  await writeFile(path.join(OUT_DIR, 'description.txt'), description, 'utf8');
  await writeFile(path.join(OUT_DIR, 'tags.txt'), `${tags}\n`, 'utf8');
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
  await writeFile(
    path.join(OUT_DIR, 'upload-manifest.json'),
    `${JSON.stringify(
      {
        project: 'hdfc-visible-change-microsoap-20260321',
        created_at: new Date().toISOString(),
        format: {
          aspect_ratio: '9:16',
          size: `${WIDTH}x${HEIGHT}`,
          duration_seconds: SEGMENTS.reduce(
            (sum, segment) => sum + segment.duration,
            0,
          ),
          fps: FPS,
        },
        outputs: {
          final_video: 'final.mp4',
          captions: 'final.srt',
          voiceover_audio: 'voiceover.wav',
          title: 'title.txt',
          description: 'description.txt',
          tags: 'tags.txt',
          pinned_comment: 'pinned-comment.txt',
        },
        notes: {
          format: 'bilingual English + Tamil microsoap',
          positioning: 'satire rooted in personal customer experience',
          voice: VOICE,
          model: MODEL,
        },
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
}

async function main() {
  const apiKey = ensureApiKey();
  await rm(FRAMES_DIR, { recursive: true, force: true });
  await rm(SEGMENTS_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir(SEGMENTS_DIR, { recursive: true });
  await writeMetadata();
  await renderFrames();

  for (const segment of SEGMENTS) {
    await renderSegmentVideo(segment);
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'hdfc-microsoap-'));
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
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
