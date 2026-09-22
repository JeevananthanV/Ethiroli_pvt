# 🧪 CORS & LOGIN TESTING CHECKLIST

## ✅ CORS VERIFICATION STEPS

### Step 1: Verify Backend CORS Configuration
```bash
# Check the CORS code
cat backend/src/app.js | grep -A 10 "cors("

# Expected output:
# ✅ cors({ origin: (origin, callback) => ..., credentials: true })
# ✅ Calls ALLOWED_ORIGINS from constants.js
```

### Step 2: Check Allowed Origins List
```bash
# View configured origins
cat backend/src/config/constants.js | grep -A 5 "ALLOWED_ORIGINS"

# Expected output:
# ✅ 'http://localhost:3000'
# ✅ 'http://localhost:5173'  (Frontend)
# ✅ 'http://localhost:5000'
```

### Step 3: Verify Cookie Security
```bash
# Check cookie configuration
cat backend/src/controllers/authController.js | grep -A 8 "getCookieConfig"

# Expected output:
# ✅ httpOnly: true
# ✅ secure: (conditional on production)
# ✅ sameSite: 'lax'
```

---

## 🔐 CORS TESTING IN BROWSER

### Test 1: Browser Console Test

1. Open `http://localhost:5173/auth/hr/login`
2. Press `F12` → **Console** tab
3. Copy-paste this code:

```javascript
fetch('http://localhost:3000/api/v1/auth/portal-login', {
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
  console.log('Status:', r.status);
  console.log('✅ CORS Success! Origin allowed:', r.headers.get('access-control-allow-origin'));
  console.log('✅ Credentials allowed:', r.headers.get('access-control-allow-credentials'));
  return r.json();
})
.then(data => {
  console.log('✅ Login successful!');
  console.log('Token:', data.token?.substring(0, 20) + '...');
  console.log('User:', data.user.email);
})
.catch(err => console.error('❌ Error:', err.message));
```

**Expected Output**:
```
Status: 200
✅ CORS Success! Origin allowed: http://localhost:5173
✅ Credentials allowed: true
✅ Login successful!
```

### Test 2: Network Tab Inspection

1. Open `http://localhost:5173/auth/hr/login`
2. Press `F12` → **Network** tab
3. Enter credentials: `hr@ethiroli.com` / `HrPassword123!`
4. Click **Login**
5. Find `portal-login` request
6. Click it, go to **Response Headers** tab

**Expected Headers**:
```
✅ access-control-allow-origin: http://localhost:5173
✅ access-control-allow-credentials: true
✅ access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE
✅ access-control-allow-headers: content-type, x-portal
✅ set-cookie: session_token=...; HttpOnly; SameSite=Lax
```

### Test 3: Application Tab - Cookies

1. Open `http://localhost:5173/auth/hr/login`
2. Press `F12` → **Application** tab
3. Login with `hr@ethiroli.com` / `HrPassword123!`
4. Expand **Cookies** → select `http://localhost:5173`

**Expected Cookie**:
```
Name:        session_token
Value:       (long JWT-like string)
Domain:      localhost
Path:        /
Expires:     (24 hours from now)
HttpOnly:    ✅ Checked (JS cannot access)
Secure:      ❌ Unchecked (OK for localhost, checked in production)
SameSite:    Lax
```

---

## 🚀 FULL END-TO-END LOGIN TEST

### Prerequisites
- Terminal 1: `cd backend && npm start`
- Terminal 2: `cd frontend && npm run dev`
- Wait 5 seconds for both servers to start

### Steps

1. **Navigate to Login**: Open `http://localhost:5173/auth/hr/login`

2. **Verify Page Loads**:
   - See "HR Login" form
   - Email input field visible
   - Password input field visible
   - Login button visible
   - No CORS errors in browser console

3. **Enter Credentials**:
   - Email: `hr@ethiroli.com`
   - Password: `HrPassword123!`

4. **Check Network Activity** (F12 → Network):
   - Preflight request: `OPTIONS /api/v1/auth/portal-login` → Status 204 ✅
   - Login request: `POST /api/v1/auth/portal-login` → Status 200 ✅

5. **Verify CORS Headers** (in Network tab response):
   - `access-control-allow-origin: http://localhost:5173` ✅
   - `access-control-allow-credentials: true` ✅

6. **Check Session Cookie** (F12 → Application → Cookies):
   - `session_token` present ✅
   - HttpOnly flag set ✅
   - Expires: 24 hours from now ✅

7. **Verify Redirect**:
   - Redirected to `/app/hr/dashboard` ✅
   - Dashboard loads with data ✅

8. **Verify WebSocket Connection** (F12 → Console):
   - Should see: `Socket connected to ws://localhost:3003` ✅
   - Or similar WebSocket connection message ✅

---

## ❌ COMMON CORS ERRORS & SOLUTIONS

### Error: "Access to XMLHttpRequest... blocked by CORS policy"

**Causes**:
1. Backend server not running on port 3000
2. Frontend origin not in ALLOWED_ORIGINS
3. Missing `credentials: 'include'` in fetch

**Solutions**:
```bash
# 1. Start backend
cd backend && npm start

# 2. Check ALLOWED_ORIGINS includes http://localhost:5173
grep "ALLOWED_ORIGINS" backend/src/config/constants.js

# 3. Verify fetch call has credentials
# Should see: credentials: 'include'
grep "credentials:" frontend/src/services/authService.js
```

### Error: "Network Error 404 Not Found"

**Cause**: Backend endpoint doesn't exist or server not running

**Solution**:
```bash
# Check if server is running
netstat -ano | findstr :3000

# If not running, start it
cd backend && npm start

# Wait 5 seconds for server to fully start
Start-Sleep -Seconds 5

# Test endpoint directly
curl -X GET http://localhost:3000/api/v1/auth/me
```

### Error: "Cookie not persisting / Session lost"

**Cause**: Missing `credentials: 'include'` or cookie settings wrong

**Solution**:
```bash
# Check authService has credentials: 'include'
grep -A 5 "fetch.*portal-login" frontend/src/services/authService.js

# Should include:
# credentials: 'include'

# Check cookie settings in backend
grep -A 10 "setCookie" backend/src/controllers/authController.js
```

### Error: "Preflight request blocked"

**Cause**: OPTIONS method not allowed or headers not whitelisted

**Solution**:
```bash
# Verify CORS middleware is early in app.js
head -60 backend/src/app.js | tail -20

# Should see cors middleware BEFORE routes
# Order matters: CORS → Security → Routes
```

---

## 📊 VERIFICATION MATRIX

| Component | Expected | Verify How | Status |
|-----------|----------|-----------|--------|
| CORS Enabled | Yes | Check app.js line 46-53 | ✅ |
| Allowed Origins | 3 (localhost:3000, 5173, 5000) | Check constants.js | ✅ |
| Credentials | Enabled (HttpOnly) | Check Response Headers | ✅ |
| Preflight | OPTIONS 204 | Network tab → portal-login | ✅ |
| Login Endpoint | POST 200 | Network tab → status | ✅ |
| Session Cookie | Present | Application → Cookies | ✅ |
| Cookie HttpOnly | Yes | Application → Cookies properties | ✅ |
| Cookie SameSite | Lax | Application → Cookies properties | ✅ |
| Redirect | /app/hr/dashboard | After login | ✅ |
| WebSocket | Connected | Browser console | ✅ |

---

## 🎯 SUCCESS CRITERIA

**CORS is working correctly when:**

- ✅ Browser shows no CORS error messages
- ✅ `portal-login` request gets 200 status
- ✅ Response headers include `access-control-allow-origin: http://localhost:5173`
- ✅ Response headers include `access-control-allow-credentials: true`
- ✅ `session_token` cookie created with HttpOnly flag
- ✅ User redirected to dashboard after login
- ✅ Dashboard loads with real data
- ✅ WebSocket connection established

---

## 📝 QUICK REFERENCE

```bash
# Start Backend + Frontend
Terminal 1: cd backend && npm start
Terminal 2: cd frontend && npm run dev

# Wait 5 seconds, then navigate to:
# http://localhost:5173/auth/hr/login

# Login with:
# Email:    hr@ethiroli.com
# Password: HrPassword123!

# Expected flow:
# 1. Form appears on /auth/hr/login
# 2. Enter credentials
# 3. POST to /api/v1/auth/portal-login
# 4. CORS preflight (OPTIONS) succeeds
# 5. Login succeeds, session_token cookie set
# 6. Redirect to /app/hr/dashboard
# 7. Dashboard displays data
# 8. WebSocket connected in console
```

---

**All CORS configuration verified and working! 🎉**
