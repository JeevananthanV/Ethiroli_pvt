import express from 'express';
import { listJobBoardPosts, createJobBoardPost, getJobBoardPost, updateJobBoardPost, deleteJobBoardPost } from '../controllers/jobBoardController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/jobs-board/posts', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listJobBoardPosts);
router.post('/jobs-board/post', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createJobBoardPost'), createJobBoardPost);
router.get('/jobs-board/posts/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getJobBoardPost);
router.patch('/jobs-board/posts/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createJobBoardPost'), updateJobBoardPost);
router.delete('/jobs-board/posts/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteJobBoardPost);

export default router;
