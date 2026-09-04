const rateLimitStore = new Map();

// Clean up stale rate limit records every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export const createLimiter = ({ windowMs, max, message }) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    let record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs
      };
    }

    record.count += 1;
    rateLimitStore.set(key, record);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({ message: message || 'Too many requests, please try again later.' });
    }

    next();
  };
};

export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5,
  message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
});

export const apiLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Global API rate limit exceeded. Please slow down.'
});
