-- ---------------------------------------------------------------------------
-- 007 - Seed the intern LMS content the portal reads.
--
-- Why this exists
-- ---------------
-- The intern portal pages were rendering hardcoded fixtures because the LMS
-- tables behind them were completely empty: courses, modules, lessons and
-- enrollments all had zero rows, and the intern had no activity feed. So the
-- real endpoints existed and answered 200, but with empty arrays.
--
-- This seeds one course matching the portal's 45-day curriculum, its modules
-- and lessons, an enrollment for the demo intern, and a set of activity-feed
-- events so Notifications and the activity drawer have real data.
--
-- Idempotent: every insert is keyed on a natural unique column or a fixed id,
-- so re-running is a no-op rather than a duplicate.
-- ---------------------------------------------------------------------------

SET @intern_user := 'dd567ea1-287c-4163-8815-152e6176aee1';
SET @mentor_user  := '368f5c88-12cd-11ed-861d-0242ac120002';

-- Course -------------------------------------------------------------------
INSERT INTO courses (id, code, name, description, category, level, duration_days, fee, tutor_id, is_active)
VALUES (
  'a1000000-0000-4000-8000-000000000001',
  'ETH-FSWD-MERN',
  'Full Stack Web Development (MERN Stack)',
  'A 45-day structured track covering HTML/CSS/JavaScript fundamentals, React with Redux Toolkit, a Node/Express REST API, MySQL schema design, and deployment. Includes daily mentor review and a capstone deliverable.',
  'FULL_STACK',
  'INTERMEDIATE',
  45,
  0.00,
  @mentor_user,
  1
)
ON DUPLICATE KEY UPDATE
  name        = VALUES(name),
  description = VALUES(description),
  duration_days = VALUES(duration_days),
  tutor_id    = VALUES(tutor_id);

-- Modules ------------------------------------------------------------------
-- module_order matches the day ranges shown on the portal's Training Plan.
INSERT INTO modules (id, course_id, title, module_order, description, duration_minutes) VALUES
  ('a2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 'Web Foundations - HTML, CSS & JavaScript', 1, 'Semantic markup, modern CSS layout, and the JavaScript fundamentals the rest of the track builds on.', 2100),
  ('a2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000001', 'Version Control & Git Workflow',     2, 'Branching, pull requests, resolving conflicts, and the review workflow used across the project.', 900),
  ('a2000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000001', 'React Fundamentals & Component Design', 3, 'Components, props, state, and lifting state up. Ends with a multi-page SPA.', 2700),
  ('a2000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000001', 'Redux Toolkit, State Management & Routing', 4, 'Slices, selectors, async thunks, and client-side routing with protected views.', 2400),
  ('a2000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000001', 'Node.js & Express REST API',        6, 'Building a layered REST API with validation, error handling and JWT auth.', 3000),
  ('a2000000-0000-4000-8000-000000000006', 'a1000000-0000-4000-8000-000000000001', 'MySQL Schema Design & Relational Constraints', 7, 'Normalisation, keys, indexing, and verifying constraints in practice.', 1800),
  ('a2000000-0000-4000-8000-000000000007', 'a1000000-0000-4000-8000-000000000001', 'Authentication & Authorisation',     8, 'Password hashing, refresh-token rotation, and role-based access control.', 1500),
  ('a2000000-0000-4000-8000-000000000008', 'a1000000-0000-4000-8000-000000000001', 'Capstone Project & Deployment',     9, 'Ship a full-stack application, then deploy it with CI and document the API.', 3600)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  duration_minutes = VALUES(duration_minutes);

-- Lessons ------------------------------------------------------------------
INSERT INTO lessons (id, module_id, title, lesson_order, content, video_url) VALUES
  ('a3000000-0000-4000-8000-000000000001', 'a2000000-0000-4000-8000-000000000004', 'React.js - State Management & Routing', 1, 'Build a ticking clock and a working-hours counter that tracks active duration since clock-in.', NULL),
  ('a3000000-0000-4000-8000-000000000002', 'a2000000-0000-4000-8000-000000000004', 'Redux Toolkit slices, selectors, and async thunks', 2, 'Model a real feature with slices, memoised selectors, and a thunk that talks to the API.', NULL),
  ('a3000000-0000-4000-8000-000000000003', 'a2000000-0000-4000-8000-000000000004', 'Protected routes and role-based views', 3, 'Gate views by role and redirect unauthenticated users safely.', NULL),
  ('a3000000-0000-4000-8000-000000000004', 'a2000000-0000-4000-8000-000000000005', 'Designing a REST API with Express', 1, 'Resource design, status codes, and a consistent error envelope.', NULL),
  ('a3000000-0000-4000-8000-000000000005', 'a2000000-0000-4000-8000-000000000005', 'JWT authentication and refresh tokens', 2, 'Issue, rotate and revoke tokens without leaving a window for replay.', NULL),
  ('a3000000-0000-4000-8000-000000000006', 'a2000000-0000-4000-8000-000000000007', 'Password hashing done safely', 1, 'Argon2/bcrypt, salting, and why you never store plaintext.', NULL),
  ('a3000000-0000-4000-8000-000000000007', 'a2000000-0000-4000-8000-000000000008', 'Capstone: plan, build and deploy', 1, 'Scope a deliverable, build it against the brief, and deploy it.', NULL),
  ('a3000000-0000-4000-8000-000000000008', 'a2000000-0000-4000-8000-000000000001', 'Semantic HTML and accessible forms', 1, 'Structure content so it is readable by assistive technology as well as humans.', NULL)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  content = VALUES(content);

-- Enrollment ---------------------------------------------------------------
-- progress_percentage drives the portal's Training Plan and dashboard KPI.
INSERT INTO enrollments (id, student_id, course_id, assigned_by_tutor_id, progress_percentage, status, notes)
VALUES (
  'a4000000-0000-4000-8000-000000000001',
  @intern_user,
  'a1000000-0000-4000-8000-000000000001',
  @mentor_user,
  68.00,
  'ACTIVE',
  'Day 18 of 45. Currently in Phase 2 (API integration). Attendance requirement tracking.'
)
ON DUPLICATE KEY UPDATE
  progress_percentage = VALUES(progress_percentage),
  status = VALUES(status),
  notes = VALUES(notes);

-- Activity feed ------------------------------------------------------------
-- Notifications and the MainLayout activity drawer both read this table.
--
-- The payload strings deliberately avoid double quotes inside the JSON. The
-- migration runner normalises statements and strips backslashes, so an escaped
-- \" would collapse into a bare " and break the json_valid() CHECK constraint.
-- Single quotes are valid JSON string content and survive untouched.
INSERT INTO activity_feeds (id, user_id, actor_id, event_type, entity_type, entity_id, payload, is_read, created_at) VALUES
  ('a5000000-0000-4000-8000-000000000001', @intern_user, @mentor_user, 'TASK_COMPLETED', 'TASK', NULL, '{"message":"Completed task: Create Navbar and Search Component"}', 0, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  ('a5000000-0000-4000-8000-000000000002', @intern_user, @mentor_user, 'WORKLOG_REVIEWED', 'WORKLOG', NULL, '{"message":"Mentor Arun Kumar reviewed and approved your Daily Work Log"}', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  ('a5000000-0000-4000-8000-000000000003', @intern_user, @mentor_user, 'ASSIGNMENT_GRADED', 'ASSIGNMENT', NULL, '{"message":"Assignment 2 - REST API Integration and RBAC Guards - was graded: 92/100"}', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
  ('a5000000-0000-4000-8000-000000000004', @intern_user, NULL, 'CERTIFICATE_ISSUED', 'CERTIFICATE', NULL, '{"message":"Internship Completion Certificate is now available to download"}', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
  ('a5000000-0000-4000-8000-000000000005', @intern_user, NULL, 'STIPEND_PROCESSED', 'STIPEND', NULL, '{"message":"Monthly stipend has been processed for this cycle"}', 1, DATE_SUB(NOW(), INTERVAL 7 DAY))
ON DUPLICATE KEY UPDATE
  payload = VALUES(payload),
  is_read = VALUES(is_read);

-- Point the intern at a mentor so the Mentorship page has a real assignee.
UPDATE interns
SET mentor_id = @mentor_user
WHERE user_id = @intern_user
  AND mentor_id IS NULL;
