import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession, onAuthStateChange, type AuthStatus } from '../lib/auth';
import LoadingState from './LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    let active = true;

    getSession()
      .then((session) => {
        if (active) setStatus(session.status);
      })
      .catch(() => {
        if (active) setStatus('unauthenticated');
      });

    const unsubscribe = onAuthStateChange((session) => {
      if (active) setStatus(session.status);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (status === 'checking') {
    return <LoadingState label="Checking session…" />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
