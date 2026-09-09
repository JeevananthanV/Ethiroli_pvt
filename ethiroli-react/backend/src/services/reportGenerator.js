import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const generateReport = async (type, filters = {}, format = 'json') => {
  logger.info('Generating report', { type, format, filters });

  const reportGenerators = {
    leads: generateLeadsReport,
    employees: generateEmployeesReport,
    attendance: generateAttendanceReport,
    payroll: generatePayrollReport,
    invoices: generateInvoicesReport,
    payments: generatePaymentsReport,
    enrollments: generateEnrollmentsReport
  };

  const generator = reportGenerators[type];
  if (!generator) {
    throw new Error(`Unsupported report type: ${type}`);
  }

  const data = await generator(filters);

  if (format === 'csv') {
    return convertToCSV(data);
  }

  if (format === 'pdf') {
    const { generateReportPDF } = await import('./pdfGenerator.js');
    return generateReportPDF({ type, title: `${type} Report`, rows: data.rows || [] });
  }

  return data;
};

const generateLeadsReport = async (filters) => {
  let query = 'SELECT * FROM leads WHERE 1=1';
  const values = [];

  if (filters.assigned_to) { query += ' AND assigned_to = ?'; values.push(filters.assigned_to); }
  if (filters.status) { query += ' AND status = ?'; values.push(filters.status); }
  if (filters.start_date) { query += ' AND created_at >= ?'; values.push(filters.start_date); }
  if (filters.end_date) { query += ' AND created_at <= ?'; values.push(filters.end_date); }

  query += ' ORDER BY created_at DESC';
  if (filters.limit) query += ' LIMIT ?'; values.push(filters.limit);
  if (filters.offset) query += ' OFFSET ?'; values.push(filters.offset);

  const [rows] = await pool.execute(query, values);
  return { success: true, data: rows, total: rows.length };
};

const generateEmployeesReport = async (filters) => {
  let query = 'SELECT * FROM employees WHERE 1=1';
  const values = [];

  if (filters.department) { query += ' AND department = ?'; values.push(filters.department); }
  if (filters.status) { query += ' AND status = ?'; values.push(filters.status); }

  query += ' ORDER BY created_at DESC';
  if (filters.limit) query += ' LIMIT ?'; values.push(filters.limit);

  const [rows] = await pool.execute(query, values);
  return { success: true, data: rows, total: rows.length };
};

const generateAttendanceReport = async (filters) => {
  let query = 'SELECT * FROM attendance WHERE 1=1';
  const values = [];

  if (filters.employee_id) { query += ' AND employee_id = ?'; values.push(filters.employee_id); }
  if (filters.start_date) { query += ' AND date >= ?'; values.push(filters.start_date); }
  if (filters.end_date) { query += ' AND date <= ?'; values.push(filters.end_date); }

  query += ' ORDER BY date DESC';
  if (filters.limit) query += ' LIMIT ?'; values.push(filters.limit);

  const [rows] = await pool.execute(query, values);
  return { success: true, data: rows, total: rows.length };
};

const generatePayrollReport = async (filters) => {
  let query = 'SELECT * FROM payroll WHERE 1=1';
  const values = [];

  if (filters.employee_id) { query += ' AND employee_id = ?'; values.push(filters.employee_id); }
  if (filters.month) { query += ' AND month = ?'; values.push(filters.month); }
  if (filters.year) { query += ' AND year = ?'; values.push(filters.year); }

  query += ' ORDER BY created_at DESC';
  if (filters.limit) query += ' LIMIT ?'; values.push(filters.limit);

  const [rows] = await pool.execute(query, values);
  return { success: true, data: rows, total: rows.length };
};

const generateInvoicesReport = async (filters) => {
  let query = 'SELECT * FROM invoices WHERE 1=1';
  const values = [];

  if (filters.status) { query += ' AND status = ?'; values.push(filters.status); }
  if (filters.start_date) { query += ' AND issue_date >= ?'; values.push(filters.start_date); }
  if (filters.end_date) { query += ' AND issue_date <= ?'; values.push(filters.end_date); }

  query += ' ORDER BY created_at DESC';
  if (filters.limit) query += ' LIMIT ?'; values.push(filters.limit);

  const [rows] = await pool.execute(query, values);
  return { success: true, data: rows, total: rows.length };
};

const generatePaymentsReport = async (filters) => {
  let query = 'SELECT * FROM payments WHERE 1=1';
  const values = [];

  if (filters.method) { query += ' AND method = ?'; values.push(filters.method); }
  if (filters.status) { query += ' AND status = ?'; values.push(filters.status); }
  if (filters.start_date) { query += ' AND created_at >= ?'; values.push(filters.start_date); }
  if (filters.end_date) { query += ' AND created_at <= ?'; values.push(filters.end_date); }

  query += ' ORDER BY created_at DESC';
  if (filters.limit) query += ' LIMIT ?'; values.push(filters.limit);

  const [rows] = await pool.execute(query, values);
  return { success: true, data: rows, total: rows.length };
};

const generateEnrollmentsReport = async (filters) => {
  let query = 'SELECT * FROM enrollments WHERE 1=1';
  const values = [];

  if (filters.course_id) { query += ' AND course_id = ?'; values.push(filters.course_id); }
  if (filters.student_id) { query += ' AND student_id = ?'; values.push(filters.student_id); }
  if (filters.status) { query += ' AND status = ?'; values.push(filters.status); }

  query += ' ORDER BY created_at DESC';
  if (filters.limit) query += ' LIMIT ?'; values.push(filters.limit);

  const [rows] = await pool.execute(query, values);
  return { success: true, data: rows, total: rows.length };
};

const convertToCSV = (data) => {
  if (!data.data || data.data.length === 0) {
    return { success: true, csv: '', filename: `${Date.now()}.csv` };
  }

  const headers = Object.keys(data.data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data.data) {
    const values = headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    });
    csvRows.push(values.join(','));
  }

  return { success: true, csv: csvRows.join('\n'), filename: `${Date.now()}.csv` };
};

export const scheduleReport = async (reportDef, schedule) => {
  logger.info('Scheduling report', { reportDef, schedule });

  try {
    const [result] = await pool.execute(
      `INSERT INTO scheduled_reports (name, type, filters, format, schedule, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        reportDef.name,
        reportDef.type,
        JSON.stringify(reportDef.filters || {}),
        reportDef.format || 'json',
        schedule || 'manual',
        reportDef.created_by
      ]
    );

    return { success: true, scheduledReportId: result.insertId };
  } catch (error) {
    logger.error('Failed to schedule report', { error: error.message });
    throw error;
  }
};
