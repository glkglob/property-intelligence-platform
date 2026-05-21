export interface DealAnalysis {
  id: string;
  propertyId: string;
  offerPrice: number;
  roi: number;
  analysisDetails: Record<string, unknown>;
}
