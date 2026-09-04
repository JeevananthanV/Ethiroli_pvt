import crypto from 'crypto';
import pool from '../config/database.js';

export default class JobBoardPost {
  static async create({ job_id, platform, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO job_board_posts (id, job_id, platform, created_by)
       VALUES (?, ?, ?, ?)`,
      [id, job_id, platform, created_by]
    );
    return id;
  }

  static async list() {
    const [rows] = await pool.execute('SELECT * FROM job_board_posts');
    return rows;
  }
}