import express from 'express';
import {
  listJobBoardPosts,
  createJobBoardPost,
  getJobBoardPost,
  updateJobBoardPost,
  deleteJobBoardPost,
  getIndeedJobFeed,
  simulateIndeedApplication
} from '../controllers/jobBoardController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();

// Public XML feed for Indeed organic job crawler (matches both /indeed/feed.xml and /jobs-board/indeed/feed.xml)
router.get('/indeed/feed.xml', getIndeedJobFeed);
router.get('/jobs-board/indeed/feed.xml', getIndeedJobFeed);

// Protected routes
router.use(authenticate);

// Simulation test route for HR/Admins
router.post('/indeed/simulate-application', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), simulateIndeedApplication);
router.post('/jobs-board/indeed/simulate-application', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), simulateIndeedApplication);

// Job Board posts
router.get('/posts', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listJobBoardPosts);
router.get('/jobs-board/posts', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listJobBoardPosts);

router.post('/post', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createJobBoardPost'), createJobBoardPost);
router.post('/jobs-board/post', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createJobBoardPost'), createJobBoardPost);

router.get('/posts/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getJobBoardPost);
router.get('/jobs-board/posts/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), getJobBoardPost);

router.patch('/posts/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createJobBoardPost'), updateJobBoardPost);
router.patch('/jobs-board/posts/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createJobBoardPost'), updateJobBoardPost);

router.delete('/posts/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteJobBoardPost);
router.delete('/jobs-board/posts/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), deleteJobBoardPost);

export default router;
