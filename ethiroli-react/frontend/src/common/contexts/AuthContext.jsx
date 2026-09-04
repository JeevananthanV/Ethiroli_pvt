import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { setCredentials, clearCredentials } from '../../store/slices/authSlice.js';
import { getMe, login as apiLogin, logout as apiLogout } from '../../services/api/authApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, socketToken } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await getMe();
      if (data && data.user) {
        dispatch(setCredentials({ user: data.user, socket_token: socketToken }));
      }
    } catch (err) {
      dispatch(clearCredentials());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      dispatch(setCredentials(data));
      return data.user;
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
      await apiLogout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      dispatch(clearCredentials());
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, socketToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
