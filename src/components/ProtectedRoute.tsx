import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession, type AuthStatus } from '../lib/auth';
import LoadingState from './LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const location = useLocation();
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

  if (status === 'checking') {
    return <LoadingState label="Checking session…" />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
