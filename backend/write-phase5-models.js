import fs from 'fs';
import path from 'path';

const MODELS_DIR = path.join(process.cwd(), 'src', 'models');

function toPascalCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function writePayrollModel() {
  const code = `import crypto from 'crypto';
import pool from '../config/database.js';

export default class Payroll {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM payroll WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status = 'DRAFT' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO payroll (id, employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
      [id, employee_id, month_year, basic, hra, da, pf_employee, pf_employer, esi_employee, esi_employer, tds, gross_salary, net_salary, total_deductions, status]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.basic !== undefined) { queryParts.push('basic = ?'); values.push(updates.basic); }
    if (updates.hra !== undefined) { queryParts.push('hra = ?'); values.push(updates.hra); }
    if (updates.da !== undefined) { queryParts.push('da = ?'); values.push(updates.da); }
    if (updates.pf_employee !== undefined) { queryParts.push('pf_employee = ?'); values.push(updates.pf_employee); }
    if (updates.pf_employer !== undefined) { queryParts.push('pf_employer = ?'); values.push(updates.pf_employer); }
    if (updates.esi_employee !== undefined) { queryParts.push('esi_employee = ?'); values.push(updates.esi_employee); }
    if (updates.esi_employer !== undefined) { queryParts.push('esi_employer = ?'); values.push(updates.esi_employer); }
    if (updates.tds !== undefined) { queryParts.push('tds = ?'); values.push(updates.tds); }
    if (updates.gross_salary !== undefined) { queryParts.push('gross_salary = ?'); values.push(updates.gross_salary); }
    if (updates.net_salary !== undefined) { queryParts.push('net_salary = ?'); values.push(updates.net_salary); }
    if (updates.total_deductions !== undefined) { queryParts.push('total_deductions = ?'); values.push(updates.total_deductions); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.bank_transfer_ref !== undefined) { queryParts.push('bank_transfer_ref = ?'); values.push(updates.bank_transfer_ref); }
    if (updates.payslip_pdf_url !== undefined) { queryParts.push('payslip_pdf_url = ?'); values.push(updates.payslip_pdf_url); }
    if (updates.processed_by !== undefined) { queryParts.push('processed_by = ?'); values.push(updates.processed_by); }
    if (updates.processed_at !== undefined) { queryParts.push('processed_at = ?'); values.push(updates.processed_at); }
    if (updates.paid_at !== undefined) { queryParts.push('paid_at = ?'); values.push(updates.paid_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE payroll SET \${queryParts.join(', ')} WHERE id = ?\`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM payroll WHERE id = ?', [id]);
  }

  static async list({ employee_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM payroll WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY month_year DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ employee_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM payroll WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
`;
  const filePath = path.join(MODELS_DIR, 'Payroll.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writePerformanceReviewModel() {
  const code = `import crypto from 'crypto';
import pool from '../config/database.js';

export default class PerformanceReview {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      feedback: row.feedback ? JSON.parse(row.feedback) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM performance_reviews WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ employee_id, reviewer_id, review_date, rating, feedback, overall_comment, status = 'DRAFT' }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO performance_reviews (id, employee_id, reviewer_id, review_date, rating, feedback, overall_comment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,
      [id, employee_id, reviewer_id, review_date, rating, JSON.stringify(feedback), overall_comment, status]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.rating !== undefined) { queryParts.push('rating = ?'); values.push(updates.rating); }
    if (updates.feedback !== undefined) { queryParts.push('feedback = ?'); values.push(updates.feedback ? JSON.stringify(updates.feedback) : null); }
    if (updates.overall_comment !== undefined) { queryParts.push('overall_comment = ?'); values.push(updates.overall_comment); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.review_date !== undefined) { queryParts.push('review_date = ?'); values.push(updates.review_date); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE performance_reviews SET \${queryParts.join(', ')} WHERE id = ?\`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM performance_reviews WHERE id = ?', [id]);
  }

  static async list({ employee_id, reviewer_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM performance_reviews WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (reviewer_id) { query += ' AND reviewer_id = ?'; values.push(reviewer_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY review_date DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ employee_id, reviewer_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM performance_reviews WHERE 1=1';
    const values = [];

    if (employee_id) { query += ' AND employee_id = ?'; values.push(employee_id); }
    if (reviewer_id) { query += ' AND reviewer_id = ?'; values.push(reviewer_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
`;
  const filePath = path.join(MODELS_DIR, 'PerformanceReview.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeHolidayModel() {
  const code = `import crypto from 'crypto';
import pool from '../config/database.js';

export default class Holiday {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      restricted_to: row.restricted_to ? JSON.parse(row.restricted_to) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM holidays WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ name, date, is_restricted = false, restricted_to = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO holidays (id, name, date, is_restricted, restricted_to) VALUES (?, ?, ?, ?, ?)\`,
      [id, name, date, is_restricted, restricted_to ? JSON.stringify(restricted_to) : null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.date !== undefined) { queryParts.push('date = ?'); values.push(updates.date); }
    if (updates.is_restricted !== undefined) { queryParts.push('is_restricted = ?'); values.push(updates.is_restricted); }
    if (updates.restricted_to !== undefined) { queryParts.push('restricted_to = ?'); values.push(updates.restricted_to ? JSON.stringify(updates.restricted_to) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE holidays SET \${queryParts.join(', ')} WHERE id = ?\`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM holidays WHERE id = ?', [id]);
  }

  static async list({ start_date, end_date, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM holidays WHERE 1=1';
    const values = [];

    if (start_date && end_date) { query += ' AND date BETWEEN ? AND ?'; values.push(start_date, end_date); }

    query += ' ORDER BY date ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ start_date, end_date } = {}) {
    let query = 'SELECT COUNT(*) as total FROM holidays WHERE 1=1';
    const values = [];

    if (start_date && end_date) { query += ' AND date BETWEEN ? AND ?'; values.push(start_date, end_date); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
`;
  const filePath = path.join(MODELS_DIR, 'Holiday.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeWorkflowModel() {
  const code = `import crypto from 'crypto';
import pool from '../config/database.js';

export default class Workflow {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM workflows WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ name, entity_type, description = null, is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO workflows (id, name, entity_type, description, is_active) VALUES (?, ?, ?, ?, ?)\`,
      [id, name, entity_type, description, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE workflows SET \${queryParts.join(', ')} WHERE id = ?\`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM workflows WHERE id = ?', [id]);
  }

  static async list({ is_active, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM workflows WHERE 1=1';
    const values = [];

    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM workflows WHERE 1=1';
    const values = [];

    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
`;
  const filePath = path.join(MODELS_DIR, 'Workflow.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeApprovalChainModel() {
  const code = `import crypto from 'crypto';
import pool from '../config/database.js';

export default class ApprovalChain {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      approval_condition: row.approval_condition ? JSON.parse(row.approval_condition) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM approval_chains WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ workflow_id, step_order, approver_role, approval_condition = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO approval_chains (id, workflow_id, step_order, approver_role, approval_condition) VALUES (?, ?, ?, ?, ?)\`,
      [id, workflow_id, step_order, approver_role, approval_condition ? JSON.stringify(approval_condition) : null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.step_order !== undefined) { queryParts.push('step_order = ?'); values.push(updates.step_order); }
    if (updates.approver_role !== undefined) { queryParts.push('approver_role = ?'); values.push(updates.approver_role); }
    if (updates.approval_condition !== undefined) { queryParts.push('approval_condition = ?'); values.push(updates.approval_condition ? JSON.stringify(updates.approval_condition) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE approval_chains SET \${queryParts.join(', ')} WHERE id = ?\`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM approval_chains WHERE id = ?', [id]);
  }

  static async list({ workflow_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM approval_chains WHERE 1=1';
    const values = [];

    if (workflow_id) { query += ' AND workflow_id = ?'; values.push(workflow_id); }

    query += ' ORDER BY step_order ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ workflow_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM approval_chains WHERE 1=1';
    const values = [];

    if (workflow_id) { query += ' AND workflow_id = ?'; values.push(workflow_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async listByWorkflowId(workflowId) {
    return this.list({ workflow_id: workflowId, limit: 1000 });
  }
}
`;
  const filePath = path.join(MODELS_DIR, 'ApprovalChain.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeApprovalInstanceModel() {
  const code = `import crypto from 'crypto';
import pool from '../config/database.js';

export default class ApprovalInstance {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM approval_instances WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ chain_id, entity_type, entity_id, current_step = 1, status = 'PENDING', initiated_by, metadata = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO approval_instances (id, chain_id, entity_type, entity_id, current_step, status, initiated_by, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,
      [id, chain_id, entity_type, entity_id, current_step, status, initiated_by, metadata ? JSON.stringify(metadata) : null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.current_step !== undefined) { queryParts.push('current_step = ?'); values.push(updates.current_step); }
    if (updates.status !== undefined) { queryParts.push('status = ?'); values.push(updates.status); }
    if (updates.metadata !== undefined) { queryParts.push('metadata = ?'); values.push(updates.metadata ? JSON.stringify(updates.metadata) : null); }
    if (updates.completed_at !== undefined) { queryParts.push('completed_at = ?'); values.push(updates.completed_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE approval_instances SET \${queryParts.join(', ')} WHERE id = ?\`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM approval_instances WHERE id = ?', [id]);
  }

  static async list({ entity_type, entity_id, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM approval_instances WHERE 1=1';
    const values = [];

    if (entity_type) { query += ' AND entity_type = ?'; values.push(entity_type); }
    if (entity_id) { query += ' AND entity_id = ?'; values.push(entity_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ entity_type, entity_id, status } = {}) {
    let query = 'SELECT COUNT(*) as total FROM approval_instances WHERE 1=1';
    const values = [];

    if (entity_type) { query += ' AND entity_type = ?'; values.push(entity_type); }
    if (entity_id) { query += ' AND entity_id = ?'; values.push(entity_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
`;
  const filePath = path.join(MODELS_DIR, 'ApprovalInstance.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeCompanySettingModel() {
  const code = `import crypto from 'crypto';
import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class CompanySetting {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      gstin: row.gstin ? decrypt(row.gstin) : null,
      pan: row.pan ? decrypt(row.pan) : null,
      bank_account_number: row.bank_account_number ? decrypt(row.bank_account_number) : null,
      bank_ifsc: row.bank_ifsc ? decrypt(row.bank_ifsc) : null,
      bank_name: row.bank_name ? decrypt(row.bank_name) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM company_settings WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByTenantId(tenant_id) {
    const [rows] = await pool.execute('SELECT * FROM company_settings WHERE tenant_id = ?', [tenant_id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, company_name, gstin = null, pan = null, address = null, phone = null, email = null, logo_url = null, bank_account_number = null, bank_ifsc = null, bank_name = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO company_settings (id, tenant_id, company_name, gstin, pan, address, phone, email, logo_url, bank_account_number, bank_ifsc, bank_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
      [id, tenant_id, company_name, gstin ? encrypt(gstin) : null, pan ? encrypt(pan) : null, address, phone, email, logo_url, bank_account_number ? encrypt(bank_account_number) : null, bank_ifsc ? encrypt(bank_ifsc) : null, bank_name ? encrypt(bank_name) : null]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.company_name !== undefined) { queryParts.push('company_name = ?'); values.push(updates.company_name); }
    if (updates.gstin !== undefined) { queryParts.push('gstin = ?'); values.push(updates.gstin ? encrypt(updates.gstin) : null); }
    if (updates.pan !== undefined) { queryParts.push('pan = ?'); values.push(updates.pan ? encrypt(updates.pan) : null); }
    if (updates.address !== undefined) { queryParts.push('address = ?'); values.push(updates.address); }
    if (updates.phone !== undefined) { queryParts.push('phone = ?'); values.push(updates.phone); }
    if (updates.email !== undefined) { queryParts.push('email = ?'); values.push(updates.email); }
    if (updates.logo_url !== undefined) { queryParts.push('logo_url = ?'); values.push(updates.logo_url); }
    if (updates.bank_account_number !== undefined) { queryParts.push('bank_account_number = ?'); values.push(updates.bank_account_number ? encrypt(updates.bank_account_number) : null); }
    if (updates.bank_ifsc !== undefined) { queryParts.push('bank_ifsc = ?'); values.push(updates.bank_ifsc ? encrypt(updates.bank_ifsc) : null); }
    if (updates.bank_name !== undefined) { queryParts.push('bank_name = ?'); values.push(updates.bank_name ? encrypt(updates.bank_name) : null); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE company_settings SET \${queryParts.join(', ')} WHERE id = ?\`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM company_settings WHERE id = ?', [id]);
  }

  static async list({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.execute('SELECT * FROM company_settings LIMIT ? OFFSET ?', [limit, offset]);
    return rows.map(row => this.format(row));
  }

  static async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM company_settings');
    return rows[0].total;
  }
}
`;
  const filePath = path.join(MODELS_DIR, 'CompanySetting.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeCalendarEventModel() {
  const code = `import crypto from 'crypto';
import pool from '../config/database.js';

export default class CalendarEvent {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      assigned_users: row.assigned_users ? JSON.parse(row.assigned_users) : []
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM calendar_events WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ title, description = null, event_type, start_time, end_time, created_by, assigned_users = [], location = null, is_all_day = false, recurrence_rule = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      \`INSERT INTO calendar_events (id, title, description, event_type, start_time, end_time, created_by, assigned_users, location, is_all_day, recurrence_rule)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
      [id, title, description, event_type, start_time, end_time, created_by, JSON.stringify(assigned_users), location, is_all_day, recurrence_rule]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.title !== undefined) { queryParts.push('title = ?'); values.push(updates.title); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.event_type !== undefined) { queryParts.push('event_type = ?'); values.push(updates.event_type); }
    if (updates.start_time !== undefined) { queryParts.push('start_time = ?'); values.push(updates.start_time); }
    if (updates.end_time !== undefined) { queryParts.push('end_time = ?'); values.push(updates.end_time); }
    if (updates.assigned_users !== undefined) { queryParts.push('assigned_users = ?'); values.push(JSON.stringify(updates.assigned_users)); }
    if (updates.location !== undefined) { queryParts.push('location = ?'); values.push(updates.location); }
    if (updates.is_all_day !== undefined) { queryParts.push('is_all_day = ?'); values.push(updates.is_all_day); }
    if (updates.recurrence_rule !== undefined) { queryParts.push('recurrence_rule = ?'); values.push(updates.recurrence_rule); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(\`UPDATE calendar_events SET \${queryParts.join(', ')} WHERE id = ?\`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM calendar_events WHERE id = ?', [id]);
  }

  static async list({ start_date, end_date, event_type, created_by, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM calendar_events WHERE 1=1';
    const values = [];

    if (start_date && end_date) { query += ' AND start_time BETWEEN ? AND ?'; values.push(start_date, end_date); }
    if (event_type) { query += ' AND event_type = ?'; values.push(event_type); }
    if (created_by) { query += ' AND created_by = ?'; values.push(created_by); }

    query += ' ORDER BY start_time ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ start_date, end_date, event_type, created_by } = {}) {
    let query = 'SELECT COUNT(*) as total FROM calendar_events WHERE 1=1';
    const values = [];

    if (start_date && end_date) { query += ' AND start_time BETWEEN ? AND ?'; values.push(start_date, end_date); }
    if (event_type) { query += ' AND event_type = ?'; values.push(event_type); }
    if (created_by) { query += ' AND created_by = ?'; values.push(created_by); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
`;
  const filePath = path.join(MODELS_DIR, 'CalendarEvent.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

writePayrollModel();
writePerformanceReviewModel();
writeHolidayModel();
writeWorkflowModel();
writeApprovalChainModel();
writeApprovalInstanceModel();
writeCompanySettingModel();
writeCalendarEventModel();
