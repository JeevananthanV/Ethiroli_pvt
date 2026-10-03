-- ============================================================================
-- 006: Attendance work mode (Remote / Office)
--
-- Lets an intern record whether a given day's punch was Remote or Office.
-- The generated total_hours column already exists, so this is additive only.
--
-- NOTE: the collation is written out explicitly. A bare
-- "DEFAULT CHARSET=utf8mb4" resolves to the server default (utf8mb4_uca1400_ai_ci
-- on MariaDB 11 / MySQL 8) which does not match the utf8mb4_unicode_ci columns
-- created by the base dump, and any later FK on this column fails with errno 150.
-- ============================================================================

ALTER TABLE `attendance`
  ADD COLUMN `work_mode` ENUM('REMOTE', 'OFFICE') NULL DEFAULT NULL AFTER `status`;

-- Backfill: anything punched in before this migration is treated as Remote,
-- which matches the frontend default.
UPDATE `attendance` SET `work_mode` = 'REMOTE' WHERE `work_mode` IS NULL;
