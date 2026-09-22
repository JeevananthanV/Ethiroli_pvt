import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROLES, ROLE_DEFAULT_ROUTES } from '../utils/roleRouting.js';
import { useAppDispatch } from '../../store/hooks.js';
import { toggleSidebar } from '../../store/slices/uiSlice.js';

export default function Navbar({ role, onSearchClick, onToggleFeed, unreadFeedCount = 0 }) {
  const { logout, user, activeRole, switchRole } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentRole = activeRole || role || user?.role;
  const isPrivileged = user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.ADMIN;

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    switchRole(selectedRole);
    const targetRoute = ROLE_DEFAULT_ROUTES[selectedRole] || '/app/super-admin/dashboard';
    navigate(targetRoute);
  };

  const userInitial = (user?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="portalNavbar" role="banner">
      <div className="portalNavbarBrand">
        <button 
          type="button" 
          className="portalSidebarToggle" 
          onClick={() => dispatch(toggleSidebar())} 
          title="Toggle Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          <i className="bi bi-list fs-5"></i>
        </button>

        <span className="portalBrandTitle">
          ETHIROLI
        </span>

        <span className="portalRoleBadge">
          {String(currentRole || 'PORTAL').replace(/_/g, ' ')}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isPrivileged && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }} className="d-none d-md-inline">
              Perspective:
            </span>
            <select
              className="portalRoleSelect"
              value={currentRole}
              onChange={handleRoleChange}
              aria-label="Switch Role Perspective"
            >
              <option value={ROLES.SUPER_ADMIN}>Super Admin (Platform)</option>
              <option value={ROLES.ADMIN}>Admin (Organization)</option>
              <option value={ROLES.HR}>HR Portal</option>
              <option value={ROLES.TUTOR}>LMS / Tutor</option>
              <option value={ROLES.PROJECT_MANAGER}>Project Manager</option>
              <option value={ROLES.FINANCE}>Finance Portal</option>
              <option value={ROLES.SALES}>Sales / CRM</option>
              <option value={ROLES.RECEPTION}>Reception Portal</option>
              <option value={ROLES.EMPLOYEE}>Employee Portal</option>
              <option value={ROLES.INTERN}>Intern Portal</option>
              <option value={ROLES.STUDENT}>Student Portal</option>
            </select>
          </div>
        )}

        <button 
          type="button" 
          className="portalSearchPill" 
          onClick={onSearchClick || (() => navigate(currentRole === ROLES.INTERN ? '/app/intern/tasks' : '#'))} 
          title="Global Search"
        >
          <i className="bi bi-search"></i>
          <span className="d-none d-sm-inline">Search...</span>
          <kbd className="d-none d-md-inline">Ctrl K</kbd>
        </button>

        {/* Notifications Icon */}
        <button
          type="button"
          className="portalNotificationBtn"
          onClick={onToggleFeed || (() => navigate(currentRole === ROLES.INTERN ? '/app/intern/notifications' : '#'))}
          title="Notifications"
          aria-label="View notifications"
        >
          <i className="bi bi-bell"></i>
          {unreadFeedCount > 0 && (
            <span className="portalNotificationBadge">
              {unreadFeedCount > 99 ? '99+' : unreadFeedCount}
            </span>
          )}
        </button>

        {/* Messages Icon */}
        <button
          type="button"
          className="portalNotificationBtn"
          onClick={() => navigate(currentRole === ROLES.INTERN ? '/app/intern/messages' : '#')}
          title="Messages"
          aria-label="View messages"
        >
          <i className="bi bi-chat-dots"></i>
        </button>

        {/* Help & Support Icon */}
        <button
          type="button"
          className="portalNotificationBtn"
          onClick={() => navigate(currentRole === ROLES.INTERN ? '/app/intern/help' : '#')}
          title="Help & Support"
          aria-label="Help & Support"
        >
          <i className="bi bi-question-circle"></i>
        </button>

        {user && (
          <div className="dropdown">
            <button
              type="button"
              className="portalUserPill btn p-0 border-0 d-flex align-items-center dropdown-toggle"
              id="userMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ background: 'transparent' }}
            >
              <div className="portalAvatar" title={user.email}>
                {userInitial}
              </div>
              <div className="d-none d-md-block text-start ms-2" style={{ lineHeight: '1.2' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {user.full_name || 'Portal User'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {String(currentRole || '').replace(/_/g, ' ')}
                </div>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userMenuButton" style={{ minWidth: '200px' }}>
              <li className="px-3 py-2 border-bottom">
                <div className="fw-bold text-truncate">{user.full_name || 'Portal User'}</div>
                <small className="text-muted text-truncate d-block">{user.email}</small>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => navigate(currentRole === ROLES.INTERN ? '/app/intern/profile' : '#')}>
                  <i className="bi bi-person-circle"></i> My Profile
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => navigate(currentRole === ROLES.INTERN ? '/app/intern/notifications' : '#')}>
                  <i className="bi bi-bell"></i> Notifications
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => navigate(currentRole === ROLES.INTERN ? '/app/intern/messages' : '#')}>
                  <i className="bi bi-chat-dots"></i> Messages
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => navigate(currentRole === ROLES.INTERN ? '/app/intern/help' : '#')}>
                  <i className="bi bi-question-circle"></i> Help & Support
                </button>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger" onClick={logout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}