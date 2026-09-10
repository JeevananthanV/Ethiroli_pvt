import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import Navbar from '../layout/Navbar';

export default function ProtectedLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch('/api/v1/role/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            dispatch({ type: 'auth/setCredentials', payload: { user: data.user } });
          }
        } else {
          navigate('/auth/login');
        }
      } catch {
        navigate('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} />
      <main className="flex-grow-1">
        {children}
      </main>
    </div>
  );
}