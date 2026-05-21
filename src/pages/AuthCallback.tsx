import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../lib/supabaseClient';

type CallbackStatus = 'loading' | 'success' | 'error';

// Subset of Supabase EmailOtpType relevant to token_hash flows.
type TokenHashType =
  | 'signup'
  | 'invite'
  | 'magiclink'
  | 'recovery'
  | 'email_change'
  | 'email';

function AuthCallback(): React.JSX.Element {
  const navigate = useNavigate();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [message, setMessage] = useState('Verifying your email…');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function handleCallback(): Promise<void> {
      const supabase = getSupabaseClient();
      const params = new URLSearchParams(window.location.search);
      const token_hash = params.get('token_hash');
      const type = params.get('type');

      try {
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as TokenHashType,
          });

          if (error) throw error;

          setStatus('success');
          setMessage('Email confirmed. Redirecting…');
          timerRef.current = setTimeout(
            () => navigate('/properties', { replace: true }),
            1500,
          );
        } else {
          // Hash-based callback (OAuth, magic link fragment)
          const { data, error } = await supabase.auth.getSession();

          if (error || !data.session) throw new Error('No valid session found.');

          setStatus('success');
          setMessage('Authentication successful. Redirecting…');
          timerRef.current = setTimeout(
            () => navigate('/properties', { replace: true }),
            1000,
          );
        }
      } catch (err) {
        setStatus('error');
        setMessage(
          err instanceof Error ? err.message : 'Authentication failed. Please try again.',
        );
        timerRef.current = setTimeout(
          () => navigate('/login', { replace: true }),
          3000,
        );
      }
    }

    handleCallback();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
        <div className="mb-6 flex justify-center">
          {status === 'loading' && (
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
          )}
          {status === 'success' && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-2xl text-emerald-400">
              ✓
            </div>
          )}
          {status === 'error' && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10 text-2xl text-red-400">
              ✕
            </div>
          )}
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-white">
          {status === 'loading'
            ? 'Verifying…'
            : status === 'success'
              ? 'Confirmed'
              : 'Something went wrong'}
        </h1>
        <p className="text-sm text-slate-400">{message}</p>

        {status === 'error' && (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 rounded-xl bg-slate-950 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthCallback;
