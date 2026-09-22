import express from 'express';
import { listPosts, createPost, getPost, addReply, updatePost, pinPost, lockPost } from '../controllers/forumController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/forum/posts', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listPosts);
router.post('/forum/posts', requireRole('STUDENT', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createForumPost'), createPost);
router.get('/forum/posts/:id', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), getPost);
router.patch('/forum/posts/:id', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createForumPost'), updatePost);
router.patch('/forum/posts/:id/pin', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), pinPost);
router.patch('/forum/posts/:id/lock', requireRole('TUTOR', 'ADMIN', 'SUPER_ADMIN'), lockPost);
router.post('/forum/posts/:id/replies', requireRole('STUDENT', 'TUTOR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createForumReply'), addReply);

export default router;
