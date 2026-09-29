-- ================================================================
-- 005: FORUM CATEGORIES & POST VOTING
-- Database: ethiroli
--
-- The forum UI exposes a Category selector and an Upvote button, but
-- forum_posts has no category column and no votes table exists, so both
-- silently did nothing (the vote call 404'd). This migration adds:
--   1. forum_posts.category   - selectable, filterable thread category
--   2. forum_post_votes       - one upvote per user per post
--
-- Apply with:  node backend/scripts/apply-migration.js 005
-- All statements are idempotent and safe to re-run.
-- ================================================================

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
