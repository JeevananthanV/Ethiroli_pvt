-- ============================================================
-- Ethiroli LMS - All Migrations Combined (001-010)
-- Applied in order: 001 → 010
-- ============================================================


-- ---------------------------------------------------------------------
-- 001_module_based_curriculum.sql
-- Module-based curriculum foundation: technology_modules, module_topics,
-- course_modules, programs, program_modules, lessons.technology_module_id
-- ---------------------------------------------------------------------

-- Table 1: technology_modules (master registry of all curriculum modules)
CREATE TABLE IF NOT EXISTS technology_modules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    duration_hours INT NOT NULL,
    description TEXT,
    topics JSON NULL,
    technologies JSON NULL,
    practicals JSON NULL,
    projects JSON NULL,
    prerequisites JSON NULL,
    learning_outcomes JSON NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_category_level (category, level)
);

-- Table 2: module_topics (individual topics within each module)
CREATE TABLE IF NOT EXISTS module_topics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    module_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topic_order INT NOT NULL,
    estimated_hours DECIMAL(5,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES technology_modules(id) ON DELETE CASCADE,
    INDEX idx_module_order (module_id, topic_order)
);

-- Table 3: course_modules (modules associated with courses)
CREATE TABLE IF NOT EXISTS course_modules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    course_id CHAR(36) NOT NULL,
    module_id CHAR(36) NOT NULL,
    module_order INT NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    custom_duration_days DECIMAL(5,2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES technology_modules(id) ON DELETE CASCADE,
    INDEX idx_course_order (course_id, module_order)
);

-- Table 4: programs (curriculum programs)
CREATE TABLE IF NOT EXISTS programs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    tracks JSON NULL,
    final_project VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
);

-- Table 5: program_modules (modules associated with programs)
CREATE TABLE IF NOT EXISTS program_modules (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    program_id CHAR(36) NOT NULL,
    module_id CHAR(36) NOT NULL,
    module_order INT NOT NULL,
    allocated_days INT NOT NULL,
    start_day INT DEFAULT NULL,
    end_day INT DEFAULT NULL,
    is_core BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES technology_modules(id) ON DELETE CASCADE,
    INDEX idx_program_order (program_id, module_order)
);

-- Table 6: Add technology_module_id column to lessons table
-- NOTE: one-time ALTER - MySQL 8.0 does not support `ADD COLUMN IF NOT EXISTS`.
-- The companion apply script (backend/scripts/apply-module-curriculum.js) guards
-- this operation so it can be re-run safely.
ALTER TABLE lessons ADD COLUMN technology_module_id CHAR(36) NULL;

-- Index on lessons technology_module_id for quick lookups
-- NOTE: MySQL 8.0 does not support `CREATE INDEX IF NOT EXISTS`
-- (MariaDB-only syntax). The companion apply script guards against
-- duplicate index errors on re-run.
CREATE INDEX idx_lessons_technology_module ON lessons (technology_module_id);

-- ============================================
-- End of migration 001
-- ============================================


-- ---------------------------------------------------------------------
-- 002_forum_course_id_nullable.sql
-- Makes forum_posts.course_id optional so students/tutors can create threads
-- without being forced to pick a course up front.
-- ---------------------------------------------------------------------

ALTER TABLE forum_posts MODIFY COLUMN course_id CHAR(36) NULL;


-- ============================================
-- End of migration 002
-- ============================================


-- ---------------------------------------------------------------------
-- 003_tutor_course_assignment.sql
-- Tutor Course Assignment Support
-- Supports many-to-many tutor-assigned courses for students
-- ---------------------------------------------------------------------

USE ethiroli;

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS assigned_by_tutor_id CHAR(36) NULL AFTER course_id,
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMP NULL DEFAULT NULL AFTER status,
  ADD COLUMN IF NOT EXISTS notes TEXT NULL AFTER completed_at;


-- ============================================
-- End of migration 003
-- ============================================


-- ---------------------------------------------------------------------
-- 004_lms_course_modules_progress.sql
-- LMS COURSE MODULES, LESSON PROGRESS & COMPLETION
-- Closes the gaps that kept the LMS from working end-to-end:
--   1. lesson_blocks  - interactive lesson content (video/markdown/code/resource)
--   2. lesson_progress - per-student, per-lesson completion tracking
--   3. modules.description / modules.duration_minutes - richer course modules
--   4. assignment_submissions.graded_by - grading audit trail
--   5. Seed badges used by the completion/gamification pipeline
-- ---------------------------------------------------------------------

-- 1. Lesson content blocks -------------------------------------
CREATE TABLE IF NOT EXISTS lesson_blocks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    lesson_id CHAR(36) NOT NULL,
    block_type ENUM('VIDEO', 'MARKDOWN', 'CODE_PLAYGROUND', 'QUIZ_EMBED', 'RESOURCE_DOWNLOAD', 'CALLOUT') NOT NULL,
    block_order INT NOT NULL DEFAULT 1,
    content_payload JSON NOT NULL,
    is_interactive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_order (lesson_id, block_order)
);

-- 2. Granular lesson progress ----------------------------------
CREATE TABLE IF NOT EXISTS lesson_progress (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    enrollment_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    lesson_id CHAR(36) NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
    seconds_watched INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_lesson (student_id, lesson_id),
    INDEX idx_enrollment (enrollment_id),
    INDEX idx_student (student_id)
);

-- 3. Course module metadata ------------------------------------
ALTER TABLE modules ADD COLUMN description TEXT NULL;
ALTER TABLE modules ADD COLUMN duration_minutes INT NULL;

-- 4. Assignment grading audit trail ----------------------------
ALTER TABLE assignment_submissions ADD COLUMN graded_by CHAR(36) NULL;

-- 5. Gamification badges ---------------------------------------
-- `badges.name` is UNIQUE, so ON DUPLICATE KEY UPDATE keeps re-runs a no-op.
INSERT INTO badges (id, name, description, icon, criteria) VALUES
  ('b3f1a000000000000000000000000001', 'Course Completed', 'Finished every lesson in a course from start to finish.', 'workspace_premium', '{"type":"COURSE_COMPLETION","courses":1}'),
  ('b3f1a000000000000000000000000002', 'First Lesson', 'Completed your very first lesson.', 'flag', '{"type":"LESSON_COMPLETION","lessons":1}'),
  ('b3f1a000000000000000000000000003', 'Module Master', 'Completed five course modules.', 'menu_book', '{"type":"MODULE_COMPLETION","modules":5}'),
  ('b3f1a000000000000000000000000004', 'Quiz Whiz', 'Scored 100% on a published quiz.', 'quiz', '{"type":"QUIZ_PASS","score":100}'),
  ('b3f1a000000000000000000000000005', 'Assignment Pro', 'Scored 90% or better on a graded assignment.', 'assignment_turned_in', '{"type":"ASSIGNMENT_GRADE","score":90}')
ON DUPLICATE KEY UPDATE name = VALUES(name);


-- ============================================
-- End of migration 004
-- ============================================


-- ---------------------------------------------------------------------
-- 005_forum_category_and_votes.sql
-- Forum Categories & Post Voting
-- The forum UI exposes a Category selector and an Upvote button, but
-- forum_posts has no category column and no votes table exists, so both
-- silently did nothing (the vote call 404'd). This migration adds:
--   1. forum_posts.category   - selectable, filterable thread category
--   2. forum_post_votes       - one upvote per user per post
-- ---------------------------------------------------------------------

-- 1. Thread category ------------------------------------------
ALTER TABLE forum_posts ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'general';
CREATE INDEX idx_forum_category ON forum_posts (category);

-- 2. One vote per user per post -------------------------------
CREATE TABLE IF NOT EXISTS forum_post_votes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    vote TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_post_user (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ============================================
-- End of migration 005
-- ============================================


-- ---------------------------------------------------------------------
-- 006_course_completions.sql
-- MySQL counterpart of the ClickHouse analytics table of the same name.
-- `services/completionService.js` writes a row here whenever a learner finishes
-- a course (INSERT ... ON DUPLICATE KEY UPDATE), so the relational database
-- needs the table even though the warehouse copy lives in
-- src/migrations/002_analytics_tables.sql (ClickHouse only).
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS course_completions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  enrollment_id VARCHAR(191) NOT NULL,
  student_id CHAR(36) NOT NULL,
  course_id CHAR(36) NOT NULL,
  completed_at DATETIME NOT NULL,
  certificate_number VARCHAR(100) DEFAULT NULL,
  issue_date DATE DEFAULT NULL,
  expiry_date DATE DEFAULT NULL,
  pdf_url VARCHAR(500) DEFAULT NULL,
  qr_code_url VARCHAR(500) DEFAULT NULL,
  status ENUM('PENDING', 'ISSUED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_course_completions_enrollment (enrollment_id),
  INDEX idx_completions_student (student_id),
  INDEX idx_completions_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- End of migration 006
-- ============================================


-- ---------------------------------------------------------------------
-- 007_lead_crm_columns.sql
-- Lead/Crm columns on the leads table
-- The baseline `leads` table only has the encrypted catch-all `name` column -
-- sales endpoints join on first_name / last_name / company_name and fail.
-- ---------------------------------------------------------------------

ALTER TABLE leads
  ADD COLUMN first_name VARCHAR(255) NULL AFTER name,
  ADD COLUMN last_name VARCHAR(255) NULL AFTER first_name,
  ADD COLUMN company_name VARCHAR(255) NULL AFTER last_name;

CREATE INDEX idx_leads_company ON leads (company_name);


-- ============================================
-- End of migration 007
-- ============================================


-- ---------------------------------------------------------------------
-- 008_contact_inquiries.sql
-- Contact Inquiries tables
-- The baseline schema defines these tables, but they were never applied
-- to this live database. `operationsController` and `receptionController`
-- query `contact_inquiries`, so the endpoint would return 500 until restored.
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_inquiries (
    inquiry_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    inquiry_source ENUM('WEBSITE','REFERRAL','SOCIAL_MEDIA','WALK_IN','PHONE','OTHER') DEFAULT 'WEBSITE',
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_is_read (is_read),
    INDEX idx_is_resolved (is_resolved),
    INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS contact_inquiry_attachments (
    attachment_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    inquiry_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES contact_inquiries(inquiry_id) ON DELETE CASCADE,
    INDEX idx_inquiry (inquiry_id)
);


-- ============================================
-- End of migration 008
-- ============================================


-- ---------------------------------------------------------------------
-- 009_course_extra_fields.sql
-- Course extra fields for employee-portal and reception
-- The employee-portal / reception queries expect `courses.category`,
-- `courses.level` and `courses.thumbnail_url`. These columns never existed
-- on the baseline table, so every call to `/v1/employee/courses`,
-- `/v1/reception/...` and similar endpoints returned 500.
-- ---------------------------------------------------------------------

ALTER TABLE courses
  ADD COLUMN category VARCHAR(50) NULL AFTER description,
  ADD COLUMN level VARCHAR(20) NULL AFTER category,
  ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER level;

CREATE INDEX idx_courses_category ON courses (category);


-- ============================================
-- End of migration 009
-- ============================================


-- ---------------------------------------------------------------------
-- 010_approval_chain_name.sql
-- Approval chain name column
-- `/v1/employee/approvals` selects `ac.name` from approval_chains, but the
-- baseline table has no such column. Adding it (nullable) restores the
-- endpoint without changing any upstream code.
-- ---------------------------------------------------------------------

ALTER TABLE approval_chains
  ADD COLUMN name VARCHAR(255) NULL AFTER approval_condition;

CREATE INDEX idx_approval_chains_name ON approval_chains (name);


-- ============================================
-- End of migration 010
-- ============================================

-- ============================================================
-- All migrations 001-010 applied successfully.
-- Verify with:  SELECT * FROM information_schema.tables WHERE table_schema = 'ethiroli';
-- ============================================================- -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   0 1 6 _ s a l e s _ c o m m i s s i o n s _ t a b l e . s q l  
 - -   B D A   C o m m i s s i o n   M a n a g e m e n t  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   s a l e s _ c o m m i s s i o n s   (  
     i d   C H A R ( 3 6 )   P R I M A R Y   K E Y   D E F A U L T   ( U U I D ( ) ) ,  
     d e a l _ i d   C H A R ( 3 6 )   N O T   N U L L ,  
     b d a _ u s e r _ i d   C H A R ( 3 6 )   N O T   N U L L ,  
     e l i g i b l e _ a m o u n t   D E C I M A L ( 1 5 , 2 )   N O T   N U L L   D E F A U L T   0 ,  
     c o m m i s s i o n _ r a t e   D E C I M A L ( 5 , 2 )   N O T   N U L L   D E F A U L T   1 0 . 0 0 ,  
     c o m m i s s i o n _ a m o u n t   D E C I M A L ( 1 5 , 2 )   N O T   N U L L   D E F A U L T   0 ,  
     s t a t u s   E N U M ( ' P e n d i n g   A p p r o v a l ' ,   ' A p p r o v e d ' ,   ' P a y a b l e ' ,   ' P a i d ' ,   ' R e j e c t e d ' )   N O T   N U L L   D E F A U L T   ' P e n d i n g   A p p r o v a l ' ,  
     a p p r o v e d _ b y   C H A R ( 3 6 )   N U L L ,  
     a p p r o v e d _ a t   T I M E S T A M P   N U L L ,  
     p a i d _ a t   T I M E S T A M P   N U L L ,  
     p a y m e n t _ r e f e r e n c e   V A R C H A R ( 1 0 0 )   N U L L ,  
     c r e a t e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P ,  
     u p d a t e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P   O N   U P D A T E   C U R R E N T _ T I M E S T A M P ,  
  
     - -   I n d e x e s   f o r   p e r f o r m a n c e   a n d   q u e r i e s  
     I N D E X   i d x _ d e a l _ i d   ( d e a l _ i d ) ,  
     I N D E X   i d x _ b d a _ u s e r _ i d   ( b d a _ u s e r _ i d ) ,  
     I N D E X   i d x _ s t a t u s   ( s t a t u s ) ,  
     I N D E X   i d x _ c r e a t e d _ a t   ( c r e a t e d _ a t ) ,  
  
     - -   U n i q u e   c o n s t r a i n t   t o   p r e v e n t   d u p l i c a t e   c o m m i s s i o n s   f o r   t h e   s a m e   d e a l  
     U N I Q U E   K E Y   u c _ d e a l _ c o m m i s s i o n   ( d e a l _ i d )  
 ) ;  
  
 - -   U p d a t e   d e a l e r   d e a l s   t a b l e   t o   e n s u r e   l i n k e d _ d e a l _ i d   i s   s e t   p r o p e r l y   o n   c o n v e r s i o n  
 - -   ( T h i s   i s   h a n d l e d   b y   t h e   c o n v e r s i o n   e n d p o i n t ,   b u t   g o o d   t o   h a v e   t h e   i n d e x )  
 C R E A T E   I N D E X   i d x _ s a l e s _ d e a l s _ l i n k e d _ d e a l   O N   s a l e s _ d e a l s   ( l i n k e d _ d e a l _ i d ) ;  
  
 - -   A d d   c o m m i s s i o n a b l e   f l a g   t o   d e a l s   i f   n o t   a l r e a d y   p r e s e n t  
 - -   ( W e ' l l   u s e   t h e   s t a g e   =   ' W O N '   s t a t u s   t o   t r i g g e r   c o m m i s s i o n   g e n e r a t i o n )  
  
 - -   C o m m e n t :   C o m m i s s i o n   i s   c a l c u l a t e d   a s   1 0 %   o f   e l i g i b l e   d e a l   a m o u n t   w h e n   s t a t u s   c h a n g e s   t o   W O N  
 - -   A p p r o v a l   w o r k f l o w :   M a n a g e r   a p p r o v e s   - >   F i n a n c e   p a y s   - >   S t a t u s   c h a n g e s   t o   P a i d  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   0 1 7 _ v i d e o _ p r o j e c t s _ t a b l e . s q l  
 - -   V i d e o   P r o j e c t   M a n a g e m e n t  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   v i d e o _ p r o j e c t s   (  
     i d   C H A R ( 3 6 )   P R I M A R Y   K E Y   D E F A U L T   ( U U I D ( ) ) ,  
     t i t l e   V A R C H A R ( 2 5 5 )   N O T   N U L L ,  
     c l i e n t _ n a m e   V A R C H A R ( 2 5 5 ) ,  
     p r o j e c t _ t y p e   E N U M ( ' M a r k e t i n g ' ,   ' T r a i n i n g ' ,   ' O n b o a r d i n g ' ,   ' S o c i a l   M e d i a ' ,   ' C o r p o r a t e ' ,   ' E v e n t ' )   N O T   N U L L   D E F A U L T   ' M a r k e t i n g ' ,  
     d e s c r i p t i o n   T E X T ,  
     s t a t u s   E N U M ( ' A c t i v e ' ,   ' O n   H o l d ' ,   ' C o m p l e t e d ' ,   ' C a n c e l l e d ' )   D E F A U L T   ' A c t i v e ' ,  
     a s s i g n e d _ e d i t o r   V A R C H A R ( 3 6 ) ,  
     c r e a t e d _ b y   V A R C H A R ( 3 6 ) ,  
     c r e a t e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P ,  
     u p d a t e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P   O N   U P D A T E   C U R R E N T _ T I M E S T A M P ,  
  
     - -   I n d e x e s   f o r   p e r f o r m a n c e   a n d   q u e r i e s  
     I N D E X   i d x _ a s s i g n e d _ e d i t o r   ( a s s i g n e d _ e d i t o r ) ,  
     I N D E X   i d x _ s t a t u s   ( s t a t u s ) ,  
     I N D E X   i d x _ p r o j e c t _ t y p e   ( p r o j e c t _ t y p e ) ,  
  
     - -   F o r e i g n   k e y   t o   l i n k   t o   u s e r s   t a b l e   ( e d i t o r )  
     C O N S T R A I N T   f k _ v i d e o _ e d i t o r   F O R E I G N   K E Y   ( a s s i g n e d _ e d i t o r )   R E F E R E N C E S   u s e r s ( i d )   O N   D E L E T E   S E T   N U L L  
 ) ;  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   0 1 8 _ v i d e o _ t a s k s _ t a b l e . s q l  
 - -   V i d e o   T a s k   T r a c k i n g  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   v i d e o _ t a s k s   (  
     i d   C H A R ( 3 6 )   P R I M A R Y   K E Y   D E F A U L T   ( U U I D ( ) ) ,  
     p r o j e c t _ i d   C H A R ( 3 6 )   N O T   N U L L ,  
     t i t l e   V A R C H A R ( 2 5 5 )   N O T   N U L L ,  
     v i d e o _ t y p e   E N U M ( ' I n s t a g r a m   R e e l ' ,   ' Y o u T u b e   V i d e o ' ,   ' C o r p o r a t e   V i d e o ' ,   ' W e b i n a r ' ,   ' P r o d u c t   D e m o ' ,   ' P r e s e n t a t i o n ' )   N O T   N U L L ,  
     a s s i g n e d _ e d i t o r   V A R C H A R ( 3 6 )   N O T   N U L L ,  
     s t a t u s   E N U M ( ' A s s i g n e d ' ,   ' E d i t i n g ' ,   ' I n t e r n a l   R e v i e w ' ,   ' C l i e n t   R e v i e w ' ,   ' R e v i s i o n ' ,   ' A p p r o v e d ' ,   ' D e l i v e r e d ' )   D E F A U L T   ' A s s i g n e d ' ,  
     p r i o r i t y   E N U M ( ' L o w ' ,   ' M e d i u m ' ,   ' H i g h ' ,   ' U r g e n t ' )   D E F A U L T   ' M e d i u m ' ,  
     e s t i m a t e d _ h o u r s   D E C I M A L ( 5 , 2 )   D E F A U L T   2 . 0 0 ,  
     a c t u a l _ h o u r s   D E C I M A L ( 5 , 2 )   D E F A U L T   0 ,  
     s t a r t _ d a t e   D A T E ,  
     d e a d l i n e   D A T E ,  
     s u b m i t t e d _ d a t e   T I M E S T A M P   N U L L ,  
     s o u r c e _ f i l e s   J S O N ,  
     p r e v i e w _ v i d e o _ u r l   T E X T ,  
     f i n a l _ v i d e o _ u r l   T E X T ,  
     r e v i s i o n _ c o u n t   I N T   D E F A U L T   0 ,  
     a p p r o v a l _ s t a t u s   E N U M ( ' P e n d i n g ' ,   ' A p p r o v e d ' ,   ' R e j e c t e d ' )   D E F A U L T   ' P e n d i n g ' ,  
     n o t e s   T E X T ,  
     c r e a t e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P ,  
     u p d a t e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P   O N   U P D A T E   C U R R E N T _ T I M E S T A M P ,  
  
     - -   I n d e x e s   f o r   p e r f o r m a n c e   a n d   q u e r i e s  
     I N D E X   i d x _ p r o j e c t _ i d   ( p r o j e c t _ i d ) ,  
     I N D E X   i d x _ a s s i g n e d _ e d i t o r   ( a s s i g n e d _ e d i t o r ) ,  
     I N D E X   i d x _ s t a t u s   ( s t a t u s ) ,  
     I N D E X   i d x _ p r i o r i t y   ( p r i o r i t y ) ,  
     I N D E X   i d x _ d e a d l i n e   ( d e a d l i n e ) ,  
  
     - -   F o r e i g n   k e y s  
     C O N S T R A I N T   f k _ t a s k _ p r o j e c t   F O R E I G N   K E Y   ( p r o j e c t _ i d )   R E F E R E N C E S   v i d e o _ p r o j e c t s ( i d )   O N   D E L E T E   C A S C A D E ,  
     C O N S T R A I N T   f k _ t a s k _ e d i t o r   F O R E I G N   K E Y   ( a s s i g n e d _ e d i t o r )   R E F E R E N C E S   u s e r s ( i d )   O N   D E L E T E   S E T   N U L L  
 ) ;  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   0 1 9 _ v i d e o _ w o r k _ l o g s _ t a b l e . s q l  
 - -   D a i l y   W o r k   L o g   &   T i m e   T r a c k i n g  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   v i d e o _ w o r k _ l o g s   (  
     i d   C H A R ( 3 6 )   P R I M A R Y   K E Y   D E F A U L T   ( U U I D ( ) ) ,  
     t a s k _ i d   C H A R ( 3 6 )   N O T   N U L L ,  
     e d i t o r   V A R C H A R ( 3 6 )   N O T   N U L L ,  
     l o g _ d a t e   D A T E   N O T   N U L L ,  
     s t a r t _ t i m e   T I M E   N O T   N U L L ,  
     e n d _ t i m e   T I M E   N O T   N U L L ,  
     a c t u a l _ h o u r s   D E C I M A L ( 5 , 2 )   D E F A U L T   0 ,  
     t a s k _ c o m p l e t e d   T I N Y I N T ( 1 )   D E F A U L T   0 ,  
     b l o c k e r s   J S O N ,  
     n o t e s   T E X T ,  
     c r e a t e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P ,  
  
     - -   I n d e x e s  
     I N D E X   i d x _ t a s k _ i d   ( t a s k _ i d ) ,  
     I N D E X   i d x _ e d i t o r   ( e d i t o r ) ,  
     I N D E X   i d x _ l o g _ d a t e   ( l o g _ d a t e )  
 ) ;  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   0 2 0 _ v i d e o _ r e v i e w s _ t a b l e . s q l  
 - -   R e v i e w   &   A p p r o v a l   T r a c k i n g  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   v i d e o _ r e v i e w s   (  
     i d   C H A R ( 3 6 )   P R I M A R Y   K E Y   D E F A U L T   ( U U I D ( ) ) ,  
     t a s k _ i d   C H A R ( 3 6 )   N O T   N U L L ,  
     r e v i e w e r   V A R C H A R ( 3 6 )   N O T   N U L L ,     - -   T e a m   l e a d e r   o r   P M  
     r e v i e w _ d a t e   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P ,  
     o v e r a l l _ r a t i n g   D E C I M A L ( 3 , 2 )   D E F A U L T   0 ,     - -   1 . 0 0   t o   5 . 0 0   s c a l e  
     c o m m e n t s   T E X T ,  
     a p p r o v e   T I N Y I N T ( 1 )   D E F A U L T   0 ,  
     r e j e c t   T I N Y I N T ( 1 )   D E F A U L T   0 ,  
     r e q u i r e d _ r e v i s i o n s   I N T   D E F A U L T   0 ,  
     s t a t u s   E N U M ( ' P e n d i n g ' ,   ' A p p r o v e d ' ,   ' R e j e c t e d ' )   D E F A U L T   ' P e n d i n g ' ,  
     I N D E X   i d x _ t a s k _ i d   ( t a s k _ i d ) ,  
     I N D E X   i d x _ r e v i e w e r   ( r e v i e w e r )  
 ) ;  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   0 2 1 _ v i d e o _ r e v i s i o n s _ t a b l e . s q l  
 - -   V e r s i o n   H i s t o r y   &   R e v i s i o n s  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   v i d e o _ r e v i s i o n s   (  
     i d   C H A R ( 3 6 )   P R I M A R Y   K E Y   D E F A U L T   ( U U I D ( ) ) ,  
     t a s k _ i d   C H A R ( 3 6 )   N O T   N U L L ,  
     v e r s i o n _ n u m b e r   I N T   D E F A U L T   1 ,  
     p r e v i o u s _ v e r s i o n   I N T   D E F A U L T   0 ,  
     v i d e o _ u r l   T E X T   N O T   N U L L ,     - -   U R L   t o   v i d e o   f i l e  
     r e v i s i o n _ n o t e s   T E X T ,  
     r e v i s e d _ b y   V A R C H A R ( 3 6 ) ,     - -   E d i t o r   w h o   m a d e   c h a n g e s  
     r e v i s e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P ,  
     a p p r o v e d _ b y   V A R C H A R ( 3 6 ) ,     - -   T e a m   l e a d e r   a p p r o v a l  
     a p p r o v e d _ a t   T I M E S T A M P   N U L L ,  
     s t a t u s   E N U M ( ' P e n d i n g   A p p r o v a l ' ,   ' A p p r o v e d ' ,   ' R e j e c t e d ' )   D E F A U L T   ' P e n d i n g   A p p r o v a l ' ,  
     I N D E X   i d x _ t a s k _ i d   ( t a s k _ i d ) ,  
     I N D E X   i d x _ v e r s i o n   ( v e r s i o n _ n u m b e r )  
 ) ;  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
 - -   0 2 2 _ v i d e o _ d e l i v e r i e s _ t a b l e . s q l  
 - -   T a s k   D e l i v e r i e s   &   P a y m e n t  
 - -   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =  
  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   v i d e o _ d e l i v e r i e s   (  
     i d   C H A R ( 3 6 )   P R I M A R Y   K E Y   D E F A U L T   ( U U I D ( ) ) ,  
     t a s k _ i d   C H A R ( 3 6 )   N O T   N U L L ,  
     d e l i v e r e d _ b y   V A R C H A R ( 3 6 ) ,     - -   E d i t o r   w h o   d e l i v e r e d  
     d e l i v e r e d _ a t   T I M E S T A M P   D E F A U L T   C U R R E N T _ T I M E S T A M P ,  
     c l i e n t _ a p p r o v e d   T I N Y I N T ( 1 )   D E F A U L T   0 ,  
     c l i e n t _ c o m m e n t s   T E X T ,  
     p a y m e n t _ a m o u n t   D E C I M A L ( 1 0 , 2 ) ,  
     p a y m e n t _ s t a t u s   E N U M ( ' U n p a i d ' ,   ' P a i d ' ,   ' P e n d i n g   I n v o i c e ' )   D E F A U L T   ' U n p a i d ' ,  
     d e l i v e r y _ n o t e s   T E X T ,  
     I N D E X   i d x _ t a s k _ i d   ( t a s k _ i d )  
 ) ;  
 