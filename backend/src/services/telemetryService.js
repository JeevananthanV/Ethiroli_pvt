import { Kafka } from 'kafkajs';

import { logger } from '../config/logger.js';

// Set KAFKA_ENABLED=false in Hostinger env vars to disable Kafka
const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== 'false' &&
  (process.env.KAFKA_BROKERS || '').trim().length > 0;

const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',').map((b) => b.trim());
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || 'ethiroli-backend';
const KAFKA_TOPIC = process.env.KAFKA_TELEMETRY_TOPIC || 'lms.telemetry.raw';
const KAFKA_RETRIES = Number(process.env.KAFKA_RETRIES || 5);
const KAFKA_RETRY_BASE_MS = Number(process.env.KAFKA_RETRY_BASE_MS || 100);
const KAFKA_RETRY_MAX_MS = Number(process.env.KAFKA_RETRY_MAX_MS || 10000);
const KAFKA_REQUEST_TIMEOUT_MS = Number(process.env.KAFKA_REQUEST_TIMEOUT_MS || 30000);
const KAFKA_CONNECTION_TIMEOUT_MS = Number(process.env.KAFKA_CONNECTION_TIMEOUT_MS || 10000);
const KAFKA_RECONNECT_BASE_MS = Number(process.env.KAFKA_RECONNECT_BASE_MS || 200);
const KAFKA_RECONNECT_MAX_MS = Number(process.env.KAFKA_RECONNECT_MAX_MS || 30000);

const TELEMETRY_REQUIRED_FIELDS = ['event', 'timestamp', 'source'];

let producer = null;
let kafka = null;
let isShuttingDown = false;

const createKafkaClient = () => {
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
};

const getProducer = () => {
  if (!KAFKA_ENABLED) return null;

  if (!kafka) {
    kafka = createKafkaClient();
  }

  if (!producer) {
    producer = kafka.producer({
      retry: {
        retries: KAFKA_RETRIES,
        initialRetryTime: KAFKA_RECONNECT_BASE_MS,
        maxRetryTime: KAFKA_RECONNECT_MAX_MS,
        factor: 2
      },
      maxInFlightRequests: 5,
      idempotent: true,
      transactionalId: `${KAFKA_CLIENT_ID}-telemetry-tx`
    });

    producer.on('producer.disconnect', () => {
      logger.warn('Kafka producer disconnected');
    });

    producer.on('producer.connect', () => {
      logger.info('Kafka producer connected', { brokers: KAFKA_BROKERS });
    });

    producer.on('producer.error', (error) => {
      logger.error('Kafka producer error', { error: error.message });
    });
  }

  return producer;
};

const exponentialBackoffDelay = (attempt) => {
  const delay = Math.min(KAFKA_RETRY_BASE_MS * Math.pow(2, attempt), KAFKA_RETRY_MAX_MS);
  const jitter = Math.random() * delay * 0.1;
  return delay + jitter;
};

export const publishTelemetry = async (event) => {
  if (!KAFKA_ENABLED) {
    logger.debug('Kafka disabled — telemetry event dropped (no-op)', { event: event?.event });
    return { success: false, reason: 'kafka_disabled' };
  }

  if (!event || typeof event !== 'object') {
    logger.error('Invalid telemetry event: must be a non-null object');
    throw new Error('Telemetry event must be a non-null object');
  }

  for (const field of TELEMETRY_REQUIRED_FIELDS) {
    if (!event[field]) {
      logger.error('Missing required telemetry field', { field });
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const payload = {
    ...event,
    publishedAt: new Date().toISOString(),
    service: event.service || KAFKA_CLIENT_ID
  };

  const serialized = JSON.stringify(payload);

  const prod = getProducer();

  let lastError;

  for (let attempt = 0; attempt <= KAFKA_RETRIES; attempt++) {
    if (isShuttingDown) {
      logger.warn('Telemetry publish aborted: service is shutting down');
      throw new Error('Service is shutting down');
    }

    try {
      await prod.send({
        topic: KAFKA_TOPIC,
        messages: [
          {
            key: payload.event,
            value: serialized,
            headers: {
              'content-type': 'application/json',
              'event-type': String(payload.event),
              'source': String(payload.source),
              'timestamp': String(payload.timestamp)
            }
          }
        ]
      });

      logger.info('Telemetry event published', { event: payload.event, topic: KAFKA_TOPIC, attempt });

      return { success: true, topic: KAFKA_TOPIC, event: payload.event, attempt };
    } catch (error) {
      lastError = error;
      logger.warn('Telemetry publish attempt failed', { event: payload.event, attempt, error: error.message });

      if (attempt < KAFKA_RETRIES) {
        const delay = exponentialBackoffDelay(attempt);
        logger.info('Retrying telemetry publish', { event: payload.event, attempt: attempt + 1, delayMs: Math.round(delay) });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  logger.error('Telemetry publish failed after all retries', { event: payload.event, error: lastError.message });
  throw new Error(`Failed to publish telemetry after ${KAFKA_RETRIES + 1} attempts: ${lastError.message}`);
};

export const publishBatchTelemetry = async (events) => {
  if (!Array.isArray(events) || events.length === 0) {
    logger.error('Invalid batch: expected non-empty array');
    throw new Error('Batch must be a non-empty array');
  }

  const results = { success: 0, failed: 0, errors: [] };

  for (const event of events) {
    try {
      await publishTelemetry(event);
      results.success += 1;
    } catch (error) {
      results.failed += 1;
      results.errors.push({ event: event.event, error: error.message });
    }
  }

  logger.info('Batch telemetry publish completed', results);
  return results;
};

export const connectTelemetryProducer = async () => {
  if (!KAFKA_ENABLED) {
    logger.info('Kafka disabled — skipping telemetry producer connection');
    return { success: true, connected: false, reason: 'kafka_disabled' };
  }
  if (isShuttingDown) {
    logger.warn('Cannot connect: service is shutting down');
    throw new Error('Service is shutting down');
  }

  const prod = getProducer();

  try {
    await prod.connect();
    logger.info('Kafka telemetry producer connected', { brokers: KAFKA_BROKERS });
    return { success: true, connected: true };
  } catch (error) {
    logger.error('Kafka telemetry producer connection failed', { error: error.message });
    throw error;
  }
};

export const disconnectTelemetryProducer = async () => {
  if (!producer) {
    logger.info('Kafka telemetry producer not connected');
    return { success: true, connected: false };
  }

  try {
    await producer.disconnect();
    producer = null;
    kafka = null;
    logger.info('Kafka telemetry producer disconnected');
    return { success: true, connected: false };
  } catch (error) {
    logger.error('Error disconnecting Kafka telemetry producer', { error: error.message });
    throw error;
  }
};

export const checkTelemetryHealth = async () => {
  if (!KAFKA_ENABLED) {
    return {
      status: 'disabled',
      connected: false,
      latencyMs: 0,
      timestamp: new Date().toISOString()
    };
  }
  const start = Date.now();

  try {
    if (!producer) {
      return {
        status: 'unhealthy',
        connected: false,
        latencyMs: Date.now() - start,
        error: 'Producer not connected',
        timestamp: new Date().toISOString()
      };
    }

    const admin = getProducer().admin();
    await admin.connect();
    const clusterMetadata = await admin.describeCluster();
    await admin.disconnect();

    const latencyMs = Date.now() - start;
    const healthy = latencyMs < 5000 && clusterMetadata.brokers && clusterMetadata.brokers.length > 0;

    return {
      status: healthy ? 'healthy' : 'unhealthy',
      connected: true,
      latencyMs,
      brokers: clusterMetadata.brokers ? clusterMetadata.brokers.length : 0,
      controller: clusterMetadata.controller,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const latencyMs = Date.now() - start;
    return {
      status: 'unhealthy',
      connected: false,
      latencyMs,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export const getTelemetryProducer = () => producer;

export const getKafkaClient = () => kafka;

export const getTelemetryConfig = () => ({
  brokers: KAFKA_BROKERS,
  clientId: KAFKA_CLIENT_ID,
  topic: KAFKA_TOPIC,
  retries: KAFKA_RETRIES,
  requestTimeoutMs: KAFKA_REQUEST_TIMEOUT_MS,
  connectionTimeoutMs: KAFKA_CONNECTION_TIMEOUT_MS
});

export const gracefulShutdown = async (signal) => {
  if (isShuttingDown) {
    logger.info('Telemetry service shutdown already in progress');
    return;
  }

  isShuttingDown = true;
  logger.info(`Telemetry service graceful shutdown initiated`, { signal });

  try {
    await disconnectTelemetryProducer();
    logger.info('Telemetry service shutdown complete');
  } catch (error) {
    logger.error('Error during telemetry service shutdown', { error: error.message });
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default {
  publishTelemetry,
  publishBatchTelemetry,
  connectTelemetryProducer,
  disconnectTelemetryProducer,
  checkTelemetryHealth,
  getTelemetryProducer,
  getKafkaClient,
  getTelemetryConfig,
  gracefulShutdown
};
