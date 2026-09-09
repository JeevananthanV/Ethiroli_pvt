import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { csrfProtection } from './middleware/csrf.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { securityHeaders, requestLogger } from './middleware/security.js';
import requestId from './middleware/requestId.js';
import apiVersioning from './middleware/apiVersioning.js';
import { ALLOWED_ORIGINS } from './config/constants.js';

const app = express();

// Request logging (first to capture all requests)
app.use(requestLogger);

// Assign unique request ID to every request
app.use(requestId);

// API versioning middleware
app.use(apiVersioning);

// Robust cookie parser
app.use((req, res, next) => {
  const cookies = {};
  const rawCookies = req.headers.cookie;
  if (rawCookies) {
    rawCookies.split(';').forEach(c => {
      const eqIndex = c.indexOf('=');
      if (eqIndex === -1) return;
      const name = c.slice(0, eqIndex).trim();
      let value = c.slice(eqIndex + 1).trim();
      try { value = decodeURIComponent(value); } catch (_) { /* keep raw */ }
      if (name) cookies[name] = value;
    });
  }
  req.cookies = cookies;
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Strict CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Security headers
app.use(securityHeaders);

// Apply global rate limiting and CSRF protection
app.use('/api', apiLimiter);
app.use('/api', csrfProtection);

// API Routes
app.use('/api', routes);

// Health check endpoints (outside /api for load balancer accessibility)
import healthRoutes from './routes/healthRoutes.js';
app.use('/health', healthRoutes);

// Global Error Handler (must be after routes)
app.use(errorHandler);

export default app;
