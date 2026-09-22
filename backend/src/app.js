import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { csrfProtection } from './middleware/csrf.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { securityHeaders, requestLogger } from './middleware/security.js';
import requestId from './middleware/requestId.js';
import apiVersioning from './middleware/apiVersioning.js';
const envOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = envOrigins.length > 0 
  ? envOrigins 
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'];

const app = express();

// Trust reverse proxy (Hostinger, Nginx, LiteSpeed, Cloudflare)
app.set('trust proxy', 1);

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
    // DEBUG: Log the origin and allowed origins
    console.log('🔍 CORS Check:', { 
      receivedOrigin: origin,
      allowedOrigins: ALLOWED_ORIGINS,
      isAllowed: !origin || ALLOWED_ORIGINS.includes(origin)
    });
    
    let isLocalDevelopmentOrigin = false;
    if (origin && process.env.NODE_ENV !== 'production') {
      try {
        const { hostname } = new URL(origin);
        isLocalDevelopmentOrigin = ['localhost', '127.0.0.1', '::1'].includes(hostname);
      } catch {
        isLocalDevelopmentOrigin = false;
      }
    }

    if (!origin || ALLOWED_ORIGINS.includes(origin) || isLocalDevelopmentOrigin) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Portal'],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Security headers
app.use(securityHeaders);

// Apply global rate limiting and CSRF protection
app.use('/api', apiLimiter);
app.use('/api', csrfProtection);

// Forward unversioned API calls (e.g., /api/tenants -> /api/v1/tenants)
app.use('/api', (req, res, next) => {
  if (!req.url.startsWith('/v1') && !req.url.startsWith('/health')) {
    req.url = '/v1' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// API Routes
app.use('/api', routes);
app.use('/v1', (req, res, next) => {
  req.url = '/v1' + req.url;
  routes(req, res, next);
});

// Health check endpoints (outside /api for load balancer accessibility)
import healthRoutes from './routes/healthRoutes.js';
app.use('/health', healthRoutes);

// === Single-Domain Static Frontend Serving (ethiroli.net) ===
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidatePaths = [
  process.env.CLIENT_BUILD_PATH,
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../dist')
].filter(Boolean);

const clientDist = candidatePaths.find(p => fs.existsSync(p));

if (clientDist) {
  console.log(`📦 Serving static frontend from: ${clientDist}`);
  app.use(express.static(clientDist));

  // SPA fallback for client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/socket.io')) {
      return next();
    }

    if (req.path.startsWith('/app') || req.path.startsWith('/admin')) {
      const adminFile = path.join(clientDist, 'admin.html');
      if (fs.existsSync(adminFile)) {
        return res.sendFile(adminFile);
      }
    }

    const indexFile = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexFile)) {
      return res.sendFile(indexFile);
    }

    next();
  });
}

// Global Error Handler (must be after routes and static handlers)
app.use(errorHandler);

export default app;
