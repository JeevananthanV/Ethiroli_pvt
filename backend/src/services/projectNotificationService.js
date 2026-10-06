import StudentProject from '../models/StudentProject.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToUser, broadcastToRole } from './socketService.js';
import { logger } from '../config/logger.js';

/**
 * Roles kept in the loop whenever project ownership changes. Admins and the
 * super admin get a governance-level copy; the delivery channel (in-app feed,
 * socket, push, email) is left to the callers below.
 */
const OVERSIGHT_ROLES = ['SUPER_ADMIN', 'ADMIN'];

const ROLE_HOME = {
  PROJECT_MANAGER: '/app/pm/projects',
  TUTOR: '/app/tutor/dashboard',
  EMPLOYEE: '/app/employee/dashboard',
  INTERN: '/app/intern/dashboard',
  ADMIN: '/app/admin/dashboard',
  SUPER_ADMIN: '/app/super-admin/dashboard',
  STUDENT: '/app/student/dashboard'
};

const roleHomeFor = (role) => ROLE_HOME[role] || '/app/pm/dashboard';

/**
 * Best-effort delivery of one project-assignment notice to a single user.
 *
 * Every channel is independent: a missing push_notifications table or an
 * unconfigured FCM key must never fail the request that created the project,
 * so each step is wrapped and failures are logged rather than thrown.
 */
const notifyUser = async (person, { title, body, projectId }) => {
  if (!person?.id) return;

  try {
    broadcastToUser(person.id, 'project_assigned', {
      title,
      body,
      project_id: projectId,
      project_name: body,
      url: roleHomeFor(person.role),
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    logger.error('Project assignment socket broadcast failed', {
      userId: person.id,
      error: err.message
    });
  }

  try {
    const { default: pool } = await import('../config/database.js');
    await pool.execute(
      `INSERT INTO push_notifications (user_id, title, body, data, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [person.id, title, body, JSON.stringify({ type: 'PROJECT_ASSIGNED', project_id: projectId })]
    );
  } catch (err) {
    // In-app inbox is a bonus, not a requirement.
    logger.warn('Project assignment inbox write skipped', {
      userId: person.id,
      error: err.message
    });
  }
};

const notifyRole = (role, payload) => {
  try {
    broadcastToRole(role, 'project_assigned', payload);
  } catch (err) {
    logger.error('Project assignment role broadcast failed', { role, error: err.message });
  }
};

/**
 * Announces that a project now has an owner.
 *
 * Recipients:
 *   - the responsible manager ("you have been made responsible")
 *   - every member of the assigned team
 *   - ADMIN + SUPER_ADMIN, for oversight
 *   - the acting user, so their own action is confirmed in their feed
 *   Everyone is de-duplicated, so a manager who is also on the team, or the
 *   creator assigning to themselves, is notified exactly once.
 *
 * @param {object}  opts
 * @param {string}  opts.action        'created' | 'assigned' | 'reassigned'
 * @param {object}  opts.project       Project row (post-insert/post-update).
 * @param {string[]} opts.assignedIds  Team member ids on the project.
 * @param {string}  opts.previousManagerId  Prior owner, for reassignment notices.
 * @param {object}  opts.actor         The authenticated user performing the change.
 */
export const notifyProjectAssignment = async ({
  action = 'created',
  project,
  assignedIds = [],
  previousManagerId = null,
  actor = {}
}) => {
  try {
    if (!project?.id) return;

    const managerId = project.manager_id || null;
    const teamIds = Array.isArray(project.assigned_user_ids)
      ? project.assigned_user_ids
      : [];
    const allIds = [managerId, ...teamIds, previousManagerId].filter(Boolean);
    const people = await StudentProject.resolvePeople(allIds);
    const projectName = project.name;

    const verb =
      action === 'created' ? 'has been created' :
      action === 'reassigned' ? 'is now assigned to you' :
      'has been assigned to you';

    // 1. The person responsible for finishing it.
    const manager = managerId ? people.get(managerId) : null;
    if (manager) {
      await notifyUser(manager, {
        title: action === 'created' ? 'New project assigned to you' : 'Project assigned to you',
        body: `"${projectName}" ${verb}`,
        projectId: project.id
      });
    }

    // 2. Everyone connected to the project team.
    for (const uid of teamIds) {
      if (uid === managerId) continue;
      const member = people.get(uid);
      if (!member) continue;
      await notifyUser(member, {
        title: 'You were added to a project',
        body: `You are on the team for "${projectName}".`,
        projectId: project.id
      });
    }

    // 3. Oversight roles.
    notifyRole('SUPER_ADMIN', {
      title: action === 'created' ? 'Project created' : 'Project ownership changed',
      body: `"${projectName}" — ${manager ? `responsible: ${manager.full_name}` : 'no owner set'}`,
      project_id: project.id,
      url: '/app/pm/projects',
      createdAt: new Date().toISOString()
    });
    notifyRole('ADMIN', {
      title: action === 'created' ? 'Project created' : 'Project ownership changed',
      body: `"${projectName}" — ${manager ? `responsible: ${manager.full_name}` : 'no owner set'}`,
      project_id: project.id,
      url: '/app/pm/projects',
      createdAt: new Date().toISOString()
    });

    // 4. Confirm to whoever performed the action, unless they were already
    //    notified above as the new owner, a team member, or the previous owner.
    const alreadyNotified = new Set([managerId, previousManagerId, ...teamIds].filter(Boolean));
    if (actor.id && !alreadyNotified.has(actor.id)) {
      await notifyUser(
        { id: actor.id, role: actor.role },
        {
          title: action === 'created' ? 'Project created' : 'Project updated',
          body: `"${projectName}" ${manager ? `assigned to ${manager.full_name}` : 'saved without an owner'}.`,
          projectId: project.id
        }
      );
    }

    await AuditLog.create({
      user_id: actor.id || null,
      action: 'PROJECT_ASSIGNMENT',
      entity_type: 'STUDENT_PROJECT',
      entity_id: project.id,
      new_value: {
        action,
        project_name: projectName,
        manager_id: managerId,
        assigned_user_ids: teamIds
      },
      ip_address: actor.ip || 'unknown',
      user_agent: actor.userAgent || 'unknown'
    });

    logger.info('Project assignment notified', {
      projectId: project.id,
      action,
      manager_id: managerId,
      assigned_count: teamIds.length
    });
  } catch (err) {
    // Notification trouble must never roll back or fail the project write.
    logger.error('Failed to dispatch project assignment notifications', {
      projectId: project?.id,
      error: err.message
    });
  }
};

export default { notifyProjectAssignment };
