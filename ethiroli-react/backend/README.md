# Ethiroli Backend API

Node.js + Express + MySQL backend for the Ethiroli SaaS platform.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4.21+
- **Database**: MySQL (mysql2/promise)
- **Real-Time**: Socket.IO (port 3003)
- **Auth**: express-session + bcrypt
- **Encryption**: AES-256-GCM + PBKDF2

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and secrets

# Run database migrations
# Execute schema.sql against your MySQL database

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

See `.env.example` for all available configuration options.

**Critical security notes:**
- Change `SEED_ADMIN_PASSWORD` immediately after first deployment
- Use a strong, unique `SESSION_SECRET` and `ENCRYPTION_KEY` (min 32 chars)
- Set `NODE_ENV=production` for production deployments
- Configure `ALLOWED_ORIGINS` with your actual frontend domains
- Never commit `.env` to version control

## API Structure

- Base URL: `http://localhost:5000/api/v1`
- Authentication: Session cookie (`session_token`)
- Rate Limiting: 100 requests/minute per IP
- CSRF Protection: Origin/Referer validation

## Role-Based Access

The system supports 11 roles:
- SUPER_ADMIN, ADMIN, HR, TUTOR, PROJECT_MANAGER, FINANCE, SALES, RECEPTION, EMPLOYEE, STUDENT, INTERN

All protected routes require authentication. Most routes additionally require specific roles via `requireRole(...)` middleware.

## Database

- Connection pooling via `mysql2/promise`
- Sensitive fields encrypted at rest (AES-256-GCM)
- Email lookups use deterministic encryption for exact matching
- Schema defined in `schema.sql` (65+ tables)

## Socket.IO

- Standalone server on port 3003
- Session-based authentication
- Role-scoped rooms for broadcasts
- User-specific rooms for targeted notifications

## Development

```bash
# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Architecture

- **Controllers**: Request handlers in `src/controllers/`
- **Routes**: Route definitions in `src/routes/`
- **Models**: Data access layer in `src/models/`
- **Services**: Business logic in `src/services/`
- **Middleware**: Cross-cutting concerns in `src/middleware/`
- **Socket**: Real-time handlers in `src/socket/`

## Security Features

- bcrypt password hashing (10-12 salt rounds)
- Session rotation (last-login-wins)
- CSRF protection via Origin validation
- Field-level encryption for PII
- Rate limiting on all API endpoints
- Role-scoped Socket.IO broadcasts
- Security headers (X-Content-Type-Options, X-Frame-Options)
