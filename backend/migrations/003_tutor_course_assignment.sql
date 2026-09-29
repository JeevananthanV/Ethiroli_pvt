-- ==========================================================
-- Migration 003: Tutor Course Assignment Support
-- Supports many-to-many tutor-assigned courses for students
-- ==========================================================

USE ethiroli;

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS assigned_by_tutor_id CHAR(36) NULL AFTER course_id,
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMP NULL DEFAULT NULL AFTER status,
  ADD COLUMN IF NOT EXISTS notes TEXT NULL AFTER completed_at;
