import type { Tables } from './database';

// Note: email column not present in live DB — migration 00002 pending application.
export type Profile = Tables<'profiles'>;

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
