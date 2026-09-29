import express from 'express';
import { login, logout, getMe, verifyMfa, oauthAuthorize, oauthCallback, changePassword, impersonate, stopImpersonation, getDemoUsers } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { portalAuth } from '../middleware/portalAuth.js';

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
router.post('/impersonate', authenticate, validateBody('impersonate'), impersonate);
router.post('/stop-impersonation', authenticate, stopImpersonation);

export default router;
