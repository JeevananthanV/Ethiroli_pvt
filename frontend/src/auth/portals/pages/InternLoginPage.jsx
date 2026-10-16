import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import styles from './InternLoginPage.module.css';

/**
 * InternLoginPage — Pixel-perfect replica of the Ethiroli Intern Sign-In page.
 * Split showcase layout with modern learning hero and clean floating card.
 * Explicitly without OAuth / Google buttons per user specification.
 */
export default function InternLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [notice, setNotice] = useState(
    location.state?.accountDeleted
      ? 'Your account was deleted. You can register again with the same email.'
      : ''
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice('');
    setLoading(true);

    try {
      await login(email, password, 'intern');
      const redirectPath = location.state?.from?.pathname || '/app/intern/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Invalid credentials. Please verify your email and password.'
      );
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className={styles.pageContainer}>
      {/* ====================================================================
          LEFT HERO SECTION: LEARNING JOURNEY SHOWCASE
          ==================================================================== */}
      <section className={styles.leftSection} aria-label="Internship Overview">
        {/* Top Header */}
        <div className={styles.leftHeader}>
          <div className={styles.brandBox}>
            <img
              src="/assets/images/ethiroli_logo.png"
              alt="Ethiroli"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />
            <span className={styles.brandTitle}>ETHIROLI</span>
            <span className={styles.headerDivider}>|</span>
            <span className={styles.portalSub}>Enterprise Portal</span>
          </div>
          <div className={styles.taglineDots} aria-hidden="true">
            <span>Learn</span>
            <span className={styles.dot}>·</span>
            <span>Build</span>
            <span className={styles.dot}>·</span>
            <span>Grow</span>
          </div>
        </div>

        {/* Hero Headline Group */}
        <div className={styles.heroTextGroup}>
          <h1 className={styles.mainHeading}>
            Your Learning Journey<br />
            <span className={styles.headingAccent}>
              Starts Here
              <svg
                className={styles.underlineCurve}
                viewBox="0 0 190 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 9.5C55 2.5 135 2 188 8"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className={styles.heroSubheading}>
            Get trained <span className={styles.subDot}>·</span> Complete tasks <span className={styles.subDot}>·</span> Grow with Ethiroli
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className={styles.featuresRow}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}>
              <i className="bi bi-calendar2-check" aria-hidden="true"></i>
            </div>
            <div className={styles.featureInfo}>
              <span className={styles.featureTitle}>Learning</span>
              <span className={styles.featureDesc}>Courses & Training</span>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}>
              <i className="bi bi-check2-square" aria-hidden="true"></i>
            </div>
            <div className={styles.featureInfo}>
              <span className={styles.featureTitle}>Tasks</span>
              <span className={styles.featureDesc}>Daily Execution</span>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}>
              <i className="bi bi-people" aria-hidden="true"></i>
            </div>
            <div className={styles.featureInfo}>
              <span className={styles.featureTitle}>Mentorship</span>
              <span className={styles.featureDesc}>Guidance & Support</span>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconBox}>
              <i className="bi bi-graph-up-arrow" aria-hidden="true"></i>
            </div>
            <div className={styles.featureInfo}>
              <span className={styles.featureTitle}>Growth</span>
              <span className={styles.featureDesc}>Achievements & Career</span>
            </div>
          </div>
        </div>

        {/* Hero Desk Workspace Image */}
        <div className={styles.heroImageWrapper}>
          <img
            src="/assets/images/intern_login_desk.jpg"
            alt="Ethiroli learning workspace with laptop, curriculum books and coffee mug"
            className={styles.heroDeskImage}
          />
        </div>

        {/* Left Footer */}
        <div className={styles.leftFooter}>
          <strong>ETHIROLI</strong> <span>|</span> <em>Empowering Interns. Building Tomorrow.</em>
        </div>
      </section>

      {/* ====================================================================
          RIGHT FORM SECTION: FLOATING SIGN-IN CARD
          ==================================================================== */}
      <section className={styles.rightSection} aria-label="Sign In Form">
        <div className={styles.loginCard}>
          {/* Centered Brand Mark */}
          <div className={styles.cardBrandHeader}>
            <div className={styles.cardLogoRow}>
              <img
                src="/assets/images/ethiroli_logo.png"
                alt="Ethiroli"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
              <span className={styles.cardBrandName}>ETHIROLI</span>
            </div>
            <span className={styles.cardBrandSub}>ENTERPRISE PORTAL</span>
          </div>

          {/* Welcome Title */}
          <div className={styles.welcomeGroup}>
            <h2 className={styles.welcomeTitle}>Welcome Back!</h2>
            <p className={styles.welcomeSubtitle}>Sign in to your intern account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className={styles.alertError} role="alert">
              <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Notice Alert */}
          {notice && (
            <div className={styles.alertNotice} role="status">
              <i className="bi bi-info-circle-fill" aria-hidden="true"></i>
              <span>{notice}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
            {/* Email Field */}
            <div className={styles.fieldGroup}>
              <div className={styles.inputWrapper}>
                <i className={`bi bi-envelope ${styles.inputIcon}`} aria-hidden="true"></i>
                <input
                  type="email"
                  id="intern-email"
                  className={styles.textInput}
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                  aria-label="Email Address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className={styles.fieldGroup}>
              <div className={styles.inputWrapper}>
                <i className={`bi bi-lock ${styles.inputIcon}`} aria-hidden="true"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="intern-password"
                  className={styles.textInput}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  className={styles.togglePasswordBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true"></i>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className={styles.formRowMeta}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.customCheckbox}
                />
                <span>Remember me</span>
              </label>
              <a href="/auth/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </>
              )}
            </button>

            {/* Security Badge */}
            <div className={styles.securityBadge}>
              <div className={styles.securityIconBox}>
                <i className="bi bi-shield-check" aria-hidden="true"></i>
              </div>
              <div className={styles.securityText}>
                <div className={styles.securityTitle}>Secure access for authorized interns only</div>
                <div className={styles.securitySub}>Your data is protected and confidential.</div>
              </div>
            </div>

            {/* Subtle Demo Quick-Fill for convenience */}
            <div className={styles.demoFillSection}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Quick sign-in:</span>
              <button
                type="button"
                className={styles.demoFillBtn}
                onClick={() => handleQuickFill('knandhinivnr@gmail.com', 'Intern@123')}
              >
                Nandhini (knandhinivnr)
              </button>
            </div>
          </form>
        </div>

        {/* Botanical leaf illustration in bottom-right corner */}
        <div className={styles.cornerLeaves} aria-hidden="true">
          <svg
            width="180"
            height="180"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M120 160C120 100 80 60 70 30C95 40 140 85 145 160Z"
              fill="#10b981"
              opacity="0.3"
            />
            <path
              d="M150 160C140 90 105 30 85 0C120 10 165 60 160 160Z"
              fill="#34d399"
              opacity="0.4"
            />
            <path
              d="M100 160C90 110 50 60 25 45C60 40 120 90 130 160Z"
              fill="#059669"
              opacity="0.25"
            />
          </svg>
        </div>
      </section>
    </div>
  );
}