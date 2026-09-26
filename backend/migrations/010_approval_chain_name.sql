-- ============================================================================
-- 010_approval_chain_name.sql
--
-- `/v1/employee/approvals` selects `ac.name` from approval_chains, but the
-- baseline table has no such column. Adding it (nullable) restores the
-- endpoint without changing any upstream code.
-- ============================================================================

ALTER TABLE approval_chains
  ADD COLUMN name VARCHAR(255) NULL AFTER approval_condition;

CREATE INDEX idx_approval_chains_name ON approval_chains (name);
