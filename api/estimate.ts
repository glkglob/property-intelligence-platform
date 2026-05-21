// PLACEHOLDER — this endpoint is not called by any client code yet.
// Estimation currently runs client-side via src/lib/estimate.ts.
// Wire this handler when server-side calculation or validation is required.

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface RequestItem {
  code: string;
  quantity: number;
  unit_cost: number;
}

function isValidItem(item: unknown): item is RequestItem {
  if (typeof item !== 'object' || item === null) return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.code === 'string' &&
    typeof i.quantity === 'number' &&
    typeof i.unit_cost === 'number'
  );
}

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const items: unknown = req.body?.items;

  if (!Array.isArray(items) || !items.every(isValidItem)) {
    res.status(400).json({ error: 'Invalid payload: expected items[]{code, quantity, unit_cost}' });
    return;
  }

  const line_items = items.map((item) => ({
    code: item.code,
    quantity: item.quantity,
    unit_cost: item.unit_cost,
    total_cost: item.quantity * item.unit_cost,
  }));

  const total = line_items.reduce((sum, item) => sum + item.total_cost, 0);

  res.status(200).json({ total, line_items });
}
