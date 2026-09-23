# Multi-Tenant Authentication System — Technical Implementation Plan

**Project:** Ethiroli SaaS Platform  
**Version:** 1.0.0  
**Date:** 2026-09-09  
**Scope:** Role-based portal authentication with dedicated login pages, unique URLs, and independent auth flows within a single application framework.

---

## Table of Contents

1. [Architectural Design](#1-architectural-design)
2. [Authentication Logic](#2-authentication-logic)
3. [Routing & Security](#3-routing--security)
4. [Implementation Best Practices](#4-implementation-best-practices)
5. [Summary & Decision Matrix](#5-summary--decision-matrix)

---

## 1. Architectural Design

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                                 │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  /login/admin    │  │  /login/hr       │  │  /login/student  │  ... │
│  │  (SPA Entry)     │  │  (SPA Entry)     │  │  (SPA Entry)     │      │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘      │
│           │                     │                     │                 │
│           ▼                     ▼                     ▼                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  Shared React Application Shell                   │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐    │   │
│  │  │ Auth Router │  │ Portal Router│  │ Shared UI Components │    │   │
│  │  │ (Lazy Load) │  │ (Lazy Load)  │  │ (Navbar, Footer, etc)│    │   │
│  │  └─────────────┘  └──────────────┘  └──────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ HTTPS / WSS
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          INFRASTRUCTURE LAYER                            │
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────────────┐     │
│  │  CDN / WAF   │───▶│  Load Balancer│───▶│  API Gateway / Ingress│     │
│  │  (Cloudflare)│    │  (NGINX / ALB)│    │  (NGINX / Traefik)   │     │
│  └──────────────┘    └──────────────┘    └───────────┬───────────┘     │
│                                                        │                 │
│                 ┌──────────────────────────────────────┼───────┐       │
│                 │                                      │       │       │
│                 ▼                                      ▼       ▼       │
│  ┌───────────────────────┐    ┌───────────────────────┐  ┌──────────┐  │
│  │   Auth Service(s)     │    │   App Service(s)      │  │  Socket  │  │
│  │   Express / Node.js   │    │   Express / Node.js   │  │  Service │  │
│  │   (Stateless Workers) │    │   (Stateless Workers) │  │  (WS)    │  │
│  └───────────┬───────────┘    └───────────┬───────────┘  └────┬─────┘  │
│              │                            │                   │        │
│              ▼                            ▼                   ▼        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     DATA & CACHE LAYER                           │   │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐  │   │
│  │  │   MySQL 8    │  │  Redis 7+     │  │  Elasticsearch 8+    │  │   │
│  │  │  (Primary)   │  │  (Sessions,   │  │  (Search, Analytics) │  │   │
│  │  │              │  │   Cache, Rate)│  │                      │  │   │
│  │  └──────────────┘  └───────────────┘  └──────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Infrastructure Requirements

#### Compute

| Component | Specification | Count | Purpose |
|-----------|---------------|-------|---------|
| **API Workers** | 4 vCPU / 8 GB RAM | 3–5 (autoscaling) | Express.js REST + auth endpoints |
| **Socket Workers** | 2 vCPU / 4 GB RAM | 2–3 (autoscaling) | Socket.IO real-time layer |
| **Redis** | 2 vCPU / 4 GB RAM | 1 (primary) + 1 (replica) | Session store, rate limiting cache, pub/sub |
| **MySQL Primary** | 4 vCPU / 16 GB RAM | 1 | Primary DB with IOPs-optimized storage |
| **MySQL Replicas** | 4 vCPU / 16 GB RAM | 2 | Read replicas for role-scoped queries |
| **Elasticsearch** | 2 vCPU / 8 GB RAM | 3 (cluster) | Full-text search, analytics logs |

#### Storage

- **Primary DB:** SSD-backed MySQL 8.0 (provisioned IOPS or NVMe).
- **Redis:** Memory-optimized instance with AOF + RDB persistence.
- **Object Storage:** S3-compatible (MinIO / AWS S3) for generated PDFs, certificates, avatars, backups.
- **Backups:** Daily automated mysqldump + binlog shipping to offsite storage.

#### Networking

| Resource | Configuration |
|----------|---------------|
| **Load Balancer** | NGINX or AWS ALB with SSL termination, HTTP/2, gzip |
| **CDN / WAF** | Cloudflare (or AWS CloudFront + WAF) for static assets + DDoS protection |
| **VPC** | Private subnets for DB/Redis/cache; public subnets for API workers |
| **DNS** | Route 53 / Cloudflare DNS with wildcard `*.ethiroli.com` |
| **SSL** | Let's Encrypt / ACM managed certs for `ethiroli.com` and all subdomains |

#### CI/CD & Monitoring

- **CI/CD:** GitHub Actions or GitLab CI with staging → production pipelines.
- **Containerization:** Docker + Docker Compose (dev), Kubernetes (prod).
- **Monitoring:** Prometheus + Grafana (metrics), Sentry (error tracking), UptimeRobot (synthetic checks).
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana) or Loki.

### 1.3 URL Scheme & Routing

```
Public Marketing:
  https://ethiroli.com/
  https://ethiroli.com/about

Role-Specific Login Portals:
  https://ethiroli.com/login/admin
  https://ethiroli.com/login/hr
  https://ethiroli.com/login/finance
  https://ethiroli.com/login/student
  https://ethiroli.com/login/intern

Tenant-Scoped Login (white-label):
  https://acme-institute.ethiroli.com/login
  https://globalschool.ethiroli.com/login

Authenticated Portals:
  https://ethiroli.com/portal/admin/dashboard
  https://ethiroli.com/portal/hr/employees
  https://ethiroli.com/portal/student/courses

Tenant-Scoped Portals:
  https://acme-institute.ethiroli.com/portal/admin
  https://globalschool.ethiroli.com/portal/student

API Endpoints:
  https://api.ethiroli.com/v1/auth/login
  https://api.ethiroli.com/v1/auth/role/admin/login

WebSocket:
  wss://socket.ethiroli.com
```

### 1.4 Multi-Tenant Data Isolation Strategy

**Recommended Approach:** Shared Database + Shared Schema with Discriminator + Tenant Scoping

Given the existing single-database architecture, the **shared-database shared-schema** approach with strict tenant/role scoping is the pragmatic choice.

**Core Tables with Tenant/Role Discriminators:**

| Table | Isolation Mechanism |
|-------|---------------------|
| `tenants` | Top-level tenant record (organization/institute) |
| `users` | `tenant_id` (FK to tenants) + `role` enum |
| `sessions` | `tenant_id` + `user_id` (scoped to tenant) |
| `tenant_users` | Junction table for tenant membership |
| All business tables | `tenant_id` column with index + FK |

**Schema Modifications:**

```sql
-- Tenants table (organization level)
CREATE TABLE tenants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE,
    settings JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table: add tenant_id
ALTER TABLE users ADD COLUMN tenant_id BIGINT NULL;
ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE';
ALTER TABLE users ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);
ALTER TABLE users ADD INDEX idx_tenant_role (tenant_id, role);

-- Sessions: scope to tenant
ALTER TABLE sessions ADD COLUMN tenant_id BIGINT NULL;
ALTER TABLE sessions ADD FOREIGN KEY (tenant_id) REFERENCES tenants(id);

-- All business tables: add tenant_id with index
ALTER TABLE leads ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1;
ALTER TABLE courses ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1;
-- ... repeat for all tables

-- Create composite indexes for tenant isolation
CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_courses_tenant ON courses(tenant_id);
```

**Tenant Resolution Middleware:**

```javascript
// middleware/tenantResolver.js
export function resolveTenant(req, res, next) {
    const host = req.hostname;

    // 1. Subdomain resolution
    const subdomain = host.split('.')[0];
    if (subdomain !== 'www' && subdomain !== 'ethiroli') {
        req.tenant = await db.Tenant.findOne({ where: { slug: subdomain } });
    }

    // 2. Fallback to header (for API clients)
    if (!req.tenant) {
        req.tenant = await db.Tenant.findOne({ where: { id: req.headers['x-tenant-id'] } });
    }

    // 3. Fallback to query param (for dev/testing)
    if (!req.tenant) {
        req.tenant = await db.Tenant.findOne({ where: { id: req.query.tenant_id } });
    }

    if (!req.tenant && !isPublicRoute(req.path)) {
        return res.status(404).json({ error: 'Tenant not found' });
    }

    next();
}
```

### 1.5 Database Schema Additions for Multi-Tenant Auth

```sql
-- Auth Providers (OAuth2/SSO per user)
CREATE TABLE auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY uk_provider_user (provider, provider_user_id, tenant_id)
);

-- MFA Secrets
CREATE TABLE user_mfa (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    method ENUM('totp', 'webauthn', 'sms') NOT NULL,
    secret_encrypted TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    backup_codes_encrypted JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY uk_user_mfa_method (user_id, method)
);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_user_expires (user_id, expires_at)
);

-- Login Attempts (audit + brute-force detection)
CREATE TABLE login_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT NULL,
    email VARCHAR(255),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tenant_ip_time (tenant_id, ip_address, attempted_at)
);
```

---

## 2. Authentication Logic

### 2.1 Auth Strategy per Role

| Role | Primary Auth | Additional Methods |
|------|-------------|-------------------|
| SUPER_ADMIN | Email/password + MFA | Hardware token (YubiKey) |
| ADMIN | Email/password + MFA | SSO (SAML2/OIDC) |
| HR / TUTOR / FINANCE / SALES | Email/password + MFA | SSO (optional) |
| STUDENT | Email/password (light MFA) | OAuth2 (Google/Microsoft) |
| INTERN | Email/password | — |
| API Integrations | API Key + HMAC | mTLS (optional) |

### 2.2 Decoupled Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Browser  │────▶│  NGINX   │────▶│  React   │────▶│  Express │
│          │     │ (SPA)    │     │  SPA     │     │  Auth    │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
   │               │               │                    │
   │ GET /login/admin                          │              │
   │──────────────────────────────────────────▶│              │
   │               │               │                    │
   │               │               │  Render AdminLoginPage │
   │               │               │◀───────────────────│
   │               │               │                    │
   │ POST /api/v1/auth/role/admin/login                    │
   │──────────────────────────────────────────────────────▶│
   │               │               │                    │
   │               │               │  Validate credentials │
   │               │               │  Check role == ADMIN  │
   │               │               │  Generate JWT + Refresh │
   │               │               │  Store session in Redis │
   │               │               │                    │
   │               │               │  { token, user, role } │
   │               │               │◀────────────────────│
   │  Redirect: /portal/admin/dashboard                    │
   │◀──────────────────────────────────────────────────────│
   │               │               │                    │
   │  GET /portal/admin/dashboard (with Bearer token)       │
   │──────────────────────────────────────────────────────▶│
   │               │               │                    │
   │               │               │  AdminPortalShell   │
   │               │               │◀───────────────────│
   │               │               │                    │
```

### 2.3 JWT + Session Token Strategy

- **JWT Access Token:** 15-minute expiry, contains `sub`, `role`, `tenant_id`, `permissions[]`, `exp`.
- **Refresh Token:** 7-day expiry, stored in Redis, opaque random string.
- **Session Token:** 24-hour expiry (role-specific), stored as httpOnly cookie.
- **Token Rotation:** Refresh tokens rotate on every use; old tokens are revoked.

### 2.4 OAuth/SSO Decoupling Considerations

- **Client Secret Management:** Each portal's OAuth `client_secret` is encrypted at rest using AES-256-GCM + PBKDF2, stored per-portal in `provider_configs`.
- **Redirect URI Validation:** Each portal has a fixed, registered redirect URI. The OAuth callback handler validates `redirect_uri` exactly against the stored value.
- **PKCE Enforcement:** All public clients (SPA portals) must use PKCE (`code_challenge` + `code_challenge_method=S256`).
- **State Parameter Binding:** The `state` parameter includes `(portal_id, session_id, csrf_token)` to prevent mix-up attacks.

---

## 3. Routing & Security

### 3.1 Frontend Routing Logic

**Role Enum & Route Constants:**

```javascript
export const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  HR: 'HR',
  TUTOR: 'TUTOR',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  FINANCE: 'FINANCE',
  SALES: 'SALES',
  RECEPTION: 'RECEPTION',
  EMPLOYEE: 'EMPLOYEE',
  STUDENT: 'STUDENT',
  INTERN: 'INTERN',
  VENDOR: 'VENDOR',
  CLIENT: 'CLIENT',
});

export const LOGIN_PATHS = Object.freeze({
  [ROLES.ADMIN]: '/admin/login',
  [ROLES.VENDOR]: '/vendor/login',
  [ROLES.CLIENT]: '/client/login',
  [ROLES.SUPER_ADMIN]: '/super-admin/login',
  DEFAULT: '/login',
});

export const PORTAL_DEFAULT_ROUTES = Object.freeze({
  [ROLES.SUPER_ADMIN]: '/app/super-admin/dashboard',
  [ROLES.ADMIN]: '/app/admin/dashboard',
  [ROLES.VENDOR]: '/vendor/dashboard',
  [ROLES.CLIENT]: '/client/dashboard',
  [ROLES.HR]: '/app/hr/dashboard',
  [ROLES.EMPLOYEE]: '/app/employee/dashboard',
});
```

**Top-Level Router (`src/App.jsx`):**

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const AdminLoginPage = lazy(() => import('./auth/pages/AdminLoginPage'));
const VendorLoginPage = lazy(() => import('./auth/pages/VendorLoginPage'));
const ClientLoginPage = lazy(() => import('./auth/pages/ClientLoginPage'));
const SuperAdminLoginPage = lazy(() => import('./auth/pages/SuperAdminLoginPage'));
const AdminPortal = lazy(() => import('./roles/admin'));
const VendorPortal = lazy(() => import('./roles/vendor'));
const ClientPortal = lazy(() => import('./roles/client'));
const SuperAdminPortal = lazy(() => import('./roles/super-admin'));
const AppLayout = lazy(() => import('./common/components/AppLayout'));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/career" element={<Career />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/vendor/login" element={<VendorLoginPage />} />
        <Route path="/client/login" element={<ClientLoginPage />} />
        <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />

        <Route path="/app/admin/*" element={
          <RouteGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminPortal />
          </RouteGuard>
        } />
        <Route path="/app/super-admin/*" element={
          <RouteGuard allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminPortal />
          </RouteGuard>
        } />
        <Route path="/vendor/*" element={
          <RouteGuard allowedRoles={['VENDOR']}>
            <VendorPortal />
          </RouteGuard>
        } />
        <Route path="/client/*" element={
          <RouteGuard allowedRoles={['CLIENT']}>
            <ClientPortal />
          </RouteGuard>
        } />

        <Route path="/app/*" element={
          <RouteGuard>
            <AppLayout />
          </RouteGuard>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
```

### 3.2 Backend Routing Strategy

**Central Route Registry (`src/routes/index.js`):**

```javascript
import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './admin/adminRoutes.js';
import adminAuthRoutes from './admin/authRoutes.js';
import clientRoutes from './client/clientRoutes.js';
import clientAuthRoutes from './client/authRoutes.js';
import vendorRoutes from './vendor/vendorRoutes.js';
import vendorAuthRoutes from './vendor/authRoutes.js';
import { resolveTenant } from '../middleware/tenantResolver.js';

const router = express.Router();

router.use(resolveTenant);
router.use('/v1/auth', authRoutes);
router.use('/v1/admin/auth', adminAuthRoutes);
router.use('/v1/client/auth', clientAuthRoutes);
router.use('/v1/vendor/auth', vendorAuthRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/client', clientRoutes);
router.use('/v1/vendor', vendorRoutes);

export default router;
```

**Per-Role Auth Controller Example (`src/controllers/admin/authController.js`):**

```javascript
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Admin from '../../models/Admin.js';
import Session from '../../models/Session.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { success } from '../../utils/response.js';
import { AuthenticationError } from '../../utils/errors.js';
import { ROLES } from '../../config/constants.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findByEmail(email);

  if (!admin) {
    throw new AuthenticationError('Invalid credentials.');
  }

  if (admin.role !== ROLES.ADMIN && admin.role !== ROLES.SUPER_ADMIN) {
    throw new AuthenticationError('Access denied.');
  }

  const isMatch = await bcrypt.compare(password, admin.password_hash);
  if (!isMatch) {
    throw new AuthenticationError('Invalid credentials.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await Session.create({
    user_id: admin.id,
    token,
    expires_at: expiresAt,
    user_agent: req.headers['user-agent'],
    ip_address: req.ip,
  });

  res.cookie('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/app/admin',
    expires: expiresAt,
  });

  const { password_hash, ...safeAdmin } = admin;
  return success(res, 200, { user: safeAdmin, socket_token: token }, 'Login successful');
});
```

### 3.3 Security Threat Model

#### Assets
- Session tokens (`session_token` cookies, `socket_token` JWTs)
- OAuth client secrets and redirect URIs per portal
- User credentials (password hashes, MFA seeds)
- Role-scoped data (LMS, HRMS, Finance, CRM, PMS)
- Audit trail integrity

#### Threat Actors
- **External attackers:** credential stuffing, phishing, OAuth mix-up attacks, token replay
- **Malicious insiders:** privilege escalation across portals, session hijacking, data exfiltration
- **Compromised OAuth provider:** token forgery, account takeover via IdP breach
- **Network-level adversaries:** MITM, cookie theft via XSS, CSRF

#### Cross-Role Vulnerability Scenarios

**Scenario A: Admin Accesses Client Portal**
If the `session_token` cookie is shared across `admin.ethiroli.com` and `client.ethiroli.com` (wildcard domain `.ethiroli.com`), an Admin logging into the Admin portal automatically carries a valid session token to the Client portal. The Client portal frontend `PrivateRoute` checks role, but the backend `authenticate` middleware only validates token existence, not portal binding.

**Scenario B: Session Token Reuse Across Roles**
A single user record can hold only one active session. However, if a user has multiple roles, the token does not encode the role. A role change mid-session leaves the old token valid until expiry or re-login.

**Scenario C: Session Fixation via Portal Swap**
An attacker lures a victim to a pre-set session URL for the Vendor portal. When the victim authenticates on the Client portal, if the session token is not regenerated per portal, the attacker's fixation token becomes valid for the victim's elevated role.

#### Mitigation Strategies

| Threat | Mitigation |
|---|---|
| Token reuse across portals | Cookie `Domain`/`Path` scoping; `portal_id` bound session records |
| Session fixation | Regenerate token on login, logout, and portal switch; `session_token` bound to `portal_id` |
| OAuth mix-up | `state` parameter includes `portal_id` + server-side session reference |
| CSRF | `SameSite=Strict`; Origin/Referer validation; custom `X-CSRF-Token` header |
| Authorization bypass | `requirePortal` + `requireRole` + `requirePermission` middleware chain |
| IDOR | `tenantResolver` enforces `req.tenantId === user.tenant_id` for all data routes |
| Credential stuffing | Per-portal login rate limiter; global account lockout after 5 failures; MFA enforcement |
| XSS → session theft | `httpOnly` cookies; CSP `script-src 'self'`; no inline scripts; sanitize all user-generated content |
| MITM | HSTS with `includeSubDomains`; TLS 1.3 only; `Secure` cookies |

### 3.4 Session Management Security

**Cookie Isolation:**
- **`Domain` attribute:** Set to the specific portal subdomain (e.g., `Domain=admin.ethiroli.com`) to prevent subdomain sharing. **Never** use a wildcard domain across portals.
- **`Path` attribute:** Set to the portal root path (e.g., `Path=/admin/`) so the cookie is not sent to `/api/v1/auth` endpoints of other portals.
- **`SameSite`:** Enforce `Strict` for all portals to eliminate cross-site request carrying.
- **`Secure`:** Must be `true` in production; block `http` cookie issuance entirely.

**Token Storage:**
- **Backend:** `session_token` must be a 256-bit cryptographically random value (`crypto.randomBytes(32).toString('hex')`).
- **Frontend:** Never store `socket_token` in `localStorage`. Move it to a separate, isolated `socket_token` httpOnly cookie, or read it from an in-memory store only.
- **Expiry:** 24-hour expiry for session tokens, but implement **idle timeout** (e.g., 8h) and **absolute timeout** (e.g., 24h) for ADMIN and SUPER_ADMIN roles.

**CSRF:**
- **Portal-specific origin validation:** Each portal must register its own origin in `ALLOWED_ORIGINS`. Do not allow a single origin to cover all portals.
- **Double-submit cookie pattern:** For AJAX mutating requests, require a custom header (e.g., `X-CSRF-Token`) that is not automatically added by browsers, supplementing Origin checks.

**Session Fixation:**
- **Mitigation:** Regenerate `session_token` on every login, logout, and **portal switch**. The current code regenerates on login, but does not handle portal switching within the same browser session.
- **Implementation:** Add a `portal_id` column to the `sessions` table. On login, bind the session to the portal. When a user switches portals, force re-authentication or rotate the token.

### 3.5 Authorization Bypass Prevention

**RBAC Isolation:**
The `requireRole` middleware operates on `req.user.role` without portal context. In a decoupled system:
- **Risk:** A backend route mounted under `/api/v1/admin/users` may be accessible to a Client user if the Client portal's API client can guess the URL and present a valid token.
- **Mitigation:** Implement **portal-scoped route guards**:
  ```javascript
  export const requirePortal = (allowedPortals) => (req, res, next) => {
    if (!req.portal || !allowedPortals.includes(req.portal)) {
      throw new AuthorizationError('Portal not authorized for this resource.');
    }
    next();
  };
  ```
- **Middleware chain order:** `authenticate` → `requirePortal` → `requireRole` → controller.

**IDOR via Shared Resources:**
- **Risk:** `clients`, `subscriptions`, `tasks` are accessible via `client_id` query params. If a Client portal user can enumerate IDs, they may access another tenant's data.
- **Mitigation:** The `tenantResolver` middleware must enforce that `req.tenantId` matches the user's assigned tenant for all non-SUPER_ADMIN requests.

**Role Privilege Creep:**
- **Risk:** The `ROLE_PERMISSIONS` map is defined but not enforced in backend controllers. Route-level `requireRole` guards exist, but granular permission checks (`users:write` vs `users:read`) are absent.
- **Mitigation:** Implement a `requirePermission(...permissions)` middleware that intersects `ROLE_PERMISSIONS[req.user.role]` with the route's required permissions.

### 3.6 Rate Limiting and Brute-Force Protection

**Per-Portal Rate Limits:**

| Endpoint Category | Window | Max | Scope |
|---|---|---|---|
| `/api/v1/auth/login` | 15 min | 5 | Per email + per IP |
| `/api/v1/auth/oauth/:provider/callback` | 15 min | 10 | Per session state + IP |
| `/api/v1/auth/mfa/verify` | 5 min | 5 | Per user ID |
| `/api/v1/auth/mfa/enroll` | 1 hour | 3 | Per user ID |
| Global API | 1 min | 100 | Per user ID or IP |

**Hardening Requirements:**
- **Distributed rate limiter:** Replace in-memory `Map` with Redis for consistency across cluster instances.
- **Exponential backoff:** After 3 failed logins, apply increasing delays (1s, 2s, 4s…) before returning 429.
- **CAPTCHA:** Integrate reCAPTCHA v3 on all portal login forms after 1 failed attempt. Score threshold ≥ 0.5.
- **Account lockout:** After 5 consecutive failures, lock the account for 15 minutes and emit an alert.
- **Portal-specific limiter keys:** `buildRateLimitKey` must include portal: `portal:${req.portal}:user:${userId}` to prevent a brute-force attack on one portal from consuming the quota of another.

### 3.7 Security Headers and Middleware Requirements

**Security Headers (`middleware/security.js`):**
```javascript
res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.ethiroli.com wss://socket.ethiroli.com; frame-ancestors 'none';");
res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
res.setHeader('X-DNS-Prefetch-Control', 'off');
```
- **CSP must be portal-aware:** Vendor portal may need additional `connect-src` for external job-board APIs.

**Middleware Chain (Express):**
```
requestId
  → requestLogger
  → securityHeaders
  → cors (portal-aware origin allowlist)
  → cookieParser (robust, handling encoded values)
  → bodyParser (10mb limit)
  → apiLimiter (global 100/min)
  → csrfProtection (Origin/Referer + custom header)
  → tenantResolver
  → authenticate
  → requirePortal(allowedPortals)
  → requireRole(...allowedRoles)
  → requirePermission(...perms)
  → controller
```

### 3.8 Audit Logging Requirements

**Required Audit Events for Decoupled Auth:**

| Event | Required Fields |
|---|---|
| `PORTAL_LOGIN` | `portal_id`, `user_id`, `role`, `auth_method`, `ip_address`, `user_agent`, `session_id`, `mfa_verified`, `outcome`, `failure_reason` |
| `PORTAL_LOGOUT` | `portal_id`, `user_id`, `session_id`, `ip_address` |
| `SESSION_CREATED` | `session_id`, `user_id`, `portal_id`, `ip_address`, `user_agent`, `expires_at` |
| `SESSION_REVOKED` | `session_id`, `user_id`, `portal_id`, `reason` |
| `OAUTH_AUTH_START` | `portal_id`, `user_id` (if known), `provider`, `client_id`, `redirect_uri`, `state` |
| `OAUTH_CALLBACK` | `portal_id`, `provider`, `client_id`, `outcome`, `error` |
| `MFA_CHALLENGE` | `user_id`, `portal_id`, `method`, `outcome`, `ip_address` |
| `RBAC_DENIED` | `user_id`, `portal_id`, `required_role`, `actual_role`, `endpoint`, `method` |
| `PORTAL_SWITCH` | `user_id`, `from_portal`, `to_portal`, `session_id`, `outcome` |

**Log Integrity:**
- **Immutability:** `audit_logs` table must deny UPDATE/DELETE at the database level. Use triggers or application-level enforcement.
- **Retention:** Retain logs for 7 years for compliance (GDPR, SOC 2).
- **Tamper evidence:** Chain logs via hash pointers (Merkle tree style) or write to append-only storage.
- **Real-time alerting:** Alert on `RBAC_DENIED` spikes (brute-force), `MFA_CHALLENGE` failures, and cross-portal `PORTAL_SWITCH` anomalies.

---

## 4. Implementation Best Practices

### 4.1 Exact Directory Structure

#### Frontend (`frontend/src/`)

```
src/
├── App.jsx
├── auth/
│   ├── components/
│   │   └── SharedLoginForm.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── AdminLoginPage.jsx
│   │   ├── VendorLoginPage.jsx
│   │   ├── ClientLoginPage.jsx
│   │   └── Auth.module.css
│   └── index.js
├── common/
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── TenantContext.jsx
│   │   └── SocketContext.jsx
│   ├── components/
│   │   ├── PrivateRoute/
│   │   ├── RoleGuard/
│   │   ├── RouteGuard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── guards/
│   │   └── withRoleGuard.jsx
│   └── utils/
│       ├── permissions.js
│       └── validators.js
├── modules/
│   └── auth/
│       ├── api/
│       │   ├── authApi.js
│       │   └── roleAuthApi.js
│       └── slices/
│           └── authSlice.js
├── services/
│   └── api/
│       ├── axiosInstance.js
│       └── roleAxiosInstances.js
├── roles/
│   ├── admin/
│   │   ├── index.js
│   │   ├── pages/
│   │   └── components/
│   ├── vendor/
│   │   ├── index.js
│   │   ├── pages/
│   │   └── components/
│   ├── client/
│   │   ├── index.js
│   │   ├── pages/
│   │   └── components/
│   └── public/
│       ├── index.js
│       ├── pages/
│       └── components/
├── store/
│   └── slices/
│       └── authSlice.js
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   └── ...
├── routes.js
└── main.jsx
```

#### Backend (`backend/src/`)

```
src/
├── app.js
├── server.js
├── config/
│   ├── constants.js
│   ├── database.js
│   ├── logger.js
│   ├── encryption.js
│   └── jwt.js
├── middleware/
│   ├── auth.js
│   ├── rbac.js
│   ├── tenantResolver.js
│   ├── rateLimiter.js
│   ├── csrf.js
│   ├── security.js
│   ├── validation.js
│   ├── validationSchemas.js
│   ├── errorHandler.js
│   └── requestId.js
├── strategies/
│   ├── localStrategy.js
│   ├── oauth2Strategy.js
│   ├── ssoStrategy.js
│   └── mfaStrategy.js
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   ├── roleAuthRoutes.js
│   ├── admin/
│   │   ├── adminRoutes.js
│   │   └── authRoutes.js
│   ├── client/
│   │   ├── clientRoutes.js
│   │   └── authRoutes.js
│   ├── vendor/
│   │   ├── vendorRoutes.js
│   │   └── authRoutes.js
│   └── ...
├── controllers/
│   ├── authController.js
│   ├── roleAuthController.js
│   ├── admin/
│   │   └── authController.js
│   ├── client/
│   │   └── authController.js
│   └── ...
├── models/
│   ├── User.js
│   ├── Session.js
│   ├── Tenant.js
│   ├── TenantUser.js
│   ├── AuthProvider.js
│   ├── Role.js
│   └── ...
├── services/
│   ├── authService.js
│   ├── tokenService.js
│   ├── emailService.js
│   ├── smsService.js
│   └── ...
└── utils/
    ├── errors.js
    ├── response.js
    └── validators.js
```

### 4.2 Shared Login Form Component

```jsx
// src/auth/components/SharedLoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../common/contexts/AuthContext';
import { getPortalDefaultRoute } from '../../common/utils/roleRouting';
import Input from '../../common/components/Input/Input';
import Button from '../../common/components/Button/Button';
import styles from '../pages/Auth.module.css';

export default function SharedLoginForm({ role, portalLabel, logoText }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (role && loggedUser.role !== role) {
        setError(`This portal is for ${portalLabel} only.`);
        return;
      }
      const redirectPath = location.state?.from?.pathname || getPortalDefaultRoute(loggedUser.role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h2>{logoText || 'ETHIROLI'}</h2>
          <p>{portalLabel ? `${portalLabel} Portal` : 'Login to your account'}</p>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="primary" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

### 4.3 Session/Cookie Configuration Per Role

```javascript
// src/config/cookieConfig.js
export const COOKIE_CONFIG = {
  shared: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  },
  admin: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/app/admin',
    maxAge: 24 * 60 * 60 * 1000,
  },
  superAdmin: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/app/super-admin',
    maxAge: 4 * 60 * 60 * 1000,
  },
  vendor: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/vendor',
    maxAge: 24 * 60 * 60 * 1000,
  },
  client: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/client',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
};
```

### 4.4 Configuration-Based Approach for Adding New Roles

**Step 1:** Add Role to Constants (`backend/src/config/constants.js` and `frontend/src/common/utils/roleRouting.js`).

**Step 2:** Add Role to RBAC Permissions.

**Step 3:** Create Backend Route + Controller Skeleton:
```bash
mkdir -p backend/src/routes/vendor
mkdir -p backend/src/controllers/vendor
touch backend/src/routes/vendor/authRoutes.js
touch backend/src/routes/vendor/vendorRoutes.js
touch backend/src/controllers/vendor/authController.js
```

**Step 4:** Create Frontend Role Directory:
```bash
mkdir -p frontend/src/roles/vendor/pages
mkdir -p frontend/src/roles/vendor/components
touch frontend/src/roles/vendor/index.js
```

**Step 5:** Register Routes in `backend/src/routes/index.js`.

**Step 6:** Add Frontend Route Entry in `frontend/src/App.jsx`.

**Step 7:** Add Login Page wrapper.

### 4.5 Shared Resources vs Isolated Dependencies

#### Shared (Singleton) Resources

| Resource | Implementation | Notes |
|----------|---------------|-------|
| **Auth Middleware** | Single JWT validation middleware | Token contains `role`, `tenant_id`, `permissions` claims |
| **Database Connection Pool** | Single `db.js` pool | Fix existing duplication (`db.js` vs `config/database.js`) |
| **Redis Cache** | Shared instance with key namespacing | Keys prefixed by tenant ID: `tenant:1:session:*` |
| **Socket.IO Server** | Single server with role rooms | `io.to('role:ADMIN')` broadcasts to all admin connections |
| **Email / SMS Services** | Shared provider pool | Per-tenant provider config encrypted in DB |
| **Elasticsearch Index** | Single index with tenant routing | Documents routed by `tenant_id` |
| **Frontend App Shell** | Single SPA bundle | Shared layout, contexts, routing |
| **API Gateway** | Single ingress point | Routes all role traffic |

#### Isolated / Scoped Resources

| Resource | Isolation Strategy |
|----------|-------------------|
| **User Sessions** | Redis keyspace per tenant: `session:{tenantId}:{sessionId}` |
| **JWT Claims** | `sub`, `role`, `tenant_id`, `permissions[]`, `exp` |
| **Database Queries** | Global ORM scope automatically appends `tenant_id = ?` |
| **Socket.IO Rooms** | Dual-room model: `tenant:{id}:role:{role}` and `user:{id}` |
| **Rate Limiter Keys** | Per-tenant, per-IP, per-route: `ratelimit:{tenant}:{ip}:{route}` |
| **File Storage Paths** | S3 prefix: `tenant-{slug}/users/{userId}/...` |
| **Webhooks** | Tenant-scoped webhook URLs and secrets |
| **White-Label Config** | Per-tenant branding (logo, colors, custom domain) |

### 4.6 Scalability Considerations

#### Horizontal Scaling
- **API Workers:** Stateless Express.js workers behind a load balancer. Scale based on CPU/RAM or request queue depth (Kubernetes HPA).
- **Socket Workers:** Use Redis Adapter for Socket.IO to share rooms across workers.
- **Database:** Read replicas for role-scoped queries; write scaling via connection pool tuning (max 100–200 connections per worker).

#### Database Scaling
- **Vertical:** Upgrade to 32+ vCPU / 64 GB RAM for primary before sharding.
- **Read Replicas:** 2–3 replicas for read-heavy dashboards (finance reports, analytics).
- **Partitioning:** Partition `audit_logs`, `activity_feed`, `communication_logs` by `created_at` (monthly) if tables exceed 10M rows.
- **Archiving:** Move cold data (> 1 year) to object storage; keep hot data in MySQL.

#### Caching Strategy

| Cache Layer | Technology | TTL / Invalidation |
|-------------|-----------|-------------------|
| **Session** | Redis | 24h; invalidate on logout/password change |
| **Role Permissions** | Redis | 1h; invalidate on RBAC update |
| **Tenant Config** | Redis | 30m; invalidate on settings change |
| **Static Assets** | CDN (Cloudflare) | 1y (immutable hashes) |
| **Search Index** | Elasticsearch | Real-time via change-data-capture or app-layer indexing |

#### Tenant Growth Model

```
Phase 1 (MVP): 1 tenant, 10 roles → Single DB, no tenant isolation needed.
Phase 2 (Multi-tenant): 10–100 tenants → Shared DB, shared schema, tenant_id scoping.
Phase 3 (Scale): 100–10,000 tenants → Add read replicas, connection pooler (ProxySQL).
Phase 4 (Enterprise): 10,000+ tenants → Schema-per-tenant option for top-tier customers,
                                  sharded by tenant_id, dedicated read replicas.
```

---

## 5. Summary & Decision Matrix

| Decision | Choice | Reason |
|----------|--------|--------|
| **Multi-tenant isolation** | Shared DB + shared schema + `tenant_id` discriminator | Pragmatic for SaaS; enables per-tenant branding and data segregation without operational overhead |
| **Auth mechanism** | JWT (access 15m) + refresh tokens (7d, Redis) + optional OAuth2/OIDC + MFA | Stateless API scalability, supports both local and enterprise SSO |
| **Role URLs** | `/login/{role}` → lazy-loaded role login page | Single SPA bundle, role-aware routing, easy to extend |
| **Infrastructure** | Kubernetes + NGINX Ingress + Redis + MySQL + Elasticsearch | Production-grade, horizontally scalable, battle-tested stack |
| **Frontend** | React 19 + Vite + Redux Toolkit + React Router | Existing codebase alignment, strong ecosystem for auth forms |
| **Cookie scoping** | Per-portal `Domain` and `Path` attributes | Prevents cross-portal token leakage |
| **Session binding** | `portal_id` column in sessions table | Enforces one session per portal per user |
| **Rate limiting** | Distributed Redis-based with portal-aware keys | Consistent limits across cluster, per-portal isolation |

---

*Document generated by multi-agent workflow: Lead Architect, Security Specialist, Senior Full-Stack Developer.*
