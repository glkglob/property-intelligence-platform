import React from 'react';
import { Link } from 'react-router-dom';
import { getIsAuthenticated } from '../lib/auth';

function Navbar(): React.JSX.Element {
  const isAuthenticated = getIsAuthenticated();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link to="/" className="text-lg font-bold text-slate-950">
        Property Intelligence Platform
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {isAuthenticated ? (
          <>
            <Link to="/properties" className="text-slate-700 hover:text-slate-950">
              Properties
            </Link>
            <button type="button" className="text-slate-700 hover:text-slate-950">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-700 hover:text-slate-950">
              Login
            </Link>
            <Link to="/signup" className="text-slate-700 hover:text-slate-950">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
