import { chromium } from 'playwright';
import fs from 'fs/promises';

const URL = 'https://kumarsite.netlify.app/utilities';

function parseTable(rows) {
  const data = [];
  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll('td'));
    if (cells.length !== 5) continue;
    const [cityEl, elecEl, gasEl, waterEl, totalEl] = cells;
    const text = el => el.textContent.trim();
    const toNum = v => {
      if (!v) return 0;
      const m = v.match(/([\d.,]+)/);
      if (!m) return 0;
      return parseFloat(m[1].replace(/,/g, ''));
    };
    data.push({
      city: text(cityEl),
      electricityUSD: toNum(text(elecEl)),
      gasUSD: toNum(text(gasEl)),
      waterUSD: toNum(text(waterEl)),
      totalUSD: toNum(text(totalEl))
    });
  }
  return data;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForSelector('h2:has-text("All Utilities")', { timeout: 15000 }).catch(() => {});
  const tableSelector = 'section:has(h2:has-text("All Utilities")) table tbody tr';
  await page.waitForSelector(tableSelector, { timeout: 15000 });

  const rows = await page.$$eval(tableSelector, trs => trs.map(tr => tr.outerHTML));
  // Re-evaluate inside the page to parse cells for reliability
  const data = await page.$$eval(tableSelector, trs => {
    const toNum = v => {
      if (!v) return 0;
      const m = v.match(/([\d.,]+)/);
      if (!m) return 0;
      return parseFloat(m[1].replace(/,/g, ''));
    };
    return trs.map(tr => {
      const tds = Array.from(tr.querySelectorAll('td'));
      const city = tds[0]?.textContent.trim();
      const electricityUSD = toNum(tds[1]?.textContent.trim());
      const gasUSD = toNum(tds[2]?.textContent.trim());
      const waterUSD = toNum(tds[3]?.textContent.trim());
      const totalUSD = toNum(tds[4]?.textContent.trim());
      return { city, electricityUSD, gasUSD, waterUSD, totalUSD };
    });
  });

  await fs.writeFile('/workspace/output/utilities.json', JSON.stringify(data, null, 2));
  await browser.close();
  console.log(`Saved /workspace/output/utilities.json with ${data.length} rows`);
})();
