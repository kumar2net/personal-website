import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  // mock image upload
  return res.status(200).json({
    url: `https://blob.vercel-storage.com/mock/${Math.random().toString(36).slice(2)}.jpg`,
  });
}
