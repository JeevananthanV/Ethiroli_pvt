import PasswordRecoveryRequest from '../models/PasswordRecoveryRequest.js';
import PasswordChangeRequest from '../models/PasswordChangeRequest.js';
import CredentialService from '../services/credentialService.js';
import ActivityFeed from '../models/ActivityFeed.js';
import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { decrypt } from '../config/encryption.js';
import { BadRequestError, NotFoundError, AuthorizationError } from '../utils/errors.js';

/**
 * Public password-recovery endpoints (no session required).
 *
 * These live here rather than in passwordChangeController.js because the caller
 * is by definition not authenticated - that is the whole point of "I forgot my
 * password". The authenticated, in-portal equivalents remain in
 * passwordChangeController.js.
 *
 * Identity is asserted with email + employee code. Neither is secret on its own
 * (employee codes are sequential), so this is deliberately NOT a way to set a
 * password directly: a request only creates a reviewable row. An
 * ADMIN / SUPER_ADMIN / HR must approve it, and only then does an unexpired,
 * single-use grant exist. Every endpoint is rate limited and every attempt is
 * recorded.
 *
 * Responses never reveal whether an email exists: an unknown email and a wrong
 * employee code produce the same message, so this cannot be used to enumerate
 * staff accounts.
 */

const GENERIC_ACCEPTED =
  'If those details match an employee record, a password change request has been sent to HR for approval.';

const GENERIC_STATUS =
  'No password change request was found for those details.';

// How long an approved recovery grant stays usable. Matches the in-portal
// approval window so both halves of the workflow behave identically.
const GRANT_WINDOW_MINUTES = 30;

// At most this many recovery requests per email+code pair per hour.
const MAX_REQUESTS_PER_HOUR = 3;

const normaliseEmail = (value) => String(value || '').trim().toLowerCase();

/**
 * Resolves email + employee code to a single employee row.
 * Returns null when there is no match, and also null when the pair is
 * ambiguous - a code that matches more than one employee must never resolve.
 */
const resolveEmployee = async (email, employeeCode) => {
  const normalisedEmail = normaliseEmail(email);
  const normalisedCode = String(employeeCode || '').trim().toUpperCase();
  if (!normalisedEmail || !normalisedCode) return null;

  const [rows] = await pool.execute(
    `SELECT e.id, e.user_id, e.employee_code, u.email, u.role, u.is_active
       FROM employees e
       JOIN users u ON u.id = e.user_id
      WHERE UPPER(e.employee_code) = ?`,
    [normalisedCode]
  );

  // users.email is encrypted at rest, so the comparison has to happen in JS.
  // Filtering to EMPLOYEE keeps this endpoint out of every other role's way.
  const matches = rows.filter(
    (r) => r.role === 'EMPLOYEE' && r.is_active === 1 && decrypt(r.email) === normalisedEmail
  );

  return matches.length === 1 ? matches[0] : null;
};

/**
 * Public view of a recovery attempt. Deliberately vague: it tells the caller
 * what to do next without confirming that the email belongs to a real employee.
 */
const toPublicView = (recoveryRow, changeRow) => {
  const usableGrant = Boolean(
    changeRow &&
    changeRow.status === 'APPROVED' &&
    !changeRow.grant_used_at &&
    changeRow.grant_expires_at &&
    new Date(changeRow.grant_expires_at).getTime() > Date.now()
  );

  let stage = 'NONE';
  let message = GENERIC_STATUS;

  if (recoveryRow) {
    if (usableGrant) {
      stage = 'APPROVED';
      message = 'Approved. You can set a new password now.';
    } else if (changeRow?.status === 'COMPLETED') {
      stage = 'COMPLETED';
      message = 'Your password was already changed. Sign in with your new password.';
    } else if (changeRow?.status === 'REJECTED') {
      stage = 'REJECTED';
      message = changeRow.review_note
        ? `Your request was declined: ${changeRow.review_note}`
        : 'Your request was declined. Contact HR if you still cannot sign in.';
    } else if (changeRow?.status === 'APPROVED') {
      stage = 'EXPIRED';
      message = 'Your approval expired before the password was set. Please raise a new request.';
    } else if (recoveryRow.status === 'PENDING') {
      stage = 'PENDING';
      message = 'Your request is with HR for approval. You will be able to set a new password once it is approved.';
    } else {
      stage = recoveryRow.status;
      message = GENERIC_STATUS;
    }
  }

  return {
    stage,
    can_set_password: usableGrant,
    message
  };
};

/**
 * POST /v1/auth/password-recovery/request
 *
 * Body: { email, employee_code, reason? }
 *
 * Creates the reviewable recovery row AND raises the real approval request
 * against the employee's user_id, so the existing HR/Admin reviewer queue picks
 * it up with no extra wiring.
 */
export const requestPasswordRecovery = asyncHandler(async (req, res) => {
  const email = normaliseEmail(req.body?.email);
  const employeeCode = String(req.body?.employee_code || '').trim().toUpperCase();
  const reason = req.body?.reason ? String(req.body.reason).trim().slice(0, 500) : null;
  const ip = req.ip || req.headers['x-forwarded-for'] || null;

  if (!email || !employeeCode) {
    throw new BadRequestError('email and employee_code are required');
  }

  // Throttle repeated attempts against the same pair before doing any lookup.
  const recent = await PasswordRecoveryRequest.countRecentForCredentials(
    email, employeeCode, 60
  );
  if (recent >= MAX_REQUESTS_PER_HOUR) {
    throw new BadRequestError(
      'Too many password recovery requests for these details. Please try again later or contact HR directly.'
    );
  }

  const employee = await resolveEmployee(email, employeeCode);

  // Always record the attempt, even an unmatched one: a burst of wrong codes is
  // exactly the signal worth keeping.
  await PasswordRecoveryRequest.create({
    email,
    employeeCode,
    userId: employee?.user_id || null,
    reason,
    ip
  }).catch(() => { /* the generic response below is still correct */ });

  if (!employee) {
    // Same wording as the success case - no account enumeration.
    return success(res, 202, { stage: 'PENDING', can_set_password: false, message: GENERIC_ACCEPTED }, GENERIC_ACCEPTED);
  }

  const existing = await PasswordChangeRequest.findLatestForUser(employee.user_id);
  const grantUsable = Boolean(
    existing?.status === 'APPROVED' &&
    !existing.grant_used_at &&
    existing.grant_expires_at &&
    new Date(existing.grant_expires_at).getTime() > Date.now()
  );

  if (!grantUsable && existing?.status !== 'PENDING') {
    await PasswordChangeRequest.create({ userId: employee.user_id, reason });
  }

  // Tell HR there is something to review. Routed through the existing
  // notification path rather than a bespoke email.
  await ActivityFeed.create({
    user_id: employee.user_id,
    actor_id: employee.user_id,
    event_type: 'PASSWORD_RECOVERY_REQUESTED',
    entity_type: 'PasswordChangeRequest',
    entity_id: employee.user_id,
    payload: {
      message: 'A password change was requested from the sign-in screen and is awaiting HR approval.',
      employee_code: employee.employee_code
    }
  }).catch(() => { /* notification is best-effort */ });

  return success(res, 202, { stage: 'PENDING', can_set_password: false, message: GENERIC_ACCEPTED }, GENERIC_ACCEPTED);
});

/**
 * POST /v1/auth/password-recovery/status
 *
 * Body: { email, employee_code }
 *
 * Lets the sign-in screen show "waiting for approval" / "approved - set your
 * password" without the employee having to sign in first. Matches on BOTH
 * credentials so nobody can poll a stranger's request status.
 */
export const getPasswordRecoveryStatus = asyncHandler(async (req, res) => {
  const email = normaliseEmail(req.body?.email);
  const employeeCode = String(req.body?.employee_code || '').trim().toUpperCase();

  if (!email || !employeeCode) {
    throw new BadRequestError('email and employee_code are required');
  }

  const employee = await resolveEmployee(email, employeeCode);
  if (!employee) {
    return success(res, 200, { stage: 'NONE', can_set_password: false, message: GENERIC_STATUS }, GENERIC_STATUS);
  }

  const [recoveryRow, changeRow] = await Promise.all([
    PasswordRecoveryRequest.findLatestForCredentials(email, employeeCode),
    PasswordChangeRequest.findLatestForUser(employee.user_id)
  ]);

  return success(res, 200, toPublicView(recoveryRow, changeRow), 'Password recovery status retrieved');
});

/**
 * POST /v1/auth/password-recovery/set-password
 *
 * Body: { email, employee_code, new_password, confirm_password? }
 *
 * Sets the new password, but only against an approved, unexpired, unused grant
 * that belongs to the employee resolved from email + employee code. Complexity,
 * length and the no-reuse-of-last-5 rule are enforced by CredentialService,
 * which is the same engine the admin reset path uses; it also revokes the user's
 * existing sessions.
 */
export const setPasswordWithRecovery = asyncHandler(async (req, res) => {
  const email = normaliseEmail(req.body?.email);
  const employeeCode = String(req.body?.employee_code || '').trim().toUpperCase();
  const newPassword = req.body?.new_password;
  const confirmPassword = req.body?.confirm_password;

  if (!email || !employeeCode) {
    throw new BadRequestError('email and employee_code are required');
  }
  if (!newPassword || !String(newPassword).trim()) {
    throw new BadRequestError('new_password is required');
  }
  if (confirmPassword !== undefined && confirmPassword !== null && confirmPassword !== newPassword) {
    throw new BadRequestError('The two passwords do not match');
  }

  const employee = await resolveEmployee(email, employeeCode);
  if (!employee) {
    // Same message as "no grant", so a wrong code cannot be distinguished from
    // an unapproved one.
    throw new AuthorizationError(
      'No approved password change is available for these details. Submit a request and wait for HR approval.'
    );
  }

  const grant = await PasswordChangeRequest.findUsableGrant(employee.user_id);
  if (!grant) {
    throw new AuthorizationError(
      'No approved password change is available for these details. Submit a request and wait for HR approval.'
    );
  }

  // Throws for weak passwords and for reuse of a recent password.
  await CredentialService.updatePassword(employee.user_id, String(newPassword), { actorId: null });

  // Single use. If this fails the password changed but the grant stays open, so
  // treat it as fatal rather than leaving a reusable grant behind.
  const consumed = await PasswordChangeRequest.consumeGrant(grant.id);
  if (!consumed) {
    throw new AuthorizationError('This password change approval has already been used or has expired.');
  }

  const recoveryRow = await PasswordRecoveryRequest.findLatestForCredentials(email, employeeCode);
  if (recoveryRow) {
    await PasswordRecoveryRequest.markResolved(recoveryRow.id, employee.user_id).catch(() => {});
  }

  await ActivityFeed.create({
    user_id: employee.user_id,
    actor_id: employee.user_id,
    event_type: 'PASSWORD_CHANGED',
    entity_type: 'PasswordChangeRequest',
    entity_id: grant.id,
    payload: { message: 'Your password was changed through an approved password change request.' }
  }).catch(() => { /* notification is best-effort */ });

  return success(res, 200, { changed: true }, 'Password updated successfully. You can now sign in.');
});


