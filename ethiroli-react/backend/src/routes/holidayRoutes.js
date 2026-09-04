import express from 'express';
import { listHolidays, createHoliday } from '../controllers/holidayController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/calendar/holidays', listHolidays);
router.post('/calendar/holidays', createHoliday);

export default router;
