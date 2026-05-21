import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

export function hasSupabaseEnv(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
}

export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const missing = [
    !url && 'VITE_SUPABASE_URL',
    !anonKey && 'VITE_SUPABASE_ANON_KEY',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Supabase misconfiguration: missing environment variable(s): ${missing.join(', ')}. ` +
        'Set them in .env and restart the dev server.',
    );
  }

  client = createClient(url!, anonKey!);
  return client;
}
