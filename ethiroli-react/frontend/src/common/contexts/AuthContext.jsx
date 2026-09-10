/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { setCredentials, clearCredentials } from '../../store/slices/authSlice.js';
import { getMe, login as apiLogin, logout as apiLogout } from '../../services/api/authApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, socketToken, activePortal, loading: reduxLoading } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(reduxLoading);

  const checkAuth = useCallback(async () => {
    try {
      const data = await getMe();
      if (data && data.user) {
        dispatch(setCredentials({ user: data.user, socket_token: socketToken, activePortal: data.activePortal }));
      }
    } catch {
      dispatch(clearCredentials());
    } finally {
      setLoading(false);
    }
  }, [dispatch, socketToken]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password, portal = null, mfaToken = null) => {
    setLoading(true);
    try {
      const data = await apiLogin(email, password, portal, mfaToken);
      const normalizedPortal = portal ? String(portal).trim().toLowerCase() : null;
      const activePortal = data.activePortal || normalizedPortal;
      if (data.user) {
        dispatch(setCredentials({ ...data, activePortal }));
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
      dispatch(clearCredentials());
      setLoading(false);
    }
  };

  const role = user?.role || null;

  const value = {
    user,
    role,
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
