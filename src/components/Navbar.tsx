import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, signOut, type AuthStatus } from '../lib/auth';

function Navbar(): React.JSX.Element {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    let cancelled = false;
    getSession().then((session) => {
      if (!cancelled) setStatus(session.status);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignOut(): Promise<void> {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link to="/" className="text-lg font-bold text-slate-950">
        Property Intelligence Platform
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {status === 'authenticated' ? (
          <>
            <Link to="/properties" className="text-slate-700 hover:text-slate-950">
              Properties
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-slate-700 hover:text-slate-950"
            >
              Sign out
            </button>
          </>
        ) : status === 'unauthenticated' ? (
          <>
            <Link to="/login" className="text-slate-700 hover:text-slate-950">
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-slate-950 px-4 py-2 text-white hover:bg-slate-800"
            >
              Join beta
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
