// Aligned to: supabase/migrations/20260521000001_profiles.sql
//             supabase/migrations/20260521000002_profiles_auto_create.sql
// profiles(id, email, full_name, avatar_url, subscription_tier, created_at, updated_at)
// id = auth.uid() — no separate user_id column
// email is nullable: rows created before migration 00002 have no email stored here
// select policy is public; insert/update restricted to own row
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
