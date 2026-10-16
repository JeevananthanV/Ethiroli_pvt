import pool from '../src/config/database.js';

async function migrate() {
  console.log('Migrating leads table to support full 17 Blueprint CRM fields...');

  const [existingCols] = await pool.query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'leads'");
  const colSet = new Set(existingCols.map(c => c.COLUMN_NAME.toLowerCase()));

  const newCols = [
    { name: 'lead_code', sql: 'ALTER TABLE leads ADD COLUMN lead_code VARCHAR(50) NULL' },
    { name: 'district', sql: 'ALTER TABLE leads ADD COLUMN district VARCHAR(100) NULL' },
    { name: 'service_interested', sql: 'ALTER TABLE leads ADD COLUMN service_interested VARCHAR(255) NULL' },
    { name: 'package_tier', sql: 'ALTER TABLE leads ADD COLUMN package_tier VARCHAR(100) NULL' },
    { name: 'interest_level', sql: 'ALTER TABLE leads ADD COLUMN interest_level VARCHAR(20) DEFAULT "WARM"' },
    { name: 'pipeline_stage', sql: 'ALTER TABLE leads ADD COLUMN pipeline_stage VARCHAR(100) DEFAULT "Stage 1: Lead Ingestion & Qualification Discovery"' },
    { name: 'quoted_amount', sql: 'ALTER TABLE leads ADD COLUMN quoted_amount DECIMAL(12,2) DEFAULT 0.00' },
    { name: 'meeting_date', sql: 'ALTER TABLE leads ADD COLUMN meeting_date DATETIME NULL' },
    { name: 'first_contact_date', sql: 'ALTER TABLE leads ADD COLUMN first_contact_date DATE NULL' },
    { name: 'last_contact_date', sql: 'ALTER TABLE leads ADD COLUMN last_contact_date DATE NULL' },
    { name: 'next_action', sql: 'ALTER TABLE leads ADD COLUMN next_action TEXT NULL' }
  ];

  for (const c of newCols) {
    if (!colSet.has(c.name.toLowerCase())) {
      try {
        await pool.query(c.sql);
        console.log(`Added column: ${c.name}`);
      } catch (e) {
        console.warn(`Failed to add ${c.name}:`, e.message);
      }
    } else {
      console.log(`Column ${c.name} already exists.`);
    }
  }

  const [cols] = await pool.query('DESCRIBE leads');
  console.log('Leads table columns updated successfully:');
  console.log(cols.map(c => c.Field));
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
