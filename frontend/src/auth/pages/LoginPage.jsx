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

/**
 * LoginPage - the shared sign-in screen used by every role portal.
 *
 * `brandLogo`, `showPasswordToggle` and `footer` are opt-in: when a portal does
 * not pass them the rendered output is exactly as before, so adding them for the
 * employee portal does not change any other portal's login screen.
 */
export default function LoginPage({ portal, brandLogo, showPasswordToggle, footer }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      {/* Decorative motion layers: drifting orbs + rotating conic sheen. */}
      <div className={styles.authBackdrop} aria-hidden="true">
        <div className={styles.authSheen} />
        <div className={`${styles.authOrb} ${styles.authOrb1}`} />
        <div className={`${styles.authOrb} ${styles.authOrb2}`} />
        <div className={`${styles.authOrb} ${styles.authOrb3}`} />
      </div>

      <div className={styles.authCard}>
        <div className={styles.header}>
          {brandLogo ? (
            <img src={brandLogo} className={styles.brandLogo} alt="Ethiroli" />
          ) : (
            <h2>ETHIROLI</h2>
          )}
          <p>{portalConfig?.label ? `${portalConfig.label} Portal` : (portal ? `${String(portal).toUpperCase()} Portal` : 'Login to your account')}</p>
          {portalConfig && (
            <div
              className={styles.portalBadge}
              style={{
                display: 'inline-block',
                marginTop: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: portalConfig.brandColor ? `${portalConfig.brandColor}22` : '#f1f5f9',
                color: portalConfig.brandColor || '#475569'
              }}
            >
              Dedicated Portal &bull; Role-Guarded Access
            </div>
          )}
        </div>

        {error && <div className={styles.error} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Email" 
            type="email"
            name="email"
            autoComplete="username"
            autoFocus
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          {showPasswordToggle ? (
            <div className={styles.passwordField}>
              <Input 
                label="Password" 
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                tabIndex={0}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
              </button>
            </div>
          ) : (
            <Input 
              label="Password" 
              type="password"
              name="password"
              autoComplete="current-password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          )}
          
          <Button type="submit" variant="primary" disabled={loading} className={styles.submitBtn}>
            {loading ? (
              <>
                <span className={styles.spinner} aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </Button>
        </form>

        {footer}

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
