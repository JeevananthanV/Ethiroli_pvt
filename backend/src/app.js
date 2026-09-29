import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { csrfProtection } from './middleware/csrf.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { securityHeaders, requestLogger } from './middleware/security.js';
import requestId from './middleware/requestId.js';
import apiVersioning from './middleware/apiVersioning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ALLOWED_ORIGINS } from './config/constants.js';

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (['localhost', '127.0.0.1', '::1'].includes(hostname)) return true;
    if (hostname === 'ethiroli.net' || hostname.endsWith('.ethiroli.net')) return true;
  } catch {
    return false;
  }
  return false;
};

const app = express();

// Trust reverse proxy (Hostinger, Nginx, LiteSpeed, Cloudflare)
app.set('trust proxy', 1);

// Request logging (first to capture all requests)
app.use(requestLogger);

// Assign unique request ID to every request
app.use(requestId);

// Worker identification + upstream connection pooling hints
app.use((req, res, next) => {
  res.setHeader('X-Worker-Pid', process.pid);
  if (process.env.CLUSTER_WORKER_ID) {
    res.setHeader('X-Worker-Id', process.env.CLUSTER_WORKER_ID);
  }
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=1000');
  res.setHeader('X-Upstream-Connection', 'keep-alive');
  next();
});

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

// Strict CORS with multi-environment support (localhost dev + production domain)
app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Portal', 'X-CSRF-Token'],
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
app.use('/health', healthRoutes);

// === Single-Domain Static Frontend Serving (ethiroli.net) ===

const candidatePaths = [
  process.env.CLIENT_BUILD_PATH,
  path.resolve(__dirname, '../../frontend/dist'),
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../dist')
].filter(Boolean);

const clientDist = candidatePaths.find(p => fs.existsSync(p));

// MPA role → HTML file mapping (mirrors vite.config.js rollupOptions.input)
const MPA_ROLE_MAP = [
  ['/app/super-admin', 'super-admin.html'],
  ['/auth/super-admin', 'super-admin.html'],
  ['/app/admin',       'admin.html'],
  ['/auth/admin',      'admin.html'],
  ['/dashboard',       'admin.html'],
  ['/admin',           'admin.html'],
  ['/app/tutor',       'tutor.html'],
  ['/auth/tutor',      'tutor.html'],
  ['/app/student',     'student.html'],
  ['/auth/student',    'student.html'],
  ['/student',         'student.html'],
  ['/app/intern',      'intern.html'],
  ['/auth/intern',     'intern.html'],
  ['/intern',          'intern.html'],
  ['/app/hr',          'hr.html'],
  ['/auth/hr',         'hr.html'],
  ['/app/pm',          'pm.html'],
  ['/auth/pm',         'pm.html'],
  ['/app/finance',     'finance.html'],
  ['/auth/finance',    'finance.html'],
  ['/app/sales',       'sales.html'],
  ['/auth/sales',      'sales.html'],
  ['/app/reception',   'reception.html'],
  ['/auth/reception',  'reception.html'],
  ['/app/employee',    'employee.html'],
  ['/auth/employee',   'employee.html'],
  ['/employee',        'employee.html'],
];

if (clientDist) {
  const staticCacheHeaders = (res, filePath, stat) => {
    if (typeof filePath === 'string') {
      if (/\.(js|css|woff2?|ttf|eot|ico|png|jpe?g|gif|svg)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  };
  app.use(express.static(clientDist, { setHeaders: staticCacheHeaders }));

  // MPA fallback — map each role URL prefix to the correct portal HTML
  app.get('*', (req, res, next) => {
    // Never intercept API / WebSocket / health routes
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/health') ||
      req.path.startsWith('/socket.io') ||
      req.path.startsWith('/v1')
    ) {
      return next();
    }

    // Never return HTML for static file extensions (e.g. missing .js, .css, images)
    if (/\.(js|css|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|json|map)$/i.test(req.path)) {
      return res.status(404).type('text/plain').send('Static resource not found');
    }

    // Find the matching role HTML
    const match = MPA_ROLE_MAP.find(([prefix]) => req.path.startsWith(prefix));
    const htmlFile = match ? match[1] : 'index.html';
    const filePath = path.join(clientDist, htmlFile);

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }

    // Final fallback to index.html (public login page)
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
