-- ==========================================================
-- RECEPTION & FRONT DESK EXTENSIONS (Tables 103-104)
-- ==========================================================

USE ethiroli;

-- Table 103: reception_appointments
CREATE TABLE IF NOT EXISTS reception_appointments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    visitor_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    company VARCHAR(255) DEFAULT NULL,
    purpose VARCHAR(255) NOT NULL,
    person_to_meet CHAR(36) DEFAULT NULL,
    person_to_meet_name VARCHAR(255) DEFAULT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    badge_number VARCHAR(50) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (person_to_meet) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_appt_date (appointment_date),
    INDEX idx_appt_status (status),
    INDEX idx_appt_host (person_to_meet)
);

-- Table 104: reception_receipts
CREATE TABLE IF NOT EXISTS reception_receipts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_id CHAR(36) DEFAULT NULL,
    course_id CHAR(36) DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_mode ENUM('CASH', 'UPI', 'CARD', 'NET_BANKING') DEFAULT 'UPI',
    purpose ENUM('TUITION_FEE', 'ADMISSION_FEE', 'EXAM_FEE', 'CERTIFICATE_FEE', 'OTHER') DEFAULT 'ADMISSION_FEE',
    issued_by CHAR(36) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_reference VARCHAR(100) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_receipt_num (receipt_number),
    INDEX idx_receipt_issued (issued_at)
);
