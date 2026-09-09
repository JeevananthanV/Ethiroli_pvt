import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getRoleDefaultPath } from '../../utils/roleRouting.js';

export default function RoleRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

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
    return <Navigate to="/app/login" replace />;
  }

  const defaultPath = getRoleDefaultPath(user?.role);
  return <Navigate to={defaultPath} replace />;
}
