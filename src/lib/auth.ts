import { getSupabaseClient } from './supabaseClient';
import { trackEvent } from './analytics';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthSession {
  status: AuthStatus;
  session?: Session | null;
  userId?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export type AuthStateChangeHandler = (session: AuthSession, event: AuthChangeEvent) => void;

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
};

function toAuthSession(session: Session | null): AuthSession {
  if (!session) return { status: 'unauthenticated', session: null };
  return {
    status: 'authenticated',
    session,
    userId: session.user.id,
  };
}

export function authSessionToState(session: AuthSession): AuthState {
  return {
    isAuthenticated: session.status === 'authenticated',
    isLoading: session.status === 'checking',
  };
}

export async function getSession(): Promise<AuthSession> {
  const supabase = getSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return { status: 'unauthenticated', session: null };
  }

  trackEvent('session_restore', { userId: session.user.id });
  return toAuthSession(session);
}

export async function signInWithPassword(credentials: AuthCredentials): Promise<AuthSession> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword(credentials);

  if (error) throw error;

  return toAuthSession(data.session);
}

export async function signUp(credentials: AuthCredentials): Promise<AuthSession> {
  const emailRedirectTo = new URL('/auth/callback', window.location.origin).toString();
  const { data, error } = await getSupabaseClient().auth.signUp({
    ...credentials,
    options: {
      emailRedirectTo,
    },
  });

  if (error) throw error;

  return toAuthSession(data.session);
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw error;
}

export function onAuthStateChange(handler: AuthStateChangeHandler): () => void {
  const {
    data: { subscription },
  } = getSupabaseClient().auth.onAuthStateChange((event, session) => {
    handler(toAuthSession(session), event);
  });

  return () => {
    subscription.unsubscribe();
  };
}
