import crypto from 'crypto';
import pool from '../config/database.js';

export default class StudentProject {
  static async create({ student_id, name, description = null, github_repo_url, repo_owner = null, repo_name = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO student_projects (id, student_id, name, description, github_repo_url, repo_owner, repo_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, student_id, name, description, github_repo_url, repo_owner, repo_name]
    );
    return id;
  }

  static async list({ student_id } = {}) {
    let query = 'SELECT * FROM student_projects';
    const values = [];

    if (student_id) {
      query += ' WHERE student_id = ?';
      values.push(student_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}