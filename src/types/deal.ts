// Aligned to: supabase/migrations/20260521000000_initial_schema.sql
// deals(id, user_id, property_id, estimate_id, score, recommendation, notes,
//   created_at, updated_at)
export type DealRecommendation = 'proceed' | 'review' | 'reject';

export interface Deal {
  id: string;
  user_id: string;
  property_id: string;
  estimate_id: string;
  score: number;
  recommendation: DealRecommendation;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
