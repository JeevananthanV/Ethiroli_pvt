# Ethiroli SaaS Platform — Setup Guide

## Prerequisites

- Node.js >= 18
- MySQL >= 8.0
- npm >= 9

## Repository Structure

```
J:\eithiroli\ethiroli_react\
├── backend\
│   ├── docs\
│   ├── scripts\
│   ├── src\
│   │   ├── config\
│   │   ├── controllers\
│   │   ├── graphql\
│   │   ├── integrations\
│   │   ├── middleware\
│   │   ├── migrations\
│   │   ├── models\
│   │   ├── routes\
│   │   ├── services\
│   │   ├── socket\
│   │   └── utils\
│   └── tests\
├── frontend\
│   ├── scripts\
│   ├── src\
│   │   ├── admin\
│   │   ├── app\
│   │   ├── assets\
│   │   ├── auth\
│   │   ├── common\
│   │   ├── components\
│   │   ├── hooks\
│   │   ├── modules\
│   │   ├── pages\
│   │   ├── roles\
│   │   ├── services\
│   │   ├── store\
│   │   ├── styles\
│   │   └── utils\
│   └── tests\
├── docs\
├── scripts\
├── package.json
└── README.md
```

## Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd J:\eithiroli\ethiroli_react\backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create a `.env` file from `.env.example`:
   ```powershell
   Copy-Item .env.example .env
   ```

4. Update `.env` with your database credentials and secrets:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `SESSION_SECRET` (min 32 chars)
   - `ENCRYPTION_KEY` (min 32 chars)
   - `ALLOWED_ORIGINS` (comma-separated allowed frontend origins)

5. Start MySQL and create the database:
   ```sql
   CREATE DATABASE ethiroli;
   ```

6. Run migrations:
   ```powershell
   npm run migrate
   ```

7. Start the backend server:
   ```powershell
   npm run dev
   ```

   The API will be available at `http://localhost:5000` and Socket.IO at `http://localhost:3003`.

## Frontend Setup (React Admin Portal)

1. Navigate to the frontend directory:
   ```powershell
   cd J:\eithiroli\ethiroli_react\frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```

   The admin portal will be available at `http://localhost:3000`.

## Default Credentials

After running migrations, a default SUPER_ADMIN user is seeded:

- Email: `admin@ethiroli.com`
- Password: `123`

**Change this password immediately in production.**

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend HTTP port | `5000` |
| `SOCKET_PORT` | Socket.IO port | `3003` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_ORIGIN` | Comma-separated frontend origins | `http://localhost:5173,http://localhost:3000,http://localhost:3001` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | MySQL database name | `ethiroli` |
| `SESSION_SECRET` | Session signing secret (min 32 chars) | — |
| `ENCRYPTION_KEY` | AES-256-GCM encryption key (min 32 chars) | — |
| `ALLOWED_ORIGINS` | CORS allowlist | `http://localhost:5173,http://localhost:3000,http://localhost:3001` |
| `SEED_ADMIN_EMAIL` | Default admin email | `admin@ethiroli.com` |
| `SEED_ADMIN_PASSWORD` | Default admin password | `Admin@123#ChangeMe` |

## Running Tests

```powershell
cd J:\eithiroli\ethiroli_react\backend
npm test
```

## Production Build

```powershell
cd J:\eithiroli\ethiroli_react\frontend
npm run build
```

Build output will be in `frontend/dist/`.

## Security Notes

- Always use strong, unique values for `SESSION_SECRET` and `ENCRYPTION_KEY` in production.
- Restrict `ALLOWED_ORIGINS` to your actual frontend domains.
- Change the default admin password immediately after first login.
- Enable HTTPS in production (`secure: true` cookies require it).
