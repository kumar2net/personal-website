#!/bin/bash
set -e

echo "🔧 Setting up Generations 2.0 API integration..."

# 1️⃣ Environment setup
cat > .env.local <<'EOF'
VITE_GENERATIONS_API_URL=https://api.kumar2net.com/generations
VITE_GENERATIONS_API_KEY=sk-test-yourkeyhere
EOF
echo "✅ .env.local configured"

# 2️⃣ Create lib client wrapper
mkdir -p src/lib
cat > src/lib/generationsClient.ts <<'EOF'
export async function apiRequest(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
) {
  const url = `${import.meta.env.VITE_GENERATIONS_API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${import.meta.env.VITE_GENERATIONS_API_KEY}`,
  };
  if (body) headers['Content-Type'] = 'application/json';

  let retries = 0;
  while (retries < 3) {
    try {
      const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      retries++;
      if (retries >= 3) throw err;
      const delay = 500 * Math.pow(2, retries);
      console.log(\`Retry \${retries}/3 in \${delay}ms\`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
EOF
echo "✅ generationsClient.ts created"

# 3️⃣ Create Vercel function stubs for local testing
mkdir -p api/generations
cat > api/generations/entry.ts <<'EOF'
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { promptId, text, emoji, imageUrl } = req.body || {};
  if (!text && !imageUrl) return res.status(400).json({ error: 'Missing reflection content' });

  return res.status(200).json({
    ok: true,
    entryId: `gen_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  });
}
EOF

cat > api/generations/reflections.ts <<'EOF'
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const entries = [
    { id: 'gen_01', text: 'Watched the sunset after work.', emoji: '🌇', tone: 'calm', toneLabel: 'Calm' },
    { id: 'gen_02', text: 'Had street food with friends.', emoji: '🍜', tone: 'joyful', toneLabel: 'Joyful' },
  ];
  return res.status(200).json({ week: '2025-W45', entries });
}
EOF

cat > api/generations/upload.ts <<'EOF'
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // mock image upload
  return res.status(200).json({
    url: `https://blob.vercel-storage.com/mock/${Math.random().toString(36).slice(2)}.jpg`,
  });
}
EOF
echo "✅ Local API mock endpoints created"

# 4️⃣ Inject API docs in README for reference
cat >> README.md <<'EOF'

---

## 🌐 Generations 2.0 API

**Base URL:** \`https://api.kumar2net.com/generations\`

| Endpoint | Method | Purpose |
|-----------|---------|----------|
| `/entry` | POST | Submit reflection |
| `/reflections` | GET | Fetch current week’s reflections |
| `/upload` | POST | Upload image |

**Auth:**  
`Authorization: Bearer $VITE_GENERATIONS_API_KEY`

**Retry logic:**  
Up to 3 retries (0.5s, 1s, 2s backoff)
EOF
echo "✅ README updated"

# 5️⃣ Commit (optional)
git add .env.local src/lib api README.md
git commit -m "Integrate Generations 2.0 API client + mock endpoints" || true

echo "✅ Generations 2.0 API integration ready!"
echo "Run 'npm run dev' or 'pnpm dev' to test locally on http://localhost:5173"

