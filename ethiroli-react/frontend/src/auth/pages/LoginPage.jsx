import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../common/contexts/AuthContext.jsx';
import { getRoleDefaultPath } from '../../common/utils/roleRouting.js';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';
import MfaChallenge from '../components/MfaChallenge.jsx';
import OAuthButton from '../components/OAuthButton.jsx';
import { getPortalConfig } from '../portals/config/index.js';
import styles from './Auth.module.css';

export default function LoginPage({ portal }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);

  const portalConfig = portal ? getPortalConfig(portal) : null;
  const showOAuth = portalConfig?.oauthProviders?.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await login(email, password, portal);
      if (response?.requiresMfa) {
        setRequiresMfa(true);
        return;
      }
      const loggedUser = response?.user;
      const redirectPath = location.state?.from?.pathname || getRoleDefaultPath(loggedUser?.role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (mfaToken) => {
    const response = await login(email, password, portal, mfaToken);
    const loggedUser = response?.user;
    const redirectPath = location.state?.from?.pathname || getRoleDefaultPath(loggedUser?.role);
    navigate(redirectPath, { replace: true });
    return response;
  };

  const handleOAuthClick = (provider) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const redirectUri = `${window.location.origin}/auth/oauth/${provider}/callback`;
    window.location.href = `${apiBase}/v1/auth/oauth/${provider}/authorize?portal=${portal}&redirectUri=${encodeURIComponent(redirectUri)}`;
  };

  if (requiresMfa) {
    return (
      <MfaChallenge
        email={email}
        onSubmit={handleMfaSubmit}
        onBack={() => setRequiresMfa(false)}
        error={error}
      />
    );
  }

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

        {showOAuth && (
          <div className={styles.oauthSection}>
            <div className={styles.divider}>
              <span>Or continue with</span>
            </div>
            <div className={styles.oauthButtons}>
              {portalConfig.oauthProviders.map((provider) => (
                <OAuthButton
                  key={provider}
                  provider={provider}
                  onClick={handleOAuthClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
