import { Kafka } from 'kafkajs';
import pool from '../config/database.js';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';
import { broadcastToUser } from './socketService.js';
import { AppError } from '../utils/errors.js';

const COMPLETION_CHECK_LUA = '\nlocal progressKey = KEYS[1]\nlocal requiredKey = KEYS[2]\nlocal completedCount = tonumber(redis.call(\'HGET\', progressKey, \'completed_count\') or \'0\')\nlocal requiredCount = tonumber(redis.call(\'GET\', requiredKey) or \'0\')\nif completedCount >= requiredCount then\n  return 1\nelse\n  return 0\nend\n';

// Set KAFKA_ENABLED=false in env vars to disable Kafka (matches telemetryService)
const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== 'false' &&
  (process.env.KAFKA_BROKERS || '').trim().length > 0;

const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',').map(function(b) { return b.trim(); });
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'ethiroli-backend';
const COMPLETION_TOPIC = process.env.KAFKA_COMPLETION_TOPIC || 'lms.completions';
const COMPLETION_DLQ_TOPIC = process.env.KAFKA_COMPLETION_DLQ_TOPIC || 'lms.completions.dlq';
const KAFKA_RETRIES = Number(process.env.KAFKA_RETRIES || 5);
const KAFKA_RETRY_BASE_MS = Number(process.env.KAFKA_RETRY_BASE_MS || 100);
const KAFKA_RETRY_MAX_MS = Number(process.env.KAFKA_RETRY_MAX_MS || 10000);
const KAFKA_REQUEST_TIMEOUT_MS = Number(process.env.KAFKA_REQUEST_TIMEOUT_MS || 30000);
const KAFKA_CONNECTION_TIMEOUT_MS = Number(process.env.KAFKA_CONNECTION_TIMEOUT_MS || 10000);
const KAFKA_RECONNECT_BASE_MS = Number(process.env.KAFKA_RECONNECT_BASE_MS || 200);
const KAFKA_RECONNECT_MAX_MS = Number(process.env.KAFKA_RECONNECT_MAX_MS || 30000);

let completionProducer = null;
let completionKafka = null;
let isShuttingDown = false;

function createCompletionKafkaClient() {
  return new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS,
    retry: {
      retries: KAFKA_RETRIES,
      initialRetryTime: KAFKA_RECONNECT_BASE_MS,
      maxRetryTime: KAFKA_RECONNECT_MAX_MS,
      factor: 2
    },
    connectionTimeout: KAFKA_CONNECTION_TIMEOUT_MS,
    requestTimeout: KAFKA_REQUEST_TIMEOUT_MS
  });
}

function getCompletionProducer() {
  if (!KAFKA_ENABLED) return null;
  if (!completionKafka) {
    completionKafka = createCompletionKafkaClient();
  }
  if (!completionProducer) {
    completionProducer = completionKafka.producer({
      retry: {
        retries: KAFKA_RETRIES,
        initialRetryTime: KAFKA_RECONNECT_BASE_MS,
        maxRetryTime: KAFKA_RECONNECT_MAX_MS,
        factor: 2
      },
      maxInFlightRequests: 5,
      idempotent: true,
      transactionalId: KAFKA_CLIENT_ID + '-completion-tx'
    });
    completionProducer.on('producer.disconnect', function() { logger.warn('Completion Kafka producer disconnected'); });
    completionProducer.on('producer.connect', function() { logger.info('Completion Kafka producer connected', { brokers: KAFKA_BROKERS }); });
    completionProducer.on('producer.error', function(err) { logger.error('Completion Kafka producer error', { error: err.message }); });
  }
  return completionProducer;
}

function exponentialBackoffDelay(attempt) {
  var delay = Math.min(KAFKA_RETRY_BASE_MS * Math.pow(2, attempt), KAFKA_RETRY_MAX_MS);
  var jitter = Math.random() * delay * 0.1;
  return delay + jitter;
}

async function publishCompletionEvent(payload) {
  if (!KAFKA_ENABLED) {
    logger.debug('Kafka disabled — completion event dropped (no-op)', { eventId: payload.eventId });
    return { success: false, reason: 'kafka_disabled' };
  }
  var prod = getCompletionProducer();
  var lastError;
  var serialized = JSON.stringify(payload);
  for (var attempt = 0; attempt <= KAFKA_RETRIES; attempt++) {
    if (isShuttingDown) {
      throw new Error('Service is shutting down');
    }
    try {
      await prod.send({
        topic: COMPLETION_TOPIC,
        messages: [{
          key: payload.eventId,
          value: serialized,
          headers: {
            'content-type': 'application/json',
            'event-type': payload.eventType,
            'source': payload.source,
            'timestamp': payload.timestamp
          }
        }]
      });
      logger.info('Completion event published', { eventId: payload.eventId, topic: COMPLETION_TOPIC, attempt });
      return { success: true };
    } catch (err) {
      lastError = err;
      logger.warn('Completion publish attempt failed', { eventId: payload.eventId, attempt, error: err.message });
      if (attempt < KAFKA_RETRIES) {
        var delay = exponentialBackoffDelay(attempt);
        await new Promise(function(resolve) { setTimeout(resolve, delay); });
      }
    }
  }
  logger.error('Completion publish failed after retries', { eventId: payload.eventId, error: lastError.message });
  throw new Error('Failed to publish completion after ' + (KAFKA_RETRIES + 1) + ' attempts: ' + lastError.message);
}

async function publishToDlq(payload, error) {
  if (!KAFKA_ENABLED) return; // no-op when Kafka is disabled
  try {
    var prod = getCompletionProducer();
    await prod.send({
      topic: COMPLETION_DLQ_TOPIC,
      messages: [{
        key: payload.eventId,
        value: JSON.stringify(Object.assign({}, payload, { error: error.message, failedAt: new Date().toISOString() })),
        headers: {
          'content-type': 'application/json',
          'event-type': 'completion_failed',
          'source': payload.source
        }
      }]
    });
    logger.info('Completion event sent to DLQ', { eventId: payload.eventId, topic: COMPLETION_DLQ_TOPIC });
  } catch (dlqErr) {
    logger.error('Failed to publish to DLQ', { eventId: payload.eventId, error: dlqErr.message });
  }
}

export async function checkEligibility(userId, courseId) {
  var redis = getRedisClient();
  if (!redis) {
    // Redis unavailable — default to eligible so course completion isn't blocked
    logger.warn('Redis unavailable in checkEligibility — defaulting to eligible', { userId, courseId });
    return true;
  }
  var progressKey = 'user:' + userId + ':progress';
  var requiredKey = 'course:' + courseId + ':required_modules';
  var result = await redis.eval(COMPLETION_CHECK_LUA, 2, progressKey, requiredKey);
  return result === 1;
}

export async function updateProgress(userId, moduleId, completed) {
  if (completed === undefined) completed = true;
  var redis = getRedisClient();
  if (!redis) {
    logger.warn('Redis unavailable in updateProgress — skipping cache update', { userId, moduleId });
    return 0;
  }
  var progressKey = 'user:' + userId + ':progress';
  var modulesSetKey = 'user:' + userId + ':completed_modules';
  if (completed) {
    var added = await redis.sadd(modulesSetKey, moduleId);
    if (added) {
      await redis.hincrby(progressKey, 'completed_count', 1);
    }
  } else {
    var removed = await redis.srem(modulesSetKey, moduleId);
    if (removed) {
      await redis.hincrby(progressKey, 'completed_count', -1);
    }
  }
  var count = await redis.hget(progressKey, 'completed_count');
  return Number(count || 0);
}

export async function getProgress(userId) {
  var redis = getRedisClient();
  if (!redis) {
    logger.warn('Redis unavailable in getProgress — returning empty progress', { userId });
    return { completedCount: 0, completedModules: [] };
  }
  var progressKey = 'user:' + userId + ':progress';
  var modulesSetKey = 'user:' + userId + ':completed_modules';
  var completedCount = await redis.hget(progressKey, 'completed_count');
  var modules = await redis.smembers(modulesSetKey);
  return {
    completedCount: Number(completedCount || 0),
    completedModules: modules
  };
}

async function acquireIdempotencyKey(eventId) {
  var redis = getRedisClient();
  var key = 'idempotency:' + eventId;
  var result = await redis.set(key, '1', 'EX', 86400, 'NX');
  return result === 'OK';
}

async function getCachedResult(eventId) {
  var redis = getRedisClient();
  var resultKey = 'idempotency:' + eventId + ':result';
  var cached = await redis.get(resultKey);
  return cached ? JSON.parse(cached) : null;
}

async function cacheResult(eventId, result) {
  var redis = getRedisClient();
  var resultKey = 'idempotency:' + eventId + ':result';
  await redis.set(resultKey, JSON.stringify(result), 'EX', 86400);
}

export async function completeCourse(userId, courseId, eventId, metadata) {
  if (metadata === undefined) metadata = {};
  var cached = await getCachedResult(eventId);
  if (cached) {
    logger.info('Returning cached completion result', { eventId });
    return cached;
  }
  var acquired = await acquireIdempotencyKey(eventId);
  if (!acquired) {
    var existing = await getCachedResult(eventId);
    if (existing) return existing;
    throw new AppError('Completion already in progress', 409, { eventId });
  }
  try {
    var eligible = await checkEligibility(userId, courseId);
    if (!eligible) {
      var result = { success: false, reason: 'NOT_ELIGIBLE', userId, courseId };
      await cacheResult(eventId, result);
      return result;
    }
    var enrollmentId = userId + ':' + courseId;
    var completedAt = new Date();
    var certificateNumber = 'CERT-' + completedAt.getTime() + '-' + Math.random().toString(36).substr(2,6).toUpperCase();
    var issueDate = completedAt.toISOString().split('T')[0];
    await pool.execute(
      'INSERT INTO course_completions (enrollment_id, student_id, course_id, completed_at, certificate_number, issue_date, status) VALUES (?, ?, ?, ?, ?, ?, \'PENDING\') ON DUPLICATE KEY UPDATE completed_at = VALUES(completed_at), certificate_number = VALUES(certificate_number), issue_date = VALUES(issue_date)',
      [enrollmentId, userId, courseId, completedAt, certificateNumber, issueDate]
    );
    var eventPayload = {
      eventId: eventId,
      eventType: 'course_completed',
      source: 'completionService',
      timestamp: completedAt.toISOString(),
      userId: userId,
      courseId: courseId,
      enrollmentId: enrollmentId,
      certificateNumber: certificateNumber,
      metadata: metadata
    };
    await publishCompletionEvent(eventPayload);
    broadcastToUser(userId, 'course_completed', eventPayload);
    var redis = getRedisClient();
    await redis.del('user:' + userId + ':progress', 'user:' + userId + ':completed_modules');
    var result = { success: true, enrollmentId: enrollmentId, certificateNumber: certificateNumber, completedAt: completedAt.toISOString() };
    await cacheResult(eventId, result);
    return result;
  } catch (err) {
    var errorPayload = {
      eventId: eventId,
      eventType: 'course_completed',
      source: 'completionService',
      timestamp: new Date().toISOString(),
      userId: userId,
      courseId: courseId,
      metadata: metadata
    };
    await publishToDlq(errorPayload, err);
    logger.error('Course completion failed', { eventId: eventId, userId: userId, courseId: courseId, error: err.message });
    throw err;
  }
}

export async function checkHealth() {
  var start = Date.now();
  var checks = {};
  try {
    var redis = getRedisClient();
    var redisHealth = await redis.ping();
    checks.redis = { status: 'healthy', latencyMs: Date.now() - start, ping: redisHealth };
  } catch (err) {
    checks.redis = { status: 'unhealthy', error: err.message };
  }
  try {
    await pool.execute('SELECT 1');
    checks.database = { status: 'healthy', latencyMs: Date.now() - start };
  } catch (err) {
    checks.database = { status: 'unhealthy', error: err.message };
  }
  try {
    if (completionProducer) {
      var admin = completionProducer.admin();
      await admin.connect();
      var meta = await admin.describeCluster();
      await admin.disconnect();
      checks.kafka = { status: 'healthy', brokers: meta.brokers ? meta.brokers.length : 0 };
    } else {
      checks.kafka = { status: 'unknown', message: 'Producer not initialized' };
    }
  } catch (err) {
    checks.kafka = { status: 'unhealthy', error: err.message };
  }
  var overall = Object.values(checks).every(function(c) { return c.status === 'healthy'; }) ? 'healthy' : 'degraded';
  return {
    status: overall,
    timestamp: new Date().toISOString(),
    checks: checks
  };
}

export async function gracefulShutdown(signal) {
  if (isShuttingDown) {
    logger.info('Completion service shutdown already in progress');
    return;
  }
  isShuttingDown = true;
  logger.info('Completion service graceful shutdown initiated', { signal: signal });
  try {
    if (completionProducer) {
      await completionProducer.disconnect();
      completionProducer = null;
      completionKafka = null;
      logger.info('Completion Kafka producer disconnected');
    }
  } catch (err) {
    logger.error('Error during completion service shutdown', { error: err.message });
  }
}

process.on('SIGTERM', function() { gracefulShutdown('SIGTERM'); });
process.on('SIGINT', function() { gracefulShutdown('SIGINT'); });

export default {
  checkEligibility: checkEligibility,
  updateProgress: updateProgress,
  getProgress: getProgress,
  completeCourse: completeCourse,
  checkHealth: checkHealth,
  gracefulShutdown: gracefulShutdown
};
