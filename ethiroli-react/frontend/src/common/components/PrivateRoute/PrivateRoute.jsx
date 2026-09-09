import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { isRoleAuthorized } from '../../utils/roleRouting.js';
import Unauthorized from '../Unauthorized/Unauthorized.jsx';

export default function PrivateRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div id="preloader" aria-live="polite" aria-busy="true">
        <p className="et-preloader-text">ETHIROLI</p>
        <div className="loading-animation">
          <div className="loading-animation-bar"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !isRoleAuthorized(user?.role, allowedRoles)) {
    return <Unauthorized requiredRoles={allowedRoles} />;
  }

  return <Outlet />;
}
