import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useAppSelector } from '../../store/hooks.js';

export default function Sidebar() {
  const { user } = useAuth();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  if (!sidebarOpen) return null;

  const renderLinks = () => {
    const role = user?.role;
    if (['SUPER_ADMIN', 'ADMIN'].includes(role)) {
      return (
        <>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
            Dashboard
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
            Users
          </NavLink>
          <NavLink to="/leads" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
            Leads (CRM)
          </NavLink>
          <NavLink to="/audit-logs" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
            Audit Logs
          </NavLink>
          {role === 'SUPER_ADMIN' && (
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
              Settings
            </NavLink>
          )}
        </>
      );
    } else if (role === 'SALES') {
      return (
        <>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
            Dashboard
          </NavLink>
          <NavLink to="/leads" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
            My Leads
          </NavLink>
          <NavLink to="/follow-ups" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
            Follow Ups
          </NavLink>
        </>
      );
    } else {
      return (
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'activeLink' : 'link'}>
          Dashboard
        </NavLink>
      );
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebarHeader">
        <h2>ETHIROLI</h2>
      </div>
      <nav className="sidebarNav">
        {renderLinks()}
      </nav>
    </aside>
  );
}