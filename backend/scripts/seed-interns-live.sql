--
-- Live SQL Seed Script for Intern Accounts
-- Generated on: 2026-10-13T05:35:36.407Z
--
SET FOREIGN_KEY_CHECKS = 0;

-- Account: gokulrajkumar2006@gmail.com (Gokul Rajkumar)
-- Password: CFemE8r!i6K3Od
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '197c5d15592a43790ea15cb9:13b5aea84b313b772b2a461af6dc915b:017f7f3f09ea52da5faf92d5f7ef27ccdcba142744b23cd6ebc92a', '$2b$12$MKy82R2.0tVW5FMjvvvoHeInUltE2Wt6ocn2feRJE6OMGlu7XsUBm', '5363e5b8a4429dc47204253c:4e3d52cd78dd3c50428a9d3c483dc6fe:69f98602520c2de2657a4813866a', NULL, 'INTERN', 1, '{"department":"Software Engineering","college":"Anna University","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '$2b$12$MKy82R2.0tVW5FMjvvvoHeInUltE2Wt6ocn2feRJE6OMGlu7XsUBm', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$MKy82R2.0tVW5FMjvvvoHeInUltE2Wt6ocn2feRJE6OMGlu7XsUBm"]')
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

-- Account: srinithikumar54@gmail.com (Srinithi Kumar)
-- Password: NHCg0ZUU!laqM!
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', 'dce14f3cf7898a7c500f1773:f6d337cfa3c380fc88b31b090d327288:10c118962504875caee5198bde8d8e1324701a88e05f419b62', '$2b$12$r/bHnoAL75sD8gSxa45bA.Anm9sHzCpVUfEXW0RNnXeYos1dHKbWi', '368916228eb8a12b304f4e8c:8221ae03d95bfa0d6f4e948aafac9111:757900025c50d72cf495941d5286', NULL, 'INTERN', 1, '{"department":"Full Stack Development","college":"PSG College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', '$2b$12$r/bHnoAL75sD8gSxa45bA.Anm9sHzCpVUfEXW0RNnXeYos1dHKbWi', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$r/bHnoAL75sD8gSxa45bA.Anm9sHzCpVUfEXW0RNnXeYos1dHKbWi"]')
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

-- Account: sloganathan0105@gmail.com (S Loganathan)
-- Password: DF&m!RPpGspUGV
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', 'f24dcded34523c67e52cccd7:daba46bb0d470fb6822c3164b2b32e75:eb756409803a1299138b6b764c47162ba707755ccfe19d94df', '$2b$12$QIDDYjt4X5wIXTgia.36NOKjeRgjiBRMYaHw5.JTwJPXCJjJ7ALt2', 'b8ab13ab6176fd0cefd12d2d:ef86f5476eae7b79906b5f9e01308cf6:790cc3d0deacc8fea7363421', NULL, 'INTERN', 1, '{"department":"Web Applications","college":"Coimbatore Institute of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', '$2b$12$QIDDYjt4X5wIXTgia.36NOKjeRgjiBRMYaHw5.JTwJPXCJjJ7ALt2', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$QIDDYjt4X5wIXTgia.36NOKjeRgjiBRMYaHw5.JTwJPXCJjJ7ALt2"]')
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

-- Account: stephen862k7@gmail.com (Stephen)
-- Password: 1c9eN#OFQp73&S
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '75a91c45b6b5d1682a950693:85b20a634887ab78916d13468c1cc5ad:6e6b816b6534ede5d78b6972af109eb20d6cfb4cd617', '$2b$12$NHI74VQqRfqX.pWfykmbWe0GuGm2TUg61KFRZoDMo2wy36r3QNapa', 'e34f40f2246411b1ed1051d3:edafe0db0ccf88645472316edb202cd8:87ce190f68ed7f', NULL, 'INTERN', 1, '{"department":"Frontend Engineering","college":"Government College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '$2b$12$NHI74VQqRfqX.pWfykmbWe0GuGm2TUg61KFRZoDMo2wy36r3QNapa', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$NHI74VQqRfqX.pWfykmbWe0GuGm2TUg61KFRZoDMo2wy36r3QNapa"]')
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

-- Account: Barathappu777@gmail.com (Barath Appu)
-- Password: sKotWmDqMrjpv0
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', 'f7972af8ac8555bf6a245a88:c5c9a70c41c6bb26aa6e10df9b013daa:287c0e04bb2480a04c52810fa91ac3d979a5a33f9ecdb7', '$2b$12$ADPmoic0ZmHDVoOcEf4bU.QmwOmLqhesnotno/VwgN2ofOMmqUK/e', '24faa968bfa8a706a44cb2c7:56cf5ae4deffe884729949fdfefc1f97:47c8d47230c60b330d75c3', NULL, 'INTERN', 1, '{"department":"Backend Engineering","college":"SRM Institute of Science and Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', '$2b$12$ADPmoic0ZmHDVoOcEf4bU.QmwOmLqhesnotno/VwgN2ofOMmqUK/e', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$ADPmoic0ZmHDVoOcEf4bU.QmwOmLqhesnotno/VwgN2ofOMmqUK/e"]')
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