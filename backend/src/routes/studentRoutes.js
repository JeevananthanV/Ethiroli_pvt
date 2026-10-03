import express from 'express';
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

/**
 * Scope the gate to these routes only.
 *
 * This router is mounted at '/v1', so `router.use(requireRole(...))` also ran
 * for every /v1/* path that no earlier-mounted router had already handled. Any
 * unmatched path (e.g. /v1/feed, /v1/notifications, /v1/messages) fell through
 * to here and was answered with a 403 listing student-only roles, instead of
 * reaching its own route or returning a 404. Attaching the middleware per-route
 * keeps the student listing restricted without swallowing the rest of /v1.
 */
const STUDENT_ADMIN_ROLES = ['HR', 'ADMIN', 'SUPER_ADMIN', 'TUTOR', 'RECEPTION'];

router.get('/students', requireRole(...STUDENT_ADMIN_ROLES), listStudents);
router.get('/students/:id', requireRole(...STUDENT_ADMIN_ROLES), getStudent);
router.post('/students', requireRole(...STUDENT_ADMIN_ROLES), createStudent);
router.patch('/students/:id', requireRole(...STUDENT_ADMIN_ROLES), updateStudent);

export default router;
