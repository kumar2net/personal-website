import fs from 'node:fs/promises'

const jsonPath = new URL('../docs/utildata/extracted_data.json', import.meta.url)
const raw = await fs.readFile(jsonPath, 'utf8')
const arr = JSON.parse(raw)
const entry = arr.find(x => x.filename === 'orlandowaterbill.jpeg')
if (!entry) {
  console.error('Orlando water entry not found')
  process.exit(1)
}
const c = entry.content

function around(pattern, radius = 180) {
  const m = c.match(pattern)
  if (!m) return null
  const idx = m.index ?? 0
  const start = Math.max(0, idx - radius)
  const end = Math.min(c.length, idx + radius)
  return c.slice(start, end)
}

console.log('--- Water Consumption context ---')
console.log(around(/Water\s*Consumption/i) || 'N/A')
console.log('\n--- Usage table context ---')
console.log(around(/UsageX100/i) || 'N/A')
console.log('\n--- Dollar amounts near Water ---')
console.log((c.match(/Water[\s\S]{0,80}?\$\s*[0-9]+\.?[0-9]*/gi) || []).join('\n') || 'N/A')
console.log('\n--- Any $ amounts ---')
console.log((c.match(/\$\s*[0-9]+\.?[0-9]*/g) || []).slice(0, 20).join(', '))


