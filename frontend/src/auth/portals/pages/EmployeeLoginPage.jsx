import React, { useEffect, useRef, useState } from 'react';
import LoginPage from '../../pages/LoginPage.jsx';
import { employeePortalApi } from '../../../../services/api/employeePortalApi.js';
import Input from '../../../../common/components/Input/Input.jsx';
import styles from '../../pages/Auth.module.css';

const REASON_KEY = 'auth_redirect_reason';

// The real Ethiroli brand asset already used by the public site
// (frontend/public/assets/images/ethiroli_logo.png).
const BRAND_LOGO = '/assets/images/ethiroli_logo.png';

// Pure read so it is safe as a lazy useState initialiser (StrictMode may call it
// twice) and so nothing is written during render.
const readNotice = () => {
  try {
    return sessionStorage.getItem(REASON_KEY) === 'session-expired'
      ? 'Your session has expired or you were signed out. Please sign in again.'
      : null;
  } catch {
    /* storage unavailable - just show the plain login form */
    return null;
  }
};

const errorOf = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

// The stages the API reports, in the order the employee passes through them.
// 'NONE' deliberately covers both "never requested" and "no matching request" -
// the endpoint answers those identically so it cannot be used to discover which
// email addresses belong to staff.
const STAGES = ['PENDING', 'APPROVED', 'COMPLETED'];

function RecoverySteps({ stage }) {
  const reached = STAGES.indexOf(stage);

  const steps = [
    {
      label: 'Request submitted',
      hint: 'Sent to HR',
      state: reached >= 0 ? 'done' : 'todo',
    },
    {
      label: 'Approved by HR',
      hint: 'An administrator reviews it',
      state: reached > 1 ? 'done' : reached === 1 ? 'active' : 'todo',
    },
    {
      label: 'New password set',
      hint: 'Then sign in normally',
      state: reached > 1 ? 'done' : 'todo',
    },
  ];

  return (
    <ol className={styles.recoverySteps}>
      {steps.map((step, i) => (
        <li key={step.label} className={styles.recoveryStep} data-state={step.state}>
          <span className={styles.recoveryStepNum} aria-hidden="true">
            {step.state === 'done' ? <i className="bi bi-check-lg"></i> : i + 1}
          </span>
          <span className={styles.recoveryStepText}>
            <span className={styles.recoveryStepLabel}>{step.label}</span>
            <span className={styles.recoveryStepHint}>{step.hint}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * PasswordRecovery - the forgot / change-password workflow, as a centered dialog
 * opened from the sign-in screen.
 *
 * It lives here rather than on the Profile page because a locked-out employee
 * cannot sign in to reach Profile - being unable to authenticate is precisely
 * the situation this flow exists for.
 *
 * It is a modal rather than a panel expanded under the form: the three-stage flow
 * is tall enough that inlining it stretched the login card to roughly three times
 * its normal height and pushed the sign-in form out of view.
 *
 * How it works, and why it is safe:
 *  - The employee identifies themselves with email + employee code. Neither is
 *    secret on its own, so this can only ever create a REVIEWABLE request. It
 *    can never set a password directly.
 *  - An ADMIN / SUPER_ADMIN / HR must approve it.
 *  - Only then does a short-lived, single-use grant exist, and that grant is what
 *    allows the new password to be set.
 *  - The backend answers identically for an unknown email and a wrong employee
 *    code, so this cannot be used to enumerate staff accounts.
 *
 * Every state shown here comes from the API response - nothing is assumed.
 */
function PasswordRecovery({ onClose }) {
  const [stage, setStage] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', employee_code: '' });
  const [reason, setReason] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const dialogRef = useRef(null);

  // Escape closes, background scroll is locked, focus moves into the dialog and
  // returns to the trigger on close.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [busy, onClose]);

  const setField = (field) => (e) => {
    setCredentials((c) => ({ ...c, [field]: e.target.value }));
    setError('');
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const res = await employeePortalApi.requestPasswordRecovery({
        email: credentials.email.trim(),
        employee_code: credentials.employee_code.trim(),
        reason: reason.trim() || null,
      });
      setStage(res?.data?.stage || 'PENDING');
      setNotice(res?.data?.message || 'Your request has been submitted for approval.');
      setReason('');
    } catch (err) {
      setError(errorOf(err, 'Could not submit the request. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  const checkStatus = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const res = await employeePortalApi.getPasswordRecoveryStatus({
        email: credentials.email.trim(),
        employee_code: credentials.employee_code.trim(),
      });
      setStage(res?.data?.stage || 'NONE');
      setNotice(res?.data?.message || '');
    } catch (err) {
      setError(errorOf(err, 'Could not check the status of your request.'));
    } finally {
      setBusy(false);
    }
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (newPassword !== confirmPassword) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const res = await employeePortalApi.setPasswordWithRecovery({
        email: credentials.email.trim(),
        employee_code: credentials.employee_code.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setNotice(res?.data?.message || res?.message || 'Password updated. You can now sign in.');
      setNewPassword('');
      setConfirmPassword('');
      setStage('COMPLETED');
    } catch (err) {
      setError(errorOf(err, 'Could not update your password.'));
    } finally {
      setBusy(false);
    }
  };

  const canSetPassword = stage === 'APPROVED';
  const awaitingApproval = stage === 'PENDING';
  const done = stage === 'COMPLETED';
  const hasCredentials = Boolean(credentials.email.trim() && credentials.employee_code.trim());

  const alertClass = done || canSetPassword ? styles.recoveryAlertSuccess : styles.recoveryAlertInfo;
  const alertIcon = done
    ? 'bi-check-circle-fill'
    : canSetPassword
      ? 'bi-unlock-fill'
      : 'bi-hourglass-split';

  const heading = canSetPassword
    ? 'Choose your new password'
    : done
      ? 'Password updated'
      : awaitingApproval
        ? 'Request awaiting approval'
        : 'Reset your password';

  return (
    <div
      className={styles.recoveryBackdrop}
      onMouseDown={(e) => {
        // Only a click on the backdrop itself closes, so a drag that ends
        // outside the dialog does not dismiss it.
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.recoveryDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recoveryTitle"
        tabIndex={-1}
      >
        <div className={styles.recoveryDialogHead}>
          <div className={styles.recoveryDialogIcon} aria-hidden="true">
            <i className={`bi ${done ? 'bi-check-circle-fill' : canSetPassword ? 'bi-unlock-fill' : 'bi-key-fill'}`}></i>
          </div>
          <div className={styles.recoveryDialogHeadText}>
            <h3 className={styles.recoveryDialogTitle} id="recoveryTitle">
              {heading}
            </h3>
            <span className={styles.recoveryDialogSub}>
              {canSetPassword
                ? 'HR approved your request. Set a new password to finish.'
                : done
                  ? 'Sign in again with your new password.'
                  : 'Enter your official email address and employee code.'}
            </span>
          </div>
          <button
            type="button"
            className={styles.recoveryDialogClose}
            onClick={onClose}
            disabled={busy}
            aria-label="Close password recovery"
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <div className={styles.recoveryDialogBody}>
          {error && (
            <div className={`${styles.recoveryAlert} ${styles.recoveryAlertError}`} role="alert">
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className={`${styles.recoveryAlert} ${alertClass}`} role="status">
              <i className={`bi ${alertIcon}`} aria-hidden="true"></i>
              <span>{notice}</span>
            </div>
          )}

          {stage && <RecoverySteps stage={stage} />}

          <form
            onSubmit={
              canSetPassword ? submitNewPassword : awaitingApproval ? checkStatus : submitRequest
            }
          >
            <div className={styles.recoveryFieldRow}>
              <Input
                label="Official email address"
                name="email"
                type="email"
                autoComplete="username"
                value={credentials.email}
                onChange={setField('email')}
                required
              />
              <Input
                label="Employee code"
                name="employee_code"
                type="text"
                autoComplete="off"
                placeholder="EMP001"
                value={credentials.employee_code}
                onChange={setField('employee_code')}
                required
              />
            </div>

            {canSetPassword && (
              <div className={styles.recoveryFieldRow}>
                <Input
                  label="New password"
                  name="new_password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  required
                />
                <Input
                  label="Confirm new password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  required
                />
              </div>
            )}

            {!canSetPassword && !awaitingApproval && !done && (
              <Input
                label="Reason (optional)"
                name="reason"
                type="text"
                placeholder="e.g. I forgot my password"
                maxLength={500}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            )}

            <div className={styles.recoveryActions}>
              {canSetPassword ? (
                <button
                  type="submit"
                  className={`${styles.recoveryBtn} ${styles.recoveryBtnPrimary}`}
                  disabled={busy || !hasCredentials}
                >
                  {busy ? 'Updating...' : 'Set new password'}
                </button>
              ) : awaitingApproval ? (
                <button
                  type="submit"
                  className={`${styles.recoveryBtn} ${styles.recoveryBtnGhost}`}
                  disabled={busy || !hasCredentials}
                >
                  {busy ? 'Checking...' : 'Check approval status'}
                </button>
              ) : (
                <button
                  type="submit"
                  className={`${styles.recoveryBtn} ${styles.recoveryBtnPrimary}`}
                  disabled={busy || !hasCredentials}
                >
                  {busy ? 'Submitting...' : 'Request password change'}
                </button>
              )}

              <button
                type="button"
                className={`${styles.recoveryBtn} ${styles.recoveryBtnGhost}`}
                onClick={onClose}
                disabled={busy}
              >
                {done ? 'Back to sign in' : 'Cancel'}
              </button>
            </div>
          </form>

          <p className={styles.recoveryHint}>
            At least 8 characters, including a letter and a number. Your last 5 passwords cannot
            be reused. An approval is valid for 30 minutes and can be used once.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * EmployeeLoginPage - the employee portal sign-in screen.
 *
 * Three employee-specific concerns on top of the shared LoginPage:
 *  1. the real Ethiroli logo, plus a password visibility toggle;
 *  2. the password recovery workflow, which has to live on the sign-in screen
 *     because a locked-out employee cannot reach any authenticated page. It opens
 *     as a centered dialog so the sign-in form keeps its own compact height;
 *  3. when the axios 401 handler bounces an expired session here, the user is
 *     told why they landed on a login screen instead of the portal silently
 *     reloading in a loop.
 */
export default function EmployeeLoginPage() {
  const [notice] = useState(readNotice);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const triggerRef = useRef(null);

  // The reason is only meaningful for this visit, so clear it afterwards.
  useEffect(() => {
    if (!notice) return;
    try {
      sessionStorage.removeItem(REASON_KEY);
    } catch {
      /* storage unavailable - nothing to clear */
    }
  }, [notice]);

  // Return focus to the trigger when the dialog closes.
  useEffect(() => {
    if (!recoveryOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [recoveryOpen]);

  const footer = (
    <button
      ref={triggerRef}
      type="button"
      className={styles.recoveryTrigger}
      onClick={() => setRecoveryOpen(true)}
    >
      <i className="bi bi-key me-2" aria-hidden="true"></i>
      Forgot your password?
    </button>
  );

  return (
    <>
      {notice && (
        <div role="alert" className={`${styles.error} ${styles.sessionNotice}`}>
          {notice}
        </div>
      )}

      <LoginPage
        portal="employee"
        brandLogo={BRAND_LOGO}
        showPasswordToggle
        footer={footer}
      />

      {recoveryOpen && <PasswordRecovery onClose={() => setRecoveryOpen(false)} />}
    </>
  );
}
