import crypto from 'node:crypto';
import pool from '../config/database.js';
import { success, error } from '../utils/response.js';
import { logger } from '../config/logger.js';
import { broadcastToRole } from '../socket/index.js';

/**
 * Promotes an Intern to a full-time Employee in an atomic transaction
 */
export const promoteInternToEmployee = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id: internId } = req.params;
    const { 
      department = 'Engineering', 
      designation = 'Junior Software Engineer', 
      employee_code = `EMP-${Date.now().toString().slice(-4)}` 
    } = req.body;

    // Find intern record
    const [internRows] = await connection.query(
      `SELECT i.*, u.full_name, u.email 
       FROM interns i 
       JOIN users u ON i.user_id = u.id 
       WHERE i.id = ? OR i.user_id = ?`,
      [internId, internId]
    );

    if (internRows.length === 0) {
      return error(res, 404, 'Intern record not found');
    }

    const intern = internRows[0];
    const userId = intern.user_id;

    await connection.beginTransaction();

    // 1. Update User Role to EMPLOYEE
    await connection.query(
      `UPDATE users SET role = 'EMPLOYEE', updated_at = NOW() WHERE id = ?`,
      [userId]
    );

    // 2. Check if already has an employee record or create one
    const employeeId = crypto.randomUUID();
    const [existingEmp] = await connection.query(`SELECT id FROM employees WHERE user_id = ?`, [userId]);

    if (existingEmp.length > 0) {
      await connection.query(
        `UPDATE employees 
         SET department = ?, designation = ?, employee_code = ?, updated_at = NOW() 
         WHERE user_id = ?`,
        [department, designation, employee_code, userId]
      );
    } else {
      await connection.query(
        `INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
         VALUES (?, ?, ?, ?, ?, CURDATE())`,
        [employeeId, userId, employee_code, department, designation]
      );
    }

    // 3. Log Audit
    await connection.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value, ip_address)
       VALUES (?, 'PROMOTE_INTERN_TO_EMPLOYEE', 'USER', ?, ?, ?)`,
      [
        req.user?.id || null,
        userId,
        JSON.stringify({
          internId: intern.id,
          employee_code,
          department,
          designation,
          previousRole: 'INTERN',
          newRole: 'EMPLOYEE'
        }),
        req.ip || '127.0.0.1'
      ]
    );

    await connection.commit();

    // 4. Broadcast to HR, Admin, and Employee rooms
    broadcastToRole('HR', 'intern_promoted', {
      userId,
      name: intern.full_name,
      employee_code,
      department,
      designation
    });

    broadcastToRole('ADMIN', 'intern_promoted', {
      userId,
      name: intern.full_name,
      department,
      designation
    });

    logger.info('Intern promoted to employee successfully', { userId, employee_code });

    return success(res, 200, {
      userId,
      name: intern.full_name,
      employee_code,
      department,
      designation,
      newRole: 'EMPLOYEE'
    }, `Intern ${intern.full_name} promoted to full-time Employee successfully`);

  } catch (err) {
    await connection.rollback();
    logger.error('Failed to promote intern', { error: err.message });
    next(err);
  } finally {
    connection.release();
  }
};

/**
 * Returns comprehensive governance summary across all operational roles
 */
export const getGovernanceSummary = async (req, res, next) => {
  try {
    const [roleCounts] = await pool.query(
      `SELECT role, count(*) as count FROM users GROUP BY role`
    );

    const rolesMap = {};
    roleCounts.forEach((r) => {
      rolesMap[r.role] = r.count;
    });

    const [configs] = await pool.query(
      `SELECT config_key, config_value FROM system_configs`
    );
    const [company] = await pool.query(
      `SELECT company_name, email, phone, currency FROM company_settings LIMIT 1`
    );

    return success(res, 200, {
      roleDistribution: rolesMap,
      totalUsers: Object.values(rolesMap).reduce((a, b) => a + b, 0),
      systemConfigs: configs,
      companySettings: company[0] || null,
      timestamp: new Date().toISOString()
    }, 'Governance summary retrieved');
  } catch (err) {
    logger.error('Failed to get governance summary', { error: err.message });
    next(err);
  }
};
