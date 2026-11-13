# Ethiroli Pvt Ltd — Setup & Operations Guide

Welcome to the **Ethiroli Pvt Ltd Enterprise Educational & Media Platform** setup guide. This system features a React 19 + Vite multi-portal frontend and an Express + Socket.IO + MySQL backend.

- **GitHub Repository**: [https://github.com/JeevananthanV/Ethiroli_pvt](https://github.com/JeevananthanV/Ethiroli_pvt)
- **Author**: Jeevananthan V

---

## 📋 System Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MySQL**: 8.0 or higher

---

## 📥 1. Clone the Repository

```bash
git clone https://github.com/JeevananthanV/Ethiroli_pvt.git
cd Ethiroli_pvt
```

---

## 🗄️ 2. MySQL Database Setup

1. Start your MySQL service.
2. Create and import schema:

```sql
CREATE DATABASE IF NOT EXISTS ethiroli_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import schema from `backend/schema.sql`:
```bash
mysql -u root -p ethiroli_db < backend/schema.sql
```

---

## ⚙️ 3. Environment Variables Configuration

### Backend Environment (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ethiroli_db
JWT_SECRET=ethiroli_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:3000
```

---

## 📦 4. Install Dependencies

```bash
# 1. Backend dependencies
cd backend
npm install

# 2. Frontend dependencies
cd ../frontend
npm install
cd ..
```

---

## 🚀 5. Running Locally

### Terminal 1: Backend Server (Port 5000)

```bash
cd backend
npm start
```
Starts Express API and Socket.IO real-time engine at: `http://localhost:5000`

### Terminal 2: Frontend Multi-Portal (Port 3000)

```bash
cd frontend
npm run dev -- --port 3000
```
Open `http://localhost:3000` in your browser.

---

## 🔐 6. Portal Entry Points

- **Public Site**: `http://localhost:3000/index.html`
- **Admin Portal**: `http://localhost:3000/admin.html`
- **Tutor Portal**: `http://localhost:3000/tutor.html`
- **Student Portal**: `http://localhost:3000/student.html`
- **Super Admin**: `http://localhost:3000/super-admin.html`
