import fs from 'node:fs/promises';
import path from 'node:path';
import { fromPath } from 'pdf2pic';

// Usage: node scripts/pdf-to-images.mjs --file docs/utildata/SG_aug25bill.pdf --out docs/utildata --prefix sg_aug25bill_page

function parseArgs() {
  const args = process.argv.slice(2);
  const acc = { file: '', out: '', prefix: 'page' };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--file') {
      acc.file = args[++i];
    } else if (a === '--out') {
      acc.out = args[++i];
    } else if (a === '--prefix') {
      acc.prefix = args[++i];
    }
  }
  if (!acc.file) {
    throw new Error('Missing --file');
  }
  acc.out = acc.out || path.dirname(acc.file);
  return acc;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const { file, out, prefix } = parseArgs();
  await ensureDir(out);

  const converter = fromPath(file, {
    density: 180,
    saveFilename: prefix,
    savePath: out,
    format: 'jpg',
    width: 2000,
    height: 0,
  });

  console.log(`🖼️ Converting PDF to images: ${file}`);
  const res = await converter.bulk(-1, true);
  const files = res.map((r) => r.path);
  console.log(
    '✅ Saved images:',
    files.map((f) => path.basename(f)).join(', ')
  );
}

main().catch((err) => {
  console.error('❌ pdf-to-images failed:', err.message);
  process.exit(1);
});
