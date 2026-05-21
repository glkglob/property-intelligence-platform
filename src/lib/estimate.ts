export type EstimateItemCode =
  | 'kitchen_renovation'
  | 'bathroom_renovation'
  | 'rewiring'
  | 'new_roof';

/** Single source of truth for all supported works. */
export const ESTIMATE_CATALOG: Record<
  EstimateItemCode,
  { label: string; unitCost: number }
> = {
  kitchen_renovation: { label: 'Kitchen renovation', unitCost: 12_000 },
  bathroom_renovation: { label: 'Bathroom renovation', unitCost: 7_000 },
  rewiring: { label: 'Full rewiring', unitCost: 4_500 },
  new_roof: { label: 'New roof', unitCost: 15_000 },
};

export interface EstimateInputItem {
  code: EstimateItemCode;
  quantity?: number;
}

export interface EstimateLineItem {
  code: EstimateItemCode;
  label: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface EstimateResult {
  items: EstimateLineItem[];
  totalCost: number;
}

export function calculateEstimate(input: EstimateInputItem[]): EstimateResult {
  const items: EstimateLineItem[] = input.map((item) => {
    const quantity = item.quantity ?? 1;
    const { label, unitCost } = ESTIMATE_CATALOG[item.code];
    return { code: item.code, label, quantity, unitCost, totalCost: quantity * unitCost };
  });

  const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
  return { items, totalCost };
}
