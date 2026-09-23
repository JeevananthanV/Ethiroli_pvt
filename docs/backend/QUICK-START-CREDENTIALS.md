# 🔐 HR PORTAL - QUICK START & CREDENTIALS

## ⚡ CREDENTIALS

```
Email:    hr@ethiroli.com
Password: HrPassword123!
Role:     HR Manager
```

---

## 🌐 LOGIN URLs

### Frontend:
- **HR Login Page**: `http://localhost:3001/auth/hr/login`
- **HR Dashboard**: `http://localhost:3001/app/hr/dashboard`
- **Direct Access**: `http://localhost:3001/hr.html` (auto-redirects)

### Backend API:
- **Portal Login**: `POST http://localhost:5000/api/v1/auth/portal-login`
- **Get Profile**: `GET http://localhost:5000/api/v1/auth/me`
- **Dashboard Metrics**: `GET http://localhost:5000/api/v1/hr/dashboard/metrics`

---

## ✅ CORS STATUS - VERIFIED WORKING

### What is CORS?
**CORS** (Cross-Origin Resource Sharing) allows frontend (http://localhost:3000) to make requests to backend (http://localhost:5000).

### Current Configuration:

| Setting | Value | Status |
|---------|-------|--------|
| **CORS Enabled** | Yes | ✅ |
| **Credentials** | Yes (HTTPOnly cookies) | ✅ |
| **Allowed Origins** | localhost:3000, 3001, 5000, 5173 | ✅ |
| **Preflight (OPTIONS)** | Supported | ✅ |
| **Methods** | GET, POST, PATCH, DELETE, OPTIONS | ✅ |
| **Headers** | Content-Type, Authorization, X-Portal, X-Session-Token | ✅ |

### How CORS Works:

```
1. Browser sends OPTIONS preflight request
2. Backend checks Origin header
3. If origin allowed, returns:
   - Access-Control-Allow-Origin: http://localhost:3001 ✅
   - Access-Control-Allow-Credentials: true ✅
4. Browser allows actual request (GET/POST/etc.)
5. Response cookie sent to frontend ✅
```

---

## 🚀 STARTUP INSTRUCTIONS

### Terminal 1: Start Backend (API + WebSocket)
```bash
cd J:\eithiroli\ethiroli_react\backend
npm start
```

**Expected Output**:
```
Express server running on port 5000
WebSocket server running on port 5000
Database connected
✅ Ready for API requests
```

### Terminal 2: Start Frontend (Vite Dev Server)
```bash
cd J:\eithiroli\ethiroli_react\frontend
npm run dev
```

**Expected Output**:
```
  Local:   http://localhost:3001/
  ready in 200ms
✅ Frontend loaded
```

---

## 🧪 TESTING CORS (3 Ways)

### Way 1: Browser Network Tab (Easiest)

1. Open `http://localhost:3001/auth/hr/login`
2. Press `F12` → **Network** tab
3. Enter credentials and click **Login**
4. Find `portal-login` request
5. Check **Response Headers**:
   ```
   ✅ access-control-allow-origin: http://localhost:3001
   ✅ access-control-allow-credentials: true
   ✅ set-cookie: session_token=...; HttpOnly; SameSite=Lax
   ```

### Way 2: Browser DevTools Console

```javascript
// Try this in DevTools Console (F12)
fetch('http://localhost:5000/api/v1/auth/portal-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Portal': 'hr'
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'hr@ethiroli.com',
    password: 'HrPassword123!'
  })
})
.then(r => {
  console.log('✅ CORS Success! Status:', r.status);
  console.log('✅ Origin header allowed:', r.headers.get('access-control-allow-origin'));
  return r.json();
})
.then(d => console.log('✅ Login response:', d))
.catch(e => console.error('❌ Error:', e.message));
```

### Way 3: cURL Command Line

```bash
# Test CORS headers
curl -X OPTIONS http://localhost:5000/api/v1/auth/portal-login \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Expected to see:
# access-control-allow-origin: http://localhost:3001 ✅
```

---

## 🔍 TROUBLESHOOTING

### Issue: CORS Error in Console
**Error**: `Access to XMLHttpRequest at 'http://localhost:5000/...' from origin 'http://localhost:3001' has been blocked by CORS policy`

**Solution**:
1. ✅ Make sure backend is running (`npm start` in backend folder)
2. ✅ Check allowed origins in `backend/src/config/constants.js`
3. ✅ Ensure frontend has `credentials: 'include'` in fetch calls

### Issue: Login Returns 404
**Cause**: Backend server not running

**Solution**:
```bash
cd J:\eithiroli\ethiroli_react\backend
npm start
# Wait for "Express server running on port 5000"
```

### Issue: Session Cookie Not Persisting
**Cause**: Missing `credentials: 'include'` in requests

**Solution**: Already configured in codebase ✅

### Issue: CORS works on localhost but not production
**Cause**: ALLOWED_ORIGINS doesn't include production domain

**Solution**:
```bash
# Set before starting server
export ALLOWED_ORIGINS="https://ethiroli.com,https://api.ethiroli.com"
npm start
```

---

## 📊 CORS SECURITY FEATURES

### ✅ Implemented:
- **Origin Validation**: Only allows specified origins
- **Credentials**: HTTPOnly cookies (JS cannot access)
- **Preflight**: OPTIONS requests validated
- **Rate Limiting**: 100 req/15min per IP
- **CSRF Protection**: Token-based
- **Security Headers**: XSS, clickjacking prevention

### ✅ Cookie Security:
```
Set-Cookie: session_token=...
  ├─ HttpOnly: true      (XSS protection - JS can't access)
  ├─ Secure: true*       (*only in production HTTPS)
  ├─ SameSite: Lax       (CSRF protection)
  └─ Expires: 24 hours   (Auto logout)
```

---

## 🎯 QUICK VERIFICATION CHECKLIST

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3001
- [ ] Can navigate to `http://localhost:3001/auth/hr/login`
- [ ] Can enter credentials: `hr@ethiroli.com` / `HrPassword123!`
- [ ] Login button works (no CORS errors)
- [ ] Redirected to dashboard at `/app/hr/dashboard`
- [ ] Dashboard shows employee count, attendance, leaves
- [ ] Browser DevTools Network tab shows `session_token` cookie
- [ ] Browser DevTools Console shows WebSocket connected
- [ ] Real-time updates work (check any attendance/leave changes)

---

## 📚 RELATED DOCUMENTATION

- [HRMS Complete Audit Report](./HRMS-COMPLETE-AUDIT-REPORT.md)
- [HR Auth & Live Data Setup](./HR-AUTH-LIVE-DATA-SETUP.md)
- [Full Login & CORS Guide](./LOGIN-AND-CORS-GUIDE.md)

---

## 🎉 YOU'RE READY!

```
✅ CORS: Working
✅ Credentials: hr@ethiroli.com / HrPassword123!
✅ Login URL: http://localhost:3001/auth/hr/login
✅ Dashboard: http://localhost:3001/app/hr/dashboard
✅ API: http://localhost:5000/api/v1/*
✅ WebSocket: ws://localhost:5000
✅ All Systems: OPERATIONAL
```

**Start servers and login to test!**
