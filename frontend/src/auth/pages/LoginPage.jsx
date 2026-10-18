import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../common/contexts/AuthContext.jsx';
import { getRoleDefaultPath } from '../../common/utils/roleRouting.js';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';
import MfaChallenge from '../components/MfaChallenge.jsx';
import { getPortalConfig, getRoleBySlug } from '../portals/config/index.js';
import styles from './Auth.module.css';

/**
 * LoginPage - the shared sign-in screen used by every role portal.
 *
 * `brandLogo`, `showPasswordToggle`, `demo` and `footer` are opt-in: when a
 * portal does not pass them the rendered output is exactly as before, so
 * adding them for one portal does not change any other portal's login screen.
 */
export default function LoginPage({ portal, brandLogo = '/assets/images/ethiroli_logo.png', showPasswordToggle, demo, demoPassword, footer, variant }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Shown when the visitor arrives here straight from "Delete my account".
  // Without it, landing on a bare sign-in form after destroying an account
  // looks like something went wrong.
  const [notice, setNotice] = useState(
    location.state?.accountDeleted
      ? 'Your account was deleted. You can register again with the same email.'
      : ''
  );

  const portalConfig = portal ? getPortalConfig(portal) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice('');
    setLoading(true);
    try {
      const response = await login(email, password, portal);
      if (response?.requiresMfa) {
        setRequiresMfa(true);
        return;
      }
      const loggedUser = response?.user || response?.data?.user;
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
    const loggedUser = response?.user || response?.data?.user;
    const redirectPath = location.state?.from?.pathname || getRoleDefaultPath(loggedUser?.role);
    navigate(redirectPath, { replace: true });
    return response;
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

  if (variant === 'polished') {
    return (
      <div className={styles.authContainer}>
        <div className={`${styles.authCard} ${styles['authCard--polished']}`}>
          <div className={styles.polishedHeader}>
            {brandLogo && (
              <img src={brandLogo} className={styles.polishedLogo} alt="Ethiroli" />
            )}
            <h2 className={styles.polishedWordmark}>ETHIROLI</h2>
            <p className={styles.polishedPortal}>
              {portalConfig?.label ? `${portalConfig.label} Portal` : (portal ? `${String(portal).toUpperCase()} Portal` : 'Login to your account')}
            </p>
            <span className={styles.polishedBadge}>Dedicated Portal &bull; Role-Guarded Access</span>
          </div>

          {error && (
            <div className={`${styles.error} ${styles.polishedAlert}`} role="alert">
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.polishedField}>
              <label className="label" htmlFor="polished-email">
                Email <span className="required">*</span>
              </label>
              <div className={styles.polishedControl}>
                <i className={`bi bi-envelope ${styles.polishedIcon}`} aria-hidden="true"></i>
                <input
                  id="polished-email"
                  className="inputField"
                  type="email"
                  name="email"
                  autoComplete="username"
                  autoFocus
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setNotice(''); }}
                  required
                />
              </div>
            </div>

            <div className={styles.polishedField}>
              <label className="label" htmlFor="polished-password">
                Password <span className="required">*</span>
              </label>
              <div className={`${styles.polishedControl} ${showPasswordToggle ? styles['polishedControl--reveal'] : ''}`}>
                <i className={`bi bi-lock ${styles.polishedIcon}`} aria-hidden="true"></i>
                <input
                  id="polished-password"
                  className="inputField"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPasswordToggle && (
                  <button
                    type="button"
                    className={styles.polishedReveal}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                  </button>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className={`${styles.submitBtn} ${styles.polishedSubmit}`}
            >
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
        </div>
      </div>
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
          {brandLogo && (
            <img
              src={brandLogo}
              alt="Ethiroli"
              style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 10px auto', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          <h2>ETHIROLI</h2>
          <p>{portalConfig?.label ? `${portalConfig.label} Portal` : (portal ? `${String(portal).toUpperCase()} Portal` : 'Login to your account')}</p>
          {portalConfig && (
            <div
              className={styles.portalBadge}
              style={{
                display: 'inline-block',
                marginTop: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.025em',
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: `1px solid ${portalConfig.brandColor ? `${portalConfig.brandColor}66` : 'rgba(255, 255, 255, 0.2)'}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
              }}
            >
              Dedicated Portal &bull; Role-Guarded Access
            </div>
          )}
        </div>

        {notice && (
          <div className={styles.notice} role="status">
            <i className="bi bi-info-circle me-2" aria-hidden="true"></i>
            {notice}
          </div>
        )}

        {error && <div className={styles.error} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input 
            label="Email" 
            type="email"
            name="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(e) => { setEmail(e.target.value); setNotice(''); }}
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
      </div>
    </div>
  );
}
