import 'dotenv/config';
import Redis from 'ioredis';
import { logger } from './logger.js';

// Enable Redis only when explicitly enabled or when a remote Redis host/url is configured
const REDIS_ENABLED = process.env.REDIS_ENABLED === 'true' || Boolean(process.env.REDIS_URL) || (process.env.REDIS_ENABLED !== 'false' && Boolean(process.env.REDIS_HOST && process.env.REDIS_HOST !== '127.0.0.1' && process.env.REDIS_HOST !== 'localhost'));

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
      if (times > 2) {
        return null; // stop retrying quickly if no local Redis
      }
      return 500;
    },
    enableReadyCheck: true,
    connectTimeout: 2000,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    keepAlive: 30000
  });

  return client;
};

const initializeRedis = () => {
  if (redisClient) return redisClient;

  redisClient = createRedisClient();

  if (!redisClient) return null;

  redisClient.on('connect', () => {
    logger.info('Redis client connected', { host: redisHost, port: redisPort, mode: isClusterMode ? 'cluster' : 'standalone' });
  });

  redisClient.on('ready', () => {
    logger.info('Redis client ready');
  });

  redisClient.on('error', (error) => {
    logger.warn('Redis client error (non-fatal)', { error: error.message });
  });

  redisClient.on('close', () => {
    // Silent close
  });

  return redisClient;
};

export const getRedisClient = () => {
  if (!redisClient) {
    return initializeRedis();
  }
  return redisClient;
};

export const isRedisAvailable = () => REDIS_ENABLED && redisClient !== null && redisClient.status === 'ready';

export const checkRedisHealth = async (clientInstance) => {
  const start = Date.now();
  if (!clientInstance || !REDIS_ENABLED) {
    return { connected: false, latencyMs: 0, disabled: true };
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
    status: health.connected ? 'healthy' : (health.disabled ? 'disabled' : 'unhealthy'),
    redis: health,
    timestamp: new Date().toISOString()
  };
};

export const closeRedisConnection = async () => {
  if (redisClient) {
    try {
      if (redisClient.status === 'ready' || redisClient.status === 'connect') {
        await redisClient.quit().catch(() => {
          try { redisClient.disconnect(); } catch (_) {}
        });
      } else {
        redisClient.disconnect();
      }
    } catch (_) {
      try { redisClient.disconnect(); } catch (_) {}
    }
    redisClient = null;
    logger.info('Redis connection closed');
  }
};

export default REDIS_ENABLED ? getRedisClient() : null;
