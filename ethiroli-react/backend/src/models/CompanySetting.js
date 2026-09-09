import crypto from 'crypto';
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
      `INSERT INTO company_settings (id, tenant_id, company_name, gstin, pan, address, phone, email, logo_url, bank_account_number, bank_ifsc, bank_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    await pool.execute(`UPDATE company_settings SET ${queryParts.join(', ')} WHERE id = ?`, values);
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
