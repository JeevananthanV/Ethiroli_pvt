import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import { getRoleDefaultPath } from '../../../common/utils/roleRouting.js';
import { getDemoUsers } from '../../../services/api/authApi.js';
import styles from '../../pages/Auth.module.css';

const HIGHLIGHTS = [
  { icon: 'bi-clock-history', title: 'One-tap attendance', copy: 'Punch in and out from any device, with your hours tracked automatically.' },
  { icon: 'bi-journal-check', title: 'Daily work log', copy: 'Keep a verified record of what you shipped each day for your mentor.' },
  { icon: 'bi-mortarboard', title: 'Guided training', copy: 'Structured modules and milestones that map to your internship goals.' },
  { icon: 'bi-people', title: 'Direct mentor access', copy: 'Ask questions and get feedback without chasing people over chat.' }
];

export default function InternLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loadingDemo, setLoadingDemo] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getDemoUsers('INTERN');
        // Only ever offer accounts that actually exist. The previous version
        // fell back to three invented people who are not in the database.
        if (active) setDemoAccounts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load intern accounts:', err);
      } finally {
        if (active) setLoadingDemo(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Named `selectAccount`, not `useAccount` - a leading "use" makes the
// react-hooks lint treat this plain callback as a hook.
  const selectAccount = (accountEmail) => {
    setEmail(accountEmail);
    setPassword('Intern@123');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password, 'intern');
      const user = response?.user || response?.data?.user;
      const target = location.state?.from?.pathname || getRoleDefaultPath(user?.role || 'INTERN');
      navigate(target, { replace: true });
    } catch (err) {
      // A failed sign-in must stay put. This previously redirected to the
      // dashboard whenever the email contained "intern" or "@", which
      // bypassed authentication completely.
      setError(
        err.response?.data?.message ||
        err.message ||
        'We could not sign you in. Please check your email and password and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.imsShell}>
        {/* ---------- Brand panel ---------- */}
        <aside className={styles.imsAside} aria-hidden="true">
          <div className={styles.imsAsideInner}>
            <div className={styles.imsBrandRow}>
              <span className={styles.imsBrandMark}>E</span>
              <span className={styles.imsBrandName}>Ethiroli</span>
            </div>

            <div className={styles.imsAsideCopy}>
              <span className={styles.imsAsideKicker}>Intern Management System</span>
              <h2 className={styles.imsAsideTitle}>
                Your internship,<br />organised in one place.
              </h2>
              <p className={styles.imsAsideText}>
                Everything you need for a smooth internship — attendance, work logs,
                training milestones and mentor feedback.
              </p>
            </div>

            <ul className={styles.imsHighlights}>
              {HIGHLIGHTS.map((h) => (
                <li key={h.title} className={styles.imsHighlight}>
                  <span className={styles.imsHighlightIcon}>
                    <i className={`bi ${h.icon}`} />
                  </span>
                  <span>
                    <span className={styles.imsHighlightTitle}>{h.title}</span>
                    <span className={styles.imsHighlightCopy}>{h.copy}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className={styles.imsAsideFoot}>
              Trouble signing in? <span>hr@ethiroli.com</span>
            </p>
          </div>
        </aside>

        {/* ---------- Form panel ---------- */}
        <main className={styles.imsPanel}>
          <div className={styles.imsPanelInner}>
            <div className={styles.imsMobileBrand}>
              <span className={styles.imsBrandMark}>E</span>
              <span className={styles.imsBrandName}>Ethiroli</span>
            </div>

            <header className={styles.imsFormHead}>
              <h1 className={styles.imsTitle}>Welcome back</h1>
              <p className={styles.subtitle}>
                Sign in with your intern email to pick up where you left off.
              </p>
            </header>

            {error && (
              <div className={styles.imsAlert} role="alert" aria-live="assertive">
                <i className="bi bi-exclamation-circle-fill" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className="mb-3">
                <label className={styles.imsLabel} htmlFor="internEmail">
                  Intern email
                </label>
                <div className={styles.imsField}>
                  <i className={`bi bi-envelope ${styles.imsFieldIcon}`} />
                  <input
                    id="internEmail"
                    type="email"
                    className={styles.imsInput}
                    placeholder="you@ethiroli.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    autoFocus
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className={`${styles.imsLabel} mb-0`} htmlFor="internPassword">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={styles.imsReveal}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                  </button>
                </div>
                <div className={styles.imsField}>
                  <i className={`bi bi-lock ${styles.imsFieldIcon}`} />
                  <input
                    id="internPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={styles.imsInput}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.imsRow}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberIntern"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="rememberIntern">
                    Keep me signed in
                  </label>
                </div>
                <Link to="/auth/forgot-password" className={styles.imsLink}>
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className={styles.imsSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Signing you in…
                  </>
                ) : (
                  <>
                    Sign in to your portal
                    <i className="bi bi-arrow-right" />
                  </>
                )}
              </button>
            </form>

            {/* Real accounts only. */}
            <div className={styles.imsDemo}>
              <div className={styles.imsDemoHead}>
                <span className={styles.imsDemoTitle}>
                  <i className="bi bi-lightning-charge-fill" />
                  Quick sign-in
                </span>
                <span className={styles.imsDemoBadge}>Demo</span>
              </div>

              {loadingDemo ? (
                <div className={styles.imsDemoEmpty}>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Checking available accounts…
                </div>
              ) : demoAccounts.length === 0 ? (
                <div className={styles.imsDemoEmpty}>
                  No demo accounts are set up right now. Sign in with the credentials
                  your mentor shared.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {demoAccounts.slice(0, 4).map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      className={styles.imsDemoItem}
                      onClick={() => selectAccount(account.email)}
                      disabled={loading}
                    >
                      <span className={styles.imsDemoAvatar} aria-hidden="true">
                        <i className="bi bi-person-fill" />
                      </span>
                      <span className={styles.imsDemoMeta}>
                        <span className={styles.imsDemoName}>
                          {account.name || account.email}
                        </span>
                        <span className={styles.imsDemoSub}>{account.email}</span>
                      </span>
                      <span className={styles.imsDemoAction}>Use</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className={styles.imsFoot}>
              New here and stuck? <Link to="/auth/forgot-password" className={styles.imsLink}>Reset your password</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}