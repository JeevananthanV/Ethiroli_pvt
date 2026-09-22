import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Navbar from '../layout/Navbar';

export default function PublicLayout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
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
        }
      } catch (err) {
        console.debug('PublicLayout initAuth error:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
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