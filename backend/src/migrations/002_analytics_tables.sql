-- ============================================================
-- 002_analytics_tables.sql
-- ClickHouse analytics schema for Ethiroli LMS
-- ============================================================

-- 1. Raw telemetry events table (Avro‑compatible)
CREATE TABLE IF NOT EXISTS lms_telemetry_raw (
    event_id          String CODEC(ZSTD) COMMENT 'Unique event identifier',
    event_type        String CODEC(ZSTD) COMMENT 'Type of event (e.g., lesson_view, quiz_submission)',
    user_id           LowCardinality(String) CODEC(ZSTD) COMMENT 'User identifier',
    course_id         LowCardinality(String) CODEC(ZSTD) COMMENT 'Course identifier (nullable)',
    lesson_id         LowCardinality(String) CODEC(ZSTD) COMMENT 'Lesson identifier (nullable)',
    session_id        String CODEC(ZSTD) COMMENT 'Session identifier',
    timestamp         DateTime64(3) CODEC(ZSTD) COMMENT 'Event timestamp (UTC)',
    source            LowCardinality(String) CODEC(ZSTD) COMMENT 'Source system or service',
    page_url          String CODEC(ZSTD) COMMENT 'URL or page where event occurred',
    event_payload     JSON CODEC(ZSTD) COMMENT 'Additional event data (Avro‑compatible fields)',
    ip_address        IPv4 CODEC(ZSTD) COMMENT 'Client IP address',
    user_agent        String CODEC(ZSTD) COMMENT 'Browser/device user‑agent',
    duration_seconds  Int32 CODEC(ZSTD) DEFAULT 0 COMMENT 'Event duration in seconds'
)
ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (event_type, user_id, timestamp)
TTL toDateTime(timestamp) + INTERVAL 90 DAY
DELETE WHERE toDate(timestamp) < today() - 180;

-- 2. Materialized view – user engagement daily aggregate
CREATE MATERIALIZED VIEW IF NOT EXISTS user_engagement_daily
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, toDate(timestamp), event_type)
TTL toDateTime(timestamp) + INTERVAL 365 DAY
AS SELECT
    user_id,
    toDate(timestamp)               AS event_date,
    event_type,
    count()                         AS event_count,
    sumIf(duration_seconds, duration_seconds > 0) AS total_duration_sec,
    uniqHamming(user_id)           AS unique_users
FROM lms_telemetry_raw
GROUP BY user_id, toDate(timestamp), event_type;

-- 3. Materialized view – user engagement weekly aggregate
CREATE MATERIALIZED VIEW IF NOT EXISTS user_engagement_weekly
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, floor(toUnixTimestamp(timestamp) / 604800) * 604800, event_type)
TTL toDateTime(timestamp) + INTERVAL 365 DAY
AS SELECT
    user_id,
    floor(toUnixTimestamp(timestamp) / 604800) * 604800 AS event_date,
    event_type,
    count()                         AS event_count,
    sumIf(duration_seconds, duration_seconds > 0) AS total_duration_sec,
    uniqHamming(user_id)           AS unique_users
FROM lms_telemetry_raw
GROUP BY user_id, floor(toUnixTimestamp(timestamp) / 604800) * 604800, event_type;

-- 4. Materialized view – user engagement monthly aggregate
CREATE MATERIALIZED VIEW IF NOT EXISTS user_engagement_monthly
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, toYYYYMM(timestamp), event_type)
TTL toDateTime(timestamp) + INTERVAL 365 DAY
AS SELECT
    user_id,
    toYYYYMM(timestamp)           AS event_date,
    event_type,
    count()                         AS event_count,
    sumIf(duration_seconds, duration_seconds > 0) AS total_duration_sec,
    uniqHamming(user_id)           AS unique_users
FROM lms_telemetry_raw
GROUP BY user_id, toYYYYMM(timestamp), event_type;

-- 5. Course completions table with certificate info
CREATE TABLE IF NOT EXISTS course_completions (
    enrollment_id     String CODEC(ZSTD) PRIMARY KEY,
    student_id        LowCardinality(String) CODEC(ZSTD) COMMENT 'User who completed',
    course_id         LowCardinality(String) CODEC(ZSTD) COMMENT 'Completed course',
    completed_at      DateTime64(3) CODEC(ZSTD) COMMENT 'Timestamp of completion',
    certificate_number String CODEC(ZSTD) COMMENT 'Unique certificate identifier',
    issue_date        Date CODEC(ZSTD) COMMENT 'Date certificate was issued',
    expiry_date       Date CODEC(ZSTD) DEFAULT NULL COMMENT 'Certificate expiry (if any)',
    pdf_url           String CODEC(ZSTD) COMMENT 'URL to PDF certificate',
    qr_code_url       String CODEC(ZSTD) DEFAULT NULL COMMENT 'URL to QR code',
    status            Enum('PENDING','ISSUED','EXPIRED') CODEC(ZSTD) DEFAULT 'PENDING'
)
ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(issue_date)
ORDER BY (student_id, course_id, issue_date)
TTL toDate(issue_date) + INTERVAL 365 DAY;

-- 6. Assessment scores and analytics table
CREATE TABLE IF NOT EXISTS assessment_analytics (
    assessment_id     String CODEC(ZSTD) PRIMARY KEY,
    course_id         LowCardinality(String) CODEC(ZSTD) COMMENT 'Course the assessment belongs to',
    student_id        LowCardinality(String) CODEC(ZSTD) COMMENT 'Test taker',
    assessment_type   Enum('QUIZ','ASSIGNMENT','PEER_REVIEW') CODEC(ZSTD) NOT NULL,
    score             Int8 CODEC(ZSTD) COMMENT 'Points scored (0‑100)',
    total_score       Int8 CODEC(ZSTD) COMMENT 'Maximum possible points',
    time_taken_seconds Int32 CODEC(ZSTD) COMMENT 'Duration in seconds',
    attempted_at      DateTime64(3) CODEC(ZSTD) COMMENT 'Timestamp of attempt',
    completed_at      DateTime64(3) DEFAULT NULL COMMENT 'Timestamp of completion',
    feedback_quality  Float32 CODEC(ZSTD) DEFAULT NULL COMMENT 'Normalized feedback score (0‑1)',
    status            Enum('IN_PROGRESS','COMPLETED','ABANDONED') CODEC(ZSTD) DEFAULT 'IN_PROGRESS'
)
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(attempted_at)
ORDER BY (course_id, student_id, assessment_type, attempted_at)
TTL toDateTime(attempted_at) + INTERVAL 730 DAY
SETTINGS index_granularity = 8192;

-- End of migration 002_analytics_tables.sql
