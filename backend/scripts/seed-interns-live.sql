--
-- Live SQL Seed Script for Intern Accounts
-- Generated on: 2026-10-15T07:15:23.664Z
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

-- Account: gokulrajkumar2006@gmail.com (Gokul Rajkumar)
-- Password: Intern@123
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '197c5d15592a43790ea15cb9:13b5aea84b313b772b2a461af6dc915b:017f7f3f09ea52da5faf92d5f7ef27ccdcba142744b23cd6ebc92a', '$2b$12$gbruldfuyOdKto5CZEQmq.zIVM18n2fOTQtUbRRxO1mPWjRSiLd6a', '6a8c3b07a5ef58649e796bda:afbd20ed55c4a7c4113dc3f0957e7660:49fb5e6d9e1e6bbf081d736a67f7', NULL, 'INTERN', 1, '{"department":"Software Engineering","college":"Anna University","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('58a8ee15-79a5-473f-ac95-c97bc03d3394', '$2b$12$gbruldfuyOdKto5CZEQmq.zIVM18n2fOTQtUbRRxO1mPWjRSiLd6a', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$gbruldfuyOdKto5CZEQmq.zIVM18n2fOTQtUbRRxO1mPWjRSiLd6a"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('af5964a2-627c-40a6-b6c1-6f5db35e08ed', '58a8ee15-79a5-473f-ac95-c97bc03d3394', NULL, 'Anna University', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- Account: srinithikumar54@gmail.com (Srinithi Kumar)
-- Password: Intern@123
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', 'dce14f3cf7898a7c500f1773:f6d337cfa3c380fc88b31b090d327288:10c118962504875caee5198bde8d8e1324701a88e05f419b62', '$2b$12$WaPpuqCBw30C6iAt3RKYJeoHre2EBphdk6QATNRo65o2hSNGYMWee', '19a0200d2f5825f3bd32c515:d28c30853c98d8fbe21601b9f50de0b9:c9d3c0825e826fed835f4d857fd5', NULL, 'INTERN', 1, '{"department":"Full Stack Development","college":"PSG College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('45d3f678-47a0-442d-8330-9731b2d883b9', '$2b$12$WaPpuqCBw30C6iAt3RKYJeoHre2EBphdk6QATNRo65o2hSNGYMWee', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$WaPpuqCBw30C6iAt3RKYJeoHre2EBphdk6QATNRo65o2hSNGYMWee"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('adcd3ce5-b4ea-43c9-a0a8-bd28871c20af', '45d3f678-47a0-442d-8330-9731b2d883b9', NULL, 'PSG College of Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- Account: sloganathan0105@gmail.com (S Loganathan)
-- Password: Intern@123
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', 'f24dcded34523c67e52cccd7:daba46bb0d470fb6822c3164b2b32e75:eb756409803a1299138b6b764c47162ba707755ccfe19d94df', '$2b$12$w6/VNMoQtH2UH8IPwuC.I.vF7HlD3jUynpz4LonUy7eGQcAzRHjV.', 'ed5b38a8cffb5811c5725192:44f591752fd8d436b29494512e11b814:eef09c33311d6c400988797b', NULL, 'INTERN', 1, '{"department":"Web Applications","college":"Coimbatore Institute of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('584f6dc7-adaf-4fb5-8cd6-03987543d776', '$2b$12$w6/VNMoQtH2UH8IPwuC.I.vF7HlD3jUynpz4LonUy7eGQcAzRHjV.', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$w6/VNMoQtH2UH8IPwuC.I.vF7HlD3jUynpz4LonUy7eGQcAzRHjV."]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('b8e8aa7a-3665-4373-8bb4-358fa24d9396', '584f6dc7-adaf-4fb5-8cd6-03987543d776', NULL, 'Coimbatore Institute of Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- Account: stephen862k7@gmail.com (Stephen)
-- Password: Intern@123
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '75a91c45b6b5d1682a950693:85b20a634887ab78916d13468c1cc5ad:6e6b816b6534ede5d78b6972af109eb20d6cfb4cd617', '$2b$12$.UjLp8lQxSy52kf1eLpFX.ePtfLShuHUehnzrHlNzvngeLBOxaDfi', 'cff0c0d6c65ace40cb760c94:9f20f20f99d210447b8821b93f5d5472:f274d9e20bc649', NULL, 'INTERN', 1, '{"department":"Frontend Engineering","college":"Government College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '$2b$12$.UjLp8lQxSy52kf1eLpFX.ePtfLShuHUehnzrHlNzvngeLBOxaDfi', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$.UjLp8lQxSy52kf1eLpFX.ePtfLShuHUehnzrHlNzvngeLBOxaDfi"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('9ff4b4f5-2803-40f7-a868-d5133f4ab264', '69fa12f1-7d71-4c2a-8122-c8c12ed8754a', NULL, 'Government College of Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- Account: Barathappu777@gmail.com (Barath Appu)
-- Password: Intern@123
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', 'f7972af8ac8555bf6a245a88:c5c9a70c41c6bb26aa6e10df9b013daa:287c0e04bb2480a04c52810fa91ac3d979a5a33f9ecdb7', '$2b$12$Y0HPz23u2jT8vdaGpE/uOux6B5Ttlb1gr87/OhDSXJvU95R/gq2ce', '244c6b45ff9503a82b757934:b710b7ee9a65e70e1cd22b1e30b4c19b:a772776ede274f309062b2', NULL, 'INTERN', 1, '{"department":"Backend Engineering","college":"SRM Institute of Science and Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('d17aab8c-9280-445f-85ce-cc2a93764ddb', '$2b$12$Y0HPz23u2jT8vdaGpE/uOux6B5Ttlb1gr87/OhDSXJvU95R/gq2ce', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$Y0HPz23u2jT8vdaGpE/uOux6B5Ttlb1gr87/OhDSXJvU95R/gq2ce"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('c56a5051-e898-4afb-897e-61b5eeebe9ba', 'd17aab8c-9280-445f-85ce-cc2a93764ddb', NULL, 'SRM Institute of Science and Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- Account: knandhinivnr@gmail.com (Nandhini K)
-- Password: Intern@123
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('66da1638-9a06-4741-9ed2-8054b0417313', '3cb00bec9c3f1a7868692dc2:69e39ef55e033ca94ff67199f7d6b96e:9773d37eef5286e983771afaf9b0a959403c38852198', '$2b$12$wPugfRsr7N45iV0J3wLqReq6Ea5eGZWHWOaUin2PCf70w72XLKMhG', 'b07c6bd87289180d14ada9a0:791444d0563eee4bd2909d5b2ac446b0:4c4d074891cdb9c0a8d5', NULL, 'INTERN', 1, '{"department":"Full Stack Web Development","college":"Anna University","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('66da1638-9a06-4741-9ed2-8054b0417313', '$2b$12$wPugfRsr7N45iV0J3wLqReq6Ea5eGZWHWOaUin2PCf70w72XLKMhG', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$wPugfRsr7N45iV0J3wLqReq6Ea5eGZWHWOaUin2PCf70w72XLKMhG"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('ae5caf31-4b0a-4c4d-a47b-ffd6b87dedb5', '66da1638-9a06-4741-9ed2-8054b0417313', NULL, 'Anna University', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

-- Account: mathishree008@gmail.com (Mathishree)
-- Password: Intern@123
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, preferences)
VALUES ('eadd2eb6-b0af-4e3f-aa82-a08e29d891ee', 'd3ca4f4dfe0c1ad1f13a1b58:f49dcffd4237689f24af44303616ad78:34876240ad6cbe7c5a80d778e019804a2da94cd56eec87', '$2b$12$rk8k7bb/kx1ojzK4WMkVn.gXThwUvaitlTZ4YT2DM0Z4J0rcgklPC', '395b308ff044c9269db05221:26ce458c9e19329cff46157ebb32b439:732a3c9e44da103dfbb0', NULL, 'INTERN', 1, '{"department":"Full Stack Web Development","college":"PSG College of Technology","seeded":true}')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  role = 'INTERN',
  is_active = 1,
  preferences = VALUES(preferences);
INSERT INTO user_credentials (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
VALUES ('eadd2eb6-b0af-4e3f-aa82-a08e29d891ee', '$2b$12$rk8k7bb/kx1ojzK4WMkVn.gXThwUvaitlTZ4YT2DM0Z4J0rcgklPC', 'BCRYPT', NOW(), 0, NULL, 0, '["$2b$12$rk8k7bb/kx1ojzK4WMkVn.gXThwUvaitlTZ4YT2DM0Z4J0rcgklPC"]')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  password_updated_at = NOW(),
  failed_login_attempts = 0,
  lockout_until = NULL,
  requires_password_change = 0,
  password_history = VALUES(password_history);
INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date, project_target, progress)
VALUES ('2c2e2b8d-25d8-48ea-937b-cc43f460627f', 'eadd2eb6-b0af-4e3f-aa82-a08e29d891ee', NULL, 'PSG College of Technology', 15000, '2026-10-15', '2027-01-13', 'Full Stack Development', 10)
ON DUPLICATE KEY UPDATE
  college_name = VALUES(college_name),
  stipend = VALUES(stipend),
  project_target = VALUES(project_target);

SET FOREIGN_KEY_CHECKS = 1;