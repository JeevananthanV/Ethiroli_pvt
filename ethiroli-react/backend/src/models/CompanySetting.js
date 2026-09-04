import crypto from 'crypto';
import pool from '../config/database.js';
import { encrypt, decrypt } from '../config/encryption.js';

export default class CompanySetting {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      gst: row.gst ? decrypt(row.gst) : null,
      pan: row.pan ? decrypt(row.pan) : null,
      bank_account: row.bank_account ? decrypt(row.bank_account) : null,
      address: row.address ? decrypt(row.address) : null
    };
  }

  static async get() {
    const [rows] = await pool.execute('SELECT * FROM company_settings LIMIT 1');
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async save({ company_name, gst = null, pan = null, bank_name = null, bank_account = null, bank_ifsc = null, address = null, logo_url = null, phone = null, email = null, currency = 'INR' }) {
    const gstEnc = gst ? encrypt(gst) : null;
    const panEnc = pan ? encrypt(pan) : null;
    const bankAccEnc = bank_account ? encrypt(bank_account) : null;
    const addrEnc = address ? encrypt(address) : null;

    const [rows] = await pool.execute('SELECT id FROM company_settings LIMIT 1');
    if (rows.length === 0) {
      const id = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO company_settings (id, company_name, gst, pan, bank_name, bank_account, bank_ifsc, address, logo_url, phone, email, currency)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, company_name, gstEnc, panEnc, bank_name, bankAccEnc, bank_ifsc, addrEnc, logo_url, phone, email, currency]
      );
      return id;
    } else {
      await pool.execute(
        `UPDATE company_settings 
         SET company_name = ?, gst = ?, pan = ?, bank_name = ?, bank_account = ?, bank_ifsc = ?, address = ?, logo_url = ?, phone = ?, email = ?, currency = ?
         WHERE id = ?`,
        [company_name, gstEnc, panEnc, bank_name, bankAccEnc, bank_ifsc, addrEnc, logo_url, phone, email, currency, rows[0].id]
      );
      return rows[0].id;
    }
  }
}