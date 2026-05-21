import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabaseClient';

function Login(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/properties';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: authError } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsSubmitting(false);
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Sign in failed. Check your credentials and try again.',
      );
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
          <h1 className="mb-2 text-center text-3xl font-bold text-white">Welcome back</h1>
          <p className="mb-8 text-center text-slate-400">
            Private beta — access is invite-only.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/20 bg-slate-950 px-5 py-3.5 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/20 bg-slate-950 px-5 py-3.5 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 py-4 font-semibold text-slate-950 transition-all hover:bg-emerald-300 disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            No account yet?{' '}
            <Link to="/signup" className="text-emerald-400 hover:underline">
              Join the beta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
