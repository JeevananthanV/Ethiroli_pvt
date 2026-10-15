-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 15, 2026 at 06:19 AM
-- Server version: 11.8.9-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u629721489_ethiroli_Db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_feeds`
--

CREATE TABLE `activity_feeds` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `actor_id` char(36) DEFAULT NULL,
  `event_type` varchar(100) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `anomaly_logs`
--

CREATE TABLE `anomaly_logs` (
  `id` bigint(20) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `anomaly_type` enum('IMPOSSIBLE_TRAVEL','BRUTE_FORCE','RAPID_DATA_ACCESS','SUSPICIOUS_IP') NOT NULL,
  `severity` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`details`)),
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_at` datetime DEFAULT NULL,
  `resolved_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_keys`
--

CREATE TABLE `api_keys` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `api_key` varchar(64) NOT NULL,
  `api_secret` varchar(64) NOT NULL,
  `scopes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`scopes`)),
  `rate_limit_per_minute` int(11) DEFAULT 60,
  `expires_at` datetime DEFAULT NULL,
  `last_used_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `candidate_id` char(36) NOT NULL,
  `job_id` char(36) NOT NULL,
  `status_id` int(11) DEFAULT NULL,
  `cover_letter` text DEFAULT NULL,
  `applied_at` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `applications`
--
DELIMITER $$
CREATE TRIGGER `trg_applications_updated_at` BEFORE UPDATE ON `applications` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `application_statuses`
--

CREATE TABLE `application_statuses` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `status_code` varchar(50) NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_final` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `application_statuses`
--

INSERT INTO `application_statuses` (`status_id`, `status_name`, `status_code`, `display_order`, `is_final`, `created_at`, `updated_at`) VALUES
(1, 'Applied', 'APPLIED', 1, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(2, 'Under Review', 'UNDER_REVIEW', 2, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(3, 'Shortlisted', 'SHORTLISTED', 3, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(4, 'Interview Scheduled', 'INTERVIEW_SCHEDULED', 4, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(5, 'Interviewed', 'INTERVIEWED', 5, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(6, 'Offered', 'OFFERED', 6, 0, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(7, 'Accepted', 'ACCEPTED', 7, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(8, 'Rejected', 'REJECTED', 8, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(9, 'Withdrawn', 'WITHDRAWN', 9, 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43');

--
-- Triggers `application_statuses`
--
DELIMITER $$
CREATE TRIGGER `trg_application_statuses_updated_at` BEFORE UPDATE ON `application_statuses` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `application_status_history`
--

CREATE TABLE `application_status_history` (
  `history_id` int(11) NOT NULL,
  `application_id` char(36) NOT NULL,
  `status_id` int(11) NOT NULL,
  `changed_by` char(36) DEFAULT NULL,
  `change_notes` text DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `application_status_history`
--
DELIMITER $$
CREATE TRIGGER `trg_application_status_history_updated_at` BEFORE UPDATE ON `application_status_history` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `approval_chains`
--

CREATE TABLE `approval_chains` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `workflow_id` char(36) NOT NULL,
  `step_order` int(11) NOT NULL,
  `approver_role` enum('HR','FINANCE','MANAGER','ADMIN','SUPER_ADMIN') NOT NULL,
  `approval_condition` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`approval_condition`)),
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `approval_instances`
--

CREATE TABLE `approval_instances` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `workflow_id` char(36) NOT NULL,
  `entity_id` char(36) NOT NULL,
  `current_step` int(11) DEFAULT 1,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING',
  `decisions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`decisions`)),
  `initiated_by` char(36) NOT NULL,
  `initiated_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `course_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `max_score` int(11) DEFAULT 100,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `assignment_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `text_content` longtext DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp(),
  `graded_at` datetime DEFAULT NULL,
  `graded_by` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `date` date NOT NULL,
  `check_in_time` datetime DEFAULT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `total_hours` decimal(5,2) GENERATED ALWAYS AS (round(timestampdiff(SECOND,`check_in_time`,`check_out_time`) / 3600.0,2)) STORED,
  `is_late` tinyint(1) DEFAULT 0,
  `status` enum('PRESENT','ABSENT','HALF_DAY') DEFAULT 'ABSENT',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `old_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_value`)),
  `new_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_value`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `old_value`, `new_value`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, '368f5c88-12cd-11ed-861d-0242ac120002', 'CREATE_LEAD_PUBLIC', 'LEAD', NULL, NULL, '{\"id\":\"\",\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"9876543210\",\"source\":\"WEBSITE\",\"status\":\"NEW\"}', '2409:4091:a04d:401:7500:326c:dc29:53b6', NULL, '2026-09-30 06:27:06'),
(2, NULL, 'CREATE_CONTACT_MESSAGE', 'CONTACT_MESSAGE', '1', NULL, '{\"id\":1,\"name\":\"Ethiroli Verification Test\",\"email\":\"verification@ethiroli.net\",\"phone\":\"+91 9876543210\",\"subject\":\"Production Form Verification\",\"message\":\"This is a test message to verify the contact form submission on production.\",\"created_at\":\"2026-09-30T06:52:53.706Z\"}', '2409:4091:a04d:401:7500:326c:dc29:53b6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-09-30 06:52:53'),
(3, NULL, 'CREATE_CONTACT_MESSAGE', 'CONTACT_MESSAGE', '2', NULL, '{\"id\":2,\"name\":\"LOGANATHAN S\",\"email\":\"sloganathan0105@gmail.com\",\"phone\":\"8838676284\",\"subject\":\"Web Development & AI Solutions\",\"message\":\"Hello, I’m Loganathan, a B.Tech AI & Data Science student with hands-on experience in web development, React, Python, and AI-based projects. I’m interested in opportunities to contribute to your team and gain practical industry experience. I would be happy to discuss how my technical skills and project experience can support your requirements. Thank you for your time, and I look forward to hearing from you.\",\"created_at\":\"2026-09-30T06:55:33.554Z\"}', '2409:4091:a04d:401:ec07:71f3:672c:672f', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-09-30 06:55:33'),
(4, NULL, 'CREATE_CONTACT_MESSAGE', 'CONTACT_MESSAGE', '3', NULL, '{\"id\":3,\"name\":\"stephen\",\"email\":\"stephen862k7@gmail.com\",\"phone\":\"9345125667\",\"subject\":\"Webdeveloper\",\"message\":\"i like to join with yours.\",\"created_at\":\"2026-09-30T06:56:23.318Z\"}', '2409:4091:a04d:401:95d7:744c:2692:ba6c', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-09-30 06:56:23'),
(5, NULL, 'CREATE_CANDIDATE', 'CANDIDATE', '1', NULL, '{\"id\":1,\"applicationId\":1,\"name\":\"LOGANATHAN S\",\"fullName\":\"LOGANATHAN S\",\"email\":\"sloganathan0105@gmail.com\",\"phone\":\"8838676284\",\"role\":\"Web Developer Intern\",\"portfolioUrl\":\"https://loganathan-portfolio-ruby.vercel.app/\",\"experienceLevel\":\"Intermediate\",\"message\":\"I am a passionate AI & Data Science student with hands-on experience in web development, Python, React, and AI-based projects. I enjoy learning new technologies and building practical, user-focused solutions. I am a quick learner, adaptable, and committed to delivering quality work while continuously improving my skills. I believe my technical knowledge, creativity, and willingness to take on new challenges would allow me to contribute effectively to your team.\",\"source\":\"WEBSITE\",\"created_at\":\"2026-09-30T06:56:37.946Z\"}', '2409:4091:a04d:401:ec07:71f3:672c:672f', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-09-30 06:56:37'),
(6, NULL, 'CREATE_CONTACT_MESSAGE', 'CONTACT_MESSAGE', '4', NULL, '{\"id\":4,\"name\":\"Ethiroli Verification Test\",\"email\":\"verification@ethiroli.net\",\"phone\":\"+919876543210\",\"subject\":\"Production Form Verification\",\"message\":\"This is a live test message to verify the contact form submission on production.\",\"created_at\":\"2026-09-30T07:04:53.861Z\"}', '2409:4091:a04d:401:7500:326c:dc29:53b6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-09-30 07:04:53'),
(7, NULL, 'CREATE_CANDIDATE', 'CANDIDATE', '2', NULL, '{\"id\":2,\"applicationId\":2,\"name\":\"Ethiroli Candidate Test\",\"fullName\":\"Ethiroli Candidate Test\",\"email\":\"candidate.test@ethiroli.net\",\"phone\":\"+919876543210\",\"role\":\"Web Developer Intern\",\"portfolioUrl\":\"https://ethiroli.net\",\"experienceLevel\":\"Beginner\",\"message\":\"Passionate web developer intern applicant testing live form flow.\",\"source\":\"WEBSITE\",\"created_at\":\"2026-09-30T07:04:54.015Z\"}', '2409:4091:a04d:401:7500:326c:dc29:53b6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-09-30 07:04:54'),
(8, NULL, 'CREATE_CONTACT_MESSAGE', 'CONTACT_MESSAGE', '5', NULL, '{\"id\":5,\"name\":\"Gayathri Senthilkumar\",\"email\":\"gayathrisenthilkumar098@gmail.com\",\"phone\":\"+919080165383\",\"subject\":\"Web intern \",\"message\":\"Main hv Dr nsh neb nsbr khub khub khub\",\"created_at\":\"2026-09-30T07:53:37.660Z\"}', '2409:4091:a04d:401:24de:536f:af18:e751', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36', '2026-09-30 07:53:37'),
(9, NULL, 'CREATE_CANDIDATE', 'CANDIDATE', '3', NULL, '{\"id\":3,\"applicationId\":3,\"name\":\"Santhiya Sakthivel\",\"fullName\":\"Santhiya Sakthivel\",\"email\":\"santhiyasakthivel858@gmail.com\",\"phone\":\"99446-21519\",\"role\":\"Web Developer Intern\",\"portfolioUrl\":\"https://santhiyasakthivel-portfolio.netlify.app/\",\"experienceLevel\":\"Beginner\",\"message\":\"Developer with hands-on experience in developing scalable web applications using the MERN Stack. Experienced in building REST APIs, designing responsive user interfaces, integrating databases, and collaborating with cross-functional teams. Passionate about writing clean, maintainable code and delivering high-quality software solutions. Seeking a Software Developer role where I can contribute to impactful projects while continuously enhancing my technical skills.\",\"source\":\"WEBSITE\",\"created_at\":\"2026-10-04T05:24:26.203Z\"}', '2001:4490:4e91:ac54:454b:97db:e39d:2cb', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-10-04 05:24:26'),
(10, NULL, 'CREATE_CANDIDATE', 'CANDIDATE', '4', NULL, '{\"id\":4,\"applicationId\":4,\"name\":\"Thrisha\",\"fullName\":\"Thrisha\",\"email\":\"thrishathrishaut@gmail.com\",\"phone\":\"+91 85319 43410\",\"role\":\"Web Developer Intern\",\"experienceLevel\":\"Beginner\",\"message\":\"I am a beginner with a strong interest in web development. I am eager to learn new technologies and improve my technical skills. I am a quick learner, a good team player, and ready to take on new challenges. I will work hard and contribute to the growth of the company.\",\"source\":\"WEBSITE\",\"created_at\":\"2026-10-11T14:12:08.309Z\"}', '2402:3a80:20:a9bf:857d:7e1a:9942:2c9f', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-11 14:12:08'),
(11, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"employee\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-10-13 05:55:17'),
(12, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"employee\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', NULL, '2026-10-13 05:56:06'),
(13, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"intern\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', NULL, '2026-10-13 05:56:19'),
(14, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"employee\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', NULL, '2026-10-13 05:56:19'),
(15, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"intern\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', NULL, '2026-10-13 05:56:19'),
(16, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"admin\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', NULL, '2026-10-13 05:56:19'),
(17, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"intern\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:08:09'),
(18, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"admin\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:30'),
(19, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"hr\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:30'),
(20, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"tutor\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:31'),
(21, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"pm\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:31'),
(22, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"finance\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:31'),
(23, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"sales\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:31'),
(24, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"reception\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:31'),
(25, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"employee\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:31'),
(26, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"student\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:31'),
(27, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"intern\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'node', '2026-10-13 06:10:31'),
(28, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"intern\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-10-13 06:19:41'),
(29, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"intern\"}', '2409:40f4:3006:4eda:cd5d:c2b5:c5e4:46bd', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-10-13 06:26:22'),
(30, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"intern\"}', '2409:40f4:3156:1d39:2d83:49a1:6096:ba56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', '2026-10-13 13:37:04'),
(31, NULL, 'LOGIN_ATTEMPT', 'AUTH', NULL, NULL, '{\"success\":false,\"failure_reason\":\"user_not_found\",\"portal_slug\":\"intern\"}', '2409:40f4:3047:3484:95ec:7700:ae65:1411', 'node', '2026-10-13 18:21:56'),
(32, NULL, 'CREATE_CANDIDATE', 'CANDIDATE', '5', NULL, '{\"id\":5,\"applicationId\":5,\"name\":\"PRINCE A\",\"fullName\":\"PRINCE A\",\"email\":\"princeprince45613@gmail.com\",\"phone\":\"+917502138129\",\"role\":\"Web Developer Intern\",\"portfolioUrl\":\"https://spidy-portfolio-bice.vercel.app/\",\"experienceLevel\":\"Beginner\",\"message\":\"I’m a full-stack developer building Lumen Academy, a bilingual (English and Tamil) NEET and JEE preparation platform for Indian students. I work with TypeScript, Node.js, Express, PostgreSQL with Prisma, and React, and I care about clean architecture, server-side security, and making exam prep accessible to every student.\",\"source\":\"WEBSITE\",\"created_at\":\"2026-10-15T02:50:35.296Z\"}', '2409:40f4:3150:35f4:d1d3:b713:87d9:6c7b', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', '2026-10-15 02:50:35'),
(33, 'd17aab8c-9280-445f-85ce-cc2a93764ddb', 'LOGIN_ATTEMPT', 'AUTH', 'd17aab8c-9280-445f-85ce-cc2a93764ddb', NULL, '{\"success\":false,\"failure_reason\":\"role_mismatch\",\"expected_role\":\"EMPLOYEE\",\"actual_role\":\"INTERN\",\"portal_slug\":\"employee\"}', '2409:4091:a04d:401:b834:ba66:2dee:8ebd', 'Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36', '2026-10-15 06:08:16'),
(34, 'd17aab8c-9280-445f-85ce-cc2a93764ddb', 'LOGIN_ATTEMPT', 'AUTH', 'd17aab8c-9280-445f-85ce-cc2a93764ddb', NULL, '{\"success\":false,\"failure_reason\":\"role_mismatch\",\"expected_role\":\"EMPLOYEE\",\"actual_role\":\"INTERN\",\"portal_slug\":\"employee\"}', '2409:4091:a04d:401:b834:ba66:2dee:8ebd', 'Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36', '2026-10-15 06:08:38');

-- --------------------------------------------------------

--
-- Table structure for table `automation_workflows`
--

CREATE TABLE `automation_workflows` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `trigger_type` enum('SCHEDULE','EVENT','WEBHOOK') NOT NULL,
  `trigger_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`trigger_config`)),
  `is_active` tinyint(1) DEFAULT 1,
  `execution_count` int(11) DEFAULT 0,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `badges`
--

CREATE TABLE `badges` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`criteria`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `badges`
--

INSERT INTO `badges` (`id`, `name`, `description`, `icon`, `criteria`, `is_active`, `created_at`, `updated_at`) VALUES
('b3f1a000000000000000000000000001', 'Course Completed', 'Finished every lesson in a course from start to finish.', 'workspace_premium', '{\"type\":\"COURSE_COMPLETION\",\"courses\":1}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('b3f1a000000000000000000000000002', 'First Lesson', 'Completed your very first lesson.', 'flag', '{\"type\":\"LESSON_COMPLETION\",\"lessons\":1}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('b3f1a000000000000000000000000003', 'Module Master', 'Completed five course modules.', 'menu_book', '{\"type\":\"MODULE_COMPLETION\",\"modules\":5}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('b3f1a000000000000000000000000004', 'Quiz Whiz', 'Scored 100% on a published quiz.', 'quiz', '{\"type\":\"QUIZ_PASS\",\"score\":100}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('b3f1a000000000000000000000000005', 'Assignment Pro', 'Scored 90% or better on a graded assignment.', 'assignment_turned_in', '{\"type\":\"ASSIGNMENT_GRADE\",\"score\":90}', 1, '2026-09-29 11:14:18', '2026-09-29 11:14:18');

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

CREATE TABLE `batches` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `course_id` char(36) NOT NULL,
  `tutor_id` char(36) NOT NULL,
  `batch_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `max_capacity` int(11) DEFAULT 30,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `batch_students`
--

CREATE TABLE `batch_students` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `batch_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `joined_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_type` enum('MEETING','DEADLINE','TASK','ANNOUNCEMENT','TRAINING') NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `is_all_day` tinyint(1) DEFAULT 0,
  `location` varchar(255) DEFAULT NULL,
  `meeting_link` varchar(500) DEFAULT NULL,
  `assigned_users` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`assigned_users`)),
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `job_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `resume_url` varchar(500) DEFAULT NULL,
  `source` enum('INDEED','LINKEDIN','NAUKRI','REFERRAL','WEBSITE','MANUAL') DEFAULT 'MANUAL',
  `indeed_candidate_id` varchar(100) DEFAULT NULL,
  `status` enum('NEW','CONTACTED','SCREENING','INTERVIEWING','OFFER','HIRED','REJECTED') DEFAULT 'NEW',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidate_documents`
--

CREATE TABLE `candidate_documents` (
  `document_id` char(36) NOT NULL DEFAULT uuid(),
  `candidate_id` char(36) NOT NULL,
  `application_id` char(36) DEFAULT NULL,
  `document_type` varchar(100) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `candidate_documents`
--
DELIMITER $$
CREATE TRIGGER `trg_candidate_documents_updated_at` BEFORE UPDATE ON `candidate_documents` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `career_applications`
--

CREATE TABLE `career_applications` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` varchar(255) DEFAULT 'General Application',
  `portfolio_url` varchar(500) DEFAULT NULL,
  `experience_level` varchar(100) DEFAULT 'Entry',
  `message` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'NEW',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `career_applications`
--

INSERT INTO `career_applications` (`id`, `full_name`, `email`, `phone`, `role`, `portfolio_url`, `experience_level`, `message`, `status`, `created_at`) VALUES
(1, 'LOGANATHAN S', 'sloganathan0105@gmail.com', '8838676284', 'Web Developer Intern', 'https://loganathan-portfolio-ruby.vercel.app/', 'Intermediate', 'I am a passionate AI & Data Science student with hands-on experience in web development, Python, React, and AI-based projects. I enjoy learning new technologies and building practical, user-focused solutions. I am a quick learner, adaptable, and committed to delivering quality work while continuously improving my skills. I believe my technical knowledge, creativity, and willingness to take on new challenges would allow me to contribute effectively to your team.', 'NEW', '2026-09-30 06:56:37'),
(2, 'Ethiroli Candidate Test', 'candidate.test@ethiroli.net', '+919876543210', 'Web Developer Intern', 'https://ethiroli.net', 'Beginner', 'Passionate web developer intern applicant testing live form flow.', 'NEW', '2026-09-30 07:04:54'),
(3, 'Santhiya Sakthivel', 'santhiyasakthivel858@gmail.com', '99446-21519', 'Web Developer Intern', 'https://santhiyasakthivel-portfolio.netlify.app/', 'Beginner', 'Developer with hands-on experience in developing scalable web applications using the MERN Stack. Experienced in building REST APIs, designing responsive user interfaces, integrating databases, and collaborating with cross-functional teams. Passionate about writing clean, maintainable code and delivering high-quality software solutions. Seeking a Software Developer role where I can contribute to impactful projects while continuously enhancing my technical skills.', 'NEW', '2026-10-04 05:24:26'),
(4, 'Thrisha', 'thrishathrishaut@gmail.com', '+91 85319 43410', 'Web Developer Intern', NULL, 'Beginner', 'I am a beginner with a strong interest in web development. I am eager to learn new technologies and improve my technical skills. I am a quick learner, a good team player, and ready to take on new challenges. I will work hard and contribute to the growth of the company.', 'NEW', '2026-10-11 14:12:08'),
(5, 'PRINCE A', 'princeprince45613@gmail.com', '+917502138129', 'Web Developer Intern', 'https://spidy-portfolio-bice.vercel.app/', 'Beginner', 'I’m a full-stack developer building Lumen Academy, a bilingual (English and Tamil) NEET and JEE preparation platform for Indian students. I work with TypeScript, Node.js, Express, PostgreSQL with Prisma, and React, and I care about clean architecture, server-side security, and making exam prep accessible to every student.', 'NEW', '2026-10-15 02:50:35');

-- --------------------------------------------------------

--
-- Table structure for table `cart_sessions`
--

CREATE TABLE `cart_sessions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `session_token` varchar(255) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `coupon_code` varchar(50) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `enrollment_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `certificate_number` varchar(50) NOT NULL,
  `issue_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `pdf_url` varchar(500) NOT NULL,
  `qr_code_url` varchar(500) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gst` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `communication_logs`
--

CREATE TABLE `communication_logs` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `channel` enum('EMAIL','SMS','WHATSAPP') NOT NULL,
  `template_id` char(36) DEFAULT NULL,
  `sender` varchar(255) DEFAULT NULL,
  `recipient` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL,
  `status` enum('PENDING','SENT','FAILED','DELIVERED','READ') DEFAULT 'PENDING',
  `provider_response` text DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL,
  `read_at` datetime DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `communication_templates`
--

CREATE TABLE `communication_templates` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(100) NOT NULL,
  `channel` enum('EMAIL','SMS','WHATSAPP') NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `body` longtext NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `company_name` varchar(255) NOT NULL,
  `gst` varchar(255) DEFAULT NULL,
  `pan` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `bank_ifsc` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_inquiries`
--

CREATE TABLE `contact_inquiries` (
  `inquiry_id` char(36) NOT NULL DEFAULT uuid(),
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `inquiry_source` enum('WEBSITE','REFERRAL','SOCIAL_MEDIA','WALK_IN','PHONE','OTHER') DEFAULT 'WEBSITE',
  `is_read` tinyint(1) DEFAULT 0,
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_inquiries`
--

INSERT INTO `contact_inquiries` (`inquiry_id`, `first_name`, `last_name`, `email`, `phone`, `subject`, `message`, `inquiry_source`, `is_read`, `is_resolved`, `resolved_at`, `notes`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`) VALUES
('b1c2d3e4-1234-5678-9012-345678901234', 'John', 'Doe', 'john.doe@example.com', '+91-9876543210', 'General Inquiry', 'I am interested in learning more about your services.', 'WEBSITE', 0, 0, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:19:43', 0, NULL);

--
-- Triggers `contact_inquiries`
--
DELIMITER $$
CREATE TRIGGER `trg_contact_inquiries_updated_at` BEFORE UPDATE ON `contact_inquiries` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `contact_inquiry_attachments`
--

CREATE TABLE `contact_inquiry_attachments` (
  `attachment_id` char(36) NOT NULL DEFAULT uuid(),
  `inquiry_id` char(36) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `contact_inquiry_attachments`
--
DELIMITER $$
CREATE TRIGGER `trg_contact_inquiry_attachments_updated_at` BEFORE UPDATE ON `contact_inquiry_attachments` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) DEFAULT 'Website Inquiry',
  `message` text DEFAULT NULL,
  `source` varchar(100) DEFAULT 'WEBSITE',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `source`, `is_read`, `created_at`) VALUES
(2, 'LOGANATHAN S', 'sloganathan0105@gmail.com', '8838676284', 'Web Development & AI Solutions', 'Hello, I’m Loganathan, a B.Tech AI & Data Science student with hands-on experience in web development, React, Python, and AI-based projects. I’m interested in opportunities to contribute to your team and gain practical industry experience. I would be happy to discuss how my technical skills and project experience can support your requirements. Thank you for your time, and I look forward to hearing from you.', 'WEBSITE', 0, '2026-09-30 06:55:33'),
(3, 'stephen', 'stephen862k7@gmail.com', '9345125667', 'Webdeveloper', 'i like to join with yours.', 'WEBSITE', 0, '2026-09-30 06:56:23'),
(4, 'Ethiroli Verification Test', 'verification@ethiroli.net', '+919876543210', 'Production Form Verification', 'This is a live test message to verify the contact form submission on production.', 'WEBSITE', 0, '2026-09-30 07:04:53');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('PERCENTAGE','FIXED') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) DEFAULT 0.00,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `valid_from` date NOT NULL,
  `valid_to` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `level` varchar(20) DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `duration_days` int(11) NOT NULL,
  `fee` decimal(10,2) DEFAULT NULL,
  `tutor_id` char(36) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_completions`
--

CREATE TABLE `course_completions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `enrollment_id` varchar(191) NOT NULL,
  `student_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `completed_at` datetime NOT NULL,
  `certificate_number` varchar(100) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `pdf_url` varchar(500) DEFAULT NULL,
  `qr_code_url` varchar(500) DEFAULT NULL,
  `status` enum('PENDING','ISSUED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_modules`
--

CREATE TABLE `course_modules` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `course_id` char(36) NOT NULL,
  `module_id` char(36) NOT NULL,
  `module_order` int(11) NOT NULL,
  `is_optional` tinyint(1) DEFAULT 0,
  `custom_duration_days` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_handovers`
--

CREATE TABLE `customer_handovers` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `deal_id` char(36) NOT NULL,
  `client_id` char(36) NOT NULL,
  `handover_to` enum('PROJECT_MANAGER','ACADEMIC_COORDINATOR','OPERATIONS') NOT NULL,
  `assigned_person_id` char(36) DEFAULT NULL,
  `scope_summary` text NOT NULL,
  `kickoff_date` date NOT NULL,
  `status` enum('PENDING','ACCEPTED','ONBOARDED') DEFAULT 'PENDING',
  `handover_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `description`, `location`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Engineering', 'Software development and technical operations', 'Building A', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(2, 'Human Resources', 'Recruitment, payroll, and employee relations', 'Building B', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(3, 'Finance', 'Accounting, invoicing, and financial planning', 'Building B', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(4, 'Sales', 'Client acquisition and relationship management', 'Building A', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(5, 'Operations', 'Project management and workflow coordination', 'Building C', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(6, 'Marketing', 'Brand management and digital marketing', 'Building A', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43');

--
-- Triggers `departments`
--
DELIMITER $$
CREATE TRIGGER `trg_departments_updated_at` BEFORE UPDATE ON `departments` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `device_registrations`
--

CREATE TABLE `device_registrations` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `platform` enum('IOS','ANDROID','WEB') NOT NULL,
  `push_token` varchar(255) NOT NULL,
  `app_version` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_active_at` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doubts`
--

CREATE TABLE `doubts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `student_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `lesson_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `code_snippet` text DEFAULT NULL,
  `screenshot_url` varchar(500) DEFAULT NULL,
  `status` enum('OPEN','IN_REVIEW','RESOLVED') DEFAULT 'OPEN',
  `assigned_tutor_id` char(36) DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `date_of_joining` date DEFAULT NULL,
  `salary_structure_id` char(36) DEFAULT NULL,
  `pan` varchar(255) DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `pf_number` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `department`, `designation`, `date_of_joining`, `salary_structure_id`, `pan`, `bank_account`, `pf_number`, `created_at`, `updated_at`) VALUES
('0e9212c3-a937-4700-a7e4-d3d052693bd9', '74e45a32-92ab-40f5-97c0-c888d7284c48', 'EMP-101', 'Engineering', 'Senior Full Stack Developer', '2026-10-15', NULL, NULL, NULL, NULL, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('2242c222-cd21-4176-8599-7b0eb1f475ba', 'a25602e3-ecd5-4fbf-a833-284bf9d36909', 'EMP-105', 'Sales & Growth', 'Business Development Executive', '2026-10-15', NULL, NULL, NULL, NULL, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('46fd39bb-80b8-4383-8cc5-8a2d83447a51', '7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', 'EMP-106', 'Front Desk & Operations', 'Front Desk Officer', '2026-10-15', NULL, NULL, NULL, NULL, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('c44ffd9c-7564-4d85-aad4-fd31b54af69d', '4433911c-04f6-4dc3-8738-e25ba5b1b4d4', 'EMP-103', 'Project Delivery', 'Technical Project Manager', '2026-10-15', NULL, NULL, NULL, NULL, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('e351874e-f2e0-43ae-b57f-6fb0320c6585', '8a8b4cfb-012a-4072-a24f-6cd999e9e007', 'EMP-104', 'Finance & Accounts', 'Finance & Accounts Specialist', '2026-10-15', NULL, NULL, NULL, NULL, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('fff74cdb-65e3-4158-b77e-cf81e49498c4', '0fa117ca-5edf-4687-b099-54290e40ffe1', 'EMP-102', 'Human Resources', 'HR Lead & Talent Ops', '2026-10-15', NULL, NULL, NULL, NULL, '2026-10-15 06:13:58', '2026-10-15 06:13:58');

-- --------------------------------------------------------

--
-- Table structure for table `employee_documents`
--

CREATE TABLE `employee_documents` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `employee_id` char(36) NOT NULL,
  `document_type` enum('RESUME','OFFER_LETTER','APPOINTMENT_LETTER','NDA','ID_PROOF','DEGREE_CERTIFICATE','EXPERIENCE_LETTER','PAYSLIP','OTHER') NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `status` enum('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  `verified_by` char(36) DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `uploaded_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `student_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `assigned_by_tutor_id` char(36) DEFAULT NULL,
  `enrolled_at` timestamp NULL DEFAULT current_timestamp(),
  `progress_percentage` decimal(5,2) DEFAULT 0.00,
  `status` enum('ACTIVE','COMPLETED','DROPPED') DEFAULT 'ACTIVE',
  `due_date` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exit_requests`
--

CREATE TABLE `exit_requests` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `employee_id` char(36) NOT NULL,
  `resignation_date` date NOT NULL,
  `requested_last_day` date NOT NULL,
  `approved_last_day` date DEFAULT NULL,
  `reason` text NOT NULL,
  `notice_period_days` int(11) DEFAULT 30,
  `status` enum('SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','WITHDRAWN','COMPLETED') DEFAULT 'SUBMITTED',
  `exit_interview_notes` text DEFAULT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feature_flags`
--

CREATE TABLE `feature_flags` (
  `id` char(36) NOT NULL,
  `flag_key` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `environment` varchar(50) NOT NULL DEFAULT 'PROD',
  `rollout_percentage` int(11) NOT NULL DEFAULT 100,
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `tenant_id` char(36) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feature_flags`
--

INSERT INTO `feature_flags` (`id`, `flag_key`, `name`, `description`, `environment`, `rollout_percentage`, `is_enabled`, `tenant_id`, `metadata`, `created_at`, `updated_at`) VALUES
('e9c57aef-bbf6-11f1-8036-89f8415d1036', 'enable_ai_analytics', 'Gemini AI Telemetry', 'Enables predictive student drop-off analytics and AI curriculum assistant.', 'PROD', 100, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('e9c57e3b-bbf6-11f1-8036-89f8415d1036', 'enable_stripe_billing', 'Stripe International Gateway', 'Allows USD and multi-currency credit card settlements.', 'PROD', 100, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('e9c57f24-bbf6-11f1-8036-89f8415d1036', 'enable_gamification_v2', 'Gamification Badges v2.0', 'New leaderboard algorithms and seasonal streak challenges.', 'CANARY', 50, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('e9c57f96-bbf6-11f1-8036-89f8415d1036', 'enable_automated_whatsapp', 'Automated WhatsApp Workflows', 'Dispatches interview and attendance notifications via WhatsApp gateway.', 'PROD', 100, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18'),
('e9c58004-bbf6-11f1-8036-89f8415d1036', 'enable_dark_mode_global', 'Global OLED Dark Theme', 'Platform-wide dark theme toggle for high-density portals.', 'PROD', 100, 1, NULL, NULL, '2026-09-29 11:14:18', '2026-09-29 11:14:18');

-- --------------------------------------------------------

--
-- Table structure for table `financial_budgets`
--

CREATE TABLE `financial_budgets` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `fiscal_year` varchar(10) NOT NULL,
  `quarter` enum('Q1','Q2','Q3','Q4','ANNUAL') NOT NULL,
  `department` enum('ENGINEERING','MARKETING','OPERATIONS','HUMAN_RESOURCES','GENERAL_ADMIN','SALES') NOT NULL,
  `category` varchar(100) NOT NULL,
  `allocated_amount` decimal(12,2) NOT NULL,
  `spent_amount` decimal(12,2) DEFAULT 0.00,
  `currency` varchar(10) DEFAULT 'INR',
  `notes` text DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financial_refunds`
--

CREATE TABLE `financial_refunds` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `invoice_id` char(36) DEFAULT NULL,
  `payment_id` char(36) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `reason` varchar(255) NOT NULL,
  `status` enum('PENDING','APPROVED','PROCESSED','REJECTED') DEFAULT 'PENDING',
  `gateway_refund_id` varchar(100) DEFAULT NULL,
  `utr_number` varchar(100) DEFAULT NULL,
  `requested_at` datetime DEFAULT current_timestamp(),
  `processed_at` datetime DEFAULT NULL,
  `processed_by` char(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_posts`
--

CREATE TABLE `forum_posts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `course_id` char(36) DEFAULT NULL,
  `author_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_locked` tinyint(1) DEFAULT 0,
  `view_count` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category` varchar(50) NOT NULL DEFAULT 'general'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_post_votes`
--

CREATE TABLE `forum_post_votes` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `post_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `vote` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `forum_replies`
--

CREATE TABLE `forum_replies` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `post_id` char(36) NOT NULL,
  `author_id` char(36) NOT NULL,
  `content` longtext NOT NULL,
  `is_best_answer` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `is_restricted` tinyint(1) DEFAULT 0,
  `restricted_to` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`restricted_to`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `integrations`
--

CREATE TABLE `integrations` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `service_name` varchar(100) NOT NULL,
  `category` enum('SECURITY','PAYMENTS','COMMUNICATION','CALENDAR','ANALYTICS','AUTOMATION','CRM','DEVTOOLS','JOBS') NOT NULL,
  `config` text NOT NULL,
  `is_enabled` tinyint(1) DEFAULT 0,
  `connection_status` enum('PENDING','CONNECTED','ERROR','DISABLED') DEFAULT 'PENDING',
  `last_synced_at` datetime DEFAULT NULL,
  `sync_log` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sync_log`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interns`
--

CREATE TABLE `interns` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `mentor_id` char(36) DEFAULT NULL,
  `college_name` varchar(255) DEFAULT NULL,
  `stipend` decimal(10,2) DEFAULT 0.00,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `interns`
--

INSERT INTO `interns` (`id`, `user_id`, `mentor_id`, `college_name`, `stipend`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
('9ff4b4f5-2803-40f7-a868-d5133f4ab264', '69fa12f1-7d71-4c2a-8122-c8c12ed8754a', NULL, 'Government College of Technology', 15000.00, '2026-10-13', '2027-01-11', '2026-10-15 06:03:41', '2026-10-15 06:03:41'),
('adcd3ce5-b4ea-43c9-a0a8-bd28871c20af', '45d3f678-47a0-442d-8330-9731b2d883b9', NULL, 'PSG College of Technology', 15000.00, '2026-10-13', '2027-01-11', '2026-10-15 06:03:41', '2026-10-15 06:03:41'),
('af5964a2-627c-40a6-b6c1-6f5db35e08ed', '58a8ee15-79a5-473f-ac95-c97bc03d3394', NULL, 'Anna University', 15000.00, '2026-10-13', '2027-01-11', '2026-10-15 06:03:41', '2026-10-15 06:03:41'),
('b8e8aa7a-3665-4373-8bb4-358fa24d9396', '584f6dc7-adaf-4fb5-8cd6-03987543d776', NULL, 'Coimbatore Institute of Technology', 15000.00, '2026-10-13', '2027-01-11', '2026-10-15 06:03:41', '2026-10-15 06:03:41'),
('c56a5051-e898-4afb-897e-61b5eeebe9ba', 'd17aab8c-9280-445f-85ce-cc2a93764ddb', NULL, 'SRM Institute of Science and Technology', 15000.00, '2026-10-13', '2027-01-11', '2026-10-15 06:03:41', '2026-10-15 06:03:41');

-- --------------------------------------------------------

--
-- Table structure for table `interviews`
--

CREATE TABLE `interviews` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `candidate_id` char(36) NOT NULL,
  `round` enum('ROUND_1','ROUND_2','HR_ROUND') NOT NULL,
  `interviewer_id` char(36) DEFAULT NULL,
  `scheduled_at` datetime NOT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `meeting_link` varchar(500) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `rating` int(11) DEFAULT 0,
  `status` enum('SCHEDULED','COMPLETED','CANCELLED','NO_SHOW') DEFAULT 'SCHEDULED',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interview_schedules`
--

CREATE TABLE `interview_schedules` (
  `interview_id` char(36) NOT NULL DEFAULT uuid(),
  `application_id` char(36) NOT NULL,
  `interview_type` varchar(100) DEFAULT NULL,
  `interview_round` int(11) DEFAULT 1,
  `scheduled_date` date NOT NULL,
  `scheduled_time` time DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `timezone` varchar(50) DEFAULT 'Asia/Kolkata',
  `interview_mode` enum('ONLINE','OFFLINE','PHONE') DEFAULT 'ONLINE',
  `location_link` varchar(500) DEFAULT NULL,
  `interviewer_name` varchar(255) DEFAULT NULL,
  `interviewer_email` varchar(255) DEFAULT NULL,
  `interviewer_phone` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_confirmed` tinyint(1) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `feedback_text` text DEFAULT NULL,
  `feedback_score` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `interview_schedules`
--
DELIMITER $$
CREATE TRIGGER `trg_interview_schedules_updated_at` BEFORE UPDATE ON `interview_schedules` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `invoice_number` varchar(50) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `student_id` char(36) DEFAULT NULL,
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `gst_rate` decimal(5,2) DEFAULT 0.00,
  `gst_amount` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `status` enum('DRAFT','SENT','PAID','OVERDUE','CANCELLED') DEFAULT 'DRAFT',
  `is_recurring` tinyint(1) DEFAULT 0,
  `recurring_schedule_id` char(36) DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `salary_range` varchar(100) DEFAULT NULL,
  `required_skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`required_skills`)),
  `status` enum('DRAFT','OPEN','CLOSED','FILLED') DEFAULT 'DRAFT',
  `posted_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_board_posts`
--

CREATE TABLE `job_board_posts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `job_id` char(36) NOT NULL,
  `platform` enum('LINKEDIN','NAUKRI','INDEED','INTERNSHALA') NOT NULL,
  `external_post_id` varchar(255) DEFAULT NULL,
  `posted_at` datetime DEFAULT NULL,
  `status` enum('PENDING','POSTED','FAILED','EXPIRED') DEFAULT 'PENDING',
  `error_message` text DEFAULT NULL,
  `platform_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`platform_response`)),
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_categories`
--

CREATE TABLE `job_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_categories`
--

INSERT INTO `job_categories` (`category_id`, `category_name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Software Development', 'Roles related to building software applications', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(2, 'Design', 'UI/UX and graphic design roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(3, 'Marketing', 'Digital and traditional marketing roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(4, 'Sales', 'Business development and sales roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(5, 'Human Resources', 'HR operations and recruitment roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(6, 'Finance', 'Accounting and financial analysis roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(7, 'Operations', 'Operations management and support roles', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43');

--
-- Triggers `job_categories`
--
DELIMITER $$
CREATE TRIGGER `trg_job_categories_updated_at` BEFORE UPDATE ON `job_categories` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `job_types`
--

CREATE TABLE `job_types` (
  `job_type_id` int(11) NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_types`
--

INSERT INTO `job_types` (`job_type_id`, `type_name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Full-Time', 'Permanent full-time employment', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(2, 'Part-Time', 'Part-time employment with flexible hours', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(3, 'Contract', 'Fixed-term contract employment', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(4, 'Internship', 'Temporary internship position', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43'),
(5, 'Remote', 'Fully remote work arrangement', 1, '2026-09-29 11:14:18', '2026-09-29 11:19:43');

--
-- Triggers `job_types`
--
DELIMITER $$
CREATE TRIGGER `trg_job_types_updated_at` BEFORE UPDATE ON `job_types` FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `source` enum('WEBSITE','REFERRAL','SOCIAL_MEDIA','WALK_IN','PHONE','INDEED','OTHER') NOT NULL DEFAULT 'OTHER',
  `status` enum('NEW','CONTACTED','DEMO','COUNSELLING','ADMISSION','PAYMENT','LOST') NOT NULL DEFAULT 'NEW',
  `assigned_to` char(36) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `converted_at` timestamp NULL DEFAULT NULL,
  `lost_reason` text DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `name`, `first_name`, `last_name`, `company_name`, `email`, `phone`, `source`, `status`, `assigned_to`, `notes`, `follow_up_date`, `converted_at`, `lost_reason`, `created_by`, `created_at`, `updated_at`) VALUES
('f5391a6a-bc97-11f1-8036-89f8415d1036', 'e6e60935b94dacd6ac5a2e1a:6805ac549ac4a1be10f65490985202a8:55125a2f10f7d47acc', NULL, NULL, NULL, '973dfe463ec85785f5f95af5:fd072ce98b8f15e4e426b59ae9a32d12:61c5ff18e26896a0cdbd2863e121d1ec', '1fccd310b2bd9c5f03620dc2:2e2d227037c94c40335fdb89252fd1ad:40223aacbe5f4b52a045', 'WEBSITE', 'NEW', NULL, 'Subject: Test Subject\nMessage: Test Message', NULL, NULL, NULL, '368f5c88-12cd-11ed-861d-0242ac120002', '2026-09-30 06:27:06', '2026-09-30 06:27:06');

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `leave_type` enum('CASUAL','SICK','EARNED') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `approved_by` char(36) DEFAULT NULL,
  `approval_chain_step` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_balances`
--

CREATE TABLE `leave_balances` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `leave_type` enum('CASUAL','SICK','EARNED') NOT NULL,
  `financial_year` varchar(10) NOT NULL,
  `total_credited` decimal(4,1) NOT NULL DEFAULT 0.0,
  `consumed` decimal(4,1) NOT NULL DEFAULT 0.0,
  `balance` decimal(4,1) GENERATED ALWAYS AS (`total_credited` - `consumed`) STORED,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `module_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `lesson_order` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `technology_module_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lesson_blocks`
--

CREATE TABLE `lesson_blocks` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `lesson_id` char(36) NOT NULL,
  `block_type` enum('VIDEO','MARKDOWN','CODE_PLAYGROUND','QUIZ_EMBED','RESOURCE_DOWNLOAD','CALLOUT') NOT NULL,
  `block_order` int(11) NOT NULL DEFAULT 1,
  `content_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content_payload`)),
  `is_interactive` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `enrollment_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `lesson_id` char(36) NOT NULL,
  `status` enum('NOT_STARTED','IN_PROGRESS','COMPLETED') DEFAULT 'NOT_STARTED',
  `seconds_watched` int(11) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `live_quiz_sessions`
--

CREATE TABLE `live_quiz_sessions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `quiz_id` char(36) NOT NULL,
  `tutor_id` char(36) NOT NULL,
  `started_at` datetime DEFAULT current_timestamp(),
  `ended_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `total_participants` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `sender_id` char(36) NOT NULL,
  `recipient_id` char(36) DEFAULT NULL,
  `channel_name` varchar(100) DEFAULT NULL,
  `message_content` text NOT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mfa_secrets`
--

CREATE TABLE `mfa_secrets` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `secret` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `backup_codes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`backup_codes`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mindmap_nodes`
--

CREATE TABLE `mindmap_nodes` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `project_id` char(36) DEFAULT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `node_type` enum('ROOT','BRANCH','LEAF') DEFAULT 'BRANCH',
  `position_x` decimal(10,2) DEFAULT 0.00,
  `position_y` decimal(10,2) DEFAULT 0.00,
  `color` varchar(20) DEFAULT '#4F46E5',
  `icon` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `course_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `module_order` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `description` text DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `module_topics`
--

CREATE TABLE `module_topics` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `module_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `topic_order` int(11) NOT NULL,
  `estimated_hours` decimal(5,2) DEFAULT 1.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_states`
--

CREATE TABLE `oauth_states` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `state` varchar(255) NOT NULL,
  `portal_slug` varchar(100) NOT NULL,
  `redirect_uri` varchar(500) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offboarding_checklists`
--

CREATE TABLE `offboarding_checklists` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `exit_request_id` char(36) NOT NULL,
  `department` enum('IT','HR','FINANCE','OPERATIONS','ADMIN') NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `is_cleared` tinyint(1) DEFAULT 0,
  `cleared_by` char(36) DEFAULT NULL,
  `cleared_at` datetime DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `order_number` varchar(50) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `coupon_code` varchar(50) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `payment_status` enum('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
  `payment_method` enum('RAZORPAY','STRIPE','BANK_TRANSFER') DEFAULT 'RAZORPAY',
  `payment_id` varchar(255) DEFAULT NULL,
  `billing_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`billing_address`)),
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `placed_at` datetime DEFAULT current_timestamp(),
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `order_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `invoice_id` char(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `method` enum('RAZORPAY','STRIPE','BANK_TRANSFER','CASH','CHEQUE') NOT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gateway_response`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `employee_id` char(36) NOT NULL,
  `month_year` date NOT NULL,
  `basic` decimal(10,2) NOT NULL,
  `hra` decimal(10,2) NOT NULL,
  `da` decimal(10,2) DEFAULT 0.00,
  `pf_employee` decimal(10,2) DEFAULT 0.00,
  `pf_employer` decimal(10,2) DEFAULT 0.00,
  `esi_employee` decimal(10,2) DEFAULT 0.00,
  `esi_employer` decimal(10,2) DEFAULT 0.00,
  `tds` decimal(10,2) DEFAULT 0.00,
  `gross_salary` decimal(10,2) NOT NULL,
  `net_salary` decimal(10,2) NOT NULL,
  `total_deductions` decimal(10,2) DEFAULT 0.00,
  `bank_transfer_ref` varchar(100) DEFAULT NULL,
  `payslip_pdf_url` varchar(500) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'DRAFT',
  `processed_by` char(36) DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `dispute_reason` text DEFAULT NULL,
  `adjustment_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `disputed_by` char(36) DEFAULT NULL,
  `disputed_at` datetime DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `performance_reviews`
--

CREATE TABLE `performance_reviews` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `employee_id` char(36) NOT NULL,
  `reviewer_id` char(36) NOT NULL,
  `review_date` date NOT NULL,
  `rating` int(11) DEFAULT 0,
  `feedback` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`feedback`)),
  `overall_comment` text DEFAULT NULL,
  `status` enum('DRAFT','SUBMITTED','ACKNOWLEDGED','ARCHIVED') DEFAULT 'DRAFT',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(36) NOT NULL,
  `code` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prediction_logs`
--

CREATE TABLE `prediction_logs` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `entity_type` enum('LEAD','STUDENT','EMPLOYEE') NOT NULL,
  `entity_id` char(36) NOT NULL,
  `prediction_type` enum('LEAD_SCORE','CHURN_PROBABILITY','PERFORMANCE') NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `confidence` decimal(5,2) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `explanation` text DEFAULT NULL,
  `model_version` varchar(50) DEFAULT NULL,
  `predicted_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `course_id` char(36) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discounted_price` decimal(10,2) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

CREATE TABLE `programs` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_days` int(11) NOT NULL,
  `tracks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tracks`)),
  `final_project` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `program_modules`
--

CREATE TABLE `program_modules` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `program_id` char(36) NOT NULL,
  `module_id` char(36) NOT NULL,
  `module_order` int(11) NOT NULL,
  `allocated_days` int(11) NOT NULL,
  `start_day` int(11) DEFAULT NULL,
  `end_day` int(11) DEFAULT NULL,
  `is_core` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_expenses`
--

CREATE TABLE `project_expenses` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `project_id` char(36) NOT NULL,
  `logged_by` char(36) NOT NULL,
  `category` enum('CLOUD_INFRA','SOFTWARE_LICENSE','HARDWARE','CONTRACTOR_FEE','TRAVEL','MISC') NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `expense_date` date NOT NULL,
  `receipt_url` varchar(500) DEFAULT NULL,
  `is_billable` tinyint(1) DEFAULT 1,
  `status` enum('PENDING','APPROVED','REJECTED','BILLED') DEFAULT 'PENDING',
  `approved_by` char(36) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `invoice_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_files`
--

CREATE TABLE `project_files` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `project_id` char(36) NOT NULL,
  `uploaded_by` char(36) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) NOT NULL DEFAULT 0,
  `mime_type` varchar(100) DEFAULT 'application/octet-stream',
  `version` varchar(20) DEFAULT '1.0',
  `category` enum('SPECIFICATION','DESIGN_ASSET','DELIVERABLE','CONTRACT','MEETING_RECORDING','OTHER') DEFAULT 'SPECIFICATION',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `project_members` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `project_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `project_role` enum('LEAD','MEMBER','CONTRIBUTOR','REVIEWER') DEFAULT 'MEMBER',
  `joined_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_milestones`
--

CREATE TABLE `project_milestones` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `project_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `target_date` date NOT NULL,
  `completed_date` date DEFAULT NULL,
  `status` enum('PENDING','IN_PROGRESS','REVIEW','COMPLETED','DELAYED') DEFAULT 'PENDING',
  `deliverable_url` varchar(500) DEFAULT NULL,
  `budget_allocated` decimal(12,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_sprints`
--

CREATE TABLE `project_sprints` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `project_id` char(36) NOT NULL,
  `sprint_number` int(11) NOT NULL,
  `sprint_name` varchar(100) NOT NULL,
  `goal` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('PLANNING','ACTIVE','COMPLETED','CANCELLED') DEFAULT 'PLANNING',
  `target_velocity` int(11) DEFAULT 0,
  `actual_velocity` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `provider_configs`
--

CREATE TABLE `provider_configs` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `provider` varchar(50) NOT NULL,
  `config_key` varchar(100) NOT NULL,
  `config_value` text NOT NULL,
  `is_encrypted` tinyint(1) DEFAULT 1,
  `is_enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `push_notifications`
--

CREATE TABLE `push_notifications` (
  `id` int(11) NOT NULL,
  `user_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `course_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `time_limit_minutes` int(11) DEFAULT 10,
  `passing_score` int(11) DEFAULT 70,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `quiz_id` char(36) NOT NULL,
  `student_id` char(36) NOT NULL,
  `score` int(11) DEFAULT 0,
  `total_questions` int(11) NOT NULL,
  `time_taken_seconds` int(11) DEFAULT 0,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`answers`)),
  `submitted_at` datetime DEFAULT current_timestamp(),
  `is_live` tinyint(1) DEFAULT 0,
  `live_session_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reception_appointments`
--

CREATE TABLE `reception_appointments` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `visitor_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) NOT NULL,
  `person_to_meet` char(36) DEFAULT NULL,
  `person_to_meet_name` varchar(255) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('SCHEDULED','CHECKED_IN','COMPLETED','CANCELLED','NO_SHOW') DEFAULT 'SCHEDULED',
  `badge_number` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reception_receipts`
--

CREATE TABLE `reception_receipts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `receipt_number` varchar(50) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `student_id` char(36) DEFAULT NULL,
  `course_id` char(36) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_mode` enum('CASH','UPI','CARD','NET_BANKING') DEFAULT 'UPI',
  `purpose` enum('TUITION_FEE','ADMISSION_FEE','EXAM_FEE','CERTIFICATE_FEE','OTHER') DEFAULT 'ADMISSION_FEE',
  `issued_by` char(36) NOT NULL,
  `issued_at` timestamp NULL DEFAULT current_timestamp(),
  `transaction_reference` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recurring_schedules`
--

CREATE TABLE `recurring_schedules` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `client_id` char(36) DEFAULT NULL,
  `student_id` char(36) DEFAULT NULL,
  `frequency` enum('MONTHLY','QUARTERLY','YEARLY') NOT NULL,
  `next_generation_date` date NOT NULL,
  `last_generated_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report_definitions`
--

CREATE TABLE `report_definitions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`dimensions`)),
  `metrics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`metrics`)),
  `filters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`filters`)),
  `chart_type` enum('TABLE','BAR','LINE','PIE','AREA') DEFAULT 'TABLE',
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `security_rank` int(11) NOT NULL DEFAULT 10,
  `is_system_role` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `code`, `name`, `description`, `security_rank`, `is_system_role`, `created_at`, `updated_at`) VALUES
('role-admin', 'ADMIN', 'Administrator', 'Platform operations and tenant manager', 80, 1, '2026-09-29 11:29:13', '2026-09-29 11:29:13'),
('role-super-admin', 'SUPER_ADMIN', 'Super Administrator', 'Global root platform administrator with full clearance', 100, 1, '2026-09-29 11:29:13', '2026-09-29 11:29:13');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` varchar(36) NOT NULL,
  `permission_id` varchar(36) NOT NULL,
  `granted_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salary_structures`
--

CREATE TABLE `salary_structures` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `employee_id` char(36) NOT NULL,
  `basic` decimal(10,2) NOT NULL,
  `hra` decimal(10,2) NOT NULL,
  `da` decimal(10,2) DEFAULT 0.00,
  `pf_percentage` decimal(5,2) DEFAULT 12.00,
  `esi_percentage` decimal(5,2) DEFAULT 0.75,
  `tds_percentage` decimal(5,2) DEFAULT 0.00,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_activities`
--

CREATE TABLE `sales_activities` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `activity_type` enum('CALL','MEETING','DEMO','EMAIL','FOLLOW_UP','NOTE') NOT NULL,
  `lead_id` char(36) DEFAULT NULL,
  `deal_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `outcome` enum('CONNECTED','BUSY','NO_ANSWER','MEETING_BOOKED','COMPLETED','CANCELLED') DEFAULT 'COMPLETED',
  `duration_minutes` int(11) DEFAULT 15,
  `scheduled_at` datetime NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  `meeting_link` varchar(500) DEFAULT NULL,
  `performed_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_deals`
--

CREATE TABLE `sales_deals` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) NOT NULL,
  `client_id` char(36) DEFAULT NULL,
  `lead_id` char(36) DEFAULT NULL,
  `contact_name` varchar(255) NOT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `deal_value` decimal(12,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `stage` enum('QUALIFICATION','DISCOVERY','PROPOSAL_SENT','NEGOTIATION','CLOSED_WON','CLOSED_LOST') DEFAULT 'QUALIFICATION',
  `probability` int(11) DEFAULT 20,
  `expected_close_date` date NOT NULL,
  `actual_close_date` date DEFAULT NULL,
  `loss_reason` varchar(255) DEFAULT NULL,
  `owner_id` char(36) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_proposals`
--

CREATE TABLE `sales_proposals` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `proposal_number` varchar(50) NOT NULL,
  `deal_id` char(36) DEFAULT NULL,
  `client_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `discount_percentage` decimal(5,2) DEFAULT 0.00,
  `valid_until` date NOT NULL,
  `status` enum('DRAFT','SENT','ACCEPTED','DECLINED','EXPIRED') DEFAULT 'DRAFT',
  `deliverables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`deliverables`)),
  `pdf_url` varchar(500) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_targets`
--

CREATE TABLE `sales_targets` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `fiscal_year` varchar(10) NOT NULL,
  `period_type` enum('MONTHLY','QUARTERLY','ANNUAL') NOT NULL,
  `period_label` varchar(50) NOT NULL,
  `target_revenue` decimal(12,2) NOT NULL,
  `achieved_revenue` decimal(12,2) DEFAULT 0.00,
  `deals_target` int(11) DEFAULT 5,
  `deals_won` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scheduled_reports`
--

CREATE TABLE `scheduled_reports` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `report_definition_id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `frequency` enum('DAILY','WEEKLY','MONTHLY') NOT NULL,
  `format` enum('PDF','CSV','EXCEL') DEFAULT 'PDF',
  `recipient_emails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`recipient_emails`)),
  `last_sent_at` datetime DEFAULT NULL,
  `next_send_at` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `security_threat_logs`
--

CREATE TABLE `security_threat_logs` (
  `id` char(36) NOT NULL,
  `threat_type` varchar(100) NOT NULL,
  `source_ip` varchar(45) NOT NULL,
  `target_endpoint` varchar(255) NOT NULL,
  `severity` varchar(50) NOT NULL DEFAULT 'HIGH',
  `status` varchar(50) NOT NULL DEFAULT 'IP_BLOCKED',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `security_threat_logs`
--

INSERT INTO `security_threat_logs` (`id`, `threat_type`, `source_ip`, `target_endpoint`, `severity`, `status`, `details`, `created_at`) VALUES
('e9c5b961-bbf6-11f1-8036-89f8415d1036', 'BRUTE_FORCE_PREVENTION', '185.220.101.5', '/v1/auth/login', 'CRITICAL', 'IP_BLOCKED', '{\"attempts\": 15, \"country\": \"DE\"}', '2026-09-29 11:14:18'),
('e9c5bcef-bbf6-11f1-8036-89f8415d1036', 'UNAUTHORIZED_SCOPED_TOKEN', '194.26.29.112', '/v1/tenants/export', 'HIGH', 'TOKEN_REVOKED', '{\"token_prefix\": \"ey...\", \"reason\": \"scope_mismatch\"}', '2026-09-29 11:14:18'),
('e9c5be04-bbf6-11f1-8036-89f8415d1036', 'RATE_LIMIT_EXCEEDED', '103.14.26.89', '/v1/users', 'MEDIUM', 'THROTTLED', '{\"rate\": \"45 req/s\", \"limit\": \"30 req/s\"}', '2026-09-29 11:14:18');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `portal_slug` varchar(100) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_projects`
--

CREATE TABLE `student_projects` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `student_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `github_repo_url` varchar(500) NOT NULL,
  `repo_owner` varchar(255) DEFAULT NULL,
  `repo_name` varchar(255) DEFAULT NULL,
  `branch` varchar(255) DEFAULT 'main',
  `last_commit_hash` varchar(255) DEFAULT NULL,
  `repo_structure` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`repo_structure`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `manager_id` char(36) DEFAULT NULL,
  `assigned_user_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`assigned_user_ids`)),
  `priority` varchar(20) DEFAULT 'MEDIUM',
  `due_date` date DEFAULT NULL,
  `status` varchar(30) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `client_id` char(36) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `monthly_fee` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `renewal_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `ticket_number` varchar(30) NOT NULL,
  `user_id` char(36) NOT NULL,
  `category` enum('IT_SUPPORT','HR_QUERY','PAYROLL_ISSUE','FACILITIES','ADMIN') NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'MEDIUM',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `status` enum('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
  `assigned_to` char(36) DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_configs`
--

CREATE TABLE `system_configs` (
  `id` int(11) NOT NULL,
  `config_key` varchar(100) NOT NULL,
  `config_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config_value`)),
  `is_encrypted` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_configs`
--

INSERT INTO `system_configs` (`id`, `config_key`, `config_value`, `is_encrypted`, `updated_at`) VALUES
(1, 'ALLOWED_ORIGINS', '[\"http://localhost:5173\", \"http://localhost:3000\"]', 0, '2026-09-22 05:59:16');

-- --------------------------------------------------------

--
-- Table structure for table `system_error_logs`
--

CREATE TABLE `system_error_logs` (
  `id` bigint(20) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `error_type` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `stack_trace` longtext DEFAULT NULL,
  `endpoint` varchar(500) DEFAULT NULL,
  `method` varchar(10) DEFAULT NULL,
  `status_code` int(11) DEFAULT NULL,
  `request_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`request_payload`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `is_resolved` tinyint(1) DEFAULT 0,
  `resolved_at` datetime DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `resolved_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `subscription_id` char(36) NOT NULL,
  `description` text NOT NULL,
  `due_date` date NOT NULL,
  `status` enum('PENDING','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING',
  `assigned_to` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `project_id` char(36) DEFAULT NULL,
  `sprint_id` char(36) DEFAULT NULL,
  `milestone_id` char(36) DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `estimated_hours` decimal(4,1) DEFAULT 0.0,
  `actual_hours` decimal(4,1) DEFAULT 0.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tax_filings`
--

CREATE TABLE `tax_filings` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `return_type` enum('GSTR1','GSTR3B','GSTR2B','TDS_26Q','TDS_24Q','ADVANCE_TAX') NOT NULL,
  `filing_period` varchar(50) NOT NULL,
  `due_date` date NOT NULL,
  `filed_date` date DEFAULT NULL,
  `arn_number` varchar(100) DEFAULT NULL,
  `tax_payable` decimal(12,2) DEFAULT 0.00,
  `tax_paid` decimal(12,2) DEFAULT 0.00,
  `status` enum('DRAFT','FILED','VERIFIED','OVERDUE') DEFAULT 'DRAFT',
  `acknowledgment_url` varchar(500) DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `technology_modules`
--

CREATE TABLE `technology_modules` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `code` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `level` varchar(50) NOT NULL,
  `duration_hours` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `topics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`topics`)),
  `technologies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`technologies`)),
  `practicals` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`practicals`)),
  `projects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`projects`)),
  `prerequisites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`prerequisites`)),
  `learning_outcomes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`learning_outcomes`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenants`
--

CREATE TABLE `tenants` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `subdomain` varchar(100) NOT NULL,
  `custom_domain` varchar(255) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `primary_color` varchar(20) DEFAULT '#4F46E5',
  `secondary_color` varchar(20) DEFAULT '#0EA5E9',
  `favicon_url` varchar(500) DEFAULT NULL,
  `email_from` varchar(255) DEFAULT NULL,
  `timezone` varchar(100) DEFAULT 'Asia/Kolkata',
  `currency` varchar(10) DEFAULT 'INR',
  `is_active` tinyint(1) DEFAULT 1,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenant_users`
--

CREATE TABLE `tenant_users` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `tenant_role` varchar(50) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timesheets`
--

CREATE TABLE `timesheets` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `project_id` char(36) DEFAULT NULL,
  `task_id` char(36) DEFAULT NULL,
  `work_date` date NOT NULL,
  `hours_spent` decimal(4,2) NOT NULL,
  `description` text NOT NULL,
  `status` enum('DRAFT','SUBMITTED','APPROVED','REJECTED') DEFAULT 'SUBMITTED',
  `approved_by` char(36) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `type` enum('INCOME','EXPENSE') NOT NULL,
  `category` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `description` text DEFAULT NULL,
  `invoice_id` char(36) DEFAULT NULL,
  `gst_applicable` tinyint(1) DEFAULT 0,
  `gst_amount` decimal(10,2) DEFAULT 0.00,
  `created_by` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_method` enum('BANK_TRANSFER','UPI','CARD','CASH','CHEQUE','RAZORPAY','STRIPE') DEFAULT 'BANK_TRANSFER',
  `reference_number` varchar(100) DEFAULT NULL,
  `is_reconciled` tinyint(1) DEFAULT 0,
  `reconciled_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','HR','TUTOR','PROJECT_MANAGER','FINANCE','SALES','RECEPTION','EMPLOYEE','STUDENT','INTERN','CLIENT','VENDOR') NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `avatar_url`, `last_login_at`, `is_active`, `preferences`, `created_at`, `updated_at`) VALUES
('0fa117ca-5edf-4687-b099-54290e40ffe1', '9944bc544d9ea138e00b990d:2a43c796e07c7a34783e55ff1e96c577:7626b327ccc947bc4a00b75389c655', '$2b$12$9e/QX95IkijRF0DDRSQ7X.HnUAcm04l6fai7qJmUKAp1U27ln0X4S', 'c5784ff0c040ac2cd1bb2e24:923125a78a55d29a9d0e483e5f9efa1d:584f32f1a62be555dbea', NULL, 'HR', NULL, NULL, 1, '{\"department\":\"Human Resources\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('368f5c88-12cd-11ed-861d-0242ac120002', 'admin@ethiroli.com', '$2b$12$tjkRN0uGVqretPlMlLqI5Oe2817HGGLC0RCvUHGBxigx9gR/AXHJW', 'f55ac0d35e1c1f98c49a6f39:eb7df635ba2153260963abdc5b23823e:ac3ed04fb628de277e8f0a4a518b35ff3f8d55', NULL, 'SUPER_ADMIN', NULL, NULL, 1, '{\"department\":\"Executive Operations\",\"college\":null,\"seeded\":true}', '2026-09-22 05:59:16', '2026-10-15 06:13:58'),
('39a59061-1113-49a8-8d63-4558bb4e70f4', '7f26bdc38553dd76c68db2d2:16b3295533fac8011efe2c86d6fdd61d:94ae2d450a03d8ddf75e88ead3af5b125ac03e2c', '$2b$12$sq.hiRCrdbCDT3FY1QoAduOJdKPLxciKeiOVC2iybkMg7QopF/pmS', '1ce0021adb64c0eae0cef965:4b4252876eb7c6328415ea4330161ff2:6d8b4f8661c38466672e186df162b820', NULL, 'STUDENT', NULL, NULL, 1, '{\"department\":\"Computer Science\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('3bb859a1-cb3d-4952-b892-3868dfd6541f', '77e8f17042a5bc6511fa20f1:f459ba4d7eb137b0d91d8495015b6343:2ba81b376d8ba986e66e8574742a78', '$2b$12$N2b18h07gP6v1cI0x8V2QOhv9L5mH9Fv7j2R8w4m1t3v8K6P2x7yC', '2bb76f253da541289134a6ef:525287f39455359a1036cbff5dbdbfc3:cae5445c76da34fa6180cf7bc5ec', NULL, 'EMPLOYEE', NULL, NULL, 1, '{\"department\":\"Engineering\",\"college\":null,\"seeded\":true}', '2026-10-15 05:24:51', '2026-10-15 05:24:51'),
('4433911c-04f6-4dc3-8738-e25ba5b1b4d4', 'ef6bacbe5becc007bb0e63f4:85c127605285601f88789fc7eb141878:16dd2621c6664fedd27e4713f566ef', '$2b$12$Ga6WUB2KCfCShtD9w2GJ5eL4BB2Z/wxf5A1.QKo/htX9bivu35waW', '282c525dddf81a8c82f2673f:cc1119fb21437ccb32aeca4eec130c9d:d0b1eff3dc5440d68a3ce9e541a459', NULL, 'PROJECT_MANAGER', NULL, NULL, 1, '{\"department\":\"Project Delivery\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('45d3f678-47a0-442d-8330-9731b2d883b9', 'srinithikumar54@gmail.com', '$2b$12$r/bHnoAL75sD8gSxa45bA.Anm9sHzCpVUfEXW0RNnXeYos1dHKbWi', 'Srinithi Kumar', NULL, 'INTERN', NULL, NULL, 1, '{\"department\":\"Full Stack Development\",\"college\":\"PSG College of Technology\",\"seeded\":true}', '2026-10-15 06:02:32', '2026-10-15 06:02:32'),
('479f6d99-23de-22fe-972e-0353bd230003', 'admin@ethiroli.net', '$2b$10$sGe5S3fdrs7.dik.luV0w.keytoKyDhoHRhE41F5FTxGtp01lOQOK', 'System Administrator', NULL, 'ADMIN', NULL, NULL, 1, NULL, '2026-09-29 11:29:13', '2026-09-29 11:29:13'),
('584f6dc7-adaf-4fb5-8cd6-03987543d776', 'sloganathan0105@gmail.com', '$2b$12$QIDDYjt4X5wIXTgia.36NOKjeRgjiBRMYaHw5.JTwJPXCJjJ7ALt2', 'S Loganathan', NULL, 'INTERN', NULL, NULL, 1, '{\"department\":\"Web Applications\",\"college\":\"Coimbatore Institute of Technology\",\"seeded\":true}', '2026-10-15 06:02:32', '2026-10-15 06:02:32'),
('58a8ee15-79a5-473f-ac95-c97bc03d3394', 'gokulrajkumar2006@gmail.com', '$2b$12$MKy82R2.0tVW5FMjvvvoHeInUltE2Wt6ocn2feRJE6OMGlu7XsUBm', '5363e5b8a4429dc47204253c:4e3d52cd78dd3c50428a9d3c483dc6fe:69f98602520c2de2657a4813866a', NULL, 'INTERN', NULL, NULL, 1, '{\"department\":\"Software Engineering\",\"college\":\"Anna University\",\"seeded\":true}', '2026-10-15 06:02:32', '2026-10-15 06:14:36'),
('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', 'stephen862k7@gmail.com', '$2b$12$NHI74VQqRfqX.pWfykmbWe0GuGm2TUg61KFRZoDMo2wy36r3QNapa', 'Stephen', NULL, 'INTERN', NULL, NULL, 1, '{\"department\":\"Frontend Engineering\",\"college\":\"Government College of Technology\",\"seeded\":true}', '2026-10-15 06:02:32', '2026-10-15 06:02:32'),
('74e45a32-92ab-40f5-97c0-c888d7284c48', 'f705510f6931e0c2bb53a848:bd583fb9d508f5a5785a220d1b6e435b:7673be4874a36d602d750a417aaee61cf69388617e', '$2b$12$MwsiI6XzQiLXLWy5B2MssOstebVUQCAz.GkABTYcNzRa4QGb7D6bW', 'cf5160f97b8419be51580eab:43669fd59003245cbc466abc79d41ffb:d69c07e86d5db989b1fb96384c5ffc', NULL, 'EMPLOYEE', NULL, NULL, 1, '{\"department\":\"Engineering\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', 'd037976d6b670d8f6aaf7b11:1c7d9cd7249239975e286862e991feea:6ab4ddc3603d58c18cc654f96782a4faba00d101684f', '$2b$12$SztNhOH8vNJFuY0dkWV5A.C.OIsIAz/wwKrjtzDwSAy77HBjLmsES', 'd221351f6ec6ef003f00c072:0c1e0ca3117ec4680e58a786413fb640:02b2f7ca24bdb15cb53eee05bef2e286484a', NULL, 'RECEPTION', NULL, NULL, 1, '{\"department\":\"Front Desk & Operations\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('8a8b4cfb-012a-4072-a24f-6cd999e9e007', 'ba19cdc0a1bb6536e110630f:21ae84d4ae9da2225fa11384c7d1dbbb:9a7de1d8a90e5188dab45d3fcdcf8b7ebf798868', '$2b$12$SHqpm4HR8OfAWWJXD2Y3QOVmwf2v/QOUnXY1yYpcMqCNktzOEfgVO', '0a4d82cdb2aaaff665584447:4ad222be01d53f396f33fcb2bcc3b6ee:57e454a23c7237b81cead8de', NULL, 'FINANCE', NULL, NULL, 1, '{\"department\":\"Finance & Accounts\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('a25602e3-ecd5-4fbf-a833-284bf9d36909', '074da5370a0fa5ebc734db45:d1d9039ce289c48920dffdc1d21a7eaf:8e57168f7964e0b74fd0b94d6447db6ca687', '$2b$12$kucK.8f6b7g96Qg3UmPO8OPGE/1Se2EAXOo.Cc106UWp4maTvk8S2', '356c252d144e11f745667e78:7204c438ffda51e955af695e3cae46f6:411aab437068155cfa8612e7faf68c', NULL, 'SALES', NULL, NULL, 1, '{\"department\":\"Sales & Growth\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('bef7a014-983a-4041-89a1-c8cfa4590993', '096f2daf6bb8534451b7ca22:99f931f5373ef6b958727aa5b7ce46c2:bf631e5683270818fe02a8e85d1916dc5e1dbe56dc', '$2b$12$Y2qklBaSTOKe8en4qOB7VOPTHU8TTGxXLOdKuzRLcnfmlb7JiFrAe', '37a721997b767f4ecee41dd9:8426169c4ddf3ce723e76ff7aa25ed52:e3e18a250774a30a0f77c2e384c999d9050d', NULL, 'ADMIN', NULL, NULL, 1, '{\"department\":\"Administration\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('c5ec486b-ab51-437d-b6f1-3e0c25a36de3', '426e057d06ba50fefdedfe04:0af9048c77553bf34ab67e71b74143f2:58db2a8d5815a19ee49a0398d5e72111ab3b8d', '$2b$12$RXWpDBLS/8RuZgEmMN2lv.8vKtIuHMr/ilf.xDFrKyKjV/PBJUVAy', '37a5b8a60ac33eb393a2af19:0ef0a9947802a32dd8e7db038772a157:0794ab99f83567e86dbcf24ca6b740', NULL, 'INTERN', NULL, NULL, 1, '{\"department\":\"Software Engineering\",\"college\":\"Anna University, Chennai\",\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('c60caddb-2848-492a-8724-4e7ec5d55850', '45d92b301139716fe1e12085:489449cddd8d4a50f832f42539c0d32a:14fc42a0fd22c172fc4aaa1f59be48862463', '$2b$12$98.bQwZKLJqPMcBnLxtU/OTtWVPvI8pqwCoU3MNh6AXY.VFV8ciKm', '631c473bb519d9e01ac63fb3:6f27263046076850ed3c8935adf52369:4ded3be60413ef538ce5a4ec9f748dd2443f673c476fb811887b', NULL, 'TUTOR', NULL, NULL, 1, '{\"department\":\"Academics & Training\",\"college\":null,\"seeded\":true}', '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('d17aab8c-9280-445f-85ce-cc2a93764ddb', 'Barathappu777@gmail.com', '$2b$12$ADPmoic0ZmHDVoOcEf4bU.QmwOmLqhesnotno/VwgN2ofOMmqUK/e', 'Barath Appu', NULL, 'INTERN', NULL, NULL, 1, '{\"department\":\"Backend Engineering\",\"college\":\"SRM Institute of Science and Technology\",\"seeded\":true}', '2026-10-15 06:02:32', '2026-10-15 06:02:32');

-- --------------------------------------------------------

--
-- Table structure for table `user_badges`
--

CREATE TABLE `user_badges` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `badge_id` char(36) NOT NULL,
  `earned_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_credentials`
--

CREATE TABLE `user_credentials` (
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_credentials`
--

INSERT INTO `user_credentials` (`user_id`, `password_hash`, `password_algo`, `password_updated_at`, `failed_login_attempts`, `lockout_until`, `requires_password_change`, `password_history`, `two_factor_secret`, `two_factor_enabled`, `created_at`, `updated_at`) VALUES
('0fa117ca-5edf-4687-b099-54290e40ffe1', '$2b$12$9e/QX95IkijRF0DDRSQ7X.HnUAcm04l6fai7qJmUKAp1U27ln0X4S', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$9e/QX95IkijRF0DDRSQ7X.HnUAcm04l6fai7qJmUKAp1U27ln0X4S\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('368f5c88-12cd-11ed-861d-0242ac120002', '$2b$12$tjkRN0uGVqretPlMlLqI5Oe2817HGGLC0RCvUHGBxigx9gR/AXHJW', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$tjkRN0uGVqretPlMlLqI5Oe2817HGGLC0RCvUHGBxigx9gR/AXHJW\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('39a59061-1113-49a8-8d63-4558bb4e70f4', '$2b$12$sq.hiRCrdbCDT3FY1QoAduOJdKPLxciKeiOVC2iybkMg7QopF/pmS', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$sq.hiRCrdbCDT3FY1QoAduOJdKPLxciKeiOVC2iybkMg7QopF/pmS\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('4433911c-04f6-4dc3-8738-e25ba5b1b4d4', '$2b$12$Ga6WUB2KCfCShtD9w2GJ5eL4BB2Z/wxf5A1.QKo/htX9bivu35waW', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$Ga6WUB2KCfCShtD9w2GJ5eL4BB2Z/wxf5A1.QKo/htX9bivu35waW\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('45d3f678-47a0-442d-8330-9731b2d883b9', '$2b$12$r/bHnoAL75sD8gSxa45bA.Anm9sHzCpVUfEXW0RNnXeYos1dHKbWi', 'BCRYPT', '2026-10-15 06:02:32', 0, NULL, 0, '[\"$2b$12$r/bHnoAL75sD8gSxa45bA.Anm9sHzCpVUfEXW0RNnXeYos1dHKbWi\"]', NULL, 0, '2026-10-15 06:02:32', '2026-10-15 06:02:32'),
('584f6dc7-adaf-4fb5-8cd6-03987543d776', '$2b$12$QIDDYjt4X5wIXTgia.36NOKjeRgjiBRMYaHw5.JTwJPXCJjJ7ALt2', 'BCRYPT', '2026-10-15 06:02:32', 0, NULL, 0, '[\"$2b$12$QIDDYjt4X5wIXTgia.36NOKjeRgjiBRMYaHw5.JTwJPXCJjJ7ALt2\"]', NULL, 0, '2026-10-15 06:02:32', '2026-10-15 06:02:32'),
('58a8ee15-79a5-473f-ac95-c97bc03d3394', '$2b$12$MKy82R2.0tVW5FMjvvvoHeInUltE2Wt6ocn2feRJE6OMGlu7XsUBm', 'BCRYPT', '2026-10-15 06:14:36', 0, NULL, 0, '[\"$2b$12$MKy82R2.0tVW5FMjvvvoHeInUltE2Wt6ocn2feRJE6OMGlu7XsUBm\"]', NULL, 0, '2026-10-15 06:02:32', '2026-10-15 06:14:36'),
('69fa12f1-7d71-4c2a-8122-c8c12ed8754a', '$2b$12$NHI74VQqRfqX.pWfykmbWe0GuGm2TUg61KFRZoDMo2wy36r3QNapa', 'BCRYPT', '2026-10-15 06:02:32', 0, NULL, 0, '[\"$2b$12$NHI74VQqRfqX.pWfykmbWe0GuGm2TUg61KFRZoDMo2wy36r3QNapa\"]', NULL, 0, '2026-10-15 06:02:32', '2026-10-15 06:02:32'),
('74e45a32-92ab-40f5-97c0-c888d7284c48', '$2b$12$MwsiI6XzQiLXLWy5B2MssOstebVUQCAz.GkABTYcNzRa4QGb7D6bW', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$MwsiI6XzQiLXLWy5B2MssOstebVUQCAz.GkABTYcNzRa4QGb7D6bW\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('7aa13dcd-5fd3-49d8-866f-c5451af8bf7f', '$2b$12$SztNhOH8vNJFuY0dkWV5A.C.OIsIAz/wwKrjtzDwSAy77HBjLmsES', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$SztNhOH8vNJFuY0dkWV5A.C.OIsIAz/wwKrjtzDwSAy77HBjLmsES\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('8a8b4cfb-012a-4072-a24f-6cd999e9e007', '$2b$12$SHqpm4HR8OfAWWJXD2Y3QOVmwf2v/QOUnXY1yYpcMqCNktzOEfgVO', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$SHqpm4HR8OfAWWJXD2Y3QOVmwf2v/QOUnXY1yYpcMqCNktzOEfgVO\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('a25602e3-ecd5-4fbf-a833-284bf9d36909', '$2b$12$kucK.8f6b7g96Qg3UmPO8OPGE/1Se2EAXOo.Cc106UWp4maTvk8S2', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$kucK.8f6b7g96Qg3UmPO8OPGE/1Se2EAXOo.Cc106UWp4maTvk8S2\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('bef7a014-983a-4041-89a1-c8cfa4590993', '$2b$12$Y2qklBaSTOKe8en4qOB7VOPTHU8TTGxXLOdKuzRLcnfmlb7JiFrAe', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$Y2qklBaSTOKe8en4qOB7VOPTHU8TTGxXLOdKuzRLcnfmlb7JiFrAe\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('c5ec486b-ab51-437d-b6f1-3e0c25a36de3', '$2b$12$RXWpDBLS/8RuZgEmMN2lv.8vKtIuHMr/ilf.xDFrKyKjV/PBJUVAy', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$RXWpDBLS/8RuZgEmMN2lv.8vKtIuHMr/ilf.xDFrKyKjV/PBJUVAy\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('c60caddb-2848-492a-8724-4e7ec5d55850', '$2b$12$98.bQwZKLJqPMcBnLxtU/OTtWVPvI8pqwCoU3MNh6AXY.VFV8ciKm', 'BCRYPT', '2026-10-15 06:13:58', 0, NULL, 0, '[\"$2b$12$98.bQwZKLJqPMcBnLxtU/OTtWVPvI8pqwCoU3MNh6AXY.VFV8ciKm\"]', NULL, 0, '2026-10-15 06:13:58', '2026-10-15 06:13:58'),
('d17aab8c-9280-445f-85ce-cc2a93764ddb', '$2b$12$ADPmoic0ZmHDVoOcEf4bU.QmwOmLqhesnotno/VwgN2ofOMmqUK/e', 'BCRYPT', '2026-10-15 06:02:32', 0, NULL, 0, '[\"$2b$12$ADPmoic0ZmHDVoOcEf4bU.QmwOmLqhesnotno/VwgN2ofOMmqUK/e\"]', NULL, 0, '2026-10-15 06:02:32', '2026-10-15 06:02:32');

-- --------------------------------------------------------

--
-- Table structure for table `visitor_logs`
--

CREATE TABLE `visitor_logs` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `visitor_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `purpose` varchar(255) NOT NULL,
  `person_to_meet` char(36) DEFAULT NULL,
  `person_to_meet_name` varchar(255) DEFAULT NULL,
  `badge_number` varchar(50) DEFAULT NULL,
  `check_in_time` datetime NOT NULL DEFAULT current_timestamp(),
  `check_out_time` datetime DEFAULT NULL,
  `status` enum('CHECKED_IN','CHECKED_OUT','EXPECTED') DEFAULT 'CHECKED_IN',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_active_job_postings`
-- (See below for the actual view)
--
CREATE TABLE `vw_active_job_postings` (
`id` char(36)
,`title` varchar(255)
,`description` longtext
,`location` varchar(255)
,`salary_range` varchar(100)
,`status` enum('DRAFT','OPEN','CLOSED','FILLED')
,`posted_at` datetime
,`created_at` timestamp
,`department` varchar(100)
,`department_name` varchar(100)
,`required_skills` longtext
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_application_tracking`
-- (See below for the actual view)
--
CREATE TABLE `vw_application_tracking` (
`application_id` char(36)
,`applied_at` datetime
,`cover_letter` text
,`job_id` char(36)
,`job_title` varchar(255)
,`job_department` varchar(100)
,`candidate_id` char(36)
,`candidate_name` varchar(255)
,`candidate_email` varchar(255)
,`candidate_phone` varchar(255)
,`status_id` int(11)
,`status_name` varchar(100)
,`display_order` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `webhook_subscriptions`
--

CREATE TABLE `webhook_subscriptions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `tenant_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `events` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`events`)),
  `secret` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_delivery_at` datetime DEFAULT NULL,
  `last_delivery_status` enum('SUCCESS','FAILED') DEFAULT NULL,
  `failure_count` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workflows`
--

CREATE TABLE `workflows` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `entity_type` enum('LEAVE','INVOICE','HIRING','EXPENSE','PURCHASE') NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workflow_executions`
--

CREATE TABLE `workflow_executions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `workflow_id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `entity_id` char(36) NOT NULL,
  `current_node_id` char(36) DEFAULT NULL,
  `status` enum('PENDING','RUNNING','COMPLETED','FAILED','PAUSED') DEFAULT 'PENDING',
  `execution_context` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`execution_context`)),
  `error_message` text DEFAULT NULL,
  `triggered_by` char(36) DEFAULT NULL,
  `started_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workflow_nodes`
--

CREATE TABLE `workflow_nodes` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `workflow_id` char(36) NOT NULL,
  `node_type` enum('TRIGGER','ACTION','CONDITION','DELAY','EMAIL','SMS','CREATE_INVOICE','ENROLL_COURSE','UPDATE_CRM') NOT NULL,
  `node_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`node_config`)),
  `position_x` decimal(10,2) NOT NULL,
  `position_y` decimal(10,2) NOT NULL,
  `next_node_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_feeds`
--
ALTER TABLE `activity_feeds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `actor_id` (`actor_id`);

--
-- Indexes for table `anomaly_logs`
--
ALTER TABLE `anomaly_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resolved_by` (`resolved_by`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_severity` (`severity`);

--
-- Indexes for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `api_key` (`api_key`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_api_key` (`api_key`),
  ADD KEY `idx_tenant` (`tenant_id`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_job` (`job_id`),
  ADD KEY `idx_status` (`status_id`);

--
-- Indexes for table `application_statuses`
--
ALTER TABLE `application_statuses`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`),
  ADD UNIQUE KEY `status_code` (`status_code`);

--
-- Indexes for table `application_status_history`
--
ALTER TABLE `application_status_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `changed_by` (`changed_by`),
  ADD KEY `idx_application` (`application_id`),
  ADD KEY `idx_changed_at` (`changed_at`);

--
-- Indexes for table `approval_chains`
--
ALTER TABLE `approval_chains`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_step` (`workflow_id`,`step_order`),
  ADD KEY `idx_workflow` (`workflow_id`),
  ADD KEY `idx_approval_chains_name` (`name`);

--
-- Indexes for table `approval_instances`
--
ALTER TABLE `approval_instances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `initiated_by` (`initiated_by`),
  ADD KEY `idx_workflow` (`workflow_id`),
  ADD KEY `idx_entity` (`entity_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course` (`course_id`);

--
-- Indexes for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_submission` (`assignment_id`,`student_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `idx_assignment` (`assignment_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attendance` (`user_id`,`date`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_action_created` (`user_id`,`action`,`created_at`);

--
-- Indexes for table `automation_workflows`
--
ALTER TABLE `automation_workflows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `badges`
--
ALTER TABLE `badges`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `batches`
--
ALTER TABLE `batches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `batch_code` (`batch_code`),
  ADD KEY `idx_course` (`course_id`),
  ADD KEY `idx_tutor` (`tutor_id`),
  ADD KEY `idx_code` (`batch_code`);

--
-- Indexes for table `batch_students`
--
ALTER TABLE `batch_students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_batch_student` (`batch_id`,`student_id`),
  ADD KEY `idx_batch` (`batch_id`),
  ADD KEY `idx_student` (`student_id`);

--
-- Indexes for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_start` (`start_time`),
  ADD KEY `idx_end` (`end_time`),
  ADD KEY `idx_type` (`event_type`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_job` (`job_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_source` (`source`);

--
-- Indexes for table `candidate_documents`
--
ALTER TABLE `candidate_documents`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_application` (`application_id`);

--
-- Indexes for table `career_applications`
--
ALTER TABLE `career_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `cart_sessions`
--
ALTER TABLE `cart_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `idx_session_token` (`session_token`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificate_number` (`certificate_number`),
  ADD KEY `enrollment_id` (`enrollment_id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_course` (`course_id`),
  ADD KEY `idx_certificate_number` (`certificate_number`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `communication_logs`
--
ALTER TABLE `communication_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `template_id` (`template_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_recipient` (`recipient`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_channel` (`channel`),
  ADD KEY `idx_sent_at` (`sent_at`);

--
-- Indexes for table `communication_templates`
--
ALTER TABLE `communication_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_channel` (`channel`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_inquiries`
--
ALTER TABLE `contact_inquiries`
  ADD PRIMARY KEY (`inquiry_id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `idx_is_resolved` (`is_resolved`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `contact_inquiry_attachments`
--
ALTER TABLE `contact_inquiry_attachments`
  ADD PRIMARY KEY (`attachment_id`),
  ADD KEY `idx_inquiry` (`inquiry_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_valid` (`valid_from`,`valid_to`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_tutor` (`tutor_id`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_courses_category` (`category`);

--
-- Indexes for table `course_completions`
--
ALTER TABLE `course_completions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_course_completions_enrollment` (`enrollment_id`),
  ADD KEY `idx_completions_student` (`student_id`),
  ADD KEY `idx_completions_course` (`course_id`);

--
-- Indexes for table `course_modules`
--
ALTER TABLE `course_modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `module_id` (`module_id`),
  ADD KEY `idx_course_order` (`course_id`,`module_order`);

--
-- Indexes for table `customer_handovers`
--
ALTER TABLE `customer_handovers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deal_id` (`deal_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `assigned_person_id` (`assigned_person_id`),
  ADD KEY `handover_by` (`handover_by`),
  ADD KEY `idx_handover_status` (`status`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD UNIQUE KEY `department_name` (`department_name`);

--
-- Indexes for table `device_registrations`
--
ALTER TABLE `device_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_device` (`user_id`,`device_id`),
  ADD KEY `idx_tenant` (`tenant_id`);

--
-- Indexes for table `doubts`
--
ALTER TABLE `doubts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course_status` (`course_id`,`status`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_tutor` (`assigned_tutor_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `employee_code` (`employee_code`),
  ADD KEY `idx_employee_code` (`employee_code`);

--
-- Indexes for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `verified_by` (`verified_by`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_type` (`document_type`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_enrollment` (`student_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `exit_requests`
--
ALTER TABLE `exit_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `feature_flags`
--
ALTER TABLE `feature_flags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `flag_key` (`flag_key`),
  ADD KEY `idx_flag_key` (`flag_key`),
  ADD KEY `idx_flag_tenant` (`tenant_id`);

--
-- Indexes for table `financial_budgets`
--
ALTER TABLE `financial_budgets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_budget_dept` (`fiscal_year`,`quarter`,`department`,`category`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_fiscal_dept` (`fiscal_year`,`department`);

--
-- Indexes for table `financial_refunds`
--
ALTER TABLE `financial_refunds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `processed_by` (`processed_by`),
  ADD KEY `idx_refund_status` (`status`),
  ADD KEY `idx_invoice` (`invoice_id`);

--
-- Indexes for table `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `idx_course` (`course_id`),
  ADD KEY `idx_pinned` (`is_pinned`),
  ADD KEY `idx_forum_category` (`category`);

--
-- Indexes for table `forum_post_votes`
--
ALTER TABLE `forum_post_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_post_user` (`post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `forum_replies`
--
ALTER TABLE `forum_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `idx_post` (`post_id`),
  ADD KEY `idx_best` (`is_best_answer`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_holiday_date` (`date`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `integrations`
--
ALTER TABLE `integrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_name` (`service_name`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_enabled` (`is_enabled`);

--
-- Indexes for table `interns`
--
ALTER TABLE `interns`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_mentor` (`mentor_id`);

--
-- Indexes for table `interviews`
--
ALTER TABLE `interviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `interviewer_id` (`interviewer_id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_round` (`round`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_scheduled` (`scheduled_at`);

--
-- Indexes for table `interview_schedules`
--
ALTER TABLE `interview_schedules`
  ADD PRIMARY KEY (`interview_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_application` (`application_id`),
  ADD KEY `idx_scheduled` (`scheduled_date`,`scheduled_time`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_due_date` (`due_date`),
  ADD KEY `idx_invoice_number` (`invoice_number`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_title` (`title`);

--
-- Indexes for table `job_board_posts`
--
ALTER TABLE `job_board_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_job_platform` (`job_id`,`platform`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_job` (`job_id`),
  ADD KEY `idx_platform` (`platform`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `job_categories`
--
ALTER TABLE `job_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `job_types`
--
ALTER TABLE `job_types`
  ADD PRIMARY KEY (`job_type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_leads_company` (`company_name`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_dates` (`start_date`,`end_date`);

--
-- Indexes for table `leave_balances`
--
ALTER TABLE `leave_balances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_year_type` (`user_id`,`financial_year`,`leave_type`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_fin_year` (`financial_year`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_module_order` (`module_id`,`lesson_order`),
  ADD KEY `idx_lessons_technology_module` (`technology_module_id`);

--
-- Indexes for table `lesson_blocks`
--
ALTER TABLE `lesson_blocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_lesson_block_order` (`lesson_id`,`block_order`);

--
-- Indexes for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_lesson` (`student_id`,`lesson_id`),
  ADD KEY `lesson_id` (`lesson_id`),
  ADD KEY `idx_lesson_progress_enrollment` (`enrollment_id`),
  ADD KEY `idx_lesson_progress_student` (`student_id`);

--
-- Indexes for table `live_quiz_sessions`
--
ALTER TABLE `live_quiz_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `tutor_id` (`tutor_id`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipient_id` (`recipient_id`),
  ADD KEY `idx_chat_convo` (`sender_id`,`recipient_id`,`created_at`),
  ADD KEY `idx_channel` (`channel_name`,`created_at`);

--
-- Indexes for table `mfa_secrets`
--
ALTER TABLE `mfa_secrets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_mfa` (`user_id`);

--
-- Indexes for table `mindmap_nodes`
--
ALTER TABLE `mindmap_nodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_project` (`project_id`),
  ADD KEY `idx_parent` (`parent_id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course_order` (`course_id`,`module_order`);

--
-- Indexes for table `module_topics`
--
ALTER TABLE `module_topics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_module_order` (`module_id`,`topic_order`);

--
-- Indexes for table `oauth_states`
--
ALTER TABLE `oauth_states`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `state` (`state`),
  ADD KEY `idx_state` (`state`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `offboarding_checklists`
--
ALTER TABLE `offboarding_checklists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cleared_by` (`cleared_by`),
  ADD KEY `idx_exit_request` (`exit_request_id`),
  ADD KEY `idx_cleared` (`is_cleared`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_placed_at` (`placed_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `idx_order` (`order_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_invoice` (`invoice_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_payroll` (`employee_id`,`month_year`),
  ADD KEY `processed_by` (`processed_by`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_month` (`month_year`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_reviewer` (`reviewer_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_perm_module` (`module`),
  ADD KEY `idx_perm_code` (`code`);

--
-- Indexes for table `prediction_logs`
--
ALTER TABLE `prediction_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_type` (`prediction_type`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_tenant_course` (`tenant_id`,`course_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `idx_published` (`is_published`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`);

--
-- Indexes for table `program_modules`
--
ALTER TABLE `program_modules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `module_id` (`module_id`),
  ADD KEY `idx_program_order` (`program_id`,`module_order`);

--
-- Indexes for table `project_expenses`
--
ALTER TABLE `project_expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `logged_by` (`logged_by`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `idx_proj_expense` (`project_id`,`status`),
  ADD KEY `idx_expense_date` (`expense_date`);

--
-- Indexes for table `project_files`
--
ALTER TABLE `project_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `idx_project_cat` (`project_id`,`category`);

--
-- Indexes for table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_project_user` (`project_id`,`user_id`),
  ADD KEY `idx_user_projects` (`user_id`);

--
-- Indexes for table `project_milestones`
--
ALTER TABLE `project_milestones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_project_status` (`project_id`,`status`),
  ADD KEY `idx_target_date` (`target_date`);

--
-- Indexes for table `project_sprints`
--
ALTER TABLE `project_sprints`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_proj_sprint` (`project_id`,`sprint_number`),
  ADD KEY `idx_proj_sprint_status` (`project_id`,`status`);

--
-- Indexes for table `provider_configs`
--
ALTER TABLE `provider_configs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_provider_key` (`provider`,`config_key`),
  ADD KEY `idx_provider` (`provider`),
  ADD KEY `idx_enabled` (`is_enabled`);

--
-- Indexes for table `push_notifications`
--
ALTER TABLE `push_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pn_user` (`user_id`),
  ADD KEY `idx_pn_user_unread` (`user_id`,`is_read`),
  ADD KEY `idx_pn_created` (`created_at`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course` (`course_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `idx_quiz_student` (`quiz_id`,`student_id`),
  ADD KEY `idx_live_session` (`live_session_id`);

--
-- Indexes for table `reception_appointments`
--
ALTER TABLE `reception_appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_appt_date` (`appointment_date`),
  ADD KEY `idx_appt_status` (`status`),
  ADD KEY `idx_appt_host` (`person_to_meet`);

--
-- Indexes for table `reception_receipts`
--
ALTER TABLE `reception_receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipt_number` (`receipt_number`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `issued_by` (`issued_by`),
  ADD KEY `idx_receipt_num` (`receipt_number`),
  ADD KEY `idx_receipt_issued` (`issued_at`);

--
-- Indexes for table `recurring_schedules`
--
ALTER TABLE `recurring_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `idx_next_date` (`next_generation_date`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `report_definitions`
--
ALTER TABLE `report_definitions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_tenant` (`tenant_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_roles_rank` (`security_rank`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `fk_rp_perm` (`permission_id`);

--
-- Indexes for table `salary_structures`
--
ALTER TABLE `salary_structures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employee` (`employee_id`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `sales_activities`
--
ALTER TABLE `sales_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lead_id` (`lead_id`),
  ADD KEY `idx_act_user` (`performed_by`,`scheduled_at`),
  ADD KEY `idx_act_deal` (`deal_id`);

--
-- Indexes for table `sales_deals`
--
ALTER TABLE `sales_deals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `lead_id` (`lead_id`),
  ADD KEY `idx_deal_stage` (`stage`),
  ADD KEY `idx_deal_owner` (`owner_id`),
  ADD KEY `idx_close_date` (`expected_close_date`);

--
-- Indexes for table `sales_proposals`
--
ALTER TABLE `sales_proposals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `proposal_number` (`proposal_number`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_prop_status` (`status`),
  ADD KEY `idx_prop_deal` (`deal_id`);

--
-- Indexes for table `sales_targets`
--
ALTER TABLE `sales_targets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rep_target` (`user_id`,`fiscal_year`,`period_label`),
  ADD KEY `idx_target_user` (`user_id`);

--
-- Indexes for table `scheduled_reports`
--
ALTER TABLE `scheduled_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_definition_id` (`report_definition_id`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_next_send` (`next_send_at`);

--
-- Indexes for table `security_threat_logs`
--
ALTER TABLE `security_threat_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_threat_created` (`created_at`),
  ADD KEY `idx_threat_ip` (`source_ip`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_token_portal` (`token`,`portal_slug`),
  ADD KEY `idx_user_portal` (`user_id`,`portal_slug`);

--
-- Indexes for table `student_projects`
--
ALTER TABLE `student_projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_repo` (`student_id`,`github_repo_url`(255)),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_repo` (`github_repo_url`(255)),
  ADD KEY `idx_projects_manager` (`manager_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_client` (`client_id`),
  ADD KEY `idx_renewal` (`renewal_date`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_number` (`ticket_number`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `idx_user_status` (`user_id`,`status`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `system_configs`
--
ALTER TABLE `system_configs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `config_key` (`config_key`);

--
-- Indexes for table `system_error_logs`
--
ALTER TABLE `system_error_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `resolved_by` (`resolved_by`),
  ADD KEY `idx_service` (`service_name`),
  ADD KEY `idx_error_type` (`error_type`),
  ADD KEY `idx_resolved` (`is_resolved`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `idx_subscription` (`subscription_id`),
  ADD KEY `idx_due_date` (`due_date`);

--
-- Indexes for table `tax_filings`
--
ALTER TABLE `tax_filings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_return_period` (`return_type`,`filing_period`),
  ADD KEY `idx_tax_status` (`status`);

--
-- Indexes for table `technology_modules`
--
ALTER TABLE `technology_modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_category_level` (`category`,`level`);

--
-- Indexes for table `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subdomain` (`subdomain`),
  ADD KEY `idx_subdomain` (`subdomain`),
  ADD KEY `idx_custom_domain` (`custom_domain`);

--
-- Indexes for table `tenant_users`
--
ALTER TABLE `tenant_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_tenant_user` (`user_id`,`tenant_id`),
  ADD KEY `idx_tenant` (`tenant_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `timesheets`
--
ALTER TABLE `timesheets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_user_date` (`user_id`,`work_date`),
  ADD KEY `idx_project` (`project_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_badges`
--
ALTER TABLE `user_badges`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_badge` (`user_id`,`badge_id`),
  ADD KEY `badge_id` (`badge_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `user_credentials`
--
ALTER TABLE `user_credentials`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `visitor_logs`
--
ALTER TABLE `visitor_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_to_meet` (`person_to_meet`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_check_in` (`check_in_time`);

--
-- Indexes for table `webhook_subscriptions`
--
ALTER TABLE `webhook_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_tenant` (`tenant_id`);

--
-- Indexes for table `workflows`
--
ALTER TABLE `workflows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `idx_entity_type` (`entity_type`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `workflow_executions`
--
ALTER TABLE `workflow_executions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `current_node_id` (`current_node_id`),
  ADD KEY `triggered_by` (`triggered_by`),
  ADD KEY `idx_workflow` (`workflow_id`),
  ADD KEY `idx_entity` (`entity_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `workflow_nodes`
--
ALTER TABLE `workflow_nodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `next_node_id` (`next_node_id`),
  ADD KEY `idx_workflow` (`workflow_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anomaly_logs`
--
ALTER TABLE `anomaly_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `application_statuses`
--
ALTER TABLE `application_statuses`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `application_status_history`
--
ALTER TABLE `application_status_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `career_applications`
--
ALTER TABLE `career_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `job_categories`
--
ALTER TABLE `job_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `job_types`
--
ALTER TABLE `job_types`
  MODIFY `job_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `push_notifications`
--
ALTER TABLE `push_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_configs`
--
ALTER TABLE `system_configs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `system_error_logs`
--
ALTER TABLE `system_error_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

--
-- Structure for view `vw_active_job_postings`
--
DROP TABLE IF EXISTS `vw_active_job_postings`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u629721489_ethiroli_pvt`@`127.0.0.1` SQL SECURITY DEFINER VIEW `vw_active_job_postings`  AS SELECT `j`.`id` AS `id`, `j`.`title` AS `title`, `j`.`description` AS `description`, `j`.`location` AS `location`, `j`.`salary_range` AS `salary_range`, `j`.`status` AS `status`, `j`.`posted_at` AS `posted_at`, `j`.`created_at` AS `created_at`, `j`.`department` AS `department`, `d`.`department_name` AS `department_name`, `j`.`required_skills` AS `required_skills` FROM (`jobs` `j` left join `departments` `d` on(`j`.`department` = `d`.`department_name`)) WHERE `j`.`status` in ('OPEN','DRAFT') ;

-- --------------------------------------------------------

--
-- Structure for view `vw_application_tracking`
--
DROP TABLE IF EXISTS `vw_application_tracking`;

CREATE ALGORITHM=UNDEFINED DEFINER=`u629721489_ethiroli_pvt`@`127.0.0.1` SQL SECURITY DEFINER VIEW `vw_application_tracking`  AS SELECT `a`.`id` AS `application_id`, `a`.`applied_at` AS `applied_at`, `a`.`cover_letter` AS `cover_letter`, `j`.`id` AS `job_id`, `j`.`title` AS `job_title`, `j`.`department` AS `job_department`, `c`.`id` AS `candidate_id`, `c`.`name` AS `candidate_name`, `c`.`email` AS `candidate_email`, `c`.`phone` AS `candidate_phone`, `s`.`status_id` AS `status_id`, `s`.`status_name` AS `status_name`, `s`.`display_order` AS `display_order` FROM (((`applications` `a` join `jobs` `j` on(`a`.`job_id` = `j`.`id`)) join `candidates` `c` on(`a`.`candidate_id` = `c`.`id`)) left join `application_statuses` `s` on(`a`.`status_id` = `s`.`status_id`)) ORDER BY `a`.`applied_at` DESC ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_feeds`
--
ALTER TABLE `activity_feeds`
  ADD CONSTRAINT `activity_feeds_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_feeds_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `anomaly_logs`
--
ALTER TABLE `anomaly_logs`
  ADD CONSTRAINT `anomaly_logs_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `anomaly_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `anomaly_logs_ibfk_3` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `api_keys`
--
ALTER TABLE `api_keys`
  ADD CONSTRAINT `api_keys_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `api_keys_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `application_statuses` (`status_id`) ON DELETE SET NULL;

--
-- Constraints for table `application_status_history`
--
ALTER TABLE `application_status_history`
  ADD CONSTRAINT `application_status_history_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `application_status_history_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `application_statuses` (`status_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `application_status_history_ibfk_3` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `approval_chains`
--
ALTER TABLE `approval_chains`
  ADD CONSTRAINT `approval_chains_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `approval_instances`
--
ALTER TABLE `approval_instances`
  ADD CONSTRAINT `approval_instances_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `approval_instances_ibfk_2` FOREIGN KEY (`initiated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD CONSTRAINT `assignment_submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignment_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `automation_workflows`
--
ALTER TABLE `automation_workflows`
  ADD CONSTRAINT `automation_workflows_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `automation_workflows_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `batches`
--
ALTER TABLE `batches`
  ADD CONSTRAINT `batches_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `batches_ibfk_2` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `batch_students`
--
ALTER TABLE `batch_students`
  ADD CONSTRAINT `batch_students_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `batch_students_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_documents`
--
ALTER TABLE `candidate_documents`
  ADD CONSTRAINT `candidate_documents_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidate_documents_ibfk_2` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_sessions`
--
ALTER TABLE `cart_sessions`
  ADD CONSTRAINT `cart_sessions_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_sessions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `certificates_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `certificates_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `communication_logs`
--
ALTER TABLE `communication_logs`
  ADD CONSTRAINT `communication_logs_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `communication_templates` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `communication_logs_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contact_inquiry_attachments`
--
ALTER TABLE `contact_inquiry_attachments`
  ADD CONSTRAINT `contact_inquiry_attachments_ibfk_1` FOREIGN KEY (`inquiry_id`) REFERENCES `contact_inquiries` (`inquiry_id`) ON DELETE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `coupons_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `course_modules`
--
ALTER TABLE `course_modules`
  ADD CONSTRAINT `course_modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_modules_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `technology_modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_handovers`
--
ALTER TABLE `customer_handovers`
  ADD CONSTRAINT `customer_handovers_ibfk_1` FOREIGN KEY (`deal_id`) REFERENCES `sales_deals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_handovers_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_handovers_ibfk_3` FOREIGN KEY (`assigned_person_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customer_handovers_ibfk_4` FOREIGN KEY (`handover_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `device_registrations`
--
ALTER TABLE `device_registrations`
  ADD CONSTRAINT `device_registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `device_registrations_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doubts`
--
ALTER TABLE `doubts`
  ADD CONSTRAINT `doubts_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doubts_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doubts_ibfk_3` FOREIGN KEY (`assigned_tutor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD CONSTRAINT `employee_documents_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_documents_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_documents_ibfk_3` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `exit_requests`
--
ALTER TABLE `exit_requests`
  ADD CONSTRAINT `exit_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exit_requests_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `financial_budgets`
--
ALTER TABLE `financial_budgets`
  ADD CONSTRAINT `financial_budgets_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `financial_refunds`
--
ALTER TABLE `financial_refunds`
  ADD CONSTRAINT `financial_refunds_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_refunds_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_refunds_ibfk_3` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD CONSTRAINT `forum_posts_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_posts_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `forum_post_votes`
--
ALTER TABLE `forum_post_votes`
  ADD CONSTRAINT `forum_post_votes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_post_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `forum_replies`
--
ALTER TABLE `forum_replies`
  ADD CONSTRAINT `forum_replies_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `forum_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_replies_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `interns`
--
ALTER TABLE `interns`
  ADD CONSTRAINT `interns_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `interns_ibfk_2` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `interviews`
--
ALTER TABLE `interviews`
  ADD CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `interviews_ibfk_2` FOREIGN KEY (`interviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `interview_schedules`
--
ALTER TABLE `interview_schedules`
  ADD CONSTRAINT `interview_schedules_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `interview_schedules_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_board_posts`
--
ALTER TABLE `job_board_posts`
  ADD CONSTRAINT `job_board_posts_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_board_posts_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `leaves`
--
ALTER TABLE `leaves`
  ADD CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leaves_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `leave_balances`
--
ALTER TABLE `leave_balances`
  ADD CONSTRAINT `leave_balances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lesson_blocks`
--
ALTER TABLE `lesson_blocks`
  ADD CONSTRAINT `lesson_blocks_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `lesson_progress_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_progress_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_progress_ibfk_3` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `live_quiz_sessions`
--
ALTER TABLE `live_quiz_sessions`
  ADD CONSTRAINT `live_quiz_sessions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `live_quiz_sessions_ibfk_2` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mfa_secrets`
--
ALTER TABLE `mfa_secrets`
  ADD CONSTRAINT `mfa_secrets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mindmap_nodes`
--
ALTER TABLE `mindmap_nodes`
  ADD CONSTRAINT `mindmap_nodes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mindmap_nodes_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `student_projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mindmap_nodes_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `mindmap_nodes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `module_topics`
--
ALTER TABLE `module_topics`
  ADD CONSTRAINT `module_topics_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `technology_modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `offboarding_checklists`
--
ALTER TABLE `offboarding_checklists`
  ADD CONSTRAINT `offboarding_checklists_ibfk_1` FOREIGN KEY (`exit_request_id`) REFERENCES `exit_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offboarding_checklists_ibfk_2` FOREIGN KEY (`cleared_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payroll_ibfk_2` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD CONSTRAINT `performance_reviews_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prediction_logs`
--
ALTER TABLE `prediction_logs`
  ADD CONSTRAINT `prediction_logs_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `program_modules`
--
ALTER TABLE `program_modules`
  ADD CONSTRAINT `program_modules_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `program_modules_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `technology_modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_expenses`
--
ALTER TABLE `project_expenses`
  ADD CONSTRAINT `project_expenses_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `student_projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_expenses_ibfk_2` FOREIGN KEY (`logged_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_expenses_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `project_expenses_ibfk_4` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `project_files`
--
ALTER TABLE `project_files`
  ADD CONSTRAINT `project_files_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `student_projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_files_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_members`
--
ALTER TABLE `project_members`
  ADD CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_milestones`
--
ALTER TABLE `project_milestones`
  ADD CONSTRAINT `project_milestones_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `student_projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_sprints`
--
ALTER TABLE `project_sprints`
  ADD CONSTRAINT `project_sprints_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `student_projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reception_appointments`
--
ALTER TABLE `reception_appointments`
  ADD CONSTRAINT `reception_appointments_ibfk_1` FOREIGN KEY (`person_to_meet`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reception_receipts`
--
ALTER TABLE `reception_receipts`
  ADD CONSTRAINT `reception_receipts_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reception_receipts_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reception_receipts_ibfk_3` FOREIGN KEY (`issued_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recurring_schedules`
--
ALTER TABLE `recurring_schedules`
  ADD CONSTRAINT `recurring_schedules_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `recurring_schedules_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `report_definitions`
--
ALTER TABLE `report_definitions`
  ADD CONSTRAINT `report_definitions_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `report_definitions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salary_structures`
--
ALTER TABLE `salary_structures`
  ADD CONSTRAINT `salary_structures_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_activities`
--
ALTER TABLE `sales_activities`
  ADD CONSTRAINT `sales_activities_ibfk_1` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_activities_ibfk_2` FOREIGN KEY (`deal_id`) REFERENCES `sales_deals` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_activities_ibfk_3` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_deals`
--
ALTER TABLE `sales_deals`
  ADD CONSTRAINT `sales_deals_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_deals_ibfk_2` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_deals_ibfk_3` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_proposals`
--
ALTER TABLE `sales_proposals`
  ADD CONSTRAINT `sales_proposals_ibfk_1` FOREIGN KEY (`deal_id`) REFERENCES `sales_deals` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_proposals_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sales_proposals_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_targets`
--
ALTER TABLE `sales_targets`
  ADD CONSTRAINT `sales_targets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `scheduled_reports`
--
ALTER TABLE `scheduled_reports`
  ADD CONSTRAINT `scheduled_reports_ibfk_1` FOREIGN KEY (`report_definition_id`) REFERENCES `report_definitions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `scheduled_reports_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_projects`
--
ALTER TABLE `student_projects`
  ADD CONSTRAINT `student_projects_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `support_tickets_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `system_error_logs`
--
ALTER TABLE `system_error_logs`
  ADD CONSTRAINT `system_error_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `system_error_logs_ibfk_2` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tax_filings`
--
ALTER TABLE `tax_filings`
  ADD CONSTRAINT `tax_filings_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_users`
--
ALTER TABLE `tenant_users`
  ADD CONSTRAINT `tenant_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tenant_users_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `timesheets`
--
ALTER TABLE `timesheets`
  ADD CONSTRAINT `timesheets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `timesheets_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `student_projects` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `timesheets_ibfk_3` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `timesheets_ibfk_4` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_badges`
--
ALTER TABLE `user_badges`
  ADD CONSTRAINT `user_badges_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_badges_ibfk_2` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_credentials`
--
ALTER TABLE `user_credentials`
  ADD CONSTRAINT `fk_uc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `visitor_logs`
--
ALTER TABLE `visitor_logs`
  ADD CONSTRAINT `visitor_logs_ibfk_1` FOREIGN KEY (`person_to_meet`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `webhook_subscriptions`
--
ALTER TABLE `webhook_subscriptions`
  ADD CONSTRAINT `webhook_subscriptions_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `webhook_subscriptions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `workflow_executions`
--
ALTER TABLE `workflow_executions`
  ADD CONSTRAINT `workflow_executions_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `automation_workflows` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `workflow_executions_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `workflow_executions_ibfk_3` FOREIGN KEY (`current_node_id`) REFERENCES `workflow_nodes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `workflow_executions_ibfk_4` FOREIGN KEY (`triggered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `workflow_nodes`
--
ALTER TABLE `workflow_nodes`
  ADD CONSTRAINT `workflow_nodes_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `automation_workflows` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `workflow_nodes_ibfk_2` FOREIGN KEY (`next_node_id`) REFERENCES `workflow_nodes` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
