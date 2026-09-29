import pool from '../../config/database.js';

export default class ProgramModule {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async create({ program_id, module_id, module_order, allocated_days, start_day, end_day, is_core }) {
    const id = crypto.randomUUID();
    await pool.execute(
      'INSERT INTO program_modules (id, program_id, module_id, module_order, allocated_days, start_day, end_day, is_core) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, program_id, module_id, module_order, allocated_days, start_day, end_day, is_core ? 1 : 0]
    );
    return id;
  }

  static async delete(id) {
    await pool.execute('DELETE FROM program_modules WHERE id = ?', [id]);
  }

  static async listByProgramId(programId) {
    const [rows] = await pool.execute(
      'SELECT * FROM program_modules WHERE program_id = ? ORDER BY module_order',
      [programId]
    );
    return rows.map(row => this.format(row));
  }

  static async reorder(programId, orderedIds) {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (let i = 0; i < orderedIds.length; i++) {
        await conn.execute('UPDATE program_modules SET module_order = ? WHERE module_id = ? AND program_id = ?', [i + 1, orderedIds[i], programId]);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}
