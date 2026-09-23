import crypto from 'crypto';

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const formatLogEntry = (level, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };

  const sensitiveKeys = ['password', 'secret', 'token', 'api_key', 'authorization', 'cookie'];
  const sanitized = { ...entry };

  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
};

export const createLogger = () => {
  const log = (level, message, meta = {}) => {
    const entry = formatLogEntry(level, message, meta);
    const output = JSON.stringify(entry);

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'info':
        console.info(output);
        break;
      case 'debug':
        if (process.env.NODE_ENV !== 'production') {
          console.debug(output);
        }
        break;
      default:
        console.log(output);
    }
  };

  return {
    error: (message, meta = {}) => log('error', message, meta),
    warn: (message, meta = {}) => log('warn', message, meta),
    info: (message, meta = {}) => log('info', message, meta),
    debug: (message, meta = {}) => log('debug', message, meta),
    child: (prefix) => createLoggerWithPrefix(prefix)
  };
};

const createLoggerWithPrefix = (prefix) => {
  const logger = createLogger();
  const original = { ...logger };

  logger.error = (message, meta = {}) => original.error(`[${prefix}] ${message}`, meta);
  logger.warn = (message, meta = {}) => original.warn(`[${prefix}] ${message}`, meta);
  logger.info = (message, meta = {}) => original.info(`[${prefix}] ${message}`, meta);
  logger.debug = (message, meta = {}) => original.debug(`[${prefix}] ${message}`, meta);

  return logger;
};

export const logger = createLogger();
export default logger;
