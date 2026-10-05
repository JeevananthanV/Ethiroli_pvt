-- 015: leave review note
--
-- HR / Admin could approve or reject a leave request but had nowhere to record
-- why. `leaves.approved_by` and `updated_at` already captured who and when, so
-- the employee could see the decision but never the justification. This adds the
-- reviewer's comment, which is surfaced on the employee's Leave Management page
-- and in the decision notification.

ALTER TABLE leaves
  ADD COLUMN review_note VARCHAR(500) NULL DEFAULT NULL AFTER approval_chain_step;
