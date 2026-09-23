import crypto from 'node:crypto';
import pool from '../config/database.js';
import { success, error } from '../utils/response.js';
import { logger } from '../config/logger.js';
import { broadcastToRole } from '../socket/index.js';

/**
 * Reassigns an absent or on-leave tutor's full workload (batches, calendar events, tasks)
 * to a verified substitute instructor in an atomic transaction.
 */
export const reassignTutorWorkload = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id: absentTutorId } = req.params;
    const { 
      substituteTutorId, 
      reassignBatches = true, 
      reassignCalendarEvents = true, 
      reassignTasks = true,
      reason = 'Emergency medical / sudden leave substitution'
    } = req.body;

    if (!substituteTutorId) {
      return error(res, 400, 'substituteTutorId is required');
    }

    if (absentTutorId === substituteTutorId) {
      return error(res, 400, 'Substitute tutor must be different from the absent tutor');
    }

    // Verify both users exist
    const [tutors] = await connection.query(
      `SELECT id, full_name, email, role FROM users WHERE id IN (?, ?)`,
      [absentTutorId, substituteTutorId]
    );

    const absentTutor = tutors.find(t => t.id === absentTutorId);
    const substituteTutor = tutors.find(t => t.id === substituteTutorId);

    if (!absentTutor) {
      return error(res, 404, 'Absent tutor profile not found');
    }
    if (!substituteTutor) {
      return error(res, 404, 'Substitute tutor profile not found');
    }

    await connection.beginTransaction();

    let batchesReassigned = 0;
    let calendarEventsReassigned = 0;
    let tasksReassigned = 0;

    // 1. Reassign active Course Batches
    if (reassignBatches) {
      const [batchRes] = await connection.query(
        `UPDATE batches SET tutor_id = ? WHERE tutor_id = ?`,
        [substituteTutorId, absentTutorId]
      );
      batchesReassigned = batchRes.affectedRows || 0;
    }

    // 2. Reassign future Calendar Events
    if (reassignCalendarEvents) {
      const [calRes] = await connection.query(
        `UPDATE calendar_events 
         SET created_by = ? 
         WHERE created_by = ? AND start_time >= NOW()`,
        [substituteTutorId, absentTutorId]
      );
      calendarEventsReassigned = calRes.affectedRows || 0;
    }

    // 3. Reassign pending Tasks
    if (reassignTasks) {
      const [taskRes] = await connection.query(
        `UPDATE tasks 
         SET assigned_to = ? 
         WHERE assigned_to = ? AND status NOT IN ('COMPLETED', 'CANCELLED')`,
        [substituteTutorId, absentTutorId]
      );
      tasksReassigned = taskRes.affectedRows || 0;
    }

    // 4. Record Audit Log
    await connection.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, ip_address)
       VALUES (?, 'TUTOR_WORKLOAD_REASSIGNED', 'TUTOR', ?, ?, ?)`,
      [
        req.user?.id || null,
        absentTutorId,
        JSON.stringify({
          absentTutor: absentTutor.full_name,
          substituteTutor: substituteTutor.full_name,
          batchesReassigned,
          calendarEventsReassigned,
          tasksReassigned,
          reason
        }),
        req.ip || '127.0.0.1'
      ]
    );

    await connection.commit();

    // 5. Broadcast real-time announcements to Student, Intern, and Tutor rooms
    broadcastToRole('STUDENT', 'tutor_substitute_assigned', {
      previousTutor: absentTutor.full_name,
      substituteTutor: substituteTutor.full_name,
      batchesReassigned,
      notice: 'A substitute instructor has been assigned to lead upcoming lectures and project evaluations.'
    });

    broadcastToRole('INTERN', 'mentor_substitute_assigned', {
      previousMentor: absentTutor.full_name,
      substituteMentor: substituteTutor.full_name,
      tasksReassigned
    });

    broadcastToRole('TUTOR', 'workload_handover_complete', {
      substituteTutorId,
      batchesReassigned,
      calendarEventsReassigned
    });

    logger.info('Tutor workload reassigned successfully', {
      absentTutorId,
      substituteTutorId,
      batchesReassigned,
      calendarEventsReassigned,
      tasksReassigned
    });

    return success(res, 200, {
      absentTutor: { id: absentTutor.id, name: absentTutor.full_name },
      substituteTutor: { id: substituteTutor.id, name: substituteTutor.full_name },
      batchesReassigned,
      calendarEventsReassigned,
      tasksReassigned,
      reason
    }, 'Tutor workload transferred and synchronized successfully');

  } catch (err) {
    await connection.rollback();
    logger.error('Failed to reassign tutor workload', { error: err.message });
    next(err);
  } finally {
    connection.release();
  }
};
