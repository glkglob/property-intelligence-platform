import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { getSupabaseClient } from '../lib/supabaseClient';

function Signup(): React.JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('signup_viewed');
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error: authError } = await getSupabaseClient().auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        navigate('/properties', { replace: true });
        return;
      }

      // Email confirmation required (default Supabase behaviour)
      setMessage('Check your email to confirm your account. You can sign in once confirmed.');
      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <Building2 className="h-7 w-7" />
            </div>
            <p className="text-2xl font-bold text-white">Property Intelligence</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-10">
          <h1 className="mb-2 text-center text-3xl font-bold text-white">Join the beta</h1>
          <p className="mb-8 text-center text-slate-400">
            Private beta — invites are sent directly.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-300"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || !!message}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/20 bg-slate-950 px-5 py-3.5 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || !!message}
                placeholder="Create a strong password"
                className="w-full rounded-2xl border border-white/20 bg-slate-950 px-5 py-3.5 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none disabled:opacity-50"
              />
              <p className="mt-1.5 text-xs text-slate-500">Must be at least 8 characters</p>
            </div>

            {!message && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 py-4 font-semibold text-slate-950 transition-all hover:bg-emerald-300 disabled:opacity-70"
              >
                {isSubmitting ? 'Requesting access…' : 'Request access'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have access?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
