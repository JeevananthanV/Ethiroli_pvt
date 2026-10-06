-- 013: employee UAN + calendar holiday seeding
--
-- Two changes for the Employee Portal:
--
-- 1. `employees.uan` - Universal Account Number. The Profile page already shows
--    a "PF / UAN" tile, but no UAN column has ever existed, so the value could
--    never be recorded. PAN / PF / UAN / bank stay read-only for the EMPLOYEE
--    role and are maintained here by HR / Admin, exactly like PAN and PF.
--
-- 2. `holidays` - the calendar excludes Sundays plus whatever is in this table.
--    The table has always been empty, so only Sundays could be shown as holidays.
--    Seeded with the Indian public holidays for 2026 so the calendar can mark
--    real non-working days. Rows are inserted idempotently (name + date), so
--    re-running this migration is safe and will not duplicate.

ALTER TABLE employees
  ADD COLUMN uan VARCHAR(20) NULL DEFAULT NULL AFTER pf_number;

-- Festival / national holidays for 2026 (India). Restricted holidays such as
-- Christmas / Good Friday are intentionally not listed here: they are optional
-- and the `holidays.is_restricted` column exists for per-company decisions.
INSERT INTO holidays (name, date, is_restricted) VALUES
  ('Republic Day',            '2026-01-26', 0),
  ('Holi',                    '2026-03-04', 0),
  ('Mahashivratri',           '2026-02-15', 0),
  ('Ugadi',                   '2026-03-19', 0),
  ('Dr. Ambedkar Jayanti',    '2026-04-14', 0),
  ('Good Friday',             '2026-04-03', 0),
  ('May Day',                 '2026-05-01', 0),
  ('Independence Day',        '2026-08-15', 0),
  ('Ganesh Chaturthi',        '2026-09-14', 0),
  ('Gandhi Jayanti',          '2026-10-02', 0),
  ('Dussehra',                '2026-10-20', 0),
  ('Diwali Balipratipada',    '2026-11-08', 0),
  ('Christmas',               '2026-12-25', 0)
ON DUPLICATE KEY UPDATE name = VALUES(name);
