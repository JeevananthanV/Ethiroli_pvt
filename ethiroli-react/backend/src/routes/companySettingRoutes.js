import express from 'express';
import { getCompanySettings, saveCompanySettings } from '../controllers/companySettingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/pms/settings/company', getCompanySettings);
router.put('/pms/settings/company', saveCompanySettings);

export default router;
