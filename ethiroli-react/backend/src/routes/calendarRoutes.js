import express from 'express';
import { listEvents, createEvent } from '../controllers/calendarController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/calendar/events', listEvents);
router.post('/calendar/events', createEvent);

export default router;
