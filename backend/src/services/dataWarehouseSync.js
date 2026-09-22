import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const syncEntity = async (entityType, since) => {
  logger.info('Syncing entity to data warehouse', { entityType, since });

  try {
    const entityMap = {
      users: 'SELECT * FROM users WHERE updated_at >= ?',
      leads: 'SELECT * FROM leads WHERE updated_at >= ?',
      employees: 'SELECT * FROM employees WHERE updated_at >= ?',
      payroll: 'SELECT * FROM payroll WHERE updated_at >= ?',
      invoices: 'SELECT * FROM invoices WHERE updated_at >= ?',
      payments: 'SELECT * FROM payments WHERE updated_at >= ?'
    };

    const query = entityMap[entityType];
    if (!query) {
      throw new Error(`Unsupported entity type: ${entityType}`);
    }

    const [rows] = await pool.execute(query, [since || '1970-01-01']);

    const [result] = await pool.execute(
      'INSERT INTO data_warehouse_sync_log (entity_type, records_synced, synced_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [entityType, rows.length]
    );

    logger.info('Entity sync completed', { entityType, count: rows.length, logId: result.insertId });

    return {
      success: true,
      entityType,
      syncedCount: rows.length,
      logId: result.insertId
    };
  } catch (error) {
    logger.error('Entity sync failed', { entityType, error: error.message });
    throw error;
  }
};

export const fullSync = async () => {
  logger.info('Starting full data warehouse sync');

  try {
    const entityTypes = ['users', 'leads', 'employees', 'payroll', 'invoices', 'payments'];
    const results = [];

    for (const entityType of entityTypes) {
      try {
        const result = await syncEntity(entityType);
        results.push(result);
      } catch (error) {
        results.push({ entityType, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    logger.info('Full sync completed', { successCount, total: results.length });

    return {
      success: true,
      successCount,
      total: results.length,
      results
    };
  } catch (error) {
    logger.error('Full sync process failed', { error: error.message });
    throw error;
  }
};
