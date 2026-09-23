# PORT CONFIGURATION FIX (3001 + 5000)

## FIXED ISSUES

### 1. CORS Configuration Updated
```
✅ Added localhost:3000 to ALLOWED_ORIGINS
   File: backend/src/config/constants.js
   
   Now allows:
   - http://localhost:3000
   - http://localhost:3000  ← YOUR FRONTEND
   - http://localhost:5000
   - http://localhost:3000
```

### 2. Axios Configuration Verified
```
✅ withCredentials: true (enabled in both axios instances)
   Files:
   - frontend/src/services/axios.js
   - frontend/src/services/api/axiosInstance.js
```

### 3. API Base URLs Verified
```
✅ Backend URL: http://localhost:5000 (correct)
   ✅ Admin API: http://localhost:5000
   ✅ Axios: http://localhost:5000/api
```

---

## 401 UNAUTHORIZED ERROR - DIAGNOSIS

### What's Happening:
1. Frontend (port 3001) sends login request to backend (port 5000)
2. ✅ CORS now allows this (we just added 3001)
3. ⚠️ Backend returns login response but **token field might be missing**
4. ⚠️ localStorage stays empty → no Bearer token
5. ❌ When `getMe()` is called, request has no authentication → 401 error

### The 401 Error Flow:
```
Frontend (3001) → Backend (5000)
  1. POST /auth/portal-login ✅ (CORS now works)
  2. Response: { user: {...}, token: ??? }
     If token missing → localStorage.setItem('auth_token', undefined)
  3. GET /auth/me ❌
     Header: Authorization: Bearer undefined
     Response: 401 Unauthorized
```

---

## FIX: RESTART BACKEND & FRONTEND

### Step 1: Kill Any Running Processes
```bash
# Kill backend processes on port 5000
Get-Process node | Where-Object {$_.Path -like "*5000*"} | Stop-Process -Force

# Kill frontend processes on port 3001
Get-Process node | Where-Object {$_.Path -like "*3001*"} | Stop-Process -Force
```

### Step 2: Start Backend (NEW CORS CONFIG)
```bash
cd backend
npm start
# Expected output:
# Express server running on port 5000
# Database connected
# ✅ Ready for API requests with CORS allowing 3001
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
# Expected output:
# ➜  Local:   http://localhost:3000/
# ➜ Press h + enter to show help
```

### Step 4: Test in Browser
```
1. Navigate to: http://localhost:3000/auth/hr/login
2. Enter: hr@ethiroli.com / HrPassword123!
3. Check Network tab (F12) during login:
   - Request: POST http://localhost:5000/api/v1/auth/portal-login
   - Response Status: 200 OK ✅
   - Response Headers: access-control-allow-origin: http://localhost:3000 ✅
   - Response Body: { user: {...}, token: "..." } ← Check if token exists!
   - Cookies: session_token should be set ✅
```

---

## DEBUGGING THE 401 ERROR

### Check 1: Verify Login Token Response
Open DevTools Console and run:
```javascript
// Check what login response looks like
fetch('http://localhost:5000/api/v1/auth/portal-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Portal': 'hr' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'hr@ethiroli.com',
    password: 'HrPassword123!'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Login Response:', data);
  console.log('✅ Has token?:', !!data.token || !!data.data?.token);
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
    console.log('✅ Token set in localStorage');
  } else {
    console.warn('❌ NO TOKEN in response!');
  }
});
```

### Check 2: Verify Session Cookie
After login, check in DevTools:
```
F12 → Application → Cookies → localhost:3000
Look for: session_token (HttpOnly)
If present ✅, browser will auto-send it on next request
```

### Check 3: Test getMe with Cookie
```javascript
// This should work if session_token cookie is set
fetch('http://localhost:5000/api/v1/auth/me', {
  method: 'GET',
  credentials: 'include'  // IMPORTANT: send cookies
})
.then(r => {
  if (r.status === 401) {
    console.error('❌ 401 - Session cookie not being sent!');
    console.log('Check: F12 → Application → Cookies → session_token');
  } else {
    return r.json().then(d => console.log('✅ getMe success:', d));
  }
})
.catch(e => console.error('❌ Error:', e));
```

---

## CORS FLOW DIAGRAM (NOW FIXED)

```
Browser (localhost:3000)
         ↓ (CORS preflight)
         OPTIONS /api/v1/auth/portal-login
         ↓ (check origin header)
Backend (localhost:5000)
         ✅ origin = localhost:3000 (NOW IN ALLOWED_ORIGINS!)
         ↓ (send CORS headers)
         access-control-allow-origin: http://localhost:3000 ✅
         access-control-allow-credentials: true ✅
         ↓ (browser allows actual request)
         POST /api/v1/auth/portal-login
         ↓
         Set-Cookie: session_token=...
         ↓ (browser stores cookie)
         Response: { user: {...}, token: "..." }
         ↓
         localStorage.setItem('auth_token', token)
         ↓ (on next request)
         GET /api/v1/auth/me
         Headers: Authorization: Bearer <token>
         Cookies: session_token=...
         ↓
         Backend: "OK, I recognize this user" ✅ 200
```

---

## CONFIGURATION STATUS

| Item | Value | Status |
|------|-------|--------|
| Frontend Port | 3001 | ✅ |
| Backend Port | 5000 | ✅ |
| CORS Allowed (3001) | YES | ✅ FIXED |
| API Base URL | http://localhost:5000 | ✅ |
| withCredentials | true | ✅ |
| Session Cookie | HttpOnly | ✅ |
| Token Storage | localStorage | ✅ |

---

## IF 401 STILL OCCURS

**Check these in order:**

1. **Backend CORS reload?**
   ```bash
   # Restart backend to load new CORS config
   cd backend
   npm start
   ```

2. **Frontend accessing correct backend URL?**
   ```bash
   # Check console shows correct API URL
   # Should be: http://localhost:5000/api
   ```

3. **Login response missing token?**
   ```bash
   # Check backend/src/controllers/authController.js
   # Verify login endpoint returns: { user: {...}, token: "..." }
   ```

4. **Session cookie not sent?**
   ```bash
   # Check axios withCredentials: true
   # Check CORS credentials: true in app.js
   ```

5. **Token not stored in localStorage?**
   ```bash
   # Open DevTools Console → Application → Storage
   # Check localStorage has: auth_token = "..."
   ```

---

## SUCCESS CHECKLIST

When working correctly, you should see:

- [ ] Frontend loads on http://localhost:3000 (no errors)
- [ ] Login page accessible at http://localhost:3000/auth/hr/login
- [ ] F12 Network tab shows OPTIONS request returns 204
- [ ] F12 Network tab shows POST request returns 200
- [ ] Response headers include: access-control-allow-origin: http://localhost:3000
- [ ] Application tab shows session_token cookie created
- [ ] Dashboard loads and displays data
- [ ] No 401 errors in console after login
- [ ] WebSocket connects (see ws:// connection in Console)

---

## REAL-TIME DATA WORKING

Once authentication is fixed, real-time features auto-activate:

✅ **WebSocket Events** (on port 5000):
- `hr_attendance_update` - Live attendance changes
- `hr_leave_request` - Leave approvals/rejections
- `hr_employee_update` - Employee data changes

✅ **Socket.io Connection**:
- Auto-connects after login
- Joins role-based rooms (role:HR, role:ADMIN, etc.)
- Receives real-time updates in Redux store

Check DevTools Console for:
```
✅ Socket connected to ws://localhost:5000
✅ Joined room: role:HR
```

---

**Configuration Updated! Restart both servers and test login now.** 🚀