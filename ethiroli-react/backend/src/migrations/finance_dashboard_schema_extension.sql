-- ==========================================================
-- FINANCIAL MANAGEMENT EXTENSIONS (Tables 95-97)
-- ==========================================================

-- Table 95: financial_refunds
CREATE TABLE IF NOT EXISTS financial_refunds (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    invoice_id CHAR(36) DEFAULT NULL,
    payment_id CHAR(36) DEFAULT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    reason VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'PROCESSED', 'REJECTED') DEFAULT 'PENDING',
    gateway_refund_id VARCHAR(100) DEFAULT NULL,
    utr_number VARCHAR(100) DEFAULT NULL,
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME DEFAULT NULL,
    processed_by CHAR(36) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_refund_status (status),
    INDEX idx_invoice (invoice_id)
);

-- Table 96: financial_budgets
CREATE TABLE IF NOT EXISTS financial_budgets (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    fiscal_year VARCHAR(10) NOT NULL,
    quarter ENUM('Q1', 'Q2', 'Q3', 'Q4', 'ANNUAL') NOT NULL,
    department ENUM('ENGINEERING', 'MARKETING', 'OPERATIONS', 'HUMAN_RESOURCES', 'GENERAL_ADMIN', 'SALES') NOT NULL,
    category VARCHAR(100) NOT NULL,
    allocated_amount DECIMAL(12,2) NOT NULL,
    spent_amount DECIMAL(12,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    notes TEXT DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_budget_dept (fiscal_year, quarter, department, category),
    INDEX idx_fiscal_dept (fiscal_year, department)
);

-- Table 97: tax_filings
CREATE TABLE IF NOT EXISTS tax_filings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    return_type ENUM('GSTR1', 'GSTR3B', 'GSTR2B', 'TDS_26Q', 'TDS_24Q', 'ADVANCE_TAX') NOT NULL,
    filing_period VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    filed_date DATE DEFAULT NULL,
    arn_number VARCHAR(100) DEFAULT NULL,
    tax_payable DECIMAL(12,2) DEFAULT 0.00,
    tax_paid DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('DRAFT', 'FILED', 'VERIFIED', 'OVERDUE') DEFAULT 'DRAFT',
    acknowledgment_url VARCHAR(500) DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_return_period (return_type, filing_period),
    INDEX idx_tax_status (status)
);

-- Extension to Table 21: transactions (Add payment method and bank reconciliation flags)
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS payment_method ENUM('BANK_TRANSFER', 'UPI', 'CARD', 'CASH', 'CHEQUE', 'RAZORPAY', 'STRIPE') DEFAULT 'BANK_TRANSFER',
ADD COLUMN IF NOT EXISTS reference_number VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_reconciled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reconciled_at DATETIME DEFAULT NULL;
