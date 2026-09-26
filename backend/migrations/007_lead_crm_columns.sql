-- ============================================================================
-- 007_lead_crm_columns.sql
--
-- `SalesDeal`, `SalesActivity`, `SalesProposal` and `CustomerHandover` all JOIN
-- leads and select l.first_name / l.last_name / l.company_name, but the baseline
-- `leads` table only has the encrypted catch-all `name` column - every sales
-- endpoint therefore failed with "Unknown column 'l.company_name'".
--
-- These three columns are plain text on purpose: they are selected directly in
-- those joins (the PII-bearing `name` / `email` / `phone` stay AES-encrypted and
-- are decrypted by Lead.format()). This mirrors `clients.company_name`, which is
-- also stored in clear.
-- ============================================================================

ALTER TABLE leads
  ADD COLUMN first_name VARCHAR(255) NULL AFTER name,
  ADD COLUMN last_name VARCHAR(255) NULL AFTER first_name,
  ADD COLUMN company_name VARCHAR(255) NULL AFTER last_name;

CREATE INDEX idx_leads_company ON leads (company_name);
