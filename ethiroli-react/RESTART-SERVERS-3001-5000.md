# 🚀 RESTART SERVERS (PORTS 3001 + 5000)

## ⚠️ CRITICAL: Your backend needs to RELOAD the new CORS configuration!

The CORS fix (adding localhost:3001) won't take effect until you restart the backend.

---

## 🔴 STEP 1: Kill All Node Processes

```powershell
# Kill all node processes (clean slate)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "✅ All node processes killed" -ForegroundColor Green

# Wait 2 seconds
Start-Sleep -Seconds 2

# Verify they're gone
Get-Process node -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count
# Should show: 0
```

---

## 🟢 STEP 2: Start Backend (Port 5000)

**Terminal 1 (Backend):**
```powershell
cd j:\eithiroli\ethiroli_react\ethiroli-react\backend
npm start
```

**Wait for these messages** (30-45 seconds):
```
> backend@1.0.0 start
> node src/server.js

✅ Express server running on port 5000
✅ Database connected
✅ Ready to accept requests
```

**⚠️ DO NOT PROCEED until you see these messages!**

---

## 🟢 STEP 3: Start Frontend (Port 3001)

**Terminal 2 (Frontend):**
```powershell
cd j:\eithiroli\ethiroli_react\ethiroli-react\frontend
npm run dev
```

**Wait for these messages**:
```
  VITE v7.3.6  ready in 739 ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

---

## 🧪 STEP 4: Test Login (Check for 401 Error)

1. **Open Browser**: http://localhost:3001/auth/hr/login
2. **Press F12** to open DevTools
3. **Go to Network tab**
4. **Clear all previous requests** (Ctrl+Shift+L)
5. **Enter Credentials**:
   - Email: `hr@ethiroli.com`
   - Password: `HrPassword123!`
6. **Click Login button**

---

## 🔍 STEP 5: Inspect Network Requests

Look in DevTools Network tab for:

### Request 1: OPTIONS (Preflight)
```
URL: http://localhost:5000/api/v1/auth/portal-login
Method: OPTIONS
Status: 204 No Content ✅

Response Headers (should include):
  access-control-allow-origin: http://localhost:3001 ✅
  access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE
  access-control-allow-headers: content-type, x-portal
```

**If you see 403 or No Access-Control header:**
- ❌ Backend CORS not reloaded
- 🔧 Go back and restart backend!

### Request 2: POST (Actual Login)
```
URL: http://localhost:5000/api/v1/auth/portal-login
Method: POST
Status: 200 OK ✅

Response Body (should include):
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "hr@ethiroli.com", "role": "HR", ... },
    "token": "abc123def456...",  ← THIS IS THE TOKEN
    "socket_token": "abc123def456...",
    "activePortal": "hr"
  },
  "message": "Login successful"
}

Response Headers (should include):
  set-cookie: session_token=...; HttpOnly; SameSite=Lax
```

**If you see 401 in the Login POST request:**
- ❌ User not found or password wrong
- 🔧 Use correct credentials: hr@ethiroli.com / HrPassword123!

---

## 📍 STEP 6: Check localStorage After Login

1. Stay in DevTools (F12)
2. Go to **Application** tab
3. Click **Storage** → **Local Storage** → http://localhost:3001
4. Look for:
   ```
   auth_token = "abc123def456..."  ← Should be here
   token = "abc123def456..."       ← Should be here
   user = {"id":"...","email":"hr@ethiroli.com",...}
   active_role = "HR"
   ```

**If token is missing:**
- ❌ Login response wasn't parsed correctly
- 🔧 Check console for JavaScript errors
- 🔧 Verify response structure in Network tab (see Request 2 above)

---

## 📊 STEP 7: Check Cookie After Login

1. Stay in DevTools (F12)
2. Go to **Application** tab
3. Click **Cookies** → **http://localhost:3001**
4. Look for:
   ```
   session_token = "abc123def456..."  ← Should be here
   ✅ HttpOnly = checked
   ✅ SameSite = Lax
   ```

**If session_token is missing:**
- ❌ CORS not allowing credentials
- 🔧 Verify CORS headers in Network tab (Request 1)
- 🔧 Restart backend

---

## 🔄 STEP 8: Check for 401 Error on getMe()

After successful login, the app should call `/auth/me`:

```
URL: http://localhost:5000/api/v1/auth/me
Method: GET
Status: 200 OK ✅  (NOT 401!)

Response should be:
{
  "success": true,
  "data": { "id": "...", "email": "hr@ethiroli.com", "role": "HR", ... },
  "message": "User retrieved"
}
```

**If you see 401 on getMe():**
- Check if session_token cookie was sent (see Request Headers)
- Check if auth_token is in localStorage
- Check DevTools Console for JavaScript errors

---

## 🎯 SUCCESS = All Network Requests Return 200

```
✅ OPTIONS /auth/portal-login       → 204 No Content (CORS allowed)
✅ POST /auth/portal-login          → 200 OK (logged in, token returned)
✅ GET /auth/me                     → 200 OK (user profile fetched)
✅ GET /hr/dashboard/metrics        → 200 OK (dashboard data loaded)
```

---

## ❌ TROUBLESHOOTING 401 ERROR

If you still see 401 errors, use this diagnostic script in DevTools Console:

```javascript
console.log('=== CORS & AUTH DIAGNOSTIC ===');

// Check 1: localStorage
const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
console.log('1. localStorage token:', token ? '✅ Present' : '❌ MISSING');

// Check 2: Cookies
const sessionToken = document.cookie.split('; ')
  .find(row => row.startsWith('session_token='))
  ?.split('=')[1];
console.log('2. session_token cookie:', sessionToken ? '✅ Present' : '❌ MISSING');

// Check 3: Try login
console.log('3. Testing login endpoint...');
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
  console.log('   Status:', r.status);
  console.log('   CORS Headers:', {
    origin: r.headers.get('access-control-allow-origin'),
    credentials: r.headers.get('access-control-allow-credentials')
  });
  return r.json();
})
.then(data => {
  console.log('   Response:', data);
  if (data.data?.token) {
    console.log('✅ Token received:', data.data.token.substring(0, 20) + '...');
    localStorage.setItem('auth_token', data.data.token);
    console.log('✅ Token saved to localStorage');
  } else {
    console.error('❌ No token in response!');
  }
})
.catch(err => console.error('❌ Error:', err));

// Check 4: Try getMe
console.log('4. Testing getMe endpoint...');
setTimeout(() => {
  const authToken = localStorage.getItem('auth_token');
  fetch('http://localhost:5000/api/v1/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    },
    credentials: 'include'
  })
  .then(r => {
    console.log('   Status:', r.status);
    if (r.status === 401) {
      console.error('❌ 401 Unauthorized - Token not recognized');
    }
    return r.json();
  })
  .then(data => console.log('   Response:', data))
  .catch(err => console.error('   Error:', err));
}, 1000);
```

---

## 📝 QUICK CHECKLIST

- [ ] Backend running on port 5000 (npm start in backend folder)
- [ ] Frontend running on port 3001 (npm run dev in frontend folder)
- [ ] Both show "ready" messages in terminal
- [ ] Frontend loads at http://localhost:3001/auth/hr/login
- [ ] F12 Network tab shows OPTIONS request with 204 status
- [ ] F12 Network tab shows POST request with 200 status
- [ ] Response headers include `access-control-allow-origin: http://localhost:3001`
- [ ] Login response includes `{ data: { token: "..." } }`
- [ ] localStorage has `auth_token` after login
- [ ] Cookies has `session_token` after login
- [ ] getMe request returns 200 (not 401)
- [ ] Dashboard loads with data

---

## 🎉 EXPECTED RESULT

After login:
1. ✅ Redirected to /app/hr/dashboard
2. ✅ Dashboard shows employee metrics
3. ✅ No red error messages
4. ✅ WebSocket says "connected"
5. ✅ Real-time updates working

---

**Ready to test? Follow these steps exactly in order!**
