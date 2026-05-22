import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AIDesigner from '../pages/AIDesigner';
import AuthCallback from '../pages/AuthCallback';
import Dashboard from '../pages/Dashboard';
import DealCopilot from '../pages/DealCopilot';
import EstimateDetail from '../pages/EstimateDetail';
import EstimatePage from '../pages/EstimatePage';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import NewProperty from '../pages/NewProperty';
import Properties from '../pages/Properties';
import PropertyDetail from '../pages/PropertyDetail';
import RefurbIQ from '../pages/RefurbIQ';
import Signup from '../pages/Signup';

function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties/new"
        element={
          <ProtectedRoute>
            <NewProperty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties/:id"
        element={
          <ProtectedRoute>
            <PropertyDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estimate/:propertyId"
        element={
          <ProtectedRoute>
            <EstimatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estimates/:estimateId"
        element={
          <ProtectedRoute>
            <EstimateDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-designer"
        element={
          <ProtectedRoute>
            <AIDesigner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deal/:propertyId"
        element={
          <ProtectedRoute>
            <DealCopilot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/refurbiq/:propertyId"
        element={
          <ProtectedRoute>
            <RefurbIQ />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
