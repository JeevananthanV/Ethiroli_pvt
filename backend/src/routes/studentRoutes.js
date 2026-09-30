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
router.use(requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'TUTOR', 'RECEPTION'));

router.get('/students', listStudents);
router.get('/students/:id', getStudent);
router.post('/students', createStudent);
router.patch('/students/:id', updateStudent);

export default router;
