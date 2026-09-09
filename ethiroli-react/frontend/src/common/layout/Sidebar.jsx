import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useAppSelector } from '../../store/hooks.js';
import { getNavigationForRole } from './navigationConfig.js';

export default function Sidebar() {
  const { user } = useAuth();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  if (!sidebarOpen) return null;

  const navItems = getNavigationForRole(user?.role);

  return (
    <aside className="sidebar">
      <div className="sidebarHeader">
        <h2>ETHIROLI</h2>
        {user?.role && (
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--color-primary, #819E35)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700
          }}>
            {user.role.replace('_', ' ')}
          </span>
        )}
      </div>
      <nav className="sidebarNav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'activeLink' : 'link')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            {item.icon && (
              <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}