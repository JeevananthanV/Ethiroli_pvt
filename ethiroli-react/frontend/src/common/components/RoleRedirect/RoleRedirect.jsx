import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRoleDefaultPath } from '../../utils/roleRouting';

const RoleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();

  useEffect(() => {
    if (user && role) {
      const defaultPath = getRoleDefaultPath(role);
      if (defaultPath && !location.pathname.startsWith('/app/')) {
        navigate(defaultPath, { replace: true });
      }
    }
  }, [user, role, navigate, location.pathname]);

  return null;
};

export default RoleRedirect;