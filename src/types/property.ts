// Aligned to: supabase/migrations/20260521000000_initial_schema.sql
// properties(id, user_id, address, postcode, type, bedrooms, created_at, updated_at)
export interface Property {
  id: string;
  user_id: string;
  address: string;
  postcode: string;
  type: string;
  bedrooms: number;
  created_at: string;
  updated_at: string;
}
