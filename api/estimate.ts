import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const items = req.body?.items as Array<{ cost?: number }> | undefined;

  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  const total = items.reduce((sum: number, item: { cost?: number }) => sum + (item.cost ?? 0), 0);

  res.status(200).json({ total });
}

