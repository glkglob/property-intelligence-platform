import { describe, expect, it } from 'vitest';
import { calculateEstimate, ESTIMATE_CATALOG } from './estimate';

describe('calculateEstimate', () => {
  it('returns zero total and empty items for empty input', () => {
    const result = calculateEstimate([]);
    expect(result.totalCost).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('calculates a single item at quantity 1', () => {
    const result = calculateEstimate([{ code: 'rewiring' }]);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].code).toBe('rewiring');
    expect(result.items[0].quantity).toBe(1);
    expect(result.items[0].unitCost).toBe(ESTIMATE_CATALOG.rewiring.unitCost);
    expect(result.items[0].totalCost).toBe(ESTIMATE_CATALOG.rewiring.unitCost);
    expect(result.totalCost).toBe(ESTIMATE_CATALOG.rewiring.unitCost);
  });

  it('calculates multiple items and sums the total correctly', () => {
    const result = calculateEstimate([
      { code: 'kitchen_renovation' },
      { code: 'bathroom_renovation' },
    ]);
    const expected =
      ESTIMATE_CATALOG.kitchen_renovation.unitCost +
      ESTIMATE_CATALOG.bathroom_renovation.unitCost;
    expect(result.items).toHaveLength(2);
    expect(result.totalCost).toBe(expected);
  });

  it('respects explicit quantity on a line item', () => {
    const result = calculateEstimate([{ code: 'bathroom_renovation', quantity: 2 }]);
    expect(result.items[0].quantity).toBe(2);
    expect(result.items[0].totalCost).toBe(ESTIMATE_CATALOG.bathroom_renovation.unitCost * 2);
    expect(result.totalCost).toBe(ESTIMATE_CATALOG.bathroom_renovation.unitCost * 2);
  });
});
