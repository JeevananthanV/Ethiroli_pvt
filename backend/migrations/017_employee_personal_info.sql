-- ==========================================================
-- 017_employee_personal_info.sql
-- Self-service personal information for the Employee Profile.
--
-- Why this exists
-- ---------------
-- The Employee Profile "Contact & Identity Details" card asked for contact and
-- identity information that the `employees` table could not store. Three fields
-- are added, all owned by the EMPLOYEE (self-service) rather than HR:
--
--   blood_group       - medical/emergency reference
--   emergency_contact - who to call if the employee cannot be reached
--   address           - postal address
--
-- Deliberately NOT added
-- ---------------------
-- `account_holder_name` was considered for the Tax & Banking card and rejected:
-- there is no such column, no HR/Finance workflow that populates one, and
-- inventing a field to make the card look complete is exactly what the existing
-- PAN / bank block avoids.
--
-- Storage
-- -------
-- Plaintext, matching how `users.phone` is already stored. `phone` is equally
-- personal data and is not encrypted, so encrypting only these three would be
-- inconsistent rather than safer. Unlike PAN / bank_account / pf_number / uan,
-- none of these are identifiers an attacker could use for financial fraud.
--
-- All three are NULLABLE so an existing employee row stays valid and the
-- profile can honestly render "Not on record" until the employee fills them in.
--
-- `blood_group` is a VARCHAR rather than a MySQL ENUM so the accepted values can
-- be defined in one place (the controller / frontend) and extended without an
-- ALTER on every change. It is validated on write and 'Unknown' is the explicit
-- opt-out.
--
-- VARCHAR(7), not VARCHAR(5): 'Unknown' is seven characters, so a width of 5
-- made the explicit opt-out the one value the database could not store, which
-- surfaced as a 500 rather than a validation error. 7 is the length of the
-- longest accepted value.
-- ==========================================================

ALTER TABLE employees
  ADD COLUMN blood_group       VARCHAR(7)   DEFAULT NULL AFTER uan,
  ADD COLUMN emergency_contact VARCHAR(20)  DEFAULT NULL AFTER blood_group,
  ADD COLUMN address           VARCHAR(500) DEFAULT NULL AFTER emergency_contact;
