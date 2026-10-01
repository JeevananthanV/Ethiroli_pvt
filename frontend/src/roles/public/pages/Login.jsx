import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import { ROLES, getRoleDefaultPath } from '../../../common/utils/roleRouting.js';
import StudentLoginPage from '../../../auth/portals/pages/StudentLoginPage.jsx';
import TutorLoginPage from '../../../auth/portals/pages/TutorLoginPage.jsx';
import InternLoginPage from '../../../auth/portals/pages/InternLoginPage.jsx';

const ROLE_PORTAL_MAP = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  HR: 'hr',
  TUTOR: 'tutor',
  PROJECT_MANAGER: 'pm',
  FINANCE: 'finance',
  SALES: 'sales',
  RECEPTION: 'reception',
  EMPLOYEE: 'employee',
  STUDENT: 'student',
  INTERN: 'intern'
};

function LoginPage() {
  const { role: roleParam } = useParams();

  // Route to dedicated role-tailored login portals
  if (roleParam === 'student') {
    return <StudentLoginPage />;
  }
  if (roleParam === 'tutor') {
    return <TutorLoginPage />;
  }
  if (roleParam === 'intern' || roleParam === 'ims') {
    return <InternLoginPage />;
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const portalLabel = roleParam === 'super-admin'
    ? 'Super Admin'
    : roleParam === 'pm'
    ? 'Project Manager'
    : roleParam
    ? roleParam.charAt(0).toUpperCase() + roleParam.slice(1)
    : 'Enterprise';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const roleKey = roleParam === 'super-admin' 
        ? 'SUPER_ADMIN' 
        : roleParam === 'pm' 
        ? 'PROJECT_MANAGER' 
        : roleParam?.toUpperCase();
      const portal = roleKey ? ROLE_PORTAL_MAP[roleKey] : null;
      const data = await login(email, password, portal);
      const actualRole = data?.user?.role || data?.data?.user?.role || roleKey;
      const defaultPath = getRoleDefaultPath(actualRole);
      navigate(defaultPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-4">
      <div className="container col-md-5 col-lg-4">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white text-center py-4">
            <h2 className="h4 mb-0">{portalLabel} Login</h2>
            <small className="opacity-75">Ethiroli System Portal</small>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@ethiroli.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
