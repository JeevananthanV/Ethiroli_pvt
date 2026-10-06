import PasswordChangeRequest from '../models/PasswordChangeRequest.js';
import CredentialService from '../services/credentialService.js';
import ActivityFeed from '../models/ActivityFeed.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { BadRequestError, NotFoundError, AuthorizationError } from '../utils/errors.js';

// The same reviewer role set the existing POST /users/:id/reset-password route
// already uses, so this workflow introduces no new privileged role.
export const PASSWORD_REVIEW_ROLES = ['ADMIN', 'SUPER_ADMIN', 'HR', 'HR_SUPERADMIN'];

const MIN_PASSWORD_LENGTH = 8;

/**
 * Employee-facing view of their own request. It never exposes a token or hash -
 * only whether the employee may set a new password right now.
 */
const toEmployeeView = (row) => {
  if (!row) {
    return {
      status: 'NONE',
      can_change_password: false,
      message: 'You have not requested a password change.'
    };
  }
  const usable = Boolean(
    row.status === 'APPROVED' && !row.grant_used_at && row.grant_expires_at &&
    new Date(row.grant_expires_at).getTime() > Date.now()
  );
  let message;
  if (row.status === 'PENDING') message = 'Your request is waiting for administrator approval.';
  else if (usable) message = 'Approved. You can set a new password until the approval expires.';
  else if (row.status === 'APPROVED') message = 'Your approval has expired. Please raise a new request.';
  else if (row.status === 'COMPLETED') message = 'Your password was changed.';
  else if (row.status === 'REJECTED') message = row.review_note || 'Your request was rejected.';
  else message = 'Your request expired. Please raise a new one.';

  return {
    id: row.id,
    status: row.status,
    reason: row.reason,
    requested_at: row.requested_at,
    reviewed_at: row.reviewed_at,
    review_note: row.review_note,
    grant_expires_at: usable ? row.grant_expires_at : null,
    can_change_password: usable,
    message
  };
};

/**
 * POST /v1/employee/password-change-request
 *
 * Raising a request grants nothing on its own - it only asks a reviewer.
 */
export const requestPasswordChange = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reason = req.body?.reason ? String(req.body.reason).trim().slice(0, 500) : null;

  const existing = await PasswordChangeRequest.findLatestForUser(userId);
  if (existing) {
    const usable = existing.status === 'APPROVED' && !existing.grant_used_at &&
      existing.grant_expires_at && new Date(existing.grant_expires_at).getTime() > Date.now();
    if (usable) {
      throw new BadRequestError('You already have an approved password change. Use it or wait for it to expire.');
    }
    if (existing.status === 'PENDING') {
      throw new BadRequestError('You already have a password change request awaiting approval.');
    }
  }

  const created = await PasswordChangeRequest.create({ userId, reason });

  // ActivityFeed.create expects snake_case (user_id / event_type / entity_type).
  // Passing userId/eventType made every insert violate the NOT NULL columns on
  // user_id and entity_type, and the .catch() then hid the failure - so the
  // request was saved but the employee was never actually notified.
  await ActivityFeed.create({
    user_id: userId,
    actor_id: userId,
    event_type: 'PASSWORD_CHANGE_REQUESTED',
    entity_type: 'PasswordChangeRequest',
    entity_id: created.id,
    payload: { message: 'You requested a password change. An administrator must approve it before you can set a new one.' }
  }).catch(() => { /* notification is best-effort */ });

  return success(res, 201, toEmployeeView(created), 'Password change request submitted for approval');
});

/** GET /v1/employee/password-change-request - own request status only. */
export const getMyPasswordChangeRequest = asyncHandler(async (req, res) => {
  const row = await PasswordChangeRequest.findLatestForUser(req.user.id);
  return success(res, 200, toEmployeeView(row), 'Password change request status retrieved');
});

/**
 * POST /v1/employee/password-change
 *
 * Sets a new password, but only against an approved, unexpired, unused grant
 * belonging to the caller. Validation (length, letter + number, no reuse of the
 * recent password history) is delegated to CredentialService, which is the same
 * engine the admin reset path uses; it also revokes the user's other sessions.
 */
export const changePasswordWithApproval = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { new_password: newPassword, confirm_password: confirmPassword } = req.body || {};

  if (!newPassword || !String(newPassword).trim()) {
    throw new BadRequestError('new_password is required');
  }
  if (confirmPassword !== undefined && confirmPassword !== newPassword) {
    throw new BadRequestError('The two passwords do not match');
  }
  if (String(newPassword).length < MIN_PASSWORD_LENGTH) {
    throw new BadRequestError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const grant = await PasswordChangeRequest.findUsableGrant(userId);
  if (!grant) {
    throw new AuthorizationError(
      'No approved password change is available. Submit a request and wait for administrator approval.'
    );
  }

  // Throws for weak passwords and for reuse of a recent password.
  await CredentialService.updatePassword(userId, String(newPassword), { actorId: null });

  // Single use: if this fails the password changed but the grant stays open, so
  // treat it as fatal rather than reporting success with a reusable grant.
  const consumed = await PasswordChangeRequest.consumeGrant(grant.id);
  if (!consumed) {
    throw new AuthorizationError('This password change approval has already been used or has expired.');
  }

  await ActivityFeed.create({
    user_id: userId,
    actor_id: userId,
    event_type: 'PASSWORD_CHANGED',
    entity_type: 'PasswordChangeRequest',
    entity_id: grant.id,
    payload: { message: 'Your password was changed through an approved password change request.' }
  }).catch(() => { /* notification is best-effort */ });

  return success(res, 200, { changed: true }, 'Password updated successfully');
});

/** GET /v1/users/password-change-requests - reviewer queue. */
export const listPasswordChangeRequests = asyncHandler(async (req, res) => {
  const status = String(req.query.status || 'PENDING').toUpperCase();
  const rows = await PasswordChangeRequest.listForReview({ status, limit: req.query.limit });
  return success(res, 200, rows, 'Password change requests retrieved');
});

/** POST /v1/users/password-change-requests/:id/approve - reviewer action. */
export const approvePasswordChangeRequest = asyncHandler(async (req, res) => {
  const reviewerId = req.user.id;
  const { id } = req.params;
  const note = req.body?.note ? String(req.body.note).trim().slice(0, 500) : null;

  const row = await PasswordChangeRequest.findById(id);
  if (!row) throw new NotFoundError('Password change request not found');

  // Four-eyes: the requester can never approve their own request, even if a
  // future role change ever granted them the reviewer role.
  if (row.user_id === reviewerId) {
    throw new AuthorizationError('You cannot approve your own password change request');
  }

  const approved = await PasswordChangeRequest.approve(id, reviewerId, note);
  if (!approved) {
    throw new BadRequestError('This request is no longer pending and cannot be approved');
  }

  await ActivityFeed.create({
    user_id: row.user_id,
    actor_id: reviewerId,
    event_type: 'PASSWORD_CHANGE_APPROVED',
    entity_type: 'PasswordChangeRequest',
    entity_id: id,
    payload: {
      message: 'Your password change request was approved. Sign in again and set your new password from the login screen.',
      grant_expires_at: new Date(Date.now() + 30 * 60000).toISOString()
    }
  }).catch(() => { /* notification is best-effort */ });

  const updated = await PasswordChangeRequest.findById(id);
  return success(res, 200, toEmployeeView(updated), 'Password change request approved');
});

/** POST /v1/users/password-change-requests/:id/reject - reviewer action. */
export const rejectPasswordChangeRequest = asyncHandler(async (req, res) => {
  const reviewerId = req.user.id;
  const { id } = req.params;
  const note = req.body?.note ? String(req.body.note).trim().slice(0, 500) : null;

  const row = await PasswordChangeRequest.findById(id);
  if (!row) throw new NotFoundError('Password change request not found');
  if (row.user_id === reviewerId) {
    throw new AuthorizationError('You cannot review your own password change request');
  }

  const rejected = await PasswordChangeRequest.reject(id, reviewerId, note);
  if (!rejected) {
    throw new BadRequestError('This request is no longer pending and cannot be rejected');
  }

  await ActivityFeed.create({
    user_id: row.user_id,
    actor_id: reviewerId,
    event_type: 'PASSWORD_CHANGE_REJECTED',
    entity_type: 'PasswordChangeRequest',
    entity_id: id,
    payload: { message: note ? `Your password change request was declined: ${note}` : 'Your password change request was declined.' }
  }).catch(() => { /* notification is best-effort */ });

  const updated = await PasswordChangeRequest.findById(id);
  return success(res, 200, toEmployeeView(updated), 'Password change request rejected');
});
