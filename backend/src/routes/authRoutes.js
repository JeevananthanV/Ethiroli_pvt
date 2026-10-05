import express from 'express';
import { login, logout, getMe, verifyMfa, oauthAuthorize, oauthCallback, changePassword, impersonate, stopImpersonation, getDemoUsers } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { loginLimiter, passwordRecoveryLimiter } from '../middleware/rateLimiter.js';
import { portalAuth } from '../middleware/portalAuth.js';
import {
  requestPasswordRecovery,
  getPasswordRecoveryStatus,
  setPasswordWithRecovery
} from '../controllers/passwordRecoveryController.js';

const router = express.Router();

router.get('/demo-users', getDemoUsers);
router.post('/login', loginLimiter, validateBody('login'), login);
// This router is mounted at /api/v1/auth, so do not repeat /auth here.
router.post('/portal-login', loginLimiter, validateBody('login'), portalAuth, login);
router.post('/mfa/verify', loginLimiter, validateBody('mfa'), portalAuth, verifyMfa);
router.get('/oauth/:provider/authorize', oauthAuthorize);
router.get('/oauth/:provider/callback', oauthCallback);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, validateBody('changePassword'), changePassword);

// Employee password recovery - deliberately PUBLIC (no `authenticate`).
// A locked-out employee cannot hold a session, which is the entire point of
// "I forgot my password". Safety comes from three things instead:
//   - identity is asserted with email + employee code, not a session,
//   - a request can only ever create a reviewable row; an
//     ADMIN / SUPER_ADMIN / HR approval is required before any password can be
//     set, and that grant is short-lived and single-use,
//   - every endpoint has its own rate limit and records each attempt.
// Rate limited independently of the login budget so the two cannot be used to
// lock each other out.
router.post('/password-recovery/request', passwordRecoveryLimiter, requestPasswordRecovery);
router.post('/password-recovery/status', passwordRecoveryLimiter, getPasswordRecoveryStatus);
router.post('/password-recovery/set-password', passwordRecoveryLimiter, setPasswordWithRecovery);
router.post('/impersonate', authenticate, validateBody('impersonate'), impersonate);
router.post('/stop-impersonation', authenticate, stopImpersonation);

export default router;
