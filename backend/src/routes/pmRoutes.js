import express from 'express';
import {
  listProjects,
  getProjectDetails,
  createProject,
  updateProject,
  deleteProject,
  listMilestones,
  createMilestone,
  signoffMilestone,
  listSprints,
  createSprint,
  startSprint,
  completeSprint,
  listFiles,
  createFile,
  deleteFile,
  listExpenses,
  createExpense,
  approveExpense,
  rejectExpense,
  getPerformanceKPIs,
  listAssignableUsers
} from '../controllers/pmController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

// Allow Project Managers, Admins, Super Admins (and Team Members/Interns read access where relevant)
const pmRole = requireRole('PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN');

// Projects
router.get('/projects/assignable-users', pmRole, listAssignableUsers);
router.get('/projects', listProjects);
router.get('/projects/:id', getProjectDetails);
router.post('/projects', pmRole, createProject);
router.put('/projects/:id', pmRole, updateProject);
router.patch('/projects/:id', pmRole, updateProject);
router.delete('/projects/:id', pmRole, deleteProject);

// Milestones
router.get('/milestones', listMilestones);
router.post('/milestones', pmRole, createMilestone);
router.put('/milestones/:id/signoff', pmRole, signoffMilestone);

// Sprints
router.get('/sprints', listSprints);
router.post('/sprints', pmRole, createSprint);
router.put('/sprints/:id/start', pmRole, startSprint);
router.put('/sprints/:id/complete', pmRole, completeSprint);

// Project Files
router.get('/files', listFiles);
router.post('/files', createFile);
router.delete('/files/:id', pmRole, deleteFile);

// Project Expenses
router.get('/expenses', listExpenses);
router.post('/expenses', createExpense);
router.put('/expenses/:id/approve', pmRole, approveExpense);
router.put('/expenses/:id/reject', pmRole, rejectExpense);

// Performance KPIs
router.get('/performance/kpis', pmRole, getPerformanceKPIs);

export default router;
