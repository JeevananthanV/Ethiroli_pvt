import pool from '../config/database.js';
import crypto from 'crypto';
import { encrypt, decrypt, encryptDeterministic } from '../config/encryption.js';

export default class Lead {
  static formatLead(row) {
    if (!row) return null;
    const fullName = decrypt(row.name);
    const [first, ...rest] = String(fullName || '').trim().split(/\s+/);
    
    // Determine BDA Name
    let bdaName = row.assigned_bda_name ? decrypt(row.assigned_bda_name) : null;
    if (!bdaName && row.notes) {
      const match = row.notes.match(/BDA:\s*([^|]+)/i);
      if (match) bdaName = match[1].trim();
    }
    if (!bdaName && row.assigned_to) {
      if (row.assigned_to === 'eadd2eb6-b0af-4e3f-aa82-a08e29d891ee') bdaName = 'Mathishree S';
      else if (row.assigned_to === '66da1638-9a06-4741-9ed2-8054b0417313') bdaName = 'Nandhini K';
    }

    // Determine District / Area
    let district = row.district;
    if (!district && row.notes) {
      const match = row.notes.match(/District \/ Area:\s*([^|]+)/i) || row.notes.match(/District:\s*([^|]+)/i);
      if (match) district = match[1].trim();
    }

    return {
      ...row,
      name: fullName,
      first_name: row.first_name || first || null,
      last_name: row.last_name || (rest.length ? rest.join(' ') : null),
      email: row.email ? decrypt(row.email) : null,
      phone: row.phone ? decrypt(row.phone) : null,
      district: district || 'Tamil Nadu',
      bda_name: bdaName || 'Assigned BDA',
      quoted_amount: parseFloat(row.quoted_amount || 0),
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT l.*, u.full_name as assigned_bda_name, u.email as assigned_bda_email
       FROM leads l
       LEFT JOIN users u ON l.assigned_to = u.id
       WHERE l.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.formatLead(rows[0]) : null;
  }

  static async create({
    name,
    first_name = null,
    last_name = null,
    company_name = null,
    email = null,
    phone = null,
    source = 'PHONE',
    status = 'NEW',
    assigned_to = null,
    notes = null,
    follow_up_date = null,
    lead_code = null,
    district = null,
    service_interested = null,
    package_tier = null,
    interest_level = 'WARM',
    pipeline_stage = 'Stage 1: Lead Ingestion & Qualification Discovery',
    quoted_amount = 0.00,
    meeting_date = null,
    first_contact_date = null,
    last_contact_date = null,
    next_action = null,
    created_by
  }) {
    const id = crypto.randomUUID();
    const encName = encrypt(name || first_name || company_name || 'Prospect');
    const encEmail = email ? encryptDeterministic(email.toLowerCase().trim()) : null;
    const encPhone = phone ? encrypt(phone) : null;

    // Generate lead code if not passed
    let finalCode = lead_code;
    if (!finalCode) {
      const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM leads');
      finalCode = `ETH-2026-${String(count + 1).padStart(3, '0')}`;
    }

    await pool.execute(
      `INSERT INTO leads (
        id, lead_code, name, first_name, last_name, company_name, email, phone,
        district, service_interested, package_tier, interest_level, pipeline_stage,
        quoted_amount, source, status, assigned_to, follow_up_date, meeting_date,
        first_contact_date, last_contact_date, next_action, notes, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        finalCode,
        encName,
        first_name || name,
        last_name,
        company_name,
        encEmail,
        encPhone,
        district,
        service_interested,
        package_tier,
        interest_level,
        pipeline_stage,
        quoted_amount,
        source,
        status,
        assigned_to,
        follow_up_date,
        meeting_date,
        first_contact_date,
        last_contact_date,
        next_action,
        notes,
        created_by
      ]
    );

    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) {
      queryParts.push('name = ?');
      values.push(encrypt(updates.name));
    }
    if (updates.first_name !== undefined) {
      queryParts.push('first_name = ?');
      values.push(updates.first_name);
    }
    if (updates.last_name !== undefined) {
      queryParts.push('last_name = ?');
      values.push(updates.last_name);
    }
    if (updates.company_name !== undefined) {
      queryParts.push('company_name = ?');
      values.push(updates.company_name);
    }
    if (updates.email !== undefined) {
      queryParts.push('email = ?');
      values.push(updates.email ? encryptDeterministic(updates.email.toLowerCase().trim()) : null);
    }
    if (updates.phone !== undefined) {
      queryParts.push('phone = ?');
      values.push(updates.phone ? encrypt(updates.phone) : null);
    }
    if (updates.source !== undefined) {
      queryParts.push('source = ?');
      values.push(updates.source);
    }
    if (updates.status !== undefined) {
      queryParts.push('status = ?');
      values.push(updates.status);
    }
    if (updates.assigned_to !== undefined) {
      queryParts.push('assigned_to = ?');
      values.push(updates.assigned_to);
    }
    if (updates.notes !== undefined) {
      queryParts.push('notes = ?');
      values.push(updates.notes);
    }
    if (updates.follow_up_date !== undefined) {
      queryParts.push('follow_up_date = ?');
      values.push(updates.follow_up_date);
    }
    if (updates.converted_at !== undefined) {
      queryParts.push('converted_at = ?');
      values.push(updates.converted_at);
    }
    if (updates.lost_reason !== undefined) {
      queryParts.push('lost_reason = ?');
      values.push(updates.lost_reason);
    }
    if (updates.lead_code !== undefined) {
      queryParts.push('lead_code = ?');
      values.push(updates.lead_code);
    }
    if (updates.district !== undefined) {
      queryParts.push('district = ?');
      values.push(updates.district);
    }
    if (updates.service_interested !== undefined) {
      queryParts.push('service_interested = ?');
      values.push(updates.service_interested);
    }
    if (updates.package_tier !== undefined) {
      queryParts.push('package_tier = ?');
      values.push(updates.package_tier);
    }
    if (updates.interest_level !== undefined) {
      queryParts.push('interest_level = ?');
      values.push(updates.interest_level);
    }
    if (updates.pipeline_stage !== undefined) {
      queryParts.push('pipeline_stage = ?');
      values.push(updates.pipeline_stage);
    }
    if (updates.quoted_amount !== undefined) {
      queryParts.push('quoted_amount = ?');
      values.push(updates.quoted_amount);
    }
    if (updates.meeting_date !== undefined) {
      queryParts.push('meeting_date = ?');
      values.push(updates.meeting_date);
    }
    if (updates.first_contact_date !== undefined) {
      queryParts.push('first_contact_date = ?');
      values.push(updates.first_contact_date);
    }
    if (updates.last_contact_date !== undefined) {
      queryParts.push('last_contact_date = ?');
      values.push(updates.last_contact_date);
    }
    if (updates.next_action !== undefined) {
      queryParts.push('next_action = ?');
      values.push(updates.next_action);
    }

    if (queryParts.length === 0) return;

    queryParts.push('updated_at = NOW()');
    values.push(id);
    await pool.execute(
      `UPDATE leads SET ${queryParts.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
  }

  static async list({ assigned_to, status, source, district, search, limit = 200, offset = 0 } = {}) {
    let query = `
      SELECT l.*, u.full_name as assigned_bda_name, u.email as assigned_bda_email
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      WHERE 1=1
    `;
    const values = [];

    if (assigned_to) {
      query += ' AND l.assigned_to = ?';
      values.push(assigned_to);
    }
    if (status) {
      query += ' AND l.status = ?';
      values.push(status);
    }
    if (source) {
      query += ' AND l.source = ?';
      values.push(source);
    }
    if (district) {
      query += ' AND l.district = ?';
      values.push(district);
    }
    if (search) {
      query += ' AND (l.company_name LIKE ? OR l.first_name LIKE ? OR l.lead_code LIKE ?)';
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
    values.push(parseInt(limit, 10) || 200, parseInt(offset, 10) || 0);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.formatLead(row));
  }

  static async count({ assigned_to, status, source, district } = {}) {
    let query = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
    const values = [];

    if (assigned_to) {
      query += ' AND assigned_to = ?';
      values.push(assigned_to);
    }
    if (status) {
      query += ' AND status = ?';
      values.push(status);
    }
    if (source) {
      query += ' AND source = ?';
      values.push(source);
    }
    if (district) {
      query += ' AND district = ?';
      values.push(district);
    }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
