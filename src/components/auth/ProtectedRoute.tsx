import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, permissionsByRole } = useAuth();
  const loc = useLocation();

  const path = loc.pathname === '' ? '/' : loc.pathname;
  if (path === '/') return <>{children}</>;

  const allowed = permissionsByRole[currentUser.role]?.allowedRoutes || [];
  if (allowed.includes(path)) return <>{children}</>;

  return <Navigate to={permissionsByRole[currentUser.role].defaultRoute} replace />;
}

