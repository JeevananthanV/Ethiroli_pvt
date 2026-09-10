import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isRoleAuthorized } from '../../utils/roleRouting';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || user.tenantRole;
    if (!isRoleAuthorized(userRole, allowedRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default PrivateRoute;