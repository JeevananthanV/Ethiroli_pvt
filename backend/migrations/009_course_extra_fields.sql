-- ============================================================================
-- 009_course_extra_fields.sql
--
-- The employee-portal / reception queries expect `courses.category`,
-- `courses.level` and `courses.thumbnail_url`. These columns never existed
-- on the baseline table, so every call to `/v1/employee/courses`,
-- `/v1/reception/...` and similar endpoints returned 500.
--
-- They are added here as nullable columns so the API shape stays stable
-- while the content is still populated dynamically.
-- ============================================================================

ALTER TABLE courses
  ADD COLUMN category VARCHAR(50) NULL AFTER description,
  ADD COLUMN level VARCHAR(20) NULL AFTER category,
  ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER level;

CREATE INDEX idx_courses_category ON courses (category);
