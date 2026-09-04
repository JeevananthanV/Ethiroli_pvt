import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { csrfProtection } from './middleware/csrf.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

// Custom simple cookie parser middleware
app.use((req, res, next) => {
  const cookies = {};
  const rawCookies = req.headers.cookie;
  if (rawCookies) {
    rawCookies.split(';').forEach(c => {
      const parts = c.split('=');
      const name = parts.shift().trim();
      const value = parts.join('=');
      if (name) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  req.cookies = cookies;
  next();
});

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    // In Phase 1 we allow any origin in dev or read ALLOWED_ORIGINS.
    // For local dev with client on 3000 / 5173, let's allow it.
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiting and CSRF protection
app.use('/api', apiLimiter);
app.use('/api', csrfProtection);

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
