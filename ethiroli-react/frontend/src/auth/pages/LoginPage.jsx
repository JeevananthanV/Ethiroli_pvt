import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../common/contexts/AuthContext.jsx';
import { getRoleDefaultPath } from '../../common/utils/roleRouting.js';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';
import styles from './Auth.module.css';

export default function LoginPage({ portal }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const loggedUser = await login(email, password, portal);
      const redirectPath = location.state?.from?.pathname || getRoleDefaultPath(loggedUser?.role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h2>ETHIROLI</h2>
          <p>{portal ? `${portal} Portal` : 'Login to your account'}</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <Button type="submit" variant="primary" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
