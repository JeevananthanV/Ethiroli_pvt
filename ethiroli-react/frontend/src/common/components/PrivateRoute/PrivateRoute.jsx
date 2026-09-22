import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isRoleAuthorized } from '../../utils/roleRouting';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-accent)' }}>
          <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 12px auto' }}></div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/admin/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || user.tenantRole;
    if (!isRoleAuthorized(userRole, allowedRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Support both a wrapped component and a React Router layout route.
  return children || <Outlet />;
};

export default PrivateRoute;
