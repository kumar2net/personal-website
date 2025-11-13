import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const entries = [
    { id: 'gen_01', text: 'Watched the sunset after work.', emoji: '🌇', tone: 'calm', toneLabel: 'Calm' },
    { id: 'gen_02', text: 'Had street food with friends.', emoji: '🍜', tone: 'joyful', toneLabel: 'Joyful' },
  ];
  return res.status(200).json({ week: '2025-W45', entries });
}
