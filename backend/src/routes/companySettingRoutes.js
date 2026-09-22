import express from 'express';
import { listSettings, getSetting, createSetting, updateSetting, deleteSetting } from '../controllers/companySettingController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/company-settings', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), listSettings);
router.get('/company-settings/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), getSetting);
router.post('/company-settings', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('createCompanySetting'), createSetting);
router.patch('/company-settings/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('createCompanySetting'), updateSetting);
router.delete('/company-settings/:id', requireRole('SUPER_ADMIN'), deleteSetting);

export default router;
