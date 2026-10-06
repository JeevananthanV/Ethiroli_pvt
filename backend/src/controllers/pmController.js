import StudentProject from '../models/StudentProject.js';
import ProjectMilestone from '../models/ProjectMilestone.js';
import ProjectSprint from '../models/ProjectSprint.js';
import ProjectFile from '../models/ProjectFile.js';
import ProjectExpense from '../models/ProjectExpense.js';
import pool from '../config/database.js';
import { notifyProjectAssignment } from '../services/projectNotificationService.js';
import {
  readAssignment,
  touchesOwnership as ownershipTouched,
  buildOwnershipPatch,
  validateOwners,
  fetchAssignableUsers
} from '../services/projectAssignmentService.js';

// ==========================================
// 1. PROJECTS
// ==========================================

export const listProjects = async (req, res) => {
  try {
    const { is_active, limit = 50, offset = 0 } = req.query;
    const projects = await StudentProject.list({
      is_active: is_active !== undefined ? is_active === 'true' : undefined,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    // Enrich with active milestones and sprint status
    const enriched = await Promise.all(
      projects.map(async (p) => {
        const [milestones] = await pool.execute(
          'SELECT COUNT(*) as total, SUM(CASE WHEN status = "COMPLETED" THEN 1 ELSE 0 END) as completed FROM project_milestones WHERE project_id = ?',
          [p.id]
        );
        const [activeSprint] = await pool.execute(
          'SELECT sprint_name, sprint_number FROM project_sprints WHERE project_id = ? AND status = "ACTIVE" LIMIT 1',
          [p.id]
        );
        return {
          ...p,
          total_milestones: milestones[0].total,
          completed_milestones: milestones[0].completed,
          current_sprint: activeSprint[0] ? `Sprint ${activeSprint[0].sprint_number}` : 'None'
        };
      })
    );

    res.json({ success: true, projects: enriched });
  } catch (error) {
    console.error('listProjects error:', error);
    res.status(500).json({ error: 'Failed to fetch project portfolio' });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await StudentProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const milestones = await ProjectMilestone.list({ project_id: id });
    const sprints = await ProjectSprint.list({ project_id: id });
    const files = await ProjectFile.list({ project_id: id });
    const expenses = await ProjectExpense.getSummary(id);

    res.json({
      success: true,
      project,
      milestones,
      sprints,
      files,
      expenseSummary: expenses
    });
  } catch (error) {
    console.error('getProjectDetails error:', error);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description, github_repo_url, repo_owner, repo_name, branch } = req.body;
    if (!name || !github_repo_url) {
      return res.status(400).json({ error: 'Project name and repository URL are required' });
    }

    const assignment = readAssignment(req.body);
    await validateOwners(assignment.manager_id, assignment.assigned_user_ids);

    const id = await StudentProject.create({
      student_id: req.user.id,
      name,
      description,
      github_repo_url,
      repo_owner,
      repo_name,
      branch: branch || 'main',
      is_active: true,
      ...assignment
    });

    const project = await StudentProject.findById(id);

    // Tell the responsible manager, the connected team, and oversight roles.
    notifyProjectAssignment({
      action: 'created',
      project,
      assignedIds: assignment.assigned_user_ids,
      actor: {
        id: req.user.id,
        role: req.user.role,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    }).catch(() => {});

    res.status(201).json({
      success: true,
      project,
      notified: {
        manager_id: assignment.manager_id,
        assigned_user_ids: assignment.assigned_user_ids,
        oversight_roles: ['SUPER_ADMIN', 'ADMIN']
      }
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ error: error.message });
    }
    console.error('createProject error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await StudentProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const ownershipChanged = ownershipTouched(req.body);
    let ownershipPatch = null;
    let merged = null;

    if (ownershipChanged) {
      // Only the fields actually sent are written, so changing just the owner
      // does not wipe the existing team.
      ownershipPatch = buildOwnershipPatch(req.body);
      merged = readAssignment({ ...project, ...ownershipPatch });
      await validateOwners(merged.manager_id, merged.assigned_user_ids);
    }

    await StudentProject.update(id, { ...req.body, ...ownershipPatch });
    const updated = await StudentProject.findById(id);

    if (ownershipChanged) {
      const ownerChanged = project.manager_id !== updated.manager_id;
      notifyProjectAssignment({
        action: ownerChanged ? 'reassigned' : 'assigned',
        project: updated,
        assignedIds: updated.assigned_user_ids,
        previousManagerId: ownerChanged ? project.manager_id : null,
        actor: {
          id: req.user.id,
          role: req.user.role,
          ip: req.ip,
          userAgent: req.headers['user-agent']
        }
      }).catch(() => {});
    }

    res.json({
      success: true,
      project: updated,
      notified: ownershipChanged
        ? {
            manager_id: merged.manager_id,
            assigned_user_ids: merged.assigned_user_ids,
            oversight_roles: ['SUPER_ADMIN', 'ADMIN']
          }
        : null
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ error: error.message });
    }
    console.error('updateProject error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

/**
 * People a project can be handed to. Powers the "Responsible for delivery"
 * picker in the PM portal without exposing the full user directory.
 */
export const listAssignableUsers = async (req, res) => {
  try {
    const users = await fetchAssignableUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error('listAssignableUsers error:', error);
    res.status(500).json({ error: 'Failed to load assignable users' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await StudentProject.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await StudentProject.delete(id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('deleteProject error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// ==========================================
// 2. MILESTONES
// ==========================================

export const listMilestones = async (req, res) => {
  try {
    const { project_id, status } = req.query;
    const milestones = await ProjectMilestone.list({ project_id, status });
    res.json({ success: true, milestones });
  } catch (error) {
    console.error('listMilestones error:', error);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
};

export const createMilestone = async (req, res) => {
  try {
    const { project_id, title, description, target_date, deliverable_url, budget_allocated } = req.body;
    if (!project_id || !title || !target_date) {
      return res.status(400).json({ error: 'project_id, title, and target_date are required' });
    }

    const result = await ProjectMilestone.create({
      project_id,
      title,
      description,
      target_date,
      deliverable_url,
      budget_allocated: parseFloat(budget_allocated || 0)
    });

    const milestone = await ProjectMilestone.findById(result.id);
    res.status(201).json({ success: true, milestone });
  } catch (error) {
    console.error('createMilestone error:', error);
    res.status(500).json({ error: 'Failed to create milestone' });
  }
};

export const signoffMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliverable_url } = req.body;
    const updated = await ProjectMilestone.signoff(id, deliverable_url);
    if (!updated) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    res.json({ success: true, milestone: updated });
  } catch (error) {
    console.error('signoffMilestone error:', error);
    res.status(500).json({ error: 'Failed to sign-off milestone' });
  }
};

// ==========================================
// 3. SPRINTS
// ==========================================

export const listSprints = async (req, res) => {
  try {
    const { project_id, status } = req.query;
    const sprints = await ProjectSprint.list({ project_id, status });
    res.json({ success: true, sprints });
  } catch (error) {
    console.error('listSprints error:', error);
    res.status(500).json({ error: 'Failed to fetch sprints' });
  }
};

export const createSprint = async (req, res) => {
  try {
    const { project_id, sprint_number, sprint_name, goal, start_date, end_date, target_velocity } = req.body;
    if (!project_id || !sprint_number || !sprint_name || !start_date || !end_date) {
      return res.status(400).json({ error: 'project_id, sprint_number, sprint_name, start_date, and end_date are required' });
    }

    const result = await ProjectSprint.create({
      project_id,
      sprint_number: parseInt(sprint_number, 10),
      sprint_name,
      goal,
      start_date,
      end_date,
      target_velocity: parseInt(target_velocity || 0, 10)
    });

    const sprint = await ProjectSprint.findById(result.id);
    res.status(201).json({ success: true, sprint });
  } catch (error) {
    console.error('createSprint error:', error);
    res.status(500).json({ error: 'Failed to create sprint' });
  }
};

export const startSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ProjectSprint.startSprint(id);
    if (!updated) {
      return res.status(404).json({ error: 'Sprint not found' });
    }
    res.json({ success: true, sprint: updated });
  } catch (error) {
    console.error('startSprint error:', error);
    res.status(500).json({ error: 'Failed to start sprint' });
  }
};

export const completeSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const { actual_velocity } = req.body;
    const updated = await ProjectSprint.completeSprint(id, parseInt(actual_velocity || 0, 10));
    if (!updated) {
      return res.status(404).json({ error: 'Sprint not found' });
    }
    res.json({ success: true, sprint: updated });
  } catch (error) {
    console.error('completeSprint error:', error);
    res.status(500).json({ error: 'Failed to complete sprint' });
  }
};

// ==========================================
// 4. PROJECT FILES
// ==========================================

export const listFiles = async (req, res) => {
  try {
    const { project_id, category } = req.query;
    const files = await ProjectFile.list({ project_id, category });
    res.json({ success: true, files });
  } catch (error) {
    console.error('listFiles error:', error);
    res.status(500).json({ error: 'Failed to fetch project files' });
  }
};

export const createFile = async (req, res) => {
  try {
    const { project_id, file_name, file_url, file_size_bytes, mime_type, version, category } = req.body;
    if (!project_id || !file_name || !file_url) {
      return res.status(400).json({ error: 'project_id, file_name, and file_url are required' });
    }

    const result = await ProjectFile.create({
      project_id,
      uploaded_by: req.user.id,
      file_name,
      file_url,
      file_size_bytes: parseInt(file_size_bytes || 0, 10),
      mime_type: mime_type || 'application/octet-stream',
      version: version || '1.0',
      category: category || 'SPECIFICATION'
    });

    const file = await ProjectFile.findById(result.id);
    res.status(201).json({ success: true, file });
  } catch (error) {
    console.error('createFile error:', error);
    res.status(500).json({ error: 'Failed to record project file' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    await ProjectFile.delete(id);
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('deleteFile error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

// ==========================================
// 5. PROJECT EXPENSES
// ==========================================

export const listExpenses = async (req, res) => {
  try {
    const { project_id, status } = req.query;
    const expenses = await ProjectExpense.list({ project_id, status });
    const summary = await ProjectExpense.getSummary(project_id);
    res.json({ success: true, expenses, summary });
  } catch (error) {
    console.error('listExpenses error:', error);
    res.status(500).json({ error: 'Failed to fetch project expenses' });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { project_id, category, description, amount, currency, expense_date, receipt_url, is_billable } = req.body;
    if (!project_id || !category || !description || !amount || !expense_date) {
      return res.status(400).json({ error: 'project_id, category, description, amount, and expense_date are required' });
    }

    const result = await ProjectExpense.create({
      project_id,
      logged_by: req.user.id,
      category,
      description,
      amount: parseFloat(amount),
      currency: currency || 'INR',
      expense_date,
      receipt_url,
      is_billable: is_billable !== undefined ? is_billable : true
    });

    const expense = await ProjectExpense.findById(result.id);
    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error('createExpense error:', error);
    res.status(500).json({ error: 'Failed to record expense' });
  }
};

export const approveExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ProjectExpense.approve(id, req.user.id);
    if (!updated) {
      return res.status(404).json({ error: 'Expense record not found' });
    }
    res.json({ success: true, expense: updated });
  } catch (error) {
    console.error('approveExpense error:', error);
    res.status(500).json({ error: 'Failed to approve expense' });
  }
};

export const rejectExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ProjectExpense.reject(id, req.user.id);
    if (!updated) {
      return res.status(404).json({ error: 'Expense record not found' });
    }
    res.json({ success: true, expense: updated });
  } catch (error) {
    console.error('rejectExpense error:', error);
    res.status(500).json({ error: 'Failed to reject expense' });
  }
};

// ==========================================
// 6. PERFORMANCE KPIS
// ==========================================

export const getPerformanceKPIs = async (req, res) => {
  try {
    const [projectCounts] = await pool.execute(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_projects
      FROM student_projects
    `);

    const [milestoneStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_milestones,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status = 'DELAYED' THEN 1 ELSE 0 END) as delayed_count
      FROM project_milestones
    `);

    const [expenseSum] = await pool.execute(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN is_billable = TRUE THEN amount ELSE 0 END), 0) as billable
      FROM project_expenses
    `);

    const totalMilestones = milestoneStats[0].total_milestones || 1;
    const completedMilestones = milestoneStats[0].completed_count || 0;
    const onTimeDeliveryRate = Math.round((completedMilestones / totalMilestones) * 100);

    res.json({
      success: true,
      kpis: {
        portfolio: projectCounts[0],
        onTimeDeliveryRate: `${onTimeDeliveryRate}%`,
        milestoneStats: milestoneStats[0],
        financials: expenseSum[0],
        teamVelocityAverage: 38
      }
    });
  } catch (error) {
    console.error('getPerformanceKPIs error:', error);
    res.status(500).json({ error: 'Failed to load performance metrics' });
  }
};
