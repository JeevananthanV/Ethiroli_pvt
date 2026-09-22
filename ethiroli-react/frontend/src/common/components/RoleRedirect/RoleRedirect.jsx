import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getRoleDefaultPath } from '../../utils/roleRouting.js';

const RoleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user && role) {
      const defaultPath = getRoleDefaultPath(role);
      if (defaultPath && location.pathname !== defaultPath) {
        navigate(defaultPath, { replace: true });
      }
    } else if (!user && !loading) {
      navigate('/auth/admin/login', { replace: true });
    }
  }, [user, role, loading, navigate, location.pathname]);

  return null;
};

export default RoleRedirect;