--
-- Complete Production / Live SQL Seed Script
-- Primary Role Login Credentials (11 Roles) + Seeded Intern Accounts (5 Interns)
-- Generated on: 2026-10-13T05:54:03.434Z
--
SET FOREIGN_KEY_CHECKS = 0;

-- Ensure essential auth & profile tables exist in production
CREATE TABLE IF NOT EXISTS `user_credentials` (
  `user_id` char(36) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_algo` varchar(30) NOT NULL DEFAULT 'BCRYPT',
  `password_updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `failed_login_attempts` int(11) NOT NULL DEFAULT 0,
  `lockout_until` timestamp NULL DEFAULT NULL,
  `requires_password_change` tinyint(1) NOT NULL DEFAULT 0,
  `password_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_uc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `interns` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `mentor_id` char(36) DEFAULT NULL,
  `college_name` varchar(255) DEFAULT NULL,
  `stipend` decimal(10,2) DEFAULT 0.00,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `project_target` varchar(255) DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_intern_user` (`user_id`),
  KEY `idx_intern_mentor` (`mentor_id`),
  CONSTRAINT `fk_intern_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- [SUPER_ADMIN] admin@ethiroli.com (Super Administrator)
-- Password: Admin@123 | Portal: /auth/super-admin/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('368f5c88-12cd-11ed-861d-0242ac120002', '723770bf76abc5aa33fdac9e:e9f51fcdf27159375f7ddd4d23807636:f6875731e51b53f044f0794ee54510d2110f', '$2b$12$tjkRN0uGVqretPlMlLqI5Oe2817HGGLC0RCvUHGBxigx9gR/AXHJW', 'f55ac0d35e1c1f98c49a6f39:eb7df635ba2153260963abdc5b23823e:ac3ed04fb628de277e8f0a4a518b35ff3f8d55', NULL, 'SUPER_ADMIN', 1, '{"department":"Executive Operations","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'SUPER_ADMIN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('368f5c88-12cd-11ed-861d-0242ac120002', '$2b$12$tjkRN0uGVqretPlMlLqI5Oe2817HGGLC0RCvUHGBxigx9gR/AXHJW', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$tjkRN0uGVqretPlMlLqI5Oe2817HGGLC0RCvUHGBxigx9gR/AXHJW"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);

-- [ADMIN] orgadmin@ethiroli.com (Organization Admin)
-- Password: Admin@123 | Portal: /auth/admin/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('bef7a014-983a-4041-89a1-c8cfa4590993', '096f2daf6bb8534451b7ca22:99f931f5373ef6b958727aa5b7ce46c2:bf631e5683270818fe02a8e85d1916dc5e1dbe56dc', '$2b$12$Y2qklBaSTOKe8en4qOB7VOPTHU8TTGxXLOdKuzRLcnfmlb7JiFrAe', '37a721997b767f4ecee41dd9:8426169c4ddf3ce723e76ff7aa25ed52:e3e18a250774a30a0f77c2e384c999d9050d', NULL, 'ADMIN', 1, '{"department":"Administration","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'ADMIN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('bef7a014-983a-4041-89a1-c8cfa4590993', '$2b$12$Y2qklBaSTOKe8en4qOB7VOPTHU8TTGxXLOdKuzRLcnfmlb7JiFrAe', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$Y2qklBaSTOKe8en4qOB7VOPTHU8TTGxXLOdKuzRLcnfmlb7JiFrAe"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);

-- [HR] hr@ethiroli.com (HR Manager)
-- Password: Hr@123 | Portal: /auth/hr/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('0fa117ca-5edf-4687-b099-54290e40ffe1', '9944bc544d9ea138e00b990d:2a43c796e07c7a34783e55ff1e96c577:7626b327ccc947bc4a00b75389c655', '$2b$12$9e/QX95IkijRF0DDRSQ7X.HnUAcm04l6fai7qJmUKAp1U27ln0X4S', 'c5784ff0c040ac2cd1bb2e24:923125a78a55d29a9d0e483e5f9efa1d:584f32f1a62be555dbea', NULL, 'HR', 1, '{"department":"Human Resources","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'HR',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('0fa117ca-5edf-4687-b099-54290e40ffe1', '$2b$12$9e/QX95IkijRF0DDRSQ7X.HnUAcm04l6fai7qJmUKAp1U27ln0X4S', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$9e/QX95IkijRF0DDRSQ7X.HnUAcm04l6fai7qJmUKAp1U27ln0X4S"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
VALUES ('fff74cdb-65e3-4158-b77e-cf81e49498c4', '0fa117ca-5edf-4687-b099-54290e40ffe1', 'EMP-102', 'Human Resources', 'HR Lead & Talent Ops', CURDATE())
ON DUPLICATE KEY UPDATE
  employee_code = VALUES(employee_code),
  department = VALUES(department),
  designation = VALUES(designation);

-- [TUTOR] tutor@ethiroli.com (Verified Senior Instructor)
-- Password: Tutor@123 | Portal: /auth/tutor/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('c60caddb-2848-492a-8724-4e7ec5d55850', '45d92b301139716fe1e12085:489449cddd8d4a50f832f42539c0d32a:14fc42a0fd22c172fc4aaa1f59be48862463', '$2b$12$98.bQwZKLJqPMcBnLxtU/OTtWVPvI8pqwCoU3MNh6AXY.VFV8ciKm', '631c473bb519d9e01ac63fb3:6f27263046076850ed3c8935adf52369:4ded3be60413ef538ce5a4ec9f748dd2443f673c476fb811887b', NULL, 'TUTOR', 1, '{"department":"Academics & Training","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'TUTOR',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('c60caddb-2848-492a-8724-4e7ec5d55850', '$2b$12$98.bQwZKLJqPMcBnLxtU/OTtWVPvI8pqwCoU3MNh6AXY.VFV8ciKm', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$98.bQwZKLJqPMcBnLxtU/OTtWVPvI8pqwCoU3MNh6AXY.VFV8ciKm"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);

-- [PROJECT_MANAGER] pm@ethiroli.com (Project Manager)
-- Password: Pm@123 | Portal: /auth/pm/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('4433911c-04f6-4dc3-8738-e25ba5b1b4d4', 'ef6bacbe5becc007bb0e63f4:85c127605285601f88789fc7eb141878:16dd2621c6664fedd27e4713f566ef', '$2b$12$Ga6WUB2KCfCShtD9w2GJ5eL4BB2Z/wxf5A1.QKo/htX9bivu35waW', '282c525dddf81a8c82f2673f:cc1119fb21437ccb32aeca4eec130c9d:d0b1eff3dc5440d68a3ce9e541a459', NULL, 'PROJECT_MANAGER', 1, '{"department":"Project Delivery","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'PROJECT_MANAGER',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('4433911c-04f6-4dc3-8738-e25ba5b1b4d4', '$2b$12$Ga6WUB2KCfCShtD9w2GJ5eL4BB2Z/wxf5A1.QKo/htX9bivu35waW', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$Ga6WUB2KCfCShtD9w2GJ5eL4BB2Z/wxf5A1.QKo/htX9bivu35waW"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
VALUES ('c44ffd9c-7564-4d85-aad4-fd31b54af69d', '4433911c-04f6-4dc3-8738-e25ba5b1b4d4', 'EMP-103', 'Project Delivery', 'Technical Project Manager', CURDATE())
ON DUPLICATE KEY UPDATE
  employee_code = VALUES(employee_code),
  department = VALUES(department),
  designation = VALUES(designation);

-- [FINANCE] finance@ethiroli.com (Finance Lead)
-- Password: Finance@123 | Portal: /auth/finance/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('8a8b4cfb-012a-4072-a24f-6cd999e9e007', 'ba19cdc0a1bb6536e110630f:21ae84d4ae9da2225fa11384c7d1dbbb:9a7de1d8a90e5188dab45d3fcdcf8b7ebf798868', '$2b$12$SHqpm4HR8OfAWWJXD2Y3QOVmwf2v/QOUnXY1yYpcMqCNktzOEfgVO', '0a4d82cdb2aaaff665584447:4ad222be01d53f396f33fcb2bcc3b6ee:57e454a23c7237b81cead8de', NULL, 'FINANCE', 1, '{"department":"Finance & Accounts","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'FINANCE',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('8a8b4cfb-012a-4072-a24f-6cd999e9e007', '$2b$12$SHqpm4HR8OfAWWJXD2Y3QOVmwf2v/QOUnXY1yYpcMqCNktzOEfgVO', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$SHqpm4HR8OfAWWJXD2Y3QOVmwf2v/QOUnXY1yYpcMqCNktzOEfgVO"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
VALUES ('e351874e-f2e0-43ae-b57f-6fb0320c6585', '8a8b4cfb-012a-4072-a24f-6cd999e9e007', 'EMP-104', 'Finance & Accounts', 'Finance & Accounts Specialist', CURDATE())
ON DUPLICATE KEY UPDATE
  employee_code = VALUES(employee_code),
  department = VALUES(department),
  designation = VALUES(designation);

-- [SALES] sales@ethiroli.com (Sales Executive)
-- Password: Sales@123 | Portal: /auth/sales/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('a25602e3-ecd5-4fbf-a833-284bf9d36909', '074da5370a0fa5ebc734db45:d1d9039ce289c48920dffdc1d21a7eaf:8e57168f7964e0b74fd0b94d6447db6ca687', '$2b$12$kucK.8f6b7g96Qg3UmPO8OPGE/1Se2EAXOo.Cc106UWp4maTvk8S2', '356c252d144e11f745667e78:7204c438ffda51e955af695e3cae46f6:411aab437068155cfa8612e7faf68c', NULL, 'SALES', 1, '{"department":"Sales & Growth","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'SALES',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('a25602e3-ecd5-4fbf-a833-284bf9d36909', '$2b$12$kucK.8f6b7g96Qg3UmPO8OPGE/1Se2EAXOo.Cc106UWp4maTvk8S2', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$kucK.8f6b7g96Qg3UmPO8OPGE/1Se2EAXOo.Cc106UWp4maTvk8S2"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
VALUES ('2242c222-cd21-4176-8599-7b0eb1f475ba', 'a25602e3-ecd5-4fbf-a833-284bf9d36909', 'EMP-105', 'Sales & Growth', 'Business Development Executive', CURDATE())
ON DUPLICATE KEY UPDATE
  employee_code = VALUES(employee_code),
  department = VALUES(department),
  designation = VALUES(designation);

-- [RECEPTION] reception@ethiroli.com (Front Desk Officer)
-- Password: Reception@123 | Portal: /auth/reception/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', 'd037976d6b670d8f6aaf7b11:1c7d9cd7249239975e286862e991feea:6ab4ddc3603d58c18cc654f96782a4faba00d101684f', '$2b$12$SztNhOH8vNJFuY0dkWV5A.C.OIsIAz/wwKrjtzDwSAy77HBjLmsES', 'd221351f6ec6ef003f00c072:0c1e0ca3117ec4680e58a786413fb640:02b2f7ca24bdb15cb53eee05bef2e286484a', NULL, 'RECEPTION', 1, '{"department":"Front Desk & Operations","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'RECEPTION',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', '$2b$12$SztNhOH8vNJFuY0dkWV5A.C.OIsIAz/wwKrjtzDwSAy77HBjLmsES', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$SztNhOH8vNJFuY0dkWV5A.C.OIsIAz/wwKrjtzDwSAy77HBjLmsES"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
VALUES ('46fd39bb-80b8-4383-8cc5-8a2d83447a51', '7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', 'EMP-106', 'Front Desk & Operations', 'Front Desk Officer', CURDATE())
ON DUPLICATE KEY UPDATE
  employee_code = VALUES(employee_code),
  department = VALUES(department),
  designation = VALUES(designation);

-- [EMPLOYEE] employee@ethiroli.com (Senior Engineer)
-- Password: Employee@123 | Portal: /auth/employee/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('74e45a32-92ab-40f5-97c0-c888d7284c48', 'f705510f6931e0c2bb53a848:bd583fb9d508f5a5785a220d1b6e435b:7673be4874a36d602d750a417aaee61cf69388617e', '$2b$12$MwsiI6XzQiLXLWy5B2MssOstebVUQCAz.GkABTYcNzRa4QGb7D6bW', 'cf5160f97b8419be51580eab:43669fd59003245cbc466abc79d41ffb:d69c07e86d5db989b1fb96384c5ffc', NULL, 'EMPLOYEE', 1, '{"department":"Engineering","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'EMPLOYEE',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('74e45a32-92ab-40f5-97c0-c888d7284c48', '$2b$12$MwsiI6XzQiLXLWy5B2MssOstebVUQCAz.GkABTYcNzRa4QGb7D6bW', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$MwsiI6XzQiLXLWy5B2MssOstebVUQCAz.GkABTYcNzRa4QGb7D6bW"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO employees (id, user_id, employee_code, department, designation, date_of_joining)
VALUES ('0e9212c3-a937-4700-a7e4-d3d052693bd9', '74e45a32-92ab-40f5-97c0-c888d7284c48', 'EMP-101', 'Engineering', 'Senior Full Stack Developer', CURDATE())
ON DUPLICATE KEY UPDATE
  employee_code = VALUES(employee_code),
  department = VALUES(department),
  designation = VALUES(designation);

-- [STUDENT] student@ethiroli.com (Ethiroli Student)
-- Password: Student@123 | Portal: /auth/student/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('39a59061-1113-49a8-8d63-4558bb4e70f4', '7f26bdc38553dd76c68db2d2:16b3295533fac8011efe2c86d6fdd61d:94ae2d450a03d8ddf75e88ead3af5b125ac03e2c', '$2b$12$sq.hiRCrdbCDT3FY1QoAduOJdKPLxciKeiOVC2iybkMg7QopF/pmS', '1ce0021adb64c0eae0cef965:4b4252876eb7c6328415ea4330161ff2:6d8b4f8661c38466672e186df162b820', NULL, 'STUDENT', 1, '{"department":"Computer Science","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'STUDENT',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('39a59061-1113-49a8-8d63-4558bb4e70f4', '$2b$12$sq.hiRCrdbCDT3FY1QoAduOJdKPLxciKeiOVC2iybkMg7QopF/pmS', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$sq.hiRCrdbCDT3FY1QoAduOJdKPLxciKeiOVC2iybkMg7QopF/pmS"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);

-- [INTERN] intern@ethiroli.com (Software Intern)
-- Password: Intern@123 | Portal: /auth/intern/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('c5ec486b-ab51-437d-b6f1-3e0c25a36de3', '426e057d06ba50fefdedfe04:0af9048c77553bf34ab67e71b74143f2:58db2a8d5815a19ee49a0398d5e72111ab3b8d', '$2b$12$RXWpDBLS/8RuZgEmMN2lv.8vKtIuHMr/ilf.xDFrKyKjV/PBJUVAy', '37a5b8a60ac33eb393a2af19:0ef0a9947802a32dd8e7db038772a157:0794ab99f83567e86dbcf24ca6b740', NULL, 'INTERN', 1, '{"department":"Software Engineering","college":"Anna University, Chennai","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('c5ec486b-ab51-437d-b6f1-3e0c25a36de3', '$2b$12$RXWpDBLS/8RuZgEmMN2lv.8vKtIuHMr/ilf.xDFrKyKjV/PBJUVAy', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$RXWpDBLS/8RuZgEmMN2lv.8vKtIuHMr/ilf.xDFrKyKjV/PBJUVAy"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('884fb3b0-32fa-4664-ba2e-f431b6f0ae83', 'c5ec486b-ab51-437d-b6f1-3e0c25a36de3', NULL, 'Anna University, Chennai', 15000, '2026-10-13', '2027-01-11', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- [INTERN] gokulrajkumar2006@gmail.com (Gokul Rajkumar)
-- Password: CFemE8r!i6K3Od | Portal: /auth/intern/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '197c5d15592a43790ea15cb9:13b5aea84b313b772b2a461af6dc915b:017f7f3f09ea52da5faf92d5f7ef27ccdcba142744b23cd6ebc92a', '$2b$12$XG41/AkV8JkU3o6TJV7gkeBREa6K0gYxIeqnVrMtGVetMdUm.iCDu', '335c84d4db40a9c9173d0b3c:1ae6e37d43dc16b77d903af16a4649b2:e8f18ab7f4a1ff84875d59cf411b', NULL, 'INTERN', 1, '{"department":"Software Engineering","college":"Anna University","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '$2b$12$XG41/AkV8JkU3o6TJV7gkeBREa6K0gYxIeqnVrMtGVetMdUm.iCDu', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$XG41/AkV8JkU3o6TJV7gkeBREa6K0gYxIeqnVrMtGVetMdUm.iCDu"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('af5964a2-627c-40a6-b6c1-6f5db35e08ed', '58a8ee15-79a5-473f-ac95-c97bc03d3394', NULL, 'Anna University', 15000, '2026-10-13', '2027-01-11', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- [INTERN] srinithikumar54@gmail.com (Srinithi Kumar)
-- Password: NHCg0ZUU!laqM! | Portal: /auth/intern/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', 'dce14f3cf7898a7c500f1773:f6d337cfa3c380fc88b31b090d327288:10c118962504875caee5198bde8d8e1324701a88e05f419b62', '$2b$12$dFkqL2PxilVraogAOumAxObDMMzoJ5GiG/9xQhHUIhFuUx11nuML.', '4c26deefa79cfabbef09a9b6:929cb9663594dadba55f8b3371471da7:ce5263f57efb3fbbfb4143d1e88b', NULL, 'INTERN', 1, '{"department":"Full Stack Development","college":"PSG College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', '$2b$12$dFkqL2PxilVraogAOumAxObDMMzoJ5GiG/9xQhHUIhFuUx11nuML.', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$dFkqL2PxilVraogAOumAxObDMMzoJ5GiG/9xQhHUIhFuUx11nuML."]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('adcd3ce5-b4ea-43c9-a0a8-bd28871c20af', '45d3f678-47a0-442d-8330-9731b2d883b9', NULL, 'PSG College of Technology', 15000, '2026-10-13', '2027-01-11', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- [INTERN] sloganathan0105@gmail.com (S Loganathan)
-- Password: DF&m!RPpGspUGV | Portal: /auth/intern/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', 'f24dcded34523c67e52cccd7:daba46bb0d470fb6822c3164b2b32e75:eb756409803a1299138b6b764c47162ba707755ccfe19d94df', '$2b$12$2Sfk3Bny59i9kcOBZ0OfsOSYk00axMd0nxLTW4aeebMsOaIcSaPs.', '258c9c2cc31875bbd49fd2af:b878ce9f017fb28f0bdc4aa08198912c:09c3b5cdfe44506d4ef6fce1', NULL, 'INTERN', 1, '{"department":"Web Applications","college":"Coimbatore Institute of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', '$2b$12$2Sfk3Bny59i9kcOBZ0OfsOSYk00axMd0nxLTW4aeebMsOaIcSaPs.', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$2Sfk3Bny59i9kcOBZ0OfsOSYk00axMd0nxLTW4aeebMsOaIcSaPs."]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('b8e8aa7a-3665-4373-8bb4-358fa24d9396', '584f6dc7-adaf-4fb5-8cd6-03987543d776', NULL, 'Coimbatore Institute of Technology', 15000, '2026-10-13', '2027-01-11', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- [INTERN] stephen862k7@gmail.com (Stephen)
-- Password: 1c9eN#OFQp73&S | Portal: /auth/intern/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '75a91c45b6b5d1682a950693:85b20a634887ab78916d13468c1cc5ad:6e6b816b6534ede5d78b6972af109eb20d6cfb4cd617', '$2b$12$JFxsnRWHLthWuqZvR.4wyO6HvowOgMznahavwlNqHH8klPfMCNjW6', '4abf1a40aa0922775c8e95b2:3b3e61c3a57ee59f94648eca74fb7560:dc8b592077ffcc', NULL, 'INTERN', 1, '{"department":"Frontend Engineering","college":"Government College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '$2b$12$JFxsnRWHLthWuqZvR.4wyO6HvowOgMznahavwlNqHH8klPfMCNjW6', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$JFxsnRWHLthWuqZvR.4wyO6HvowOgMznahavwlNqHH8klPfMCNjW6"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('9ff4b4f5-2803-40f7-a868-d5133f4ab264', '69fa12f1-7d71-4c2a-8122-c8c12ed8754a', NULL, 'Government College of Technology', 15000, '2026-10-13', '2027-01-11', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- [INTERN] Barathappu777@gmail.com (Barath Appu)
-- Password: sKotWmDqMrjpv0 | Portal: /auth/intern/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', 'f7972af8ac8555bf6a245a88:c5c9a70c41c6bb26aa6e10df9b013daa:287c0e04bb2480a04c52810fa91ac3d979a5a33f9ecdb7', '$2b$12$Hdhnmbn/SjnbfNb9mvbHq.x3ER3c6y.YtSeosmrf3z2AKWFz9UYo.', '3f5588b49fea9f372beb70e9:e400f2338f6f6984bd2db839f419867b:46764a0203c24031207064', NULL, 'INTERN', 1, '{"department":"Backend Engineering","college":"SRM Institute of Science and Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', '$2b$12$Hdhnmbn/SjnbfNb9mvbHq.x3ER3c6y.YtSeosmrf3z2AKWFz9UYo.', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$Hdhnmbn/SjnbfNb9mvbHq.x3ER3c6y.YtSeosmrf3z2AKWFz9UYo."]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('c56a5051-e898-4afb-897e-61b5eeebe9ba', 'd17aab8c-9280-445f-85ce-cc2a93764ddb', NULL, 'SRM Institute of Science and Technology', 15000, '2026-10-13', '2027-01-11', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

SET FOREIGN_KEY_CHECKS = 1;