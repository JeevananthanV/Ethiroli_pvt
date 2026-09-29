-- 002_forum_course_id_nullable.sql
-- Makes forum_posts.course_id optional so students/tutors can create threads
-- without being forced to pick a course up front.
-- Idempotent: applied via backend/scripts/apply-forum-migration.js
ALTER TABLE forum_posts MODIFY COLUMN course_id CHAR(36) NULL;