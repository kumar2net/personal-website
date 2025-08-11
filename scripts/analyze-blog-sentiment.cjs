const fs = require('fs');
const path = require('path');
const Sentiment = require('sentiment');

const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src/pages/blog');
const OUTPUT_MD = path.join(ROOT, 'docs', 'blog-sentiment-summary.md');
const OUTPUT_JSON = path.join(ROOT, 'src', 'data', 'blog-sentiment-summary.json');
const sentiment = new Sentiment();

function extractTitle(content) {
  const match = content.match(/<h1[^>]*>(.*?)<\/h1>/s);
  return match ? match[1].replace(/\s+/g, ' ').trim() : 'Untitled';
}

function extractMainText(content) {
  // Extract all text inside <p>...</p> tags
  const matches = [...content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)];
  return matches.map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).join(' ');
}

function getSentimentLabel(score) {
  if (score > 1) return 'positive';
  if (score < -1) return 'negative';
  return 'neutral';
}

function analyzeBlogPosts() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.jsx'));
  const results = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const title = extractTitle(content);
    const mainText = extractMainText(content);
    const { score } = sentiment.analyze(mainText);
    const label = getSentimentLabel(score);
    results.push({ title, score, label });
  }

  // Write Markdown summary
  let md = '# Blog Sentiment Summary\n\n';
  md += '| Post Title | Sentiment Score | Sentiment Label |\n';
  md += '|------------|-----------------|-----------------|\n';
  for (const { title, score, label } of results) {
    md += `| ${title} | ${score} | ${label} |\n`;
  }
  fs.writeFileSync(OUTPUT_MD, md, 'utf8');

  // Write JSON summary
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Sentiment summary written to ${OUTPUT_MD} and ${OUTPUT_JSON}`);
}

analyzeBlogPosts(); 