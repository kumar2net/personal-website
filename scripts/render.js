import fs from 'fs/promises';

function renderSVG(data) {
  const width = 900;
  const height = 500;
  const margin = { top: 40, right: 20, bottom: 120, left: 80 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const cities = data.map(d => d.city);
  const maxTotal = Math.max(...data.map(d => d.totalUSD));

  const xBand = (i) => {
    const n = cities.length;
    const step = innerW / Math.max(n, 1);
    return margin.left + i * step + step * 0.2;
  };
  const barWidth = innerW / Math.max(cities.length, 1) * 0.6;

  const yScale = v => margin.top + innerH - (maxTotal > 0 ? (v / maxTotal) * innerH : 0);

  const rect = (x, y, w, h, fill) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}"/>`;
  const text = (x, y, t, anchor='middle', cls='') => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" class="${cls}">${t}</text>`;

  let svg = '';
  svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<style>
    .title{font:600 18px system-ui, sans-serif; fill:#111}
    .axis{font:12px system-ui, sans-serif; fill:#555}
    .tick line{stroke:#ddd}
    .label{font:600 12px system-ui, sans-serif; fill:#333}
  </style>`;
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>`;
  svg += text(margin.left, margin.top - 10, 'All Utilities — Stacked Charges by City (USD)', 'start', 'title');

  // Y axis ticks
  const ticks = 5;
  for (let t = 0; t <= ticks; t++) {
    const v = (maxTotal / ticks) * t;
    const y = yScale(v);
    svg += `<g class="tick">`;
    svg += `<line x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}" stroke="#eee"/>`;
    svg += text(margin.left - 10, y + 4, `$${v.toFixed(0)}`, 'end', 'axis');
    svg += `</g>`;
  }

  // Bars
  data.forEach((d, i) => {
    const x = xBand(i);
    const totalH = innerH * (d.totalUSD / (maxTotal || 1));
    const baseY = margin.top + innerH;

    const parts = [
      { key: 'electricityUSD', color: '#6366f1' },
      { key: 'gasUSD', color: '#f59e0b' },
      { key: 'waterUSD', color: '#0891b2' }
    ];

    let yTop = baseY;
    parts.forEach(p => {
      const v = d[p.key] || 0;
      const h = innerH * (v / (maxTotal || 1));
      if (h <= 0.1) return;
      yTop -= h;
      svg += rect(x, yTop, barWidth, h, p.color);
    });

    // City and total
    svg += text(x + barWidth / 2, baseY + 14, d.city, 'middle', 'axis');
    svg += text(x + barWidth / 2, baseY + 30, `$${d.totalUSD.toFixed(2)}`, 'middle', 'label');
  });

  // Legend
  const legend = [
    { label: 'Electricity', color: '#6366f1' },
    { label: 'Gas', color: '#f59e0b' },
    { label: 'Water', color: '#0891b2' }
  ];
  let lx = margin.left, ly = height - 60;
  legend.forEach(item => {
    svg += rect(lx, ly - 10, 12, 12, item.color);
    svg += text(lx + 20, ly, item.label, 'start', 'axis');
    lx += 120;
  });

  svg += `</svg>`;
  return svg;
}

(async () => {
  const raw = await fs.readFile('/workspace/output/utilities.json', 'utf8');
  const data = JSON.parse(raw).filter(d => d && d.city);
  const svg = renderSVG(data);
  await fs.writeFile('/workspace/output/utilities.svg', svg, 'utf8');
  console.log('Wrote /workspace/output/utilities.svg');
})();
