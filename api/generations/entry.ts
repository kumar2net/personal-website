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
