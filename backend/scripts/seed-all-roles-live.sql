--
-- Complete Production / Live SQL Seed Script
-- Primary Role Login Credentials (11 Roles) + Seeded Intern Accounts (5 Interns)
-- Generated on: 2026-10-13T05:44:42.884Z
--
SET FOREIGN_KEY_CHECKS = 0;

-- [SUPER_ADMIN] admin@ethiroli.com (Super Administrator)
-- Password: Admin@123 | Portal: /auth/super-admin/login
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('368f5c88-12cd-11ed-861d-0242ac120002', '723770bf76abc5aa33fdac9e:e9f51fcdf27159375f7ddd4d23807636:f6875731e51b53f044f0794ee54510d2110f', '$2b$12$X9rSuRZWVMxz3W7JxC9PsOH.t5s4rm4z3IaZuhSlgxjUydny8ElAm', 'cf21af583da331814c178075:e8caa2623b91c4951875591d9df10feb:e0526f4c72e9b6b82b1a390857ef5060754b3b', NULL, 'SUPER_ADMIN', 1, '{"department":"Executive Operations","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'SUPER_ADMIN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('368f5c88-12cd-11ed-861d-0242ac120002', '$2b$12$X9rSuRZWVMxz3W7JxC9PsOH.t5s4rm4z3IaZuhSlgxjUydny8ElAm', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$X9rSuRZWVMxz3W7JxC9PsOH.t5s4rm4z3IaZuhSlgxjUydny8ElAm"]')
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
VALUES ('bef7a014-983a-4041-89a1-c8cfa4590993', '096f2daf6bb8534451b7ca22:99f931f5373ef6b958727aa5b7ce46c2:bf631e5683270818fe02a8e85d1916dc5e1dbe56dc', '$2b$12$VVLDpui5GfpJeN4BxhkSWeGE3uH2OESnBcNwZ6VeJ/A7rdzNFMMb2', '2bac0acf1b3192bb01e333f5:5dac9f77048ba0483df7eb5e85403546:f57a940d3728360436a377bc847ae65bbaef', NULL, 'ADMIN', 1, '{"department":"Administration","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'ADMIN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('bef7a014-983a-4041-89a1-c8cfa4590993', '$2b$12$VVLDpui5GfpJeN4BxhkSWeGE3uH2OESnBcNwZ6VeJ/A7rdzNFMMb2', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$VVLDpui5GfpJeN4BxhkSWeGE3uH2OESnBcNwZ6VeJ/A7rdzNFMMb2"]')
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
VALUES ('0fa117ca-5edf-4687-b099-54290e40ffe1', '9944bc544d9ea138e00b990d:2a43c796e07c7a34783e55ff1e96c577:7626b327ccc947bc4a00b75389c655', '$2b$12$E9nq5v9yLdpae0IdnjeApeR0pg0mxu0v7ygV4KLiUxuLwqMUJnQYe', 'd02dcfe946efddbeb5a31f03:18c87bb5201ebf2f90d09299e9080822:ae60644827ef67255432', NULL, 'HR', 1, '{"department":"Human Resources","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'HR',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('0fa117ca-5edf-4687-b099-54290e40ffe1', '$2b$12$E9nq5v9yLdpae0IdnjeApeR0pg0mxu0v7ygV4KLiUxuLwqMUJnQYe', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$E9nq5v9yLdpae0IdnjeApeR0pg0mxu0v7ygV4KLiUxuLwqMUJnQYe"]')
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
VALUES ('c60caddb-2848-492a-8724-4e7ec5d55850', '45d92b301139716fe1e12085:489449cddd8d4a50f832f42539c0d32a:14fc42a0fd22c172fc4aaa1f59be48862463', '$2b$12$Z7Lul6isNAYA4L59HUfghuuNYy743mWfQ.FrZ.R7JokTifS5ONbD6', 'f230f74ae0b34b32929168b3:b7ba77335cd8c0a90f8b686f48f58ebb:9ea6cfa9502c12e40bc74dcf7d9e69a0cc0eae98a368b698e484', NULL, 'TUTOR', 1, '{"department":"Academics & Training","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'TUTOR',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('c60caddb-2848-492a-8724-4e7ec5d55850', '$2b$12$Z7Lul6isNAYA4L59HUfghuuNYy743mWfQ.FrZ.R7JokTifS5ONbD6', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$Z7Lul6isNAYA4L59HUfghuuNYy743mWfQ.FrZ.R7JokTifS5ONbD6"]')
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
VALUES ('4433911c-04f6-4dc3-8738-e25ba5b1b4d4', 'ef6bacbe5becc007bb0e63f4:85c127605285601f88789fc7eb141878:16dd2621c6664fedd27e4713f566ef', '$2b$12$aJrO/a21Ig7eNQ3JDuQx5.WKNyYPKDNbHRMhumNyr4gvE8woA2TJm', '88c8a7637a56659ebd1f5919:c915dab33240ba3375c10ab00b886dd5:2d89d9168243a686a4c4736b41c4e6', NULL, 'PROJECT_MANAGER', 1, '{"department":"Project Delivery","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'PROJECT_MANAGER',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('4433911c-04f6-4dc3-8738-e25ba5b1b4d4', '$2b$12$aJrO/a21Ig7eNQ3JDuQx5.WKNyYPKDNbHRMhumNyr4gvE8woA2TJm', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$aJrO/a21Ig7eNQ3JDuQx5.WKNyYPKDNbHRMhumNyr4gvE8woA2TJm"]')
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
VALUES ('8a8b4cfb-012a-4072-a24f-6cd999e9e007', 'ba19cdc0a1bb6536e110630f:21ae84d4ae9da2225fa11384c7d1dbbb:9a7de1d8a90e5188dab45d3fcdcf8b7ebf798868', '$2b$12$vQs9v.hchSNaICsIMAjVLuz6/uKH0RuYTi5TM3MMQy42GbgVOKjUe', 'f24822620bd48b68a3220a43:8adb5ca78cea77d88a6a10a665232f06:705f95c928c047a01a543cd1', NULL, 'FINANCE', 1, '{"department":"Finance & Accounts","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'FINANCE',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('8a8b4cfb-012a-4072-a24f-6cd999e9e007', '$2b$12$vQs9v.hchSNaICsIMAjVLuz6/uKH0RuYTi5TM3MMQy42GbgVOKjUe', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$vQs9v.hchSNaICsIMAjVLuz6/uKH0RuYTi5TM3MMQy42GbgVOKjUe"]')
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
VALUES ('a25602e3-ecd5-4fbf-a833-284bf9d36909', '074da5370a0fa5ebc734db45:d1d9039ce289c48920dffdc1d21a7eaf:8e57168f7964e0b74fd0b94d6447db6ca687', '$2b$12$yCAsbNLJEjVx5BhZWvLOiO4E7LY1hIIUi0mBcKoHUKECHXNUJTgZ6', '81ed7ba44fde8ab3a1de69f0:e3960020d9ff65e365344b1608903d0e:4870ce7c99ee20c440ecdfba176c47', NULL, 'SALES', 1, '{"department":"Sales & Growth","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'SALES',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('a25602e3-ecd5-4fbf-a833-284bf9d36909', '$2b$12$yCAsbNLJEjVx5BhZWvLOiO4E7LY1hIIUi0mBcKoHUKECHXNUJTgZ6', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$yCAsbNLJEjVx5BhZWvLOiO4E7LY1hIIUi0mBcKoHUKECHXNUJTgZ6"]')
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
VALUES ('7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', 'd037976d6b670d8f6aaf7b11:1c7d9cd7249239975e286862e991feea:6ab4ddc3603d58c18cc654f96782a4faba00d101684f', '$2b$12$LQ3BfqVaCvSu5nbQbv93V.XIGs5YO6ejUUe2eYB33yOHgwdzSI6l.', 'a9eea991f7fe7da40f014e0c:5f917b7b658eeea4c1f683aede8950d2:66c8dafb6e94dee95e7a3f062562b25a3b7c', NULL, 'RECEPTION', 1, '{"department":"Front Desk & Operations","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'RECEPTION',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', '$2b$12$LQ3BfqVaCvSu5nbQbv93V.XIGs5YO6ejUUe2eYB33yOHgwdzSI6l.', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$LQ3BfqVaCvSu5nbQbv93V.XIGs5YO6ejUUe2eYB33yOHgwdzSI6l."]')
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
VALUES ('74e45a32-92ab-40f5-97c0-c888d7284c48', 'f705510f6931e0c2bb53a848:bd583fb9d508f5a5785a220d1b6e435b:7673be4874a36d602d750a417aaee61cf69388617e', '$2b$12$WqBuM6ek4lL3qADqq3ZYquMfg0k//Fbnx/zy22z26lBwFph6YskQO', '81f759b700b376aedce5f44f:78f123673cc10cb68f61c9c7d2adc4da:b07c58664b178e81a9ba40d9f36a11', NULL, 'EMPLOYEE', 1, '{"department":"Engineering","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'EMPLOYEE',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('74e45a32-92ab-40f5-97c0-c888d7284c48', '$2b$12$WqBuM6ek4lL3qADqq3ZYquMfg0k//Fbnx/zy22z26lBwFph6YskQO', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$WqBuM6ek4lL3qADqq3ZYquMfg0k//Fbnx/zy22z26lBwFph6YskQO"]')
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
VALUES ('39a59061-1113-49a8-8d63-4558bb4e70f4', '7f26bdc38553dd76c68db2d2:16b3295533fac8011efe2c86d6fdd61d:94ae2d450a03d8ddf75e88ead3af5b125ac03e2c', '$2b$12$JhghH8cuvEzgwGpIU598XOItarazz7rL//XZ0WeSRaLbtwUTu6Laa', '26b0e17e2c4bc9996aa52935:15b607f1639217f1e7a04ec153fe8564:a08ffdaf17e9f9f5d685ee2968dc58df', NULL, 'STUDENT', 1, '{"department":"Computer Science","college":null,"seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'STUDENT',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('39a59061-1113-49a8-8d63-4558bb4e70f4', '$2b$12$JhghH8cuvEzgwGpIU598XOItarazz7rL//XZ0WeSRaLbtwUTu6Laa', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$JhghH8cuvEzgwGpIU598XOItarazz7rL//XZ0WeSRaLbtwUTu6Laa"]')
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
VALUES ('c5ec486b-ab51-437d-b6f1-3e0c25a36de3', '426e057d06ba50fefdedfe04:0af9048c77553bf34ab67e71b74143f2:58db2a8d5815a19ee49a0398d5e72111ab3b8d', '$2b$12$Y/60XWH6aY781HOx1AqApuVIPFFTPg1Igl/4vE6E5eyQdvit1KG/q', 'ddf299f917a9389845e650d7:0423e79a1f353234ca3f978ccae7725b:8129a5efd446e5bbaccbba0a700891', NULL, 'INTERN', 1, '{"department":"Software Engineering","college":"Anna University, Chennai","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('c5ec486b-ab51-437d-b6f1-3e0c25a36de3', '$2b$12$Y/60XWH6aY781HOx1AqApuVIPFFTPg1Igl/4vE6E5eyQdvit1KG/q', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$Y/60XWH6aY781HOx1AqApuVIPFFTPg1Igl/4vE6E5eyQdvit1KG/q"]')
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
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '197c5d15592a43790ea15cb9:13b5aea84b313b772b2a461af6dc915b:017f7f3f09ea52da5faf92d5f7ef27ccdcba142744b23cd6ebc92a', '$2b$12$T5JKYyIOSiB8Yfmacw0j.ujdDGCgy38mETeg9/wgpqZyvNdlABEHe', '7630e81136d6384b63deb033:1df6def05b20dfd1d230d08dad155741:65baef51f18302f3300d04185a3f', NULL, 'INTERN', 1, '{"department":"Software Engineering","college":"Anna University","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '$2b$12$T5JKYyIOSiB8Yfmacw0j.ujdDGCgy38mETeg9/wgpqZyvNdlABEHe', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$T5JKYyIOSiB8Yfmacw0j.ujdDGCgy38mETeg9/wgpqZyvNdlABEHe"]')
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
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', 'dce14f3cf7898a7c500f1773:f6d337cfa3c380fc88b31b090d327288:10c118962504875caee5198bde8d8e1324701a88e05f419b62', '$2b$12$yr9b80RGA1klA5w42qe/4egoopRfTW3gsPLDABD4CXkh49Jh9zFs6', '31915f86dd160de7faa3ff7b:665c816083acb5dbb14de66cc9969311:fc8ec58303f47991b2c844ebcebd', NULL, 'INTERN', 1, '{"department":"Full Stack Development","college":"PSG College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', '$2b$12$yr9b80RGA1klA5w42qe/4egoopRfTW3gsPLDABD4CXkh49Jh9zFs6', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$yr9b80RGA1klA5w42qe/4egoopRfTW3gsPLDABD4CXkh49Jh9zFs6"]')
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
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', 'f24dcded34523c67e52cccd7:daba46bb0d470fb6822c3164b2b32e75:eb756409803a1299138b6b764c47162ba707755ccfe19d94df', '$2b$12$DznXBhWwEy8f5eJylrMKruRuCPJ1F1d3LE9ECOs73KqJwNGbwO1NC', '662c6b29f2f36da99b27e13f:3050a0284de4af07ab6a31fe8eccbda5:fe6d234cddd198c6e1b0bef6', NULL, 'INTERN', 1, '{"department":"Web Applications","college":"Coimbatore Institute of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', '$2b$12$DznXBhWwEy8f5eJylrMKruRuCPJ1F1d3LE9ECOs73KqJwNGbwO1NC', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$DznXBhWwEy8f5eJylrMKruRuCPJ1F1d3LE9ECOs73KqJwNGbwO1NC"]')
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
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '75a91c45b6b5d1682a950693:85b20a634887ab78916d13468c1cc5ad:6e6b816b6534ede5d78b6972af109eb20d6cfb4cd617', '$2b$12$GFo2e./aQAhT1bNZU9dTJu6.jw6BdqNCiuy0NoFM.GnMxxDjFzBuK', 'cfb9baf25d404b27c9709b73:e4eec0334425aaf2ae1bcc6644796afb:f4dcb6ca7f8952', NULL, 'INTERN', 1, '{"department":"Frontend Engineering","college":"Government College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '$2b$12$GFo2e./aQAhT1bNZU9dTJu6.jw6BdqNCiuy0NoFM.GnMxxDjFzBuK', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$GFo2e./aQAhT1bNZU9dTJu6.jw6BdqNCiuy0NoFM.GnMxxDjFzBuK"]')
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
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', 'f7972af8ac8555bf6a245a88:c5c9a70c41c6bb26aa6e10df9b013daa:287c0e04bb2480a04c52810fa91ac3d979a5a33f9ecdb7', '$2b$12$aETt1R.p.t1DKijCln4lD.KLeGHqm44uPlcW4sd5OP8ZbJ7HeEtZK', '21dc49ddbf667cdc76563366:2f3af6c40212f2b3135d1e944061aaca:a950ba82717a4e5f48ce80', NULL, 'INTERN', 1, '{"department":"Backend Engineering","college":"SRM Institute of Science and Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', '$2b$12$aETt1R.p.t1DKijCln4lD.KLeGHqm44uPlcW4sd5OP8ZbJ7HeEtZK', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$aETt1R.p.t1DKijCln4lD.KLeGHqm44uPlcW4sd5OP8ZbJ7HeEtZK"]')
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