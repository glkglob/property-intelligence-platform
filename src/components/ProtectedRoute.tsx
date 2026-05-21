import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getIsAuthenticated } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.JSX.Element {
  const location = useLocation();
  const isAuthenticated = getIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
