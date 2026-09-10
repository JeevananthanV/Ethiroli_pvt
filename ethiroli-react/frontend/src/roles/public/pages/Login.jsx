import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../common/hooks/useAuth';
import { ROLES } from '../../common/utils/roleRouting';

const ROLE_PORTAL_MAP = {
  SUPER_ADMIN: 'admin',
  ADMIN: 'admin',
  HR: 'hr',
  TUTOR: 'tutor',
  PROJECT_MANAGER: 'pm',
  FINANCE: 'finance',
  SALES: 'sales',
  RECEPTION: 'reception',
  EMPLOYEE: 'employee',
  STUDENT: 'student',
  INTERN: 'intern',
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { role: roleParam } = useParams();

  const portalLabel = roleParam === 'super-admin'
    ? 'Super Admin'
    : roleParam === 'pm'
    ? 'Project Manager'
    : roleParam
    ? roleParam.charAt(0).toUpperCase() + roleParam.slice(1)
    : 'System';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const portal = ROLE_PORTAL_MAP[roleParam === 'super-admin' ? 'SUPER_ADMIN' : roleParam === 'pm' ? 'PROJECT_MANAGER' : roleParam?.toUpperCase()];
      await login(email, password, portal);
      const defaultPath = `/app/${roleParam}/dashboard`;
      navigate(defaultPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="container col-md-4 col-lg-3">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white text-center py-4">
            <h2 className="h4 mb-0">{portalLabel} Login</h2>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
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
