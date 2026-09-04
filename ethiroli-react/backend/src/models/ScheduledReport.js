import crypto from 'crypto';
import pool from '../config/database.js';

export default class ScheduledReport {
  static async create({ report_definition_id, tenant_id, frequency, format = 'PDF', recipient_emails, next_send_at }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO scheduled_reports (id, report_definition_id, tenant_id, frequency, format, recipient_emails, next_send_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, report_definition_id, tenant_id, frequency, format, JSON.stringify(recipient_emails), next_send_at]
    );
    return id;
  }
}