import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import { getPortalConfig, getRoleBySlug } from '../../../auth/portals/config/index.js';
import Input from '../../../common/components/Input/Input.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { getDemoUsers } from '../../../services/api/authApi.js';
import styles from './InternLoginPage.module.css';

/**
 * InternLoginPage - Modern sign-in screen for Interns with background image support.
 *
 * Features:
 * - Optional background image (with gradient overlay fallback)
 * - Brand-primary color theme (#f4a261, orange/peach)
 * - Enhanced visual background with motion layers OR custom image
 * - Improved form interactions and feedback
 * - Intern-specific welcome message and quick stats
 * - Demo account quick-sign option (when available)
 * - Full accessibility compliance
 * - Parallax effect on background image
 */
export default function InternLoginPage({ backgroundImage }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [requiresTerms, setRequiresTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const portalConfig = getPortalConfig('intern');
  const brandColor = portalConfig?.brandColor || '#f4a261';
  const portalLabel = portalConfig?.label || 'Intern';

  // Notice shown when arriving from account deletion
  const [notice, setNotice] = useState(
    location.state?.accountDeleted
      ? 'Your account was deleted. You can register again with the same email.'
      : ''
  );

  // Load demo accounts for quick sign-in
  useEffect(() => {
    (async () => {
      try {
        const data = await getDemoUsers(getRoleBySlug('intern') || 'INTERN');
        setDemoAccounts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load demo accounts:', err);
      } finally {
        setLoadingDemo(false);
      }
    })();
  }, []);

  // Named selectAccount callback
  const selectAccount = (accountEmail) => {
    setEmail(accountEmail);
    setPassword('');
    setError(null);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice('');
    setLoading(true);

    // If terms not accepted, show validation
    if (!termsAccepted) {
      setRequiresTerms(true);
      setLoading(false);
      return;
    }

    try {
      const response = await login(email, password, 'intern');
      if (response?.requiresMfa) {
        setRequiresMfa(true);
        setLoading(false);
        return;
      }
      const loggedUser = response?.user || response?.data?.user;
      const redirectPath = location.state?.from?.pathname || '/app/intern/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
      setLoading(false);
    }
  };

  // MFA submission handler
  const handleMfaSubmit = async (mfaToken) => {
    try {
      const response = await login(email, password, 'intern', mfaToken);
      const loggedUser = response?.user || response?.data?.user;
      const redirectPath = location.state?.from?.pathname || '/app/intern/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'MFA verification failed.');
    } finally {
      setRequiresMfa(false);
      setLoading(false);
    }
  };

  // Terms acceptance handler
  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTerms(false);
  };

  // If MFA is required, show challenge
  if (requiresMfa) {
    return (
      <div className="intern-auth-wrapper">
        <MfaChallenge
          email={email}
          onSubmit={handleMfaSubmit}
          onBack={() => setRequiresMfa(false)}
          error={error}
        />
      </div>
    );
  }

  // If terms not accepted, show overlay
  if (!termsAccepted && !error) {
    return (
      <div className="intern-auth-wrapper">
        <div className="intern-terms-overlay">
          <div className="terms-card">
            <h3>Welcome, Intern! 👋</h3>
            <p>
              Thank you for joining the Ethiroli Intern Program. By signing in, you
              agree to our Terms of Use and Privacy Policy.
            </p>
            <div className="terms-actions">
              <button
                onClick={() => setShowTerms(true)}
                className="btn-primary"
              >
                Review Terms
              </button>
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTerms(false);
                }}
                className="btn-secondary"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="intern-auth-wrapper">
      {/* Background: support image OR gradient motion layers */}
      <div className="intern-backdrop">
        {backgroundImage ? (
          // Image background with parallax and overlay
          <div
            className="intern-image-background"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '100vh',
            }}
          >
            <div className="intern-image-overlay" />
            <div className="intern-image-orbits" />
          </div>
        ) : (
          <>
            <div className="intern-sheen" />
            <div className="intern-orb intern-orb1" />
            <div className="intern-orb intern-orb2" />
            <div className="intern-orb intern-orb3" />
          </>
        )}
      </div>

      <div className="intern-card">
        <div className="intern-header">
          {() => (
            <h2 className="intern-brand">ETHIROLI</h2>
          )()}
          <p className="intern-portal-label">{portalLabel} Portal</p>
          <div
            className="intern-portal-badge"
            style={{
              display: 'inline-block',
              marginTop: '0.45rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.025em',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              backgroundColor: `rgba(244, 162, 97, 0.15)`,
              color: '#1e293b',
              border: `1px solid ${brandColor}66`,
              boxShadow: '0 2px 8px rgba(244, 162, 97, 0.15)'
            }}
          >
            Dedicated Intern Portal &bull; Role-Guarded Access
          </div>
        </div>

        {notice && (
          <div className="intern-notice" role="status">
            <i className="bi bi-info-circle me-2" aria-hidden="true" />
            {notice}
          </div>
        )}

        {error && (
          <div className="intern-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="intern-form">
          <Input
            label="Email Address"
            type="email"
            name="email"
            autoComplete="username"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setNotice('');
            }}
            required
            placeholder="your.name@email.com"
          />
          {showPassword ? (
            <div className="intern-password-field">
              <Input
                label="Password"
                type="text"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="intern-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Hide password"
                aria-pressed={showPassword}
                tabIndex={0}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
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

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="intern-submit-btn"
          >
            {loading ? (
              <>
                <span className="intern-spinner" aria-hidden="true" />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Demo sign-in section }}
        {demoAccounts.length > 0 && (
          <div className="intern-demo-section">
            <div className="intern-demo-header">
              <i className="bi bi-lightning-charge-fill me-2" aria-hidden="true" />
              <span className="intern-demo-title">Quick Sign In</span>
              <span className="intern-demo-badge">Demo</span>
            </div>
            <p className="intern-demo-subtext">
              Select your account below or sign in with your registered credentials.
            </p>
            <div className="intern-demo-list">
              {demoAccounts.slice(0, 4).map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="intern-demo-item"
                  onClick={() => selectAccount(account.email)}
                  disabled={loading}
                >
                  <span className="intern-demo-avatar">
                    <i className="bi bi-person-fill" aria-hidden="true" />
                  </span>
                  <span className="intern-demo-meta">
                    <span className="intern-demo-name">
                      {account.full_name || account.name || account.email}
                    </span>
                    <span className="intern-demo-email">{account.email}</span>
                  </span>
                  <span className="intern-demo-action">Use</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Terms link at bottom */}
        <div className="intern-footer-links">
          <a
            href="/app/intern/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="intern-footer-link"
          >
            Terms of Use
          </a>
          <span className="intern-footer-divider">|</span>
          <a
            href="/app/intern/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="intern-footer-link"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}