-- ============================================================================
-- 016_sales_commissions_table.sql
-- BDA Commission Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS sales_commissions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  deal_id CHAR(36) NOT NULL,
  bda_user_id CHAR(36) NOT NULL,
  eligible_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  commission_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  status ENUM('Pending Approval', 'Approved', 'Payable', 'Paid', 'Rejected') NOT NULL DEFAULT 'Pending Approval',
  approved_by CHAR(36) NULL,
  approved_at TIMESTAMP NULL,
  paid_at TIMESTAMP NULL,
  payment_reference VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes for performance and queries
  INDEX idx_deal_id (deal_id),
  INDEX idx_bda_user_id (bda_user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),

  -- Unique constraint to prevent duplicate commissions for the same deal
  UNIQUE KEY uc_deal_commission (deal_id)
);

-- Add linked_deal_id column if not exists, then create index
ALTER TABLE sales_deals ADD COLUMN IF NOT EXISTS linked_deal_id CHAR(36) NULL;
ALTER TABLE sales_deals ADD INDEX IF NOT EXISTS idx_sales_deals_linked_deal (linked_deal_id);

-- Add commissionable flag to deals if not already present
-- (We'll use the stage = 'WON' status to trigger commission generation)

-- Comment: Commission is calculated as 10% of eligible deal amount when status changes to WON
-- Approval workflow: Manager approves -> Finance pays -> Status changes to Paid