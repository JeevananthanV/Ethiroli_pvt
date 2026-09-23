# Ethiroli — React + Vite Frontend

This project is the frontend of the Ethiroli SaaS platform — a React 19 admin portal and public marketing site powered by Vite, Redux Toolkit, React Router DOM, Axios, Socket.IO Client, and Framer Motion.

## Project Structure

```
frontend/
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
├── tutor.html
├── super-admin.html
├── student.html
├── hr.html
├── finance.html
├── employee.html
├── pm.html
├── reception.html
├── sales.html
├── intern.html
├── admin.html
├── .env
├── .env.example
├── .env.production
├── package-lock.json
├── public/
│   ├── vite.svg
│   ├── sw.js
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── firebase-messaging-sw.js
│   ├── .htaccess
│   └── assets/
│       └── images/
│           ├── team/
│           └── ...
├── scripts/
│   ├── write-components.js
│   └── write-slices.js
├── tests/
│   ├── setup.js
│   └── roleRouting.test.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── admin.jsx
    ├── AdminApp.jsx
    ├── AdminApp.complex.jsx
    ├── hr.jsx
    ├── InternApp.jsx
    ├── routes.js
    ├── socket.js
    ├── admin/
    ├── app/
    │   └── marketing/
    │       └── main.jsx
    ├── assets/
    │   └── react.svg
    ├── auth/
    ├── common/
    ├── components/
    ├── hooks/
    │   └── usePushNotification.js
    ├── modules/
    ├── pages/
    ├── roles/
    ├── services/
    ├── store/
    ├── styles/
    │   ├── global.css
    │   ├── premium-motion.css
    │   ├── admin.css
    │   ├── jcidigitalskills.css
    │   ├── home-hero.css
    │   ├── EthiroliStyles.css
    │   ├── career-apply.css
    │   └── contact-page.css
    └── utils/
        ├── registerServiceWorker.js
        └── errorHandler.js
```

## Features

- **Multi-Page Application**: Main site (`index.html`) + Admin portal (`admin.html`) + role-specific HTML entry points
- **11 Role-Scoped Dashboards**: SUPER_ADMIN, ADMIN, HR, TUTOR, PROJECT_MANAGER, FINANCE, SALES, RECEPTION, EMPLOYEE, STUDENT, INTERN
- **26+ Feature Modules**: monitoring, predictive, pms, finance, hrms, interviews, lms, communication, automation, calendar, marketplace, multi-tenant, gamification, integrations, feed, reporting, crm, jobs, jobsBoard, settings, developer-portal, projects, users, certificates, approvals, audit, mindmap
- **Redux Toolkit State Management**: 50+ slices under `src/store/`
- **API Layer**: 70+ API clients under `src/services/api/`
- **Real-Time**: Socket.IO client integration
- **Testing**: Vitest with jsdom, role-based routing tests

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Setup

1. Navigate to the frontend directory:
    ```powershell
    cd J:\eithiroli\ethiroli_react\frontend
    ```

2. Install dependencies:
    ```powershell
    npm install
    ```

3. Copy environment file:
    ```powershell
    Copy-Item .env.example .env
    ```

4. Start the development server:
    ```powershell
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Expanding the ESLint Configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
