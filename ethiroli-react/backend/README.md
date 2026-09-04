# Career Backend (Node.js + MySQL)

## 1) Install
```bash
cd backend
npm install
```

## 2) Configure env
```bash
cp .env.example .env
```
Update `.env` with your MySQL credentials.

## 3) Create table
Run `schema.sql` in your MySQL server.

## 4) Start server
```bash
npm run dev
```
API runs at `http://localhost:5000` by default.

## Endpoints
- `GET /api/health`
- `POST /api/applications`
- `POST /api/contact-messages`

### POST body
```json
{
  "fullName": "Jeeva",
  "email": "jeeva@example.com",
  "phone": "+91-9999999999",
  "role": "Web Developer Intern",
  "portfolioUrl": "https://portfolio.example.com",
  "experienceLevel": "Intermediate",
  "message": "I am interested in this role."
}
```

### Contact POST body
```json
{
  "name": "Jeeva",
  "phone": "+91-9999999999",
  "email": "jeeva@example.com",
  "subject": "Need branding support",
  "message": "Please contact me with pricing details."
}
```
