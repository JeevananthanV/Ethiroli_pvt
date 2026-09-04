import express from 'express';
import { listPosts, createPost, getPost, addReply } from '../controllers/forumController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/forum/posts', listPosts);
router.post('/forum/posts', createPost);
router.get('/forum/posts/:id', getPost);
router.post('/forum/posts/:id/replies', addReply);

export default router;
