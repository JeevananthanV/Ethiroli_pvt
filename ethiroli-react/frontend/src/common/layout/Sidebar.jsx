import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getNavigationForRole } from './navigationConfig';

export default function Sidebar({ role, navItems }) {
  const { user } = useAuth();
  const location = useLocation();
  const navData = navItems || getNavigationForRole(role || user?.role);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: '260px', minHeight: '100vh' }}>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">{String(role || user?.role || 'ETHIROLI').toUpperCase()}</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        {navData.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link text-white text-decoration-none ${isActive(item.path) ? 'active' : ''}`}
              style={isActive(item.path) ? { backgroundColor: 'rgba(255,255,255,0.2)' } : {}}
            >
              {item.icon && <i className={`bi bi-${item.icon} me-2`}></i>}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}