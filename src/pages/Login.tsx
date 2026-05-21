import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getSupabaseClient } from '../lib/supabaseClient';

interface LoginForm {
  email: string;
  password: string;
}

function Login(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/properties';

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: authError } = await getSupabaseClient().auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        setError(authError.message);
        setIsSubmitting(false);
        return;
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Sign in failed. Check your credentials and try again.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <Layout title="Sign in">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-6 text-sm text-slate-500">
            Private beta &mdash; access is invite-only.
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:opacity-50"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:opacity-50"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            No account yet?{' '}
            <Link to="/signup" className="font-medium text-slate-950 hover:underline">
              Join the beta
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
