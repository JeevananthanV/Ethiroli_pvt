/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { setCredentials, clearCredentials } from '../../store/slices/authSlice.js';
import { getMe, login as apiLogin, logout as apiLogout } from '../../services/api/authApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state?.auth) || {};
  const { user = null, isAuthenticated = false, socketToken = null, activePortal = null, loading: reduxLoading = false } = authState;
  const [loading, setLoading] = useState(reduxLoading);

  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('active_role') || null;
  });

  const checkAuth = useCallback(async () => {
    try {
      const data = await getMe();
      const user = data?.data?.user || data?.user;
      if (user) {
        dispatch(setCredentials({ 
          user, 
          socket_token: data?.data?.socket_token || data?.socket_token || localStorage.getItem('auth_token'), 
          activePortal: data?.data?.activePortal || data?.activePortal 
        }));
        setActiveRole(prev => prev || user.role);
      } else {
        dispatch(clearCredentials());
      }
    } catch {
      // Clear credentials on session expiration or error
      dispatch(clearCredentials());
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const switchRole = (newRole) => {
    setActiveRole(newRole);
    if (newRole) {
      localStorage.setItem('active_role', newRole);
    } else {
      localStorage.removeItem('active_role');
    }
  };

  const login = async (email, password, portal = null, mfaToken = null) => {
    setLoading(true);
    try {
      const data = await apiLogin(email, password, portal, mfaToken);
      const token = data?.data?.token || data?.token || data?.data?.socket_token || data?.socket_token;
      const user = data?.data?.user || data?.user;

      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setActiveRole(user.role);
        localStorage.setItem('active_role', user.role);
      }

      const normalizedPortal = portal ? String(portal).trim().toLowerCase() : null;
      const activePortal = data?.data?.activePortal || data?.activePortal || normalizedPortal;
      
      if (user) {
        dispatch(setCredentials({ user, token, socket_token: token, activePortal }));
      }
      return data;
    } catch (err) {
      dispatch(clearCredentials());
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout(activePortal);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('active_role');
      dispatch(clearCredentials());
      setActiveRole(null);
      setLoading(false);
    }
  };

  const effectiveRole = activeRole || user?.role || null;

  const value = {
    user,
    role: effectiveRole,
    realRole: user?.role || null,
    activeRole: effectiveRole,
    switchRole,
    isAuthenticated,
    socketToken,
    activePortal,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
