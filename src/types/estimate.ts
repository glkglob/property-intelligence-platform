import type { EstimateLineItem } from '../lib/estimate';

export interface StoredEstimate {
  id: string;
  propertyId: string;
  totalCost: number;
  detail: EstimateLineItem[];
  createdAt: string;
}
