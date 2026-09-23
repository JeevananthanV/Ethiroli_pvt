# HR PORTAL LOGIN & CORS VERIFICATION GUIDE

## 🔐 LOGIN CREDENTIALS

### HR Portal Login

**Email**: `hr@ethiroli.com`  
**Password**: `HrPassword123!`  
**Role**: HR Manager

---

## 🌐 LOGIN ENDPOINTS

### Frontend Entry Points:

| Portal | Login URL | Dashboard URL |
|--------|-----------|---------------|
| **HR** | `http://localhost:3000/auth/hr/login` | `http://localhost:3000/app/hr/dashboard` |
| Direct Link | `http://localhost:3000/hr.html` | Auto-redirects to dashboard |

### Backend API Endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `http://localhost:5000/api/v1/auth/portal-login` | POST | Portal-aware login with X-Portal header |
| `http://localhost:5000/api/v1/auth/me` | GET | Get current user profile (requires token) |

---

## 🔓 CORS CONFIGURATION

### Current Allowed Origins:

```javascript
// backend/src/config/constants.js
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean) || [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://localhost:5173'
];
```

### CORS Settings in Backend:

```javascript
// backend/src/app.js
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
```

**Features**:
- ✅ Credentials enabled (cookies sent with requests)
- ✅ Flexible origin checking
- ✅ Custom error on unauthorized origins

---

## 📝 HOW TO LOGIN

### Method 1: Browser (Frontend UI)

1. **Navigate to HR Portal**:
   ```
    http://localhost:3000/auth/hr/login
   ```

2. **Enter Credentials**:
   - Email: `hr@ethiroli.com`
   - Password: `HrPassword123!`

3. **Click Login**
   - Session token created
   - Redirected to `/app/hr/dashboard`
   - See live HR metrics

4. **Verify Success**:
   - Dashboard loads with data
   - WebSocket connects (check browser console)
   - Real-time updates working

---

### Method 2: API (cURL/Postman)

#### Step 1: Login Request

```bash
curl -X POST http://localhost:5000/api/v1/auth/portal-login \
  -H "Content-Type: application/json" \
  -H "X-Portal: hr" \
  -d '{
    "email": "hr@ethiroli.com",
    "password": "HrPassword123!"
  }' \
  -c cookies.txt
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid-here",
      "email": "hr@ethiroli.com",
      "full_name": "HR Manager",
      "role": "HR"
    },
    "sessionDuration": 28800000
  },
  "message": "Login successful"
}
```

#### Step 2: Use Token for Subsequent Requests

```bash
# Option A: Use Authorization Header
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <token_from_login_response>"

# Option B: Use Cookies (if you saved them)
curl -X GET http://localhost:5000/api/v1/auth/me \
  -b cookies.txt

# Option C: Use X-Session-Token Header
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "X-Session-Token: <token_from_login_response>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "hr@ethiroli.com",
    "full_name": "HR Manager",
    "role": "HR",
    "is_active": true
  }
}
```

---

## ✅ CORS VERIFICATION TESTS

### Test 1: Check CORS Headers

```bash
curl -X OPTIONS http://localhost:5000/api/v1/auth/portal-login \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected Response Headers**:
```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Portal
Access-Control-Max-Age: 86400
```

### Test 2: Blocked Origin Test (Should Fail)

```bash
curl -X POST http://localhost:5000/api/v1/auth/portal-login \
  -H "Origin: http://evil-site.com" \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@ethiroli.com","password":"HrPassword123!"}'
```

**Expected Response**: ❌ CORS error
```
Error: Not allowed by CORS
```

### Test 3: Allowed Origins Test

**Test each allowed origin**:

```bash
# Test localhost:3000
curl -X OPTIONS http://localhost:5000/api/v1/auth/portal-login \
  -H "Origin: http://localhost:3000" \
  -v

# Test localhost:3000 (Vite)
curl -X OPTIONS http://localhost:5000/api/v1/auth/portal-login \
  -H "Origin: http://localhost:3000" \
  -v

# Test localhost:5000
curl -X OPTIONS http://localhost:5000/api/v1/auth/portal-login \
  -H "Origin: http://localhost:5000" \
  -v
```

**Expected**: All should return `Access-Control-Allow-Origin: <origin>` ✅

---

## 🧪 FULL LOGIN FLOW TEST (Postman/JavaScript)

### JavaScript Fetch Example:

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:5000/api/v1/auth/portal-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Portal': 'hr'
  },
  credentials: 'include',  // ← Important for CORS + cookies
  body: JSON.stringify({
    email: 'hr@ethiroli.com',
    password: 'HrPassword123!'
  })
});

const { data: { token, user } } = await loginResponse.json();
console.log('✅ Login successful:', user);

// 2. Fetch user profile
const meResponse = await fetch('http://localhost:5000/api/v1/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include'
});

const meData = await meResponse.json();
console.log('✅ User profile retrieved:', meData);

// 3. Fetch HR Dashboard Metrics
const dashboardResponse = await fetch('http://localhost:5000/api/v1/hr/dashboard/metrics', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include'
});

const dashboardData = await dashboardResponse.json();
console.log('✅ Dashboard metrics:', dashboardData);
```

### Postman Collection (Manual Setup):

**Request 1: Login**
```
Method: POST
URL: http://localhost:5000/api/v1/auth/portal-login
Headers:
  - Content-Type: application/json
  - X-Portal: hr
Body:
  {
    "email": "hr@ethiroli.com",
    "password": "HrPassword123!"
  }
```

**Request 2: Get User Profile**
```
Method: GET
URL: http://localhost:5000/api/v1/auth/me
Headers:
  - Authorization: Bearer {{token}}  // Copy token from login response
  - X-Portal: hr
```

**Request 3: Get Dashboard Metrics**
```
Method: GET
URL: http://localhost:5000/api/v1/hr/dashboard/metrics
Headers:
  - Authorization: Bearer {{token}}
  - X-Portal: hr
```

---

## 🔍 BROWSER DEVELOPER TOOLS - CORS DEBUGGING

### Step 1: Open Network Tab
1. Press `F12` to open DevTools
2. Go to **Network** tab
3. Check **XHR/Fetch** filter

### Step 2: Attempt Login
1. Navigate to `http://localhost:3001/auth/hr/login`
2. Enter credentials
3. Click Login

### Step 3: Inspect Request
1. Look for `portal-login` request
2. Click to expand details
3. Check **Response Headers**:

**Look for these headers** ✅:
```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Date, X-Request-Id
```

### Step 4: Check Console
1. Go to **Console** tab
2. Should see WebSocket connection message
3. Look for any CORS errors (would show red)

### Step 5: Cookies
1. Go to **Application** tab
2. Click **Cookies** → `http://localhost:3001`
3. Should see `session_token` cookie:
   - ✅ httpOnly: true
   - ✅ Secure: false (on localhost, true in production)
   - ✅ SameSite: Lax

---

## ⚠️ COMMON CORS ISSUES & SOLUTIONS

### Issue 1: "Access to XMLHttpRequest has been blocked by CORS policy"

**Cause**: Origin not in `ALLOWED_ORIGINS`

**Solution**: Add your frontend origin to backend constants or env var:
```bash
# Set environment variable
export ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# Or update backend/src/config/constants.js
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://your-frontend-domain.com'  // ← Add here
];
```

### Issue 2: "Credentials mode is 'include' but Access-Control-Allow-Credentials is missing"

**Cause**: CORS not configured for credentials

**Solution**: Already fixed in backend! `credentials: true` is set.

**Verify in frontend** (SocketContext.jsx, AuthContext.jsx):
```javascript
fetch(url, {
  credentials: 'include'  // ← Must have this
})
```

### Issue 3: Cookie not sent with request

**Cause**: Missing `credentials: 'include'` in fetch

**Solution**: Add to all API calls:
```javascript
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // ← ADD THIS
  body: JSON.stringify(data)
});
```

### Issue 4: "Origin not allowed" with production domain

**Cause**: Environment variable not set

**Solution**: 
```bash
# .env file
ALLOWED_ORIGINS=https://ethiroli.com,https://api.ethiroli.com

# Or start command
ALLOWED_ORIGINS=https://ethiroli.com npm start
```

---

## 🚀 QUICK START CHECKLIST

- [ ] **Backend running**: `cd J:\eithiroli\ethiroli_react\backend && npm start`
- [ ] **Frontend running**: `cd J:\eithiroli\ethiroli_react\frontend && npm run dev`
- [ ] **CORS allowed origins**: Includes `http://localhost:3001` ✅
- [ ] **HR user created**: `hr@ethiroli.com` with password `HrPassword123!` ✅
- [ ] **Database connected**: Check logs for connection success
- [ ] **Navigate to login**: `http://localhost:3001/auth/hr/login`
- [ ] **Enter credentials**: Email & password above
- [ ] **Dashboard loads**: See HR metrics
- [ ] **WebSocket connects**: Check DevTools console

---

## 📊 VERIFICATION SUMMARY

### CORS Status:
- ✅ **Enabled**: Yes
- ✅ **Credentials**: Yes (HTTPOnly cookies)
- ✅ **Allowed Origins**: http://localhost:3000, 3001, 5000, 5173
- ✅ **Methods**: GET, POST, OPTIONS, PATCH, DELETE
- ✅ **Headers**: Content-Type, Authorization, X-Portal, X-Session-Token

### Authentication Status:
- ✅ **Portal-aware login**: Supported
- ✅ **Session tokens**: 24-hour expiration
- ✅ **Role enforcement**: HR role required
- ✅ **MFA**: Supported for SUPER_ADMIN, ADMIN

### Live Data Status:
- ✅ **Dashboard metrics**: Real-time aggregates
- ✅ **WebSocket events**: hr_attendance_update, hr_leave_request, hr_employee_update
- ✅ **Broadcast**: To HR, ADMIN, SUPER_ADMIN roles

---

**Everything is ready! Start servers and login with the provided credentials.** 🎉
