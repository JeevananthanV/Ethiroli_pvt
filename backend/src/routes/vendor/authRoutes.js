import express from 'express';
import { login as sharedLogin, logout, getMe } from '../../controllers/authController.js';
import { authenticate } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validation.js';
import { loginLimiter } from '../../middleware/rateLimiter.js';
import { requireRole } from '../../middleware/rbac.js';
import { ROLES } from '../../config/constants.js';

const router = express.Router();

router.post('/login', loginLimiter, validateBody('login'), (req, res, next) => {
  req.body.portal = 'VENDOR';
  return sharedLogin(req, res, next);
});

router.post('/logout', authenticate, requireRole(ROLES.VENDOR), logout);
router.get('/me', authenticate, requireRole(ROLES.VENDOR), getMe);

export default router;
