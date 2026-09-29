import 'dotenv/config';
import Redis from 'ioredis';
import { logger } from './logger.js';

// Set REDIS_ENABLED=false in Hostinger env vars to run without Redis
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';

const isClusterMode = process.env.CLUSTER_MODE === 'true';
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT || 6379);
const redisPassword = process.env.REDIS_PASSWORD || undefined;
const redisDb = Number(process.env.REDIS_DB || 0);
const redisUrl = process.env.REDIS_URL;
const maxRetriesPerRequest = Number(process.env.REDIS_MAX_RETRIES || 3);
const reconnectOnError = (err) => {
  const targetError = 'READONLY';
  if (err.message.includes(targetError)) {
    logger.warn('Redis readonly error, reconnecting', { error: err.message });
    return true;
  }
  return false;
};

let redisClient = null;

const createRedisClient = () => {
  if (!REDIS_ENABLED) {
    logger.warn('Redis is disabled (REDIS_ENABLED=false). Using no-op stub.');
    return null;
  }

  if (isClusterMode) {
    if (!redisUrl) {
      throw new Error('REDIS_URL is required when CLUSTER_MODE is true');
    }
    const nodes = redisUrl.split(',').map((node) => {
      const [host, port] = node.trim().split(':');
      return { host, port: Number(port) };
    });
    return new Redis.Cluster(nodes, {
      redisOptions: {
        password: redisPassword,
        db: redisDb,
        maxRetriesPerRequest,
        reconnectOnError
      },
      scaleReads: 'slave',
      maxRetriesPerRequest,
      retryDelayOnFailover: 100,
      clusterRetryStrategy: (times) => {
        const delay = Math.min(times * 100, 3000);
        logger.warn('Redis cluster retry', { attempt: times, delayMs: delay });
        return delay;
      }
    });
  }

  const client = new Redis({
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    db: redisDb,
    maxRetriesPerRequest,
    reconnectOnError,
    retryStrategy: (times) => {
      // Stop retrying after 5 attempts so server doesn't hang
      if (times > 5) {
        logger.error('Redis max retries reached. Giving up.');
        return null; // stop retrying
      }
      const delay = Math.min(times * 200, 5000);
      logger.warn('Redis standalone retry', { attempt: times, delayMs: delay });
      return delay;
    },
    enableReadyCheck: true,
    connectTimeout: 3000,
    enableOfflineQueue: false,
    maxRetriesPerRequest,
    keepAlive: 30000
  });

  return client;
};

const initializeRedis = () => {
  if (redisClient) return redisClient;

  redisClient = createRedisClient();

  // If Redis is disabled, redisClient is null — return null
  if (!redisClient) return null;

  redisClient.on('connect', () => {
    logger.info('Redis client connected', { host: redisHost, port: redisPort, mode: isClusterMode ? 'cluster' : 'standalone' });
  });

  redisClient.on('ready', () => {
    logger.info('Redis client ready');
  });

  redisClient.on('error', (error) => {
    // Log as warning — don't let uncaught errors crash the process
    logger.warn('Redis client error (non-fatal)', { error: error.message });
  });

  redisClient.on('close', () => {
    logger.warn('Redis client closed');
  });

  redisClient.on('reconnecting', () => {
    logger.info('Redis client reconnecting');
  });

  return redisClient;
};

export const getRedisClient = () => {
  if (!redisClient) {
    return initializeRedis();
  }
  return redisClient;
};

export const isRedisAvailable = () => REDIS_ENABLED && redisClient !== null;

export const checkRedisHealth = async (clientInstance) => {
  const start = Date.now();
  if (!clientInstance) {
    return { connected: false, latencyMs: 0, error: 'Redis disabled or not connected' };
  }
  try {
    const result = await clientInstance.ping();
    const latencyMs = Date.now() - start;
    return { connected: true, latencyMs, result };
  } catch (error) {
    return { connected: false, latencyMs: Date.now() - start, error: error.message };
  }
};

export const getRedisHealth = async () => {
  const client = getRedisClient();
  const health = await checkRedisHealth(client);
  return {
    status: health.connected ? 'healthy' : 'unhealthy',
    redis: health,
    timestamp: new Date().toISOString()
  };
};

export const closeRedisConnection = async () => {
  if (redisClient) {
    await redisClient.quit().catch((error) => {
      logger.error('Error closing Redis connection', { error: error.message });
    });
    redisClient = null;
    logger.info('Redis connection closed');
  }
};

// Export null when disabled (callers must null-check)
export default REDIS_ENABLED ? getRedisClient() : null;
