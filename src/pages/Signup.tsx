import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { trackEvent } from '../lib/analytics';
import { getSupabaseClient } from '../lib/supabaseClient';

interface SignupForm {
  email: string;
  password: string;
}

function Signup(): React.JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('signup_viewed');
  }, []);

  const [form, setForm] = useState<SignupForm>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.');
        setIsSubmitting(false);
        return;
      }

      const { data, error: authError } = await getSupabaseClient().auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        setError(authError.message);
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        // Email confirmation not required — user is immediately authenticated
        navigate('/properties', { replace: true });
        return;
      }

      // Email confirmation required (default Supabase behaviour)
      setMessage(
        'Check your email to confirm your account. You can sign in once confirmed.',
      );
      setIsSubmitting(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Sign up failed. Please try again.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <Layout title="Join the beta">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-6 text-sm text-slate-500">
            Private beta &mdash; invites are sent directly. Enter your details to request access.
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
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

            {message && (
              <p
                role="status"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Requesting access…' : 'Request access'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have access?{' '}
            <Link to="/login" className="font-medium text-slate-950 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Signup;
