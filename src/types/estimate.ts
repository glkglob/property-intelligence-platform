// Aligned to: supabase/migrations/20260521000000_initial_schema.sql
// estimates(id, user_id, property_id, description, refurb_budget, gdv,
//   total_cost, max_purchase_price, projected_profit, created_at, updated_at)
export interface StoredEstimate {
  id: string;
  user_id: string;
  property_id: string;
  description: string;
  refurb_budget: number | null;
  gdv: number | null;
  total_cost: number;
  max_purchase_price: number | null;
  projected_profit: number | null;
  created_at: string;
  updated_at: string;
}
