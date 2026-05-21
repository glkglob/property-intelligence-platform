import { getSupabaseClient } from './supabaseClient';
import { trackEvent } from './analytics';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthSession {
  status: AuthStatus;
  userId?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
};

export function authSessionToState(session: AuthSession): AuthState {
  return {
    isAuthenticated: session.status === 'authenticated',
    isLoading: session.status === 'checking',
  };
}

export async function getSession(): Promise<AuthSession> {
  try {
    const supabase = getSupabaseClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) return { status: 'unauthenticated' };
    trackEvent('session_restore', { userId: session.user.id });
    return { status: 'authenticated', userId: session.user.id };
  } catch {
    // getSupabaseClient() throws when env vars are absent (dev without .env)
    return { status: 'unauthenticated' };
  }
}

export async function signOut(): Promise<void> {
  try {
    await getSupabaseClient().auth.signOut();
  } catch {
    // Swallow — navigate to /login regardless so the UI clears
  }
}
