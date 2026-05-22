import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function hasSupabaseEnv(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function getValidatedSupabaseEnv(): [string, string] {
  const missingEnv = [
    !supabaseUrl && 'VITE_SUPABASE_URL',
    !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
  ].filter(Boolean);

  if (missingEnv.length > 0) {
    throw new Error(
      `Supabase client configuration error: missing ${missingEnv.join(', ')}. ` +
        'Add these variables to your .env file and restart the Vite dev server.',
    );
  }

  return [supabaseUrl, supabaseAnonKey];
}

const [validatedSupabaseUrl, validatedSupabaseAnonKey] = getValidatedSupabaseEnv();

export const supabaseClient: SupabaseClient<Database> = createClient<Database>(
  validatedSupabaseUrl,
  validatedSupabaseAnonKey,
);

export function getSupabaseClient(): SupabaseClient<Database> {
  return supabaseClient;
}
