import express from 'express';
import { listJobBoardPosts, createJobBoardPost } from '../controllers/jobBoardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/jobs-board/posts', listJobBoardPosts);
router.post('/jobs-board/post', createJobBoardPost);

export default router;
