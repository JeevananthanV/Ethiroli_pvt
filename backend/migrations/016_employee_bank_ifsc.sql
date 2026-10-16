-- ==========================================================
-- 016_employee_bank_ifsc.sql
-- Bank payout identifiers for the Finance NEFT batch export.
--
-- Why this exists
-- ---------------
-- `employees` already stores `bank_account`, but there was nowhere to record the
-- IFSC code or the bank name. A NEFT/RTGS payout file needs all three:
-- beneficiary name, account number and IFSC. Without the IFSC the Finance
-- payroll export had to invent one, which produced a bank-uploadable CSV listing
-- real employees against a fabricated routing code.
--
-- Both columns here are public branch identifiers (the sort of thing printed on
-- a cheque book and on every UPI ID), so they are stored in plain text.
-- `bank_account` stays encrypted at rest, as it always was.
--
-- Both are nullable: an employee with no IFSC on record is EXCLUDED from the
-- batch export and reported to the user, never given a made-up value.
-- ==========================================================

ALTER TABLE employees
  ADD COLUMN bank_name VARCHAR(150) DEFAULT NULL AFTER bank_account,
  ADD COLUMN bank_ifsc VARCHAR(20) DEFAULT NULL AFTER bank_name;
