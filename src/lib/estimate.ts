export type EstimateItemType =
  | 'kitchen_renovation'
  | 'bathroom_renovation'
  | 'rewiring'
  | 'new_roof';

export interface EstimateInputItem {
  type: EstimateItemType;
  quantity?: number;
}

export interface EstimateLineItem {
  type: EstimateItemType;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface EstimateResult {
  items: EstimateLineItem[];
  totalCost: number;
}

const UNIT_COSTS: Record<EstimateItemType, number> = {
  kitchen_renovation: 12000,
  bathroom_renovation: 7000,
  rewiring: 4500,
  new_roof: 15000,
};

export function calculateEstimate(input: EstimateInputItem[]): EstimateResult {
  const items = input.map((item) => {
    const quantity = item.quantity ?? 1;
    const unitCost = UNIT_COSTS[item.type];

    return {
      type: item.type,
      quantity,
      unitCost,
      totalCost: quantity * unitCost,
    };
  });

  const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);

  return { items, totalCost };
}
