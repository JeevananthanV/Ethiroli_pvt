import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const inferInquiryCategory = (subject = '', message = '') => {
  const text = `${subject || ''} ${message || ''}`.toLowerCase();
  if (text.includes('course') || text.includes('fee') || text.includes('learn') || text.includes('training') || text.includes('syllabus') || text.includes('batch') || text.includes('mern') || text.includes('full stack') || text.includes('react') || text.includes('python')) {
    return 'Course Enquiry';
  }
  if (text.includes('intern') || text.includes('semester') || text.includes('college') || text.includes('student') || text.includes('summer')) {
    return 'Internship';
  }
  if (text.includes('job') || text.includes('developer') || text.includes('engineer') || text.includes('devops') || text.includes('architect') || text.includes('hire') || text.includes('hiring') || text.includes('career') || text.includes('resume') || text.includes('opening')) {
    return 'Job Enquiry';
  }
  return 'General';
};

export const listContactMessages = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM contact_messages ORDER BY created_at DESC'
  );

  const formatted = rows.map((r) => {
    const category = (r.category && r.category !== 'General') ? r.category : inferInquiryCategory(r.subject, r.message);
    const status = r.status || (r.is_read ? 'PROCESSED' : 'NEW');
    const submitted_at = r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '';
    return {
      ...r,
      sender_name: r.name,
      category,
      status,
      submitted_at
    };
  });

  return success(res, 200, formatted, 'Contact messages retrieved successfully', {
    total: formatted.length
  });
});

export const getContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.execute('SELECT * FROM contact_messages WHERE id = ?', [id]);
  if (rows.length === 0) {
    throw new NotFoundError('Contact message not found');
  }
  return success(res, 200, rows[0], 'Contact message retrieved');
});

export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email) {
    throw new ValidationError('Name and email are required');
  }

  const [result] = await pool.execute(
    `INSERT INTO contact_messages (name, phone, email, subject, message, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [name, phone || null, email, subject || 'Website Inquiry', message || '']
  );

  const newMessage = {
    id: result.insertId,
    name,
    email,
    phone: phone || null,
    subject: subject || 'Website Inquiry',
    message: message || '',
    created_at: new Date()
  };

  // Notify HR and Admin in real-time
  broadcastToRole('HR', 'new_contact_message', newMessage);
  broadcastToRole('ADMIN', 'new_contact_message', newMessage);
  broadcastToRole('SUPER_ADMIN', 'new_contact_message', newMessage);

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CREATE_CONTACT_MESSAGE',
    entity_type: 'CONTACT_MESSAGE',
    entity_id: String(result.insertId),
    new_value: newMessage,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 201, newMessage, 'Thank you! Your message has been received.');
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new NotFoundError('Contact message not found');
  }

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'DELETE_CONTACT_MESSAGE',
    entity_type: 'CONTACT_MESSAGE',
    entity_id: String(id),
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { id }, 'Contact message deleted successfully');
});

export const convertInquiryToLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { leadType, name, email, phone } = req.body;

  const [rows] = await pool.execute('SELECT * FROM contact_messages WHERE id = ?', [id]).catch(() => [[]]);
  const msg = rows && rows[0] ? rows[0] : null;

  const contactName = name || msg?.name || 'Inquiry Contact';
  const contactEmail = email || msg?.email || `inquiry.${id}@ethiroli.net`;
  const contactPhone = phone || msg?.phone || '';

  if (leadType === 'Student Lead') {
    // Insert into students / leads
    try {
      await pool.execute(
        `INSERT INTO users (full_name, email, phone, role, status, created_at)
         VALUES (?, ?, ?, 'STUDENT', 'ACTIVE', NOW())`,
        [contactName, contactEmail, contactPhone]
      );
    } catch (_) {}
  } else if (leadType === 'Candidate') {
    // Insert into career_applications
    try {
      await pool.execute(
        `INSERT INTO career_applications (full_name, email, phone, role, message, created_at)
         VALUES (?, ?, ?, 'Candidate from Inquiry', ?, NOW())`,
        [contactName, contactEmail, contactPhone, msg?.message || '']
      );
    } catch (_) {}
  } else if (leadType === 'Intern Candidate') {
    // Insert into interns
    try {
      await pool.execute(
        `INSERT INTO interns (id, name, email, phone, role, status, created_at)
         VALUES (?, ?, ?, ?, 'Intern Applicant', 'Applied', NOW())`,
        [`INT-${Date.now().toString().slice(-4)}`, contactName, contactEmail, contactPhone]
      );
    } catch (_) {}
  }

  // Update status in contact_messages
  try {
    await pool.execute('UPDATE contact_messages SET status = "CONVERTED", is_read = 1 WHERE id = ?', [id]);
  } catch (_) {}

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CONVERT_INQUIRY_TO_LEAD',
    entity_type: 'CONTACT_MESSAGE',
    entity_id: String(id),
    new_value: { leadType, contactName, contactEmail },
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('HR', 'inquiry_converted', { id, leadType, contactName, contactEmail });

  return success(res, 200, { id, leadType, contactName }, `Inquiry routed to ${leadType} successfully!`);
});

