-- ============================================================================
-- 003_enterprise_rbac_and_boundaries.sql
-- Enterprise RBAC Hierarchy, Granular Permissions, and Security Boundaries
-- ============================================================================

-- 1. Roles Registry with Security Ranks
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  security_rank INT NOT NULL DEFAULT 10,
  is_system_role BOOLEAN NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_roles_rank (security_rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Granular Permissions Catalog
CREATE TABLE IF NOT EXISTS permissions (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  module VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_perm_module (module),
  INDEX idx_perm_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Role-to-Permission Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id VARCHAR(36) NOT NULL,
  permission_id VARCHAR(36) NOT NULL,
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. User-to-Role Assignments (Multi-tenant & auditable)
CREATE TABLE IF NOT EXISTS user_roles (
  id VARCHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  tenant_id VARCHAR(36) NULL,
  assigned_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_role_tenant (user_id, role_id, tenant_id),
  INDEX idx_ur_user (user_id),
  INDEX idx_ur_tenant (tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ABAC Contextual Rules / Policy Predicates
CREATE TABLE IF NOT EXISTS policy_rules (
  id VARCHAR(36) PRIMARY KEY,
  role_id VARCHAR(36) NOT NULL,
  permission_code VARCHAR(100) NOT NULL,
  predicate_expression JSON NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pr_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  INDEX idx_pr_role_perm (role_id, permission_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Break-Glass Emergency Authorizations
CREATE TABLE IF NOT EXISTS break_glass_events (
  id VARCHAR(36) PRIMARY KEY,
  initiator_user_id CHAR(36) NOT NULL,
  approver_user_id CHAR(36) NULL,
  reason TEXT NOT NULL,
  incident_ticket_id VARCHAR(100) NOT NULL,
  status ENUM('PENDING', 'ACTIVE', 'REVOKED', 'EXPIRED') DEFAULT 'PENDING',
  activated_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  ip_address VARCHAR(45) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bg_initiator FOREIGN KEY (initiator_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- SEED DATA: Roles Hierarchy
-- ============================================================================
INSERT IGNORE INTO roles (id, code, name, description, security_rank, is_system_role) VALUES
  ('role-super-admin', 'SUPER_ADMIN', 'Super Administrator', 'Root system and governance authority with platform-wide scope', 100, 1),
  ('role-admin',       'ADMIN',       'Standard Administrator', 'Operational domain administrator with hierarchy boundaries', 80, 1),
  ('role-hr',          'HR',          'Human Resources Manager', 'Talent acquisition, attendance, and leave management', 60, 1),
  ('role-finance',     'FINANCE',     'Financial Controller', 'Payroll processing, invoices, and ledger audits', 60, 1),
  ('role-pm',          'PM',          'Project Manager', 'Project roadmaps, milestone tracking, and task oversight', 40, 1),
  ('role-tutor',       'TUTOR',       'Academic Instructor', 'Course delivery, question banking, and student assessment', 40, 1),
  ('role-employee',    'EMPLOYEE',    'Staff Employee', 'Internal staff member with departmental responsibilities', 20, 1),
  ('role-intern',      'INTERN',      'Apprentice Intern', 'Vocational trainee undergoing skills development', 20, 1),
  ('role-student',     'STUDENT',     'Enrolled Learner', 'Active course enrollee accessing dynamic learning player', 10, 1);

-- ============================================================================
-- SEED DATA: Granular Enterprise Permissions
-- ============================================================================
INSERT IGNORE INTO permissions (id, code, module, action, description) VALUES
  -- User & Role Management
  ('p-user-read',          'user:read',                     'USER',       'READ',    'Inspect user profiles and directories'),
  ('p-user-create',        'user:create',                   'USER',       'CREATE',  'Provision new users within allowed rank'),
  ('p-user-update',        'user:update',                   'USER',       'UPDATE',  'Modify subordinate user accounts'),
  ('p-user-delete',        'user:delete',                   'USER',       'DELETE',  'Soft-deactivate subordinate users'),
  ('p-user-purge',         'user:purge',                    'USER',       'DELETE',  'Permanently purge user accounts from database'),
  ('p-user-role-assign',   'user:role_assign',              'USER',       'EXECUTE', 'Assign subordinate security roles to users'),
  ('p-user-pwd-reset',     'user:password_reset',           'USER',       'EXECUTE', 'Trigger credential resets for subordinate users'),
  ('p-user-lock',          'user:lock',                     'USER',       'UPDATE',  'Lock compromised subordinate accounts'),

  -- Billing & Subscription Operations
  ('p-bill-plan-view',     'billing:plan_view',             'BILLING',    'READ',    'View subscription tier, quotas, and usage'),
  ('p-bill-plan-mod',      'billing:plan_modify',           'BILLING',    'UPDATE',  'Upgrade, downgrade, or cancel subscription plans'),
  ('p-bill-pay-view',      'billing:payment_view',          'BILLING',    'READ',    'View masked payment instruments'),
  ('p-bill-pay-mod',       'billing:payment_modify',        'BILLING',    'UPDATE',  'Register or modify billing payment methods'),
  ('p-bill-inv-view',      'billing:invoice_view',          'BILLING',    'READ',    'View and export invoices and receipts'),
  ('p-pay-disp-flag',      'payroll:dispute_flag',          'FINANCE',    'CREATE',  'Flag payroll records as disputed'),
  ('p-pay-disp-res',       'payroll:dispute_resolve',       'FINANCE',    'UPDATE',  'Reconcile payroll disputes within threshold'),
  ('p-pay-disp-unlim',     'payroll:dispute_resolve_unlimited', 'FINANCE', 'UPDATE', 'Reconcile payroll disputes exceeding ₹25,000 threshold'),

  -- System Configuration & Integrations
  ('p-sys-cfg-read',       'system:config_read',            'SYSTEM',     'READ',    'View system configurations and settings'),
  ('p-sys-cfg-mod',        'system:config_modify',          'SYSTEM',     'UPDATE',  'Modify tenant and global platform configs'),
  ('p-api-keys',           'api_keys:manage',               'SYSTEM',     'EXECUTE', 'Generate, inspect, and revoke API keys'),
  ('p-webhooks',           'webhooks:manage',               'SYSTEM',     'EXECUTE', 'Register and manage webhook endpoints'),
  ('p-sso',                'sso:manage',                    'SYSTEM',     'EXECUTE', 'Configure SAML 2.0 / OIDC identity providers'),
  ('p-mfa',                'mfa:policy_enforce',            'SYSTEM',     'UPDATE',  'Enforce mandatory MFA and authentication rules'),
  ('p-ff-manage',          'feature_flags:manage',          'SYSTEM',     'EXECUTE', 'Create, update, and toggle feature flags'),
  ('p-ff-kill',            'feature_flags:kill_switch',     'SYSTEM',     'EXECUTE', 'Engage emergency platform-wide kill-switch'),

  -- Audit, Logging, and Compliance
  ('p-audit-domain',       'audit:view_domain',             'COMPLIANCE', 'READ',    'View operational activity stream for domain'),
  ('p-audit-sec',          'audit:view_security',           'COMPLIANCE', 'READ',    'View unfiltered security audit logs'),
  ('p-audit-export',       'audit:export',                  'COMPLIANCE', 'EXECUTE', 'Export audit logs and compliance reports'),
  ('p-audit-ret',          'audit:retention_modify',        'COMPLIANCE', 'UPDATE',  'Configure audit retention policies'),

  -- Security & Access Controls
  ('p-sec-sess-term',      'security:session_terminate',    'SECURITY',   'EXECUTE', 'Terminate subordinate user sessions'),
  ('p-sec-sess-all',       'security:session_revoke_all',   'SECURITY',   'EXECUTE', 'Emergency cluster-wide session revocation'),
  ('p-sec-ip-block',       'security:ip_block',             'SECURITY',   'EXECUTE', 'Block malicious IP addresses and CIDR ranges'),
  ('p-sec-cluster-tel',    'security:cluster_telemetry',    'SECURITY',   'READ',    'Inspect live multi-worker cluster telemetry'),
  ('p-sec-cluster-rel',    'security:cluster_reload',       'SECURITY',   'EXECUTE', 'Trigger zero-downtime rolling worker reload'),
  ('p-sec-break-glass',    'security:break_glass',          'SECURITY',   'EXECUTE', 'Initiate emergency break-glass procedure');

-- ============================================================================
-- SEED DATA: Map All Permissions to SUPER_ADMIN
-- ============================================================================
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-super-admin', id FROM permissions;

-- ============================================================================
-- SEED DATA: Map Operational Permissions to ADMIN
-- ============================================================================
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 'role-admin', id FROM permissions
WHERE code IN (
  'user:read', 'user:create', 'user:update', 'user:delete', 'user:role_assign', 'user:password_reset', 'user:lock',
  'billing:plan_view', 'billing:payment_view', 'billing:invoice_view',
  'payroll:dispute_flag', 'payroll:dispute_resolve',
  'system:config_read', 'system:config_modify', 'api_keys:manage', 'webhooks:manage',
  'feature_flags:manage',
  'audit:view_domain', 'audit:export',
  'security:session_terminate', 'security:ip_block', 'security:cluster_telemetry', 'security:cluster_reload'
);

-- ============================================================================
-- SEED DATA: Sync Existing Users to user_roles
-- ============================================================================
INSERT IGNORE INTO user_roles (id, user_id, role_id, assigned_by, assigned_at)
SELECT UUID(), u.id, r.id, 'SYSTEM', NOW()
FROM users u
JOIN roles r ON u.role = r.code;
